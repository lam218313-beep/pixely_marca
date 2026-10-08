// Exporta el elemento 01 (arte de portada con esferas) a SVG vectorial, listo para PDF e imprenta.
// node elementos/01/exportar.mjs → public/elementos/01-<direccion>-<tono>.svg
import { mkdirSync, writeFileSync } from 'node:fs';
import { arte, DIRECCIONES, QUIETO } from '../../componentes/src/arte-orbe.js';

const LADO = 1000;
const out = new URL('../../public/elementos/', import.meta.url);
mkdirSync(out, { recursive: true });
const f = (v) => +v.toFixed(1);

export function svg(dir, tono, t = QUIETO[dir]) {
  const { halos, lines, dots } = arte(dir, LADO, t, tono);
  const defs = halos.map((h, i) => `<radialGradient id="h${i}"><stop offset="0" stop-color="${h.c}" stop-opacity="${h.a.toFixed(3)}"/><stop offset="1" stop-color="${h.c}" stop-opacity="0"/></radialGradient>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LADO} ${LADO}" width="${LADO}" height="${LADO}">`
    + (defs ? `<defs>${defs}</defs>` : '')
    + halos.map((h, i) => `<circle cx="${f(h.x)}" cy="${f(h.y)}" r="${f(h.r)}" fill="url(#h${i})"/>`).join('')
    + (lines.length ? `<g stroke-linecap="round">${lines.map((l) => `<line x1="${f(l.x1)}" y1="${f(l.y1)}" x2="${f(l.x2)}" y2="${f(l.y2)}" stroke="${l.c}" stroke-width="${f(l.w)}"/>`).join('')}</g>` : '')
    + dots.map((d) => `<circle cx="${f(d.x)}" cy="${f(d.y)}" r="${+d.r.toFixed(2)}" fill="${d.c}"/>`).join('')
    + '</svg>';
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const dir of Object.keys(DIRECCIONES)) for (const tono of ['oscuro', 'claro']) {
    const s = svg(dir, tono);
    writeFileSync(new URL(`01-${dir}-${tono}.svg`, out), s);
    console.log(dir, tono, (s.length / 1024).toFixed(0) + ' KB');
  }
}
