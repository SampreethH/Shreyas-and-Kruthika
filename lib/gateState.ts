/**
 * Mutable state shared between the DOM gesture layer and the R3F scene.
 * Plain object instead of React state so per-frame reads never re-render.
 */
export const gate = {
  /** 0 = sealed, 1 = doors fully open */
  progress: 0,
  /** 0..1 camera dolly through the doorway */
  push: 0,
  /** -1..1 cursor / gyroscope tilt */
  tiltX: 0,
  tiltY: 0,
};
