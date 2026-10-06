import { ic } from '../icons.js';
const cat = 'tarjetas';
export default [
  {
    id: 'card-base', cat, nombre: 'Tarjeta y título de sección', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/Surface.tsx (Card, Section)',
    desc: 'El contenedor base: fondo card, borde edge, esquina 24, relleno 18.',
    usar: ['Una idea por tarjeta.', 'Título de sección en mayúsculas pequeñas, acción a la derecha.'],
    evitar: ['Tarjetas dentro de tarjetas.', 'Sombras fuertes: las capas se separan por tono.'],
    stage: 'phone',
    html: `<div class="p-secrow"><h3 class="p-eyebrow">Tu marca</h3><a class="p-link" href="#">Editar</a></div>
<section class="p-card" style="margin-top:10px"><h4 class="p-card__t">Casa Norte<span class="p-dot-t">.</span></h4><p class="p-card__p">Boutique de moda · Miraflores, Lima</p></section>`,
    css: `.p-card{padding:18px;border:1px solid var(--edge);border-radius:24px;background:var(--card)}
.p-card__t{margin:0;font:700 20px Unbounded;letter-spacing:-.04em}
.p-dot-t{color:var(--pink)}
.p-card__p{margin:6px 0 0;font:600 14px/1.5 Manrope;color:var(--text-2)}`,
    usa: ['btn-link-acciones'],
  },
  {
    id: 'card-fila', cat, nombre: 'Fila pulsable', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/Surface.tsx (ListRow, IconTile)',
    desc: 'Ícono en un cuadrado, título, detalle y flecha. Es el patrón de listas y menús.',
    usar: ['Ícono rosa tenue cuando requiere acción del cliente; gris cuando es informativo.', 'Título corto; el detalle dice qué pasa al tocarla.'],
    evitar: ['Más de dos líneas de detalle.'],
    stage: 'phone',
    html: `<div class="s-col" style="gap:10px">
<a class="p-row" href="#"><span class="p-tile p-tile--accent">${ic('sparkles', 22)}</span><span class="p-row__b"><b>3 ideas por aprobar</b><small>Aprobarlas antes del jueves</small></span>${ic('chevron-right', 20)}</a>
<a class="p-row" href="#"><span class="p-tile">${ic('circle-dot', 22)}</span><span class="p-row__b"><b>Revisa tu voz de marca</b><small>Cómo hablará tu marca</small></span>${ic('chevron-right', 20)}</a></div>`,
    css: `.p-row{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid var(--edge);border-radius:22px;background:var(--card);color:#fff;text-decoration:none;transition:background .15s}
.p-row:active{background:var(--raised)}
.p-row>svg{flex:none;color:var(--text-3)}
.p-row__b{flex:1;min-width:0}
.p-row__b b{display:block;font:800 15px Manrope}
.p-row__b small{display:block;margin-top:2px;font:600 13px Manrope;color:var(--text-3)}
.p-tile{display:grid;place-items:center;flex:none;width:44px;height:44px;border-radius:14px;background:var(--raised);color:var(--text-2)}
.p-tile--accent{background:rgba(235,12,110,.15);color:var(--pink)}`,
  },
  {
    id: 'card-hoy', cat, nombre: 'Tarjeta destacada rosa', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/features/resultados/ResultadosScreens.tsx',
    desc: 'La única tarjeta con fondo rosa: lo que sale hoy. Un anillo en la esquina recuerda el motivo de la marca.',
    usar: ['Una por pantalla.', 'Texto blanco; la red social en rosa suave.'],
    evitar: ['Dos tarjetas rosas a la vez.'],
    stage: 'phone',
    html: `<a class="p-hero" href="#"><span class="p-hero__ring"></span><span class="p-hero__date"><small>HOY</small><b>12</b></span><span class="p-hero__b"><small>SALE HOY · 6:30 P. M.</small><b>Tres formas de llevar el negro</b><em>Instagram · TikTok</em></span></a>`,
    css: `.p-hero{position:relative;display:flex;align-items:center;gap:14px;overflow:hidden;padding:18px;border-radius:24px;background:var(--pink);color:#fff;text-decoration:none}
.p-hero__ring{position:absolute;right:-40px;top:-40px;width:140px;height:140px;border-radius:50%;border:1px solid rgba(255,255,255,.25)}
.p-hero__date{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:none;width:64px;height:72px;border-radius:16px;background:rgba(10,10,12,.35)}
.p-hero__date small{font:800 11px Manrope}.p-hero__date b{font:700 22px Unbounded}
.p-hero__b{position:relative;display:flex;flex-direction:column;gap:4px;min-width:0}
.p-hero__b small{font:800 12px Manrope;letter-spacing:.08em}
.p-hero__b b{font:800 15px/1.3 Manrope}.p-hero__b em{font:700 12px Manrope;font-style:normal;color:var(--pink-soft)}`,
  },
  {
    id: 'card-kpi', cat, nombre: 'Tarjeta de cifra (KPI)', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/features/resultados/ResultadosScreens.tsx',
    desc: 'Un número grande en Unbounded con su explicación debajo. En trío o en pareja.',
    usar: ['Cifra en 20–22 px; etiqueta en 11–12 px.', 'Rosa solo si la cifra pide acción.'],
    evitar: ['Más de tres en una fila en celular.'],
    stage: 'phone',
    html: `<div class="p-kpis"><div class="p-card p-kpi"><b>9</b><small>por salir en oct</small></div><div class="p-card p-kpi"><b>2</b><small>ya programadas</small></div><div class="p-card p-kpi"><b class="p-pinkt">3</b><small>esperan tu visto</small></div></div>`,
    css: `.p-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.p-kpi{padding:12px}
.p-kpi b{display:block;font:700 20px Unbounded;letter-spacing:-.04em}
.p-kpi small{display:block;margin-top:2px;font:700 11px Manrope;color:var(--text-3)}
.p-pinkt{color:var(--pink)}`,
    usa: ['card-base'],
  },
  {
    id: 'card-linea', cat, nombre: 'Pieza en la línea de tiempo', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/features/resultados/ResultadosScreens.tsx',
    desc: 'Fecha a la izquierda y tarjeta de la pieza a la derecha, con su estado.',
    usar: ['Día de la semana + número en columna fija de 44 px.'],
    evitar: ['Más de tres datos por tarjeta.'],
    stage: 'phone',
    html: `<a class="p-line" href="#"><span class="p-line__d"><small>MIÉ</small><b>14</b></span><span class="p-line__c"><span class="p-line__r"><small>Carrusel · 12:30 p. m.</small><span class="p-chip p-chip--aprobada">${ic('check', 11, 3)} Aprobada</span></span><b>Detrás del mostrador</b><small>Instagram</small></span></a>`,
    css: `.p-line{display:flex;gap:12px;color:#fff;text-decoration:none}
.p-line__d{display:flex;flex-direction:column;align-items:center;flex:none;width:44px;padding-top:10px}
.p-line__d small{font:800 10px Manrope;color:var(--text-3)}.p-line__d b{font:700 18px Unbounded}
.p-line__c{display:flex;flex:1;min-width:0;flex-direction:column;gap:6px;padding:12px;border:1px solid var(--edge);border-radius:20px;background:var(--card)}
.p-line__r{display:flex;align-items:center;justify-content:space-between;gap:8px}
.p-line__r small,.p-line__c>small{font:700 12px Manrope;color:var(--text-3)}
.p-line__c>b{font:800 14px/1.35 Manrope}`,
    usa: ['ind-estados'],
  },
  {
    id: 'card-media', cat, nombre: 'Tarjeta con imagen', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/features/resultados/ResultadosScreens.tsx (la mejor)',
    desc: 'Miniatura vertical, etiqueta rosa sobre la imagen, y texto con la fecha.',
    usar: ['Miniatura 104×128 con esquina 18.', 'Etiqueta sobre la imagen con fondo rosa y texto blanco.'],
    evitar: ['Texto directamente sobre la foto sin etiqueta.'],
    stage: 'phone',
    html: `<a class="p-media" href="#"><span class="p-media__img"><span class="p-media__ph">${ic('image', 28, 1.6)}</span><span class="p-media__tag">${ic('star', 11, 2)} La mejor</span></span><span class="p-media__b"><small>Reel · 3 oct</small><b>Detrás del mostrador</b><em>6,000 vistas · 300 likes</em></span></a>`,
    css: `.p-media{display:flex;gap:12px;padding:8px;border:1px solid var(--edge);border-radius:24px;background:var(--card);color:#fff;text-decoration:none}
.p-media__img{position:relative;display:grid;place-items:center;flex:none;width:104px;height:128px;border-radius:18px;background:var(--raised);color:var(--mute);overflow:hidden}
.p-media__tag{position:absolute;left:8px;top:8px;display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 8px;border-radius:99px;background:var(--pink);font:800 11px Manrope}
.p-media__b{display:flex;flex:1;min-width:0;flex-direction:column;gap:6px;padding:6px 6px 6px 0}
.p-media__b small{font:700 12px Manrope;color:var(--text-3)}.p-media__b b{font:800 15px/1.35 Manrope}
.p-media__b em{margin-top:auto;font:700 12px Manrope;font-style:normal;color:var(--text-2)}`,
  },
  {
    id: 'card-sistema', cat, nombre: 'Celda de la web', origen: 'Web', estado: 'Existe', fuente: 'pixely_web/src/styles/components.css (.cells)',
    desc: 'Rejilla de celdas con bordes finos, sin tarjetas separadas. Sirve para listas de beneficios o pasos.',
    usar: ['Dos o tres columnas en computadora; una en celular.', 'Sobre rosa, el borde pasa a blanco al 40 %.'],
    evitar: ['Mezclar celdas y tarjetas en el mismo bloque.'],
    stage: 'ink',
    html: `<div class="w-cells"><div class="w-cell"><small class="w-cap">Paso 1</small><h4>Leemos tu mercado</h4><p>Estudiamos a tu competencia y a tu público.</p></div><div class="w-cell"><small class="w-cap">Paso 2</small><h4>Armamos tu estrategia</h4><p>Un plan del mes que tú apruebas.</p></div><div class="w-cell"><small class="w-cap">Paso 3</small><h4>Producimos y publicamos</h4><p>Tú solo apruebas desde el celular.</p></div></div>`,
    css: `.w-cells{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--edge);border-left:1px solid var(--edge)}
.w-cell{padding:24px;border-right:1px solid var(--edge);border-bottom:1px solid var(--edge)}
.w-cap{display:block;font:600 .78rem Unbounded;letter-spacing:.08em;text-transform:uppercase;color:var(--text-2)}
.w-cell h4{margin:12px 0 8px;font:500 1.2rem Unbounded}
.w-cell p{margin:0;color:var(--text-2);font:500 .95rem/1.5 Manrope}
@media (max-width:640px){.w-cells{grid-template-columns:1fr}}`,
  },
];
