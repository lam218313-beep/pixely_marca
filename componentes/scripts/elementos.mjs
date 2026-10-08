// Página "Elementos gráficos" del catálogo: la lista de piezas gráficas que se diseñan una por una.
// Los documentos solo usan lo que aquí está Aprobado. Datos en elementos/elementos.json.
import { readFileSync } from 'node:fs';
import { VISTAS_EXTRA, vistasCSS } from './elementos-vistas.mjs';

const datos = JSON.parse(readFileSync(new URL('../../elementos/elementos.json', import.meta.url), 'utf8'));
const ESTADOS = ['Por diseñar', 'En diseño', 'Aprobado', 'Rechazado'];
const clase = (e) => ({ 'Por diseñar': 'pend', 'En diseño': 'prog', Aprobado: 'ok', Rechazado: 'no' })[e];

// Cómo se muestra cada elemento (su propuesta o el aprobado) puesto en las piezas donde se usa.
const fig = (cap, html) => `<figure>${html}<figcaption>${cap}</figcaption></figure>`;
const wm = (cls = '') => `<span class="mk__wm${cls}">pixely<b>.</b></span>`;

// 01 · Arte de portada
const FAMILIA = [['working', 'trabajando'], ['searching', 'buscando'], ['solving', 'resolviendo'], ['listening', 'escuchando'], ['connecting', 'conectando'], ['weaving', 'tejiendo'], ['composing', 'componiendo'], ['breathing', 'respirando'], ['shaping', 'dando forma']];
const img01 = (tono) => `<img src="elementos/01-${tono}.svg" alt="" loading="lazy">`;
const vista01 = () => [
  `<figure class="pr__vivo"><canvas data-arte data-tono="oscuro" aria-label="Arte de portada, animado"></canvas><figcaption>En movimiento · redes, web y reels</figcaption></figure>`,
  fig('Tarjeta · frente', `<div class="mk mk--tarjeta">${img01('oscuro')}${wm()}<b class="mk__h">Publicidad<br>que vende<i>.</i></b><span class="mk__u">PIXELY.PE</span></div>`),
  fig('Brochure · portada', `<div class="mk mk--portada">${img01('oscuro')}${wm()}<b class="mk__h">Publicidad<br>que vende<i>.</i></b><span class="mk__t"></span><span class="mk__t mk__t--c"></span><span class="mk__f"></span></div>`),
  fig('Post 4:5', `<div class="mk mk--post">${img01('oscuro')}<b class="mk__h">Leemos<br>tu mercado<i>.</i></b>${wm()}</div>`),
  fig('Versión clara', `<div class="mk mk--claro">${img01('claro')}${wm()}<b class="mk__h">Hablemos<i>.</i></b><span class="mk__t"></span><span class="mk__t mk__t--c"></span></div>`),
].join('');
const familia = () => `<div class="pr pr--fam"><h4>De dónde sale</h4><p>Las 9 esferas de carga de Partners. La base es «componiendo».</p>
  <div class="fam">${FAMILIA.map(([id, nom]) => `<span${id === 'composing' ? ' class="is-on"' : ''}><canvas data-orb="${id}" data-size="64"></canvas>${nom}</span>`).join('')}</div></div>`;

// 02 · Trama de marca (baldosa que se repite)
const trama = (p, tono, tam) => `style="background-image:url(elementos/02-${p.id}-${tono}.svg);background-size:${tam}cqw"`;
const vista02 = (p) => [
  fig('De cerca', `<div class="mk mk--zoom" ${trama(p, 'oscuro', 50)}></div>`),
  fig('Página del manual', `<div class="mk mk--portada" ${trama(p, 'oscuro', 20)}>${wm()}<b class="mk__h mk__h--s">Validar<br>una pieza<i>.</i></b><span class="mk__t"></span><span class="mk__t mk__t--c"></span><span class="mk__f mk__f--a"></span><span class="mk__f mk__f--b"></span></div>`),
  fig('Historia 9:16', `<div class="mk mk--historia" ${trama(p, 'oscuro', 20)}><b class="mk__h">Tú<br>apruebas<i>.</i></b><span class="mk__f mk__f--c"></span>${wm(' mk__wm--abajo')}</div>`),
  fig('Página blanca', `<div class="mk mk--claro" ${trama(p, 'claro', 20)}>${wm()}<b class="mk__h mk__h--s">Planes<i>.</i></b><span class="mk__t"></span><span class="mk__t mk__t--c"></span><span class="mk__f mk__f--d"></span></div>`),
].join('');

// 03 · Resplandor rosa (el de la vitrina de pixely.pe)
const RESPLANDOR = 'radial-gradient(60% 55% at 50% 38%, rgba(235, 12, 110, .20), transparent 70%)';
const cel = '<div class="mk__cel"><img src="capturas/m-inicio.webp" alt="" loading="lazy"></div>';
const vista03 = () => [
  fig('Detrás de una pantalla · web y brochure', `<div class="mk mk--vitrina" style="background:${RESPLANDOR},#0A0A0C">${cel}</div>`),
  fig('Saliendo de una esquina · portada de plan', `<div class="mk mk--portada" style="background:${RESPLANDOR.replace('at 50% 38%', 'at 0% 100%')},#0A0A0C">${wm()}<b class="mk__h">Plan<br>Pro<i>.</i></b><span class="mk__t"></span><span class="mk__t mk__t--c"></span></div>`),
  fig('Historia 9:16', `<div class="mk mk--historia" style="background:${RESPLANDOR.replace('at 50% 38%', 'at 50% 56%')},#0A0A0C"><b class="mk__h">Así se ve<br>tu app<i>.</i></b>${cel}</div>`),
].join('');

// 04 · Muesca (la de pixely.pe: tokens.css → --notch), convertida a trazo SVG para mostrarla a escala real
const NOTCH = /--notch:\s*polygon\(([^;]+)\);/.exec(readFileSync(new URL('../../../pixely_web/src/styles/tokens.css', import.meta.url), 'utf8'))[1];
const medida = (t, D) => {
  let m;
  if ((m = /^calc\((-?[\d.]+)% ([+-]) ([\d.]+)px\)$/.exec(t))) return (D * m[1]) / 100 + (m[2] === '+' ? 1 : -1) * m[3];
  if ((m = /^(-?[\d.]+)%$/.exec(t))) return (D * m[1]) / 100;
  return parseFloat(t);
};
const muesca = (W, H) => 'M' + NOTCH.split(',').map((pt) => pt.trim().match(/calc\([^)]*\)|\S+/g)).map(([x, y]) => `${+medida(x, W).toFixed(1)} ${+medida(y, H).toFixed(1)}`).join('L') + 'Z';
const lienzo = (W, H, alto, dentro, fuera) => `<svg class="mk mk--svg" viewBox="0 0 ${W} ${H}" style="aspect-ratio:${W}/${H}"><rect width="${W}" height="${H}" fill="#fff"/>${fuera}<path d="${muesca(W, alto)}" fill="#0A0A0C"/>${dentro}</svg>`;
const txt = (x, y, t, tam, color = '#fff', extra = '') => `<text x="${x}" y="${y}" font-family="Unbounded" font-weight="700" font-size="${tam}" letter-spacing="-.03em" fill="${color}"${extra}>${t}</text>`;
const barra = (x, y, w, h, c = '#E4E4EA', r = 10) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}"/>`;
const vista04 = () => [
  fig('Así está hoy en pixely.pe', lienzo(1000, 560, 330,
    `<text x="60" y="120" font-family="Manrope" font-weight="800" font-size="16" letter-spacing="3" fill="#8A8A96">PROCESO</text>${txt(60, 200, 'Así trabajamos<tspan fill="#EB0C6E">.</tspan>', 58)}`,
    `${barra(60, 400, 420, 18)}${barra(60, 436, 300, 18)}${barra(560, 390, 380, 120, '#F2F2F5', 24)}`)),
  fig('Brochure · cambio de sección', lienzo(794, 1123, 500,
    `${txt(56, 80, 'pixely<tspan fill="#EB0C6E">.</tspan>', 26)}${txt(56, 300, 'Así trabajamos<tspan fill="#EB0C6E">.</tspan>', 54)}`,
    `${barra(56, 580, 682, 150, '#F2F2F5', 24)}${barra(56, 750, 682, 150, '#F2F2F5', 24)}${barra(56, 940, 400, 16)}`)),
  fig('Historia 9:16', lienzo(1080, 1920, 1150,
    `${txt(90, 520, 'Tu marca,', 110)}${txt(90, 650, 'pieza por', 110)}${txt(90, 780, 'pieza<tspan fill="#EB0C6E">.</tspan>', 110)}`,
    `${barra(90, 1330, 900, 34)}${barra(90, 1400, 640, 34)}${txt(90, 1800, 'pixely<tspan fill="#EB0C6E">.</tspan>', 54, '#0A0A0C')}`)),
].join('');

const VISTAS = { 1: vista01, 2: vista02, 3: vista03, 4: vista04, ...VISTAS_EXTRA };
const dl = (ruta, txt) => `<button type="button" class="pr__a" data-dl="${ruta}" data-raiz>${txt}</button>`;
const DESCARGAS = {
  1: () => `SVG para imprenta y Canva: ${dl('elementos/01-oscuro.svg', 'fondo negro')} · ${dl('elementos/01-claro.svg', 'fondo blanco')}`,
  2: (p) => `Baldosa SVG que se repite sin costuras: ${dl(`elementos/02-${p.id}-oscuro.svg`, 'para fondo negro')} · ${dl(`elementos/02-${p.id}-claro.svg`, 'para fondo blanco')}`,
  3: () => `Fondos PNG para Canva: ${dl('elementos/03-cuadrado.png', 'cuadrado 1080')} · ${dl('elementos/03-historia.png', 'historia 1080 × 1920')} · En código: <code>${RESPLANDOR}</code>`,
};
const EXTRA = { 1: familia };
const bloque = (e, item, marca) => `<div class="pr">
    <div class="pr__h"><span class="pr__l">${marca}</span><div><h4>${item.nombre}</h4><p>${item.dice}</p></div></div>
    <div class="pr__g pr__g--${e.n}">${VISTAS[e.n](item)}</div>
    ${item.reglas ? `<ul class="pr__r">${item.reglas.map((r) => `<li>${r}</li>`).join('')}</ul>` : ''}
    ${DESCARGAS[e.n] ? `<p class="pr__dl">${DESCARGAS[e.n](item)}</p>` : ''}
  </div>`;
// Inventario: lo que ya existe en Partners, el catálogo, los PDF o la web, con un código para señalarlo.
const existentes = (e) => `<div class="pr"><div class="pr__h"><span class="pr__l">${e.existentes.length}</span><div><h4>Lo que ya tenemos</h4><p>Así se ve hoy en cada lugar donde existe. Para descartar uno, dime su código (por ejemplo ${e.existentes[0].cod}) o mándame una captura.</p></div></div>
    <div class="ex">${e.existentes.map((x) => `<figure class="ex__f${x.ancho ? ' ex__f--ancho' : ''}${x.descartado ? ' ex__f--no' : ''}"><figcaption><span class="ex__c">${x.cod}</span><span><b>${x.nombre}</b>${x.de}${x.descartado ? `<em>Descartado: ${x.descartado}</em>` : ''}</span></figcaption><img src="${x.img}" alt="${x.nombre}" loading="lazy"></figure>`).join('')}</div></div>`;
const cuerpo = (e) => {
  const items = e.final ? bloque(e, e.final, '✓') : (e.propuestas ? e.propuestas.map((p) => bloque(e, p, p.letra)).join('') : '') + (e.existentes ? existentes(e) : '');
  return items ? `<div class="prs">${items}${EXTRA[e.n] ? EXTRA[e.n]() : ''}</div>` : '<div class="el__slot">Aquí van las propuestas cuando se diseñe.</div>';
};

export const elemNav = `<a class="side__comp side__elem" href="#elementos">Elementos gráficos <b>${datos.elementos.length}</b></a>`;

export const elemHTML = () => {
  const cuenta = Object.fromEntries(ESTADOS.map((s) => [s, datos.elementos.filter((e) => e.estado === s).length]));
  const tarjeta = (e) => `<article class="el${e.final || e.propuestas || e.existentes ? ' el--ancho' : ''}" id="e-${e.n}">
    <header class="el__h"><span class="el__n">${String(e.n).padStart(2, '0')}</span><h3>${e.nombre}</h3><span class="el__st el__st--${clase(e.estado)}">${e.estado}</span></header>
    <p class="el__i">${e.intencion}</p>
    <div class="el__m"><span class="el__p el__p--${e.prioridad}">Prioridad ${e.prioridad}</span>${e.usos.map((u) => `<span class="el__u">${u}</span>`).join('')}</div>
    ${e.historial ? `<p class="el__hist">${e.historial}</p>` : ''}
    ${cuerpo(e)}</article>`;
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
/* Propuestas y elemento aprobado */
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
.mk--tarjeta{aspect-ratio:85/55}.mk--tarjeta>img{left:49%;top:6%;width:80%}
.mk--tarjeta .mk__wm{left:7%;top:10%;font-size:7cqw}.mk--tarjeta .mk__h{left:7%;bottom:21%;font-size:7cqw}.mk--tarjeta .mk__u{left:7%;bottom:10%;font-size:2.6cqw}
.mk--portada{aspect-ratio:210/297}.mk--portada>img{right:-66%;top:3%;width:100%}
.mk--portada .mk__wm{left:7%;top:5%;font-size:6cqw}.mk--portada .mk__h{left:7%;top:22%;font-size:11cqw}
.mk--portada .mk__t{left:7%;top:47%;width:50%}.mk--portada .mk__t--c{top:52%;width:38%}.mk--portada .mk__f{left:7%;right:7%;top:60%;bottom:5%}
.mk--post{aspect-ratio:4/5}.mk--post>img{left:-6%;bottom:-34%;width:112%}
.mk--post .mk__h{left:8%;top:8%;font-size:10cqw}.mk--post .mk__wm{right:8%;top:9%;font-size:6cqw}
.mk--claro{aspect-ratio:210/297;background:#fff;color:#0A0A0C}.mk--claro>img{right:-60%;top:2%;width:90%}
.mk--claro .mk__wm{left:7%;top:5%;font-size:6cqw}.mk--claro .mk__h{left:7%;top:24%;font-size:11cqw}
.mk--claro .mk__t{left:7%;top:38%;width:46%;background:#E4E4EA}.mk--claro .mk__t--c{top:43%;width:34%}
.pr__r{display:grid;gap:4px;margin:14px 0 0;padding-left:18px;list-style:disc;color:var(--text-2);font:600 13px/1.5 Manrope}
.pr__dl{margin-top:12px;color:var(--text-3);font:700 12px/1.6 Manrope}.pr__dl code{font:600 11px ui-monospace,monospace;color:var(--text-2);word-break:break-all}.pr__a{padding:0;border:0;background:none;color:var(--text-1,#fff);font:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer}.pr__a:disabled{opacity:.6}
.fam{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px}.fam span{display:grid;justify-items:center;gap:4px;padding:6px;border-radius:12px;color:var(--text-3);font:700 11px Manrope}.fam .is-on{background:var(--raised);color:#fff}
/* Inventario de lo que ya existe */
.ex{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));grid-auto-flow:dense;gap:12px;margin-top:14px;align-items:start}
.ex__f{position:relative;display:grid;gap:8px;margin:0;padding:10px;border-radius:16px;background:#0A0A0C;border:1px solid var(--edge)}
.ex__f--ancho{grid-column:span 2}.ex__f--no img{opacity:.35;filter:grayscale(1)}.ex__f--no .ex__c{background:var(--raised);text-decoration:line-through}.ex__f figcaption em{display:block;margin-top:2px;color:#FF7AB0;font-style:normal;font-weight:700}@media (max-width:700px){.ex__f--ancho{grid-column:auto}}
.ex__f img{display:block;width:100%;height:auto;max-height:420px;object-fit:contain;object-position:top;border-radius:10px}
.ex__c{flex:none;height:24px;display:inline-flex;align-items:center;padding:0 9px;border-radius:99px;background:var(--pink);color:#fff;font:800 12px Manrope}
.ex__f figcaption{display:flex;gap:10px;align-items:flex-start;color:var(--text-3);font:600 12px/1.4 Manrope}.ex__f figcaption b{display:block;color:var(--text-1,#fff);font:700 13px/1.35 Manrope}
/* 02 trama */
.pr__g--2{grid-template-columns:1fr .8fr .55fr .8fr}
.mk--zoom{aspect-ratio:1}.mk--historia{aspect-ratio:9/16}
.mk__h--s{font-size:9cqw}
.mk--historia .mk__h{left:9%;top:9%;font-size:13cqw}.mk__wm--abajo{left:9%;bottom:5%;font-size:9cqw}
.mk__f--a{left:7%;right:7%;top:52%;height:18%}.mk__f--b{left:7%;right:7%;top:73%;height:18%}
.mk__f--c{left:9%;right:9%;top:40%;height:36%;border-radius:12px}.mk__f--d{left:7%;right:7%;top:52%;bottom:6%;background:#F2F2F5}
.mk--portada .mk__h--s{top:18%}.mk--claro .mk__h--s{top:18%}
/* 03 resplandor */
.pr__g--3{grid-template-columns:1.5fr .8fr .56fr}
.mk--vitrina{aspect-ratio:4/3}
.mk__cel{position:absolute;left:50%;top:50%;width:30%;transform:translate(-50%,-50%);padding:1.2%;border-radius:12cqw;background:linear-gradient(160deg,#3a3a44,#121216 40%,#26262e);box-shadow:inset 0 0 0 1px rgba(255,255,255,.14),0 0 6cqw rgba(235,12,110,.12)}
.mk__cel img{position:static;width:100%;border-radius:10cqw}
.mk--historia .mk__cel{top:63%;width:58%;border-radius:20cqw}.mk--historia .mk__cel img{border-radius:17cqw}
/* 04 muesca */
.pr__g--4{grid-template-columns:1.5fr .8fr .56fr}
.mk--svg{display:block;width:100%;height:auto}
@media (max-width:1100px){.pr__g,.pr__g--2,.pr__g--3,.pr__g--4{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:900px){.el-flow{grid-template-columns:1fr 1fr}}
@media (max-width:520px){.el-flow{grid-template-columns:1fr}.pr__g,.pr__g--2,.pr__g--3,.pr__g--4{grid-template-columns:1fr 1fr}}
` + vistasCSS;
