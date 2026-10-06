import { ic } from '../icons.js';
const cat = 'calendarios';
// Octubre 2026 empieza en jueves: con semana de lunes a domingo hay 3 huecos antes del día 1.
const tones = { 2: 'ok', 5: 'ok', 7: 'ok', 9: 'cambios', 12: 'pend', 14: 'pend', 16: 'pend', 19: 'pend', 21: 'cambios', 23: 'pend', 26: 'pend', 28: 'pend' };
const grid = (sel) => {
  let h = '<div class="p-cal__w" aria-hidden="true">' + ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d) => `<span>${d}</span>`).join('') + '</div><div class="p-cal__g">';
  h += '<span></span>'.repeat(3);
  for (let d = 1; d <= 31; d++) {
    const t = tones[d];
    h += t ? `<button class="p-day p-day--${t}${d === sel ? ' is-sel' : ''}" data-pick>${d}</button>` : `<span class="p-day p-day--none">${d}</span>`;
  }
  return h + '</div>';
};
export default [
  {
    id: 'cal-mes', cat, nombre: 'Calendario del mes con piezas', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/features/plan/PlanScreens.tsx',
    desc: 'Semana de lunes a domingo. Cada día con una pieza se pinta según su estado; los días vacíos quedan apagados.',
    usar: ['Rosa lleno: aprobada. Contorno rosa: con cambios. Gris: pendiente.', 'Tocar un día lleva a su idea.'],
    evitar: ['Más de tres tonos.', 'Mostrar el calendario sin leyenda cuando hay más de dos estados.'],
    stage: 'phone',
    html: `<section class="p-card p-cal"><div class="p-secrow"><h3 class="p-eyebrow">Tu mes</h3><span class="p-hint">Toca un día para ver su idea</span></div>${grid(0)}
<div class="p-cal__lg"><span><i class="p-day p-day--ok"></i>Aprobada</span><span><i class="p-day p-day--cambios"></i>Con cambios</span><span><i class="p-day p-day--pend"></i>Pendiente</span></div></section>`,
    css: `.p-cal{display:flex;flex-direction:column;gap:10px;padding:16px}
.p-cal__w,.p-cal__g{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center}
.p-cal__w span{font:800 11px Manrope;color:var(--text-3)}
.p-day{display:flex;align-items:center;justify-content:center;height:38px;border:0;border-radius:12px;font:800 13px Manrope;color:#fff;box-sizing:border-box;cursor:pointer;background:none;padding:0}
.p-day--none{color:#5A5A66;font-weight:600;cursor:default}
.p-day--ok{background:var(--pink);color:#fff}
.p-day--cambios{border:1.5px solid var(--pink);color:var(--pink)}
.p-day--pend{background:var(--mute)}
.p-day.is-sel{outline:2px solid #fff;outline-offset:2px}
.p-cal__lg{display:flex;flex-wrap:wrap;gap:6px 14px;font:700 12px Manrope;color:var(--text-3)}
.p-cal__lg span{display:inline-flex;align-items:center;gap:6px}
.p-cal__lg .p-day{width:14px;height:14px;border-radius:5px;pointer-events:none}`,
    usa: ['card-base'],
  },
  {
    id: 'cal-selector-mes', cat, nombre: 'Selector de mes', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/features/resultados/ResultadosScreens.tsx',
    desc: 'Dos flechas y el nombre del mes en una píldora compacta.',
    usar: ['Desactiva la flecha cuando no hay más meses con datos.'],
    evitar: ['Selector de año: no hace falta todavía.'],
    stage: 'phone',
    html: `<div class="p-month"><button aria-label="Mes anterior">${ic('chevron-left', 18, 2.5)}</button><span>Octubre</span><button aria-label="Mes siguiente">${ic('chevron-right', 18, 2.5)}</button></div>`,
    css: `.p-month{display:inline-flex;align-items:center;gap:2px;padding:2px;border:1px solid var(--edge);border-radius:14px;background:var(--card)}
.p-month button{display:flex;align-items:center;justify-content:center;width:36px;height:40px;border:0;background:none;color:var(--text-2);cursor:pointer}
.p-month span{min-width:78px;text-align:center;font:800 13px Manrope}`,
  },
  {
    id: 'cal-fecha', cat, nombre: 'Ficha de fecha', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/features/resultados/ResultadosScreens.tsx',
    desc: 'Cuadro compacto con el día y su número. Se usa dentro de tarjetas y listas.',
    usar: ['Sobre rosa: fondo negro al 35 %.'],
    evitar: ['Incluir mes y año: dejan de caber.'],
    stage: 'phone',
    html: `<div class="s-row"><span class="p-datechip"><small>JUE</small><b>8</b></span><span class="p-datechip p-datechip--today"><small>HOY</small><b>12</b></span></div>`,
    css: `.p-datechip{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;width:56px;height:64px;border:1px solid var(--edge);border-radius:16px;background:var(--card)}
.p-datechip small{font:800 10px Manrope;color:var(--text-3)}.p-datechip b{font:700 20px Unbounded}
.p-datechip--today{background:var(--pink);border-color:var(--pink)}.p-datechip--today small{color:var(--pink-soft)}`,
  },
  {
    id: 'cal-semana', cat, nombre: 'Franja de semana', origen: 'Partners', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Siete días en una fila para ver o elegir rápido. Vista de “esta semana”.',
    usar: ['Punto rosa bajo el día cuando hay pieza.', 'Hoy: relleno rosa.'],
    evitar: ['Más de siete elementos.'],
    stage: 'phone',
    html: `<div class="p-week" data-seg>${[['L', 12, 1], ['M', 13, 0], ['M', 14, 1], ['J', 15, 0], ['V', 16, 1], ['S', 17, 0], ['D', 18, 0]].map(([l, n, p], i) => `<button data-v class="${i === 0 ? 'is-on' : ''}"><small>${l}</small><b>${n}</b><i class="${p ? 'on' : ''}"></i></button>`).join('')}</div>`,
    css: `.p-week{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.p-week button{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 0 8px;border:1px solid var(--edge);border-radius:16px;background:var(--card);color:#fff;cursor:pointer}
.p-week small{font:800 10px Manrope;color:var(--text-3)}.p-week b{font:700 16px Unbounded}
.p-week i{width:5px;height:5px;border-radius:50%;background:transparent}.p-week i.on{background:var(--pink)}
.p-week button.is-on{background:var(--pink);border-color:var(--pink)}
.p-week button.is-on small{color:var(--pink-soft)}.p-week button.is-on i.on{background:#fff}`,
  },
  {
    id: 'cal-selector', cat, nombre: 'Selector de fecha', origen: 'Partners', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Campo de fecha que abre el calendario del mes para elegir un día (reprogramar una pieza).',
    usar: ['Resalta el día elegido con contorno blanco.', 'Confirmar con botón principal.'],
    evitar: ['Pedir escribir la fecha a mano.'],
    stage: 'phone',
    html: `<div class="p-field"><label>Publicar el</label><button class="p-input p-datefield" data-toggle=".p-pop">${ic('calendar-days', 18)}<span>Vie 16 de octubre</span></button></div>
<div class="p-pop" style="margin-top:10px"><div class="p-card p-cal">${grid(16)}<button class="p-btn p-btn--primary p-btn--sm p-btn--block">Confirmar fecha</button></div></div>`,
    css: `.p-datefield{display:flex;align-items:center;gap:10px;text-align:left;cursor:pointer}
.p-datefield svg{color:var(--text-3)}
.p-pop[hidden]{display:none}`,
    usa: ['campo-texto', 'cal-mes'],
  },
];
