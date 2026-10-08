// Piezas comunes del reel "Así funciona Pixely Partners".
// Las capturas salen de la app real (pixely/frontend/app/e2e/reel.spec.ts) en 3x, con piezas.json:
// la posición de cada elemento en px de una pantalla de 412 de ancho. Aquí todo se dibuja al tamaño
// final de cada cuadro (sin agrandar imágenes con transform), para que se vea nítido aunque la cámara se acerque.
import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { continueRender, delayRender, Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { MODE_DRAWS, resolvePreset } from 'thinking-orbs/engine';
import piezasJson from '../../public/manual-reel/piezas.json';
import { cargarFuentes, colores, fuentes } from '../marca';

export const W = 1080;
export const H = 1920;

export type Caja = { x: number; y: number; w: number; h: number };
type Piezas = { pantalla: { ancho: number; alto: number; escala: number } } & Record<string, Caja>;
export const P = piezasJson as unknown as Piezas;
const SW = P.pantalla.ancho; // 412
const SH = P.pantalla.alto; // 839

// Curvas de la habilidad motion-design (personalidad premium)
export const curva = {
  entrada: Easing.bezier(0.05, 0.7, 0.1, 1),
  estandar: Easing.bezier(0.4, 0, 0.2, 1),
  salida: Easing.bezier(0.3, 0, 0.8, 0.15),
  suave: Easing.bezier(0.65, 0, 0.35, 1),
};
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
/** Va de `de` a `a` entre los cuadros f0 y f1. */
export const tween = (f: number, f0: number, f1: number, de: number, a: number, easing = curva.estandar) =>
  interpolate(f, [f0, f1], [de, a], { ...clamp, easing });

// ----------------------------------------------------------------- Fuentes
let cargando: Promise<void> | null = null;
/** Pausa el render hasta que Unbounded y Manrope estén listas. */
export const useFuentes = () => {
  const [espera] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    cargando ??= cargarFuentes();
    cargando.then(() => continueRender(espera));
  }, [espera]);
};

// ----------------------------------------------------------------- Cámara
/** Un punto de la cámara: mira el punto (fx, fy) de la pantalla del teléfono, con zoom z, y lo deja en (tx, ty) del video. */
export type Clave = { f: number; fx?: number; fy?: number; z?: number; tx?: number; ty?: number; curva?: keyof typeof curva };
type Cam = { k: number; z: number; ox: number; oy: number };

const ANCHO_BASE = 600; // ancho de la pantalla del teléfono con zoom 1
const K0 = ANCHO_BASE / SW;
const Y_BASE = 560;
export const REPOSO = { fx: SW / 2, fy: SH / 2, z: 1, tx: W / 2, ty: Y_BASE + (SH / 2) * K0 };

/** Entre una clave y la siguiente la cámara se mueve con una curva suave (o la que diga la clave de llegada); antes de la primera y después de la última, se queda quieta. */
export const usarCamara = (claves: Clave[]): Cam => {
  const f = useCurrentFrame();
  // Sin ty, la altura se elige sola: la parte de arriba del teléfono queda bajo los textos (sin hueco) y el punto mirado, entre 900 y 1250.
  const cs = claves.map((c) => {
    const k = { ...REPOSO, ...c };
    return c.ty === undefined ? { ...k, ty: Math.min(1250, Math.max(900, Y_BASE + k.fy * K0 * k.z)) } : k;
  });
  let i = 0;
  while (i < cs.length - 1 && cs[i + 1].f <= f) i++;
  const a = cs[i];
  const b = cs[Math.min(i + 1, cs.length - 1)];
  const t = b.f > a.f ? tween(f, a.f, b.f, 0, 1, curva[b.curva ?? 'suave']) : 0;
  const m = (p: number, q: number) => p + (q - p) * t;
  const z = m(a.z, b.z);
  const k = K0 * z;
  return { k, z, ox: m(a.tx, b.tx) - m(a.fx, b.fx) * k, oy: m(a.ty, b.ty) - m(a.fy, b.fy) * k };
};

const CamCtx = createContext<Cam>({ k: K0, z: 1, ox: 0, oy: 0 });

/** Marco del teléfono y su pantalla. Todo lo que va dentro usa coordenadas de la pantalla (412 × 839). */
export const Telefono: React.FC<{ cam: Cam; opacidad?: number; children: React.ReactNode }> = ({ cam, opacidad = 1, children }) => {
  const { k, z, ox, oy } = cam;
  const w = SW * k;
  const h = SH * k;
  const b = 13 * z; // bisel
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: opacidad }}>
      <div
        style={{
          position: 'absolute', left: ox - b, top: oy - b, width: w + 2 * b, height: h + 2 * b, borderRadius: 64 * z,
          background: 'linear-gradient(160deg, #1d1d23 0%, #111115 55%, #0c0c0f 100%)',
          boxShadow: `0 ${70 * z}px ${140 * z}px -${50 * z}px rgba(0,0,0,.95), 0 0 0 ${1.5 * z}px rgba(255,255,255,.09), inset 0 0 0 ${1.5 * z}px rgba(255,255,255,.05)`,
        }}
      />
      <div style={{ position: 'absolute', left: ox, top: oy, width: w, height: h, borderRadius: 51 * z, overflow: 'hidden', background: colores.tinta }}>
        <CamCtx.Provider value={cam}>{children}</CamCtx.Provider>
      </div>
    </div>
  );
};

const archivo = (nombre: string) => staticFile(`manual-reel/${nombre}`);

/** Una pantalla completa de la app. dx y dy la desplazan (en px de pantalla) para transiciones de navegación. */
export const Captura: React.FC<{ src: string; opacidad?: number; dx?: number; dy?: number; brillo?: number }> = ({ src, opacidad = 1, dx = 0, dy = 0, brillo = 1 }) => {
  const { k } = useContext(CamCtx);
  if (opacidad <= 0) return null;
  return (
    <Img
      src={archivo(`${src}.jpg`)}
      style={{ position: 'absolute', left: dx * k, top: dy * k, width: SW * k, height: SH * k, opacity: opacidad, filter: brillo === 1 ? undefined : `brightness(${brillo})` }}
    />
  );
};

/** Un pedazo de una pantalla completa, para animarlo solo (un botón que se hunde, una fila que se presiona). */
export const Recorte: React.FC<{ src: string; caja: Caja; escala?: number; radio?: number; opacidad?: number }> = ({ src, caja, escala = 1, radio = 0, opacidad = 1 }) => {
  const { k } = useContext(CamCtx);
  return (
    <div style={{ position: 'absolute', left: caja.x * k, top: caja.y * k, width: caja.w * k, height: caja.h * k, overflow: 'hidden', borderRadius: radio * k, scale: String(escala), opacity: opacidad }}>
      <Img src={archivo(`${src}.jpg`)} style={{ position: 'absolute', left: -caja.x * k, top: -caja.y * k, width: SW * k, height: SH * k }} />
    </div>
  );
};

/** Una pieza recortada de la app (PNG), puesta en su lugar. */
export const Pieza: React.FC<{ src: string; caja: Caja; dx?: number; dy?: number; rotar?: number; escala?: number; radio?: number; opacidad?: number; children?: React.ReactNode }> = ({
  src, caja, dx = 0, dy = 0, rotar = 0, escala = 1, radio = 0, opacidad = 1, children,
}) => {
  const { k } = useContext(CamCtx);
  return (
    <div
      style={{
        position: 'absolute', left: (caja.x + dx) * k, top: (caja.y + dy) * k, width: caja.w * k, height: caja.h * k,
        borderRadius: radio * k, overflow: 'hidden', rotate: `${rotar}deg`, scale: String(escala), opacity: opacidad,
      }}
    >
      <Img src={archivo(`${src}.png`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {children}
    </div>
  );
};

/** Una capa de color sobre la pantalla (por ejemplo, el oscurecido detrás de una hoja). */
export const Velo: React.FC<{ opacidad: number }> = ({ opacidad }) =>
  opacidad > 0 ? <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: opacidad }} /> : null;

/** Un dedo que toca la pantalla en el cuadro `en`: llega, se hunde y deja una onda. */
export const Toque: React.FC<{ x: number; y: number; en: number }> = ({ x, y, en }) => {
  const f = useCurrentFrame();
  const { k } = useContext(CamCtx);
  if (f < en - 9 || f > en + 24) return null;
  const llega = tween(f, en - 9, en, 0, 1, curva.entrada);
  const hunde = f < en ? 1 : tween(f, en, en + 4, 0.84, 1, curva.estandar);
  const se_va = tween(f, en + 8, en + 16, 1, 0);
  const onda = tween(f, en, en + 22, 0, 1, curva.entrada);
  const r = 21 * k;
  return (
    <>
      <div style={{ position: 'absolute', left: x * k - (r + onda * 34 * k), top: y * k - (r + onda * 34 * k), width: 2 * (r + onda * 34 * k), height: 2 * (r + onda * 34 * k), borderRadius: '50%', border: `${2 * k}px solid rgba(255,255,255,${0.55 * (1 - onda)})`, opacity: f >= en ? 1 : 0 }} />
      <div
        style={{
          position: 'absolute', left: x * k - r, top: y * k - r, width: 2 * r, height: 2 * r, borderRadius: '50%',
          background: 'rgba(255,255,255,.34)', boxShadow: `0 0 0 ${1.5 * k}px rgba(255,255,255,.55), 0 ${6 * k}px ${18 * k}px rgba(0,0,0,.35)`,
          opacity: llega * se_va, scale: String((1.35 - 0.35 * llega) * hunde),
        }}
      />
    </>
  );
};

/** Un dedo que arrastra de (x0, y0) a (x1, y1) entre los cuadros f0 y f1. */
export const Arrastre: React.FC<{ x0: number; y0: number; x1: number; y1: number; f0: number; f1: number }> = ({ x0, y0, x1, y1, f0, f1 }) => {
  const f = useCurrentFrame();
  const { k } = useContext(CamCtx);
  if (f < f0 - 8 || f > f1 + 8) return null;
  const t = tween(f, f0, f1, 0, 1, curva.suave);
  const op = tween(f, f0 - 8, f0, 0, 1) * tween(f, f1, f1 + 8, 1, 0);
  const r = 21 * k;
  const x = (x0 + (x1 - x0) * t) * k;
  const y = (y0 + (y1 - y0) * t) * k;
  return <div style={{ position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: 'rgba(255,255,255,.34)', boxShadow: `0 0 0 ${1.5 * k}px rgba(255,255,255,.55)`, opacity: op }} />;
};

/** Número que sube de 0 a `valor`, dibujado con la misma letra que la app, encima de la captura sin cifras. */
export const Contador: React.FC<{ caja: Caja; valor: number; f0: number; f1: number; tam: number; espaciado: number }> = ({ caja, valor, f0, f1, tam, espaciado }) => {
  const f = useCurrentFrame();
  const { k } = useContext(CamCtx);
  const v = Math.round(tween(f, f0, f1, 0, valor, curva.entrada));
  return (
    <div style={{ position: 'absolute', left: caja.x * k, top: caja.y * k, height: caja.h * k, display: 'flex', alignItems: 'center', fontFamily: fuentes.titulo, fontWeight: 700, fontSize: tam * k, letterSpacing: espaciado * k, color: colores.blanco, whiteSpace: 'nowrap' }}>
      {v.toLocaleString('en-US')}
    </div>
  );
};

// ----------------------------------------------------------------- Textos
const SAFE_X = 80;

export type TextoApoyo = { texto: string; desde: number; hasta: number };

/** Titular de cada paso: la etiqueta rosa y el texto, que entra palabra por palabra y sale hacia arriba.
 *  Los textos de apoyo van justo debajo y se reemplazan con un fundido. */
export const Titular: React.FC<{ paso?: string; texto: string; desde: number; hasta: number; top?: number; tam?: number; centrado?: boolean; apoyos?: TextoApoyo[] }> = ({
  paso, texto, desde, hasta, top = 150, tam = 82, centrado = false, apoyos = [],
}) => {
  const f = useCurrentFrame();
  if (f < desde || f > hasta) return null;
  const sale = tween(f, hasta - 9, hasta, 0, 1, curva.salida);
  const palabras = texto.split(' ');
  return (
    <div style={{ position: 'absolute', left: SAFE_X, right: SAFE_X, top, textAlign: centrado ? 'center' : 'left', opacity: 1 - sale, translate: `0px ${-28 * sale}px` }}>
      {paso && (
        <div style={{ fontFamily: fuentes.texto, fontWeight: 800, fontSize: 30, letterSpacing: '0.18em', textTransform: 'uppercase', color: colores.rosa, marginBottom: 22, opacity: tween(f, desde, desde + 10, 0, 1) }}>
          {paso}
        </div>
      )}
      <div style={{ fontFamily: fuentes.titulo, fontWeight: 700, fontSize: tam, lineHeight: 1.06, letterSpacing: '-0.045em', color: colores.blanco }}>
        {palabras.map((p, i) => {
          const e = tween(f, desde + 3 + i * 2, desde + 19 + i * 2, 0, 1, curva.entrada);
          const final = i === palabras.length - 1 && p.endsWith('.');
          return (
            <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em', marginRight: '0.24em' }}>
              <span style={{ display: 'inline-block', translate: `0px ${(1 - e) * 110}%` }}>
                {final ? <>{p.slice(0, -1)}<span style={{ color: colores.rosa }}>.</span></> : p}
              </span>
            </span>
          );
        })}
      </div>
      <div style={{ position: 'relative', marginTop: 26 }}>
        {apoyos.map((ap) => {
          if (f < ap.desde || f > ap.hasta) return null;
          const op = tween(f, ap.desde, ap.desde + 10, 0, 1, curva.entrada) * (ap.hasta >= hasta ? 1 : tween(f, ap.hasta - 8, ap.hasta, 1, 0));
          return (
            <div key={ap.texto} style={{ position: 'absolute', left: 0, right: 0, top: 0, fontFamily: fuentes.texto, fontWeight: 600, fontSize: 44, lineHeight: 1.3, color: colores.suave, opacity: op, translate: `0px ${(1 - op) * 14}px` }}>
              {ap.texto}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Texto de apoyo bajo el titular; cambia con un fundido. */
export const Apoyo: React.FC<{ texto: string; desde: number; hasta: number; top?: number }> = ({ texto, desde, hasta, top = 420 }) => {
  const f = useCurrentFrame();
  if (f < desde || f > hasta) return null;
  const op = tween(f, desde, desde + 10, 0, 1, curva.entrada) * tween(f, hasta - 8, hasta, 1, 0);
  return (
    <div style={{ position: 'absolute', left: SAFE_X, right: SAFE_X, top, fontFamily: fuentes.texto, fontWeight: 600, fontSize: 44, lineHeight: 1.3, color: colores.suave, opacity: op, translate: `0px ${(1 - op) * 14}px` }}>
      {texto}
    </div>
  );
};

/** Degradado negro arriba: el teléfono pasa por debajo de los textos sin ensuciarlos. */
export const VelaSuperior: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 560, background: `linear-gradient(${colores.tinta} 0%, ${colores.tinta} 86%, rgba(10,10,12,0) 100%)` }} />
);

// ----------------------------------------------------------------- Fondo
/** Anillos de la marca que respiran despacio, un brillo rosa y grano fino. `desde` mantiene el movimiento continuo entre escenas. */
export const Fondo: React.FC<{ desde?: number }> = ({ desde = 0 }) => {
  const f = useCurrentFrame() + desde;
  const cx = W / 2;
  const cy = REPOSO.ty;
  const respira = 1 + 0.018 * Math.sin(f / 38);
  return (
    <div style={{ position: 'absolute', inset: 0, background: colores.tinta, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: cx - 760, top: cy - 1060, width: 1520, height: 1520, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(235,12,110,.16), rgba(235,12,110,0))' }} />
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {[300, 450, 620, 810].map((r, i) => (
          <circle key={r} cx={cx} cy={cy} r={r * (respira + i * 0.004)} fill="none" stroke="rgba(255,255,255,.055)" strokeWidth={2} />
        ))}
        <circle cx={cx + Math.cos(f / 70) * 450 * respira} cy={cy + Math.sin(f / 70) * 450 * respira} r={7} fill={colores.rosa} opacity={0.85} />
        <filter id="grano"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 24} /></filter>
        <rect width={W} height={H} filter="url(#grano)" opacity={0.05} />
      </svg>
    </div>
  );
};

// ----------------------------------------------------------------- Orbe
type EstadoOrbe = 'working' | 'searching' | 'solving' | 'listening' | 'connecting' | 'weaving' | 'composing' | 'breathing' | 'shaping';

/** El orbe de puntos de Partners (thinking-orbs, MIT), dibujado según el cuadro para que el render sea exacto. */
export const Orbe: React.FC<{ estado?: EstadoOrbe; base?: 64 | 20; lado: number; x: number; y: number; color?: string; opacidad?: number }> = ({
  estado = 'working', base = 64, lado, x, y, color = colores.rosa, opacidad = 1,
}) => {
  const f = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    const px = Math.round(lado * 2);
    ref.current!.width = ref.current!.height = px;
    const { mode, speed, opts } = resolvePreset(estado, base);
    const draw = MODE_DRAWS[mode];
    const t = (f / 30) * speed;
    ctx.setTransform(px / base, 0, 0, px / base, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, base, base);
    draw(ctx, base, t, true, opts);
    draw(ctx, base, t, true, opts);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, base, base);
  }, [f, estado, base, lado, color]);
  return <canvas ref={ref} style={{ position: 'absolute', left: x - lado / 2, top: y - lado / 2, width: lado, height: lado, opacity: opacidad }} />;
};

/** El orbe dentro de la pantalla del teléfono (en px de pantalla). */
export const OrbeEnPantalla: React.FC<{ caja: Caja; estado?: EstadoOrbe }> = ({ caja, estado = 'working' }) => {
  const { k } = useContext(CamCtx);
  return <Orbe estado={estado} base={20} lado={caja.w * k} x={(caja.x + caja.w / 2) * k} y={(caja.y + caja.h / 2) * k} />;
};
