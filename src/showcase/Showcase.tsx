import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  Sequence,
  staticFile,
  Track,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SHOWCASE } from "./assets";

export type ShowcaseProps = {
  openingAudio: string;
  openingAudioStartSeconds: number;
  showcaseMusic: string;
  showcaseMusicStartSeconds: number;
  showTitles: boolean;
  openingFade?: boolean;
};

// 60 fps edit. Opening cuts follow measured transients of the supplied soundtrack.
// Each shot is an authored node so Studio can trim it independently.
export const EmaKartShowcase = (props: ShowcaseProps) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#080b0e", overflow: "hidden" }}>
      <Track name="Showcase · montagem">
        <Video
          name="Ema · roda"
          src={staticFile(SHOWCASE.ema)}
          from={0}
          durationInFrames={100}
          trimBefore={Math.round(0.4 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Ema · escapamento"
          src={staticFile(SHOWCASE.ema)}
          from={100}
          durationInFrames={98}
          trimBefore={Math.round(3.6 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Ema · rosto"
          src={staticFile(SHOWCASE.ema)}
          from={198}
          durationInFrames={132}
          trimBefore={Math.round(6.2 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Saci · roda"
          src={staticFile(SHOWCASE.saci)}
          from={330}
          durationInFrames={83}
          trimBefore={Math.round(1.2 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Saci · escapamento"
          src={staticFile(SHOWCASE.saci)}
          from={413}
          durationInFrames={98}
          trimBefore={Math.round(6.2 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Saci · rosto"
          src={staticFile(SHOWCASE.saci)}
          from={511}
          durationInFrames={137}
          trimBefore={Math.round(9.7 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Curupira · roda"
          src={staticFile(SHOWCASE.curupira)}
          from={648}
          durationInFrames={97}
          trimBefore={Math.round(0.6 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Curupira · escapamento"
          src={staticFile(SHOWCASE.curupira)}
          from={745}
          durationInFrames={79}
          trimBefore={Math.round(4.1 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Curupira · rosto"
          src={staticFile(SHOWCASE.curupira)}
          from={824}
          durationInFrames={157}
          trimBefore={Math.round(6.15 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Boto · roda"
          src={staticFile(SHOWCASE.boto)}
          from={981}
          durationInFrames={77}
          trimBefore={Math.round(0.1 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Boto · escapamento"
          src={staticFile(SHOWCASE.boto)}
          from={1058}
          durationInFrames={79}
          trimBefore={Math.round(3.6 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Boto · rosto"
          src={staticFile(SHOWCASE.boto)}
          from={1137}
          durationInFrames={156}
          trimBefore={Math.round(6.0 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Drift · entrada da curva"
          src={staticFile(SHOWCASE.drift)}
          from={1293}
          durationInFrames={210}
          trimBefore={Math.round(0.2 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Drift · carga e mini-turbo"
          src={staticFile(SHOWCASE.drift)}
          from={1503}
          durationInFrames={270}
          trimBefore={Math.round(3.0 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Saci · lançamento e acerto"
          src={staticFile(SHOWCASE.redemoinho)}
          from={1773}
          durationInFrames={210}
          trimBefore={Math.round(1.7 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Boto · proteção"
          src={staticFile(SHOWCASE.escudo)}
          from={1983}
          durationInFrames={210}
          trimBefore={Math.round(1.9 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Curupira · cipó prende a Ema"
          src={staticFile(SHOWCASE.cipo)}
          from={2193}
          durationInFrames={210}
          trimBefore={Math.round(1.3 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Ema · pena e aceleração"
          src={staticFile(SHOWCASE.pena)}
          from={2403}
          durationInFrames={210}
          trimBefore={Math.round(0.3 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Movimento · perseguição aérea"
          src={staticFile(SHOWCASE.drone)}
          from={2613}
          durationInFrames={180}
          trimBefore={Math.round(1.7 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Movimento · corrida na pista"
          src={staticFile(SHOWCASE.corrida)}
          from={2793}
          durationInFrames={120}
          trimBefore={Math.round(20 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Movimento · órbita bullet-time"
          src={staticFile(SHOWCASE.bullet)}
          from={2913}
          durationInFrames={120}
          trimBefore={Math.round(6 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Elenco · Ema"
          src={staticFile(SHOWCASE.elenco)}
          from={3033}
          durationInFrames={90}
          trimBefore={Math.round(2.2 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Elenco · Boto"
          src={staticFile(SHOWCASE.elenco)}
          from={3123}
          durationInFrames={90}
          trimBefore={Math.round(4 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Elenco · Curupira"
          src={staticFile(SHOWCASE.elenco)}
          from={3213}
          durationInFrames={90}
          trimBefore={Math.round(5.6 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Elenco · Saci"
          src={staticFile(SHOWCASE.elenco)}
          from={3303}
          durationInFrames={90}
          trimBefore={Math.round(7.5 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Video
          name="Elenco · saída em conjunto"
          src={staticFile(SHOWCASE.elenco)}
          from={3393}
          durationInFrames={90}
          trimBefore={Math.round(10.5 * fps)}
          muted
          style={{ width: "100%", height: "100%" }}
          objectFit="contain"
        />
        <Sequence
          name="Assinatura · Ema Kart"
          from={3483}
          durationInFrames={180}
        >
          <EndCard />
        </Sequence>
      </Track>
      <ShowcaseAudio {...props} />
      {props.showTitles ? (
        <Track name="Títulos · funcionalidades e pilotos">
          <Sequence name="Drift" from={1305} durationInFrames={126}>
            <LowerTitle text="DOMINE AS CURVAS" />
          </Sequence>
          <Sequence name="Redemoinho" from={1785} durationInFrames={126}>
            <LowerTitle text="REDEMOINHO" />
          </Sequence>
          <Sequence name="Escudo" from={1995} durationInFrames={126}>
            <LowerTitle text="PROTEÇÃO DO BOTO" />
          </Sequence>
          <Sequence name="Cipó" from={2205} durationInFrames={126}>
            <LowerTitle text="CIPÓ DO CURUPIRA" />
          </Sequence>
          <Sequence name="Pena" from={2415} durationInFrames={126}>
            <LowerTitle text="PENA DA EMA" />
          </Sequence>
          <Sequence name="Ema" from={3033} durationInFrames={90}>
            <LowerTitle text="EMA" short />
          </Sequence>
          <Sequence name="Boto" from={3123} durationInFrames={90}>
            <LowerTitle text="BOTO" short />
          </Sequence>
          <Sequence name="Curupira" from={3213} durationInFrames={90}>
            <LowerTitle text="CURUPIRA" short />
          </Sequence>
          <Sequence name="Saci" from={3303} durationInFrames={90}>
            <LowerTitle text="SACI" short />
          </Sequence>
        </Track>
      ) : null}
      {props.openingFade !== false ? <OpeningFade /> : null}
      <Sequence
        name="Elenco · saída suave para a logo"
        from={3465}
        durationInFrames={18}
      >
        <ClosingFade />
      </Sequence>
    </AbsoluteFill>
  );
};

const ShowcaseAudio = ({
  openingAudio,
  openingAudioStartSeconds,
  showcaseMusic,
  showcaseMusicStartSeconds,
}: ShowcaseProps) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <>
      <Track name="Trilha · Cars">
        {openingAudio ? (
          <Audio
            name="Cars · áudio original enviado"
            src={staticFile(openingAudio)}
            trimBefore={Math.round(openingAudioStartSeconds * fps)}
            durationInFrames={Math.round(23.72 * fps)}
            volume={interpolate(
              frame,
              [0, 6, Math.round(21.32 * fps), Math.round(23.72 * fps)],
              [0, 1, 1, 0],
              {
                easing: Easing.inOut(Easing.cubic),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            )}
          />
        ) : null}
      </Track>
      <Track name="Trilha · Cloudtop Cruise">
        {showcaseMusic ? (
          <Audio
            name="Showcase · Cloudtop Cruise · Frontrunning"
            src={staticFile(showcaseMusic)}
            from={Math.round(21.32 * fps)}
            trimBefore={Math.round(showcaseMusicStartSeconds * fps)}
            durationInFrames={durationInFrames - Math.round(21.32 * fps)}
            volume={interpolate(
              frame,
              [
                Math.round(21.32 * fps),
                Math.round(23.72 * fps),
                durationInFrames - Math.round(1.5 * fps),
                durationInFrames - 1,
              ],
              [0, 0.5, 0.5, 0],
              {
                easing: Easing.inOut(Easing.cubic),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            )}
          />
        ) : null}
      </Track>
    </>
  );
};

const LowerTitle = ({
  text,
  short = false,
}: {
  text: string;
  short?: boolean;
}) => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Legenda de showcase"
      style={{
        position: "absolute",
        left: 110,
        bottom: 100,
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        fontWeight: 900,
        fontSize: short ? 64 : 48,
        letterSpacing: 4,
        textShadow: "0 3px 14px #000",
        borderLeft: "6px solid #b8ed69",
        paddingLeft: 22,
        opacity: interpolate(
          frame,
          [0, 8, short ? 74 : 108, short ? 89 : 125],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
      }}
    >
      {text}
    </Interactive.Div>
  );
};

const OpeningFade = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        pointerEvents: "none",
        opacity: interpolate(frame, [0, 8], [1, 0], {
          extrapolateRight: "clamp",
        }),
      }}
    />
  );
};

const EndCard = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
      }}
    >
      <CanvasImage
        name="Logo oficial · Ema Kart · Lendas da Unifor"
        src={staticFile("components/logos/emakart-lendas-da-unifor-logo.png")}
        style={{
          width: 1200,
          height: 840,
          objectFit: "contain",
          opacity: interpolate(frame, [0, 36, 90, 179], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          }),
        }}
      />
    </AbsoluteFill>
  );
};

const ClosingFade = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        pointerEvents: "none",
        opacity: interpolate(frame, [0, 17], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        }),
      }}
    />
  );
};
