// Portada del reel. Instagram la muestra recortada a 3:4 en la cuadrícula del perfil (se pierden 240 px arriba y abajo),
// así que el titular y la tarjeta rosada quedan dentro de esa zona.
import React from 'react';
import { Captura, Fondo, P, REPOSO, Telefono, Titular, usarCamara, useFuentes, VelaSuperior } from './base';

export const Portada: React.FC = () => {
  useFuentes();
  const cam = usarCamara([{ f: 0, ty: REPOSO.ty + 150 }]);
  const t = P['inicio.tarjeta'];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Fondo />
      <Telefono cam={cam}>
        <Captura src="inicio" />
        <div
          style={{
            position: 'absolute', left: (t.x - 6) * cam.k, top: (t.y - 6) * cam.k, width: (t.w + 12) * cam.k, height: (t.h + 12) * cam.k,
            borderRadius: 30 * cam.k, boxShadow: `0 0 0 ${3 * cam.k}px rgba(255,194,225,.9), 0 0 ${40 * cam.k}px rgba(235,12,110,.8)`,
          }}
        />
      </Telefono>
      <VelaSuperior />
      {/* desde negativo: en el cuadro 0 el titular ya terminó de entrar */}
      <Titular paso="Pixely Partners" texto="Tu publicidad, aprobada desde tu celular." desde={-60} hasta={60} top={300} />
    </div>
  );
};
