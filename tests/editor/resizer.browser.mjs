// Uses an existing server; verifies resizing through pointer and keyboard actions without writing blog files.
// EDITOR_TEST_URL=http://localhost:4321 EDITOR_TEST_BROWSER=webkit node tests/editor/resizer.browser.mjs
import assert from 'node:assert/strict';
import { chromium, expect, webkit } from '@playwright/test';

const origin = new URL(process.env.EDITOR_TEST_URL ?? 'http://localhost:4321');
const browserName = process.env.EDITOR_TEST_BROWSER ?? 'chromium';
assert.ok(['chromium', 'webkit'].includes(browserName));
const browser = await { chromium, webkit }[browserName].launch();
const errors = [];

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(new URL('/editor', origin).href, { waitUntil: 'domcontentloaded' });
  await page.locator('.cm-content').waitFor();
  const slider = page.getByRole('slider', { name: '调整源码与预览宽度', exact: true });
  const panes = page.locator('.editor-panes');
  const source = page.getByRole('region', { name: '源码编辑区', exact: true });
  const width = async () => (await source.boundingBox()).width;
  const drag = async (dx, dy = 0) => {
    const bounds = await slider.boundingBox();
    const x = bounds.x + bounds.width / 2;
    const y = bounds.y + bounds.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + dx, y + dy, { steps: 12 });
    await page.mouse.up();
  };

  const initial = await width();
  await drag(180);
  await expect.poll(width, { message: 'Dragging right widens the source pane' }).toBeGreaterThan(initial + 140);
  const wider = await width();
  await drag(-180);
  await expect.poll(width, { message: 'Dragging left narrows the source pane' }).toBeLessThan(wider - 140);

  const beforeVertical = await width();
  await drag(0, 160);
  assert.ok(Math.abs((await width()) - beforeVertical) <= 2, 'Vertical movement must not change pane width');

  await drag(-1200);
  const minimum = await width();
  const total = (await panes.boundingBox()).width;
  assert.ok(Math.abs(minimum / total - 0.28) < 0.01, 'Dragging past the left edge keeps 28% minimum source width');
  await drag(1200);
  const maximum = await width();
  assert.ok(Math.abs(maximum / total - 0.72) < 0.01, 'Dragging past the right edge keeps 72% maximum source width');

  await slider.focus();
  await slider.press('Home');
  await expect.poll(width).toBeCloseTo(minimum, 0);
  await slider.press('ArrowRight');
  await expect.poll(width, { message: 'ArrowRight widens the source pane' }).toBeGreaterThan(minimum + 1);
  await slider.press('ArrowLeft');
  await expect.poll(width).toBeCloseTo(minimum, 0);
  await slider.press('End');
  await expect.poll(width).toBeCloseTo(maximum, 0);
  await slider.press('ArrowLeft');
  await expect.poll(width, { message: 'ArrowLeft narrows the source pane' }).toBeLessThan(maximum - 1);
  await slider.press('ArrowRight');
  await expect.poll(width).toBeCloseTo(maximum, 0);
  await expect(slider).toBeFocused();
  assert.deepEqual(errors, [], 'No uncaught browser errors');
  console.log(`PASS ${browserName}: horizontal resizing, vertical stability, bounds, and keyboard resizing`);
} finally {
  await browser.close();
}
