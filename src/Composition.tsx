import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { TIMING } from "./timeline";
import { Sponsors } from "./layers/Sponsors";
import {
  AccelerationLayer,
  BannerLayer,
  DebrisLayer,
  KartLayer,
} from "./layers/MotionScene";

export type TeaserProps = {
  openingMusic: string;
  musicStartSeconds: number;
  soundEffectsVolume?: number;
};

export const EmaKartTeaser = ({
  openingMusic,
  musicStartSeconds,
  soundEffectsVolume = 1,
}: TeaserProps) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Sequence
        name="Outdoor • revelação e rasgo"
        durationInFrames={TIMING.black * fps}
      >
        <BannerLayer />
      </Sequence>
      <Sequence
        name="Aceleração • fumaça traseira e rastros de velocidade"
        from={TIMING.rupture * fps}
        durationInFrames={Math.round((TIMING.black - TIMING.rupture) * fps)}
      >
        <AccelerationLayer />
      </Sequence>
      <Sequence
        name="Moema • ruptura e aproximação frontal"
        from={TIMING.rupture * fps}
        durationInFrames={Math.round((TIMING.black - TIMING.rupture) * fps)}
      >
        <KartLayer />
      </Sequence>
      <Sequence
        name="Lona • abas e fragmentos em profundidade"
        from={TIMING.rupture * fps}
        durationInFrames={Math.round((TIMING.black - TIMING.rupture) * fps)}
      >
        <DebrisLayer />
      </Sequence>
      <Sequence name="Preto absoluto e silêncio" from={TIMING.black * fps}>
        <AbsoluteFill style={{ backgroundColor: "#000" }} />
      </Sequence>
      <Sequence
        name="Patrocínios"
        from={TIMING.sponsors * fps}
        durationInFrames={Math.round((TIMING.duration - TIMING.sponsors) * fps)}
      >
        <Sponsors />
      </Sequence>
      {openingMusic ? (
        <OpeningMusic
          openingMusic={openingMusic}
          musicStartSeconds={musicStartSeconds}
        />
      ) : null}
      <Audio
        name="Kart • partida forte, ignição e primeira acelerada"
        src={staticFile("audio/teaser-startup.wav")}
        volume={soundEffectsVolume}
        from={TIMING.engine * fps}
        durationInFrames={1.1 * fps}
      />
      <Audio
        name="Kart • distante até máxima rotação"
        src={staticFile("audio/teaser-engine.wav")}
        volume={soundEffectsVolume}
        from={TIMING.engine * fps}
        durationInFrames={Math.round((TIMING.black - TIMING.engine) * fps)}
      />
      <Audio
        name="Ar • aproximação estéreo"
        src={staticFile("audio/teaser-wind.wav")}
        volume={soundEffectsVolume}
        from={TIMING.wind * fps}
        durationInFrames={Math.round((TIMING.black - TIMING.wind) * fps)}
      />
      <Audio
        name="Ruptura • impacto grave"
        src={staticFile("audio/teaser-impact.wav")}
        volume={soundEffectsVolume}
        from={TIMING.rupture * fps}
        durationInFrames={0.8 * fps}
      />
      <Audio
        name="Lona • rasgo e fragmentos"
        src={staticFile("audio/teaser-tear.wav")}
        volume={soundEffectsVolume}
        from={TIMING.rupture * fps}
        durationInFrames={Math.round(
          Math.min(1.5, TIMING.black - TIMING.rupture) * fps,
        )}
      />
    </AbsoluteFill>
  );
};

// Only the music track subscribes to the volume envelope's frame clock.
const OpeningMusic = ({ openingMusic, musicStartSeconds }: TeaserProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Audio
      name="GTA VI • entrada suave antes do banner e redução sob o motor"
      src={
        /^https?:/.test(openingMusic) ? openingMusic : staticFile(openingMusic)
      }
      trimBefore={Math.round(musicStartSeconds * fps)}
      from={TIMING.musicStart * fps}
      durationInFrames={Math.round((TIMING.black - TIMING.musicStart) * fps)}
      volume={interpolate(
        frame,
        [
          TIMING.musicStart * fps,
          TIMING.revealed * fps,
          TIMING.engine * fps,
          TIMING.musicDuckEnd * fps,
        ],
        [0.05, 0.72, 0.72, 0.25],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.4, 0, 0.6, 1),
        },
      )}
    />
  );
};
