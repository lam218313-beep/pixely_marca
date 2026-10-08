// Música suave y sonidos de toque del reel (generados en Magnific; archivos en public/manual-reel/audio).
// Cada sonido va en el cuadro exacto de su acción (cuadros del reel completo, a 30 por segundo).
import React from 'react';
import { Audio } from '@remotion/media';
import { interpolate, Sequence, staticFile, useVideoConfig } from 'remotion';

const audio = (nombre: string) => staticFile(`manual-reel/audio/${nombre}.mp3`);

// Dónde empieza cada escena en el reel completo
const E = 96; // Entrar
const I = 276; // Inicio
const PL = 396; // Plan
const V = 596; // Validar
const R = 832; // Resultados

type Efecto = { nombre: string; en: number; dura?: number; volumen?: number };
const EFECTOS: Efecto[] = [
  { nombre: 'tecleo', en: E + 34, dura: 34, volumen: 0.5 }, // se escribe el correo
  { nombre: 'toque-1', en: E + 74 }, // "Recibir mi código"
  { nombre: 'tecleo', en: E + 104, dura: 30, volumen: 0.45 }, // los 6 dígitos
  { nombre: 'toque-2', en: I + 80 }, // fila de ideas
  { nombre: 'toque-1', en: PL + 72 }, // día 17
  { nombre: 'toque-2', en: PL + 132 }, // "Aprobar idea"
  { nombre: 'exito', en: PL + 138, volumen: 0.45 },
  { nombre: 'toque-1', en: V + 10 }, // pestaña Validar
  { nombre: 'barrido-1', en: V + 58, volumen: 0.8 }, // la tarjeta sale volando
  { nombre: 'exito', en: V + 76, volumen: 0.6 }, // aprobada
  { nombre: 'toque-2', en: V + 128 }, // lápiz
  { nombre: 'hoja', en: V + 132, volumen: 0.6 }, // sube la hoja
  { nombre: 'toque-1', en: V + 170 }, // Imagen
  { nombre: 'toque-2', en: V + 190 }, // Más luz
  { nombre: 'toque-1', en: V + 212 }, // Enviar al equipo
  { nombre: 'barrido-2', en: V + 218, volumen: 0.4 }, // baja la hoja
  { nombre: 'toque-2', en: R + 6 }, // pestaña Resultados
];

export const Sonido: React.FC<{ duracion: number }> = ({ duracion }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Audio
        src={audio('musica')}
        premountFor={fps}
        volume={(f) => 0.5 * interpolate(f, [0, 12, duracion - 45, duracion - 2], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
      />
      {EFECTOS.map((e, i) => (
        <Sequence key={i} from={e.en - 1} durationInFrames={e.dura ?? fps} premountFor={fps} name={e.nombre}>
          <Audio src={audio(e.nombre)} volume={e.volumen ?? 0.7} />
        </Sequence>
      ))}
    </>
  );
};
