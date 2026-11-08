import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { KEYFRAMES, TIMING } from "./timeline";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const picture = (n: number) =>
  staticFile(`frames/frame${n === 14 ? "14final" : n}.png`);

// Full-frame reference photography remains the source of every character pose.
const ReferenceMotion = () => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const i = Math.max(
    0,
    KEYFRAMES.findIndex(
      (k, j) =>
        j < KEYFRAMES.length - 1 && t >= k.time && t < KEYFRAMES[j + 1].time,
    ),
  );
  const a = KEYFRAMES[i],
    b = KEYFRAMES[i + 1];
  const p = interpolate(t, [a.time, b.time], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  });
  const blend =
    a.image >= 9 ? interpolate(t, [b.time - 0.07, b.time], [0, 1], clamp) : p;
  const growth =
    a.image === 10 ? 1.75 : a.image === 11 ? 1.3 : a.image === 12 ? 1.15 : 1;
  const sourceScale = 1 + (growth - 1) * p;
  const zoom = interpolate(t, [0, 5, 6, 6.8, 7.2], [1, 1, 1.03, 1.12, 4.8], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const shake =
    t > 5 && t < 5.5 ? Math.sin(t * 117) * 6 * (1 - (t - 5) * 2) : 0;
  return (
    <AbsoluteFill
      style={{
        scale: zoom,
        transformOrigin: "52% 90%",
        translate: `${shake}px 0px`,
      }}
    >
      <CanvasImage
        src={picture(a.image)}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          scale: sourceScale,
          transformOrigin: "54% 78%",
        }}
      />
      <CanvasImage
        src={picture(b.image)}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          opacity: blend,
        }}
      />
      {/* Spatial shutter samples: subtle zoom trails, increasing toward impact. */}
      {[1, 2, 3].map((s) => (
        <CanvasImage
          key={s}
          src={picture(blend > 0.5 ? b.image : a.image)}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            scale: (blend > 0.5 ? 1 : sourceScale) + s * 0.009,
            opacity: t > 5 ? 0.025 * s : 0,
            filter: `blur(${s * 1.5}px)`,
            transformOrigin: "54% 78%",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const SpeedLines = () => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  return (
    <svg
      viewBox="0 0 1920 1080"
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        opacity: interpolate(t, [1.2, 3, 5, 7.2], [0, 0.12, 0.2, 0.4], clamp),
        maskImage:
          "radial-gradient(ellipse at 54% 68%, transparent 25%, black 72%)",
      }}
    >
      {Array.from({ length: 42 }, (_, i) => {
        const a = i * 2.399;
        const r = 250 + ((t * (190 + t * 65) + i * 77) % 1000);
        return (
          <line
            key={i}
            x1={1040 + Math.cos(a) * r}
            y1={730 + Math.sin(a) * r * 0.65}
            x2={1040 + Math.cos(a) * (r + 80 + t * 25)}
            y2={730 + Math.sin(a) * (r + 80 + t * 25) * 0.65}
            stroke={i % 3 ? "#ff36d9" : "#ffc14a"}
            strokeWidth={(i % 4) + 1}
          />
        );
      })}
    </svg>
  );
};
const Fragments = () => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  return (
    <AbsoluteFill>
      {Array.from({ length: 28 }, (_, i) => {
        const a = i * 2.399;
        const r = 80 + t * (350 + (i % 5) * 140);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 1040 + Math.cos(a) * r,
              top: 690 + Math.sin(a) * r * 0.65,
              width: 8 + (i % 4) * 7,
              height: 16 + (i % 3) * 11,
              background: i % 2 ? "#ffb526" : "#ff58e5",
              clipPath: "polygon(0 0,100% 24%,35% 100%)",
              rotate: `${i * 43 + t * 180}deg`,
              opacity: interpolate(
                t,
                [0, 0.06, 0.8, 1.2],
                [0, 1, 0.6, 0],
                clamp,
              ),
              filter: "drop-shadow(0 0 8px #ffb1ed)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
export const EmaKartTeaser = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Sequence
        name="Referências • aproximação 2.5D"
        durationInFrames={TIMING.black * fps}
      >
        <ReferenceMotion />
        <SpeedLines />
      </Sequence>
      <Sequence
        name="Ruptura • fragmentos luminosos"
        from={TIMING.rupture * fps}
        durationInFrames={1.2 * fps}
      >
        <Fragments />
      </Sequence>
      <Sequence name="Preto absoluto" from={TIMING.black * fps}>
        <AbsoluteFill style={{ background: "black" }} />
      </Sequence>
      <Sequence
        name="Motor • rotação e Doppler"
        durationInFrames={TIMING.black * fps}
      >
        <Audio src={staticFile("audio/engine.wav")} />
      </Sequence>
      <Sequence name="Vento crescente" durationInFrames={TIMING.black * fps}>
        <Audio src={staticFile("audio/wind.wav")} />
      </Sequence>
      <Sequence name="Estilhaços" from={TIMING.rupture * fps}>
        <Audio src={staticFile("audio/shards.wav")} />
      </Sequence>
      <Sequence
        name="Impacto • corte seco"
        from={TIMING.black * fps}
        durationInFrames={3}
      >
        <Audio src={staticFile("audio/impact.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
