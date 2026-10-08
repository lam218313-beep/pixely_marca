// Anima el elemento 01 en el catálogo: <canvas data-arte data-tono="oscuro|claro">
// Misma geometría que el SVG de imprenta (arte-orbe.js), solo que en movimiento (para redes, web y reels).
import { arte, QUIETO } from './arte-orbe.js';

const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

function montar(cv) {
  const tono = cv.dataset.tono || 'oscuro';
  const lado = cv.clientWidth || 280, dpr = Math.min(2, devicePixelRatio || 1);
  cv.width = cv.height = Math.round(lado * dpr);
  const ctx = cv.getContext('2d');
  const pintar = (t) => {
    const { dots } = arte(lado, t, tono);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, lado, lado);
    for (const d of dots) { ctx.fillStyle = d.c; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill(); }
  };
  if (quieto) return pintar(QUIETO);
  let id = 0;
  const t0 = performance.now() / 1000 - QUIETO;
  const bucle = () => { pintar(performance.now() / 1000 - t0); id = requestAnimationFrame(bucle); };
  new IntersectionObserver(([e]) => { cancelAnimationFrame(id); if (e.isIntersecting) id = requestAnimationFrame(bucle); }).observe(cv);
  pintar(QUIETO);
}

// La página de elementos empieza oculta: se monta cuando se ve por primera vez.
const pendientes = () => document.querySelectorAll('canvas[data-arte]:not([data-listo])').forEach((cv) => {
  if (!cv.clientWidth) return;
  cv.dataset.listo = '1';
  montar(cv);
});
pendientes();
addEventListener('hashchange', () => setTimeout(pendientes, 60));
addEventListener('resize', pendientes);
new MutationObserver(() => setTimeout(pendientes, 60)).observe(document.body, { attributes: true, subtree: true, attributeFilter: ['hidden'] });
