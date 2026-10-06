import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, delayRender, continueRender } from 'remotion';
import { useEffect, useState } from 'react';
import { colores, fuentes, cargarFuentes } from './marca';

// Video de prueba: confirma que las fuentes, la paleta, las capturas y el renderizado funcionan.
export const Prueba: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const [espera] = useState(() => delayRender('fuentes'));
  useEffect(() => { cargarFuentes().then(() => continueRender(espera)); }, [espera]);

  const entrada = spring({ frame, fps, config: { damping: 200 } });
  const sube = interpolate(entrada, [0, 1], [60, 0]);
  const celular = spring({ frame: frame - 12, fps, config: { damping: 18, stiffness: 90 } });
  const salida = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: colores.rosa, opacity: salida, fontFamily: fuentes.texto }}>
      <div style={{ position: 'absolute', left: 90, top: 150, transform: `translateY(${sube}px)`, opacity: entrada }}>
        <div style={{ fontFamily: fuentes.titulo, fontWeight: 800, fontSize: 64, color: colores.blanco }}>
          pixely<span style={{ color: colores.tinta }}>.</span>
        </div>
        <div style={{ fontFamily: fuentes.titulo, fontWeight: 800, fontSize: 118, lineHeight: 1, letterSpacing: '-0.035em', color: colores.blanco, marginTop: 60 }}>
          Publicidad<br />que vende<span style={{ color: colores.tinta }}>.</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 190, bottom: -380 + (1 - celular) * 500, width: 700, borderRadius: 60, overflow: 'hidden', border: '6px solid #0A0A0C' }}>
        <Img src={staticFile('capturas/m-validar.webp')} style={{ width: '100%', display: 'block' }} />
      </div>
    </AbsoluteFill>
  );
};
