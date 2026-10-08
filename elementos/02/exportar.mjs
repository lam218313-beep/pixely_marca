// Elemento 02 «Trama de marca» (aprobada el 8 oct: puntadas), baldosa SVG sin costuras.
// node elementos/02/exportar.mjs → public/elementos/02-puntadas-<tono>.svg
// Puntos blancos (o negros en la versión clara) con transparencia: así la trama sirve sobre negro, blanco o el resplandor.
import { mkdirSync, writeFileSync } from 'node:fs';

const L = 240; // lado de la baldosa
const out = new URL('../../public/elementos/', import.meta.url);
mkdirSync(out, { recursive: true });
const hash = (a, b) => { const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return s - Math.floor(s); };
const f = (v) => +v.toFixed(2);
const TINTA = { oscuro: '#FFFFFF', claro: '#0A0A0C' };
const FUERZA = { oscuro: 1, claro: 0.8 }; // el negro sobre blanco se nota más: va un poco más suave

// Puntadas: las columnas cortas de puntos de la esfera «componiendo», sueltas y en hilera.
function puntadas(tono) {
  let s = '';
  for (let fila = 0; fila < 5; fila++) for (let col = 0; col < 10; col++) {
    const x = col * 24 + (fila % 2) * 12 + 6, y0 = fila * 48 + 12;
    const n = 2 + Math.floor(hash(col, fila) * 3), a = (hash(col + 7, fila) > 0.75 ? 0.15 : 0.09) * FUERZA[tono];
    for (let k = 0; k < n; k++) s += `<circle cx="${x}" cy="${y0 + k * 7}" r="2.1" fill-opacity="${f(a)}"/>`;
  }
  return s;
}

const PROPUESTAS = { puntadas };
for (const [id, fn] of Object.entries(PROPUESTAS)) for (const tono of ['oscuro', 'claro']) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L} ${L}" width="${L}" height="${L}"><g fill="${TINTA[tono]}">${fn(tono)}</g></svg>`;
  writeFileSync(new URL(`02-${id}-${tono}.svg`, out), svg);
  console.log(id, tono, (svg.length / 1024).toFixed(1) + ' KB');
}
