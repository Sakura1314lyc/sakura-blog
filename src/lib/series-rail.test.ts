import assert from 'node:assert/strict';
import test from 'node:test';
import { nearestTick, RAIL_WAVE_AMPLITUDE, railWaveScale, railWindowStart } from './series-rail';

test('the wave crests under the pointer and settles with distance', () => {
  assert.equal(railWaveScale(0), 1 + RAIL_WAVE_AMPLITUDE);
  assert.ok(railWaveScale(10) < railWaveScale(0));
  assert.ok(railWaveScale(20) < railWaveScale(10));
  assert.ok(railWaveScale(60) - 1 < 0.001);
  assert.equal(railWaveScale(-12), railWaveScale(12));
});

test('nearestTick picks the closest centre', () => {
  const centers = [10, 20, 30, 40];
  assert.equal(nearestTick(centers, 0), 0);
  assert.equal(nearestTick(centers, 24), 1);
  assert.equal(nearestTick(centers, 26), 2);
  assert.equal(nearestTick(centers, 99), 3);
  assert.equal(nearestTick([], 5), -1);
});

test('railWindowStart centres the current item and clamps at the ends', () => {
  assert.equal(railWindowStart(3, 8, 40), 0);
  assert.equal(railWindowStart(50, 100, 40), 30);
  assert.equal(railWindowStart(2, 100, 40), 0);
  assert.equal(railWindowStart(98, 100, 40), 60);
});
