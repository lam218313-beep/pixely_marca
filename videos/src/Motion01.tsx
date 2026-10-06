// Prueba de motion graphics (6 s, vertical): línea de luz rosa → estallido → "pixely." → texto cinético.
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig, delayRender, continueRender, Sequence } from 'remotion';
import { useEffect, useState } from 'react';
import { colores, fuentes, cargarFuentes } from './marca';

const W = 1080;
const H = 1920;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const outExpo = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);

// Grano fino de película: cambia cada cuadro para que no se vea estático.
const Grano: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
      <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 30} /></filter>
      <rect width={W} height={H} filter="url(#g)" />
    </svg>
  );
};

// ---------------------------------------------------------------- Escena A: cuadrícula y línea de luz
const EscenaLuz: React.FC = () => {
  const f = useCurrentFrame();
  const cy = H / 2;
  const grid = interpolate(f, [0, 18], [0, 1], clamp);
  const zoom = interpolate(f, [0, 66], [1.08, 1], { ...clamp, easing: outExpo });
  // La cabeza de la línea recorre la pantalla de izquierda a derecha
  const head = interpolate(f, [6, 34], [-120, W + 120], { ...clamp, easing: inOut });
  // Luego la línea se comprime hacia el centro y queda un punto
  const squeeze = interpolate(f, [36, 50], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const dot = interpolate(f, [44, 54], [0, 1], { ...clamp, easing: outExpo });
  const pulse = interpolate(f, [54, 60], [1, 0.7], clamp);
  // Estallido: círculo rosa que cubre la pantalla y anillos que se expanden
  const burst = interpolate(f, [58, 70], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const flash = interpolate(f, [57, 59, 63], [0, 0.45, 0], clamp);
  const lineW = Math.max(0, Math.min(head, W)) * squeeze;
  const lineLeft = squeeze < 1 ? W / 2 - (W / 2) * squeeze : 0;

  return (
    <AbsoluteFill style={{ background: colores.tinta }}>
      {/* Cuadrícula de puntos */}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: grid * 0.55, transform: `scale(${zoom})` }}>
        <defs>
          <pattern id="dots" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="30" cy="30" r="2" fill="#5A5A66" /></pattern>
          <radialGradient id="vig" cx="50%" cy="50%" r="60%"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#000" /></radialGradient>
          <mask id="m"><rect width={W} height={H} fill="url(#vig)" /></mask>
        </defs>
        <rect width={W} height={H} fill="url(#dots)" mask="url(#m)" />
      </svg>
      {/* Reflejo de la línea en la cuadrícula */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: cy - 260, height: 520, opacity: (f > 6 ? 0.35 : 0) * squeeze, background: `radial-gradient(ellipse ${Math.max(10, lineW / 2)}px 260px at ${lineLeft + lineW / 2}px 50%, rgba(235,12,110,.45), transparent 70%)` }} />
      {/* Línea de luz */}
      <div style={{ position: 'absolute', top: cy - 3, left: lineLeft, width: lineW, height: 6, borderRadius: 6, background: 'linear-gradient(90deg, rgba(235,12,110,0) 0%, #EB0C6E 55%, #FFC2E1 92%, #fff 100%)', boxShadow: '0 0 24px 6px rgba(235,12,110,.8), 0 0 90px 20px rgba(235,12,110,.45)' }} />
      {/* Cabeza brillante */}
      {head < W + 100 && squeeze === 1 && <div style={{ position: 'absolute', top: cy - 18, left: head - 18, width: 36, height: 36, borderRadius: '50%', background: '#fff', boxShadow: '0 0 40px 18px rgba(255,194,225,.9), 0 0 120px 40px rgba(235,12,110,.7)' }} />}
      {/* Punto que queda en el centro */}
      <div style={{ position: 'absolute', left: W / 2 - 34, top: cy - 34, width: 68, height: 68, borderRadius: '50%', background: colores.rosa, transform: `scale(${dot * pulse})`, boxShadow: '0 0 60px 20px rgba(235,12,110,.6)' }} />
      {/* Anillos del estallido */}
      {[0, 1, 2, 3].map((i) => {
        const r = interpolate(f, [54 + i * 2, 74 + i * 2], [0, 700 + i * 260], { ...clamp, easing: outExpo });
        const o = interpolate(f, [54 + i * 2, 76 + i * 2], [0.9, 0], clamp);
        return <div key={i} style={{ position: 'absolute', left: W / 2 - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: '50%', border: '3px solid #EB0C6E', opacity: o }} />;
      })}
      {/* Círculo rosa que cubre todo */}
      <div style={{ position: 'absolute', left: W / 2 - 1150, top: cy - 1150, width: 2300, height: 2300, borderRadius: '50%', background: colores.rosa, transform: `scale(${burst})` }} />
      <AbsoluteFill style={{ background: '#fff', opacity: flash, mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Escena B: "pixely." sobre rosa
const EscenaMarca: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letras = 'pixely'.split('');
  // Al final, el punto negro crece y se convierte en el fondo de la siguiente escena
  const zoomDot = interpolate(f, [40, 56], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const dotIn = spring({ frame: f - 14, fps, config: { damping: 9, stiffness: 160, mass: 0.7 } });
  const capIn = interpolate(f, [22, 34], [0, 1], { ...clamp, easing: outExpo });
  const drift = interpolate(f, [0, 56], [1, 1.04], clamp);

  return (
    <AbsoluteFill style={{ background: colores.rosa, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* Anillos blancos que respiran */}
      {[260, 470, 700, 960].map((r, i) => {
        const s = interpolate(f, [0, 56], [0.86 + i * 0.02, 1.04], { ...clamp, easing: outExpo });
        return <div key={r} style={{ position: 'absolute', width: r * 2, height: r * 2, borderRadius: '50%', border: '2px solid rgba(255,255,255,.28)', transform: `scale(${s})` }} />;
      })}
      <div style={{ transform: `scale(${drift})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 }}>
        <div style={{ fontFamily: fuentes.titulo, fontWeight: 800, fontSize: 196, letterSpacing: '-0.01em', color: colores.blanco, lineHeight: 1, display: 'flex' }}>
          {letras.map((l, i) => {
            const s = spring({ frame: f - 2 - i * 2, fps, config: { damping: 14, stiffness: 140 } });
            const y = interpolate(s, [0, 1], [180, 0]);
            const blur = interpolate(s, [0, 0.7, 1], [18, 2, 0], clamp);
            return <span key={i} style={{ display: 'inline-block', transform: `translateY(${y}px)`, opacity: Math.min(1, s * 1.6), filter: `blur(${blur}px)` }}>{l}</span>;
          })}
          {/* El punto de la marca: negro sobre rosa */}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ display: 'inline-block', color: colores.tinta, transform: `translateY(${interpolate(dotIn, [0, 1], [-520, 0])}px)` }}>.</span>
            {/* círculo negro que crece desde el punto (transición) */}
            <span style={{ position: 'absolute', left: '50%', bottom: 44, width: 60, height: 60, marginLeft: -30, borderRadius: '50%', background: colores.tinta, transform: `scale(${zoomDot * 80})`, opacity: zoomDot > 0 ? 1 : 0 }} />
          </span>
        </div>
        <div style={{ fontFamily: fuentes.texto, fontWeight: 800, fontSize: 34, letterSpacing: '0.32em', color: colores.blanco, opacity: capIn * (1 - zoomDot), transform: `translateY(${(1 - capIn) * 30}px)` }}>
          TU CONTENIDO, EN ORDEN
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Escena C: texto cinético
const Eco: React.FC<{ texto: string; y: number; dir: 1 | -1; f: number }> = ({ texto, y, dir, f }) => {
  const x = dir * interpolate(f, [0, 70], [0, -420]) - 300;
  return (
    <div style={{ position: 'absolute', top: y, left: x, whiteSpace: 'nowrap', fontFamily: fuentes.titulo, fontWeight: 800, fontSize: 168, lineHeight: 1, color: 'transparent', WebkitTextStroke: '2px #2E2E36', letterSpacing: '-0.02em' }}>
      {Array(6).fill(texto).join('  ')}
    </div>
  );
};

const Linea: React.FC<{ texto: string; delay: number; color?: string; f: number }> = ({ texto, delay, color = colores.blanco, f }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 200, stiffness: 120 } });
  return (
    <div style={{ overflow: 'hidden', paddingBottom: 10 }}>
      <div style={{ transform: `translateY(${(1 - s) * 110}%)`, fontFamily: fuentes.titulo, fontWeight: 800, fontSize: 124, lineHeight: 1.04, letterSpacing: '-0.03em', whiteSpace: 'nowrap', color }}>{texto}</div>
    </div>
  );
};

const EscenaTexto: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f - 30, fps, config: { damping: 8, stiffness: 180 } });
  const aquiScale = 1 + interpolate(pop, [0, 1], [0, 0.06]) * (1 - interpolate(f, [40, 52], [0, 1], clamp));
  const firma = interpolate(f, [36, 50], [0, 1], { ...clamp, easing: outExpo });
  const salida = interpolate(f, [60, 66], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: colores.tinta, overflow: 'hidden', opacity: salida }}>
      {[180, 400, 620, 1180, 1400, 1620].map((y, i) => <Eco key={y} texto={i % 2 ? 'SE DECIDE' : 'TU MARCA'} y={y} dir={i % 2 ? -1 : 1} f={f} />)}
      <AbsoluteFill style={{ justifyContent: 'center', padding: '0 90px' }}>
        <Linea texto="TU MARCA" delay={2} f={f} />
        <Linea texto="SE DECIDE" delay={8} f={f} />
        <div style={{ transform: `scale(${aquiScale})`, transformOrigin: 'left center' }}>
          <Linea texto="AQUÍ." delay={14} color={colores.rosa} f={f} />
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 90, bottom: 150, display: 'flex', alignItems: 'center', gap: 18, opacity: firma, transform: `translateY(${(1 - firma) * 24}px)` }}>
        <span style={{ fontFamily: fuentes.titulo, fontWeight: 800, fontSize: 56, color: colores.blanco }}>pixely<span style={{ color: colores.rosa }}>.</span></span>
        <span style={{ width: 2, height: 40, background: '#34343C' }} />
        <span style={{ fontFamily: fuentes.texto, fontWeight: 700, fontSize: 30, color: '#B4B4BE' }}>Pixely Partners</span>
      </div>
    </AbsoluteFill>
  );
};

export const Motion01: React.FC = () => {
  const [espera] = useState(() => delayRender('fuentes'));
  useEffect(() => { cargarFuentes().then(() => continueRender(espera)); }, [espera]);
  return (
    <AbsoluteFill style={{ background: colores.tinta }}>
      <Sequence durationInFrames={70}><EscenaLuz /></Sequence>
      <Sequence from={70} durationInFrames={56}><EscenaMarca /></Sequence>
      <Sequence from={126} durationInFrames={66}><EscenaTexto /></Sequence>
      <Grano />
    </AbsoluteFill>
  );
};
