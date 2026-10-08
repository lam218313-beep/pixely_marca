// Escena 5 · Resultados: se abre una pieza publicada y sus números suben solos.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Captura, Contador, curva, Fondo, P, Telefono, Titular, Toque, tween, usarCamara, useFuentes, VelaSuperior, type Caja } from './base';

export const DURACION_RESULTADOS = 110;
type Numero = Caja & { texto: string; tam: string; espaciado: string };

export const Resultados: React.FC<{ conFondo?: boolean }> = ({ conFondo = true }) => {
  useFuentes();
  const f = useCurrentFrame();
  const nav = P['nav.resultados'];
  const numeros = (P['resultado.numeros'] as unknown as { lista: Numero[] }).lista;
  const cam = usarCamara([
    { f: 0 },
    { f: 22 },
    { f: 42, fx: 206, fy: 690, z: 1.3, ty: 1150 },
    { f: 88, fx: 206, fy: 690, z: 1.3, ty: 1150 },
    { f: 106 },
  ]);
  const abre = tween(f, 14, 28, 0, 1, curva.entrada);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {conFondo && <Fondo desde={832} />}
      <Telefono cam={cam}>
        <Captura src="validar-segunda" />
        {abre > 0 && (
          <div style={{ position: 'absolute', inset: 0, opacity: abre, scale: String(1.05 - 0.05 * abre) }}>
            <Captura src="resultado-sin-numeros" />
            {numeros.map((n) => (
              <Contador key={n.texto} caja={n} valor={Number(n.texto.replace(/,/g, ''))} f0={30} f1={72} tam={parseFloat(n.tam)} espaciado={parseFloat(n.espaciado)} />
            ))}
          </div>
        )}
        <Toque x={nav.x + nav.w / 2} y={nav.y + nav.h / 2 - 8} en={6} />
      </Telefono>
      <VelaSuperior />
      <Titular paso="Paso 5 · Resultados" texto="Mira cómo te fue." desde={4} hasta={DURACION_RESULTADOS}
        apoyos={[{ texto: 'Alcance, vistas y tu mejor pieza.', desde: 16, hasta: DURACION_RESULTADOS }]} />
    </div>
  );
};
