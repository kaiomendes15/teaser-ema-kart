import { Composition } from "remotion";
import { EmaKartTeaser } from "./Composition";
import { EmaKartShowcase } from "./showcase/Showcase";
export const RemotionRoot = () => (
  <>
    <Composition
      id="EmaKartTeaser"
      component={EmaKartTeaser}
      durationInFrames={480}
      fps={60}
      width={1920}
      height={1080}
      defaultProps={{
        openingMusic: "audio/audio-gta.mp3",
        musicStartSeconds: 0,
      }}
    />
    <Composition
      id="EmaKartShowcase"
      component={EmaKartShowcase}
      durationInFrames={3663}
      fps={60}
      width={1920}
      height={1080}
      defaultProps={{
        openingAudio: "audio/Cars - Tuner Scene but in 4K.mp3",
        openingAudioStartSeconds: 0,
        showcaseMusic: "",
        showcaseMusicStartSeconds: 0,
        showTitles: true,
      }}
    />
  </>
);
