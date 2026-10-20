/**
 * Transform math for the fullscreen zoom/pan viewers.
 * Content is centered in its viewport with `transform-origin: center`, so every point here is
 * measured from the viewport center and a transform is `translate(x, y) scale(scale)`.
 */

export interface ZoomPanTransform {
  scale: number;
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface PanBounds {
  x: number;
  y: number;
}

export const IDENTITY: ZoomPanTransform = { scale: 1, x: 0, y: 0 };

/** Scales by `factor` while keeping the content point under (`px`, `py`) fixed on screen. */
export function zoomAround(t: ZoomPanTransform, nextScale: number, px: number, py: number): ZoomPanTransform {
  const factor = nextScale / t.scale;
  return { scale: nextScale, x: px - (px - t.x) * factor, y: py - (py - t.y) * factor };
}

/**
 * How far the content may travel from center on each axis. Content larger than the viewport may
 * slide until its edge meets the viewport edge; smaller content may wander inside the viewport.
 */
export function getPanBounds(content: Size, viewport: Size, scale: number): PanBounds {
  return {
    x: Math.abs(content.width * scale - viewport.width) / 2,
    y: Math.abs(content.height * scale - viewport.height) / 2,
  };
}

/** iOS-style resistance: overshoot past `limit` shrinks the further it goes, never reaching `dimension`. */
export function rubberBand(value: number, limit: number, dimension: number): number {
  const over = Math.abs(value) - limit;
  if (over <= 0) return value;
  const damped = (1 - 1 / ((over * 0.55) / dimension + 1)) * dimension;
  return Math.sign(value) * (limit + damped);
}

export function clampToBounds(t: ZoomPanTransform, bounds: PanBounds): ZoomPanTransform {
  return {
    scale: t.scale,
    x: Math.min(bounds.x, Math.max(-bounds.x, t.x)),
    y: Math.min(bounds.y, Math.max(-bounds.y, t.y)),
  };
}

/**
 * Pinch deltas from a trackpad are small and frequent, ctrl+wheel notches large and rare; an
 * exponential map turns both into proportional zoom, and the clamp keeps one notch near ±40%.
 */
export function wheelZoomFactor(deltaY: number): number {
  return Math.exp(-Math.max(-50, Math.min(50, deltaY)) * 0.01);
}
