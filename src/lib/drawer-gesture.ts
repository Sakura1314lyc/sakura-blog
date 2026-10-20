/**
 * Pure model for dragging the mobile drawer shut. The drawer controller feeds it pointer samples and
 * applies the results; nothing here touches the DOM.
 */

/** Movement (px) before a touch commits to an axis; below it a tap stays a tap. */
const DRAWER_DRAG_SLOP = 10;

/** Easing used after a release; its initial slope sets how a fast flick hands over to the animation. */
export const DRAWER_RELEASE_EASE = 'cubic-bezier(0.2, 0.7, 0.3, 1)';
const RELEASE_EASE_INITIAL_SLOPE = 0.7 / 0.2;

export interface DragSample {
  x: number;
  t: number;
}

export type DragAxis = 'x' | 'y' | null;

/** Horizontal wins only when clearly dominant, so diagonal scrolls of the drawer content still scroll. */
export function resolveDragAxis(dx: number, dy: number): DragAxis {
  const x = Math.abs(dx);
  const y = Math.abs(dy);
  if (Math.max(x, y) < DRAWER_DRAG_SLOP) return null;
  return x > y * 1.2 ? 'x' : 'y';
}

/** The drawer only travels toward closed; dragging past its open edge is ignored. */
export function dragOffset(dx: number, width: number): number {
  return Math.max(-width, Math.min(0, dx));
}

/** Velocity (px/ms) over the most recent ~80ms of samples; older samples describe a gesture already changed. */
export function dragVelocity(samples: readonly DragSample[], windowMs = 80): number {
  if (samples.length < 2) return 0;
  const last = samples[samples.length - 1];
  let first = samples[samples.length - 2];
  for (let i = samples.length - 2; i >= 0; i--) {
    if (last.t - samples[i].t > windowMs) break;
    first = samples[i];
  }
  const elapsed = last.t - first.t;
  return elapsed > 0 ? (last.x - first.x) / elapsed : 0;
}

export interface DrawerRelease {
  close: boolean;
  /** Duration (ms) of the settle animation, matched to the finger's speed at release. */
  duration: number;
}

export function resolveDrawerRelease(offset: number, velocity: number, width: number): DrawerRelease {
  const flungShut = velocity < -0.35;
  const flungOpen = velocity > 0.35;
  const close = flungShut || (!flungOpen && -offset > width * 0.4);
  const remaining = close ? width + offset : -offset;
  // Start the settle at the finger's speed: a curve covering `remaining` in `d` ms starts at slope × remaining / d.
  const speed = Math.max(Math.abs(velocity), 0.5);
  const duration = Math.round(Math.min(460, Math.max(180, (RELEASE_EASE_INITIAL_SLOPE * remaining) / speed)));
  return { close, duration };
}
