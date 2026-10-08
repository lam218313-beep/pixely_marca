// Escena 6 · Cierre: el teléfono baja, aparece el orbe y la promesa; marca y contacto.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { colores, fuentes } from '../marca';
import { Captura, curva, Fondo, Orbe, REPOSO, Telefono, Titular, tween, usarCamara, useFuentes } from './base';

export const DURACION_CIERRE = 120;

export const Cierre: React.FC<{ conFondo?: boolean }> = ({ conFondo = true }) => {
  useFuentes();
  const f = useCurrentFrame();
  const cam = usarCamara([
    { f: 0 },
    { f: 30, z: 0.82, ty: REPOSO.ty + 900, curva: 'salida' },
  ]);
  const orbe = tween(f, 16, 40, 0, 1, curva.entrada);
  const marca = tween(f, 46, 64, 0, 1, curva.entrada);
  const chip = tween(f, 56, 74, 0, 1, curva.entrada);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {conFondo && <Fondo desde={942} />}
      <Telefono cam={cam} opacidad={tween(f, 8, 28, 1, 0)}>
        <Captura src="resultado" />
      </Telefono>
      <div style={{ position: 'absolute', left: 540 - 170, top: 520 - 170, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(235,12,110,.28), rgba(235,12,110,0))', opacity: orbe }} />
      <Orbe estado="working" lado={250 * (0.7 + 0.3 * orbe)} x={540} y={520} opacidad={orbe} />
      <Titular texto="Nada se publica sin tu aprobación." desde={22} hasta={9999} top={760} centrado tam={84} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1220, textAlign: 'center', opacity: marca, translate: `0px ${(1 - marca) * 30}px` }}>
        <div style={{ fontFamily: fuentes.titulo, fontWeight: 700, fontSize: 120, letterSpacing: '-0.05em', color: colores.blanco }}>
          pixely<span style={{ color: colores.rosa }}>.</span>
        </div>
        <div style={{ marginTop: 4, fontFamily: fuentes.texto, fontWeight: 800, fontSize: 30, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)' }}>Partners</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1490, display: 'flex', justifyContent: 'center', opacity: chip, translate: `0px ${(1 - chip) * 24}px` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '22px 38px', borderRadius: 99, background: 'rgba(255,255,255,.07)', border: '2px solid rgba(255,255,255,.12)', fontFamily: fuentes.texto, fontWeight: 700, fontSize: 38, color: colores.blanco }}>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: colores.rosa }} />
          pixely.pe
        </div>
      </div>
    </div>
  );
};
