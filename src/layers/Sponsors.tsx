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
import { SPONSOR_TIMING } from "../timeline";

const SponsorLogo = ({
  file,
  width,
  height,
}: {
  file: string;
  width: number;
  height: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <CanvasImage
        src={staticFile(`components/logos/patrocinios/${file}`)}
        style={{
          width,
          height,
          objectFit: "contain",
          opacity: interpolate(
            frame,
            [
              0,
              SPONSOR_TIMING.fadeIn * fps,
              SPONSOR_TIMING.fadeOutStart * fps,
              SPONSOR_TIMING.visibleEnd * fps,
            ],
            [0, 1, 1, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.4, 0, 0.6, 1),
            },
          ),
        }}
      />
    </AbsoluteFill>
  );
};

export const Sponsors = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence
        name="Patrocínio • Ancine"
        durationInFrames={SPONSOR_TIMING.slot * fps}
      >
        <SponsorLogo file="ancine.jpeg" width={560} height={420} />
      </Sequence>
      <Sequence
        name="Patrocínio • Caixa"
        from={SPONSOR_TIMING.slot * fps}
        durationInFrames={SPONSOR_TIMING.slot * fps}
      >
        <SponsorLogo file="caixa.png" width={720} height={720} />
      </Sequence>
      <Sequence
        name="Patrocínio • Missão"
        from={2 * SPONSOR_TIMING.slot * fps}
        durationInFrames={SPONSOR_TIMING.slot * fps}
      >
        {/* The supplied image has large black margins around the logo. */}
        <SponsorLogo
          file="38sqt4tk4aqua3qfc8pn2xzki.jpg"
          width={1920}
          height={1080}
        />
      </Sequence>
      <Sequence
        name="Patrocínio • Fortune Tiger"
        from={3 * SPONSOR_TIMING.slot * fps}
        durationInFrames={SPONSOR_TIMING.slot * fps}
      >
        <SponsorLogo
          file="f39ea6d08d36b897fd3a71398b7b9ee0.webp"
          width={640}
          height={400}
        />
      </Sequence>
      <Sequence
        name="Patrocínio • Gordão Motors"
        from={4 * SPONSOR_TIMING.slot * fps}
        durationInFrames={SPONSOR_TIMING.slot * fps}
      >
        <SponsorLogo
          file="Logo GORDÃO MOTORS em Silhueta.png"
          width={1080}
          height={420}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
