import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CAMERA, COMIC_PAGE, PANELS } from "./comicTimeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const smooth = { ...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1) };
const Art = () => (
  <image href={staticFile(COMIC_PAGE)} width={1672} height={941} />
);

export const ComicPage = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const times = CAMERA.map((k) => k.time);
  const zoom = interpolate(
    t,
    times,
    CAMERA.map((k) => k.zoom),
    smooth,
  );
  const x = interpolate(
    t,
    times,
    CAMERA.map((k) => k.x),
    smooth,
  );
  const y = interpolate(
    t,
    times,
    CAMERA.map((k) => k.y),
    smooth,
  );
  const shock = t >= 7 && t < 10 ? Math.sin((t - 7) * 63) * 1.1 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <g
          transform={`translate(${960 - x * zoom + shock} ${540 - y * zoom + shock * 0.6}) scale(${zoom})`}
        >
          <defs>
            {PANELS.map((p) => (
              <clipPath key={p.id} id={`panel-${p.id}`}>
                <polygon points={p.polygon} />
              </clipPath>
            ))}
            <radialGradient id="eq-glow">
              <stop stopColor="#d2faff" stopOpacity=".6" />
              <stop offset=".45" stopColor="#38baff" stopOpacity=".22" />
              <stop offset="1" stopColor="#38baff" stopOpacity="0" />
            </radialGradient>
          </defs>
          {PANELS.map((panel, i) => {
            const age = t - panel.start;
            if (age < 0) return null;
            const reveal = interpolate(age, [0, 0.22], [0, 1], smooth);
            const [bx, by, bw, bh] = panel.box;
            return (
              <g key={panel.id} clipPath={`url(#panel-${panel.id})`}>
                <clipPath id={`wipe-${panel.id}`}>
                  <rect
                    x={bx - 4}
                    y={by - 4}
                    width={(bw + 8) * reveal}
                    height={bh + 8}
                  />
                </clipPath>
                <g
                  clipPath={`url(#wipe-${panel.id})`}
                  opacity={interpolate(age, [0, 0.1], [0, 1], clamp)}
                >
                  <PanelArt kind={i} age={age} />
                  <PanelEffects kind={i} age={age} />
                </g>
              </g>
            );
          })}
          {/* Original black ink boundaries remain visible throughout each reveal. */}
          {PANELS.filter((p) => t >= p.start).map((p) => (
            <polygon
              key={`ink-${p.id}`}
              points={p.polygon}
              fill="none"
              stroke="#070a11"
              strokeWidth={4.5}
              strokeLinejoin="round"
              opacity={interpolate(t - p.start, [0, 0.15], [0, 1], clamp)}
            />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const PanelEffects = ({ kind, age }: { kind: number; age: number }) => {
  const active = age < PANELS[kind].end - PANELS[kind].start;
  if (!active) return null;
  const envelope = interpolate(age, [0, 0.12, 0.6], [0, 1, 1], clamp);
  if (kind === 0) return null;
  if (kind === 1)
    return (
      <g>
        <ellipse
          cx={1451}
          cy={157}
          rx={100}
          ry={52}
          fill="url(#eq-glow)"
          opacity={envelope * (0.4 + 0.2 * Math.sin(age * 22))}
        />
        <path
          d="M1379 157L1392 146 1385 134 1400 127M1500 170L1512 152 1504 140 1520 127"
          stroke="#c5f7ff"
          fill="none"
          strokeWidth={1.3}
          opacity={Math.max(0, Math.sin(age * 28)) * 0.7}
        />
      </g>
    );
  if (kind === 2)
    return (
      <g>
        <ellipse
          cx={833}
          cy={374}
          rx={325}
          ry={99}
          fill="url(#eq-glow)"
          opacity={envelope * (0.65 + 0.2 * Math.sin(age * 36))}
        />
        {[0, 1, 2].map((i) => (
          <ellipse
            key={i}
            cx={835}
            cy={347}
            rx={170 + i * 53}
            ry={23 + i * 7}
            fill="none"
            stroke="#c2f8ff"
            strokeWidth={1.4}
            strokeDasharray="25 110 12 70"
            strokeDashoffset={-age * (140 + i * 50)}
            opacity={0.65 * envelope}
          />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <circle
            key={i}
            cx={680 + i * 28 + Math.sin(age * 4 + i) * 8}
            cy={431 - ((age * (48 + i * 4) + i * 11) % 125)}
            r={1.6}
            fill="#e2fbff"
            opacity={envelope * 0.65}
          />
        ))}
      </g>
    );
  if (kind === 3)
    return (
      <ellipse
        cx={392}
        cy={649}
        rx={243}
        ry={105}
        fill="url(#eq-glow)"
        opacity={(0.22 + Math.sin(age * 5) * 0.12) * envelope}
      />
    );
  if (kind === 4)
    return (
      <g>
        {[
          "M831 710Q797 663 729 650Q701 632 708 602",
          "M851 710Q896 674 975 660Q1009 631 1001 586",
          "M824 710Q852 658 875 614Q910 562 963 500",
        ].map((d, i) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="#ecc77d"
            strokeWidth={0.9}
            strokeLinecap="round"
            strokeDasharray="420"
            strokeDashoffset={interpolate(
              age,
              [i * 0.14, 2.1],
              [420, 0],
              clamp,
            )}
            opacity={0.22 * envelope}
          />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <circle
            key={i}
            cx={730 + i * 26}
            cy={699 - ((age * (22 + i * 4) + i * 5) % 70)}
            r={1.2 + (i % 3) * 0.4}
            fill="#cba575"
            opacity={envelope * 0.6}
          />
        ))}
      </g>
    );
  if (kind === 5)
    return (
      <g>
        {[0, 1, 2, 3].map((i) => (
          <ellipse
            key={i}
            cx={1130}
            cy={575 + i * 24}
            rx={82 - i * 13}
            ry={14 - i}
            fill="none"
            stroke="#bfeeff"
            strokeWidth={1.3}
            strokeDasharray="45 16 14 19"
            strokeDashoffset={-age * 350}
            opacity={0.65 * envelope}
          />
        ))}
        {Array.from({ length: 8 }, (_, i) => {
          const a = age * 9 + i * 2.4;
          const x = 1130 + Math.cos(a) * (70 + i * 5);
          const y = 610 + Math.sin(a) * 32 - ((age * 40) % 85);
          return (
            <path
              key={i}
              d={`M${x} ${y}l4 -2 3 4 -5 2Z`}
              fill={i % 2 ? "#daca9d" : "#f4e8ca"}
              stroke="#514635"
              strokeWidth={0.5}
              opacity={0.7 * envelope}
            />
          );
        })}
      </g>
    );
  if (kind === 6)
    return (
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${1250 - age * 45} ${692 - i * 10}Q1350 ${678 - i * 9} 1445 ${693 - i * 10}T1690 ${690 - i * 10}`}
            stroke="#d8f6ff"
            strokeWidth={1 + i * 0.1}
            fill="none"
            strokeDasharray="35 24 70 16"
            strokeDashoffset={-age * (120 + i * 15)}
            opacity={0.55 * envelope}
          />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <circle
            key={i}
            cx={1300 + i * 36}
            cy={691 - Math.sin(age * 6 + i) * 8 - age * 16}
            r={1.5}
            fill="#d9faff"
            opacity={0.6 * envelope}
          />
        ))}
      </g>
    );
  return (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <g
          key={i}
          opacity={interpolate(
            age,
            [0.2 + i * 0.14, 0.35 + i * 0.14, 0.65 + i * 0.14],
            [0, 0.65, 0],
            clamp,
          )}
        >
          <ellipse
            cx={629 + i * 151}
            cy={904}
            rx={66}
            ry={13}
            fill="url(#eq-glow)"
          />
        </g>
      ))}
    </g>
  );
};

// Move the complete panel image as one plane. Overscan keeps the original
// ink boundary covered; no displaced character or background fragments exist.
const PanelArt = ({ kind, age }: { kind: number; age: number }) => {
  const panel = PANELS[kind];
  const [x, y, w, h] = panel.box;
  const p = interpolate(age, [0, panel.end - panel.start], [0, 1], smooth);
  const scale = 1 + 0.012 * p;
  const dx = (kind % 2 ? -1 : 1) * 2 * p;
  return (
    <g
      transform={`translate(${x + w / 2 + dx} ${y + h / 2}) scale(${scale}) translate(${-x - w / 2} ${-y - h / 2})`}
    >
      <Art />
    </g>
  );
};
