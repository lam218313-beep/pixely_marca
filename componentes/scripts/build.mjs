// Genera artifact/index.html (un solo archivo) con todos los componentes a partir de src/components/*.js
import { readFileSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';
import fundamentos from '../src/components/fundamentos.js';
import botones from '../src/components/botones.js';
import campos from '../src/components/campos.js';
import navegacion from '../src/components/navegacion.js';
import indicadores from '../src/components/indicadores.js';
import tarjetas from '../src/components/tarjetas.js';
import calendarios from '../src/components/calendarios.js';
import precios from '../src/components/precios.js';
import datos from '../src/components/datos.js';
import overlays from '../src/components/overlays.js';
import estados from '../src/components/estados.js';
import contenido from '../src/components/contenido.js';
import { kitCSS, kitHTML, kitJS, kitNav } from './kit.mjs';

const NOTCH = /--notch:\s*(polygon\([^;]+\));/.exec(readFileSync(new URL('../../../pixely_web/src/styles/tokens.css', import.meta.url), 'utf8'))[1];

const CATS = [
  ['fundamentos', 'Fundamentos', 'Colores, texto, formas, íconos y marca. Todo lo demás se construye con esto.', fundamentos],
  ['botones', 'Botones', 'Acciones: principal, secundaria, de ícono y las de la web.', botones],
  ['campos', 'Campos y controles', 'Para escribir, elegir y activar.', campos],
  ['navegacion', 'Navegación', 'Barras, menús y selectores de vista.', navegacion],
  ['indicadores', 'Etiquetas e indicadores', 'Estados, avisos, contadores y ayudas.', indicadores],
  ['tarjetas', 'Tarjetas y listas', 'Contenedores y filas que agrupan información.', tarjetas],
  ['calendarios', 'Calendarios y fechas', 'Mes, semana y selectores de fecha.', calendarios],
  ['precios', 'Planes y precios', 'Tarjetas de plan y comparativas.', precios],
  ['datos', 'Datos y gráficos', 'Cifras, barras, anillos y tablas.', datos],
  ['overlays', 'Paneles y aprobación', 'Capas sobre la pantalla y el flujo de validar.', overlays],
  ['estados', 'Estados y pantallas', 'Cargando, error, vacío y entrada.', estados],
  ['contenido', 'Contenido de la web', 'Títulos, preguntas, secciones y pie.', contenido],
];
const all = CATS.flatMap(([, , , l]) => l);
const css = all.map((c) => `/* ${c.nombre} */\n${c.css}`).join('\n').replace('{{NOTCH}}', NOTCH);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pretty = (h) => h.replace(/<svg[^>]*data-i="([^"]+)"[^>]*>.*?<\/svg>/g, '<!-- ícono: $1 -->').replace(/></g, '>\n<').trim();
const cssShow = (c) => c.css.replace('{{NOTCH}}', 'polygon(…)  /* ver tokens.css de pixely_web */');

const art = (c) => {
  const li = (a) => (a || []).map((x) => `<li>${x}</li>`).join('');
  const usa = (c.usa || []).map((id) => { const o = all.find((x) => x.id === id); return o ? `<a href="#${id}" data-go="${id}">${o.nombre}</a>` : ''; }).join('');
  return `<article class="comp" id="${c.id}" data-cat="${c.cat}" data-origen="${c.origen}" data-estado="${c.estado}" data-q="${esc((c.nombre + ' ' + c.desc + ' ' + c.id).toLowerCase())}">
<header class="comp__h"><h3>${c.nombre}</h3><div class="comp__chips"><span class="chip chip--${c.origen === 'Partners' ? 'p' : c.origen === 'Web' ? 'w' : 'a'}">${c.origen}</span><span class="chip chip--${c.estado === 'Existe' ? 'ok' : 'new'}">${c.estado}</span></div></header>
<p class="comp__d">${c.desc}</p>
<div class="stage stage--${c.stage}"${c.replay ? ' data-replay' : ''}>${c.replay ? '<button class="replay" type="button" data-replay-btn>↻ Repetir animación</button>' : ''}<div class="stage__in">${c.html}</div></div>
<div class="comp__n"><div><h4>Cuándo usarlo</h4><ul>${li(c.usar)}</ul></div><div><h4>Qué evitar</h4><ul>${li(c.evitar)}</ul></div></div>
<details class="code"><summary>Ver código</summary><div class="code__tabs" role="tablist"><button class="is-on" data-tab="html" role="tab">HTML</button><button data-tab="css" role="tab">CSS</button></div>
<div class="code__p" data-p="html"><button class="copy" data-copy>Copiar</button><pre>${esc(pretty(c.html))}</pre></div><div class="code__p" data-p="css" hidden><button class="copy" data-copy>Copiar</button><pre>${esc(cssShow(c))}</pre></div></details>
<footer class="comp__f"><span>Origen: <code>${c.fuente}</code></span>${usa ? `<span class="comp__u">Usa: ${usa}</span>` : ''}</footer></article>`;
};

const nav = CATS.map(([id, t, , l]) => `<a href="#cat-${id}" data-catlink="${id}">${t}<b>${l.length}</b></a>`).join('');
const sections = CATS.map(([id, t, d, l]) => `<section class="cat" id="cat-${id}" data-cat="${id}"><header class="cat__h"><h2>${t}</h2><p>${d}</p></header>${l.map(art).join('\n')}</section>`).join('\n');
const nEx = all.filter((c) => c.estado === 'Existe').length, nPr = all.length - nEx;

const shell = readFileSync(new URL('./shell.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('./shell.js', import.meta.url), 'utf8');
// Motor de Thinking Orbs empaquetado en línea (el Artifact es una sola página)
const orbs = (await build({ entryPoints: [new URL('../src/orbs.js', import.meta.url).pathname], bundle: true, format: 'iife', minify: true, write: false })).outputFiles[0].text;
const html = `<title>Componentes Pixely</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@300..800&family=Unbounded:wght@300..900&display=swap">
<style>
${shell}
/* ===== Componentes ===== */
${css}
${kitCSS}
</style>
<div class="app">
<aside class="side"><a class="side__logo" href="#top"><span class="p-wordmark">pixely<b>.</b></span></a><p class="side__t">Marca y componentes de interfaz</p>${kitNav}<nav id="nav">${nav}</nav></aside>
<main id="top"><div id="comp"><header class="top"><p class="top__e">Repositorio de interfaz</p><h1>Piezas de interfaz de Pixely<span>.</span></h1>
<p class="top__l">Cada componente, uno por uno, con su estado real, cuándo usarlo y su código listo para copiar. Salen de Pixely Partners y de pixely.pe; los marcados como “Propuesto” aún no existen y se diseñan aquí primero.</p>
<div class="top__s"><span><b>${all.length}</b> componentes</span><span><b>${nEx}</b> existen</span><span><b>${nPr}</b> propuestos</span></div>
<div class="filters"><input id="q" type="search" placeholder="Buscar: botón, calendario, plan…" aria-label="Buscar componente">
<div class="fg" data-f="origen" role="group" aria-label="Origen"><button class="is-on" data-v="">Todos</button><button data-v="Partners">Partners</button><button data-v="Web">Web</button></div>
<div class="fg" data-f="estado" role="group" aria-label="Estado"><button class="is-on" data-v="">Todos</button><button data-v="Existe">Existen</button><button data-v="Propuesto">Propuestos</button></div></div></header>
${sections}
<p class="none" id="none" hidden>Ningún componente coincide con la búsqueda.</p>
<footer class="end">Todo parte de los mismos tokens de marca. El kit de logos, fuentes, colores y QR está en <a href="#redes">Redes sociales</a>.</footer></div>
${kitHTML()}</main></div>
<script>
${js}
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script>
${kitJS()}
</script>
<script>
${orbs}
</script>
`;
writeFileSync(new URL('../artifact/index.html', import.meta.url), html);
console.log('ok', all.length, 'componentes', (html.length / 1024).toFixed(0) + ' KB');
