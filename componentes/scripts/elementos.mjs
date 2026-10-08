// Página "Elementos gráficos" del catálogo: la lista de piezas gráficas que se diseñan una por una.
// Los documentos solo usan lo que aquí está Aprobado. Datos en elementos/elementos.json.
import { readFileSync } from 'node:fs';

const datos = JSON.parse(readFileSync(new URL('../../elementos/elementos.json', import.meta.url), 'utf8'));
const ESTADOS = ['Por diseñar', 'En diseño', 'Aprobado', 'Rechazado'];
const clase = (e) => ({ 'Por diseñar': 'pend', 'En diseño': 'prog', Aprobado: 'ok', Rechazado: 'no' })[e];

export const elemNav = `<a class="side__comp side__elem" href="#elementos">Elementos gráficos <b>${datos.elementos.length}</b></a>`;

export const elemHTML = () => {
  const cuenta = Object.fromEntries(ESTADOS.map((s) => [s, datos.elementos.filter((e) => e.estado === s).length]));
  const tarjeta = (e) => `<article class="el" id="e-${e.n}">
    <header class="el__h"><span class="el__n">${String(e.n).padStart(2, '0')}</span><h3>${e.nombre}</h3><span class="el__st el__st--${clase(e.estado)}">${e.estado}</span></header>
    <p class="el__i">${e.intencion}</p>
    <div class="el__m"><span class="el__p el__p--${e.prioridad}">Prioridad ${e.prioridad}</span>${e.usos.map((u) => `<span class="el__u">${u}</span>`).join('')}</div>
    ${e.historial ? `<p class="el__hist">${e.historial}</p>` : ''}
    <div class="el__slot">${e.estado === 'Aprobado' ? '' : 'Aquí van las propuestas cuando se diseñe.'}</div></article>`;
  return `<section id="elementos" class="kit elems" hidden aria-labelledby="el-t">
<header class="kit__top">
  <p class="top__e">Elementos gráficos</p>
  <h1 id="el-t">Pieza por pieza<span>.</span></h1>
  <p class="top__l">Cada elemento gráfico se diseña aquí, solo y con sus variantes, antes de usarse. Los PDF, la web, los videos y las redes usan únicamente lo que está <b>Aprobado</b>; nada se inventa dentro de un documento.</p>
  <ol class="el-flow">
    <li><b>Intención</b><span>Qué tiene que lograr y dónde se usa.</span></li>
    <li><b>Referencias</b><span>Tú traes inspiración, o te propongo 2 o 3 direcciones con nuestro sistema.</span></li>
    <li><b>Propuestas</b><span>Se diseña aquí con variantes: claro, oscuro y tamaños.</span></li>
    <li><b>Aprobado</b><span>Recién ahí pasa a los documentos.</span></li>
  </ol>
  <div class="top__s">${ESTADOS.map((s) => `<span><b>${cuenta[s]}</b> ${s.toLowerCase()}</span>`).join('')}</div>
</header>
${datos.grupos.map((g) => {
    const lista = datos.elementos.filter((e) => e.grupo === g.id);
    return lista.length ? `<section class="kblk"><header class="kblk__h"><h2>${g.nombre}</h2><p>${g.desc}</p></header><div class="els">${lista.map(tarjeta).join('')}</div></section>` : '';
  }).join('\n')}
</section>`;
};

export const elemCSS = `
/* ===== Página Elementos gráficos ===== */
.side__elem{display:flex;justify-content:space-between;align-items:center}.side__elem b{font:700 11px Manrope;color:var(--text-3)}
.top__l b{color:#fff}
.el-flow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:24px;counter-reset:paso;list-style:none;padding:0}
.el-flow li{position:relative;padding:14px 14px 14px 46px;border:1px solid var(--edge);border-radius:18px;background:var(--ink);counter-increment:paso}
.el-flow li::before{content:counter(paso);position:absolute;left:14px;top:14px;display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--pink);font:800 12px Manrope}
.el-flow b{display:block;font:800 14px Manrope}.el-flow span{display:block;margin-top:3px;color:var(--text-3);font:600 13px/1.4 Manrope}
.els{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:12px}
.el{display:flex;flex-direction:column;gap:10px;padding:16px;border:1px solid var(--edge);border-radius:22px;background:var(--ink);scroll-margin-top:16px}
.el__h{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:start}
.el__n{font:700 14px Unbounded;color:var(--pink);padding-top:2px}
.el__h h3{font:700 15px/1.3 Unbounded;letter-spacing:-.02em}
.el__st{height:24px;display:inline-flex;align-items:center;padding:0 10px;border-radius:99px;font:800 11px Manrope;white-space:nowrap}
.el__st--pend{border:1px dashed var(--line);color:var(--text-2)}.el__st--prog{background:var(--raised);color:#fff}
.el__st--ok{background:rgba(235,12,110,.16);color:var(--pink)}.el__st--no{background:var(--card);color:var(--text-3);text-decoration:line-through}
.el__i{color:var(--text-2);font:600 14px/1.5 Manrope}
.el__m{display:flex;flex-wrap:wrap;gap:6px}
.el__u,.el__p{height:24px;display:inline-flex;align-items:center;padding:0 9px;border-radius:99px;background:var(--card);color:var(--text-2);font:700 11px Manrope}
.el__p--1{background:var(--pink);color:#fff}.el__p--2{background:var(--raised);color:#fff}
.el__hist{padding:10px 12px;border-radius:12px;background:var(--card);color:var(--text-3);font:600 12px/1.45 Manrope}
.el__slot{display:grid;place-items:center;min-height:84px;margin-top:auto;border:1.5px dashed var(--edge);border-radius:14px;color:var(--text-3);font:600 12px Manrope;text-align:center;padding:8px}
@media (max-width:900px){.el-flow{grid-template-columns:1fr 1fr}}
@media (max-width:520px){.el-flow{grid-template-columns:1fr}}
`;
