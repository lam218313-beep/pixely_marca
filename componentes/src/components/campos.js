import { ic } from '../icons.js';
const cat = 'campos';
export default [
  {
    id: 'campo-texto', cat, nombre: 'Campo de texto', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/Field.tsx',
    desc: 'Etiqueta arriba, campo de 56 px, ayuda o error debajo. Al enfocar, solo el borde fino se vuelve rosa: sin doble contorno.',
    usar: ['La etiqueta siempre visible (no solo placeholder).', 'Error: texto rosa que dice qué pasó y cómo arreglarlo.', 'Tamaño de letra 16 px para evitar el zoom de iOS.'],
    evitar: ['Mensajes de error genéricos (“Campo inválido”).'],
    stage: 'phone',
    html: `<div class="s-col">
<div class="p-field"><label for="f1">Correo</label><input id="f1" class="p-input" type="email" placeholder="tu@negocio.pe"><p class="p-hint">Es el mismo con el que te registraste.</p></div>
<div class="p-field"><label for="f2">Contraseña</label><input id="f2" class="p-input" type="password" value="12345" aria-invalid="true"><p class="p-err" role="alert">Usa al menos 8 caracteres.</p></div>
</div>`,
    css: `.p-field{display:flex;flex-direction:column;gap:8px}
.p-field label{font:700 13px Manrope;color:var(--text-2)}
.p-input{width:100%;height:56px;padding:0 18px;border:1px solid var(--line);border-radius:16px;background:var(--ink);color:#fff;font:600 16px Manrope;outline:none;transition:border-color .15s;box-sizing:border-box}
.p-input::placeholder{color:var(--text-3)}
.p-input:focus,.p-input:focus-visible{outline:none;border-color:var(--pink);background:#0E0E11}
.p-hint{margin:0;font:600 12px Manrope;color:var(--text-3)}
.p-err{margin:0;font:600 13px Manrope;color:var(--pink)}`,
  },
  {
    id: 'campo-area', cat, nombre: 'Área de texto', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/ui/Field.tsx (TextArea)',
    desc: 'Para pedir cambios o escribir comentarios. Sin redimensionar, 4 líneas.',
    usar: ['Contador de caracteres si hay límite.'],
    evitar: ['Áreas más pequeñas de 3 líneas.'],
    stage: 'phone',
    html: `<div class="p-field"><label for="f3">¿Qué cambiarías?</label><textarea id="f3" class="p-input p-area" rows="4" placeholder="Escríbelo con tus palabras"></textarea></div>`,
    css: `.p-area{height:auto;padding:14px 18px;line-height:1.6;resize:none}`,
    usa: ['campo-texto'],
  },
  {
    id: 'campo-switch', cat, nombre: 'Interruptor', origen: 'Partners', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Activar o desactivar una opción al instante (avisos, Face ID).',
    usar: ['Efecto inmediato, sin botón de guardar.', 'Con etiqueta a la izquierda y descripción debajo.'],
    evitar: ['Usarlo para elegir entre dos opciones con nombre (usa Segmentado).'],
    stage: 'phone',
    html: `<div class="p-setting"><span><b>Avisos por correo</b><small>Te escribimos cuando haya piezas por aprobar.</small></span><label class="p-switch"><input type="checkbox" checked><i></i><span class="sr">Avisos por correo</span></label></div>
<div class="p-setting"><span><b>Entrar con Face ID</b><small>Más rápido en este celular.</small></span><label class="p-switch"><input type="checkbox"><i></i><span class="sr">Entrar con Face ID</span></label></div>`,
    css: `.p-setting{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 0;border-bottom:1px solid var(--edge)}
.p-setting b{display:block;font:800 15px Manrope}
.p-setting small{display:block;margin-top:2px;font:600 13px Manrope;color:var(--text-3)}
.p-switch{position:relative;flex:none;width:52px;height:32px}
.p-switch input{position:absolute;inset:0;opacity:0;margin:0;cursor:pointer}
.p-switch i{position:absolute;inset:0;border-radius:99px;background:var(--mute);transition:background .2s;pointer-events:none}
.p-switch i::after{content:'';position:absolute;top:4px;left:4px;width:24px;height:24px;border-radius:50%;background:#fff;transition:transform .2s}
.p-switch input:checked+i{background:var(--pink)}
.p-switch input:checked+i::after{transform:translateX(20px)}
.p-switch input:focus-visible+i{outline:2px solid var(--pink);outline-offset:2px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}`,
  },
  {
    id: 'campo-check', cat, nombre: 'Casilla y opción única', origen: 'Partners', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Casillas para elegir varias cosas; opción única para elegir una (tipo de cambio, red social).',
    usar: ['Área táctil de toda la fila (mínimo 48 px).', 'Seleccionado: borde rosa y marca blanca.'],
    evitar: ['Casillas muy pequeñas sin fila pulsable.'],
    stage: 'phone',
    html: `<div class="s-col" style="gap:8px">
<label class="p-opt"><input type="radio" name="tp" checked><i class="p-opt__box p-opt__box--r"></i><span>Cambiar el texto</span></label>
<label class="p-opt"><input type="radio" name="tp"><i class="p-opt__box p-opt__box--r"></i><span>Cambiar la imagen</span></label>
<label class="p-opt"><input type="checkbox" checked><i class="p-opt__box">${ic('check', 14, 3.4)}</i><span>Instagram</span></label>
<label class="p-opt"><input type="checkbox"><i class="p-opt__box">${ic('check', 14, 3.4)}</i><span>TikTok</span></label>
</div>`,
    css: `.p-opt{position:relative;display:flex;align-items:center;gap:12px;min-height:52px;padding:0 16px;border:1px solid var(--edge);border-radius:16px;background:var(--card);font:700 15px Manrope;cursor:pointer}
.p-opt input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}
.p-opt__box{display:grid;place-items:center;flex:none;width:22px;height:22px;border-radius:7px;border:1.5px solid var(--line);color:transparent}
.p-opt__box--r{border-radius:50%}
.p-opt:has(input:checked){border-color:var(--pink)}
.p-opt input:checked+.p-opt__box{background:var(--pink);border-color:var(--pink);color:#fff}
.p-opt input:checked+.p-opt__box--r{box-shadow:inset 0 0 0 5px var(--card)}
.p-opt input:focus-visible+.p-opt__box{outline:2px solid var(--pink);outline-offset:2px}`,
  },
  {
    id: 'campo-select', cat, nombre: 'Selector desplegable', origen: 'Partners', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Para elegir entre muchas opciones (mes, red social, plan). Se ve igual que un campo de texto.',
    usar: ['Hasta 5 opciones: usa casillas u opción única. Más de 5: selector.'],
    evitar: ['Selector para dos opciones.'],
    stage: 'phone',
    html: `<div class="p-field"><label for="s1">Plan</label><div class="p-selectwrap"><select id="s1" class="p-input p-select"><option>Plan Pro</option><option>Plan Basic</option><option>Plan Lite</option></select>${ic('chevron-down', 18, 2.5)}</div></div>`,
    css: `.p-selectwrap{position:relative}
.p-select{appearance:none;-webkit-appearance:none;padding-right:48px}
.p-selectwrap svg{position:absolute;right:18px;top:50%;transform:translateY(-50%);color:var(--text-3);pointer-events:none}`,
    usa: ['campo-texto'],
  },
  {
    id: 'campo-buscar', cat, nombre: 'Buscador', origen: 'Partners', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Campo con lupa para filtrar listas (piezas, ideas, clientes del equipo).',
    usar: ['Botón para limpiar cuando hay texto.'],
    evitar: ['Buscador en listas de menos de 8 elementos.'],
    stage: 'phone',
    html: `<div class="p-search">${ic('search', 18, 2.4)}<input class="p-search__in" type="search" placeholder="Buscar una idea" aria-label="Buscar una idea"></div>`,
    css: `.p-search{display:flex;align-items:center;gap:10px;height:48px;padding:0 16px;border:1px solid var(--line);border-radius:16px;background:var(--ink);color:var(--text-3)}
.p-search:focus-within{border-color:var(--pink)}
.p-search input:focus,.p-search input:focus-visible{outline:none}
.p-search__in{flex:1;min-width:0;border:0;background:transparent;color:#fff;font:600 16px Manrope;outline:none}`,
  },
];
