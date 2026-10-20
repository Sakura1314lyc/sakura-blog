import assert from 'node:assert/strict';
import { getEventListeners } from 'node:events';
import test from 'node:test';
import { setImmediate } from 'node:timers/promises';
import { createLinkRequestPool } from './link-request-pool';

function fixture(maxConcurrent = 3) {
  const calls: { key: string; signal: AbortSignal; resolve: (value: string) => void; reject: (error: Error) => void }[] = [];
  const subscribe = createLinkRequestPool<string>({
    maxConcurrent,
    load: (key, signal) =>
      new Promise((resolve, reject) => {
        calls.push({ key, signal, resolve, reject });
        signal.addEventListener('abort', () => reject(signal.reason), { once: true });
      }),
  });
  return { calls, subscribe };
}

test('disposing nine old links aborts active work and removes queued work before starting the replacement', async () => {
  const { calls, subscribe } = fixture();
  const old = new AbortController();
  const results = Array.from({ length: 9 }, (_, i) => subscribe(`old-${i}`, old.signal).catch((error) => error));
  await setImmediate();
  assert.deepEqual(
    calls.map(({ key }) => key),
    ['old-0', 'old-1', 'old-2'],
  );
  old.abort();
  const next = new AbortController();
  const replacement = subscribe('new', next.signal);
  await setImmediate();
  assert.deepEqual(
    calls.map(({ key }) => key),
    ['old-0', 'old-1', 'old-2', 'new'],
  );
  assert.ok(calls.slice(0, 3).every(({ signal }) => signal.aborted));
  calls[3].resolve('fresh');
  assert.equal(await replacement, 'fresh');
  assert.ok((await Promise.all(results)).every((error) => error.name === 'AbortError'));
  assert.equal(getEventListeners(old.signal, 'abort').length, 0);
  assert.equal(getEventListeners(next.signal, 'abort').length, 0);
});

test('releasing one shared consumer preserves the other request and the successful cache', async () => {
  const { calls, subscribe } = fixture();
  const first = new AbortController();
  const second = new AbortController();
  const abandoned = subscribe('shared', first.signal).catch((error) => error);
  const remaining = subscribe('shared', second.signal);
  await setImmediate();
  first.abort();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].signal.aborted, false);
  calls[0].resolve('shared result');
  assert.equal(await remaining, 'shared result');
  assert.equal((await abandoned).name, 'AbortError');
  assert.equal(getEventListeners(second.signal, 'abort').length, 0);
  second.abort();
  assert.equal(calls[0].signal.aborted, false);
  assert.equal(await subscribe('shared', new AbortController().signal), 'shared result');
  assert.equal(calls.length, 1);
});

test('a queued shared request survives one consumer leaving without exceeding concurrency', async () => {
  const { calls, subscribe } = fixture(1);
  const holding = subscribe('holding', new AbortController().signal);
  const first = new AbortController();
  const abandoned = subscribe('queued', first.signal).catch((error) => error);
  const remaining = subscribe('queued', new AbortController().signal);
  await setImmediate();
  first.abort();
  await setImmediate();
  assert.equal(calls.length, 1);
  calls[0].resolve('done');
  await holding;
  await setImmediate();
  assert.deepEqual(
    calls.map(({ key }) => key),
    ['holding', 'queued'],
  );
  calls[1].resolve('queued result');
  assert.equal(await remaining, 'queued result');
  assert.equal((await abandoned).name, 'AbortError');
});

test('aborted and failed requests can retry immediately and do not remove replacement jobs', async () => {
  const { calls, subscribe } = fixture(1);
  const old = new AbortController();
  const abandoned = subscribe('same', old.signal).catch((error) => error);
  await setImmediate();
  old.abort();
  const retryScope = new AbortController();
  const retry = subscribe('same', retryScope.signal).catch((error) => error);
  await setImmediate();
  const joined = subscribe('same', new AbortController().signal).catch((error) => error);
  calls[1].reject(new Error('upstream failure'));
  assert.equal((await retry).message, 'upstream failure');
  assert.equal((await joined).message, 'upstream failure');
  assert.equal((await abandoned).name, 'AbortError');
  assert.equal(getEventListeners(retryScope.signal, 'abort').length, 0);
  const success = subscribe('same', new AbortController().signal);
  await setImmediate();
  assert.equal(calls.length, 3);
  calls[2].resolve('recovered');
  assert.equal(await success, 'recovered');
});

test('successful cache is bounded and expires; already aborted consumers never start requests', async () => {
  const calls: string[] = [];
  let now = 0;
  const subscribe = createLinkRequestPool({
    maxCacheEntries: 2,
    ttlMs: 100,
    now: () => now,
    async load(key) {
      calls.push(key);
      return key;
    },
  });
  const signal = new AbortController().signal;
  for (const key of ['a', 'b', 'a', 'c', 'a', 'b']) await subscribe(key, signal);
  assert.deepEqual(calls, ['a', 'b', 'c', 'b']);
  now = 100;
  await subscribe('b', signal);
  assert.deepEqual(calls, ['a', 'b', 'c', 'b', 'b']);
  const aborted = new AbortController();
  aborted.abort();
  await assert.rejects(subscribe('b', aborted.signal), { name: 'AbortError' });
  await assert.rejects(subscribe('never fetched', aborted.signal), { name: 'AbortError' });
  assert.equal(calls.length, 5);
  assert.equal(getEventListeners(signal, 'abort').length, 0);
});
