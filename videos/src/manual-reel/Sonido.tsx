// Música suave y sonidos de toque del reel (generados en Magnific; archivos en public/manual-reel/audio).
// Los efectos vienen recortados: un solo golpe por archivo, que suena justo al empezar.
// Cada sonido cae en el cuadro exacto de su acción (cuadros del reel completo, a 30 por segundo).
import React from 'react';
import { Audio } from '@remotion/media';
import { interpolate, Sequence, staticFile, useVideoConfig } from 'remotion';

const audio = (archivo: string) => staticFile(`manual-reel/audio/${archivo}`);

// Dónde empieza cada escena en el reel completo
const E = 96; // Entrar
const I = 276; // Inicio
const PL = 396; // Plan
const V = 596; // Validar
const R = 832; // Resultados

// en: cuadro donde debe oírse el golpe · antes: cuadros que el sonido tarda en llegar a su punto fuerte
type Efecto = { nombre: string; en: number; antes?: number; dura?: number; volumen?: number };
const EFECTOS: Efecto[] = [
  { nombre: 'tecleo', en: E + 35, dura: 34, volumen: 0.4 }, // se escribe el correo (letras entre 36 y 66)
  { nombre: 'toque-1', en: E + 74 }, // "Recibir mi código"
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ nombre: `tecla-${(i % 2) + 1}`, en: E + 104 + 5 * i, dura: 5, volumen: 0.45 })), // los 6 dígitos
  { nombre: 'toque-2', en: I + 80 }, // fila de ideas
  { nombre: 'toque-1', en: PL + 72 }, // día 17
  { nombre: 'toque-2', en: PL + 132 }, // "Aprobar idea"
  { nombre: 'exito', en: PL + 140, dura: 48, volumen: 0.4 }, // la idea queda aprobada
  { nombre: 'toque-1', en: V + 10 }, // pestaña Validar
  { nombre: 'barrido-1', en: V + 63, antes: 4, dura: 27, volumen: 0.55 }, // la tarjeta sale volando
  { nombre: 'exito', en: V + 76, dura: 48, volumen: 0.45 }, // aprobada
  { nombre: 'toque-2', en: V + 128 }, // lápiz
  { nombre: 'hoja', en: V + 135, antes: 13, dura: 27, volumen: 0.5 }, // sube la hoja
  { nombre: 'toque-1', en: V + 170 }, // Imagen
  { nombre: 'toque-2', en: V + 190 }, // Más luz
  { nombre: 'toque-1', en: V + 212 }, // Enviar al equipo
  { nombre: 'barrido-2', en: V + 227, antes: 3, dura: 21, volumen: 0.3 }, // baja la hoja
  { nombre: 'toque-2', en: R + 6 }, // pestaña Resultados
];

export const Sonido: React.FC<{ duracion: number }> = ({ duracion }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Audio
        src={audio('musica.mp3')}
        premountFor={fps}
        volume={(f) => 0.8 * interpolate(f, [0, 12, duracion - 30, duracion - 2], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
      />
      {EFECTOS.map((e, i) => (
        <Sequence key={i} from={e.en - (e.antes ?? 0)} durationInFrames={e.dura ?? 5} premountFor={fps} name={e.nombre}>
          <Audio src={audio(`${e.nombre}.wav`)} volume={e.volumen ?? 0.6} />
        </Sequence>
      ))}
    </>
  );
};
