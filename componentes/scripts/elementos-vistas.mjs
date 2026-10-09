// Vistas de las propuestas de elementos que se muestran con capturas reales de la app:
// 09, 11 y 13 a 28 (pantallas, señales, íconos y estructura de página).
// Todo se dibuja en % y cqw para que escale con la tarjeta del catálogo.
import { readFileSync } from 'node:fs';
import { ic } from '../src/icons.js';

// Muesca de pixely.pe (tokens.css → --notch) convertida a trazo SVG de ancho W y alto H.
const NOTCH = /--notch:\s*polygon\(([^;]+)\);/.exec(readFileSync(new URL('../../../pixely_web/src/styles/tokens.css', import.meta.url), 'utf8'))[1];
const medida = (t, D) => {
  let m;
  if ((m = /^calc\((-?[\d.]+)% ([+-]) ([\d.]+)px\)$/.exec(t))) return (D * m[1]) / 100 + (m[2] === '+' ? 1 : -1) * m[3];
  if ((m = /^(-?[\d.]+)%$/.exec(t))) return (D * m[1]) / 100;
  return parseFloat(t);
};
export const muesca = (W, H) => 'M' + NOTCH.split(',').map((pt) => pt.trim().match(/calc\([^)]*\)|\S+/g)).map(([x, y]) => `${+medida(x, W).toFixed(1)} ${+medida(y, H).toFixed(1)}`).join('L') + 'Z';


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
    // Escalera de verdad: cada escalón un tercio más alto que el anterior.
    if (p.id === 'escalera') return `<span class="sp sp--esc">${Object.keys(NIVEL).map((n, i) => `<span class="sp__e${NIVEL[n] < NIVEL[actual] ? ' on' : ''}${n === actual ? ' yo' : ''}"><i style="height:${((i + 1) / 3) * 100}%"></i><b>${n}</b></span>`).join('')}</span>`;
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

// ---------- 23 · Set de 12 íconos ilustrados ----------
const ICONOS = [['Mercado', 'store'], ['Estrategia', 'flag'], ['Calendario', 'calendar-days'], ['Aprobar', 'square-check'], ['Publicar', 'send'], ['Resultados', 'trending-up'], ['Competencia', 'users'], ['Reseñas', 'star'], ['Precios', 'tag'], ['Tiempo', 'clock'], ['Celular', 'smartphone'], ['Garantía', 'shield-check']];
const vista23 = (p) => {
  const ico = (i) => `<span class="ico ico--${p.id}"><span>${ic(i, 24, p.id === 'duotono' ? 1.7 : 2)}</span></span>`;
  const grilla = (claro, n = 12) => `<div class="icg${claro ? ' icg--claro' : ''}">${ICONOS.slice(0, n).map(([t, i]) => `<div>${ico(i)}<b>${t}</b></div>`).join('')}</div>`;
  const tarjeta = `<div class="icg__card">${ico('flag')}<div><b>Una estrategia para tu negocio</b><span>Objetivos claros y de dónde sale cada idea del mes.</span></div></div>`;
  return [fig('Los 12 · fondo negro', grilla(false)), fig('En una tarjeta del brochure', tarjeta), fig('Página blanca', grilla(true, 6))].join('');
};

// ---------- 24 · Encabezado de página ----------
const vista24 = (p) => {
  const cab = (claro) => {
    const et = { rosa: '<span class="cab__et">El problema</span>', numero: '<span class="cab__et cab__et--n"><b>02</b><i></i>El problema</span>', pildora: '<span class="cab__et cab__et--p">El problema</span>' }[p.id];
    // El relleno va en un bloque interior: así «cqw» mide el ancho completo de la hoja.
    return `<div class="mk cab cab--${p.id}${claro ? ' cab--claro' : ''}" style="aspect-ratio:210/74"><div class="cab__in">${et}<b class="cab__h">Tu producto ya es bueno.<br>Que se note<i>.</i></b>${p.id === 'pildora' ? '<span class="cab__barra"></span>' : ''}<p class="cab__l">Pixely lee tu mercado y convierte lo que encuentra en piezas que tú apruebas.</p></div></div>`;
  };
  return [fig('Página negra · tamaños reales de A4', cab(false)), fig('Página blanca', cab(true))].join('');
};

// ---------- 25 · Pie de página ----------
const vista25 = (p) => {
  const pie = (claro) => {
    const cont = { linea: '<span class="pie__wm">pixely<b>.</b></span><span>pixely.pe</span><span>04 / 08</span>', banda: '<span class="pie__wm">pixely<b>.</b></span><span>pixely.pe · hola@pixely.pe</span><span class="pie__n">04 / 08</span>', grande: '<span class="pie__wm">pixely<b>.</b><small>pixely.pe</small></span><span></span><span class="pie__g">04<small>/08</small></span>' }[p.id];
    return `<div class="mk pie pie--${p.id}${claro ? ' pie--claro' : ''}" style="aspect-ratio:210/70"><span class="pie__x"></span><span class="pie__x pie__x--c"></span><div class="pie__f">${cont}</div></div>`;
  };
  return [fig('Página negra · borde de abajo', pie(false)), fig('Página blanca', pie(true))].join('');
};

// ---------- 26 · Tarjeta horizontal «cómo funciona» ----------
const COMO = [
  ['Te avisamos', 'Cuando hay piezas por revisar, aparecen arriba en Inicio.', zoom('m-inicio', 0.5, 0.2375, 0.906, 0.51), 0.51],
  ['Apruebas o pides cambios', 'Un toque para aprobar; si algo no va, lo escribes.', zoom('m-pieza', 0.5, 0.947, 0.906, 0.144), 0.144],
  ['Ves cómo le fue', 'Alcance y vistas de cada pieza, frente a tu promedio.', zoom('m-resultado', 0.5, 0.85, 0.906, 0.3), 0.3],
];
const vista26 = (p) => {
  const card = ([t, d, z, a], i) => `<div class="th th--${p.id}${p.id === 'alternada' && i % 2 ? ' th--inv' : ''}"><div class="th__g"><div style="aspect-ratio:${(1 / a).toFixed(3)};${z}"></div></div><div class="th__t"><span class="th__n">${String(i + 1).padStart(2, '0')}</span><b>${t}</b><span>${d}</span></div></div>`;
  return [fig('Apiladas en una página del manual', `<div class="ths">${COMO.map(card).join('')}</div>`)].join('');
};

// ---------- 28 · Bloque «Hablemos» ----------
const CONTACTOS = [['WhatsApp', '+51 949 268 607'], ['Web', 'pixely.pe'], ['Correo', 'hola@pixely.pe'], ['Redes', '@pixely_pe']];
const QR = '<img class="hb__qr" src="kit-redes/qr/qr-whatsapp.svg" alt="">';
const vista28 = (p) => {
  const contactos = `<dl class="hb__dl">${CONTACTOS.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
  if (p.id === 'lista') return fig('Página blanca (como el brochure)', `<div class="mk mk--claro hb hb--lista" style="aspect-ratio:210/150"><div class="hb__in"><b class="hb__h">Hablemos<i>.</i></b><p class="hb__l">Cuéntanos de tu negocio y te recomendamos el plan que te conviene.</p>${contactos}</div><div class="hb__qrc">${QR}<span>Escanea y escríbenos por WhatsApp</span></div></div>`);
  if (p.id === 'tarjeta') return fig('Página negra', `<div class="mk hb hb--tarjeta" style="aspect-ratio:210/118;background:#0A0A0C"><div class="hb__in"><div class="hb__rosa"><b class="hb__h">Hablemos<i>.</i></b><p class="hb__l">Cuéntanos de tu negocio y te recomendamos el plan que te conviene.</p><span class="hb__btn">${ic('message', 14, 2.4)} Escríbenos por WhatsApp</span><div class="hb__qrc">${QR}</div></div>${contactos}</div></div>`);
  return fig('Página con muesca', `<div class="mk hb hb--muesca" style="aspect-ratio:210/150;background:#fff"><svg class="hb__fondo" viewBox="0 0 794 567" preserveAspectRatio="none" aria-hidden="true"><path d="${muesca(794, 300)}" fill="#0A0A0C"/></svg><div class="hb__in"><b class="hb__h">Hablemos<i>.</i></b><p class="hb__l">Cuéntanos de tu negocio y te recomendamos el plan que te conviene.</p><span class="hb__btn hb__btn--rosa">${ic('message', 14, 2.4)} Escríbenos por WhatsApp</span></div><div class="hb__qrc">${QR}<span>Escanea y escríbenos</span></div>${contactos}</div>`);
};

// ---------- 27 · Línea de proceso (rediseño 9 oct) ----------
const vista27 = (p) => {
  const caja = (claro) => {
    if (p.id === 'tramos') {
      const T = [['Día 1', 'Entrevista', 1.3, ''], ['Días 2 a 5', 'Estudio de mercado y estrategia', 4, 'b'], ['Días 6 y 7', 'Tu primer plan del mes', 2, 'pk']];
      return `<div class="lt lt--tramos${claro ? ' lt--claro' : ''}"><div class="lt__barra">${T.map(([c, , w, k]) => `<span class="lt__s lt__s--${k || 'a'}" style="flex:${w}"><em>${c}</em></span>`).join('')}<span class="lt__s lt__s--mes"><em>Cada mes ${ic('arrow-right', 11, 2.6)}</em></span></div>
        <div class="lt__leyenda">${T.map(([, t, w]) => `<b style="flex:${w}">${t}</b>`).join('')}<b class="lt__lmes">Apruebas, publicamos y medimos</b></div><p class="lt__nota">Tu primer plan, en 7 días como máximo.</p></div>`;
    }
    if (p.id === 'camino') {
      const C = [['message', 'Día 1', 'Entrevista'], ['store', 'Días 2 a 4', 'Estudio de mercado'], ['flag', 'Día 5', 'Estrategia'], ['calendar-days', 'Día 7', 'Tu primer plan'], ['send', 'Cada mes', 'Publicamos y medimos']];
      return `<div class="lt lt--camino${claro ? ' lt--claro' : ''}">${C.map(([i, c, t], n) => `<div class="lt__p${n === 3 ? ' lt__p--on' : ''}"><span class="ico ico--duotono"><span>${ic(i, 24, 1.7)}</span></span><em>${c}</em><b>${t}</b></div>`).join('')}</div>`;
    }
    const D = ['Entrevista', 'Estudio', 'Estudio', 'Estudio', 'Estrategia', 'Plan', '¡Listo!'];
    return `<div class="lt lt--semana${claro ? ' lt--claro' : ''}"><div class="lt__dias">${D.map((x, i) => `<span class="lt__d${i === 6 ? ' lt__d--pk' : ''}"><em>Día ${i + 1}</em><b>${i === 6 ? ic('check', 16, 3) : ''}</b></span>`).join('')}</div>
      <div class="lt__tareas"><span style="grid-column:1/2">Entrevista</span><span class="lt__r" style="grid-column:2/5">Estudio de mercado</span><span style="grid-column:5/6">Estrategia</span><span style="grid-column:6/7">Plan</span><span class="lt__pk" style="grid-column:7/8">Tu plan</span></div>
      <p class="lt__mes">${ic('arrow-right', 12, 2.6)}<span>Desde ahí, <b>cada mes</b>: apruebas, publicamos y medimos.</span></p></div>`;
  };
  return [fig('Fondo negro', caja(false)), fig('Página blanca', caja(true))].join('');
};

// ---------- 29 · Marco y criterio de fotos ----------
let nClip = 0;
const vista29 = (p) => {
  const foto = (f, ar, pos, extra = '') => {
    if (p.id === 'muesca') {
      const W = 794, H = Math.round(794 / ar), id = `fm${nClip++}`;
      return `<svg class="ph ph--svg" viewBox="0 0 ${W} ${H}" style="aspect-ratio:${W}/${H}"><defs><clipPath id="${id}"><path d="${muesca(W, H)}"/></clipPath></defs><image href="elementos/fotos/${f}.webp" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/></svg>`;
    }
    return `<div class="ph ph--${p.id}" style="aspect-ratio:${ar}"><img src="elementos/fotos/${f}.webp" alt="" loading="lazy" style="object-position:${pos}">${p.id === 'degradado' ? `<div class="ph__t"><b>${extra}</b><span class="ins ins--oscura"><i>${ic('check', 16, 2.6)}</i>Hecho para tu negocio</span></div>` : ''}</div>`;
  };
  return [
    fig('Foto vertical', `<div class="phc">${foto('panadero', 4 / 5, 'center 30%', 'Tu marca se decide aquí.')}</div>`),
    fig('Foto horizontal', `<div class="phc">${foto('paso-2', 3 / 2, 'center', 'Apruebas desde tu celular.')}</div>`),
    fig('En una página blanca', `<div class="phc phc--claro"><b class="phc__h">Nacimos de una frustración<i>.</i></b>${foto('historia', 4 / 3, 'center 25%', 'Vende lo que vales.')}</div>`),
  ].join('');
};
// Criterio para elegir fotos (va debajo de las propuestas del 29).
const criterio = () => `<div class="pr pr--fam"><h4>Cómo elegir la foto: que no parezca hecha con IA</h4><p>Vale para fotos propias, de stock o generadas. Si una foto falla en dos o más puntos de la columna derecha, no va.</p>
  <div class="cr"><div class="cr__c"><b class="cr__h cr__h--si">${ic('check', 14, 3)} Se ve real</b><ul>${['Luz que existe en el lugar: ventana, focos del local; sombras normales.', 'Gente como es: piel con textura, pelo suelto, ropa usada.', 'El negocio de verdad: sus productos, su desorden, sus letreros.', 'Manos y celular en posiciones naturales, de lado.', 'Encuadre de foto de celular o cámara, no de set.'].map((x) => `<li>${x}</li>`).join('')}</ul></div>
  <div class="cr__c"><b class="cr__h cr__h--no">${ic('x', 14, 3)} Se nota IA</b><ul>${['Piel lisa como plástico y dientes perfectos.', 'El celular mostrando la pantalla de frente a la cámara.', 'Neón rosa puesto en la escena: el rosa va en el diseño, no en la foto.', 'Todo ordenado y simétrico, como un set.', 'Letreros con letras raras o manos con dedos de más.'].map((x) => `<li>${x}</li>`).join('')}</ul></div></div>
  <div class="cr__ej">${[['evitar-1', 'Portada del brochure', [[0.47, 0.33, 'Piel y sonrisa de plástico'], [0.66, 0.38, 'Pantalla de frente a cámara'], [0.54, 0.08, 'Neón puesto']]], ['evitar-2', 'Página 2 del brochure', [[0.55, 0.06, 'Luz de estudio a la vista'], [0.92, 0.38, 'Neón puesto'], [0.72, 0.36, 'Pose de set']]]].map(([f, t, marcas]) => `<figure class="cr__f"><div class="cr__img"><img src="elementos/fotos/${f}.webp" alt="" loading="lazy">${marcas.map(([x, y, e]) => `<span class="ll__p" style="left:${x * 100}%;top:${y * 100}%"></span><span class="cr__e${x > 0.7 ? ' cr__e--izq' : ''}" style="left:${x * 100}%;top:${y * 100}%">${e}</span>`).join('')}</div><figcaption>${t} · señalada el 8 oct: se cambia</figcaption></figure>`).join('')}</div></div>`;

// ---------- 30 · Plantillas de redes ----------
const vista30 = (p) => {
  const wm = '<span class="rd__wm">pixely<b>.</b></span>';
  const post = (x) => `<div class="mk rd" style="aspect-ratio:4/5">${x}</div>`, hist = (x) => `<div class="mk rd" style="aspect-ratio:9/16">${x}</div>`;
  if (p.id === 'esfera') return [
    fig('Post', post(`<img class="rd__arte" src="elementos/01-oscuro.svg" alt="" style="left:30%;top:42%;width:100%">${wm}<b class="rd__h" style="top:16%">Tu producto<br>ya es bueno.<br>Que se note<i>.</i></b>`)),
    fig('Carrusel · portada', post(`<img class="rd__arte" src="elementos/01-oscuro.svg" alt="" style="left:-30%;top:46%;width:100%">${wm}<b class="rd__h" style="top:16%">3 errores al<br>mostrar tu<br>producto<i>.</i></b><span class="rd__des">Desliza ${ic('arrow-right', 12, 2.6)}</span>`)),
    fig('Carrusel · interior', post(`${wm}<span class="rd__n">01</span><b class="rd__h rd__h--s" style="top:36%">Fotos sin luz<i>.</i></b><p class="rd__p" style="top:56%">Una foto oscura hace ver tu producto más barato de lo que es.</p><span class="rd__pag">2 / 5</span>`)),
    fig('Historia', hist(`<div class="rd__glow"></div>${cel('m-validar', 'vitrina', 'left:22%;top:20%;width:56%')}<b class="rd__h rd__h--s" style="top:5%">Tú apruebas<br>desde el celular<i>.</i></b><span class="rd__cta">Escríbenos</span>`)),
  ].join('');
  if (p.id === 'foto') return [
    fig('Post', post(`<img class="mk__full" src="elementos/fotos/panadero.webp" alt="" style="object-position:center 30%"><div class="rd__deg"></div><b class="rd__h rd__h--s" style="bottom:16%">Tu marca se<br>decide aquí<i>.</i></b><span class="ins ins--oscura rd__ins"><i>${ic('check', 16, 2.6)}</i>Pixely Partners</span>`)),
    fig('Carrusel · portada', post(`<img class="mk__full" src="elementos/fotos/historia.webp" alt="" style="object-position:center 20%"><div class="rd__deg"></div><b class="rd__h" style="bottom:14%">3 errores al<br>mostrar tu<br>producto<i>.</i></b><span class="rd__des rd__des--abajo">Desliza ${ic('arrow-right', 12, 2.6)}</span>`)),
    fig('Carrusel · interior', post(`<div class="rd__blanco"><span class="rd__et">Error 1</span><b class="rd__h rd__h--s rd__h--n">Fotos sin luz<i>.</i></b><p class="rd__p rd__p--n">Una foto oscura hace ver tu producto más barato de lo que es.</p><img class="rd__mini" src="elementos/fotos/paso-2.webp" alt=""><span class="rd__pag rd__pag--n">2 / 5</span></div>`)),
    fig('Historia', hist(`<img class="mk__full" src="elementos/fotos/paso-2.webp" alt="" style="object-position:40% center"><div class="rd__deg"></div><b class="rd__h rd__h--s" style="bottom:22%">Apruebas desde<br>tu celular<i>.</i></b><span class="rd__cta rd__cta--abajo">Escríbenos</span>`)),
  ].join('');
  const bloque = (W, H, alto, dentro) => `<svg class="rd__fondo" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><rect width="${W}" height="${H}" fill="#fff"/><path d="${muesca(W, alto)}" fill="#0A0A0C"/></svg>${dentro}`;
  return [
    fig('Post', post(bloque(1080, 1350, 820, `${wm}<b class="rd__h" style="top:18%">Tu producto<br>ya es bueno<i>.</i></b><b class="rd__h rd__h--neg" style="top:70%">Que se note<i>.</i></b>`))),
    fig('Carrusel · portada', post(bloque(1080, 1350, 980, `${wm}<b class="rd__h" style="top:20%">3 errores al<br>mostrar tu<br>producto<i>.</i></b><span class="rd__des rd__des--neg">Desliza ${ic('arrow-right', 12, 2.6)}</span>`))),
    fig('Carrusel · interior', post(`<div class="rd__blanco"><span class="rd__n rd__n--g">01</span><b class="rd__h rd__h--s rd__h--n" style="top:40%">Fotos sin luz<i>.</i></b><p class="rd__p rd__p--n" style="top:58%">Una foto oscura hace ver tu producto más barato de lo que es.</p><span class="rd__pag rd__pag--n">2 / 5</span></div>`)),
    fig('Historia', hist(bloque(1080, 1920, 1100, `${cel('m-inicio', 'vitrina', 'left:26%;top:9%;width:48%')}<b class="rd__h rd__h--neg rd__h--s" style="top:66%">Todo tu<br>marketing en<br>una app<i>.</i></b><span class="rd__cta rd__cta--neg">Escríbenos</span>`))),
  ].join('');
};

export const VISTAS_EXTRA = { 9: vista09, 11: vista11, 13: vista13, 14: vista14, 15: vista15, 16: vista16, 17: vista17, 18: vista18, 19: vista19, 20: vista20, 21: vista21, 22: vista22, 23: vista23, 24: vista24, 25: vista25, 26: vista26, 27: vista27, 28: vista28, 29: vista29, 30: vista30 };
// Bloques que van debajo de las propuestas de un elemento.
export const BLOQUES_EXTRA = { 29: criterio };

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
.ap__chip{justify-self:start;display:inline-flex;align-items:center;gap:5px;height:24px;margin-top:6px;padding:0 10px;border-radius:99px;background:#EB0C6E;color:#fff;font:800 11.5px Manrope}
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
.sp--esc{display:inline-flex;align-items:flex-end;gap:3px}
.sp__e{display:grid;grid-template-rows:60px auto;gap:5px;width:46px;color:#55555F;font:800 11px Manrope;text-align:center}
.sp__e i{align-self:end;display:block;border-radius:6px 6px 2px 2px;background:#26262E}.sp__e.on i{background:#4A4A55}.sp__e.yo i{background:#EB0C6E}.sp__e.yo b{color:#fff}
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
/* 23 íconos */
.pr__g--23{grid-template-columns:1.3fr 1fr 1fr!important}.pr__g--24,.pr__g--25,.pr__g--27{grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))!important}.pr__g--26,.pr__g--28{grid-template-columns:minmax(0,640px)!important}
.icg{display:grid;grid-template-columns:repeat(4,1fr);gap:14px 8px;padding:16px;border-radius:14px;background:#0A0A0C;box-shadow:0 0 0 1px var(--edge)}.icg--claro{background:#fff;grid-template-columns:repeat(3,1fr)}
.icg>div{display:grid;justify-items:center;gap:6px}.icg b{color:#B4B4BE;font:700 10.5px Manrope;text-align:center}.icg--claro b{color:#55555F}
.ico{position:relative;display:grid;place-items:center;width:48px;height:48px}.ico>span{position:relative;display:grid;place-items:center}.ico svg{width:24px;height:24px}
.ico--cuadro{border-radius:14px;background:#1F1F26;box-shadow:inset 0 0 0 1px #33333C;color:#FF7AB0}.icg--claro .ico--cuadro{background:#F4F4F7;box-shadow:none;color:#EB0C6E}
.ico--duotono{color:#fff}.ico--duotono::before{content:'';position:absolute;right:7px;bottom:7px;width:20px;height:20px;border-radius:50%;background:#EB0C6E}.ico--duotono svg{width:30px;height:30px}.icg--claro .ico--duotono{color:#0A0A0C}
.ico--circulo{border-radius:50%;background:#EB0C6E;color:#fff}
.icg__card{display:flex;gap:14px;align-items:center;padding:18px;border-radius:14px;background:#16161B;box-shadow:0 0 0 1px var(--edge)}.icg__card .ico{flex:none}
.icg__card b{display:block;color:#fff;font:700 14px/1.25 Unbounded;letter-spacing:-.02em}.icg__card>div>span{display:block;margin-top:4px;color:#8A8A96;font:600 12px/1.4 Manrope}
/* 24 encabezado (en cqw de una A4) */
.cab{background:#0A0A0C;color:#fff}.cab__in{padding:6.5cqw 7cqw}.cab--claro{background:#fff;color:#0A0A0C}
.cab__et{display:inline-flex;align-items:center;gap:1.6cqw;color:#EB0C6E;font:800 1.32cqw Manrope;letter-spacing:.18em;text-transform:uppercase}
.cab__et--n b{font:700 1.8cqw Unbounded;letter-spacing:-.02em}.cab__et--n i{width:5cqw;height:1px;background:currentColor;opacity:.5}.cab__et--n{color:#8A8A96}.cab__et--n b{color:#EB0C6E}
.cab__et--p{padding:.7cqw 1.8cqw;border-radius:99px;box-shadow:inset 0 0 0 1px #EB0C6E}
.cab__h{display:block;margin-top:1.6cqw;font:700 4.3cqw/1.08 Unbounded;letter-spacing:-.04em}.cab__h i{color:#EB0C6E;font-style:normal}
.cab__barra{display:block;width:6cqw;height:.6cqw;margin-top:2.2cqw;border-radius:9px;background:#EB0C6E}
.cab__l{max-width:70%;margin-top:2cqw;color:#B4B4BE;font:500 2cqw/1.5 Manrope}.cab--claro .cab__l{color:#55555F}
/* 25 pie */
.pie{display:flex;flex-direction:column;justify-content:flex-end;background:#0A0A0C;color:#8A8A96}.pie--claro{background:#fff;color:#8A8A96}
.pie__x{position:absolute;left:7cqw;right:7cqw;top:8cqw;height:9cqw;border-radius:2.4cqw;background:#16161B}.pie__x--c{top:19cqw;right:40cqw;height:1.6cqw;border-radius:9px;background:#26262E}
.pie--claro .pie__x{background:#F2F2F5}.pie--claro .pie__x--c{background:#E4E4EA}
.pie__f{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;margin:0 7cqw;font:700 1.26cqw Manrope;letter-spacing:.04em}.pie__f>:nth-child(2){text-align:center}.pie__f>:last-child{justify-self:end}
.pie__wm{color:#fff;font:700 1.8cqw Unbounded;letter-spacing:-.04em}.pie--claro .pie__wm{color:#0A0A0C}.pie__wm b{color:#EB0C6E}
.pie--linea .pie__f{padding:2.6cqw 0 2.8cqw;border-top:1px solid #26262E}.pie--claro.pie--linea .pie__f{border-top-color:rgba(10,10,12,.1)}
.pie--banda .pie__f{margin:0;padding:2.4cqw 7cqw;background:#16161B}.pie--claro.pie--banda .pie__f{background:#0A0A0C;color:#B4B4BE}.pie--claro.pie--banda .pie__wm{color:#fff}
.pie__n{padding:.5cqw 1.4cqw;border-radius:99px;background:#EB0C6E;color:#fff}
.pie--grande .pie__f{padding:0 0 2.6cqw;align-items:end}.pie__wm small{display:block;margin-top:.5cqw;color:#8A8A96;font:700 1.2cqw Manrope;letter-spacing:.04em}
.pie__g{color:#EB0C6E;font:700 5cqw/1 Unbounded;letter-spacing:-.05em}.pie__g small{color:#55555F;font-size:1.8cqw;letter-spacing:0}
/* 26 tarjeta horizontal */
.ths{display:grid;gap:12px;padding:18px;border-radius:14px;background:#0A0A0C;box-shadow:0 0 0 1px var(--edge)}
.th{display:grid;grid-template-columns:1.1fr 1fr;gap:18px;align-items:center;padding:14px;border-radius:18px;background:#16161B;box-shadow:inset 0 0 0 1px #26262E}
.th__g{display:grid;place-items:center;min-height:120px;padding:14px;border-radius:12px;background:radial-gradient(60% 55% at 50% 45%,rgba(235,12,110,.2),transparent 70%),#0A0A0C}.th__g>div{width:100%;border-radius:10px;box-shadow:0 10px 24px rgba(0,0,0,.5)}
.th__n{color:#EB0C6E;font:700 22px/1 Unbounded;letter-spacing:-.05em}.th__t b{display:block;margin-top:6px;color:#fff;font:700 14px/1.25 Unbounded;letter-spacing:-.02em}.th__t>span:last-child{display:block;margin-top:4px;color:#8A8A96;font:600 12px/1.45 Manrope}
.th--inv .th__g{order:2}
.th--lista{grid-template-columns:1fr 1.1fr;padding:6px 0 18px;border-radius:0;background:none;box-shadow:none;border-bottom:1px solid #26262E}.th--lista .th__g{order:2;background:none;padding:0}.th--lista:last-child{border-bottom:0;padding-bottom:6px}
.th--lista .th__n{font-size:34px}
/* 28 Hablemos (en cqw de una A4) */
.hb{color:#fff}.hb__in{position:relative;padding:6cqw 7cqw}.mk--claro.hb{color:#0A0A0C}
.hb__h{display:block;font:700 7.4cqw/1 Unbounded;letter-spacing:-.05em}.hb__h i{color:#EB0C6E;font-style:normal}
.hb__l{max-width:58%;margin-top:2cqw;color:#55555F;font:500 2.1cqw/1.45 Manrope}
.hb__dl{display:grid;gap:1.6cqw;margin:3.4cqw 0 0}.hb__dl dt{color:#EB0C6E;font:800 1.3cqw Manrope;letter-spacing:.16em;text-transform:uppercase}.hb__dl dd{margin:.3cqw 0 0;font:700 2cqw Manrope}
.hb__qrc{position:absolute;display:grid;justify-items:center;gap:1cqw;padding:2cqw;border-radius:2.6cqw;background:#fff;box-shadow:0 0 0 1px rgba(10,10,12,.1)}.hb__qr{position:static!important;display:block;width:20cqw;height:auto}.hb__qrc span{max-width:20cqw;color:#55555F;font:700 1.3cqw/1.3 Manrope;text-align:center}
.hb--lista .hb__qrc{right:7cqw;top:24cqw}
.hb__btn{display:inline-flex;align-items:center;gap:1.2cqw;margin-top:3cqw;padding:1.6cqw 3cqw;border-radius:99px;background:#0A0A0C;color:#fff;font:800 1.9cqw Manrope}.hb__btn svg{width:2.2cqw;height:2.2cqw}
.hb__rosa{position:relative;padding:5cqw;border-radius:4cqw;background:#EB0C6E}.hb--tarjeta .hb__l{color:rgba(255,255,255,.85)}.hb--tarjeta .hb__h i{color:#0A0A0C}
.hb--tarjeta .hb__qrc{right:4cqw;top:50%;transform:translateY(-50%);padding:1.6cqw}.hb--tarjeta .hb__qr{width:17cqw}
.hb--tarjeta .hb__dl{grid-template-columns:repeat(4,1fr);margin-top:3cqw}.hb--tarjeta .hb__dl dd{color:#fff;font-size:1.8cqw}
.hb__fondo{position:absolute;inset:0;width:100%;height:100%}
.hb--muesca .hb__in{position:relative}.hb--muesca .hb__l{color:#B4B4BE}.hb__btn--rosa{background:#EB0C6E}
.hb--muesca .hb__qrc{position:absolute;left:7cqw;top:43cqw}.hb--muesca .hb__qr{width:15cqw}
.hb--muesca .hb__dl{position:absolute;left:34cqw;right:7cqw;top:46cqw;grid-template-columns:1fr 1fr;color:#0A0A0C;margin:0}
/* 27 línea de proceso (rediseño) */
.lt{padding:20px 18px;border-radius:14px;background:#0A0A0C;box-shadow:0 0 0 1px var(--edge);color:#fff}.lt--claro{background:#fff;color:#0A0A0C}
.lt__barra{display:flex;gap:3px;height:44px}.lt__s{display:flex;align-items:center;padding:0 10px;border-radius:8px;background:#26262E;min-width:0}
.lt__s em{color:#B4B4BE;font:800 10.5px Manrope;font-style:normal;white-space:nowrap;display:inline-flex;align-items:center;gap:4px}.lt__s--b{background:#33333C}.lt__s--pk{background:#EB0C6E}.lt__s--pk em{color:#fff}
.lt__s--mes{flex:2.2;margin-left:8px;background:none;box-shadow:inset 0 0 0 1.5px #EB0C6E}.lt__s--mes em{color:#FF7AB0}
.lt--claro .lt__s{background:#EEEEF2}.lt--claro .lt__s--b{background:#E2E2E8}.lt--claro .lt__s em{color:#55555F}.lt--claro .lt__s--pk{background:#EB0C6E}.lt--claro .lt__s--pk em{color:#fff}.lt--claro .lt__s--mes{background:none}.lt--claro .lt__s--mes em{color:#EB0C6E}
.lt__leyenda{display:flex;gap:3px;margin-top:8px}.lt__leyenda b{min-width:0;padding:0 2px;font:800 11px/1.3 Manrope}.lt__lmes{flex:2.2;margin-left:8px}
.lt__nota{margin-top:12px;color:#8A8A96;font:700 11.5px Manrope}
.lt--camino{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;position:relative}
.lt__p{position:relative;display:grid;justify-items:center;gap:5px;text-align:center}.lt__p em{color:#EB0C6E;font:800 10px Manrope;font-style:normal;letter-spacing:.08em;text-transform:uppercase}.lt__p b{font:700 11px/1.25 Unbounded;letter-spacing:-.02em}
.lt__p:not(:last-child)::after{content:'';position:absolute;left:calc(50% + 30px);right:calc(-50% + 26px);top:23px;border-top:2px dotted #4A4A55}.lt--claro .lt__p:not(:last-child)::after{border-top-color:#C8C8D0}
.lt--claro .ico--duotono{color:#0A0A0C}.lt__p--on .ico--duotono::before{width:26px;height:26px;right:4px;bottom:4px}
.lt__dias{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.lt__d{display:grid;justify-items:center;gap:4px;padding:8px 0;border-radius:10px;background:#16161B;box-shadow:inset 0 0 0 1px #26262E}
.lt__d em{color:#8A8A96;font:800 10px Manrope;font-style:normal}.lt__d b{display:grid;place-items:center;height:18px}.lt__d--pk{background:#EB0C6E;box-shadow:none}.lt__d--pk em{color:#fff}.lt__d--pk b{color:#fff}
.lt--claro .lt__d{background:#F4F4F7;box-shadow:none}.lt--claro .lt__d--pk{background:#EB0C6E}
.lt__tareas{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:6px}.lt__tareas span{padding:5px 4px;border-radius:6px;background:#26262E;color:#B4B4BE;font:700 9.5px/1.2 Manrope;text-align:center}
.lt__tareas .lt__r{background:#33333C;color:#fff}.lt__tareas .lt__pk{background:rgba(235,12,110,.2);color:#FF7AB0}
.lt--claro .lt__tareas span{background:#EEEEF2;color:#55555F}.lt--claro .lt__tareas .lt__r{background:#E2E2E8;color:#0A0A0C}.lt--claro .lt__tareas .lt__pk{background:rgba(235,12,110,.12);color:#EB0C6E}
.lt__mes{display:flex;align-items:center;gap:6px;margin-top:12px;color:#B4B4BE;font:600 12px Manrope}.lt__mes svg{color:#EB0C6E}.lt__mes b{color:#fff}.lt--claro .lt__mes{color:#55555F}.lt--claro .lt__mes b{color:#0A0A0C}
/* 29 fotos */
.pr__g--29{grid-template-columns:.8fr 1.2fr 1fr!important}.pr__g--30{grid-template-columns:repeat(3,1fr) .75fr!important}
.phc{padding:14px;border-radius:14px;background:#0A0A0C;box-shadow:0 0 0 1px var(--edge)}.phc--claro{background:#fff}
.phc__h{display:block;margin:4px 2px 12px;color:#0A0A0C;font:700 16px/1.15 Unbounded;letter-spacing:-.03em}.phc__h i{color:#EB0C6E;font-style:normal}
.ph{position:relative;overflow:hidden;container-type:inline-size}.ph img{display:block;width:100%;height:100%;object-fit:cover}
.ph--redondeado{border-radius:18px;box-shadow:0 0 0 1px rgba(255,255,255,.14)}.phc--claro .ph--redondeado{box-shadow:0 0 0 1px rgba(10,10,12,.1)}
.ph--svg{display:block;width:100%;height:auto}
.ph--degradado{border-radius:4px}.ph--degradado::after{content:'';position:absolute;inset:45% 0 0;background:linear-gradient(transparent,rgba(10,10,12,.88))}
.ph__t{position:absolute;z-index:1;left:6cqw;right:6cqw;bottom:6cqw;display:grid;gap:3cqw;justify-items:start}.ph__t b{color:#fff;font:700 7cqw/1.1 Unbounded;letter-spacing:-.03em}
.ph__t .ins{position:static}
.cr{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}.cr__c{padding:14px 16px;border-radius:14px;background:#0A0A0C;box-shadow:0 0 0 1px var(--edge)}
.cr__h{display:inline-flex;align-items:center;gap:7px;font:800 13px Manrope}.cr__h svg{padding:3px;border-radius:50%}.cr__h--si svg{background:#EB0C6E;color:#fff}.cr__h--no svg{background:#33333C;color:#B4B4BE}
.cr ul{display:grid;gap:6px;margin:10px 0 0;padding-left:18px;color:#B4B4BE;font:600 12.5px/1.45 Manrope}
.cr__ej{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}.cr__f{display:grid;gap:6px;margin:0}.cr__f figcaption{color:#8A8A96;font:700 11.5px Manrope}
.cr__img{position:relative;border-radius:14px;overflow:hidden}.cr__img img{display:block;width:100%;height:auto;filter:saturate(.85)}
.cr__e{position:absolute;transform:translate(10px,-50%);padding:4px 9px;border-radius:99px;background:rgba(10,10,12,.85);box-shadow:0 0 0 1px #33333C;color:#fff;font:700 11px Manrope;white-space:nowrap}
.cr__img .ll__p{width:10px}.cr__e--izq{transform:translate(calc(-100% - 10px),-50%)}.cr ul{list-style:disc}
/* 30 plantillas de redes (en cqw de cada pieza) */
.rd{background:#0A0A0C;color:#fff}
.rd__arte{position:absolute!important;display:block}
.rd__wm{position:absolute;left:8cqw;top:7cqw;z-index:2;font:700 6cqw Unbounded;letter-spacing:-.04em}.rd__wm b{color:#EB0C6E}
.rd__h{position:absolute;left:8cqw;right:8cqw;z-index:2;font:700 10cqw/1.04 Unbounded;letter-spacing:-.045em}.rd__h i{color:#EB0C6E;font-style:normal}.rd__h--s{font-size:8cqw}
.rd__h--neg{color:#0A0A0C}.rd__h--n{position:static;margin-top:3cqw;color:#0A0A0C}
.rd__des{position:absolute;right:8cqw;bottom:7cqw;z-index:2;display:inline-flex;align-items:center;gap:1.4cqw;color:#B4B4BE;font:800 3.6cqw Manrope}.rd__des svg{width:3.6cqw;height:3.6cqw}.rd__des--neg{color:#55555F}.rd__des--abajo{bottom:6cqw}
.rd__n{position:absolute;left:8cqw;top:20cqw;color:#EB0C6E;font:700 16cqw/1 Unbounded;letter-spacing:-.06em}.rd__n--g{position:static;display:block}
.rd__p{position:absolute;left:8cqw;right:10cqw;color:#B4B4BE;font:600 4.6cqw/1.4 Manrope}.rd__p--n{position:static;margin-top:3cqw;color:#55555F}
.rd__pag{position:absolute;right:8cqw;bottom:7cqw;color:#55555F;font:800 3.4cqw Manrope}.rd__pag--n{color:#8A8A96}
.rd__glow{position:absolute;inset:0;background:radial-gradient(60% 40% at 50% 50%,rgba(235,12,110,.22),transparent 70%)}
.rd__cta{position:absolute;left:50%;bottom:6cqw;z-index:3;transform:translateX(-50%);padding:3cqw 7cqw;border-radius:99px;background:#EB0C6E;color:#fff;font:800 4.6cqw Manrope;white-space:nowrap}.rd__cta--abajo{bottom:8cqw}.rd__cta--neg{background:#0A0A0C}
.rd__deg{position:absolute;inset:40% 0 0;background:linear-gradient(transparent,rgba(10,10,12,.9))}
.rd__ins{left:8cqw!important;bottom:6cqw!important;font-size:3.6cqw!important}
.rd__blanco{position:absolute;inset:0;display:flex;flex-direction:column;padding:12cqw 8cqw;background:#fff;color:#0A0A0C}
.rd__et{color:#EB0C6E;font:800 3.4cqw Manrope;letter-spacing:.16em;text-transform:uppercase}
.rd__mini{position:static!important;display:block;width:100%;height:34cqw;margin-top:auto;border-radius:3cqw;object-fit:cover}
.rd__fondo{position:absolute;inset:0;width:100%;height:100%}
`;
