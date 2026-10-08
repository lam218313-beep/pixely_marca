// Exporta el elemento 01 (arte de portada «componiendo») a SVG vectorial, listo para PDF e imprenta.
// node elementos/01/exportar.mjs → public/elementos/01-oscuro.svg y 01-claro.svg
import { mkdirSync, writeFileSync } from 'node:fs';
import { arte, QUIETO } from '../../componentes/src/arte-orbe.js';

const LADO = 1000;
const out = new URL('../../public/elementos/', import.meta.url);
mkdirSync(out, { recursive: true });
const f = (v) => +v.toFixed(1);

export function svg(tono, t = QUIETO) {
  const { dots } = arte(LADO, t, tono);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LADO} ${LADO}" width="${LADO}" height="${LADO}">`
    + dots.map((d) => `<circle cx="${f(d.x)}" cy="${f(d.y)}" r="${+d.r.toFixed(2)}" fill="${d.c}"/>`).join('')
    + '</svg>';
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const tono of ['oscuro', 'claro']) {
    const s = svg(tono);
    writeFileSync(new URL(`01-${tono}.svg`, out), s);
    console.log(tono, (s.length / 1024).toFixed(0) + ' KB');
  }
}
