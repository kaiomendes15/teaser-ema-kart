// Seconds, all aligned to whole frames at 60 fps.
export const TIMING = {
  fadeStart: 0.75,
  // O kart entra longe, por baixo da música, e vem se aproximando.
  engine: 1.4,
  revealed: 3.15,
  wind: 3.6,
  musicDuckStart: 3.6,
  musicDuckEnd: 4.8,
  // O papel estufa: algo empurra o banner por trás.
  bulge: 4.95,
  rupture: 5.15,
  black: 7.5,
  duration: 8,
} as const;
