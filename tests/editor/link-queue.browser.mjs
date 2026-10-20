// Run against an existing dev server: EDITOR_TEST_URL=http://localhost:4321 node tests/editor/link-queue.browser.mjs
import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';

const origin = process.env.EDITOR_TEST_URL ?? 'http://localhost:4321';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const requests = [];
  await page.route('**/queue-old?**', (route) => {
    requests.push(new URL(route.request().url()).searchParams.get('url'));
    // Keep the original requests pending until preview disposal aborts the browser fetch.
  });
  await page.route('**/queue-new?**', (route) => {
    requests.push(new URL(route.request().url()).searchParams.get('url'));
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"title":"New preview is ready"}' });
  });
  await page.goto(new URL('/editor', origin).href);
  await page.locator('.cm-content').waitFor();
  const preview = page.frameLocator('iframe[title="实际博文实时预览"]');
  await preview.locator('.custom-content').waitFor();
  const send = (source, ogEndpoint) =>
    page.evaluate(
      (message) => {
        document
          .querySelector('iframe[title="实际博文实时预览"]')
          .contentWindow.postMessage({ type: 'koharu-preview-source', mode: 'body', ...message }, location.origin);
      },
      { source, ogEndpoint },
    );
  await send(Array.from({ length: 9 }, (_, i) => `https://example.com/old-${i}`).join('\n\n'), '/queue-old');
  await expect.poll(() => requests.length).toBe(3);
  await send('https://example.com/new', '/queue-new');
  await expect(preview.getByRole('link', { name: 'New preview is ready' })).toBeVisible({ timeout: 3000 });
  assert.deepEqual(requests, [
    'https://example.com/old-0',
    'https://example.com/old-1',
    'https://example.com/old-2',
    'https://example.com/new',
  ]);
  console.log('PASS: replacing nine pending links cancels the old queue and immediately loads the new instance');
} finally {
  await browser.close();
}
