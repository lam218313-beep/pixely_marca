import { ic, iconNames } from '../icons.js';
const cat = 'fundamentos';

const sw = (n, v, t, extra = '') => `<div class="t-sw" style="background:${v};color:${extra || '#fff'}"><b>${n}</b><span>${v}</span><small>${t}</small></div>`;

export default [
  {
    id: 'tokens-superficies', cat, nombre: 'Superficies y bordes', origen: 'Ambos', estado: 'Existe', fuente: 'frontend/app/src/styles.css · pixely_web/src/styles/tokens.css',
    desc: 'El sistema “Noche”: negros por capas. Cada capa es un poco más clara que la de abajo; el rosa se reserva para lo que hay que hacer.',
    usar: ['Fondo de pantalla: ink. Tarjetas: card. Paneles y chips neutros: raised.', 'Borde de tarjeta: edge. Borde de control (botones, campos): line.'],
    evitar: ['Grises nuevos fuera de esta escala.', 'Blanco como fondo en la app.'],
    stage: 'ink',
    html: `<div class="t-grid">${sw('ink', '#0A0A0C', 'Fondo')}${sw('card', '#16161B', 'Tarjeta')}${sw('raised', '#1F1F26', 'Panel / chip')}${sw('edge', '#26262E', 'Borde de tarjeta')}${sw('line', '#33333C', 'Borde de control')}${sw('mute', '#4A4A55', 'Pendiente en barras')}</div>`,
    css: `:root{
  --ink:#0A0A0C; --card:#16161B; --raised:#1F1F26;
  --edge:#26262E; --line:#33333C; --mute:#4A4A55;
}`,
  },
  {
    id: 'tokens-texto', cat, nombre: 'Texto y acento', origen: 'Ambos', estado: 'Existe', fuente: 'frontend/app/src/styles.css',
    desc: 'Cuatro niveles de texto sobre negro y un solo rosa. Texto blanco sobre rosa; nunca negro sobre rosa.',
    usar: ['text-2 para descripciones; text-3 para datos secundarios y etiquetas.', 'Rosa como texto solo en títulos grandes, cifras, errores y enlaces de acción.'],
    evitar: ['Texto negro sobre fondo rosa.', 'Un segundo color de acento.'],
    stage: 'ink',
    html: `<div class="t-grid">${sw('text', '#FFFFFF', 'Principal', '#0A0A0C').replace('background:#FFFFFF', 'background:#FFFFFF')}${sw('text-soft', '#E4E4EA', 'Cuerpo largo', '#0A0A0C')}${sw('text-2', '#B4B4BE', 'Descripción', '#0A0A0C')}${sw('text-3', '#8A8A96', 'Dato secundario', '#0A0A0C')}${sw('pink', '#EB0C6E', 'Acento y botón')}${sw('pink-soft', '#FFC2E1', 'Texto sobre rosa')}</div>`,
    css: `:root{
  --text:#FFFFFF; --text-soft:#E4E4EA; --text-2:#B4B4BE; --text-3:#8A8A96;
  --pink:#EB0C6E; --pink-soft:#FFC2E1;
}`,
  },
  {
    id: 'tokens-tipografia', cat, nombre: 'Escala tipográfica', origen: 'Ambos', estado: 'Existe', fuente: 'frontend/app/src/styles.css · pixely_web/src/styles/components.css',
    desc: 'Unbounded para títulos y cifras; Manrope para todo lo demás. Los títulos terminan con el punto rosa.',
    usar: ['Título de pantalla: Unbounded 700, 28 px (36 px en computadora).', 'Etiqueta de sección: Manrope 800, 12 px, mayúsculas, espaciado 0.12em.', 'Campos de 16 px como mínimo para que iOS no haga zoom.'],
    evitar: ['Más de dos familias.', 'Cuerpo de texto menor a 13 px.'],
    stage: 'ink',
    html: `<div class="t-type">
<p class="t-eyebrow">Etiqueta de sección</p>
<h3 class="t-h1">Título de pantalla<span class="t-dot">.</span></h3>
<p class="t-h2">Título de bloque</p>
<p class="t-big">3,600</p>
<p class="t-body">Párrafo en Manrope 400/600. Frases cortas, directas y en español de Perú.</p>
<p class="t-small">Dato secundario en 13 px</p>
</div>`,
    css: `.t-eyebrow{font:800 12px/1.2 Manrope,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--text-3)}
.t-h1{font:700 28px/1.1 Unbounded,sans-serif;letter-spacing:-.04em}
.t-dot{color:var(--pink)}
.t-h2{font:700 20px/1.2 Unbounded,sans-serif;letter-spacing:-.04em}
.t-big{font:700 48px/1 Unbounded,sans-serif;letter-spacing:-.04em}
.t-body{font:600 15px/1.6 Manrope,sans-serif;color:var(--text-2)}
.t-small{font:700 13px/1.4 Manrope,sans-serif;color:var(--text-3)}`,
  },
  {
    id: 'tokens-forma', cat, nombre: 'Radios y espaciado', origen: 'Ambos', estado: 'Existe', fuente: 'frontend/app/src/styles.css',
    desc: 'Esquinas generosas y consistentes: cuanto más grande el objeto, más redondo.',
    usar: ['Controles (botones, campos): 16. Chips y avatares: círculo completo.', 'Tarjetas: 24. Paneles que suben desde abajo: 32 arriba.', 'Margen lateral de pantalla: 20. Separación entre tarjetas: 12.'],
    evitar: ['Esquinas rectas.', 'Radios intermedios (10, 18…) salvo los ya definidos en piezas internas.'],
    stage: 'ink',
    html: `<div class="t-radii"><div><i style="border-radius:16px"></i><span>16 · control</span></div><div><i style="border-radius:24px"></i><span>24 · tarjeta</span></div><div><i style="border-radius:32px 32px 0 0"></i><span>32 · panel</span></div><div><i style="border-radius:50%"></i><span>círculo · chip</span></div></div>`,
    css: `:root{--r-control:16px; --r-card:24px; --r-sheet:32px}`,
  },
  {
    id: 'iconos-interfaz', cat, nombre: 'Íconos de interfaz', origen: 'Partners', estado: 'Existe', fuente: 'lucide-react (frontend/app)',
    desc: 'Trazo redondeado de 2.2 px, 20–24 px. Siempre acompañan una palabra o llevan etiqueta accesible.',
    usar: ['Color: hereda el del texto (currentColor).', 'Estados llevan ícono + palabra, nunca solo color.'],
    evitar: ['Íconos rellenos mezclados con los de trazo.', 'Ícono sin etiqueta cuando es el único contenido de un botón.'],
    stage: 'ink',
    html: `<div class="t-icons">${iconNames.map((n) => `<span title="${n}">${ic(n, 24)}<small>${n}</small></span>`).join('')}</div>`,
    css: `/* Usar con SVG inline */
svg{fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}`,
  },
  {
    id: 'marca-wordmark', cat, nombre: 'Marca: palabra con punto', origen: 'Ambos', estado: 'Existe', fuente: 'frontend/app/src/ui/Screen.tsx · pixely_web header',
    desc: 'La palabra “pixely” en Unbounded 800 con un punto rosa. El mismo punto cierra cada título.',
    usar: ['Sobre rosa, el punto pasa a negro.'],
    evitar: ['Cambiar la fuente o el color del punto.'],
    stage: 'ink',
    html: `<div class="t-marks"><span class="p-wordmark">pixely<b>.</b></span><span class="p-wordmark" style="font-size:40px">pixely<b>.</b></span><div style="background:#EB0C6E;padding:14px 22px;border-radius:16px"><span class="p-wordmark p-wordmark--onpink">pixely<b>.</b></span></div></div>`,
    css: `.p-wordmark{font:800 22px/1 Unbounded,sans-serif;letter-spacing:-.01em}
.p-wordmark b{color:var(--pink)}
.p-wordmark--onpink b{color:var(--ink)}`,
  },
];
