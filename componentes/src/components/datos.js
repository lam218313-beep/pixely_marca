import { ic } from '../icons.js';
const cat = 'datos';
export default [
  {
    id: 'dato-cifra', cat, nombre: 'Cifra grande con contexto', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/features/resultados/ResultadosScreens.tsx',
    desc: 'Un solo número protagonista (alcance del mes) con una frase que lo explica.',
    usar: ['Cifra en Unbounded 48 px, sin tarjeta alrededor.', 'La frase destaca el dato clave en blanco.'],
    evitar: ['Más de una cifra grande por pantalla.'],
    stage: 'phone',
    html: `<section class="p-bignum"><h3 class="p-eyebrow">Alcance del mes</h3><p class="p-bignum__n">12,480</p><p class="p-bignum__t">cuentas vieron tus <b>9 publicaciones</b> de octubre.</p></section>`,
    css: `.p-bignum{display:flex;flex-direction:column;gap:6px}
.p-bignum__n{margin:0;font:700 48px/1 Unbounded;letter-spacing:-.04em}
.p-bignum__t{margin:0;font:600 14px/1.4 Manrope;color:var(--text-2)}
.p-bignum__t b{color:#fff}`,
  },
  {
    id: 'dato-kpi-icono', cat, nombre: 'Cifra con ícono', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/features/resultados/ResultadosScreens.tsx',
    desc: 'Pareja de tarjetas: ícono rosa, cifra y etiqueta. Para vistas, me gusta, comentarios, guardados.',
    usar: ['Dos por fila en celular.', 'Un solo color de ícono: rosa.'],
    evitar: ['Íconos distintos de color por métrica.'],
    stage: 'phone',
    html: `<div class="p-kpi2"><div class="p-card"><span>${ic('eye', 20)}</span><b>6,000</b><small>vistas</small></div><div class="p-card"><span>${ic('heart', 20)}</span><b>300</b><small>me gusta</small></div><div class="p-card"><span>${ic('message', 20)}</span><b>48</b><small>comentarios</small></div><div class="p-card"><span>${ic('trending-up', 20)}</span><b>+18%</b><small>vs. mes pasado</small></div></div>`,
    css: `.p-kpi2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.p-kpi2 .p-card{display:flex;flex-direction:column;gap:4px;padding:14px}
.p-kpi2 span{color:var(--pink)}
.p-kpi2 b{margin-top:4px;font:700 22px Unbounded;letter-spacing:-.04em}
.p-kpi2 small{font:700 12px Manrope;color:var(--text-3)}`,
    usa: ['card-base'],
  },
  {
    id: 'dato-barras', cat, nombre: 'Barras comparativas', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/features/resultados/ResultadosScreens.tsx (Tú vs tu competencia)',
    desc: 'Barras horizontales sobre una pista oscura. La marca del cliente en rosa; la competencia en gris.',
    usar: ['Ancho mínimo del 4 % para que siempre se vea.', 'Nombre a la izquierda y valor a la derecha, encima de la barra.'],
    evitar: ['Más de cinco barras.', 'Colores distintos por competidor.'],
    stage: 'phone',
    html: `<section class="p-card p-bars"><h3 class="p-eyebrow">Tú vs tu competencia</h3><p class="p-bars__h">Vas por encima del promedio<span class="p-dot-t">.</span></p>
<div><div class="p-bars__r"><b>Casa Norte</b><b>312</b></div><div class="p-track"><i style="width:100%"></i></div></div>
<div><div class="p-bars__r"><span>Moda Lima</span><b>240</b></div><div class="p-track"><i class="mute" style="width:77%"></i></div></div>
<div><div class="p-bars__r"><span>Textil Sur</span><b>96</b></div><div class="p-track"><i class="mute" style="width:31%"></i></div></div></section>`,
    css: `.p-bars{display:flex;flex-direction:column;gap:14px}
.p-bars__h{margin:0;font:700 18px/1.2 Unbounded;letter-spacing:-.04em}
.p-bars__r{display:flex;justify-content:space-between;margin-bottom:6px;font:700 13px Manrope;color:var(--text-2)}
.p-bars__r b{color:#fff;font-weight:800}
.p-track{height:12px;border-radius:99px;background:var(--ink)}
.p-track i{display:block;height:12px;border-radius:99px;background:var(--pink)}
.p-track i.mute{background:var(--mute)}`,
    usa: ['card-base'],
  },
  {
    id: 'dato-progreso', cat, nombre: 'Barra de progreso', origen: 'Partners', estado: 'Existe', fuente: 'frontend/app/src/features/validar/ValidarScreen.tsx · plan/PlanScreens.tsx',
    desc: 'Segmentos finos que avanzan al aprobar; sirven también como indicador de “8 de 12 listas”.',
    usar: ['Un segmento por pieza (máximo 12).', 'Rosa = hecho; line = pendiente.'],
    evitar: ['Porcentajes con decimales.'],
    stage: 'phone',
    html: `<div class="p-prog">${Array.from({ length: 12 }, (_, i) => `<i class="${i < 7 ? 'on' : ''}"></i>`).join('')}</div><div class="s-row" style="margin-top:12px;justify-content:space-between"><span class="p-hint">7 de 12 listas</span><span class="p-tag p-tag--pink">7 de 12</span></div>`,
    css: `.p-prog{display:grid;grid-template-columns:repeat(12,1fr);gap:6px}
.p-prog i{height:4px;border-radius:99px;background:var(--line)}
.p-prog i.on{background:var(--pink)}`,
  },
  {
    id: 'dato-donut', cat, nombre: 'Gráfico de anillo', origen: 'Partners', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Reparto de contenidos por pilar (educar, vender, conectar). Un solo color con tonos de pink y grises.',
    usar: ['Máximo cuatro porciones; la mayor en rosa.', 'Al centro, el total con su unidad (“12 piezas”), nunca un número suelto.', 'Leyenda con palabra y porcentaje; un hilo oscuro separa cada porción.'],
    evitar: ['Más de cuatro porciones o colores fuera de la paleta.'],
    stage: 'phone',
    html: `<div class="p-donut"><div class="p-donut__ring"><svg viewBox="0 0 120 120" role="img" aria-label="12 piezas: Educar 50 %, Vender 30 %, Conectar 20 %"><g fill="none" stroke-width="12" transform="rotate(-90 60 60)"><circle cx="60" cy="60" r="46" stroke="#EB0C6E" stroke-dasharray="141.5 289"/><circle cx="60" cy="60" r="46" stroke="#FFC2E1" stroke-dasharray="83.7 289" stroke-dashoffset="-144.5"/><circle cx="60" cy="60" r="46" stroke="#8A8A96" stroke-dasharray="54.8 289" stroke-dashoffset="-231.2"/></g></svg><span class="p-donut__c" aria-hidden="true"><b>12</b><small>piezas</small></span></div><ul><li><i style="background:#EB0C6E"></i>Educar <b>50 %</b></li><li><i style="background:#FFC2E1"></i>Vender <b>30 %</b></li><li><i style="background:#8A8A96"></i>Conectar <b>20 %</b></li></ul></div>`,
    css: `.p-donut{display:flex;align-items:center;gap:24px}
.p-donut__ring{position:relative;flex:none;width:132px;height:132px}
.p-donut__ring svg{display:block;width:100%;height:100%}
.p-donut__c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
.p-donut__c b{font:700 28px/1 Unbounded;letter-spacing:-.04em;color:#fff;font-variant-numeric:tabular-nums}
.p-donut__c small{font:700 11px Manrope;letter-spacing:.08em;text-transform:uppercase;color:var(--text-3)}
.p-donut ul{display:grid;gap:10px;margin:0;padding:0;list-style:none;font:700 14px Manrope;color:var(--text-2)}
.p-donut li{display:flex;align-items:center;gap:8px}.p-donut li b{margin-left:auto;padding-left:16px;color:#fff;font-variant-numeric:tabular-nums}
.p-donut li i{width:10px;height:10px;border-radius:50%}`,
  },
  {
    id: 'dato-tabla', cat, nombre: 'Tabla de datos', origen: 'Partners', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Para el equipo en computadora: lista de piezas con estado y métricas, en columnas.',
    usar: ['Encabezado en mayúsculas pequeñas.', 'En celular se transforma en filas pulsables.'],
    evitar: ['Tablas en la vista del cliente en celular.'],
    stage: 'wide',
    html: `<div class="p-tablewrap"><table class="p-table"><thead><tr><th>Pieza</th><th>Formato</th><th>Estado</th><th class="r">Alcance</th></tr></thead><tbody>
<tr><td>Tres formas de llevar el negro</td><td>Reel</td><td><span class="p-chip p-chip--aprobada">${ic('check', 11, 3)} Aprobada</span></td><td class="r">6,000</td></tr>
<tr><td>Detrás del mostrador</td><td>Carrusel</td><td><span class="p-chip p-chip--te-toca">${ic('clock', 11, 3)} Te toca</span></td><td class="r">—</td></tr>
<tr><td>Cómo cuidar el lino</td><td>Imagen</td><td><span class="p-chip p-chip--produccion">${ic('sparkles', 11, 3)} En producción</span></td><td class="r">—</td></tr></tbody></table></div>`,
    css: `.p-tablewrap{overflow-x:auto;border:1px solid var(--edge);border-radius:20px;background:var(--card)}
.p-table{width:100%;min-width:520px;border-collapse:collapse;font:600 14px Manrope}
.p-table th{padding:12px 16px;text-align:left;font:800 11px Manrope;letter-spacing:.12em;text-transform:uppercase;color:var(--text-3);border-bottom:1px solid var(--edge)}
.p-table td{padding:14px 16px;border-bottom:1px solid var(--edge)}
.p-table tr:last-child td{border-bottom:0}
.p-table .r{text-align:right}`,
    usa: ['ind-estados'],
  },
  {
    id: 'dato-sparkline', cat, nombre: 'Minigráfico de tendencia', origen: 'Partners', estado: 'Propuesto', fuente: 'Por implementar',
    desc: 'Línea simple de evolución dentro de una tarjeta de cifra. Sin ejes; el último punto resaltado.',
    usar: ['Una sola línea, rosa. Punto final con halo.', 'Siempre junto a la cifra actual y el cambio.'],
    evitar: ['Ejes, cuadrícula o varias series.'],
    stage: 'phone',
    html: `<section class="p-card p-spark"><div><h3 class="p-eyebrow">Seguidores</h3><p class="p-bignum__n" style="font-size:32px;margin-top:6px">1,284</p><span class="p-tag p-tag--pink">${ic('trending-up', 12, 2.6)}&nbsp;+9 %</span></div><svg viewBox="0 0 120 56" width="120" height="56" aria-label="Seguidores en las últimas 8 semanas"><path d="M2 46 L19 40 L36 42 L53 30 L70 33 L87 20 L104 14" fill="none" stroke="#EB0C6E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="104" cy="14" r="8" fill="#EB0C6E" opacity=".2"/><circle cx="104" cy="14" r="3.5" fill="#EB0C6E"/></svg></section>`,
    css: `.p-spark{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}`,
    usa: ['card-base', 'dato-cifra'],
  },
];
