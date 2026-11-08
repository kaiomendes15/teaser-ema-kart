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
import { BannerLayer, DebrisLayer, KartLayer } from "./layers/MotionScene";

export type TeaserProps = {
  openingMusic: string;
  musicStartSeconds: number;
};

export const EmaKartTeaser = ({
  openingMusic,
  musicStartSeconds,
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
      {openingMusic ? (
        <OpeningMusic
          openingMusic={openingMusic}
          musicStartSeconds={musicStartSeconds}
        />
      ) : null}
      <Audio
        name="Kart • partida forte, ignição e primeira acelerada"
        src={staticFile("audio/teaser-startup.wav")}
        from={TIMING.engine * fps}
        durationInFrames={1.1 * fps}
      />
      <Audio
        name="Kart • distante até máxima rotação"
        src={staticFile("audio/teaser-engine.wav")}
        from={TIMING.engine * fps}
        durationInFrames={Math.round((TIMING.black - TIMING.engine) * fps)}
      />
      <Audio
        name="Ar • aproximação estéreo"
        src={staticFile("audio/teaser-wind.wav")}
        from={TIMING.wind * fps}
        durationInFrames={Math.round((TIMING.black - TIMING.wind) * fps)}
      />
      <Audio
        name="Ruptura • impacto grave"
        src={staticFile("audio/teaser-impact.wav")}
        from={TIMING.rupture * fps}
        durationInFrames={0.8 * fps}
      />
      <Audio
        name="Lona • rasgo e fragmentos"
        src={staticFile("audio/teaser-tear.wav")}
        from={TIMING.rupture * fps}
        durationInFrames={1.5 * fps}
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
      name="GTA VI • início original e volume reduzido sob o motor"
      src={
        /^https?:/.test(openingMusic) ? openingMusic : staticFile(openingMusic)
      }
      trimBefore={Math.round(musicStartSeconds * fps)}
      from={TIMING.fadeStart * fps}
      durationInFrames={Math.round((TIMING.black - TIMING.fadeStart) * fps)}
      volume={interpolate(
        frame,
        [
          TIMING.fadeStart * fps,
          TIMING.revealed * fps,
          TIMING.engine * fps,
          TIMING.musicDuckEnd * fps,
        ],
        [0, 0.72, 0.72, 0.25],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.4, 0, 0.6, 1),
        },
      )}
    />
  );
};
