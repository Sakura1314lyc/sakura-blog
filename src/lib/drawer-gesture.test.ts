import assert from 'node:assert/strict';
import test from 'node:test';
import { dragOffset, dragVelocity, resolveDragAxis, resolveDrawerRelease } from './drawer-gesture';

test('resolveDragAxis waits for the slop, then picks a clearly dominant axis', () => {
  assert.equal(resolveDragAxis(4, 3), null);
  assert.equal(resolveDragAxis(-20, 4), 'x');
  assert.equal(resolveDragAxis(12, 11), 'y');
  assert.equal(resolveDragAxis(2, -30), 'y');
});

test('dragOffset only moves toward closed and stops at the full width', () => {
  assert.equal(dragOffset(40, 300), 0);
  assert.equal(dragOffset(-120, 300), -120);
  assert.equal(dragOffset(-500, 300), -300);
});

test('dragVelocity reads the recent window only', () => {
  const samples = [
    { x: 0, t: 0 },
    { x: -2, t: 200 },
    { x: -42, t: 240 },
    { x: -82, t: 280 },
  ];
  assert.equal(dragVelocity(samples), -1);
  assert.equal(dragVelocity([{ x: 0, t: 0 }]), 0);
});

test('a slow drag closes past 40% of the width and snaps back before it', () => {
  assert.equal(resolveDrawerRelease(-100, 0, 300).close, false);
  assert.equal(resolveDrawerRelease(-130, 0, 300).close, true);
});

test('a flick decides regardless of distance', () => {
  assert.equal(resolveDrawerRelease(-30, -0.8, 300).close, true);
  assert.equal(resolveDrawerRelease(-200, 0.8, 300).close, false);
});

test('release duration follows the finger and stays within bounds', () => {
  const fast = resolveDrawerRelease(-60, -2, 300);
  const slow = resolveDrawerRelease(-60, -0.4, 300);
  assert.ok(fast.duration < slow.duration);
  assert.ok(fast.duration >= 180 && slow.duration <= 460);
});

test('a pause before lifting leaves no velocity', () => {
  const samples = [
    { x: 0, t: 0 },
    { x: -60, t: 40 },
    { x: -60, t: 240 },
  ];
  assert.equal(dragVelocity(samples), 0);
});
