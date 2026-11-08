import { Composition } from "remotion";
import { EmaKartTeaser } from "./Composition";
export const RemotionRoot = () => (
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
);
