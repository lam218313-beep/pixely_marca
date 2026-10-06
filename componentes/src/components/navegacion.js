import { ic } from '../icons.js';
const cat = 'navegacion';
const tabs = (on) => [['house', 'Inicio'], ['calendar-days', 'Plan', 2], ['square-check', 'Validar', 3], ['chart', 'Resultados'], ['circle-dot', 'Marca']]
  .map(([i, l, n], k) => `<a class="p-tab${k === on ? ' is-on' : ''}" href="#">${ic(i, 22)}<span>${l}</span><i class="p-tab__dot"></i>${n ? `<b class="p-tab__n">${n}</b>` : ''}</a>`).join('');
const side = (on) => [['house', 'Inicio'], ['calendar-days', 'Plan', 2], ['square-check', 'Validar', 3], ['chart', 'Resultados'], ['circle-dot', 'Marca']]
  .map(([i, l, n], k) => `<a class="p-side__it${k === on ? ' is-on' : ''}" href="#">${ic(i, 20)}<span>${l}</span>${n ? `<b class="p-side__n">${n}</b>` : k === on ? '<i class="p-side__dot"></i>' : ''}</a>`).join('');
export default [
  {
    id: 'nav-tabbar', cat, nombre: 'Barra inferior (celular)', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/TabBar.tsx',
    desc: 'Cinco pestañas flotantes. El punto rosa marca dónde estás; la burbuja rosa, lo que te espera.',
    usar: ['Máximo cinco destinos.', 'Burbuja con número; “9+” si pasa de 9.'],
    evitar: ['Más de cinco pestañas.', 'Texto largo en la etiqueta (una palabra).'],
    stage: 'phone',
    html: `<nav class="p-tabbar" aria-label="Principal">${tabs(2)}</nav>`,
    css: `.p-tabbar{display:grid;grid-template-columns:repeat(5,1fr);padding:6px;border:1px solid var(--edge);border-radius:26px;background:var(--card);box-shadow:0 -12px 30px rgba(0,0,0,.5)}
.p-tab{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 0;color:var(--text-3);text-decoration:none}
.p-tab span{font:700 10px Manrope}
.p-tab__dot{width:4px;height:4px;border-radius:50%;background:transparent}
.p-tab.is-on{color:#fff}.p-tab.is-on span{font-weight:800}.p-tab.is-on .p-tab__dot{background:var(--pink)}
.p-tab__n{position:absolute;top:4px;right:calc(50% - 22px);min-width:16px;height:16px;padding:0 4px;border-radius:99px;background:var(--pink);font:800 10px/16px Manrope;text-align:center}`,
  },
  {
    id: 'nav-sidenav', cat, nombre: 'Menú lateral (computadora)', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/TabBar.tsx (SideNav)',
    desc: 'En pantallas anchas las mismas cinco pestañas viven en una columna fija de 260 px, con la cuenta abajo.',
    usar: ['Activa: fondo card. El punto rosa solo si no hay pendientes.'],
    evitar: ['Mostrar a la vez barra inferior y menú lateral.'],
    stage: 'wide',
    html: `<aside class="p-side"><div class="p-side__top"><span class="p-wordmark">pixely<b>.</b></span><small>PARTNERS</small></div><nav class="p-side__nav" aria-label="Principal">${side(1)}</nav><a class="p-side__acc" href="#"><i>C</i><span><b>Tu cuenta</b><small>casa.norte@correo.pe</small></span></a></aside>`,
    css: `.p-side{display:flex;flex-direction:column;width:260px;height:440px;padding:28px 16px;border-right:1px solid var(--edge);background:var(--ink);box-sizing:border-box}
.p-side__top{display:flex;align-items:baseline;justify-content:space-between;padding:0 12px}
.p-side__top small{font:700 10px Manrope;letter-spacing:.14em;color:var(--text-3)}
.p-side__nav{display:flex;flex-direction:column;gap:4px;margin-top:40px}
.p-side__it{display:flex;align-items:center;gap:12px;height:48px;padding:0 12px;border-radius:14px;color:var(--text-3);text-decoration:none;font:700 15px Manrope}
.p-side__it span{flex:1}.p-side__it:hover{color:#fff;background:rgba(22,22,27,.6)}
.p-side__it.is-on{background:var(--card);color:#fff;font-weight:800}
.p-side__n{min-width:20px;height:20px;padding:0 6px;border-radius:99px;background:var(--pink);font:800 11px/20px Manrope;text-align:center}
.p-side__dot{width:6px;height:6px;border-radius:50%;background:var(--pink)}
.p-side__acc{display:flex;align-items:center;gap:12px;margin-top:auto;padding:12px;border:1px solid var(--edge);border-radius:16px;background:var(--card);color:#fff;text-decoration:none}
.p-side__acc i{display:grid;place-items:center;width:36px;height:36px;border:1px solid var(--line);border-radius:50%;font:700 14px Unbounded;font-style:normal}
.p-side__acc b{display:block;font:800 13px Manrope}.p-side__acc small{display:block;font:600 12px Manrope;color:var(--text-3)}`,
    usa: ['marca-wordmark'],
  },
  {
    id: 'nav-segmentado', cat, nombre: 'Segmentado', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/Segmented.tsx',
    desc: 'Dos o tres vistas de la misma pantalla (Ideas / Mezcla, Próximas / Publicadas).',
    usar: ['Cada vista con su propia URL.', 'Dos o tres opciones; palabras cortas.'],
    evitar: ['Más de tres opciones (usa pestañas con desplazamiento).'],
    stage: 'phone',
    html: `<div class="p-seg" data-seg><button class="is-on" data-v>Ideas</button><button data-v>Mezcla</button></div>
<div class="p-seg p-seg--3" data-seg style="margin-top:14px"><button class="is-on" data-v>Próximas</button><button data-v>Publicadas</button><button data-v>Todas</button></div>`,
    css: `.p-seg{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));padding:4px;border:1px solid var(--edge);border-radius:16px;background:var(--card)}
.p-seg--3{grid-template-columns:repeat(3,minmax(0,1fr))}
.p-seg button{height:40px;border:0;border-radius:12px;background:transparent;color:var(--text-3);font:700 14px Manrope;cursor:pointer;transition:background .15s}
.p-seg button.is-on{background:var(--edge);color:#fff;font-weight:800}`,
  },
  {
    id: 'nav-header-web', cat, nombre: 'Encabezado de la web', origen: 'Web', estado: 'Existe', fuente: 'pixely_web/src/styles/sections/header.css',
    desc: 'Barra negra fija con la marca, enlaces en mayúsculas (computadora) o botón de menú (celular).',
    usar: ['Siempre negro, también sobre secciones claras.', 'Enlace al pasar el cursor: rosa.'],
    evitar: ['Más de cinco enlaces.'],
    stage: 'wide',
    html: `<header class="w-header"><span class="p-wordmark" style="font-size:24px">pixely<b>.</b></span><nav class="w-header__nav" aria-label="Principal"><a href="#">Proceso</a><a href="#">Planes</a><a href="#">Partners</a><a href="#">Preguntas</a></nav><div class="w-header__act"><a class="w-btn w-btn--primary w-btn--sm" href="#"><span>WhatsApp</span></a></div></header>`,
    css: `.w-header{display:flex;align-items:center;justify-content:space-between;gap:16px;height:76px;padding:0 24px;background:var(--ink);color:#fff;border-bottom:1px solid var(--edge)}
.w-header__nav{display:flex;gap:40px}
.w-header__nav a{font:600 .78rem Unbounded,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#fff;text-decoration:none}
.w-header__nav a:hover{color:var(--pink)}
.w-header__act{display:flex;align-items:center;gap:12px}`,
    usa: ['marca-wordmark', 'btn-web'],
  },
  {
    id: 'nav-menu-movil-web', cat, nombre: 'Menú desplegable de la web (celular)', origen: 'Web', estado: 'Existe', fuente: 'pixely_web/src/styles/sections/header.css (.menu-panel)',
    desc: 'El botón de tres líneas se vuelve una X y abre un panel a pantalla completa con enlaces grandes.',
    usar: ['Enlaces en Unbounded 32 px. El botón principal abajo.', 'Bloquea el desplazamiento del fondo mientras está abierto.'],
    evitar: ['Submenús anidados.'],
    stage: 'phone',
    html: `<div class="w-menuDemo"><div class="w-mbar"><span class="p-wordmark">pixely<b>.</b></span><button class="w-toggle" data-toggle=".w-mpanel" aria-expanded="true" aria-label="Menú"><span></span><span></span></button></div>
<div class="w-mpanel"><ul><li><a href="#">Proceso</a></li><li><a href="#">Planes</a></li><li><a href="#">Partners</a></li><li><a href="#">Preguntas</a></li></ul><a class="w-btn w-btn--primary" href="#"><span>Hablar por WhatsApp</span></a></div></div>`,
    css: `.w-mbar{display:flex;align-items:center;justify-content:space-between;height:64px;padding:0 16px;background:var(--ink)}
.w-toggle{display:grid;place-content:center;gap:6px;width:44px;height:44px;border:0;border-radius:16px;background:var(--raised);color:#fff;cursor:pointer}
.w-toggle span{display:block;width:16px;height:2px;background:currentColor;transition:transform .3s}
.w-toggle[aria-expanded="true"] span:first-child{transform:translateY(4px) rotate(45deg)}
.w-toggle[aria-expanded="true"] span:last-child{transform:translateY(-4px) rotate(-45deg)}
.w-mpanel{display:flex;flex-direction:column;justify-content:space-between;gap:32px;min-height:340px;padding:32px 16px;background:var(--ink)}
.w-mpanel[hidden]{display:none}
.w-mpanel ul{display:grid;gap:8px;margin:0;padding:0;list-style:none}
.w-mpanel a:not(.w-btn){font:500 2rem Unbounded,sans-serif;color:#fff;text-decoration:none}`,
    usa: ['btn-web'],
  },
  {
    id: 'nav-volver', cat, nombre: 'Cabecera de detalle', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/Screen.tsx (DetailScreen)',
    desc: 'Pantallas de detalle: flecha atrás a la izquierda, contexto al centro y acción a la derecha; sin barra inferior.',
    usar: ['Una acción como máximo a la derecha.', 'Título corto o chip de estado al centro.'],
    evitar: ['Dejar la pantalla sin forma de volver.'],
    stage: 'phone',
    html: `<div class="p-detail"><button class="p-iconbtn" aria-label="Volver">${ic('arrow-left', 20, 2.5)}</button><span class="p-chip p-chip--te-toca">${ic('clock', 11, 3)} Te toca</span><button class="p-iconbtn" aria-label="Compartir">${ic('share', 20)}</button></div>`,
    css: `.p-detail{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px}`,
    usa: ['btn-icon', 'ind-estados'],
  },
  {
    id: 'nav-pasos', cat, nombre: 'Indicador de pasos', origen: 'Partners', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Muestra en qué paso va un proceso corto (alta de marca, aprobar pieza). Los pasos hechos en rosa.',
    usar: ['De 3 a 5 pasos.', 'Texto “Paso 2 de 4” para lectores de pantalla.'],
    evitar: ['Pasos con nombres largos.'],
    stage: 'phone',
    html: `<div class="p-steps" role="img" aria-label="Paso 2 de 4"><i class="on"></i><i class="on"></i><i></i><i></i></div><p class="p-hint" style="margin-top:8px">Paso 2 de 4 · Tu voz de marca</p>`,
    css: `.p-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.p-steps i{height:6px;border-radius:99px;background:var(--mute)}
.p-steps i.on{background:var(--pink)}`,
  },
];
