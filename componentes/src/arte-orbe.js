// Elemento 01 «Arte de portada»: la esfera «componiendo» de Partners en grande.
// Geometría pura (sin canvas): la usan el catálogo (animada) y elementos/01/exportar.mjs (SVG para imprenta).
// Es la misma figura del orbe de carga (cinta ancha que ondula alrededor de una esfera de puntos),
// con más puntos para que aguante tamaño de portada. arte(variante, lado, t, tono) → { lines, dots }.
import { makeProj } from 'thinking-orbs/engine';

const ROSA = [235, 12, 110];
const TONOS = {
  oscuro: { fondo: [10, 10, 12], tinta: [255, 255, 255] },
  claro: { fondo: [255, 255, 255], tinta: [10, 10, 12] },
};
const fib = (i, n) => {
  const y = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(1 - y * y), a = i * Math.PI * (3 - Math.sqrt(5));
  return [r * Math.cos(a), y, r * Math.sin(a)];
};
const hex = (c) => '#' + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
// Color opaco ya mezclado con el fondo (sin transparencias, así la imprenta no tiene sorpresas).
// cuanto: 0 = fondo, 1 = tinta plena. rosa: 0 = gris, 1 = rosa de marca.
const color = (tono, cuanto, rosa = 0) => {
  const { fondo, tinta } = TONOS[tono];
  const gris = tinta.map((v, i) => v + (ROSA[i] - v) * rosa);
  return hex(fondo.map((v, i) => v + (gris[i] - v) * cuanto));
};

// Cuánto rosa lleva cada punto de la cinta según la variante.
// carril: -1 a 1 (un borde de la cinta al otro) · ang: 0 a 2π (vuelta completa) · t: tiempo.
const ROSAS = {
  grises: () => 0,
  hebra: (carril) => Math.max(0, 1 - Math.abs(carril) / 0.16),
  tramo: (carril, ang, t) => {
    const d = Math.atan2(Math.sin(ang - 2.25 - t * 0.35), Math.cos(ang - 2.25 - t * 0.35));
    return Math.exp(-((d / 0.55) ** 2));
  },
  borde: (carril) => Math.max(0, Math.min(1, (carril - 0.15) / 0.75)),
};

function componiendo(variante, n, t, tono) {
  const s = (n / 2) * 0.86, cx = n / 2, cy = n / 2;
  const P = makeProj(0, 0.3, cx, cy, 1);
  const rosa = ROSAS[variante];
  const dots = [];
  // Velo: la esfera de puntos finos que da volumen.
  const velo = 260;
  for (let i = 0; i < velo; i++) {
    const f = fib(i, velo), [x, y, z] = P(f[0] * s, f[1] * s, f[2] * s), d = (z / s + 1) / 2;
    dots.push({ x, y, z, r: 0.0032 * n, c: color(tono, 0.05 + 0.09 * d) });
  }
  // Cinta: carriles a lo ancho, columnas a lo largo; la onda la recorre (igual que el orbe de la app).
  // Las columnas van más separadas que los carriles: por eso se ven como puntadas, el rasgo del orbe.
  const M = 0.55, cM = Math.cos(M), sM = Math.sin(M);
  const u1 = [1, 0, 0], u2 = [0, cM, sM], nn = [0, -sM, cM];
  const carriles = 17, puntos = 72, paso = 0.051, rMax = 0.4 * paso * s;
  for (let k = 0; k < carriles; k++) {
    const carril = (k - (carriles - 1) / 2) / ((carriles - 1) / 2);
    const A = carril * ((carriles - 1) / 2) * paso, E = Math.abs(carril);
    for (let j = 0; j < puntos; j++) {
      const N = (j / puntos) * 2 * Math.PI;
      const C = 0.16 * Math.sin(N * 3 - t * 1.7 + k * 0.22 * 0.6) + 0.07 * Math.sin(N * 5 + t * 1.1);
      const L = A + C, cN = Math.cos(N), sN = Math.sin(N);
      const v = [0, 1, 2].map((i) => u1[i] * cN + u2[i] * sN + nn[i] * L);
      const l = Math.hypot(v[0], v[1], v[2]);
      const [x, y, z] = P((v[0] / l) * s, (v[1] / l) * s, (v[2] / l) * s), U = (z / s + 1) / 2;
      const luz = (0.46 + 0.4 * U - 0.16 * E) * (0.38 + 0.62 * U);
      const ro = rosa(carril, N, t);
      dots.push({ x, y, z, r: (0.3 + 0.7 * U) * (1 - 0.25 * E) * rMax * (1 + 0.15 * ro), c: color(tono, ro ? luz + (1 - luz) * ro * (0.25 + 0.6 * U) : luz, ro) });
    }
  }
  dots.sort((a, b) => a.z - b.z);
  return { lines: [], dots };
}

export const VARIANTES = Object.keys(ROSAS);
export const arte = (variante, n, t, tono = 'oscuro') => componiendo(variante, n, t, tono);
// Momento fijo para imprenta: la onda en su forma más clara.
export const QUIETO = 0.9;
