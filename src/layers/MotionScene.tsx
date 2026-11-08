import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { ASSETS } from "../assets";
import { TIMING } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CX = 960;
const CY = 552;
const TAU = Math.PI * 2;
// Deterministic irregular tear in a physical sheet. No logo dissolve.
const rim = Array.from({ length: 240 }, (_, i) => {
  const angle = (i / 240) * TAU;
  const tooth =
    1 +
    Math.sin(angle * 5) * 0.06 +
    Math.cos(angle * 3) * 0.045 +
    Math.sin(i * 13.71) * 0.024 +
    Math.cos(i * 4.33) * 0.018;
  return { x: Math.cos(angle) * tooth, y: Math.sin(angle) * tooth };
});
const holeSize = (elapsed: number) => {
  const p = interpolate(elapsed, [0, 0.32, 0.65], [0.005, 1, 1.06], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return { x: 460 * p, y: 400 * p };
};
// The supplied torn artwork is revealed outward from the collision point.
// Complementary masks remove the intact art even where the torn PNG is transparent.
const tearRevealPath = (elapsed: number) => {
  const radius = interpolate(elapsed, [0, 0.3], [0, 1900], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    rim
      .map(
        (v, i) =>
          `${i ? "L" : "M"}${CX + v.x * radius},${CY + v.y * radius * 0.86}`,
      )
      .join(" ") + " Z"
  );
};

export const BannerLayer = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = frame / fps - TIMING.rupture;
  const reveal = tearRevealPath(Math.max(0, elapsed));
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(
          frame,
          [TIMING.fadeStart * fps, TIMING.revealed * fps],
          [0, 1],
          { ...clamp, easing: Easing.bezier(0.4, 0, 0.3, 1) },
        ),
      }}
    >
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <mask
            id="intact-banner"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1920"
            height="1080"
          >
            <rect width="1920" height="1080" fill="white" />
            {elapsed >= 0 ? <path d={reveal} fill="black" /> : null}
          </mask>
          <mask
            id="torn-banner"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1920"
            height="1080"
          >
            <path d={reveal} fill="white" />
          </mask>
        </defs>
        <image
          href={staticFile(ASSETS.banner)}
          width="1920"
          height="1080"
          preserveAspectRatio="xMidYMid slice"
          mask="url(#intact-banner)"
        />
        <image
          href={staticFile(ASSETS.tornBanner)}
          width="1920"
          height="1080"
          preserveAspectRatio="xMidYMid slice"
          mask="url(#torn-banner)"
        />
      </svg>
    </AbsoluteFill>
  );
};

// Inverse camera distance creates accelerating perspective. The original pose
// and emblem are preserved; no generated character or replacement logo.
const kartPose = (elapsed: number) => {
  const p = Math.max(0, Math.min(1, elapsed / (TIMING.black - TIMING.rupture)));
  const distance = 1 - 0.975 * Math.pow(p, 1.65);
  return {
    width: 900 / distance,
    emblemY: 700 - 160 * Math.pow(p, 1.8),
    shake: Math.sin(elapsed * 76) * 1.5 * Math.sin(p * Math.PI),
  };
};

const KartImage = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = Math.max(0, frame / fps);
  const pose = kartPose(elapsed);
  const r = holeSize(elapsed);
  const polygon = rim
    .map((v) => `${CX + v.x * r.x}px ${CY + v.y * r.y}px`)
    .join(",");
  return (
    <AbsoluteFill
      style={{
        clipPath: elapsed < 11 / fps ? `polygon(${polygon})` : undefined,
      }}
    >
      <CanvasImage
        src={staticFile(ASSETS.ema)}
        style={{
          position: "absolute",
          width: pose.width,
          height: pose.width * (1086 / 1448),
          left: CX - pose.width * (724 / 1448),
          top: pose.emblemY - pose.width * (830 / 1448) + pose.shake,
        }}
      />
    </AbsoluteFill>
  );
};

export const KartLayer = () => (
  <CameraMotionBlur shutterAngle={90} samples={3}>
    <KartImage />
  </CameraMotionBlur>
);

// Scraps carry the exact printed texture. CSS 3D adds foreshortening and depth.
export const DebrisLayer = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ perspective: 900, perspectiveOrigin: "50% 51.1%" }}>
      {Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * TAU;
        const startX = CX + Math.cos(angle) * (190 + (i % 3) * 34);
        const startY = CY + Math.sin(angle) * (145 + (i % 4) * 18);
        const width = 100 + (i % 4) * 37;
        const height = 85 + (i % 3) * 48;
        const p = Math.max(0, t - (i % 3) / fps);
        const travel = p * (480 + (i % 5) * 95) + p * p * 200;
        const z = Math.min(810, p * (420 + (i % 4) * 90));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: startX - width / 2,
              top: startY - height / 2,
              width,
              height,
              clipPath:
                "polygon(4% 8%, 41% 0%, 59% 9%, 98% 4%, 87% 48%, 100% 75%, 66% 100%, 45% 87%, 15% 98%, 0% 52%, 11% 32%)",
              borderBottom: "3px solid #ddccd1",
              transform: `translate3d(${Math.cos(angle) * travel}px, ${Math.sin(angle) * travel + p * p * 120}px, ${z}px) rotateX(${p * (120 + i * 9)}deg) rotateY(${p * (i % 2 ? -170 : 140)}deg) rotateZ(${p * (i % 2 ? -85 : 100)}deg)`,
              opacity: interpolate(
                t,
                [0, 0.025, 0.75, 1.1],
                [0, 1, 1, 0],
                clamp,
              ),
              filter: `brightness(${0.78 + 0.22 * Math.cos(p * 8 + i)}) blur(${Math.min(2, p * 1.8)}px)`,
            }}
          >
            <CanvasImage
              src={staticFile(ASSETS.banner)}
              style={{
                position: "absolute",
                width: 1920,
                height: 1080,
                left: -startX + width / 2,
                top: -startY + height / 2,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
