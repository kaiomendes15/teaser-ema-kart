import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { ComicPage } from "./ComicPage";

// Independent composition. The previous kart teaser keeps its own timeline.
export const ComicTeaser = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <ComicPage />
      <Audio
        name="Moema • passos no campus"
        src={staticFile("audio/comic/footsteps.wav")}
        from={Math.round(0.25 * fps)}
        durationInFrames={Math.round(3.75 * fps)}
      />
      <Audio
        name="Livro na máquina • descarga elétrica"
        src={staticFile("audio/comic/energy.wav")}
        from={Math.round(4.2 * fps)}
        durationInFrames={Math.round(2.8 * fps)}
        volume={0.85}
      />
      <Audio
        name="Aventura • trilha crescente original"
        src={staticFile("audio/comic/adventure.wav")}
        durationInFrames={24 * fps}
        volume={0.85}
      />
      <Audio
        name="Quadro 1 • papel em movimento"
        src={staticFile("audio/comic/page.wav")}
        from={Math.round(0.15 * fps)}
        durationInFrames={Math.round(0.3 * fps)}
        volume={0.7}
      />
      <Audio
        name="Quadro 2 • entrada e surpresa"
        src={staticFile("audio/comic/page.wav")}
        from={4 * fps}
        durationInFrames={Math.round(0.3 * fps)}
      />
      <Audio
        name="Livro • escapada e impacto"
        src={staticFile("audio/comic/book.wav")}
        from={Math.round(4.2 * fps)}
        durationInFrames={Math.round(0.65 * fps)}
      />
      <Audio
        name="EQ-73 • ativação elétrica"
        src={staticFile("audio/comic/energy.wav")}
        from={7 * fps}
        durationInFrames={Math.round(3.1 * fps)}
      />
      <Audio
        name="Lendas • aparição"
        src={staticFile("audio/comic/reveal.wav")}
        from={10 * fps}
        durationInFrames={Math.round(0.7 * fps)}
      />
      <Audio
        name="Curupira • raízes e solo"
        src={staticFile("audio/comic/roots.wav")}
        from={13 * fps}
        durationInFrames={Math.round(2.5 * fps)}
      />
      <Audio
        name="Saci • vento e resíduos"
        src={staticFile("audio/comic/vortex.wav")}
        from={Math.round(15.5 * fps)}
        durationInFrames={Math.round(2.5 * fps)}
      />
      <Audio
        name="Boto • água avançando"
        src={staticFile("audio/comic/water.wav")}
        from={18 * fps}
        durationInFrames={Math.round(2.5 * fps)}
      />
      <Audio
        name="Desafio • página completa"
        src={staticFile("audio/comic/page.wav")}
        from={Math.round(20.5 * fps)}
        durationInFrames={Math.round(0.3 * fps)}
      />
      <Audio
        name="Karts • alinhamento e aceleração"
        src={staticFile("audio/comic/karts.wav")}
        from={Math.round(20.5 * fps)}
        durationInFrames={Math.round(3.5 * fps)}
      />
      <Audio
        name="Título • zoom final"
        src={staticFile("audio/comic/reveal.wav")}
        from={Math.round(23.3 * fps)}
        durationInFrames={Math.round(0.7 * fps)}
        volume={0.6}
      />
    </AbsoluteFill>
  );
};
