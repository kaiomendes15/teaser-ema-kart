import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { EmaKartTeaser } from "../Composition";
import { Sponsors } from "../layers/Sponsors";
import { EmaKartShowcase } from "../showcase/Showcase";

// 60 FPS edit: story → sponsors → shortened teaser → full showcase.
// The final 0.3 s of sponsor black is covered by the teaser's entrance.
export const EmaKartTrailer = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence name="01 · História ilustrada" durationInFrames={510}>
      <StoryOpening />
    </Sequence>
    <Sequence name="02 · Patrocínios" from={486} durationInFrames={960}>
      <SponsorBridge />
    </Sequence>
    <Sequence
      name="03 · Banner, partida e ruptura"
      from={1428}
      trimBefore={225}
      durationInFrames={282}
    >
      <TeaserBridge />
    </Sequence>
    <Sequence
      name="04 · Respiro em preto e antecipação de Cars"
      from={1710}
      durationInFrames={120}
    >
      <AbsoluteFill style={{ backgroundColor: "#000" }} />
    </Sequence>
    <Sequence
      name="05 · Pilotos e gameplay"
      from={1830}
      durationInFrames={3663}
    >
      <ShowcaseBridge />
    </Sequence>
    <TrailerAudio />
  </AbsoluteFill>
);

const TeaserBridge = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <EmaKartTeaser
        openingMusic=""
        musicStartSeconds={0}
        soundEffectsVolume={0}
      />
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          pointerEvents: "none",
          opacity: interpolate(frame, [225, 285, 482, 506], [1, 0, 0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          }),
        }}
      />
    </>
  );
};

const ShowcaseBridge = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 24], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        }),
      }}
    >
      <EmaKartShowcase
        openingAudio=""
        openingAudioStartSeconds={0}
        showcaseMusic=""
        showcaseMusicStartSeconds={0}
        showTitles
        openingFade={false}
      />
    </AbsoluteFill>
  );
};

const StoryOpening = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 24, 450, 509], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        }),
      }}
    >
      <Video
        name="Livro, lendas e largada · animação original"
        src={staticFile("showcase-scenes/animacao-emakart.mp4")}
        durationInFrames={Math.round(8.5 * fps)}
        objectFit="contain"
        style={{ width: "100%", height: "100%" }}
        muted
      />
    </AbsoluteFill>
  );
};

const SponsorBridge = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 24], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        }),
      }}
    >
      <Sponsors />
    </AbsoluteFill>
  );
};

// Audio stays on the master clock so scene trims cannot cut off its tails.
const TrailerAudio = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <Audio
        name="História · áudio original continua sob os patrocínios"
        src={staticFile("showcase-scenes/animacao-emakart.mp4")}
        durationInFrames={Math.round(9.9 * fps)}
        volume={interpolate(frame, [0, 24, 420, 593], [0, 0.65, 0.65, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        })}
      />
      <Audio
        name="GTA VI · entrada baixa e crescimento até o banner"
        src={staticFile("audio/audio-gta.mp3")}
        from={420}
        durationInFrames={1350}
        volume={interpolate(
          frame,
          [420, 540, 1512, 1632, 1674, 1769],
          [0, 0.02, 0.24, 0.12, 0.12, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          },
        )}
      />
      <Audio
        name="Motor · antecipação sob a saída da última logo"
        src={staticFile("audio/teaser-engine.wav")}
        from={1398}
        trimBefore={Math.round(0.1 * fps)}
        durationInFrames={150}
        volume={interpolate(
          frame,
          [1398, 1458, 1506, 1547],
          [0, 0.08, 0.08, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          },
        )}
      />
      <Audio
        name="Partida · entrada gradual"
        src={staticFile("audio/teaser-startup.wav")}
        from={1524}
        durationInFrames={66}
        volume={interpolate(
          frame,
          [1524, 1536, 1566, 1589],
          [0, 0.55, 0.55, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          },
        )}
      />
      <Audio
        name="Motor · aceleração com saída progressiva"
        src={staticFile("audio/teaser-engine.wav")}
        from={1524}
        durationInFrames={186}
        volume={interpolate(
          frame,
          [1524, 1560, 1674, 1709],
          [0, 0.55, 0.55, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          },
        )}
      />
      <Audio
        name="Vento · aproximação suavizada"
        src={staticFile("audio/teaser-wind.wav")}
        from={1539}
        durationInFrames={171}
        volume={interpolate(frame, [1539, 1590, 1674, 1709], [0, 0.3, 0.3, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        })}
      />
      <Audio
        name="Ruptura · impacto integrado à música"
        src={staticFile("audio/teaser-impact.wav")}
        from={1632}
        durationInFrames={48}
        volume={interpolate(frame, [1632, 1638, 1662, 1679], [0, 0.5, 0.5, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        })}
      />
      <Audio
        name="Rasgo · saída sobre a aproximação"
        src={staticFile("audio/teaser-tear.wav")}
        from={1632}
        durationInFrames={78}
        volume={interpolate(
          frame,
          [1632, 1641, 1674, 1709],
          [0, 0.45, 0.3, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          },
        )}
      />
      <Audio
        name="Motor · cauda durante o escurecimento"
        src={staticFile("audio/teaser-engine.wav")}
        from={1692}
        trimBefore={Math.round(2 * fps)}
        durationInFrames={66}
        volume={interpolate(frame, [1692, 1710, 1757], [0, 0.25, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        })}
      />
      <Audio
        name="Cars · antecipação discreta durante o preto"
        src={staticFile("audio/Cars - Tuner Scene but in 4K.mp3")}
        from={1710}
        durationInFrames={168}
        volume={interpolate(
          frame,
          [1710, 1800, 1830, 1877],
          [0, 0.18, 0.18, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          },
        )}
      />
      <Audio
        name="Cars · entrada de 1,5 s sob a música anterior"
        src={staticFile("audio/Cars - Tuner Scene but in 4K.mp3")}
        from={1830}
        durationInFrames={1580}
        volume={interpolate(frame, [1830, 1920, 3109, 3409], [0, 0.9, 0.9, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        })}
      />
      <Audio
        name="Cloudtop Cruise · entrada discreta e crescimento de 7 s"
        src={staticFile(
          "audio/sountrack/U Cloudtop Cruise (Thundercloud, Frontrunning) - Mario Kart 8 Deluxe OST.mp3",
        )}
        from={3109}
        trimBefore={Math.round(41.983333333333334 * fps)}
        durationInFrames={2384}
        volume={interpolate(
          frame,
          [3109, 3199, 3409, 3529, 5403, 5492],
          [0, 0.025, 0.24, 0.32, 0.32, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          },
        )}
      />
    </>
  );
};
