// Elemento 02 «Trama de marca»: tres propuestas de patrón repetible (baldosas SVG sin costuras).
// node elementos/02/exportar.mjs → public/elementos/02-<propuesta>-<tono>.svg
// Puntos blancos (o negros en la versión clara) con transparencia: así la trama sirve sobre negro, blanco o el resplandor.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const L = 240; // lado de la baldosa
const out = new URL('../../public/elementos/', import.meta.url);
mkdirSync(out, { recursive: true });
const hash = (a, b) => { const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return s - Math.floor(s); };
const f = (v) => +v.toFixed(2);
const TINTA = { oscuro: '#FFFFFF', claro: '#0A0A0C' };
const FUERZA = { oscuro: 1, claro: 0.8 }; // el negro sobre blanco se nota más: va un poco más suave

// A · Puntadas: las columnas cortas de puntos de la esfera «componiendo», sueltas y en hilera.
function puntadas(tono) {
  let s = '';
  for (let fila = 0; fila < 5; fila++) for (let col = 0; col < 10; col++) {
    const x = col * 24 + (fila % 2) * 12 + 6, y0 = fila * 48 + 12;
    const n = 2 + Math.floor(hash(col, fila) * 3), a = (hash(col + 7, fila) > 0.75 ? 0.15 : 0.09) * FUERZA[tono];
    for (let k = 0; k < n; k++) s += `<circle cx="${x}" cy="${y0 + k * 7}" r="2.1" fill-opacity="${f(a)}"/>`;
  }
  return s;
}

// B · Ola de puntos: la cinta de la esfera aplanada; cada hilera ondula un poco desfasada de la anterior.
function ola(tono) {
  let s = '';
  for (let fila = 0; fila < 12; fila++) for (let i = 0; i < 24; i++) {
    const x = i * 10 + 5, fase = (2 * Math.PI * x) / L + (fila * 2 * Math.PI) / 12;
    const cresta = 0.5 + 0.5 * Math.sin(fase);
    s += `<circle cx="${x}" cy="${f(fila * 20 + 10 + 6 * Math.sin(fase))}" r="${f(0.9 + 1.2 * cresta)}" fill-opacity="${f((0.05 + 0.09 * cresta) * FUERZA[tono])}"/>`;
  }
  return s;
}

// C · La p.: el ícono de la marca repetido en hileras alternadas, en tono sobre tono.
const pSvg = readFileSync(new URL('../../public/logos/p-sobre-negro.svg', import.meta.url), 'utf8');
const trazos = [...pSvg.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
function laP(tono) {
  const glifo = (x, y) => `<g transform="translate(${x} ${y}) scale(0.04)">${trazos.map((d) => `<path d="${d}"/>`).join('')}</g>`;
  const a = 0.07 * FUERZA[tono];
  return `<g fill-opacity="${f(a)}">${[[30, 80], [150, 80], [90, 200], [210, 200], [-30, 200]].map(([x, y]) => glifo(x, y)).join('')}</g>`;
}

const PROPUESTAS = { puntadas, ola, p: laP };
for (const [id, fn] of Object.entries(PROPUESTAS)) for (const tono of ['oscuro', 'claro']) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L} ${L}" width="${L}" height="${L}"><g fill="${TINTA[tono]}">${fn(tono)}</g></svg>`;
  writeFileSync(new URL(`02-${id}-${tono}.svg`, out), svg);
  console.log(id, tono, (svg.length / 1024).toFixed(1) + ' KB');
}
