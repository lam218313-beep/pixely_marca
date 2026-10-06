// Fuente única de la marca: tokens/tokens.json -> CSS, TypeScript (videos) y Python (PDFs/imágenes).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const t = JSON.parse(readFileSync(new URL('../tokens/tokens.json', import.meta.url)));
mkdirSync(new URL('../exports/', import.meta.url), { recursive: true });
const kebab = (s) => s.replace(/([A-Z0-9])/g, '-$1').toLowerCase();
const css = `/* GENERADO por scripts/tokens.mjs desde tokens/tokens.json. No editar a mano. */
:root {
${Object.entries(t.color).map(([k, v]) => `  --${kebab(k)}: ${v};`).join('\n')}
  --font-titulo: '${t.fuente.titulo}', system-ui, sans-serif;
  --font-texto: '${t.fuente.texto}', system-ui, sans-serif;
  --radio-control: ${t.radio.control}px;
  --radio-tarjeta: ${t.radio.tarjeta}px;
}
`;
writeFileSync(new URL('../src/tokens.css', import.meta.url), css);
writeFileSync(new URL('../exports/tokens.ts', import.meta.url),
`// GENERADO por scripts/tokens.mjs. Copiar a pixely_videos/src/marca.ts (colores y fuentes).
export const colores = ${JSON.stringify(t.color, null, 2)} as const;
export const fuentes = ${JSON.stringify(t.fuente)} as const;
export const radios = ${JSON.stringify(t.radio)} as const;
`);
writeFileSync(new URL('../exports/tokens.py', import.meta.url),
`# GENERADO por scripts/tokens.mjs. Importar desde los scripts de PDFs e imágenes.
COLOR = ${JSON.stringify(t.color, null, 4)}
FUENTE = ${JSON.stringify(t.fuente)}
RADIO = ${JSON.stringify(t.radio)}
`);
console.log('tokens ok');
