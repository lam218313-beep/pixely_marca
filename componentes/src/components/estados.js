import { ic } from '../icons.js';
const cat = 'estados';
export default [
  {
    id: 'est-cargando', cat, nombre: 'Cargando', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/States.tsx (Loading) · orbe: thinking-orbs',
    desc: 'Un orbe de puntos rosas que “piensa”, con una frase de qué se está cargando. Aparece cuando una pantalla espera datos.',
    usar: ['Siempre con la frase de qué carga (“Cargando tus piezas”).', 'Orbe de 64 px en pantallas; el de 20 px va en botones y líneas de texto.', 'El orbe necesita el motor thinking-orbs (src/orbs.js): basta un <canvas data-orb>.'],
    evitar: ['Orbe sin texto en esperas largas.', 'Dos orbes a la vez en la misma pantalla.'],
    stage: 'phone',
    html: `<div class="p-state" role="status"><canvas class="p-orb" data-orb="working" data-size="64" data-tint="#EB0C6E" aria-hidden="true"></canvas><b class="p-state__s">Cargando tus piezas</b></div>`,
    css: `.p-orb{display:block}
.p-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:56px 24px;text-align:center;color:var(--text-3)}
.p-state__s{font:700 14px Manrope}
.p-state h2{margin:0;font:700 20px Unbounded;letter-spacing:-.04em;color:#fff}
.p-state p{margin:0;max-width:300px;font:600 15px/1.5 Manrope;color:var(--text-2)}
.p-state__ic{display:grid;place-items:center;width:56px;height:56px;border-radius:50%;background:var(--raised);color:var(--text-2)}
.p-state__ic--pink{width:64px;height:64px;background:rgba(235,12,110,.15);color:var(--pink)}`,
    usa: ['btn-estados'],
  },
  {
    id: 'est-pensando', cat, nombre: 'Orbes por tarea', origen: 'Partners', estado: 'Propuesto', fuente: 'thinking-orbs (src/orbs.js)',
    desc: 'Cada espera larga con su propio movimiento, para que el cliente sepa qué está pasando y no solo que “algo carga”.',
    usar: ['Un movimiento fijo por tarea: siempre el mismo para lo mismo.', 'Rosa para lo principal; blanco en espacios secundarios.'],
    evitar: ['Mezclar más de un orbe en pantalla.', 'Usarlos en esperas cortas (menos de 1 s): ahí no hace falta nada.'],
    stage: 'wide',
    html: `<div class="p-orbs">
<figure><canvas class="p-orb" data-orb="searching" data-size="64" data-tint="#EB0C6E" aria-hidden="true"></canvas><figcaption>Buscando a tu competencia</figcaption></figure>
<figure><canvas class="p-orb" data-orb="solving" data-size="64" data-tint="#EB0C6E" aria-hidden="true"></canvas><figcaption>Armando tu plan del mes</figcaption></figure>
<figure><canvas class="p-orb" data-orb="composing" data-size="64" data-tint="#EB0C6E" aria-hidden="true"></canvas><figcaption>Escribiendo los textos</figcaption></figure>
<figure><canvas class="p-orb" data-orb="connecting" data-size="64" aria-hidden="true"></canvas><figcaption>Conectando tus redes</figcaption></figure>
<figure><canvas class="p-orb" data-orb="listening" data-size="64" aria-hidden="true"></canvas><figcaption>Subiendo tu pieza</figcaption></figure>
<figure><canvas class="p-orb" data-orb="breathing" data-size="64" aria-hidden="true"></canvas><figcaption>Un momento</figcaption></figure>
</div>`,
    css: `.p-orbs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px 16px;width:100%}
.p-orbs figure{display:flex;flex-direction:column;align-items:center;gap:12px;margin:0;text-align:center}
.p-orbs figcaption{font:700 13px/1.35 Manrope;color:var(--text-2)}
@media (max-width:520px){.p-orbs{grid-template-columns:repeat(2,minmax(0,1fr))}}`,
    usa: ['est-cargando'],
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
    desc: 'Título enorme con la palabra clave en rosa, anillos concéntricos y un punto brillante de fondo. Al abrir, el punto se enciende, los anillos se expanden como una onda y el contenido sube línea por línea; después todo respira despacio.',
    usar: ['Título de 46 px en cuatro líneas máximo.', 'El botón lleva la flecha a la derecha.', 'La animación corre una sola vez al entrar (1,8 s); el fondo sigue respirando muy suave.', 'Se activa agregando la clase <code>is-play</code> al montar la pantalla.'],
    evitar: ['Poner más de dos campos.', 'Repetir la entrada cada vez que se vuelve a la pantalla: solo la primera vez.'],
    stage: 'phone-tall',
    replay: true,
    html: `<div class="p-login"><svg class="p-login__bg" viewBox="0 0 360 520" aria-hidden="true"><g fill="none" stroke="#34343c" stroke-width="2"><circle class="p-lg-r" style="--i:0" cx="250" cy="120" r="70"/><circle class="p-lg-r" style="--i:1" cx="250" cy="120" r="130"/><circle class="p-lg-r" style="--i:2" cx="250" cy="120" r="200"/><circle class="p-lg-r" style="--i:3" cx="250" cy="120" r="280"/></g><circle class="p-lg-glow" cx="250" cy="120" r="34" fill="#EB0C6E" fill-opacity=".2"/><circle class="p-lg-dot" cx="250" cy="120" r="13" fill="#EB0C6E"/></svg>
<div class="p-login__c"><span class="p-wordmark p-lg-in" style="--d:.5s">pixely<b>.</b></span><h1><span class="p-lg-ln"><span style="--d:.62s">Tu marca</span></span><span class="p-lg-ln"><span style="--d:.72s">se decide</span></span><span class="p-lg-ln"><span style="--d:.82s"><em>aquí</em><span class="p-dot-t p-lg-pop">.</span></span></span></h1><p class="p-lg-in" style="--d:1.05s">Aprueba ideas, revisa piezas y mira qué funcionó.</p>
<div class="p-field p-lg-in" style="--d:1.15s"><label for="lg">Correo</label><input id="lg" class="p-input" type="email" placeholder="tu@negocio.pe"></div><button class="p-btn p-btn--primary p-btn--block p-lg-in" style="--d:1.25s">Entrar ${ic('arrow-right', 18, 2.5)}</button></div></div>`,
    css: `.p-login{--e-in:cubic-bezier(.05,.7,.1,1);--e-std:cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden;min-height:520px;border-radius:24px;background:var(--ink)}
.p-login__bg{position:absolute;inset:0;width:100%;height:100%;stroke:none} /* sin el contorno general de los íconos */
.p-login__c{position:relative;display:flex;flex-direction:column;gap:18px;padding:28px 22px}
.p-login h1{margin:8px 0 0;font:700 46px/1.02 Unbounded;letter-spacing:-.04em}
.p-login em{font-style:normal;color:var(--pink)}
.p-login p{margin:0;max-width:290px;font:600 16px/1.5 Manrope;color:var(--text-2)}
.p-lg-ln{display:block;overflow:hidden;padding:.1em 0;margin:-.1em 0}
.p-lg-ln>span{display:inline-block}
.p-lg-r,.p-lg-dot,.p-lg-glow,.p-lg-pop{transform-box:fill-box;transform-origin:center}
.p-lg-pop{display:inline-block}
/* Entrada: corre al agregar .is-play (una vez, al montar) */
.p-login.is-play .p-lg-dot{animation:p-lg-ignite .5s var(--e-in) both}
.p-login.is-play .p-lg-glow{animation:p-lg-ignite .7s var(--e-in) .08s both,p-lg-breathe 3.4s ease-in-out 1.4s infinite alternate}
.p-login.is-play .p-lg-r{animation:p-lg-ripple .9s var(--e-in) calc(.25s + var(--i) * .1s) both,p-lg-wave 4.8s ease-in-out calc(1.8s + var(--i) * .35s) infinite}
.p-login.is-play .p-lg-ln>span{animation:p-lg-rise .65s var(--e-in) var(--d) both}
.p-login.is-play .p-lg-in{animation:p-lg-fade .5s var(--e-std) var(--d) both}
.p-login.is-play .p-lg-pop{animation:p-lg-ignite .32s var(--e-in) 1.28s both}
@keyframes p-lg-ignite{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}
@keyframes p-lg-ripple{from{opacity:0;transform:scale(.55)}to{opacity:1;transform:scale(1)}}
@keyframes p-lg-rise{from{transform:translateY(105%)}to{transform:none}}
@keyframes p-lg-fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes p-lg-breathe{from{transform:scale(1);fill-opacity:.2}to{transform:scale(1.35);fill-opacity:.08}}
@keyframes p-lg-wave{0%,100%{stroke:#34343c}12%{stroke:#4a3040}}
@media (prefers-reduced-motion:reduce){.p-login.is-play *{animation:none!important}}`,
    usa: ['campo-texto', 'btn-partners', 'marca-wordmark'],
  },
];
