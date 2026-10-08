import { ic } from '../icons.js';
const cat = 'botones';
export default [
  {
    id: 'btn-partners', cat, nombre: 'Botón principal, secundario y fantasma', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/Button.tsx',
    desc: 'Tres jerarquías. El rosa es la única acción importante de la pantalla.',
    usar: ['Principal: una sola por pantalla (aprobar, enviar).', 'Secundario: acciones de apoyo (pedir cambios).', 'Fantasma: acciones menores (saltar, cancelar).', 'Alto táctil mínimo de 44 px (tamaño sm).'],
    evitar: ['Dos botones principales juntos.', 'Texto largo: máximo 3 palabras.'],
    stage: 'phone',
    html: `<div class="s-col">
<button class="p-btn p-btn--primary p-btn--block">${ic('check', 18, 2.6)} Aprobar</button>
<button class="p-btn p-btn--secondary p-btn--block">${ic('pen-line', 18, 2.4)} Pedir cambios</button>
<button class="p-btn p-btn--ghost p-btn--block">Ahora no</button>
<div class="s-row"><button class="p-btn p-btn--primary p-btn--sm">Pequeño</button><button class="p-btn p-btn--secondary p-btn--sm">Pequeño</button></div>
</div>`,
    css: `.p-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:56px;padding:0 20px;border:0;border-radius:16px;font:800 15px Manrope,sans-serif;color:#fff;cursor:pointer;transition:transform .15s;user-select:none}
.p-btn:active{transform:scale(.98)}
.p-btn:disabled{opacity:.5;transform:none}
.p-btn--primary{background:var(--pink);box-shadow:0 12px 28px rgba(217,11,102,.35)}
.p-btn--secondary{border:1px solid var(--line);background:transparent}
.p-btn--ghost{background:transparent;color:var(--text-2)}
.p-btn--sm{height:44px;padding:0 16px;font-size:14px}
.p-btn--block{width:100%}`,
  },
  {
    id: 'btn-estados', cat, nombre: 'Botón: cargando y deshabilitado', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/Button.tsx',
    desc: 'Mientras se guarda, el botón muestra un spinner y no se puede volver a pulsar.',
    usar: ['Cargando: cuando la acción tarda más de ~300 ms.', 'Deshabilitado: cuando falta un dato obligatorio; explica por qué cerca.'],
    evitar: ['Botón deshabilitado sin motivo visible.'],
    stage: 'phone',
    html: `<div class="s-col">
<button class="p-btn p-btn--primary p-btn--block" disabled><canvas class="p-orb" data-orb="working" data-size="20" data-tint="#fff" aria-hidden="true"></canvas> Guardando</button>
<button class="p-btn p-btn--primary p-btn--block" disabled>Aprobar</button>
</div>`,
    css: `.p-orb{display:block} /* orbe de 20 px de thinking-orbs: ver “Cargando” */`,
    usa: ['btn-partners'],
  },
  {
    id: 'btn-icon', cat, nombre: 'Botón de ícono', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/Button.tsx (IconButton)',
    desc: 'Cuadrado de 44 px con esquina de 14. Atrás, cerrar, compartir, notificaciones.',
    usar: ['Siempre con aria-label.', 'Con insignia para contar pendientes.'],
    evitar: ['Ícono suelto sin área táctil de 44 px.'],
    stage: 'phone',
    html: `<div class="s-row">
<button class="p-iconbtn" aria-label="Volver">${ic('arrow-left', 20, 2.5)}</button>
<button class="p-iconbtn" aria-label="Compartir">${ic('share', 20)}</button>
<button class="p-iconbtn" aria-label="Cerrar">${ic('x', 18, 2.5)}</button>
<button class="p-iconbtn p-iconbtn--badge" aria-label="Avisos">${ic('bell', 20)}<i>3</i></button>
</div>`,
    css: `.p-iconbtn{position:relative;width:44px;height:44px;border-radius:14px;border:1px solid var(--line);background:transparent;color:#fff;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .15s}
.p-iconbtn:active{transform:scale(.95)}
.p-iconbtn--badge i{position:absolute;top:-6px;right:-6px;min-width:18px;height:18px;padding:0 5px;border-radius:99px;background:var(--pink);font:800 10px/18px Manrope;text-align:center;font-style:normal}`,
  },
  {
    id: 'btn-web', cat, nombre: 'Botón de la web (con círculo)', origen: 'Web', estado: 'Existe', fuente: 'pixely_web/src/styles/components.css (.btn)',
    desc: 'Mayúsculas con espaciado. Al pasar el cursor, un círculo blanco se expande desde el centro y invierte el color.',
    usar: ['Principal rosa para llamadas a WhatsApp; fantasma para acciones secundarias.', 'Flecha → a la derecha, se desplaza 3 px al pasar el cursor.'],
    evitar: ['Más de un principal por bloque.', 'Textos de más de 4 palabras.'],
    stage: 'ink',
    html: `<div class="s-row">
<a class="w-btn w-btn--primary" href="#"><span>Hablar por WhatsApp</span><span class="w-btn__arrow">→</span></a>
<a class="w-btn w-btn--ghost" href="#"><span>Ver cómo funciona</span><span class="w-btn__arrow">→</span></a>
<a class="w-btn w-btn--primary w-btn--sm" href="#"><span>Pequeño</span></a>
</div>`,
    css: `.w-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:56px;padding:0 28px;border-radius:16px;overflow:hidden;isolation:isolate;font:800 .85rem Manrope,sans-serif;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;text-decoration:none;max-width:100%}
.w-btn::before{content:'';position:absolute;z-index:-1;left:50%;top:50%;width:220%;aspect-ratio:1;border-radius:50%;background:#fff;transform:translate(-50%,-50%) scale(0);transition:transform .8s cubic-bezier(.22,1,.36,1)}
.w-btn:hover::before,.w-btn:focus-visible::before{transform:translate(-50%,-50%) scale(1)}
.w-btn__arrow{transition:transform .3s cubic-bezier(.22,1,.36,1)}
.w-btn:hover .w-btn__arrow{transform:translateX(3px)}
.w-btn--primary{background:var(--pink);color:#fff}
.w-btn--primary:hover,.w-btn--primary:focus-visible{color:var(--ink)}
.w-btn--ghost{background:var(--raised);color:#fff}
.w-btn--ghost:hover,.w-btn--ghost:focus-visible{color:var(--ink)}
.w-btn--sm{min-height:40px;padding:0 16px;font-size:.75rem}
@media (prefers-reduced-motion:reduce){.w-btn::before{transition:none}}`,
  },
  {
    id: 'btn-web-rosa', cat, nombre: 'Botón de la web sobre fondo rosa', origen: 'Web', estado: 'Existe', fuente: 'pixely_web/src/styles/components.css (.section--paper)',
    desc: 'Sobre un bloque rosa, el principal pasa a negro y el fantasma a contorno blanco. El texto sigue siendo blanco.',
    usar: ['Solo dentro de bloques rosa.'],
    evitar: ['Botón rosa sobre rosa.'],
    stage: 'pink',
    html: `<div class="s-row">
<a class="w-btn w-btn--ink" href="#"><span>Quiero empezar</span><span class="w-btn__arrow">→</span></a>
<a class="w-btn w-btn--outline" href="#"><span>Ver planes</span><span class="w-btn__arrow">→</span></a>
</div>`,
    css: `.w-btn--ink{background:var(--ink);color:#fff}
.w-btn--ink::before{background:#fff}
.w-btn--ink:hover{color:var(--ink)}
.w-btn--outline{background:transparent;color:#fff;box-shadow:inset 0 0 0 1.5px #fff}
.w-btn--outline:hover{color:var(--pink)}`,
    usa: ['btn-web'],
  },
  {
    id: 'btn-link-acciones', cat, nombre: 'Enlace de acción y chip pulsable', origen: 'Partners', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Acción mínima dentro de una frase o al lado de un título (“Ver todo”, “Agenda”).',
    usar: ['Texto rosa 13 px, 800.', 'Alineado a la derecha del título de sección.'],
    evitar: ['Reemplazar un botón principal.'],
    stage: 'phone',
    html: `<div class="p-secrow"><h3 class="p-eyebrow">Lo próximo en salir</h3><a class="p-link" href="#">Agenda ${ic('chevron-right', 14, 2.8)}</a></div>
<div class="s-row" style="margin-top:14px"><button class="p-pill is-on">Todas</button><button class="p-pill">Instagram</button><button class="p-pill">TikTok</button></div>`,
    css: `.p-secrow{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
.p-eyebrow{margin:0;font:800 12px Manrope;letter-spacing:.12em;text-transform:uppercase;color:var(--text-3)}
.p-link{display:inline-flex;align-items:center;gap:2px;font:800 13px Manrope;color:var(--pink);text-decoration:none}
.p-pill{height:36px;padding:0 14px;border-radius:99px;border:1px solid var(--line);background:transparent;color:var(--text-2);font:700 13px Manrope;cursor:pointer}
.p-pill.is-on{background:var(--edge);border-color:var(--edge);color:#fff;font-weight:800}`,
  },
];
