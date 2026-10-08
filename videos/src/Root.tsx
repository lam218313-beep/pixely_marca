import { Composition, Folder, Still } from 'remotion';
import { Cierre, DURACION_CIERRE } from './manual-reel/Cierre';
import { DURACION_ENTRAR, Entrar } from './manual-reel/Entrar';
import { DURACION_GANCHO, Gancho } from './manual-reel/Gancho';
import { DURACION_INICIO, Inicio } from './manual-reel/Inicio';
import { DURACION_REEL, ManualReel } from './manual-reel/ManualReel';
import { DURACION_PLAN, Plan } from './manual-reel/Plan';
import { Portada } from './manual-reel/Portada';
import { DURACION_RESULTADOS, Resultados } from './manual-reel/Resultados';
import { DURACION_VALIDAR, Validar } from './manual-reel/Validar';

// Vertical 1080 × 1920 a 30 cuadros por segundo: Reels, TikTok, Shorts e historias.
const reel = { fps: 30, width: 1080, height: 1920 } as const;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ManualReel" component={ManualReel} durationInFrames={DURACION_REEL} {...reel} />
    <Still id="ManualReelPortada" component={Portada} width={reel.width} height={reel.height} />
    <Folder name="Manual-reel-escenas">
      <Composition id="Gancho" component={Gancho} durationInFrames={DURACION_GANCHO} {...reel} />
      <Composition id="Entrar" component={Entrar} durationInFrames={DURACION_ENTRAR} {...reel} />
      <Composition id="Inicio" component={Inicio} durationInFrames={DURACION_INICIO} {...reel} />
      <Composition id="Plan" component={Plan} durationInFrames={DURACION_PLAN} {...reel} />
      <Composition id="Validar" component={Validar} durationInFrames={DURACION_VALIDAR} {...reel} />
      <Composition id="Resultados" component={Resultados} durationInFrames={DURACION_RESULTADOS} {...reel} />
      <Composition id="Cierre" component={Cierre} durationInFrames={DURACION_CIERRE} {...reel} />
    </Folder>
  </>
);
