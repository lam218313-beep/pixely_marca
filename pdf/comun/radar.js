// Radar de marca: arte vectorial para portadas (lee tu mercado). Dibuja dentro de cada
// <svg class="radar" data-tono="oscuro|claro" data-giro="-35"></svg>. Todo es vector, así imprime nítido.
// giro: hacia dónde apunta el barrido, en grados (0 = arriba, sentido horario).
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const C = 500, R = 470;
  const rad = (g) => ((g - 90) * Math.PI) / 180;
  const punto = (g, r) => [C + r * Math.cos(rad(g)), C + r * Math.sin(rad(g))];
  const arco = (r, g0, g1) => {
    const [x0, y0] = punto(g0, r), [x1, y1] = punto(g1, r);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${g1 - g0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };
  const cuña = (r, g0, g1) => { const [x0, y0] = punto(g0, r), [x1, y1] = punto(g1, r); return `M${C} ${C}L${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z`; };
  // Competidores, reseñas, precios… puntos fijos (ángulo, radio, tamaño)
  const PUNTOS = [[-62, 300, 9], [-30, 395, 7], [-12, 205, 8], [-48, 150, 6], [-84, 420, 6], [28, 330, 6], [74, 250, 5], [118, 380, 6], [152, 180, 5], [198, 300, 6], [236, 410, 5], [262, 140, 5], [306, 350, 6], [334, 240, 5]];

  document.querySelectorAll('svg.radar').forEach((svg) => {
    const oscuro = svg.dataset.tono !== 'claro';
    const giro = Number(svg.dataset.giro ?? -30);
    const linea = oscuro ? '#3A3A46' : 'rgba(10,10,12,.12)';
    const fino = oscuro ? '#2A2A33' : 'rgba(10,10,12,.07)';
    const tinta = oscuro ? '#FFFFFF' : '#0A0A0C';
    svg.setAttribute('viewBox', '0 0 1000 1000');
    let s = '';
    // Resplandor rosa del centro
    s += `<defs><radialGradient id="rd-glow"><stop offset="0" stop-color="#EB0C6E" stop-opacity="${oscuro ? 0.32 : 0.16}"/><stop offset=".55" stop-color="#EB0C6E" stop-opacity="${oscuro ? 0.06 : 0.03}"/><stop offset="1" stop-color="#EB0C6E" stop-opacity="0"/></radialGradient></defs>`;
    s += `<circle cx="${C}" cy="${C}" r="${R}" fill="url(#rd-glow)"/>`;
    // Trama de puntos: más grandes cerca del centro, se apagan hacia afuera
    let trama = '';
    for (let y = 18; y < 1000; y += 34) for (let x = 18; x < 1000; x += 34) {
      const d = Math.hypot(x - C, y - C);
      if (d > R - 10) continue;
      trama += `<circle cx="${x}" cy="${y}" r="${(4.2 - (d / R) * 2.6).toFixed(2)}"/>`;
    }
    s += `<g fill="${tinta}" opacity="${oscuro ? 0.13 : 0.07}">${trama}</g>`;
    // Anillos y cruz
    [120, 225, 330].forEach((r) => (s += `<circle cx="${C}" cy="${C}" r="${r}" fill="none" stroke="${linea}" stroke-width="3"/>`));
    s += `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="${linea}" stroke-width="4"/>`;
    s += `<circle cx="${C}" cy="${C}" r="410" fill="none" stroke="${fino}" stroke-width="3" stroke-dasharray="6 14"/>`;
    s += `<path d="M${C - R} ${C}H${C + R}M${C} ${C - R}V${C + R}" stroke="${fino}" stroke-width="3"/>`;
    // Dial: marcas cada 3°, largas cada 30°
    let dial = '';
    for (let g = 0; g < 360; g += 3) {
      const largo = g % 30 === 0 ? 30 : g % 15 === 0 ? 18 : 9;
      const [x0, y0] = punto(g, R - 6), [x1, y1] = punto(g, R - 6 - largo);
      dial += `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke-width="${g % 30 === 0 ? 4 : 2.6}"/>`;
    }
    s += `<g stroke="${oscuro ? '#55555F' : 'rgba(10,10,12,.22)'}" stroke-linecap="round">${dial}</g>`;
    // Arcos de datos en rosa
    s += `<path d="${arco(330, giro + 140, giro + 196)}" fill="none" stroke="#EB0C6E" stroke-width="9" stroke-linecap="round"/>`;
    s += `<path d="${arco(225, giro + 236, giro + 262)}" fill="none" stroke="#EB0C6E" stroke-width="9" stroke-linecap="round" opacity=".55"/>`;
    s += `<path d="${arco(R + 22, giro - 70, giro + 4)}" fill="none" stroke="#EB0C6E" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 13"/>`;
    // Barrido: 90 rebanadas que se apagan detrás del borde
    let barrido = '';
    for (let i = 0; i < 90; i++) barrido += `<path d="${cuña(R - 4, giro - i - 1.15, giro - i)}" fill-opacity="${(0.62 * (1 - i / 90) ** 2.2).toFixed(3)}"/>`;
    s += `<g fill="#EB0C6E">${barrido}</g>`;
    const [bx, by] = punto(giro, R - 4);
    s += `<line x1="${C}" y1="${C}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="#EB0C6E" stroke-width="16" stroke-opacity=".25" stroke-linecap="round"/>`;
    s += `<line x1="${C}" y1="${C}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="#FF5C9D" stroke-width="5" stroke-linecap="round"/>`;
    // Puntos detectados: los que acaba de pasar el barrido se encienden en rosa con su onda
    PUNTOS.forEach(([g, r, t]) => {
      const atras = ((giro - (g + giro + 30)) % 360 + 360) % 360; // qué tan atrás del barrido quedó
      const [x, y] = punto(g + giro + 30, r);
      if (atras < 75) {
        const k = 1 - atras / 75;
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(t * 4.2).toFixed(1)}" fill="none" stroke="#EB0C6E" stroke-width="3" opacity="${(0.25 + 0.35 * k).toFixed(2)}"/>`;
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(t * 2.4).toFixed(1)}" fill="#EB0C6E" opacity="${(0.18 + 0.2 * k).toFixed(2)}"/>`;
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${t + 2}" fill="#EB0C6E"/>`;
      } else {
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${t}" fill="${tinta}" opacity="${oscuro ? 0.55 : 0.35}"/>`;
      }
    });
    // Centro
    s += `<circle cx="${C}" cy="${C}" r="58" fill="#EB0C6E" fill-opacity=".16"/><circle cx="${C}" cy="${C}" r="34" fill="none" stroke="#EB0C6E" stroke-width="4" stroke-opacity=".6"/><circle cx="${C}" cy="${C}" r="20" fill="#EB0C6E"/><circle cx="${C}" cy="${C}" r="6" fill="#fff"/>`;
    svg.innerHTML = s;
  });
})();
