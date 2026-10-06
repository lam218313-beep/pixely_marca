import { ic } from '../icons.js';
const cat = 'indicadores';
export default [
  {
    id: 'ind-estados', cat, nombre: 'Chip de estado', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/StatusChip.tsx',
    desc: 'Cinco estados de una pieza. Siempre ícono + palabra: nunca solo color.',
    usar: ['Te toca (rosa lleno): lo único que espera al cliente.', 'Cambios (contorno rosa), Aprobada y Programada (edge), En producción (raised).', 'Tamaño sm (24 px) en listas; md (30 px) en detalle.'],
    evitar: ['Inventar estados nuevos con otros colores.'],
    stage: 'phone',
    html: `<div class="s-wrap">
<span class="p-chip p-chip--te-toca">${ic('clock', 11, 3)} Te toca</span>
<span class="p-chip p-chip--cambios">${ic('pen-line', 11, 3)} Cambios</span>
<span class="p-chip p-chip--aprobada">${ic('check', 11, 3)} Aprobada</span>
<span class="p-chip p-chip--produccion">${ic('sparkles', 11, 3)} En producción</span>
<span class="p-chip p-chip--aprobada">${ic('calendar-check', 11, 3)} Programada</span>
</div><div class="s-wrap" style="margin-top:12px"><span class="p-chip p-chip--md p-chip--te-toca">${ic('clock', 13, 3)} Te toca</span><span class="p-chip p-chip--md p-chip--aprobada">${ic('check', 13, 3)} Aprobada</span></div>`,
    css: `.p-chip{display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 8px;border-radius:99px;font:800 11px Manrope;box-sizing:border-box;flex:none}
.p-chip--md{height:30px;padding:0 12px;gap:6px;font-size:12px}
.p-chip--te-toca{background:var(--pink);color:#fff}
.p-chip--cambios{border:1px solid var(--pink);color:var(--pink)}
.p-chip--aprobada{background:var(--edge);color:#fff}
.p-chip--produccion{background:var(--raised);color:var(--text-2)}`,
  },
  {
    id: 'ind-tags', cat, nombre: 'Etiqueta neutra', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/StatusChip.tsx (Tag)',
    desc: 'Datos de una pieza: formato, fecha, pilar, red social.',
    usar: ['Neutro (raised) por defecto; edge para destacar; rosa tenue para lo estratégico.'],
    evitar: ['Usarla como botón.'],
    stage: 'phone',
    html: `<div class="s-wrap"><span class="p-tag">Carrusel</span><span class="p-tag p-tag--edge">12 oct</span><span class="p-tag p-tag--pink">Educar</span><span class="p-tag">Instagram</span></div>`,
    css: `.p-tag{display:inline-flex;align-items:center;height:28px;padding:0 10px;border-radius:99px;background:var(--raised);font:800 12px Manrope}
.p-tag--edge{background:var(--edge)}
.p-tag--pink{background:rgba(235,12,110,.15);color:var(--pink)}`,
  },
  {
    id: 'ind-badge-web', cat, nombre: 'Insignia de la web', origen: 'Web', estado: 'Existe', fuente: 'pixely_web/src/styles/components.css (.badge)',
    desc: 'Píldora en mayúsculas con un punto rosa. Presenta una sección o un dato destacado.',
    usar: ['Sobre fondo negro. Una por bloque.'],
    evitar: ['Párrafos dentro de la insignia.'],
    stage: 'ink',
    html: `<div class="s-wrap"><span class="w-badge"><i></i>Aprobación en tu celular</span><span class="w-plan-badge">Delegación total</span></div>`,
    css: `.w-badge{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border-radius:999px;background:var(--raised);font:800 .78rem Manrope;letter-spacing:.08em;text-transform:uppercase}
.w-badge i{width:8px;height:8px;border-radius:50%;background:var(--pink)}
.w-plan-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;background:var(--pink);font:600 .72rem Unbounded;letter-spacing:.06em;text-transform:uppercase}
.w-plan-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:#fff;animation:w-pulse 1.8s ease-in-out infinite}
@keyframes w-pulse{50%{opacity:.25}}
@media (prefers-reduced-motion:reduce){.w-plan-badge::before{animation:none}}`,
  },
  {
    id: 'ind-contador', cat, nombre: 'Burbuja de pendientes', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/TabBar.tsx',
    desc: 'Número en un círculo rosa que cuenta lo que espera al cliente. 9+ si pasa de nueve.',
    usar: ['Solo para acciones pendientes del cliente.'],
    evitar: ['Mostrar un “0”: sin pendientes, se oculta.'],
    stage: 'phone',
    html: `<div class="s-row"><span class="p-count">1</span><span class="p-count">3</span><span class="p-count">9+</span><span class="p-dot"></span></div>`,
    css: `.p-count{display:inline-grid;place-items:center;min-width:20px;height:20px;padding:0 6px;border-radius:99px;background:var(--pink);font:800 11px Manrope}
.p-dot{width:8px;height:8px;border-radius:50%;background:var(--pink)}`,
  },
  {
    id: 'ind-aviso', cat, nombre: 'Aviso en línea', origen: 'Partners', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Mensaje fijo dentro de la pantalla: información, advertencia o confirmación.',
    usar: ['Siempre ícono + texto.', 'Información: gris; advertencia y error: borde rosa.'],
    evitar: ['Verde o amarillo: la paleta es solo negros, grises y rosa.'],
    stage: 'phone',
    html: `<div class="s-col" style="gap:10px">
<div class="p-note">${ic('info', 18)}<p>Tu plan se renueva el 5 de noviembre.</p></div>
<div class="p-note p-note--warn">${ic('alert', 18)}<p>Faltan dos piezas por aprobar para publicar esta semana.</p></div>
<div class="p-note p-note--ok">${ic('check', 18, 2.8)}<p>Cambios enviados. Te avisamos cuando estén listos.</p></div></div>`,
    css: `.p-note{display:flex;gap:12px;align-items:flex-start;padding:14px 16px;border:1px solid var(--edge);border-radius:16px;background:var(--card);color:var(--text-2)}
.p-note p{margin:0;font:600 14px/1.45 Manrope;color:#fff}
.p-note svg{flex:none;margin-top:1px}
.p-note--warn{border-color:var(--pink)}.p-note--warn svg{color:var(--pink)}
.p-note--ok{background:var(--raised)}`,
  },
  {
    id: 'ind-toast', cat, nombre: 'Aviso emergente (toast)', origen: 'Partners', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Confirmación breve que aparece abajo unos segundos después de una acción.',
    usar: ['Dura 3–4 s. Una línea de texto.', 'Acción opcional “Deshacer”.'],
    evitar: ['Usarlo para errores que requieren acción (usa aviso en línea).'],
    stage: 'phone',
    html: `<div class="p-toast"><span>${ic('check', 16, 3)}</span><p>Pieza aprobada</p><button class="p-link">Deshacer</button></div>`,
    css: `.p-toast{display:flex;align-items:center;gap:12px;padding:12px 14px 12px 12px;border:1px solid var(--line);border-radius:18px;background:var(--raised);box-shadow:0 18px 40px rgba(0,0,0,.55)}
.p-toast>span{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--pink)}
.p-toast p{flex:1;margin:0;font:800 14px Manrope}
.p-toast .p-link{border:0;background:none;cursor:pointer}`,
    usa: ['btn-link-acciones'],
  },
  {
    id: 'ind-avatar', cat, nombre: 'Avatar', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/TabBar.tsx (cuenta)',
    desc: 'Círculo con la inicial en Unbounded. Para cuenta, marca y equipo.',
    usar: ['Tres tamaños: 28, 36, 56.'],
    evitar: ['Fotos de stock como avatar.'],
    stage: 'phone',
    html: `<div class="s-row"><span class="p-av p-av--s">C</span><span class="p-av">C</span><span class="p-av p-av--l">C</span><span class="p-av p-av--pink">P</span></div>`,
    css: `.p-av{display:inline-grid;place-items:center;width:36px;height:36px;border:1px solid var(--line);border-radius:50%;font:700 14px Unbounded;flex:none}
.p-av--s{width:28px;height:28px;font-size:11px}
.p-av--l{width:56px;height:56px;font-size:22px}
.p-av--pink{background:var(--pink);border-color:var(--pink)}`,
  },
  {
    id: 'ind-tooltip', cat, nombre: 'Globo de ayuda (tooltip)', origen: 'Ambos', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Explica un ícono o un dato al pasar el cursor o enfocar (solo computadora).',
    usar: ['Texto de una línea.', 'No para información esencial: en celular no existe.'],
    evitar: ['Poner enlaces o botones dentro.'],
    stage: 'ink',
    html: `<div class="p-tip"><button class="p-iconbtn" aria-describedby="tip1">${ic('info', 18)}</button><span role="tooltip" id="tip1">Alcance: cuentas distintas que vieron la pieza</span></div>`,
    css: `.p-tip{position:relative;display:inline-block;padding-top:48px}
.p-tip>span{position:absolute;left:0;top:0;width:max-content;max-width:240px;padding:8px 12px;border:1px solid var(--line);border-radius:12px;background:var(--raised);font:700 12px/1.4 Manrope;opacity:1}
.p-tip>span::after{content:'';position:absolute;left:18px;bottom:-5px;width:8px;height:8px;border:solid var(--line);border-width:0 1px 1px 0;background:var(--raised);transform:rotate(45deg)}`,
    usa: ['btn-icon'],
  },
];
