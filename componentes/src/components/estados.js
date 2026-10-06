import { ic } from '../icons.js';
const cat = 'estados';
export default [
  {
    id: 'est-cargando', cat, nombre: 'Cargando', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/States.tsx (Loading)',
    desc: 'Spinner centrado con una palabra. Aparece cuando una pantalla espera datos.',
    usar: ['Con la etiqueta “Cargando” (o qué carga).'],
    evitar: ['Spinner sin texto en esperas largas.'],
    stage: 'phone',
    html: `<div class="p-state" role="status"><span class="p-spin">${ic('loader', 28)}</span><b class="p-state__s">Cargando</b></div>`,
    css: `.p-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:56px 24px;text-align:center;color:var(--text-3)}
.p-state__s{font:700 14px Manrope}
.p-state h2{margin:0;font:700 20px Unbounded;letter-spacing:-.04em;color:#fff}
.p-state p{margin:0;max-width:300px;font:600 15px/1.5 Manrope;color:var(--text-2)}
.p-state__ic{display:grid;place-items:center;width:56px;height:56px;border-radius:50%;background:var(--raised);color:var(--text-2)}
.p-state__ic--pink{width:64px;height:64px;background:rgba(235,12,110,.15);color:var(--pink)}`,
    usa: ['btn-estados'],
  },
  {
    id: 'est-esqueleto', cat, nombre: 'Esqueleto de carga', origen: 'Partners', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Siluetas grises pulsando donde irá el contenido. Se usa cuando conocemos la forma de lo que viene.',
    usar: ['Mismo tamaño y espaciado que el contenido real.'],
    evitar: ['Combinarlo con un spinner.'],
    stage: 'phone',
    html: `<div class="p-skel"><i style="width:40%;height:14px"></i><i style="height:84px;border-radius:24px"></i><i style="height:84px;border-radius:24px"></i></div>`,
    css: `.p-skel{display:grid;gap:12px}
.p-skel i{display:block;border-radius:8px;background:linear-gradient(90deg,var(--card) 25%,var(--raised) 50%,var(--card) 75%);background-size:200% 100%;animation:p-sh 1.4s ease-in-out infinite}
@keyframes p-sh{to{background-position:-200% 0}}
@media (prefers-reduced-motion:reduce){.p-skel i{animation:none}}`,
  },
  {
    id: 'est-error', cat, nombre: 'Error de conexión', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/States.tsx (ErrorState)',
    desc: 'Dice qué pasó en una frase y ofrece reintentar.',
    usar: ['Mensaje en lenguaje cotidiano; botón “Intentar de nuevo”.'],
    evitar: ['Códigos de error o jerga técnica.'],
    stage: 'phone',
    html: `<div class="p-state" role="alert"><span class="p-state__ic">${ic('wifi-off', 24)}</span><p>No pudimos cargar tus piezas. Revisa tu conexión.</p><button class="p-btn p-btn--secondary p-btn--sm">Intentar de nuevo</button></div>`,
    css: `/* usa .p-state de “Cargando” */`,
    usa: ['est-cargando', 'btn-partners'],
  },
  {
    id: 'est-vacio', cat, nombre: 'Estado vacío', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/States.tsx (EmptyState)',
    desc: 'Cuando no hay nada todavía: dice por qué y qué pasará después. Ícono en círculo rosa tenue.',
    usar: ['Título positivo (“Todo al día”).', 'Acción solo si hay algo que hacer.'],
    evitar: ['“No hay datos” sin explicación.'],
    stage: 'phone',
    html: `<div class="p-state"><span class="p-state__ic p-state__ic--pink">${ic('check', 28, 2.6)}</span><h2>Todo al día</h2><p>No tienes piezas por aprobar. Te avisamos cuando haya nuevas.</p></div>`,
    css: `/* usa .p-state de “Cargando” */`,
    usa: ['est-cargando'],
  },
  {
    id: 'est-login', cat, nombre: 'Pantalla de entrada', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/features/entrar/EntrarScreen.tsx',
    desc: 'Título enorme con la palabra clave en rosa, anillos concéntricos y un punto brillante de fondo. Es el motivo que define la marca.',
    usar: ['Título de 46 px en cuatro líneas máximo.', 'El botón lleva la flecha a la derecha.'],
    evitar: ['Poner más de dos campos.'],
    stage: 'phone-tall',
    html: `<div class="p-login"><svg class="p-login__bg" viewBox="0 0 360 520" aria-hidden="true"><g fill="none" stroke="#34343c" stroke-width="2"><circle cx="250" cy="120" r="70"/><circle cx="250" cy="120" r="130"/><circle cx="250" cy="120" r="200"/><circle cx="250" cy="120" r="280"/></g><circle cx="250" cy="120" r="34" fill="#EB0C6E" fill-opacity=".2"/><circle cx="250" cy="120" r="13" fill="#EB0C6E"/></svg>
<div class="p-login__c"><span class="p-wordmark">pixely<b>.</b></span><h1>Tu marca<br>se decide<br><em>aquí</em><span class="p-dot-t">.</span></h1><p>Aprueba ideas, revisa piezas y mira qué funcionó.</p>
<div class="p-field"><label for="lg">Correo</label><input id="lg" class="p-input" type="email" placeholder="tu@negocio.pe"></div><button class="p-btn p-btn--primary p-btn--block" style="flex-direction:row-reverse">Entrar ${ic('arrow-right', 18, 2.5)}</button></div></div>`,
    css: `.p-login{position:relative;overflow:hidden;min-height:520px;border-radius:24px;background:var(--ink)}
.p-login__bg{position:absolute;inset:0;width:100%;height:100%}
.p-login__c{position:relative;display:flex;flex-direction:column;gap:18px;padding:28px 22px}
.p-login h1{margin:8px 0 0;font:700 46px/1.02 Unbounded;letter-spacing:-.04em}
.p-login em{font-style:normal;color:var(--pink)}
.p-login p{margin:0;max-width:290px;font:600 16px/1.5 Manrope;color:var(--text-2)}`,
    usa: ['campo-texto', 'btn-partners', 'marca-wordmark'],
  },
];
