import { ic } from '../icons.js';
const cat = 'contenido';
export default [
  {
    id: 'web-titulos', cat, nombre: 'Títulos y etiqueta de la web', origen: 'Web', estado: 'Existe', fuente: 'pixely_web/src/styles/components.css (.title-*, .caption, .lead)',
    desc: 'Etiqueta en mayúsculas encima, título grande en Unbounded 700 y entradilla en Manrope.',
    usar: ['Una etiqueta + un título + una entradilla por sección.', 'Palabra clave del título en rosa (títulos grandes).'],
    evitar: ['Dos títulos grandes en el mismo bloque.'],
    stage: 'ink',
    html: `<div class="w-head"><p class="w-cap">Planes</p><h3 class="w-title">Tres planes. <span>El mismo proceso.</span></h3><p class="w-lead">Cambia cuánto contenido producimos y quién publica. El volumen lo definimos contigo.</p></div>`,
    css: `.w-head{max-width:56ch}
.w-title{margin:14px 0 18px;font:700 clamp(1.8rem,4vw,3rem)/1.08 Unbounded,sans-serif;letter-spacing:-.02em}
.w-title span{color:var(--pink)}
.w-lead{margin:0;font:500 1.15rem/1.45 Manrope;color:var(--text-2)}`,
    usa: ['card-sistema'],
  },
  {
    id: 'web-faq', cat, nombre: 'Preguntas frecuentes (acordeón)', origen: 'Web', estado: 'Existe', fuente: 'pixely_web/src/styles/sections/faq.css',
    desc: 'Una pregunta por fila con un + rosa que gira al abrirse. Solo HTML, sin JavaScript (details).',
    usar: ['Preguntas redactadas como las diría el cliente.', 'Respuestas de hasta 60 caracteres por línea.'],
    evitar: ['Respuestas de más de un párrafo.'],
    stage: 'ink',
    html: `<div class="w-faq"><details open><summary>¿Cuánto tarda en empezar?</summary><p>En pocos días tienes tu estudio de mercado y el plan del primer mes.</p></details><details><summary>¿Qué tengo que hacer yo?</summary><p>Aprobar cada pieza desde el celular. Nosotros hacemos el resto.</p></details><details><summary>¿Puedo cambiar de plan?</summary><p>Sí, cuando lo necesites.</p></details></div>`,
    css: `.w-faq details{border-top:1px solid var(--edge)}.w-faq details:last-child{border-bottom:1px solid var(--edge)}
.w-faq summary{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:22px 0;list-style:none;cursor:pointer;font:500 1.25rem/1.25 Unbounded}
.w-faq summary::-webkit-details-marker{display:none}
.w-faq summary::after{content:'+';font-size:1.5rem;color:var(--pink);transition:transform .3s cubic-bezier(.22,1,.36,1)}
.w-faq details[open] summary::after{transform:rotate(45deg)}
.w-faq p{max-width:60ch;margin:0 0 24px;color:var(--text-2);font:500 1rem/1.5 Manrope}`,
  },
  {
    id: 'web-muesca', cat, nombre: 'Sección con muesca', origen: 'Web', estado: 'Existe', fuente: 'pixely_web/src/styles/tokens.css (--notch) · components.css (.has-notch)',
    desc: 'El borde inferior de un bloque negro tiene una punta en forma de gota que se mete en el bloque siguiente. Es la firma gráfica de la web.',
    usar: ['Negro sobre rosa o blanco, y rosa sobre negro.', 'La punta se centra y mide 48 px (74 px en computadora).'],
    evitar: ['Usar la muesca en más de dos secciones seguidas.'],
    stage: 'pink-flush',
    html: `<section class="w-notch"><p class="w-cap">Proceso</p><h3 class="w-title" style="margin-bottom:0">Así trabajamos<span>.</span></h3></section><div class="w-after"><p>Sigue el contenido de la siguiente sección</p></div>`,
    css: `.w-notch{padding:56px 24px calc(56px + 48px);background:var(--ink);color:#fff;clip-path:var(--notch)}
.w-after{margin-top:-48px;padding:72px 24px 40px;background:var(--pink);color:#fff;font:600 1rem Manrope}
/* --notch: polígono recortado en la base, definido en tokens.css de la web */
:root{--notch:{{NOTCH}}}`,
  },
  {
    id: 'web-cta-banda', cat, nombre: 'Banda de ayuda', origen: 'Web', estado: 'Existe', fuente: 'pixely_web/src/styles/sections/planes.css (.planes__help)',
    desc: 'Bloque horizontal con una pregunta y un botón. Cierra una sección que pudo dejar dudas.',
    usar: ['Pregunta de una línea y un solo botón.'],
    evitar: ['Dos botones.'],
    stage: 'ink',
    html: `<div class="w-help"><p>¿No sabes cuál elegir? Te recomendamos el plan según tu negocio.</p><a class="w-btn w-btn--ghost" href="#"><span>Pregúntanos por tu plan</span><span class="w-btn__arrow">→</span></a></div>`,
    css: `.w-help{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 32px;padding:28px;border-radius:24px;background:var(--card)}
.w-help p{margin:0;max-width:32ch;font:500 1.5rem/1.25 Unbounded}`,
    usa: ['btn-web'],
  },
  {
    id: 'web-footer-cta', cat, nombre: 'Llamada gigante del pie', origen: 'Web', estado: 'Existe', fuente: 'pixely_web/src/styles/sections/footer.css (.footer-cta)',
    desc: 'Frase enorme con flecha. Al pasar el cursor se pone rosa y la flecha avanza.',
    usar: ['Una sola llamada a la acción, al final de la página.'],
    evitar: ['Texto de más de tres palabras.'],
    stage: 'ink',
    html: `<a class="w-fcta" href="#"><span class="w-fcta__t">Hablemos</span><span class="w-fcta__a">→</span></a>`,
    css: `.w-fcta{display:flex;align-items:center;justify-content:space-between;gap:24px;padding-block:32px;border-bottom:1px solid var(--edge);color:#fff;text-decoration:none;font:500 1rem/1 Unbounded}
.w-fcta__t{font-size:clamp(2.5rem,11vw,7rem);letter-spacing:-.02em;transition:color .3s}
.w-fcta__a{font-size:clamp(2rem,8vw,5.5rem);transition:transform .4s cubic-bezier(.22,1,.36,1)}
.w-fcta:hover .w-fcta__t{color:var(--pink)}.w-fcta:hover .w-fcta__a{transform:translateX(12px)}`,
  },
  {
    id: 'web-pie', cat, nombre: 'Pie legal', origen: 'Web', estado: 'Existe', fuente: 'pixely_web/src/styles/sections/footer.css (.footer__legal)',
    desc: 'Línea final con derechos y enlaces legales en mayúsculas pequeñas.',
    usar: ['Siempre enlaces a Privacidad y Términos.'],
    evitar: ['Texto legal largo: va en su propia página.'],
    stage: 'ink',
    html: `<div class="w-legal"><span>© 2026 Pixely</span><ul><li><a href="#">Privacidad</a></li><li><a href="#">Términos</a></li></ul></div>`,
    css: `.w-legal{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;padding-top:24px;border-top:1px solid var(--edge);font:600 .78rem Unbounded;letter-spacing:.08em;text-transform:uppercase;color:var(--text-2)}
.w-legal ul{display:flex;gap:16px;margin:0;padding:0;list-style:none}
.w-legal a{color:inherit;text-decoration:none}.w-legal a:hover{color:#fff}`,
  },
];
