// Escena 0 · Gancho: el teléfono llega con lo que le toca a la dueña y la promesa en grande.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { colores } from '../marca';
import { Captura, curva, Fondo, P, REPOSO, Telefono, Titular, tween, usarCamara, useFuentes, VelaSuperior } from './base';

export const DURACION_GANCHO = 96;

export const Gancho: React.FC<{ conFondo?: boolean }> = ({ conFondo = true }) => {
  useFuentes();
  const f = useCurrentFrame();
  const cam = usarCamara([
    { f: 0, ty: REPOSO.ty + 980, z: 0.9 },
    { f: 40, curva: 'entrada' },
  ]);
  // Llamada de atención sobre la tarjeta rosada: un halo que se enciende y se apaga
  const t = P['inicio.tarjeta'];
  const halo = tween(f, 50, 62, 0, 1, curva.entrada) * tween(f, 72, 92, 1, 0);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {conFondo && <Fondo />}
      <Telefono cam={cam} opacidad={tween(f, 2, 18, 0, 1)}>
        <Captura src="inicio" />
        <div
          style={{
            position: 'absolute', left: (t.x - 6) * cam.k, top: (t.y - 6) * cam.k, width: (t.w + 12) * cam.k, height: (t.h + 12) * cam.k,
            borderRadius: 30 * cam.k, boxShadow: `0 0 0 ${3 * cam.k}px rgba(255,194,225,${0.9 * halo}), 0 0 ${40 * cam.k}px rgba(235,12,110,${0.8 * halo})`,
          }}
        />
      </Telefono>
      <VelaSuperior />
      <Titular texto="Tu publicidad, aprobada desde tu celular." desde={6} hasta={DURACION_GANCHO} top={170} />
      <div style={{ position: 'absolute', inset: 0, background: colores.tinta, opacity: tween(f, 0, 6, 1, 0), pointerEvents: 'none' }} />
    </div>
  );
};
