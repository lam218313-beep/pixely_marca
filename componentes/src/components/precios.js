const cat = 'precios';
const check = '<svg class="w-pic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const dash = '<svg class="w-pic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12h10"/></svg>';
const items = (list, off = []) => `<ul class="w-pitems">${list.map((t, i) => `<li class="${off.includes(i) ? 'is-off' : ''}">${off.includes(i) ? dash : check}<span>${t}</span></li>`).join('')}</ul>`;
const vol = (n, name) => `<div class="w-pvol"><small class="w-cap">Volumen</small><span class="w-psegs">${[0, 1, 2].map((i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span><b>${name}</b></div>`;
const L = ['Estudio de tu mercado', 'Estrategia y plan del mes', 'Aprobación en Partners', 'Producción multiformato', 'Publicación'];
export default [
  {
    id: 'precio-plan', cat, nombre: 'Tarjeta de plan', origen: 'Web', estado: 'Existe', fuente: 'pixely_web/src/styles/sections/planes.css',
    desc: 'Nombre, volumen en tres segmentos (sin números), lista de lo incluido y un botón. Lo no incluido va tachado y con guion.',
    usar: ['Una tarjeta por plan, mismo orden de ítems en todas.', 'Volumen con palabras: Inicial, Medio, Mayor.'],
    evitar: ['Poner precios en piezas de captación.', 'Listas de más de seis ítems.'],
    stage: 'ink',
    html: `<article class="w-plan"><header><h4 class="w-pname"><small>PLAN</small>Basic</h4><p>Presencia constante, con estrategia y sin repetirte.</p></header>${vol(2, 'Medio')}${items(['Estudio de tu mercado', 'Estrategia y plan del mes', 'Aprobación en Partners', 'Producción multiformato', 'Calendario de publicación', 'Resultados de cada pieza'], [5])}<a class="w-btn w-btn--ghost" href="#"><span>Me interesa el Plan Basic</span><span class="w-btn__arrow">→</span></a></article>`,
    css: `.w-plan{display:grid;gap:24px;max-width:380px;padding:32px 28px;border-radius:24px;background:var(--card);box-shadow:inset 0 0 0 1px var(--edge)}
.w-pname{margin:0 0 10px;font:700 2.6rem/1 Unbounded;letter-spacing:-.02em}
.w-pname small{display:block;margin-bottom:6px;font:500 .9rem Unbounded;letter-spacing:.08em;color:var(--text-2)}
.w-plan header,.w-feat__card header{display:grid;gap:10px;justify-items:start}
.w-plan header p{margin:0;color:var(--text-2);font:500 1rem/1.45 Manrope}
.w-pvol{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px}
.w-pvol b{font:600 .85rem Unbounded}
.w-psegs{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
.w-psegs i{height:8px;border-radius:99px;background:var(--raised)}.w-psegs i.on{background:var(--pink)}
.w-pitems{display:grid;gap:14px;margin:0;padding:0;list-style:none}
.w-pitems li{display:grid;grid-template-columns:28px 1fr;align-items:center;gap:12px;font:600 1rem Manrope}
.w-pitems li.is-off{color:var(--text-2);font-weight:500}.w-pitems li.is-off span{text-decoration:line-through;text-decoration-color:rgba(255,255,255,.25)}
.w-pic{width:28px;height:28px;padding:5px;border-radius:50%;background:var(--pink);fill:none;stroke:#fff;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.is-off .w-pic{background:var(--raised);stroke:var(--text-2)}`,
    usa: ['btn-web', 'ind-badge-web'],
  },
  {
    id: 'precio-plan-destacado', cat, nombre: 'Tarjeta de plan destacada', origen: 'Web', estado: 'Existe', fuente: 'pixely_web/src/styles/sections/planes.css (.plan--featured)',
    desc: 'El plan recomendado: sube 16 px, tiene insignia y una luz rosa que recorre el borde.',
    usar: ['Solo un plan destacado.', 'Insignia con el beneficio principal (“Delegación total”).'],
    evitar: ['Animar más de un borde a la vez.'],
    stage: 'ink',
    html: `<div class="w-feat"><div class="w-feat__edge"></div><article class="w-feat__card"><header><span class="w-plan-badge">Delegación total</span><h4 class="w-pname"><small class="w-pro">PLAN</small>Pro</h4><p>Tú apruebas desde el celular; nosotros hacemos todo lo demás.</p></header>${vol(3, 'Mayor')}${items([...L, 'Resultados de cada pieza'])}<a class="w-btn w-btn--primary" href="#"><span>Me interesa el Plan Pro</span><span class="w-btn__arrow">→</span></a></article></div>`,
    css: `.w-feat{position:relative;max-width:380px;padding:1.5px;border-radius:24px;overflow:hidden;isolation:isolate}
.w-feat__edge{position:absolute;z-index:-2;left:50%;top:50%;width:200%;aspect-ratio:1;background:conic-gradient(from 0deg,transparent 0 55%,rgba(235,12,110,.25) 70%,#EB0C6E 85%,#fff 88%,transparent 92%);transform:translate(-50%,-50%);animation:w-edge 6s linear infinite}
@keyframes w-edge{to{transform:translate(-50%,-50%) rotate(360deg)}}
.w-feat__card{display:grid;gap:24px;padding:32px 28px;border-radius:calc(24px - 1.5px);background:linear-gradient(180deg,#1d0a14 0%,var(--card) 45%)}
.w-pro{color:var(--pink)!important}
@media (prefers-reduced-motion:reduce){.w-feat__edge{animation:none;transform:translate(-50%,-50%) rotate(200deg)}}`,
    usa: ['precio-plan', 'ind-badge-web'],
  },
  {
    id: 'precio-con-valor', cat, nombre: 'Tarjeta de plan con precio', origen: 'Web', estado: 'Propuesto', fuente: 'Por definir (aún no hay precios)',
    desc: 'Estructura lista para cuando se definan precios: cifra grande, periodo y condición. Los valores de abajo son de ejemplo.',
    usar: ['Cifra en Unbounded 40 px y periodo en 14 px.', 'Condición debajo (“sin permanencia”).'],
    evitar: ['Publicarla antes de definir precios y condiciones.'],
    stage: 'ink',
    html: `<article class="w-plan"><header><h4 class="w-pname"><small>PLAN</small>Lite</h4></header><p class="w-price"><b>S/ 000</b><span>/ mes</span></p><small class="w-note">Valor de ejemplo. Sin permanencia.</small><a class="w-btn w-btn--ghost" href="#"><span>Empezar con Lite</span><span class="w-btn__arrow">→</span></a></article>`,
    css: `.w-price{display:flex;align-items:baseline;gap:8px;margin:0}
.w-price b{font:700 2.6rem Unbounded;letter-spacing:-.03em}
.w-price span{font:600 .9rem Manrope;color:var(--text-2)}
.w-note{font:600 .85rem Manrope;color:var(--text-2)}`,
    usa: ['precio-plan'],
  },
  {
    id: 'precio-comparar', cat, nombre: 'Tabla comparativa de planes', origen: 'Web', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Compara los tres planes en una sola tabla: filas de beneficios, columnas de planes, con ✓ y guion.',
    usar: ['Encabezado fijo al desplazar.', 'En celular: tabla con desplazamiento lateral dentro de su contenedor.'],
    evitar: ['Más de 8 filas.'],
    stage: 'ink',
    html: `<div class="w-tablewrap"><table class="w-table"><thead><tr><th></th><th>Lite</th><th>Basic</th><th class="is-feat">Pro</th></tr></thead><tbody>
<tr><th>Estudio de tu mercado</th><td>✓</td><td>✓</td><td>✓</td></tr>
<tr><th>Aprobación en Partners</th><td>✓</td><td>✓</td><td>✓</td></tr>
<tr><th>Calendario de publicación</th><td class="no">–</td><td>✓</td><td>✓</td></tr>
<tr><th>Publicamos por ti</th><td class="no">–</td><td class="no">–</td><td>✓</td></tr>
<tr><th>Resultados de cada pieza</th><td class="no">–</td><td class="no">–</td><td>✓</td></tr></tbody></table></div>`,
    css: `.w-tablewrap{overflow-x:auto;border:1px solid var(--edge);border-radius:20px}
.w-table{width:100%;min-width:480px;border-collapse:collapse;font:600 .95rem Manrope}
.w-table th,.w-table td{padding:14px 16px;border-bottom:1px solid var(--edge);text-align:center}
.w-table tbody th{text-align:left;font-weight:600}
.w-table thead th{font:600 .78rem Unbounded;letter-spacing:.08em;text-transform:uppercase;color:var(--text-2)}
.w-table thead .is-feat{color:var(--pink)}
.w-table td.no{color:var(--mute)}
.w-table tr:last-child>*{border-bottom:0}`,
  },
];
