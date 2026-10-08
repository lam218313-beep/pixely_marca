// Escena 2 · Inicio: lo urgente arriba (tarjeta rosada) y la lista; un toque abre las ideas del mes.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Captura, curva, Fondo, P, Recorte, Telefono, Titular, Toque, tween, usarCamara, useFuentes, VelaSuperior } from './base';

export const DURACION_INICIO = 120;
const FILA_IDEAS = { x: 20, y: 314, w: 372, h: 74 }; // "3 ideas de octubre por aprobar"

export const Inicio: React.FC<{ conFondo?: boolean }> = ({ conFondo = true }) => {
  useFuentes();
  const f = useCurrentFrame();
  const t = P['inicio.tarjeta'];
  const cam = usarCamara([
    { f: 0 },
    { f: 8 },
    { f: 26, fx: 206, fy: 225, z: 1.3 },
    { f: 50, fx: 206, fy: 225, z: 1.3 },
    { f: 66, fx: 206, fy: 360, z: 1.3 },
    { f: 88, fx: 206, fy: 360, z: 1.3 },
    { f: 106 },
  ]);
  const halo = tween(f, 26, 36, 0, 1, curva.entrada) * tween(f, 46, 60, 1, 0);
  const presion = f < 80 ? tween(f, 76, 80, 1, 0.97) : tween(f, 80, 88, 0.97, 1, curva.entrada);
  const push = tween(f, 88, 102, 0, 1, curva.entrada);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {conFondo && <Fondo desde={276} />}
      <Telefono cam={cam}>
        {push < 1 && (
          <div style={{ position: 'absolute', inset: 0, translate: `${-110 * push * cam.k}px 0px`, filter: `brightness(${1 - 0.45 * push})` }}>
            <Captura src="inicio" />
            <Recorte src="inicio" caja={FILA_IDEAS} escala={presion} radio={20} />
            <div style={{ position: 'absolute', left: (t.x - 6) * cam.k, top: (t.y - 6) * cam.k, width: (t.w + 12) * cam.k, height: (t.h + 12) * cam.k, borderRadius: 30 * cam.k, boxShadow: `0 0 0 ${3 * cam.k}px rgba(255,194,225,${0.9 * halo}), 0 0 ${40 * cam.k}px rgba(235,12,110,${0.8 * halo})` }} />
          </div>
        )}
        {push > 0 && <Captura src="plan" dx={412 * (1 - push)} />}
        <Toque x={206} y={FILA_IDEAS.y + FILA_IDEAS.h / 2} en={80} />
      </Telefono>
      <VelaSuperior />
      <Titular paso="Paso 2 · Inicio" texto="Lo que te toca, en un vistazo." desde={4} hasta={DURACION_INICIO}
        apoyos={[{ texto: 'Lo urgente arriba, lo demás en orden.', desde: 16, hasta: DURACION_INICIO }]} />
    </div>
  );
};
