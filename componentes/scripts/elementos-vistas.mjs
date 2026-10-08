// Vistas de las propuestas de elementos que se muestran con capturas reales de la app:
// 09 cuadros de volumen, 11 la brecha y 13 a 17 (pantallas y dispositivos).
// Todo se dibuja en % y cqw para que escale con la tarjeta del catálogo.
import { ic } from '../src/icons.js';

const fig = (cap, html) => `<figure>${html}<figcaption>${cap}</figcaption></figure>`;
const RESPLANDOR = 'radial-gradient(60% 55% at 50% 38%, rgba(235, 12, 110, .20), transparent 70%)';
const OSCURO = `background:${RESPLANDOR},#0A0A0C`; // sin trama detrás de pantallas (8 oct)
const BLANCO = 'background:#fff;color:#0A0A0C';
const RATIO = 1548 / 760; // alto/ancho de las capturas del celular

// Una parte de una captura: centro (fx, fy) en fracciones de la captura, ancho visible r, caja de alto/ancho = aspecto.
const zoom = (cap, fx, fy, r, aspecto = 1) => {
  const rh = (r * aspecto) / RATIO;
  const px = r >= 1 ? 0 : ((fx - r / 2) / (1 - r)) * 100;
  const py = ((fy - rh / 2) / (1 - rh)) * 100;
  return `background-image:url(capturas/${cap}.webp);background-size:${(100 / r).toFixed(1)}% auto;background-position:${px.toFixed(1)}% ${py.toFixed(1)}%`;
};
// Celular: v = vitrina | plano | flotante. pos = left/top/width en % de la figura.
const cel = (cap, v, pos, dentro = '') => `<div class="cel cel--${v}" style="${pos}"><div class="cel__s"><img src="capturas/${cap}.webp" alt="" loading="lazy">${dentro}</div></div>`;
// Punto de la pantalla (fx, fy) llevado a % de una figura de proporción ancho/alto = k, con el celular en left/top/width.
const punto = (left, top, width, k, fx, fy) => {
  const alto = width * RATIO * k; // alto del celular en % del alto de la figura
  return [left + width * (0.027 + 0.946 * fx), top + alto * (0.0134 + 0.973 * fy)];
};
const svg = (d) => `<svg class="mk__ln" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${d}</svg>`;
const linea = (x1, y1, x2, y2, c = 'rgba(255,255,255,.55)') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="1.4" vector-effect="non-scaling-stroke"/>`;
const at = (x, y, extra = '') => `left:${x.toFixed(2)}%;top:${y.toFixed(2)}%;${extra}`;

// ---------- 13 · Celular con pantalla ----------
const vista13 = (p) => [
  fig('Grande, fondo negro', `<div class="mk" style="aspect-ratio:4/5;${OSCURO}">${cel('m-inicio', p.id, 'left:29%;top:12%;width:42%')}</div>`),
  fig('Página blanca', `<div class="mk mk--claro">${cel('m-validar', p.id, 'left:28%;top:16%;width:44%')}</div>`),
  fig('Tres en fila · manual', `<div class="mk" style="aspect-ratio:16/10;${OSCURO}">${cel('m-inicio', p.id, 'left:9%;top:9%;width:24%')}${cel('m-validar', p.id, 'left:38%;top:9%;width:24%')}${cel('m-resultado', p.id, 'left:67%;top:9%;width:24%')}</div>`),
  fig('Inclinado · video y redes', `<div class="mk" style="aspect-ratio:4/5;${OSCURO}">${cel('m-pieza', p.id, 'left:28%;top:11%;width:44%;transform:perspective(80cqw) rotateY(-24deg) rotateX(8deg) rotateZ(3deg)')}</div>`),
].join('');

// ---------- 14 · Laptop con pantalla ----------
const lapDibujada = (cap, pos) => `<div class="lap" style="${pos}"><div class="lap__s"><img src="capturas/${cap}.webp" alt="" loading="lazy"></div><div class="lap__b"></div></div>`;
const lapNavegador = (cap, pos) => `<div class="nav" style="${pos}"><div class="nav__b"><i></i><i></i><i></i><span>partners.pixely.pe</span></div><img src="capturas/${cap}.webp" alt="" loading="lazy"></div>`;
const vista14 = (p) => {
  if (p.id === 'escena') return [
    fig('La escena real', `<div class="mk" style="aspect-ratio:1400/676"><img class="mk__full" src="capturas/escena-laptop.webp" alt="" loading="lazy"></div>`),
    fig('En una página', `<div class="mk mk--portada"><span class="mk__wm">pixely<b>.</b></span><b class="mk__h mk__h--s">También en<br>tu compu<i>.</i></b><div class="mk__foto" style="top:42%"><img src="capturas/escena-laptop.webp" alt="" loading="lazy"></div></div>`),
  ].join('');
  const dib = p.id === 'dibujada' ? lapDibujada : lapNavegador;
  return [
    fig('Fondo negro', `<div class="mk" style="aspect-ratio:16/10;${OSCURO}">${dib('d-mercado', 'left:12%;top:12%;width:76%')}</div>`),
    fig('Página blanca', `<div class="mk mk--claro"><span class="mk__wm">pixely<b>.</b></span><b class="mk__h mk__h--s">Planificación<i>.</i></b>${dib('d-planificacion', 'left:7%;top:36%;width:86%')}</div>`),
  ].join('');
};

// ---------- 15 · Acercamiento de un detalle ----------
// Detalle: el botón «Revisar ahora» de Inicio, y la tarjeta «Te toca a ti».
const vista15 = (p) => {
  const caja = (fondo, cls = '') => `<div class="mk${cls}" style="aspect-ratio:16/10;${fondo}">`;
  const texto = (x, y, claro) => `<div class="zm__t${claro ? ' zm__t--claro' : ''}" style="${at(x, y)}"><b>Revisar ahora</b><span>Un toque y ves las piezas que esperan tu visto bueno.</span></div>`;
  const hacer = (claro) => {
    const fondo = claro ? BLANCO : OSCURO, c = claro ? 'rgba(10,10,12,.45)' : 'rgba(255,255,255,.55)';
    const L = 10, T = 8, W = 26;
    if (p.id === 'lupa') {
      const [sx, sy] = punto(L, T, W, 1.6, 0.31, 0.297);
      return `${caja(fondo)}${cel('m-inicio', 'vitrina', `left:${L}%;top:${T}%;width:${W}%`)}<span class="zm__src" style="${at(sx, sy)}"></span>
        <div class="zm__lupa" style="left:44%;top:14%;width:28%;${zoom('m-inicio', 0.3, 0.297, 0.42)}"></div>${svg(linea(sx, sy, 44, 36.4, c))}${texto(75, 28, claro)}</div>`;
    }
    if (p.id === 'tarjeta') {
      const [x1, y1] = punto(L, T, W, 1.6, 0.047, 0.124), [x2, y2] = punto(L, T, W, 1.6, 0.953, 0.351);
      const cx = 46, cy = 18, cw = 44, ch = cw * 0.51 * 1.6;
      return `${caja(fondo)}${cel('m-inicio', 'vitrina', `left:${L}%;top:${T}%;width:${W}%`)}<span class="zm__marco" style="${at(x1, y1, `width:${x2 - x1}%;height:${y2 - y1}%`)}"></span>
        ${svg(linea(x2, y1, cx + cw, cy, c) + linea(x2, y2, cx + cw, cy + ch, c))}
        <div class="zm__card" style="${at(cx, cy, `width:${cw}%;height:${ch}%;${zoom('m-inicio', 0.5, 0.2375, 0.906, 0.51)}`)}"></div>
        <div class="zm__t${claro ? ' zm__t--claro' : ''}" style="${at(cx, cy + ch + 5)}width:40%"><b>Te toca a ti</b><span>Lo primero que ves al entrar: cuántas piezas esperan tu visto bueno.</span></div></div>`;
    }
    // foco: la pantalla se atenúa menos la parte que importa, y esa parte se ve en grande al lado.
    return `${caja(fondo)}${cel('m-inicio', 'vitrina', `left:${L}%;top:${T}%;width:${W}%`, '<span class="zm__foco" style="left:4.7%;top:12.4%;width:90.6%;height:22.7%"></span>')}
      <div class="zm__card" style="${at(44, 16, `width:46%;height:${46 * 0.51 * 1.6}%;${zoom('m-inicio', 0.5, 0.2375, 0.906, 0.51)}`)}"></div>
      <div class="zm__t${claro ? ' zm__t--claro' : ''}" style="${at(44, 62)}width:44%"><b>Te toca a ti</b><span>Lo primero que ves al entrar: cuántas piezas esperan tu visto bueno.</span></div></div>`;
  };
  return [fig('Fondo negro', hacer(false)), fig('Página blanca · manual', hacer(true))].join('');
};

// ---------- 16 · Llamada sin números ----------
const LLAMADAS = [
  { fx: 0.79, fy: 0.185, lado: 'der', y: 22, t: 'Cuándo sale', d: 'La fecha en que se publica.', i: 'clock', w: 7.4, h: 2.6 },
  { fx: 0.713, fy: 0.814, lado: 'der', y: 74, t: 'Aprobar', d: 'Un toque y la pieza queda lista.', i: 'check', w: 5.6, h: 9 },
  { fx: 0.321, fy: 0.814, lado: 'izq', y: 74, t: 'Pedir cambios', d: 'Escribes qué ajustar.', i: 'pen-line', w: 4.6, h: 7.4 },
];
const vista16 = (p) => {
  const hacer = (claro) => {
    const fondo = claro ? BLANCO : OSCURO, c = claro ? 'rgba(10,10,12,.5)' : 'rgba(255,255,255,.6)';
    const L = 37, T = 7, W = 26;
    let lineas = '', capas = '';
    for (const k of LLAMADAS) {
      const [x, y] = punto(L, T, W, 1.6, k.fx, k.fy);
      const der = k.lado === 'der', fin = der ? 70 : 30;
      if (p.id === 'linea') {
        lineas += linea(x, y, fin, y, c);
        capas += `<span class="ll__p" style="${at(x, y)}"></span><span class="ll__e${claro ? ' ll__e--claro' : ''} ll__e--${k.lado}" style="${at(fin, y)}">${k.t}</span>`;
      } else if (p.id === 'marco') {
        capas += `<span class="ll__m" style="${at(x - k.w / 2, y - k.h / 2, `width:${k.w}%;height:${k.h}%`)}"><b class="ll__tag ll__tag--${k.lado}${k.fy > 0.5 ? ' ll__tag--abajo' : ''}">${k.t}</b></span>`;
      } else {
        const ty = k.y, codoX = der ? x + 4 : x - 4;
        lineas += `<polyline points="${x},${y} ${codoX},${y} ${codoX},${ty} ${fin},${ty}" fill="none" stroke="${c}" stroke-width="1.4" vector-effect="non-scaling-stroke"/>`;
        capas += `<span class="ll__p" style="${at(x, y)}"></span><div class="ll__c${claro ? ' ll__c--claro' : ''} ll__c--${k.lado}" style="${at(fin, ty)}"><i>${ic(k.i, 14, 2.4)}</i><span><b>${k.t}</b>${k.d}</span></div>`;
      }
    }
    return `<div class="mk" style="aspect-ratio:16/10;${fondo}">${cel('m-validar', 'vitrina', `left:${L}%;top:${T}%;width:${W}%`)}${lineas ? svg(lineas) : ''}${capas}</div>`;
  };
  return [fig('Fondo negro', hacer(false)), fig('Página blanca · manual', hacer(true))].join('');
};

// ---------- 17 · Pantalla con funciones alrededor ----------
const FUNCIONES = [
  ['bell', 'Te avisa qué revisar', 'Las piezas que esperan tu visto bueno.'],
  ['calendar-days', 'Tu plan del mes', 'Qué sale, cuándo y por qué.'],
  ['check', 'Apruebas con un toque', 'O pides cambios por escrito.'],
  ['chart', 'Ves cómo le fue', 'Cada pieza frente a tu promedio.'],
  ['search', 'Tu mercado', 'Lo que hace tu competencia.'],
  ['message', 'Tu voz de marca', 'Cómo habla tu negocio.'],
];
const vista17 = (p) => {
  const caja = `<div class="mk" style="aspect-ratio:16/9;${OSCURO}">`;
  if (p.id === 'alrededor') {
    const pos = [[23, 20], [77, 20], [15, 47], [85, 47], [23, 74], [77, 74]];
    return fig('Imagen principal', `${caja}${cel('m-inicio', 'vitrina', 'left:41%;top:8%;width:18%')}${FUNCIONES.map(([i, t], n) => `<span class="fx__chip" style="${at(pos[n][0], pos[n][1])}"><i>${ic(i, 14, 2.4)}</i>${t}</span>`).join('')}</div>`);
  }
  if (p.id === 'columnas') {
    const item = ([i, t, d], lado, y) => `<div class="fx__it fx__it--${lado}" style="top:${y}%"><i>${ic(i, 16, 2.2)}</i><span><b>${t}</b>${d}</span></div>`;
    return fig('Imagen principal', `${caja}${cel('m-inicio', 'vitrina', 'left:41%;top:8%;width:18%')}${FUNCIONES.slice(0, 3).map((f, n) => item(f, 'izq', 18 + n * 24)).join('')}${FUNCIONES.slice(3).map((f, n) => item(f, 'der', 18 + n * 24)).join('')}</div>`);
  }
  // piezas: partes reales de la app salen flotando alrededor del celular.
  const pieza = (cap, fx, fy, r, a, pos, giro, t) => `<div class="fx__pz" style="${pos};transform:rotate(${giro}deg)"><div style="aspect-ratio:${(1 / a).toFixed(3)};${zoom(cap, fx, fy, r, a)}"></div><b>${t}</b></div>`;
  return fig('Imagen principal', `${caja}${cel('m-inicio', 'vitrina', 'left:41%;top:8%;width:18%')}
    ${pieza('m-inicio', 0.5, 0.2375, 0.906, 0.51, 'left:8%;top:14%;width:28%', -4, 'Te avisa qué revisar')}
    ${pieza('m-pieza', 0.5, 0.947, 0.906, 0.144, 'left:64%;top:20%;width:29%', 3, 'Apruebas o pides cambios')}
    ${pieza('m-resultado', 0.5, 0.85, 0.906, 0.3, 'left:63%;top:56%;width:29%', -2, 'Ves cómo le fue')}
    ${pieza('m-resultado', 0.209, 0.743, 0.33, 0.25, 'left:12%;top:62%;width:20%', 3, 'La mejor del mes')}</div>`);
};

// ---------- 09 · Cuadros de volumen (rediseño: que se lean las cantidades) ----------
const PLANES = [['Lite', 6, 2, 2], ['Basic', 8, 4, 3], ['Pro', 12, 8, 5]];
const vista09 = (p) => {
  const ICI = ic('image', 13, 2.2), ICR = ic('play', 13, 2.4);
  if (p.id === 'filas') return PLANES.map(([n, f, r, s]) => fig(`Plan ${n}`, `<div class="vol vol--filas">
      <b class="vol__plan">Plan ${n}</b>
      <div class="vol__fila"><span class="vol__n">${f}</span><span class="vol__l">${ICI} imágenes y carruseles</span><span class="vol__q">${'<i></i>'.repeat(f)}</span></div>
      <div class="vol__fila vol__fila--r"><span class="vol__n">${r}</span><span class="vol__l">${ICR} reels</span><span class="vol__q">${'<i></i>'.repeat(r)}</span></div>
      <p class="vol__pie">Publicado en ${s} redes · ${f + r} piezas al mes</p></div>`)).join('');
  if (p.id === 'cifras') return fig('Los tres planes', `<div class="vol vol--tabla"><span></span>${PLANES.map(([n]) => `<b class="vol__th">${n}</b>`).join('')}
      <span class="vol__rl">${ICI} Imágenes y carruseles</span>${PLANES.map(([, f]) => `<b class="vol__c">${f}</b>`).join('')}
      <span class="vol__rl vol__rl--r">${ICR} Reels</span>${PLANES.map(([, , r]) => `<b class="vol__c vol__c--r">${r}</b>`).join('')}
      <span class="vol__rl">${ic('share', 13, 2.2)} Redes</span>${PLANES.map(([, , , s]) => `<b class="vol__c vol__c--s">${s}</b>`).join('')}</div>`);
  return PLANES.map(([n, f, r]) => fig(`Plan ${n}`, `<div class="vol vol--mini"><b class="vol__plan">${f} imágenes <span>·</span> <em>${r} reels</em></b>
      <div class="vol__grid">${'<i class="vol__img"></i>'.repeat(f)}${'<i class="vol__reel"></i>'.repeat(r)}</div><p class="vol__pie">Plan ${n} · cada cuadro es una pieza del mes</p></div>`)).join('');
};

// ---------- 11 · La brecha (rediseño) ----------
const vista11 = (p) => {
  if (p.id === 'escala') return fig('Página negra', `<div class="br br--escala"><b class="br__k">La brecha que cerramos</b>
      <div class="br__eje">${Array.from({ length: 11 }, (_, i) => `<span style="left:${i * 10}%"><i></i>${i}</span>`).join('')}
        <span class="br__hueco" style="left:40%;width:50%">La brecha · aquí entra Pixely</span>
        <span class="br__mk br__mk--gris" style="left:40%"><b>4</b>Lo que comunican tus fotos</span>
        <span class="br__mk" style="left:90%"><b>9</b>Lo bueno que es tu producto</span></div>
      <p class="br__nota">Ejemplo ilustrativo.</p></div>`);
  if (p.id === 'escalones') return fig('Página negra', `<div class="br br--escalones"><b class="br__k">La brecha que cerramos</b>
      <div class="br__cols"><div class="br__col"><span class="br__bar" style="height:92%"></span><b>Lo bueno que es tu producto</b></div>
        <div class="br__col"><span class="br__bar br__bar--gris" style="height:38%"></span><span class="br__llave" style="bottom:38%;height:54%"><em>La brecha</em></span><b>Lo que comunican tus fotos</b></div></div>
      <p class="br__nota">Pixely cierra la diferencia con piezas hechas para tu negocio. Ejemplo ilustrativo.</p></div>`);
  const foto = (f) => `<div class="br__foto" style="${zoom('m-validar', 0.5, 0.36, 0.86, 0.9)};${f}"></div>`;
  return fig('Página negra', `<div class="br br--antes"><div class="br__lado"><span class="br__et">Hoy</span>${foto('filter:grayscale(.7) brightness(.55) contrast(.8) blur(1.2px)')}<span class="br__med"><i style="width:40%"></i></span><b>Lo que comunican tus fotos</b></div>
      <div class="br__lado"><span class="br__et br__et--pk">Con Pixely</span>${foto('')}<span class="br__med"><i class="pk" style="width:90%"></i></span><b>Lo bueno que es tu producto, a la vista</b></div><p class="br__nota">Ejemplo ilustrativo.</p></div>`);
};


// ---------- 18 · Insignia sobre foto ----------
const vista18 = (p) => {
  const ins = (i, t) => `<span class="ins ins--${p.id}"><i>${ic(i, 16, 2.6)}</i>${t}</span>`;
  const foto = (f, ar, pos = 'center') => `<img class="mk__full" src="elementos/fotos/${f}.webp" alt="" loading="lazy" style="object-position:${pos}">`;
  return [
    fig('Foto vertical · brochure', `<div class="mk" style="aspect-ratio:4/5">${foto('panadero', '4/5', 'center 30%')}${ins('check', 'Tu marca se decide aquí')}</div>`),
    fig('Foto horizontal', `<div class="mk" style="aspect-ratio:3/2">${foto('paso-2', '3/2')}${ins('smartphone', 'Apruebas desde tu celular')}</div>`),
    fig('Post 4:5', `<div class="mk" style="aspect-ratio:4/5">${foto('historia', '4/5', 'center 20%')}${ins('sparkles', 'Hecho para tu negocio')}</div>`),
  ].join('');
};

// ---------- 19 · Número de paso ----------
const PASOS = [['Investigar', 'Leemos tu mercado y a tu competencia.'], ['Planificar', 'Armamos el plan del mes, con su porqué.'], ['Aprobar', 'Apruebas cada pieza desde el celular.'], ['Publicar y medir', 'Publicamos y vemos cómo le fue.']];
const vista19 = (p) => {
  const paso = (n, [t, d]) => `<div class="pa__i"><span class="pa__n">${p.id === 'circulo' ? n : String(n).padStart(2, '0')}</span><div><b>${t}</b><span>${d}</span></div></div>`;
  const caja = (dir, claro) => `<div class="pa pa--${p.id} pa--${dir}${claro ? ' pa--claro' : ''}">${PASOS.map((x, i) => paso(i + 1, x)).join('')}</div>`;
  return [fig('En fila · fondo negro', caja('fila', false)), fig('En lista · página blanca', caja('lista', true))].join('');
};

// ---------- 20 · Sello «Aprobada» ----------
const vista20 = (p) => {
  const foto = `<div class="ap__img" style="${zoom('m-validar', 0.5, 0.36, 0.86, 0.9)}"></div>`;
  const sello = {
    chip: `<span class="ap__chip">${ic('check', 12, 3)} Aprobada</span>`,
    sello: `<span class="ap__sello"><i>${ic('check', 28, 3)}</i>Aprobada</span>`,
    banda: `<span class="ap__banda">${ic('check', 14, 3)} Aprobada · lista para publicar</span>`,
  }[p.id];
  const tarjeta = `<div class="ap"><div class="ap__f">${foto}${p.id === 'chip' ? '' : sello}</div><div class="ap__t"><b>Tres formas de llevar el negro</b><span>Carrusel · mié 7 oct</span>${p.id === 'chip' ? sello : ''}</div></div>`;
  const historia = `<div class="mk" style="aspect-ratio:9/16;${OSCURO}"><div class="ap ap--h"><div class="ap__f">${foto}${p.id === 'chip' ? '' : sello}</div>${p.id === 'chip' ? `<div class="ap__t">${sello}</div>` : ''}</div><b class="ap__frase">Tú decides.<br>Y queda listo<i>.</i></b></div>`;
  return [fig('Sobre la pieza', tarjeta), fig('Historia 9:16 · el momento', historia)].join('');
};

// ---------- 21 · Selector de plan ----------
const NIVEL = { Lite: 1, Basic: 2, Pro: 3 };
const vista21 = (p) => {
  const sel = (actual) => {
    if (p.id === 'segmentado') return `<span class="sp sp--seg">${Object.keys(NIVEL).map((n) => `<b class="${n === actual ? 'on' : ''}">${n}</b>`).join('')}</span>`;
    if (p.id === 'escalera') return `<span class="sp sp--esc">${Object.keys(NIVEL).map((n, i) => `<b class="${NIVEL[n] <= NIVEL[actual] ? 'on' : ''}${n === actual ? ' yo' : ''}"><i style="height:${36 + i * 30}%"></i>${n}</b>`).join('')}</span>`;
    return `<span class="sp sp--pts"><b>Plan ${actual}</b><span>${[1, 2, 3].map((k) => `<i class="${k <= NIVEL[actual] ? 'on' : ''}"></i>`).join('')}</span><em>nivel ${NIVEL[actual]} de 3</em></span>`;
  };
  return [
    fig('En la ficha del plan', `<div class="mk mk--portada sp__hoja"><span class="mk__wm">pixely<b>.</b></span><span class="sp__arriba">${sel('Basic')}</span><b class="mk__h">Plan<br>Basic<i>.</i></b><span class="mk__t"></span><span class="mk__t mk__t--c"></span></div>`),
    fig('Los tres estados', `<div class="sp__tres">${['Lite', 'Basic', 'Pro'].map((n) => sel(n)).join('')}</div>`),
  ].join('');
};

// ---------- 22 · Lista incluido / no incluido (datos del servicio de Planes v2, en revisión) ----------
const SI = 1, NO = 0;
const FILAS = [
  ['Estudio de mercado de tu nicho', [SI, SI, SI]],
  ['Vigilancia de tu competencia', ['Mensual', 'Quincenal', 'Semanal']],
  ['Reels con guion y edición', ['2', '4', '8']],
  ['Calendario con día y hora', [NO, SI, SI]],
  ['Publicamos por ti', [NO, NO, SI]],
  ['Resultados frente a tu competencia', [NO, NO, SI]],
];
const desde = (v) => (v[1] === NO ? 'Solo Pro' : 'Desde Basic');
const vista22 = (p) => {
  const lista = (plan, claro) => {
    const k = { Lite: 0, Basic: 1, Pro: 2 }[plan];
    const filas = FILAS.map(([t, v]) => {
      const x = v[k];
      if (x === NO) return p.id === 'candado'
        ? `<li class="li li--no"><i class="li__lock">${ic('lock', 12, 2.6)}</i><span>${t}<em class="li__sube">${desde(v)}</em></span></li>`
        : `<li class="li li--no"><i class="li__x">${ic('x', 11, 3)}</i><span>${t}</span><em class="li__tag">${desde(v)}</em></li>`;
      return `<li class="li"><i class="li__ok">${ic('check', 11, 3.2)}</i><span>${t}</span>${x === SI ? '' : `<b class="li__v">${x}</b>`}</li>`;
    }).join('');
    return `<div class="lis${claro ? ' lis--claro' : ''}"><b class="lis__h">Plan ${plan}</b><ul>${filas}</ul></div>`;
  };
  if (p.id === 'tabla') {
    const celda = (x) => (x === SI ? `<i class="li__ok">${ic('check', 11, 3.2)}</i>` : x === NO ? '<span class="tb__no">—</span>' : `<b class="li__v">${x}</b>`);
    const tabla = (claro) => `<div class="tb${claro ? ' tb--claro' : ''}"><span></span><b>Lite</b><b>Basic</b><b class="tb__pro">Pro</b>${FILAS.map(([t, v]) => `<span class="tb__t">${t}</span>${v.map(celda).join('')}`).join('')}</div>`;
    return [fig('Fondo negro', tabla(false)), fig('Página blanca', tabla(true))].join('');
  }
  return [fig('Plan Lite · fondo negro', lista('Lite', false)), fig('Plan Basic · página blanca', lista('Basic', true))].join('');
};

export const VISTAS_EXTRA = { 9: vista09, 11: vista11, 13: vista13, 14: vista14, 15: vista15, 16: vista16, 17: vista17, 18: vista18, 19: vista19, 20: vista20, 21: vista21, 22: vista22 };

export const vistasCSS = `
/* ===== Vistas con capturas (09, 11, 13 a 17) ===== */
.pr__g--9,.pr__g--11,.pr__g--14,.pr__g--15,.pr__g--16{grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))!important}
.pr__g--13{grid-template-columns:.8fr .8fr 1.3fr .8fr!important}.pr__g--17{grid-template-columns:1fr!important}
@media (max-width:760px){.pr__g--13{grid-template-columns:1fr 1fr!important}}
.mk__ln{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
.mk__full{position:static!important;width:100%;height:100%;object-fit:cover}
.mk__foto{position:absolute;left:7%;right:7%;bottom:6%;border-radius:2.4cqw;overflow:hidden}.mk__foto img{position:static;width:100%;height:100%;object-fit:cover}
/* celular */
.cel{position:absolute;aspect-ratio:412/839}
.cel__s{position:absolute;inset:0;overflow:hidden;border-radius:13.8%/6.8%;background:#0A0A0C}
.cel__s img{position:static;display:block;width:100%;height:100%;object-fit:cover;object-position:top}
.cel--vitrina{border-radius:15.8%/7.7%;background:linear-gradient(160deg,#3a3a44,#121216 40%,#26262e);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.14),0 5cqw 8cqw rgba(0,0,0,.55),0 0 5cqw rgba(235,12,110,.14)}
.cel--vitrina .cel__s{inset:1.34% 2.7%}
.cel--vitrina::before{content:'';position:absolute;z-index:3;top:3.1%;left:50%;width:28%;height:3.1%;transform:translateX(-50%);border-radius:99px;background:#000}
.cel--vitrina .cel__s::after{content:'';position:absolute;inset:0;z-index:2;background:linear-gradient(115deg,rgba(255,255,255,.10),rgba(255,255,255,.02) 28%,transparent 42%);pointer-events:none}
.cel--plano{border-radius:15.8%/7.7%;background:#0A0A0C;box-shadow:inset 0 0 0 1.5px #3A3A44,0 4cqw 7cqw rgba(0,0,0,.5)}
.cel--plano .cel__s{inset:1.6% 3.2%}
.cel--plano::before{content:'';position:absolute;z-index:3;top:2.4%;left:50%;width:4%;aspect-ratio:1;transform:translateX(-50%);border-radius:50%;background:#26262E}
.cel--flotante .cel__s{box-shadow:0 0 0 1px rgba(255,255,255,.14),0 5cqw 10cqw -1cqw rgba(0,0,0,.75)}
.mk--claro .cel--plano{box-shadow:inset 0 0 0 1.5px #3A3A44,0 4cqw 7cqw rgba(0,0,0,.25)}.mk--claro .cel--flotante .cel__s{box-shadow:0 0 0 1px rgba(10,10,12,.12),0 4cqw 8cqw -1cqw rgba(0,0,0,.3)}
/* laptop */
.lap,.nav{position:absolute}
.lap__s{aspect-ratio:16/10;border:1.2cqw solid #1b1b20;border-bottom-width:1.7cqw;border-radius:2cqw 2cqw .7cqw .7cqw;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06),0 5cqw 7cqw rgba(0,0,0,.5),0 0 5cqw rgba(235,12,110,.12)}
.lap__s img,.nav img{position:static;display:block;width:100%;height:100%;object-fit:cover;object-position:top}
.lap__b{height:1.7cqw;margin:0 -7%;border-radius:0 0 2cqw 2cqw;background:linear-gradient(#2a2a32,#121216)}
.nav{border-radius:1.6cqw;overflow:hidden;background:#16161B;box-shadow:0 0 0 1px #33333C,0 5cqw 8cqw rgba(0,0,0,.5)}
.nav img{aspect-ratio:16/10}
.nav__b{display:flex;align-items:center;gap:.7cqw;height:3.6cqw;padding:0 1.4cqw;background:#1F1F26}
.nav__b i{width:.9cqw;height:.9cqw;border-radius:50%;background:#3A3A44}
.nav__b span{margin:0 auto;padding:.3cqw 2.4cqw;border-radius:99px;background:#0A0A0C;color:#8A8A96;font:600 1.3cqw Manrope}
.mk--claro .lap__s,.mk--claro .nav{box-shadow:0 0 0 1px rgba(10,10,12,.1),0 4cqw 7cqw rgba(0,0,0,.18)}
/* acercamiento */
.zm__lupa{position:absolute;aspect-ratio:1;border-radius:50%;background-color:#0A0A0C;box-shadow:0 0 0 .35cqw #fff,0 3cqw 6cqw rgba(0,0,0,.55)}
.zm__src{position:absolute;width:5cqw;aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 0 .25cqw #fff}
.zm__marco{position:absolute;border-radius:1.2cqw;box-shadow:0 0 0 .25cqw #fff}
.zm__card{position:absolute;border-radius:1.8cqw;background-color:#0A0A0C;box-shadow:0 0 0 .2cqw rgba(255,255,255,.3),0 3cqw 7cqw rgba(0,0,0,.6)}
.zm__foco{position:absolute;z-index:3;border-radius:7%/22%;box-shadow:0 0 0 300cqw rgba(10,10,12,.72),0 0 0 .3cqw #EB0C6E}
.zm__t{position:absolute;display:grid;gap:.8cqw;max-width:23%;color:#fff}.zm__t b{font:700 2.6cqw/1.15 Unbounded;letter-spacing:-.03em}.zm__t span{color:#B4B4BE;font:600 1.7cqw/1.4 Manrope}
.zm__t--claro{color:#0A0A0C}.zm__t--claro span{color:#55555F}
.mk[style*="#fff"] .zm__lupa{box-shadow:0 0 0 .35cqw #0A0A0C,0 3cqw 6cqw rgba(0,0,0,.25)}.mk[style*="#fff"] .zm__src,.mk[style*="#fff"] .zm__marco{box-shadow:0 0 0 .25cqw #0A0A0C}
/* llamadas */
.ll__p{position:absolute;width:1.3cqw;aspect-ratio:1;border-radius:50%;background:#EB0C6E;transform:translate(-50%,-50%);box-shadow:0 0 0 .6cqw rgba(235,12,110,.3)}
.ll__e{position:absolute;transform:translateY(-50%);padding:.8cqw 1.4cqw;border-radius:99px;background:#16161B;box-shadow:0 0 0 1px #33333C;color:#fff;font:700 1.5cqw Manrope;white-space:nowrap}
.ll__e--izq{transform:translate(-100%,-50%)}.ll__e--claro{background:#fff;color:#0A0A0C;box-shadow:0 0 0 1px rgba(10,10,12,.15),0 1cqw 2cqw rgba(0,0,0,.08)}
.ll__m{position:absolute;border-radius:1.2cqw;box-shadow:0 0 0 .3cqw #EB0C6E}
.ll__tag{position:absolute;top:-.3cqw;transform:translateY(-100%);padding:.5cqw 1.1cqw;border-radius:.9cqw .9cqw .9cqw 0;background:#EB0C6E;color:#fff;font:800 1.3cqw Manrope;white-space:nowrap}
.ll__tag--der{left:-.3cqw}.ll__tag--abajo{top:auto;bottom:-.3cqw;transform:translateY(100%);border-radius:0 .9cqw .9cqw .9cqw}.ll__tag--izq.ll__tag--abajo{border-radius:.9cqw 0 .9cqw .9cqw}.ll__tag--izq{right:-.3cqw;border-radius:.9cqw .9cqw 0 .9cqw}
.ll__c{position:absolute;display:flex;gap:1cqw;align-items:center;transform:translateY(-50%);max-width:26%;padding:1cqw 1.4cqw 1cqw 1cqw;border-radius:1.6cqw;background:#16161B;box-shadow:0 0 0 1px #33333C;color:#B4B4BE;font:600 1.3cqw/1.35 Manrope}
.ll__c--izq{transform:translate(-100%,-50%)}
.ll__c i{display:grid;place-items:center;flex:none;width:3.2cqw;height:3.2cqw;border-radius:50%;background:rgba(235,12,110,.18);color:#FF7AB0}.ll__c i svg{width:1.7cqw;height:1.7cqw}
.ll__c b{display:block;color:#fff;font:800 1.5cqw Manrope}
.ll__c--claro{background:#fff;color:#55555F;box-shadow:0 0 0 1px rgba(10,10,12,.12)}.ll__c--claro b{color:#0A0A0C}.ll__c--claro i{color:#EB0C6E;background:rgba(235,12,110,.1)}
/* funciones alrededor */
.fx__chip{position:absolute;display:flex;align-items:center;gap:.9cqw;transform:translate(-50%,-50%);padding:.8cqw 1.5cqw .8cqw .8cqw;border-radius:99px;background:#16161B;box-shadow:0 0 0 1px #33333C,0 1.5cqw 3cqw rgba(0,0,0,.4);color:#fff;font:700 1.35cqw Manrope;white-space:nowrap}
.fx__chip i{display:grid;place-items:center;width:2.8cqw;height:2.8cqw;border-radius:50%;background:#EB0C6E}.fx__chip svg{width:1.5cqw;height:1.5cqw}
.fx__it{position:absolute;display:flex;gap:1.2cqw;align-items:flex-start;width:28%;color:#B4B4BE;font:600 1.3cqw/1.4 Manrope}
.fx__it--izq{right:63%;flex-direction:row-reverse;text-align:right}.fx__it--der{left:63%}
.fx__it i{display:grid;place-items:center;flex:none;width:3.6cqw;height:3.6cqw;border-radius:1cqw;background:#1F1F26;box-shadow:0 0 0 1px #33333C;color:#FF7AB0}.fx__it svg{width:1.9cqw;height:1.9cqw}
.fx__it b{display:block;color:#fff;font:700 1.7cqw/1.2 Unbounded;letter-spacing:-.02em;margin-bottom:.4cqw}
.fx__pz{position:absolute;display:grid;gap:.8cqw}.fx__pz div{border-radius:1.4cqw;background-color:#0A0A0C;box-shadow:0 0 0 1px rgba(255,255,255,.14),0 2.5cqw 5cqw rgba(0,0,0,.6)}
.fx__pz b{color:#fff;font:700 1.3cqw Manrope}
/* 09 volumen */
.vol{border-radius:14px;background:#0A0A0C;box-shadow:0 0 0 1px var(--edge);padding:16px;color:#fff;container-type:inline-size}
.vol__plan{display:block;font:700 15px Unbounded;letter-spacing:-.02em}.vol__plan em{color:#EB0C6E;font-style:normal}.vol__plan span{color:#4A4A55}
.vol__fila{display:grid;grid-template-columns:auto 1fr;gap:4px 10px;align-items:center;margin-top:14px}
.vol__n{grid-row:span 2;font:700 34px/1 Unbounded;letter-spacing:-.05em}.vol__fila--r .vol__n{color:#EB0C6E}
.vol__l{display:flex;align-items:center;gap:6px;color:#B4B4BE;font:700 12px Manrope}.vol__l svg{width:14px;height:14px}
.vol__q{display:flex;flex-wrap:wrap;gap:4px}.vol__q i{width:16px;height:16px;border-radius:4px;background:#fff}.vol__fila--r .vol__q i{width:12px;height:20px;background:#EB0C6E}
.vol__pie{margin-top:12px;color:#8A8A96;font:600 12px Manrope}
.vol--tabla{display:grid;grid-template-columns:1.6fr repeat(3,1fr);gap:10px 8px;align-items:center}
.vol__th{font:700 13px Unbounded;text-align:center}.vol__rl{display:flex;align-items:center;gap:6px;color:#B4B4BE;font:700 12px Manrope}.vol__rl svg{width:14px;height:14px;flex:none}
.vol__c{font:700 30px/1 Unbounded;letter-spacing:-.05em;text-align:center}.vol__c--r{color:#EB0C6E}.vol__c--s{font-size:20px;color:#B4B4BE}
.vol__grid{display:flex;flex-wrap:wrap;gap:5px;margin-top:12px;align-items:flex-end}
.vol__img{width:22px;aspect-ratio:4/5;border-radius:4px;background:#26262E url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23B4B4BE' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21'/%3E%3C/svg%3E") center/12px no-repeat}
.vol__reel{width:16px;aspect-ratio:9/16;border-radius:4px;background:#EB0C6E url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fff'%3E%3Cpath d='M8 5v14l11-7z'/%3E%3C/svg%3E") center/10px no-repeat}
/* 11 brecha */
.br{position:relative;padding:18px;border-radius:14px;background:#0A0A0C;box-shadow:0 0 0 1px var(--edge);color:#fff}
.br__k{display:block;color:#8A8A96;font:800 11px Manrope;letter-spacing:.16em;text-transform:uppercase}
.br__nota{margin-top:12px;color:#55555F;font:600 11px Manrope}
.br__eje{position:relative;height:150px;margin:18px 10px 34px;border-bottom:2px solid #33333C}
.br__eje>span:not(.br__hueco):not(.br__mk){position:absolute;bottom:-22px;transform:translateX(-50%);color:#55555F;font:700 11px Manrope}
.br__eje>span i{display:block;width:1px;height:6px;margin:0 auto 4px;background:#33333C;transform:translateY(-4px)}
.br__hueco{position:absolute;bottom:0;height:34px;display:flex;align-items:center;justify-content:center;border-radius:8px 8px 0 0;background:rgba(235,12,110,.18);box-shadow:inset 0 0 0 1.5px #EB0C6E;color:#FF7AB0;font:800 11px Manrope;text-align:center}
.br__mk{position:absolute;bottom:0;display:grid;justify-items:center;width:120px;transform:translateX(-50%);color:#B4B4BE;font:700 11px/1.3 Manrope;text-align:center}
.br__mk b{display:grid;place-items:center;width:40px;height:40px;margin-bottom:4px;border-radius:50%;background:#fff;color:#0A0A0C;font:700 16px Unbounded}
.br__mk{bottom:42px}.br__mk--gris b{background:#4A4A55;color:#fff}
.br__cols{display:grid;grid-template-columns:1fr 1fr;gap:16px;height:220px;margin-top:16px}
.br__col{position:relative;display:flex;flex-direction:column;justify-content:flex-end;gap:8px}
.br__col b{color:#B4B4BE;font:700 12px/1.3 Manrope}
.br__bar{display:block;width:44%;border-radius:10px 10px 4px 4px;background:#fff}.br__bar--gris{background:#4A4A55}
.br__llave{position:absolute;left:48%;width:14px;border:2px solid #EB0C6E;border-left:0;border-radius:0 8px 8px 0;margin-bottom:28px}
.br__llave em{position:absolute;left:20px;top:50%;transform:translateY(-50%);color:#FF7AB0;font:800 12px Manrope;font-style:normal;white-space:nowrap}
.br--antes{display:grid;grid-template-columns:1fr 1fr;gap:14px}.br--antes .br__nota{grid-column:1/-1;margin-top:0}
.br__lado{display:grid;gap:8px}.br__lado b{color:#B4B4BE;font:700 12px/1.3 Manrope}
.br__foto{aspect-ratio:1/.9;border-radius:12px;background-color:#16161B}
.br__et{justify-self:start;padding:3px 9px;border-radius:99px;background:#26262E;color:#B4B4BE;font:800 11px Manrope}.br__et--pk{background:#EB0C6E;color:#fff}
.br__med{display:block;height:8px;border-radius:99px;background:#26262E}.br__med i{display:block;height:100%;border-radius:99px;background:#4A4A55}.br__med i.pk{background:#EB0C6E}
/* 18 insignia sobre foto */
.pr__g--18,.pr__g--19,.pr__g--20,.pr__g--21,.pr__g--22{grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))!important}
.ins{position:absolute;left:5%;bottom:5%;display:inline-flex;align-items:center;gap:2cqw;padding:1.8cqw 3.4cqw 1.8cqw 1.8cqw;border-radius:99px;color:#fff;font:700 4.4cqw Manrope;white-space:nowrap}
.ins i{display:grid;place-items:center;width:8cqw;height:8cqw;border-radius:50%}.ins svg{width:4.4cqw;height:4.4cqw}
.ins--oscura{background:rgba(10,10,12,.8);box-shadow:0 0 0 1px rgba(255,255,255,.12)}.ins--oscura i{background:#EB0C6E}
.ins--vidrio{background:rgba(255,255,255,.16);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.4)}.ins--vidrio i{background:rgba(255,255,255,.22)}
.ins--rosa{background:#EB0C6E;box-shadow:0 1.5cqw 4cqw rgba(235,12,110,.4)}.ins--rosa i{background:#fff;color:#EB0C6E}
/* 19 número de paso */
.pa{display:grid;gap:14px;padding:18px;border-radius:14px;background:#0A0A0C;box-shadow:0 0 0 1px var(--edge);color:#fff;container-type:inline-size}
.pa--fila{grid-template-columns:repeat(4,minmax(0,1fr))}.pa--lista{grid-template-columns:1fr}
.pa--claro{background:#fff;color:#0A0A0C}
.pa__i{position:relative;display:grid;gap:8px;align-content:start}.pa--lista .pa__i{grid-template-columns:auto 1fr;gap:12px;align-items:start}
.pa__i b{display:block;font:700 13px/1.25 Unbounded;letter-spacing:-.02em}.pa__i span:not(.pa__n){display:block;margin-top:3px;color:#8A8A96;font:600 11.5px/1.4 Manrope}.pa--claro .pa__i span:not(.pa__n){color:#55555F}
.pa--lista .pa__n{min-width:52px}.pa--contorno.pa--lista .pa__n{min-width:84px}.pa--grande .pa__n{font:700 30px/1 Unbounded;letter-spacing:-.05em;color:#EB0C6E}
.pa--circulo .pa__n{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:#EB0C6E;color:#fff;font:800 14px Manrope;position:relative;z-index:1}
.pa--circulo.pa--fila .pa__i:not(:last-child)::after{content:'';position:absolute;left:34px;right:-14px;top:15px;height:2px;background:#EB0C6E;opacity:.5}
.pa--circulo.pa--lista .pa__i:not(:last-child)::after{content:'';position:absolute;left:15px;top:34px;bottom:-14px;width:2px;background:#EB0C6E;opacity:.5}
.pa--contorno .pa__n{font:800 46px/.9 Unbounded;letter-spacing:-.05em;color:transparent;-webkit-text-stroke:1.2px rgba(255,255,255,.4)}.pa--contorno.pa--claro .pa__n{-webkit-text-stroke:1.2px rgba(10,10,12,.3)}
.pa--contorno .pa__i b{margin-top:-10px;position:relative}.pa--contorno.pa--lista .pa__i b{margin-top:0}
/* 20 sello aprobada */
.ap{border-radius:14px;overflow:hidden;background:#16161B;box-shadow:0 0 0 1px var(--edge);color:#fff}
.ap__f{position:relative}.ap__img{aspect-ratio:1/.9;background-color:#0A0A0C}
.ap__t{display:grid;gap:4px;padding:12px 14px 14px}.ap__t b{font:700 14px/1.25 Unbounded;letter-spacing:-.02em}.ap__t>span{color:#8A8A96;font:600 12px Manrope}
.ap__chip{justify-self:start;display:inline-flex;align-items:center;gap:5px;height:24px;margin-top:6px;padding:0 10px;border-radius:99px;background:rgba(235,12,110,.18);color:#FF7AB0;font:800 11.5px Manrope}
.ap__sello{position:absolute;right:6%;bottom:-9%;display:grid;justify-items:center;align-content:center;gap:2px;width:30%;aspect-ratio:1;border-radius:50%;background:#EB0C6E;color:#fff;font:800 11px Manrope;letter-spacing:.06em;text-transform:uppercase;transform:rotate(-10deg);box-shadow:0 0 0 4px #16161B,0 10px 24px rgba(235,12,110,.45)}
.ap__sello i{display:block;width:40%}.ap__sello svg{display:block;width:100%;height:auto}
.ap__banda{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;gap:7px;padding:10px;background:linear-gradient(90deg,#EB0C6E,#FF3D8F);color:#fff;font:800 12px Manrope}
.ap--h{position:absolute;left:10%;right:10%;top:9%;overflow:visible;background:none;box-shadow:none}.ap--h .ap__img{border-radius:14px}.ap--h .ap__t{padding:10px 0 0}
.ap__frase{position:absolute;left:10%;bottom:7%;font:700 7.5cqw/1.05 Unbounded;letter-spacing:-.04em;color:#fff}.ap__frase i{color:#EB0C6E;font-style:normal}
.ap--h .ap__sello{width:34%;font-size:3.4cqw;box-shadow:0 0 0 1.4cqw #0A0A0C,0 3cqw 7cqw rgba(235,12,110,.45)}.ap--h .ap__banda{font-size:3.6cqw;padding:3cqw}.ap--h .ap__chip{height:auto;padding:1.5cqw 3cqw;font-size:3.6cqw}
/* 21 selector de plan */
.sp__hoja .mk__h{top:30%}
.sp__arriba{position:absolute;right:6%;top:5%;transform-origin:top right;transform:scale(.85)}
.sp__tres{display:grid;gap:14px;justify-items:start;padding:18px;border-radius:14px;background:#0A0A0C;box-shadow:0 0 0 1px var(--edge)}
.sp--seg{display:inline-flex;gap:3px;padding:4px;border-radius:99px;background:#16161B;box-shadow:inset 0 0 0 1px #33333C}
.sp--seg b{padding:7px 14px;border-radius:99px;color:#8A8A96;font:800 12px Manrope}.sp--seg b.on{background:#EB0C6E;color:#fff}
.sp--esc{display:inline-flex;align-items:flex-end;gap:6px;height:64px}
.sp--esc b{display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:5px;width:46px;height:100%;color:#55555F;font:800 11px Manrope}
.sp--esc b i{display:block;width:100%;border-radius:6px 6px 3px 3px;background:#26262E}.sp--esc b.on i{background:#4A4A55}.sp--esc b.yo i{background:#EB0C6E}.sp--esc b.yo{color:#fff}
.sp--pts{display:inline-grid;grid-template-columns:auto auto;gap:4px 12px;align-items:center;padding:10px 14px;border-radius:14px;background:#16161B;box-shadow:inset 0 0 0 1px #33333C}
.sp--pts>b{color:#fff;font:700 13px Unbounded}.sp--pts>span{display:flex;gap:5px}.sp--pts i{width:10px;height:10px;border-radius:50%;background:#33333C}.sp--pts i.on{background:#EB0C6E}
.sp--pts em{grid-column:1/-1;color:#8A8A96;font:700 11px Manrope;font-style:normal}
/* 22 incluido / no incluido */
.lis{padding:16px 18px;border-radius:14px;background:#0A0A0C;box-shadow:0 0 0 1px var(--edge);color:#fff}.lis--claro{background:#fff;color:#0A0A0C}
.lis__h{display:block;margin-bottom:10px;font:700 15px Unbounded;letter-spacing:-.02em}
.lis ul{display:grid;gap:9px;margin:0;padding:0;list-style:none}
.li{display:grid;grid-template-columns:20px 1fr auto;gap:10px;align-items:center;font:600 12.5px/1.35 Manrope}
.li i{display:grid;place-items:center;width:20px;height:20px;border-radius:50%}
.li__ok{background:#EB0C6E;color:#fff}.li__x{background:#26262E;color:#8A8A96}.li__lock{background:transparent;color:#8A8A96;box-shadow:inset 0 0 0 1.5px #33333C}
.lis--claro .li__x{background:#EEEEF2;color:#8A8A96}.lis--claro .li__lock{box-shadow:inset 0 0 0 1.5px #D8D8DE}
.li--no>span{color:#8A8A96}.lis--claro .li--no>span{color:#8A8A96}
.li__v{color:#FF7AB0;font:800 12px Manrope}.lis--claro .li__v{color:#EB0C6E}
.li__tag{padding:3px 8px;border-radius:99px;box-shadow:inset 0 0 0 1px #33333C;color:#B4B4BE;font:800 10.5px Manrope;font-style:normal;white-space:nowrap}.lis--claro .li__tag{box-shadow:inset 0 0 0 1px #D8D8DE;color:#55555F}
.li__sube{display:block;color:#FF7AB0;font:800 11px Manrope;font-style:normal}.lis--claro .li__sube{color:#EB0C6E}
.tb{display:grid;grid-template-columns:1.9fr repeat(3,1fr);gap:10px 6px;align-items:center;padding:16px 18px;border-radius:14px;background:#0A0A0C;box-shadow:0 0 0 1px var(--edge);color:#fff;justify-items:center}
.tb>b{font:700 13px Unbounded}.tb>b.li__v{font:800 12px Manrope;color:#FF7AB0}.tb__pro{color:#EB0C6E}.tb__t{justify-self:start;color:#B4B4BE;font:600 12px/1.35 Manrope}.tb__no{color:#4A4A55;font:700 14px Manrope}
.tb .li__ok{display:grid;place-items:center;width:20px;height:20px;border-radius:50%}
.tb--claro{background:#fff;color:#0A0A0C}.tb--claro .tb__t{color:#55555F}.tb--claro .li__v{color:#EB0C6E}.tb--claro .tb__no{color:#C8C8D0}
`;
