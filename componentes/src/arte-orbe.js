// Elemento 01 «Arte de portada»: esferas de puntos grandes, hermanas de los orbes de carga de Partners.
// Geometría pura (sin canvas): la usan el catálogo (animada) y elementos/01/exportar.mjs (SVG para imprenta).
// arte(direccion, lado, t, tono) → { halos, lines, dots } con colores ya resueltos y ordenados de atrás hacia adelante.
import { makeProj, radiusScale } from 'thinking-orbs/engine';

const ROSA = [235, 12, 110];
const TONOS = {
  oscuro: { fondo: [10, 10, 12], tinta: [255, 255, 255] },
  claro: { fondo: [255, 255, 255], tinta: [10, 10, 12] },
};
const hash = (a, b) => { const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return s - Math.floor(s); };
const fib = (i, n) => {
  const y = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(1 - y * y), a = i * Math.PI * (3 - Math.sqrt(5));
  return [r * Math.cos(a), y, r * Math.sin(a)];
};
const norm = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const hex = (c) => '#' + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
// Mezcla opaca sobre el fondo: sin transparencias, así la imprenta no tiene sorpresas.
const tinta = (tono, cuanto, rosa = 0) => {
  const { fondo, tinta: t } = TONOS[tono];
  const base = t.map((v, i) => fondo[i] + (v - fondo[i]) * cuanto);
  return hex(base.map((v, i) => v + (ROSA[i] - v) * rosa));
};
const rosaPuro = (tono, cuanto) => { const { fondo } = TONOS[tono]; return hex(fondo.map((v, i) => v + (ROSA[i] - v) * cuanto)); };

// La zona se fija en el mundo donde, en el cuadro quieto, cae a la izquierda del centro y hacia el frente:
// así queda a la vista aunque la esfera se salga por la derecha (tarjeta, portada) o por abajo (post).
const ZONA = (() => {
  const P = makeProj(-0.62, 0.36, 0, 0, 1), meta = [-0.34, -0.06, 0.94];
  let mejor = null, dist = Infinity;
  for (let i = 0; i < 6000; i++) {
    const f = fib(i, 6000), [x, y, z] = P(f[0], f[1], f[2]);
    const d = Math.hypot(x - meta[0], y - meta[1], z - meta[2]);
    if (d < dist) { dist = d; mejor = f; }
  }
  return mejor;
})();

// A · Globo: el mercado como un globo de puntos y tu zona encendida en rosa.
function globo(n, t, tono) {
  const R = (n / 2) * 0.84, cx = n / 2, cy = n / 2;
  const yaw = -0.62 + 0.32 * Math.sin(t * 0.32), tilt = 0.36 + 0.05 * Math.sin(t * 0.21);
  const P = makeProj(yaw, tilt, cx, cy, R), rs = radiusScale(n, 0.6);
  const zona = ZONA;
  const dots = [], halos = [];
  const lat = 38, lon = 100;
  for (let i = 0; i <= lat; i++) {
    const phi = -Math.PI / 2 + (i / lat) * Math.PI, c = Math.cos(phi), s = Math.sin(phi);
    const m = Math.max(1, Math.round(Math.abs(c) * lon));
    for (let j = 0; j < m; j++) {
      const th = (j / m) * 2 * Math.PI + i * 0.37;
      const p = [c * Math.cos(th), s, c * Math.sin(th)];
      const [x, y, z] = P(p[0], p[1], p[2]);
      const d = (z + 1) / 2;
      const ang = Math.acos(Math.max(-1, Math.min(1, dot3(p, zona))));
      const w = Math.exp(-((ang / 0.4) ** 2)) * (0.35 + 0.65 * d);
      const pulso = 0.5 + 0.5 * Math.sin(t * 2.2 - ang * 9);
      const r = (0.55 + 1.75 * d) * rs * (1 + 0.9 * w * (0.75 + 0.25 * pulso));
      dots.push({ x, y, z, r, c: w > 0.06 ? tinta(tono, 0.3 + 0.62 * d, Math.min(1, w * 1.6)) : tinta(tono, 0.2 + 0.72 * d) });
    }
  }
  const [hx, hy, hz] = P(zona[0], zona[1], zona[2]);
  if (hz > -0.2) halos.push({ x: hx, y: hy, r: R * 0.7, c: rosaPuro(tono, 1), a: 0.34 * (hz + 0.2) / 1.2 });
  dots.sort((a, b) => a.z - b.z);
  return { halos, lines: [], dots };
}

// B · Red: los negocios de la zona conectados, y el tuyo al centro de la conversación.
function red(n, t, tono) {
  const R = (n / 2) * 0.82, cx = n / 2, cy = n / 2;
  const P = makeProj(-0.4 + t * 0.06, 0.32, cx, cy, R), rs = radiusScale(n, 0.6);
  const N = 120, thr = 0.44, nodos = [];
  for (let i = 0; i < N; i++) {
    const f = fib(i, N), a = 0.2;
    nodos.push(norm([f[0] + a * (hash(i, 1.3) - 0.5 + 0.25 * Math.sin(t * 0.7 + i)), f[1] + a * (hash(i, 4.1) - 0.5), f[2] + a * (hash(i, 7.9) - 0.5 + 0.25 * Math.cos(t * 0.6 + i * 1.7))]));
  }
  // Tu negocio: el nodo más al frente y a la izquierda del centro (queda a la vista en todos los recortes).
  const proj = nodos.map((p) => P(p[0], p[1], p[2]));
  let tu = 0, mejor = -Infinity;
  proj.forEach(([x, y, z], i) => { const s = z * 1.2 - (x - cx) / R * 0.5 - Math.abs(y - cy) / R * 0.3; if (s > mejor) { mejor = s; tu = i; } });
  const vecinos = new Set();
  const lines = [];
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
    const dd = Math.hypot(nodos[i][0] - nodos[j][0], nodos[i][1] - nodos[j][1], nodos[i][2] - nodos[j][2]);
    if (dd >= thr) continue;
    const [x1, y1, z1] = proj[i], [x2, y2, z2] = proj[j];
    const d = ((z1 + z2) / 2 + 1) / 2, k = 1 - dd / thr;
    const mio = i === tu || j === tu;
    if (mio) vecinos.add(i === tu ? j : i);
    lines.push({ x1, y1, x2, y2, z: (z1 + z2) / 2, w: (mio ? 1.5 : 0.8) * rs, c: mio ? tinta(tono, 0.4 * k, 0.55 + 0.45 * d) : tinta(tono, (0.1 + 0.32 * d) * (0.35 + 0.65 * k)), mio });
  }
  lines.sort((a, b) => a.mio - b.mio || a.z - b.z);
  const dots = [];
  // Volumen: un velo de puntos finos.
  for (let i = 0; i < 520; i++) {
    const f = fib(i, 520), [x, y, z] = P(f[0] * 0.985, f[1] * 0.985, f[2] * 0.985), d = (z + 1) / 2;
    dots.push({ x, y, z: z - 2, r: 0.75 * rs, c: tinta(tono, 0.08 + 0.16 * d) });
  }
  proj.forEach(([x, y, z], i) => {
    const d = (z + 1) / 2, v = vecinos.has(i);
    const r = (1.1 + 2.2 * d) * rs * (i === tu ? 2.6 : v ? 1.2 : 1) * (1 + 0.15 * Math.sin(t * 1.4 + i * 2.7));
    dots.push({ x, y, z, r, c: i === tu ? rosaPuro(tono, 1) : v ? tinta(tono, 0.5 + 0.45 * d, 0.65) : tinta(tono, 0.25 + 0.7 * d) });
  });
  // Señales: puntos rosas que viajan por los enlaces de tu negocio.
  [...vecinos].forEach((v, k) => {
    const f = (t * 0.45 + k * 0.37) % 1, a = nodos[tu], b = nodos[v];
    const p = norm([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]);
    const [x, y, z] = P(p[0], p[1], p[2]);
    dots.push({ x, y, z: z + 0.01, r: 1.6 * rs, c: rosaPuro(tono, 1) });
  });
  const [hx, hy, hz] = proj[tu];
  const halos = [{ x: hx, y: hy, r: R * 0.42, c: rosaPuro(tono, 1), a: 0.3 * (hz + 1) / 2 }];
  dots.sort((a, b) => a.z - b.z);
  return { halos, lines, dots };
}

// C · Trenza: mercado, estrategia y contenido tejidos en una sola pieza (la hebra rosa es tu contenido).
function trenza(n, t, tono) {
  const R = (n / 2) * 0.8, cx = n / 2, cy = n / 2;
  const P = makeProj(t * 0.18 - 0.3, 0.3, cx, cy, R), rs = radiusScale(n, 0.6);
  const dots = [];
  for (let i = 0; i < 700; i++) {
    const f = fib(i, 700), [x, y, z] = P(f[0], f[1], f[2]), d = (z + 1) / 2;
    dots.push({ x, y, z, r: 0.7 * rs, c: tinta(tono, 0.1 + 0.2 * d) });
  }
  const M = 230, vueltas = 3;
  for (let h = 0; h < 3; h++) {
    const fase = (h / 3) * 2 * Math.PI;
    for (let w = 0; w < M; w++) {
      let u = (w / M + t * 0.03) % 1;
      const D = (u * 2 - 1) * 0.97, rad = Math.sqrt(Math.max(0, 1 - D * D));
      const fade = Math.min(1, (1 - Math.abs(D)) / 0.12);
      const b = D * Math.PI * vueltas + fase, ond = 1 + 0.06 * Math.sin(D * Math.PI * vueltas * 2 + fase * 2 + t * 0.8);
      const [x, y, z] = P(Math.cos(b) * rad * ond, D * ond, Math.sin(b) * rad * ond), d = (z + 1) / 2;
      const r = (1.0 + 2.1 * d) * rs * (0.4 + 0.6 * fade);
      dots.push({ x, y, z, r, c: h === 0 ? rosaPuro(tono, (0.35 + 0.65 * d) * fade) : tinta(tono, (0.18 + 0.78 * d) * fade) });
    }
  }
  dots.sort((a, b) => a.z - b.z);
  return { halos: [], lines: [], dots };
}

export const DIRECCIONES = { globo, red, trenza };
export const arte = (dir, n, t, tono = 'oscuro') => DIRECCIONES[dir](n, t, tono);
// Momento fijo para imprenta (el que mejor encuadra cada dirección).
export const QUIETO = { globo: 0, red: 0.6, trenza: 1.2 };
