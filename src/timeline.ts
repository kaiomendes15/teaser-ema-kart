// Seconds, all aligned to whole frames at 60 fps.
export const TIMING = {
  musicStart: 2,
  fadeStart: 2.75,
  revealed: 5.15,
  engine: 5.35,
  musicDuckEnd: 6.6,
  wind: 5.6,
  rupture: 7.15,
  black: 8.45,
  sponsors: 10,
  duration: 26,
} as const;

// Each logo fades in, holds, fades out, then leaves 0.3 s of black.
export const SPONSOR_TIMING = {
  fadeIn: 0.8,
  fadeOutStart: 2.1,
  visibleEnd: 2.9,
  slot: 3.2,
} as const;
