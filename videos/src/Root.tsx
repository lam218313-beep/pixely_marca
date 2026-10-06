import { Composition } from 'remotion';
import { Prueba } from './Prueba';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Vertical 1080x1920: Reels, TikTok, Shorts e historias */}
    <Composition id="Prueba" component={Prueba} durationInFrames={90} fps={30} width={1080} height={1920} />
  </>
);
