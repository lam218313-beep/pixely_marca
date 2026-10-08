// Escena 3 · Plan: el mes (8 de 12 aprobadas), se abre una idea, se aprueba y el contador sube a 9.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Captura, curva, Fondo, P, Recorte, Telefono, Titular, Toque, tween, usarCamara, useFuentes, VelaSuperior } from './base';

export const DURACION_PLAN = 200;
const CONTADOR = { x: 50, y: 197 }; // el "8/12" del resumen

export const Plan: React.FC<{ conFondo?: boolean }> = ({ conFondo = true }) => {
  useFuentes();
  const f = useCurrentFrame();
  const dia = P['plan.dia'];
  const aprobar = P['idea.aprobar'];
  const cam = usarCamara([
    { f: 0 },
    { f: 6 },
    { f: 24, fx: 206, fy: 272, z: 1.25 },
    { f: 40, fx: 206, fy: 272, z: 1.25 },
    { f: 56, fx: 300, fy: 560, z: 1.5 },
    { f: 70, fx: 300, fy: 560, z: 1.5 },
    { f: 90, fx: 206, fy: 430, z: 1.08 },
    { f: 104, fx: 206, fy: 430, z: 1.08 },
    { f: 118, fx: 300, fy: 760, z: 1.35, ty: 1180 },
    { f: 140, fx: 300, fy: 760, z: 1.35, ty: 1180 },
    { f: 168, fx: 206, fy: 272, z: 1.25 },
    { f: 184, fx: 206, fy: 272, z: 1.25 },
    { f: 198 },
  ]);
  // Abrir la idea (desde la derecha), aprobar (pasa a la siguiente idea) y volver al plan (desde la izquierda)
  const abre = tween(f, 76, 90, 0, 1, curva.entrada);
  const vuelve = tween(f, 150, 166, 0, 1, curva.entrada);
  const presion = f < 132 ? tween(f, 128, 132, 1, 0.95) : tween(f, 132, 140, 0.95, 1, curva.entrada);
  const pulso = tween(f, 166, 174, 0, 1, curva.entrada) * tween(f, 184, 196, 1, 0);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {conFondo && <Fondo desde={396} />}
      <Telefono cam={cam}>
        {abre < 1 && (
          <div style={{ position: 'absolute', inset: 0, translate: `${-110 * abre * cam.k}px 0px`, filter: `brightness(${1 - 0.45 * abre})` }}>
            <Captura src="plan" />
          </div>
        )}
        {abre > 0 && vuelve < 1 && (
          <div style={{ position: 'absolute', inset: 0, translate: `${(412 * (1 - abre) + 412 * vuelve) * cam.k}px 0px` }}>
            <Captura src="idea" />
            <Recorte src="idea" caja={aprobar} escala={presion} radio={14} />
            <Captura src="idea-aprobada" opacidad={tween(f, 140, 148, 0, 1)} />
          </div>
        )}
        {vuelve > 0 && (
          <div style={{ position: 'absolute', inset: 0, translate: `${-110 * (1 - vuelve) * cam.k}px 0px`, filter: `brightness(${0.55 + 0.45 * vuelve})` }}>
            <Captura src="plan-despues" />
            <div style={{ position: 'absolute', left: (CONTADOR.x - 34) * cam.k, top: (CONTADOR.y - 34) * cam.k, width: 68 * cam.k, height: 68 * cam.k, borderRadius: '50%', boxShadow: `0 0 0 ${2.5 * cam.k}px rgba(255,194,225,${pulso}), 0 0 ${26 * cam.k}px rgba(235,12,110,${0.9 * pulso})`, scale: String(0.8 + 0.2 * pulso) }} />
          </div>
        )}
        <Toque x={dia.x + dia.w / 2} y={dia.y + dia.h / 2} en={72} />
        <Toque x={aprobar.x + aprobar.w / 2} y={aprobar.y + aprobar.h / 2} en={132} />
      </Telefono>
      <VelaSuperior />
      <Titular paso="Paso 3 · Plan" texto="Aprueba las ideas del mes." desde={4} hasta={DURACION_PLAN}
        apoyos={[
          { texto: 'Cada idea dice por qué existe.', desde: 16, hasta: 124 },
          { texto: 'Antes de producir nada.', desde: 128, hasta: DURACION_PLAN },
        ]} />
    </div>
  );
};
