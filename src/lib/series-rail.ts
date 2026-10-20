/**
 * Pure math for the series progress rail (SeriesProgress.astro): a magnification wave that follows the
 * pointer along the ticks, and the tick nearest to a pointer position.
 */

/** Spread (px) of the wave around the pointer; ticks further than ~3σ stay at rest. */
export const RAIL_WAVE_SIGMA = 14;
/** Extra height at the crest: the tick under the pointer grows to 1 + amplitude. */
export const RAIL_WAVE_AMPLITUDE = 1.6;

/** Gaussian falloff of the wave for a tick `distance` px from the pointer. */
export function railWaveScale(distance: number, sigma = RAIL_WAVE_SIGMA, amplitude = RAIL_WAVE_AMPLITUDE): number {
  return 1 + amplitude * Math.exp(-(distance * distance) / (2 * sigma * sigma));
}

/** Index of the tick centre closest to `x`, or -1 for an empty rail. */
export function nearestTick(centers: readonly number[], x: number): number {
  let best = -1;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let i = 0; i < centers.length; i++) {
    const distance = Math.abs(centers[i] - x);
    if (distance < bestDistance) {
      best = i;
      bestDistance = distance;
    }
  }
  return best;
}

/** First index of a window of at most `max` items that keeps `current` as central as the ends allow. */
export function railWindowStart(current: number, total: number, max: number): number {
  if (total <= max) return 0;
  return Math.max(0, Math.min(current - Math.floor(max / 2), total - max));
}
