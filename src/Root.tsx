import { Composition, Folder } from "remotion";
import { EmaKartTeaser } from "./Composition";
import { ComicTeaser } from "./comic/ComicTeaser";
export const RemotionRoot = () => (
  <>
    <Folder name="Introducao">
      <Composition
        id="EmaKartTeaser"
        component={EmaKartTeaser}
        durationInFrames={1560}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          openingMusic: "audio/audio-gta.mp3",
          musicStartSeconds: 0,
        }}
      />
    </Folder>
    <Folder name="Historia-em-quadrinhos">
      <Composition
        id="DesafioUniforHQ"
        component={ComicTeaser}
        durationInFrames={1440}
        fps={60}
        width={1920}
        height={1080}
      />
    </Folder>
  </>
);
