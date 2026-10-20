interface Consumer<T> {
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
  signal: AbortSignal;
  abort: () => void;
}

interface RequestJob<T> {
  key: string;
  controller: AbortController;
  consumers: Set<Consumer<T>>;
}

interface RequestPoolOptions<T> {
  load: (key: string, signal: AbortSignal) => Promise<T>;
  maxConcurrent?: number;
  maxCacheEntries?: number;
  ttlMs?: number;
  now?: () => number;
}

/** Share network work while each preview owns only its subscription. */
export function createLinkRequestPool<T>({
  load,
  maxConcurrent = 3,
  maxCacheEntries = 100,
  ttlMs = 5 * 60_000,
  now = Date.now,
}: RequestPoolOptions<T>) {
  const cache = new Map<string, { value: T; expires: number }>();
  const jobs = new Map<string, RequestJob<T>>();
  const queue = new Set<RequestJob<T>>();
  let active = 0;
  let scheduled = false;

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    // A revision abort releases every subscriber synchronously. Drain only after all are removed.
    queueMicrotask(() => {
      scheduled = false;
      while (active < maxConcurrent && queue.size > 0) {
        const job = queue.values().next().value;
        if (!job) break;
        queue.delete(job);
        if (job.consumers.size === 0) continue;
        active += 1;
        void run(job);
      }
    });
  }

  async function run(job: RequestJob<T>) {
    try {
      const value = await load(job.key, job.controller.signal);
      if (job.controller.signal.aborted || job.consumers.size === 0) return;
      if (maxCacheEntries > 0) {
        while (cache.size >= maxCacheEntries) {
          const oldest = cache.keys().next().value;
          if (oldest === undefined) break;
          cache.delete(oldest);
        }
        cache.set(job.key, { value, expires: now() + ttlMs });
      }
      for (const consumer of job.consumers) consumer.resolve(value);
    } catch (error) {
      for (const consumer of job.consumers) consumer.reject(error);
    } finally {
      for (const consumer of job.consumers) consumer.signal.removeEventListener('abort', consumer.abort);
      job.consumers.clear();
      if (jobs.get(job.key) === job) jobs.delete(job.key);
      active -= 1;
      schedule();
    }
  }

  return function subscribe(key: string, signal: AbortSignal): Promise<T> {
    if (signal.aborted) return Promise.reject(signal.reason);
    const cached = cache.get(key);
    if (cached) {
      cache.delete(key);
      if (cached.expires > now()) {
        cache.set(key, cached);
        return Promise.resolve(cached.value);
      }
    }
    let job = jobs.get(key);
    if (!job) {
      job = { key, controller: new AbortController(), consumers: new Set() };
      jobs.set(key, job);
      queue.add(job);
    }
    const request = job;
    return new Promise<T>((resolve, reject) => {
      const consumer: Consumer<T> = {
        resolve,
        reject,
        signal,
        abort() {
          request.consumers.delete(consumer);
          signal.removeEventListener('abort', consumer.abort);
          reject(signal.reason);
          if (request.consumers.size > 0) return;
          if (jobs.get(key) === request) jobs.delete(key);
          queue.delete(request);
          request.controller.abort();
          schedule();
        },
      };
      request.consumers.add(consumer);
      signal.addEventListener('abort', consumer.abort, { once: true });
      schedule();
    });
  };
}
