import { ic } from '../icons.js';
const cat = 'overlays';
export default [
  {
    id: 'ov-sheet', cat, nombre: 'Panel inferior (sheet)', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/Sheet.tsx',
    desc: 'Sube desde abajo en celular y se convierte en ventana centrada en computadora. Se cierra con Escape, con el fondo o con la X.',
    usar: ['Pedir cambios, confirmar, elegir una fecha.', 'Máximo 92 % de la altura, con desplazamiento interno.'],
    evitar: ['Paneles dentro de paneles.'],
    stage: 'phone-tall',
    html: `<div class="p-sheetdemo"><button class="p-btn p-btn--secondary p-btn--sm" data-toggle=".p-ov">Abrir / cerrar panel</button>
<div class="p-ov"><div class="p-ov__bg" data-toggle=".p-ov"></div><div class="p-sheet" role="dialog" aria-label="Pedir cambios"><span class="p-sheet__grip"></span><div class="p-sheet__h"><h2>Pedir cambios</h2><button class="p-iconbtn" aria-label="Cerrar" data-toggle=".p-ov">${ic('x', 18, 2.5)}</button></div>
<div class="p-field"><label for="sx">¿Qué cambiarías?</label><textarea id="sx" class="p-input p-area" rows="3" placeholder="Escríbelo con tus palabras"></textarea></div><button class="p-btn p-btn--primary p-btn--block">Enviar cambios</button></div></div></div>`,
    css: `.p-sheetdemo{position:relative;min-height:380px}
.p-ov[hidden]{display:none}
.p-ov{position:absolute;inset:0;z-index:5;display:flex;align-items:flex-end}
.p-ov__bg{position:absolute;inset:0;background:rgba(0,0,0,.7)}
.p-sheet{position:relative;display:flex;flex-direction:column;gap:16px;width:100%;padding:14px 20px 20px;border-top:1px solid var(--edge);border-radius:32px 32px 0 0;background:var(--card)}
.p-sheet__grip{align-self:center;width:40px;height:4px;border-radius:99px;background:var(--line)}
.p-sheet__h{display:flex;align-items:center;justify-content:space-between;gap:12px}
.p-sheet__h h2{margin:0;font:700 24px Unbounded;letter-spacing:-.04em}`,
    usa: ['btn-icon', 'campo-area', 'btn-partners'],
  },
  {
    id: 'ov-confirm', cat, nombre: 'Ventana de confirmación', origen: 'Partners', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Pregunta corta antes de una acción que no se puede deshacer (eliminar cuenta, cerrar sesión en todos los equipos).',
    usar: ['Título con la acción; texto con la consecuencia.', 'Botón destructivo en rosa a la derecha; cancelar a la izquierda.'],
    evitar: ['Confirmar acciones que sí se pueden deshacer (usa “Deshacer”).'],
    stage: 'phone',
    html: `<div class="p-modal" role="alertdialog" aria-label="Eliminar cuenta"><h2>¿Eliminar tu cuenta?</h2><p>Se borrarán tus piezas y tu marca. Esto no se puede deshacer.</p><div class="s-row" style="gap:10px"><button class="p-btn p-btn--secondary p-btn--sm" style="flex:1">Cancelar</button><button class="p-btn p-btn--primary p-btn--sm" style="flex:1">Eliminar</button></div></div>`,
    css: `.p-modal{display:flex;flex-direction:column;gap:12px;max-width:340px;padding:24px;border:1px solid var(--edge);border-radius:28px;background:var(--card);box-shadow:0 30px 60px rgba(0,0,0,.6)}
.p-modal h2{margin:0;font:700 20px Unbounded;letter-spacing:-.04em}
.p-modal p{margin:0 0 6px;font:600 14px/1.5 Manrope;color:var(--text-2)}`,
    usa: ['btn-partners'],
  },
  {
    id: 'ov-menu', cat, nombre: 'Menú desplegable', origen: 'Ambos', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Lista de acciones que se abre desde un botón (más opciones de una pieza, cuenta).',
    usar: ['De 2 a 6 acciones. La destructiva al final, en rosa.', 'Cierra con Escape y al tocar fuera.'],
    evitar: ['Submenús.'],
    stage: 'phone-tall',
    html: `<div class="p-mwrap"><button class="p-iconbtn" aria-label="Más opciones" data-toggle=".p-menu">${ic('more', 20)}</button><div class="p-menu" role="menu"><button role="menuitem">${ic('share', 16)} Compartir</button><button role="menuitem">${ic('download', 16)} Descargar</button><button role="menuitem">${ic('copy', 16)} Duplicar</button><hr><button role="menuitem" class="danger">${ic('x', 16)} Quitar</button></div></div>`,
    css: `.p-mwrap{position:relative;display:inline-block;min-height:230px}
.p-menu[hidden]{display:none}
.p-menu{position:absolute;top:52px;left:0;min-width:200px;padding:6px;border:1px solid var(--line);border-radius:16px;background:var(--raised);box-shadow:0 18px 40px rgba(0,0,0,.55)}
.p-menu button{display:flex;align-items:center;gap:10px;width:100%;height:44px;padding:0 12px;border:0;border-radius:12px;background:none;color:#fff;font:700 14px Manrope;text-align:left;cursor:pointer}
.p-menu button:hover{background:var(--edge)}
.p-menu .danger{color:var(--pink)}
.p-menu hr{height:1px;margin:4px 6px;border:0;background:var(--line)}`,
    usa: ['btn-icon'],
  },
  {
    id: 'ov-acciones-validar', cat, nombre: 'Trío de acciones de aprobación', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/features/validar/ValidarScreen.tsx',
    desc: 'Tres círculos: pedir cambios (64 px), ver el texto (48 px) y aprobar (76 px, rosa). Es la acción principal de Pixely Partners.',
    usar: ['Aprobar siempre el más grande y rosa.', 'Atajos de teclado en computadora: → aprobar, ← cambios, ↑ texto.'],
    evitar: ['Cambiar el orden o el tamaño relativo.'],
    stage: 'phone',
    html: `<div class="p-trio"><button class="p-trio__s" aria-label="Pedir cambios">${ic('pen-line', 26)}</button><button class="p-trio__m" aria-label="Ver texto">${ic('menu', 20)}</button><button class="p-trio__l" aria-label="Aprobar">${ic('check', 34, 3)}</button></div><p class="p-hint" style="text-align:center;margin-top:14px">Atajos: → aprobar · ← pedir cambios · ↑ ver el texto</p>`,
    css: `.p-trio{display:flex;align-items:center;justify-content:center;gap:22px}
.p-trio button{display:grid;place-items:center;border-radius:50%;color:#fff;cursor:pointer;transition:transform .15s}
.p-trio button:active{transform:scale(.95)}
.p-trio__s{width:64px;height:64px;border:1px solid var(--line);background:var(--card)}
.p-trio__m{width:48px;height:48px;border:1px solid var(--line);background:transparent;color:var(--text-2)!important}
.p-trio__l{width:76px;height:76px;border:0;background:var(--pink);box-shadow:0 12px 28px rgba(217,11,102,.4)}`,
  },
  {
    id: 'ov-mazo', cat, nombre: 'Mazo de piezas para validar', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/features/validar/ValidarScreen.tsx',
    desc: 'La pieza actual, con la imagen enmarcada como una foto, sobre dos láminas translúcidas que apenas asoman. Deslizar a la derecha aprueba; a la izquierda pide cambios.',
    usar: ['Dos capas visibles detrás como máximo.', 'Etiquetas sobre la imagen: formato y límite de respuesta.'],
    evitar: ['Texto largo sobre la imagen.'],
    stage: 'phone-tall',
    html: `<div class="p-deck"><i class="p-deck__b2"></i><i class="p-deck__b1"></i><article class="p-deck__top"><div class="p-deck__img"><span class="p-deck__t">Carrusel · 5</span><span class="p-deck__t p-deck__t--r">Responde en 2 días</span>${ic('image', 36, 1.2)}</div><div class="p-deck__b"><small>Educar · Instagram</small><b>Tres formas de llevar el negro</b></div></article></div>`,
    css: `.p-deck{position:relative;height:340px;margin-top:20px}
.p-deck i{position:absolute;border:1px solid rgba(255,255,255,.06);border-radius:28px}
.p-deck__b2{left:30px;right:30px;top:0;bottom:24px;background:rgba(255,255,255,.015)}
.p-deck__b1{left:15px;right:15px;top:9px;bottom:12px;background:rgba(255,255,255,.03)}
.p-deck__top{position:absolute;inset:18px 0 0;display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.08);border-radius:28px;background:var(--card);box-shadow:0 18px 40px -20px rgba(0,0,0,.55)}
.p-deck__img{position:relative;display:grid;place-items:center;flex:1;margin:8px 8px 0;border-radius:21px;background:linear-gradient(160deg,#25252D,#1B1B21);color:#3A3A44}
.p-deck__t{position:absolute;left:10px;top:10px;display:inline-flex;align-items:center;height:26px;padding:0 10px;border-radius:99px;background:rgba(10,10,12,.45);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;font:700 11px Manrope}
.p-deck__t--r{left:auto;right:10px;color:#FF7AB0}
.p-deck__b{display:flex;flex-direction:column;gap:3px;padding:12px 16px 16px}
.p-deck__b small{font:600 11px Manrope;color:var(--text-3)}.p-deck__b b{font:700 15px/1.35 Manrope}`,
    usa: ['ov-acciones-validar'],
  },
  {
    id: 'ov-carrusel', cat, nombre: 'Carrusel de la pieza con puntos', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/features/shared/PieceMedia.tsx',
    desc: 'Desplazamiento lateral con imán entre imágenes. El punto activo se alarga y se vuelve blanco.',
    usar: ['Punto activo 18 px; inactivos 6 px al 40 %.'],
    evitar: ['Flechas visibles en celular: se desliza con el dedo.'],
    stage: 'phone',
    html: `<div class="p-car"><div class="p-car__t"><div>${ic('image', 40, 1.4)}</div><div>${ic('image', 40, 1.4)}</div><div>${ic('image', 40, 1.4)}</div></div><div class="p-car__d"><i class="on"></i><i></i><i></i></div></div>`,
    css: `.p-car{position:relative;overflow:hidden;border-radius:24px;background:var(--raised)}
.p-car__t{display:flex;height:240px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}
.p-car__t::-webkit-scrollbar{display:none}
.p-car__t>div{flex:none;width:100%;display:grid;place-items:center;scroll-snap-align:center;color:var(--mute)}
.p-car__d{position:absolute;bottom:12px;left:0;right:0;display:flex;justify-content:center;gap:6px;pointer-events:none}
.p-car__d i{width:6px;height:6px;border-radius:99px;background:rgba(255,255,255,.4)}
.p-car__d i.on{width:18px;background:#fff}`,
  },
];
