// Monta los orbes de Thinking Orbs (github.com/Jakubantalik/thinking-orbs, MIT) sin React:
// <canvas data-orb="working" data-size="64" data-tint="#EB0C6E"></canvas>
// Estados: working, searching, solving, listening, connecting, weaving, composing, breathing, shaping.
// Tamaños afinados: 64 (pantallas) y 20 (en línea, botones). data-tint pinta los puntos con un color de la marca.
import { MODE_DRAWS, resolvePreset } from 'thinking-orbs/engine';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function mount(canvas) {
  const size = Number(canvas.dataset.size) === 20 ? 20 : 64;
  const tint = canvas.dataset.tint;
  const dpr = Math.min(2, devicePixelRatio || 1);
  canvas.width = canvas.height = Math.round(size * dpr);
  canvas.style.width = canvas.style.height = `${size}px`;
  const ctx = canvas.getContext('2d');
  const { mode, speed, opts } = resolvePreset(canvas.dataset.orb || 'working', size);
  const draw = MODE_DRAWS[mode];

  const frame = (t) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, size, size);
    draw(ctx, size, t, true, opts); // fondo oscuro (sistema Noche): puntos claros
    if (tint) { // recolorea solo los puntos ya pintados
      draw(ctx, size, t, true, opts); // doble pasada: el rosa de marca es oscuro y los puntos se perderían sobre negro
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, size, size);
    }
  };
  if (reduced) return frame(0.6);

  let raf = 0;
  const loop = () => { frame((performance.now() / 1000) * speed); raf = requestAnimationFrame(loop); };
  // Solo se anima mientras se ve: no gasta batería fuera de pantalla
  new IntersectionObserver(([e]) => {
    cancelAnimationFrame(raf);
    if (e.isIntersecting) raf = requestAnimationFrame(loop);
  }).observe(canvas);
  frame(0);
}

document.querySelectorAll('canvas[data-orb]').forEach(mount);
