import assert from 'node:assert/strict';
import test from 'node:test';
import { clampToBounds, getPanBounds, IDENTITY, rubberBand, wheelZoomFactor, zoomAround } from './zoom-pan';

test('zoomAround keeps the point under the cursor fixed on screen', () => {
  const next = zoomAround({ scale: 1, x: 20, y: -10 }, 2, 100, 50);
  // The content point under (100, 50) was (100 - 20, 50 + 10) / 1; after zooming it must map back to (100, 50).
  assert.equal(80 * next.scale + next.x, 100);
  assert.equal(60 * next.scale + next.y, 50);
});

test('zoomAround at the center only changes scale', () => {
  assert.deepEqual(zoomAround(IDENTITY, 3, 0, 0), { scale: 3, x: 0, y: 0 });
});

test('getPanBounds lets oversized content slide edge to edge and small content wander inside', () => {
  const viewport = { width: 1000, height: 600 };
  assert.deepEqual(getPanBounds({ width: 800, height: 400 }, viewport, 2), { x: 300, y: 100 });
  assert.deepEqual(getPanBounds({ width: 800, height: 400 }, viewport, 1), { x: 100, y: 100 });
});

test('rubberBand passes values inside the limit and damps overshoot below the dimension', () => {
  assert.equal(rubberBand(50, 100, 1000), 50);
  const over = rubberBand(400, 100, 1000);
  assert.ok(over > 100 && over < 400);
  assert.equal(rubberBand(-400, 100, 1000), -over);
  assert.ok(rubberBand(1e9, 100, 1000) < 1100);
});

test('clampToBounds pins translation without touching scale', () => {
  assert.deepEqual(clampToBounds({ scale: 2, x: 500, y: -500 }, { x: 300, y: 100 }), { scale: 2, x: 300, y: -100 });
});

test('wheelZoomFactor is proportional for pinch deltas and capped for wheel notches', () => {
  assert.ok(Math.abs(wheelZoomFactor(-4) * wheelZoomFactor(4) - 1) < 1e-12);
  assert.ok(wheelZoomFactor(-4) > 1 && wheelZoomFactor(-4) < 1.05);
  assert.equal(wheelZoomFactor(-500), wheelZoomFactor(-50));
});
