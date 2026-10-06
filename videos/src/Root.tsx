import { Composition } from 'remotion';
import { Prueba } from './Prueba';
import { Motion01 } from './Motion01';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Vertical 1080x1920: Reels, TikTok, Shorts e historias */}
    <Composition id="Prueba" component={Prueba} durationInFrames={90} fps={30} width={1080} height={1920} />
    <Composition id="Motion01" component={Motion01} durationInFrames={192} fps={30} width={1080} height={1920} />
  </>
);
