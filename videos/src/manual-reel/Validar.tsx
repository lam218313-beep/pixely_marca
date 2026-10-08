// Escena 4 · Validar: la tarjeta se desliza a la derecha (aprobada, con Deshacer) y luego se piden cambios.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { colores, fuentes } from '../marca';
import { Arrastre, Captura, curva, Fondo, P, Pieza, Telefono, Titular, Toque, tween, usarCamara, useFuentes, VelaSuperior, Velo } from './base';

export const DURACION_VALIDAR = 236;
const OSCURO = 0.74; // la app deja el fondo detrás de la hoja al 26 % de brillo

export const Validar: React.FC<{ conFondo?: boolean }> = ({ conFondo = true }) => {
  useFuentes();
  const f = useCurrentFrame();
  const carta = P['validar.tarjeta'];
  const lapiz = P['validar.cambios'];
  const hoja = P['cambios.hoja'];
  const imagen = P['cambios.imagen'];
  const luz = P['cambios.luz'];
  const enviar = P['cambios.enviar'];
  const nav = P['nav.validar'];
  const cam = usarCamara([
    { f: 0 },
    { f: 24 },
    { f: 40, fx: 206, fy: 410, z: 1.1 },
    { f: 80, fx: 206, fy: 410, z: 1.1 },
    { f: 94, fx: 300, fy: 680, z: 1.38, ty: 1160 },
    { f: 108, fx: 300, fy: 680, z: 1.38, ty: 1160 },
    { f: 122, fx: 206, fy: 600, z: 1.08 },
    { f: 136, fx: 206, fy: 600, z: 1.08 },
    { f: 156, fx: 206, fy: 540, z: 1.2, ty: 1170 },
    { f: 196, fx: 206, fy: 540, z: 1.2, ty: 1170 },
    { f: 206, fx: 206, fy: 650, z: 1.12, ty: 1150 },
    { f: 216, fx: 206, fy: 650, z: 1.12, ty: 1150 },
    { f: 234 },
  ]);
  // La tarjeta sigue al dedo y después sale disparada
  const arrastre = tween(f, 48, 62, 0, 150, curva.suave);
  const vuelo = tween(f, 62, 76, 0, 520, curva.salida);
  const dx = arrastre + vuelo;
  const sello = tween(dx, 20, 110, 0, 1);
  // La hoja de cambios sube y, tras enviar, baja
  const sube = tween(f, 132, 150, 0, 1, curva.entrada);
  const baja = tween(f, 218, 232, 0, 1, curva.salida);
  const hojaAbierta = sube * (1 - baja);
  const pantallaHoja = f < 172 ? 'cambios-vacio' : f < 192 ? 'cambios-imagen' : 'cambios-luz';
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {conFondo && <Fondo desde={596} />}
      <Telefono cam={cam}>
        {/* Del plan a Validar con la barra de abajo */}
        <Captura src="plan-despues" opacidad={tween(f, 14, 24, 1, 0)} />
        {f >= 12 && f < 86 && (
          <>
            <Captura src={f < 48 ? 'validar' : 'validar-debajo'} opacidad={tween(f, 14, 24, 0, 1)} />
            {f >= 48 && (
              <Pieza src="validar-tarjeta" caja={carta} dx={dx} dy={dx * 0.06} rotar={dx / 36} radio={26}>
                <div style={{ position: 'absolute', left: 22 * cam.k, top: 64 * cam.k, padding: `${6 * cam.k}px ${14 * cam.k}px`, borderRadius: 99, background: colores.rosa, color: '#fff', fontFamily: fuentes.texto, fontWeight: 800, fontSize: 15 * cam.k, opacity: sello, rotate: '-8deg' }}>
                  ✓ Aprobar
                </div>
              </Pieza>
            )}
          </>
        )}
        {f >= 76 && f < 136 && <Captura src={f < 118 ? 'validar-siguiente' : 'validar-segunda'} opacidad={f < 118 ? tween(f, 76, 81, 0, 1) : 1} />}
        {f >= 112 && f < 124 && <Captura src="validar-segunda" opacidad={tween(f, 112, 120, 0, 1)} />}
        {/* Pedir cambios: la hoja sube sobre el fondo oscurecido */}
        {f >= 130 && (
          <>
            <Captura src="validar-segunda" />
            <Velo opacidad={OSCURO * hojaAbierta} />
            {f < 152 || f >= 214 ? (
              <Pieza src={f >= 214 ? 'cambios-hoja-luz' : 'cambios-hoja'} caja={hoja} dy={(hoja.h + 20) * (1 - hojaAbierta)} />
            ) : (
              <Captura src={pantallaHoja} />
            )}
          </>
        )}
        <Toque x={nav.x + nav.w / 2} y={nav.y + nav.h / 2 - 8} en={10} />
        <Arrastre x0={206} y0={360} x1={360} y1={372} f0={48} f1={62} />
        <Toque x={lapiz.x + lapiz.w / 2} y={lapiz.y + lapiz.h / 2} en={128} />
        <Toque x={imagen.x + imagen.w / 2} y={imagen.y + imagen.h / 2} en={170} />
        <Toque x={luz.x + luz.w / 2} y={luz.y + luz.h / 2} en={190} />
        <Toque x={enviar.x + enviar.w / 2} y={enviar.y + enviar.h / 2} en={212} />
      </Telefono>
      <VelaSuperior />
      <Titular paso="Paso 4 · Validar" texto="Revisa cada pieza." desde={4} hasta={DURACION_VALIDAR}
        apoyos={[
          { texto: 'Desliza a la derecha para aprobar.', desde: 16, hasta: 120 },
          { texto: '¿No te convence? Pide cambios.', desde: 124, hasta: DURACION_VALIDAR },
        ]} />
    </div>
  );
};
