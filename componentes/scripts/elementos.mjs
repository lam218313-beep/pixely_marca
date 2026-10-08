// Página "Elementos gráficos" del catálogo: la lista de piezas gráficas que se diseñan una por una.
// Los documentos solo usan lo que aquí está Aprobado. Datos en elementos/elementos.json.
import { readFileSync } from 'node:fs';

const datos = JSON.parse(readFileSync(new URL('../../elementos/elementos.json', import.meta.url), 'utf8'));
const ESTADOS = ['Por diseñar', 'En diseño', 'Aprobado', 'Rechazado'];
const clase = (e) => ({ 'Por diseñar': 'pend', 'En diseño': 'prog', Aprobado: 'ok', Rechazado: 'no' })[e];

// Elemento aprobado: vivo (animado), puesto en las piezas donde se usa, sus reglas y sus archivos.
const FAMILIA = [['working', 'trabajando'], ['searching', 'buscando'], ['solving', 'resolviendo'], ['listening', 'escuchando'], ['connecting', 'conectando'], ['weaving', 'tejiendo'], ['composing', 'componiendo'], ['breathing', 'respirando'], ['shaping', 'dando forma']];
const img = (n, tono) => `<img src="elementos/0${n}-${tono}.svg" alt="" loading="lazy">`;
const final = (e) => `<div class="prs"><div class="pr">
    <div class="pr__h"><span class="pr__l">✓</span><div><h4>${e.final.nombre}</h4><p>${e.final.dice}</p></div></div>
    <div class="pr__g">
      <figure class="pr__vivo"><canvas data-arte data-tono="oscuro" aria-label="${e.final.nombre}, animada"></canvas><figcaption>En movimiento · redes, web y reels</figcaption></figure>
      <figure><div class="mk mk--tarjeta">${img(e.n, 'oscuro')}<span class="mk__wm">pixely<b>.</b></span><b class="mk__h">Publicidad<br>que vende<i>.</i></b><span class="mk__u">PIXELY.PE</span></div><figcaption>Tarjeta · frente</figcaption></figure>
      <figure><div class="mk mk--portada">${img(e.n, 'oscuro')}<span class="mk__wm">pixely<b>.</b></span><b class="mk__h">Publicidad<br>que vende<i>.</i></b><span class="mk__t"></span><span class="mk__t mk__t--c"></span><span class="mk__f"></span></div><figcaption>Brochure · portada</figcaption></figure>
      <figure><div class="mk mk--post">${img(e.n, 'oscuro')}<b class="mk__h">Leemos<br>tu mercado<i>.</i></b><span class="mk__wm">pixely<b>.</b></span></div><figcaption>Post 4:5</figcaption></figure>
      <figure><div class="mk mk--claro">${img(e.n, 'claro')}<span class="mk__wm">pixely<b>.</b></span><b class="mk__h">Hablemos<i>.</i></b><span class="mk__t"></span><span class="mk__t mk__t--c"></span></div><figcaption>Versión clara</figcaption></figure>
    </div>
    <ul class="pr__r">${e.final.reglas.map((r) => `<li>${r}</li>`).join('')}</ul>
    <p class="pr__dl">SVG para imprenta y Canva: <a href="elementos/0${e.n}-oscuro.svg" download>fondo negro</a> · <a href="elementos/0${e.n}-claro.svg" download>fondo blanco</a></p>
  </div>
    <div class="pr pr--fam"><h4>De dónde sale</h4><p>Las 9 esferas de carga de Partners. La base es «componiendo».</p>
      <div class="fam">${FAMILIA.map(([id, nom]) => `<span${id === 'composing' ? ' class="is-on"' : ''}><canvas data-orb="${id}" data-size="64"></canvas>${nom}</span>`).join('')}</div></div></div>`;

export const elemNav = `<a class="side__comp side__elem" href="#elementos">Elementos gráficos <b>${datos.elementos.length}</b></a>`;

export const elemHTML = () => {
  const cuenta = Object.fromEntries(ESTADOS.map((s) => [s, datos.elementos.filter((e) => e.estado === s).length]));
  const tarjeta = (e) => `<article class="el${e.final ? ' el--ancho' : ''}" id="e-${e.n}">
    <header class="el__h"><span class="el__n">${String(e.n).padStart(2, '0')}</span><h3>${e.nombre}</h3><span class="el__st el__st--${clase(e.estado)}">${e.estado}</span></header>
    <p class="el__i">${e.intencion}</p>
    <div class="el__m"><span class="el__p el__p--${e.prioridad}">Prioridad ${e.prioridad}</span>${e.usos.map((u) => `<span class="el__u">${u}</span>`).join('')}</div>
    ${e.historial ? `<p class="el__hist">${e.historial}</p>` : ''}
    ${e.final ? final(e) : '<div class="el__slot">Aquí van las propuestas cuando se diseñe.</div>'}</article>`;
  return `<section id="elementos" class="kit elems" hidden aria-labelledby="el-t">
<header class="kit__top">
  <p class="top__e">Elementos gráficos</p>
  <h1 id="el-t">Pieza por pieza<span>.</span></h1>
  <p class="top__l">Cada elemento gráfico se diseña aquí, solo y con sus variantes, antes de usarse. Los PDF, la web, los videos y las redes usan únicamente lo que está <b>Aprobado</b>; nada se inventa dentro de un documento.</p>
  <ol class="el-flow">
    <li><b>Intención</b><span>Qué tiene que lograr y dónde se usa.</span></li>
    <li><b>Referencias</b><span>Tú traes inspiración, o te propongo 2 o 3 direcciones con nuestro sistema.</span></li>
    <li><b>Propuestas</b><span>Se diseña aquí con variantes: claro, oscuro y tamaños.</span></li>
    <li><b>Aprobado</b><span>Recién ahí puede usarse.</span></li>
    <li><b>Página por página</b><span>Con todos los elementos listos, cada documento se arma y se aprueba página por página.</span></li>
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
.el-flow{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-top:24px;counter-reset:paso;list-style:none;padding:0}
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
/* Elemento aprobado */
.el--ancho{grid-column:1/-1}
.prs{display:grid;gap:12px;margin-top:4px}
.pr{padding:16px;border-radius:18px;background:var(--card)}
.pr__h{display:grid;grid-template-columns:auto minmax(0,1fr);gap:12px;align-items:start}
.pr__l{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--pink);font:800 15px Unbounded}
.pr h4{font:700 15px/1.3 Unbounded;letter-spacing:-.02em}.pr__h p,.pr--fam>p{margin-top:4px;color:var(--text-2);font:600 13.5px/1.5 Manrope;max-width:760px}
.pr__h small{display:block;margin-top:4px;color:var(--text-3);font:700 11px Manrope}
.pr__g{display:grid;grid-template-columns:1.25fr 1.25fr .8fr .8fr .8fr;gap:12px;margin-top:14px;align-items:end}
.pr__g figure{display:grid;gap:6px;margin:0}.pr__g figcaption{color:var(--text-3);font:700 11px Manrope;text-align:center}
.pr__vivo canvas{display:block;width:100%;aspect-ratio:1;border-radius:14px;background:#0A0A0C}
.mk{position:relative;overflow:hidden;border-radius:10px;background:#0A0A0C;color:#fff;box-shadow:0 0 0 1px var(--edge);container-type:inline-size}
.mk img{position:absolute;display:block;pointer-events:none}
.mk__wm{position:absolute;font:700 8cqw Unbounded;letter-spacing:-.04em}.mk__wm b,.mk__h i{color:var(--pink);font-style:normal}
.mk__h{position:absolute;font:700 9cqw/1.05 Unbounded;letter-spacing:-.045em}
.mk__u{position:absolute;font:800 3cqw Manrope;letter-spacing:.2em;color:#8A8A96}
.mk__t{position:absolute;height:2.4cqw;border-radius:9px;background:#33333C}.mk__f{position:absolute;border-radius:6px;background:#1F1F26}
.mk--tarjeta{aspect-ratio:85/55}.mk--tarjeta img{left:49%;top:6%;width:80%}
.mk--tarjeta .mk__wm{left:7%;top:10%;font-size:7cqw}.mk--tarjeta .mk__h{left:7%;bottom:21%;font-size:7cqw}.mk--tarjeta .mk__u{left:7%;bottom:10%;font-size:2.6cqw}
.mk--portada{aspect-ratio:210/297}.mk--portada img{right:-66%;top:3%;width:100%}
.mk--portada .mk__wm{left:7%;top:5%;font-size:6cqw}.mk--portada .mk__h{left:7%;top:22%;font-size:11cqw}
.mk--portada .mk__t{left:7%;top:47%;width:50%}.mk--portada .mk__t--c{top:52%;width:38%}.mk--portada .mk__f{left:7%;right:7%;top:60%;bottom:5%}
.mk--post{aspect-ratio:4/5}.mk--post img{left:-6%;bottom:-34%;width:112%}
.mk--post .mk__h{left:8%;top:8%;font-size:10cqw}.mk--post .mk__wm{right:8%;top:9%;font-size:6cqw}
.mk--claro{aspect-ratio:210/297;background:#fff;color:#0A0A0C}.mk--claro img{right:-60%;top:2%;width:90%}
.mk--claro .mk__wm{left:7%;top:5%;font-size:6cqw}.mk--claro .mk__h{left:7%;top:24%;font-size:11cqw}
.mk--claro .mk__t{left:7%;top:38%;width:46%;background:#E4E4EA}.mk--claro .mk__t--c{top:43%;width:34%}
.pr__r{display:grid;gap:4px;margin:14px 0 0;padding-left:18px;list-style:disc;color:var(--text-2);font:600 13px/1.5 Manrope}
.pr__dl{margin-top:12px;color:var(--text-3);font:700 12px Manrope}.pr__dl a{color:var(--text-1,#fff);text-decoration:underline;text-underline-offset:3px}
.fam{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px}.fam span{display:grid;justify-items:center;gap:4px;padding:6px;border-radius:12px;color:var(--text-3);font:700 11px Manrope}.fam .is-on{background:var(--raised);color:#fff}
@media (max-width:1100px){.pr__g{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:900px){.el-flow{grid-template-columns:1fr 1fr}}
@media (max-width:520px){.el-flow{grid-template-columns:1fr}.pr__g{grid-template-columns:1fr 1fr}}
`;
