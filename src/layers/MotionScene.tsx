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

// O banner é papel: estufa quando o kart empurra por trás, rasga a partir do centro em abas que dobram para a
// câmera (mostrando o verso branco) e solta tiras leves que tremulam e caem. Nada racha como vidro.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CX = 960;
const CY = 552;
const TAU = Math.PI * 2;
const DEG = 180 / Math.PI;
const PAPEL = "#f1ece2"; // miolo do papel na borda rasgada
const VERSO = "#e4ddcf"; // verso do banner
// O banner (1200 × 676) preenche 1920 × 1080 com "slice": escala 1,6, sobra meio pixel em cima e embaixo.
const IMG_W = 1920;
const IMG_H = 1082;
const IMG_TOP = -1;
// Meio-tamanho final do buraco.
const HX = 470;
const HY = 400;

// Pseudoaleatório determinístico.
const ruido = (i: number, j: number) => {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// Contorno irregular do rasgo: ondas largas (o papel cede em lóbulos) e dentes finos (fibras).
const N_RIM = 240;
const rim = Array.from({ length: N_RIM }, (_, i) => {
  const angle = (i / N_RIM) * TAU;
  const tooth =
    1 +
    Math.sin(angle * 5) * 0.06 +
    Math.cos(angle * 3) * 0.045 +
    Math.sin(i * 13.71) * 0.024 +
    Math.cos(i * 4.33) * 0.018 +
    (ruido(i, 7) - 0.5) * 0.03;
  return { x: Math.cos(angle) * tooth, y: Math.sin(angle) * tooth };
});
const rimPonto = (i: number, escala = 1) => ({
  x: CX + rim[i % N_RIM].x * HX * escala,
  y: CY + rim[i % N_RIM].y * HY * escala,
});
const caminho = (pts: { x: number; y: number }[]) =>
  pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";

const buraco = caminho(rim.map((_, i) => rimPonto(i)));
// Faixa de fibras brancas em volta do buraco (o miolo do papel aparece onde ele rasgou).
const fibras =
  caminho(
    rim.map((_, i) => rimPonto(i, 1.028 + (ruido(i, 3) - 0.5) * 0.03 + Math.max(0, Math.sin(i * 2.9)) * 0.022)),
  ) +
  " " +
  buraco;

// ---------------------------------------------------------------- banner, estufamento e buraco

export const BannerLayer = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const rasgou = t >= TIMING.rupture;
  const estufa = interpolate(t, [TIMING.bulge, TIMING.rupture], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  // Ao rasgar, a tensão solta: o papel volta para trás com um pequeno tranco.
  const solta = rasgou ? Math.exp(-(t - TIMING.rupture) * 9) * Math.cos((t - TIMING.rupture) * 40) : 0;
  const escala = 1 + 0.035 * (rasgou ? solta * 0.6 : estufa);
  const tremor = (estufa + Math.abs(solta)) * 3;
  const dx = (ruido(frame, 1) - 0.5) * tremor;
  const dy = (ruido(frame, 2) - 0.5) * tremor;
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [TIMING.fadeStart * fps, TIMING.revealed * fps], [0, 1], {
          ...clamp,
          easing: Easing.bezier(0.4, 0, 0.3, 1),
        }),
        transform: `translate(${dx}px, ${dy}px) scale(${escala})`,
        transformOrigin: `${CX}px ${CY}px`,
      }}
    >
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <mask id="papel-com-buraco" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">
            <rect width="1920" height="1080" fill="white" />
            {rasgou ? <path d={buraco} fill="black" /> : null}
          </mask>
          <radialGradient id="estufa-luz" cx={CX} cy={CY} r="520" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff6e6" stopOpacity={0.42 * estufa} />
            <stop offset="0.55" stopColor="#fff6e6" stopOpacity={0.1 * estufa} />
            <stop offset="0.8" stopColor="#000" stopOpacity={0.38 * estufa} />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sombra-buraco" cx={CX} cy={CY} r="640" gradientUnits="userSpaceOnUse">
            <stop offset="0.6" stopColor="#000" stopOpacity="0.55" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <image
          href={staticFile(ASSETS.banner)}
          width="1920"
          height="1080"
          preserveAspectRatio="xMidYMid slice"
          mask="url(#papel-com-buraco)"
        />
        {!rasgou && estufa > 0 ? (
          <>
            {/* Papel esticando: brilho no centro e sombra em anel, como um lençol empurrado por trás (sem vincos retos, que liam como trincas). */}
            <rect width="1920" height="1080" fill="url(#estufa-luz)" />
          </>
        ) : null}
        {rasgou ? (
          <>
            {/* Sombra do papel em volta do buraco e a borda branca de fibras. */}
            <path d={buraco} fill="url(#sombra-buraco)" opacity={0.6} />
            <path d={fibras} fill={PAPEL} fillRule="evenodd" />
          </>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- abas que dobram para a câmera

type Aba = {
  // referencial da dobradiça (corda entre as duas pontas da aba no contorno)
  mx: number;
  my: number;
  fi: number; // rotação do eixo x local, em radianos
  pontos: { x: number; y: number }[]; // polígono da aba no referencial local
  abertura: number; // ângulo final da dobra, em graus
  atraso: number; // segundos
};

const N_ABAS = 7;
const PONTA = { x: CX + 14, y: CY - 10 };
// Curva da dobra (graus), sem o atraso e o balanço de cada aba: usada também para recortar o kart pela abertura.
const dobra = (p: number, abertura: number) =>
  interpolate(p, [0, 0.05, 0.28], [0, 30, abertura], { ...clamp, easing: Easing.out(Easing.cubic) });
const ABAS: Aba[] = (() => {
  const limites = Array.from({ length: N_ABAS }, (_, k) =>
    Math.round(((k + (ruido(k, 11) - 0.5) * 0.45) / N_ABAS) * N_RIM + N_RIM) % N_RIM,
  ).sort((a, b) => a - b);
  return limites.map((i0, k) => {
    const i1 = k + 1 < N_ABAS ? limites[k + 1] : limites[0] + N_RIM;
    const a = rimPonto(i0);
    const b = rimPonto(i1);
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    // Eixo x local ao longo da dobradiça; o y local (x girado 90°, como o rotate do CSS) tem de apontar para o
    // centro do buraco, onde fica a ponta da aba. Se não aponta, inverte o sentido da dobradiça.
    let fi = Math.atan2(b.y - a.y, b.x - a.x);
    if ((CX - mx) * -Math.sin(fi) + (CY - my) * Math.cos(fi) < 0) fi += Math.PI;
    const ux = { x: Math.cos(fi), y: Math.sin(fi) };
    const uy = { x: -ux.y, y: ux.x };
    const local = (p: { x: number; y: number }) => ({
      x: (p.x - mx) * ux.x + (p.y - my) * ux.y,
      y: (p.x - mx) * uy.x + (p.y - my) * uy.y,
    });
    // ponta comum a todas as abas (o ponto do impacto), para elas fecharem o buraco sem frestas
    const ponta = PONTA;
    const pontos = [local(ponta)];
    for (let i = i0; i <= i1; i++) pontos.push(local(rimPonto(i)));
    return { mx, my, fi, pontos, abertura: 66 + ruido(k, 14) * 30, atraso: (k % 3) / 60 };
  });
})();

const poligono = (pts: { x: number; y: number }[], ox: number, oy: number) =>
  `polygon(${pts.map((p) => `${(p.x - ox).toFixed(1)}px ${(p.y - oy).toFixed(1)}px`).join(",")})`;

export const FlapsLayer = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = frame / fps; // a sequência começa no rasgo
  return (
    <AbsoluteFill style={{ perspective: 1100, perspectiveOrigin: `${CX}px ${CY}px` }}>
      {ABAS.map((aba, k) => {
        const p = Math.max(0, e - aba.atraso);
        // Dobra rápida para fora (o kart empurra), passa um pouco do ponto e balança até assentar.
        const base = dobra(p, aba.abertura);
        const balanco = p > 0.32 ? Math.sin((p - 0.32) * 17 + k) * 9 * Math.exp(-(p - 0.32) * 3.2) : 0;
        const angulo = base + balanco;
        const xs = aba.pontos.map((q) => q.x);
        const ys = aba.pontos.map((q) => q.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const frente = Math.cos((angulo * Math.PI) / 180);
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: aba.mx,
              top: aba.my,
              width: 0,
              height: 0,
              transform: `rotate(${aba.fi * DEG}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div style={{ position: "absolute", transform: `rotateX(${angulo}deg)`, transformStyle: "preserve-3d" }}>
              {/* frente: a própria impressão do banner */}
              <div
                style={{
                  position: "absolute",
                  left: minX,
                  top: minY,
                  width: maxX - minX,
                  height: maxY - minY,
                  overflow: "hidden",
                  clipPath: poligono(aba.pontos, minX, minY),
                  backfaceVisibility: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: -minX,
                    top: -minY,
                    width: 0,
                    height: 0,
                    transformOrigin: "0 0",
                    transform: `rotate(${-aba.fi * DEG}deg) translate(${-aba.mx}px, ${-aba.my}px)`,
                  }}
                >
                  <CanvasImage
                    src={staticFile(ASSETS.banner)}
                    style={{ position: "absolute", left: 0, top: IMG_TOP, width: IMG_W, height: IMG_H }}
                  />
                </div>
                {/* sombra da dobra: sem "filter", que achata o 3D e deixa o verso aparecer por cima */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to bottom, rgba(0,0,0,${0.12 + 0.3 * (1 - Math.max(0, frente))}), rgba(0,0,0,${0.3 + 0.35 * (1 - Math.max(0, frente))}))`,
                  }}
                />
              </div>
              {/* verso: papel liso, visível quando a aba passa de 90° */}
              <div
                style={{
                  position: "absolute",
                  left: -maxX,
                  top: minY,
                  width: maxX - minX,
                  height: maxY - minY,
                  background: `radial-gradient(circle at ${maxX}px 0px, #f6f1e6 0%, ${VERSO} 45%, #b9ae9a 100%)`,
                  clipPath: poligono(
                    aba.pontos.map((q) => ({ x: -q.x, y: q.y })),
                    -maxX,
                    minY,
                  ),
                  transformOrigin: `${maxX}px 0`,
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- kart atravessando

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
  // Enquanto as abas abrem, o kart só aparece pela abertura entre elas: a aba dobrada de um ângulo a cobre
  // cos(a) do raio, então a abertura vai do ponto do impacto até (1 - cos a) do contorno.
  const abre = 1 - Math.cos((dobra(elapsed, 80) * Math.PI) / 180);
  const polygon = rim
    .map((_, i) => rimPonto(i))
    .map((q) => `${PONTA.x + (q.x - PONTA.x) * abre}px ${PONTA.y + (q.y - PONTA.y) * abre}px`)
    .join(",");
  return (
    <AbsoluteFill style={{ clipPath: elapsed < 0.3 ? `polygon(${polygon})` : undefined }}>
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

// ---------------------------------------------------------------- tiras de papel que tremulam

const N_TIRAS = 26;
const TIRAS = Array.from({ length: N_TIRAS }, (_, i) => {
  const ang = (i / N_TIRAS) * TAU + (ruido(i, 21) - 0.5) * 0.4;
  const raio = 0.85 + ruido(i, 22) * 0.2;
  const w = 34 + ruido(i, 23) * 56;
  const h = 18 + ruido(i, 24) * 34;
  // contorno irregular (papel rasgado), centrado na tira
  const contorno = Array.from({ length: 9 }, (_, k) => {
    const a = (k / 9) * TAU;
    const r = 0.75 + ruido(i * 9 + k, 25) * 0.35;
    return { x: Math.cos(a) * (w / 2) * r, y: Math.sin(a) * (h / 2) * r };
  });
  return {
    ang,
    sx: CX + Math.cos(ang) * HX * raio,
    sy: CY + Math.sin(ang) * HY * raio,
    w,
    h,
    contorno,
    vel: 380 + ruido(i, 26) * 520,
    vz: 260 + ruido(i, 27) * 520,
    giro: (ruido(i, 28) - 0.5) * 260,
    flutua: 7 + ruido(i, 29) * 7,
    fase: ruido(i, 30) * TAU,
    atraso: (i % 4) / 60,
  };
});

export const DebrisLayer = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ perspective: 900, perspectiveOrigin: `${CX}px ${CY}px` }}>
      {TIRAS.map((tira, i) => {
        const p = Math.max(0, t - tira.atraso);
        if (p <= 0) return null;
        // Papel é leve: sai rápido e o ar freia (arrasto exponencial); depois cai devagar, balançando.
        const s = (1 - Math.exp(-p * 3.2)) / 3.2;
        const x = Math.cos(tira.ang) * tira.vel * s + Math.sin(p * 3 + tira.fase) * 22 * p;
        const y = Math.sin(tira.ang) * tira.vel * s + 90 * p * p;
        const z = tira.vz * s;
        const rotX = 70 * Math.sin(p * tira.flutua + tira.fase) + p * 90;
        const rotY = 50 * Math.cos(p * tira.flutua * 0.7 + tira.fase);
        const rotZ = tira.giro * s;
        const alfa = interpolate(p, [0, 0.03, 1.6, 2.2], [0, 1, 1, 0], clamp);
        const xs = tira.contorno.map((q) => q.x);
        const minX = Math.min(...xs);
        const larg = Math.max(...xs) - minX;
        const minY = Math.min(...tira.contorno.map((q) => q.y));
        const alt = Math.max(...tira.contorno.map((q) => q.y)) - minY;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: tira.sx,
              top: tira.sy,
              width: 0,
              height: 0,
              opacity: alfa,
              transformStyle: "preserve-3d",
              transform: `translate3d(${x}px, ${y}px, ${z}px) rotateZ(${rotZ}deg) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: minX,
                top: minY,
                width: larg,
                height: alt,
                overflow: "hidden",
                clipPath: poligono(tira.contorno, minX, minY),
                backfaceVisibility: "hidden",
              }}
            >
              <CanvasImage
                src={staticFile(ASSETS.banner)}
                style={{
                  position: "absolute",
                  left: -tira.sx - minX,
                  top: -tira.sy - minY + IMG_TOP,
                  width: IMG_W,
                  height: IMG_H,
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: minX,
                top: minY,
                width: larg,
                height: alt,
                background: VERSO,
                clipPath: poligono(
                  tira.contorno.map((q) => ({ x: -q.x, y: q.y })),
                  minX,
                  minY,
                ),
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
