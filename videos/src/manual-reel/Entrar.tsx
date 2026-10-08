// Escena 1 · Entrar: el correo se escribe, llega el código de 6 dígitos y el orbe verifica.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Captura, curva, Fondo, OrbeEnPantalla, P, Pieza, Telefono, Titular, Toque, tween, usarCamara, useFuentes, VelaSuperior, Velo } from './base';

export const DURACION_ENTRAR = 180;

const CORREO = 16; // letras de ana@casanorte.pe
const pad = (n: number) => String(n).padStart(2, '0');

export const Entrar: React.FC<{ conFondo?: boolean }> = ({ conFondo = true }) => {
  useFuentes();
  const f = useCurrentFrame();
  const correo = P['entrar.correo'];
  const boton = P['entrar.boton'];
  const casillas = P['codigo.recorte'];
  const cam = usarCamara([
    { f: 0 },
    { f: 12 },
    { f: 32, fx: 206, fy: 600, z: 1.55 },
    { f: 66, fx: 206, fy: 600, z: 1.55 },
    { f: 80, fx: 206, fy: 625, z: 1.32 },
    { f: 86, fx: 206, fy: 625, z: 1.32 },
    { f: 104, fx: 206, fy: 320, z: 1.5 },
    { f: 134, fx: 206, fy: 320, z: 1.5 },
    { f: 150 },
  ]);
  // Navegación: la pantalla del código entra desde la derecha
  const push = tween(f, 82, 98, 0, 1, curva.entrada);
  const letras = Math.max(0, Math.min(CORREO, Math.floor((f - 34) / 2)));
  const digitos = f < 104 ? 0 : Math.min(6, 1 + Math.floor((f - 104) / 5));
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {conFondo && <Fondo desde={96} />}
      <Telefono cam={cam}>
        {/* Entrar, con el correo que se va escribiendo encima del campo */}
        {push < 1 && (
          <>
            <Captura src="entrar" dx={-110 * push} brillo={1 - 0.45 * push} />
            {f >= 30 && <Pieza src={`entrar-correo-${pad(letras)}`} caja={correo} dx={-110 * push} opacidad={1 - 0.45 * push} />}
          </>
        )}
        {/* Código: casillas que se llenan, luego "Verificando" con el orbe */}
        {push > 0 && (
          <>
            <Captura src={digitos < 6 ? 'codigo' : 'codigo-verificando'} dx={412 * (1 - push)} />
            {digitos < 6 && <Pieza src={`codigo-casillas-${digitos}`} caja={casillas} dx={412 * (1 - push)} />}
            {digitos === 6 && <OrbeEnPantalla caja={P['codigo.orbe']} />}
          </>
        )}
        {/* Ya adentro: Inicio se abre con un leve acercamiento */}
        {f >= 150 && (
          <div style={{ position: 'absolute', inset: 0, opacity: tween(f, 150, 160, 0, 1, curva.entrada), scale: String(tween(f, 150, 166, 1.06, 1, curva.entrada)) }}>
            <Captura src="inicio" />
          </div>
        )}
        {/* Al empezar, Inicio se apaga y Entrar se enciende (sin superponerlas) */}
        <Velo opacidad={tween(f, 0, 5, 0, 1) * tween(f, 6, 12, 1, 0)} />
        <Captura src="inicio" opacidad={f < 6 ? 1 : 0} brillo={tween(f, 0, 5, 1, 0.1)} />
        <Toque x={boton.x + boton.w / 2} y={boton.y + boton.h / 2} en={74} />
      </Telefono>
      <VelaSuperior />
      <Titular paso="Paso 1 · Entrar" texto="Entra con tu correo." desde={4} hasta={DURACION_ENTRAR}
        apoyos={[{ texto: 'Recibes un código. Sin contraseñas.', desde: 16, hasta: DURACION_ENTRAR }]} />
    </div>
  );
};
