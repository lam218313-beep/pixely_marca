# pixely_marca — línea gráfica y assets de Pixely (privado)

Repositorio único de marca. Todo lo gráfico sale de aquí.

| Carpeta | Qué hay |
|---|---|
| `tokens/` | **Fuente única**: colores, fuentes y radios (`tokens.json`). `npm run tokens` genera CSS, TS y Python. |
| `public/logos`, `public/fondos` | Logos (SVG/PNG) y fondos de anillos. `npm run logos` los regenera. |
| `public/piezas`, `public/capturas` | PDFs, portadas, QR y capturas aprobadas. |
| `src/`, `index.html`, `artifact/` | Manual de marca (página privada). |
| `componentes/` | Catálogo de componentes de interfaz, pieza por pieza (`node componentes/scripts/build.mjs`). |
| `videos/` | Proyecto Remotion para videos (`cd videos && npm install && npx remotion studio`). |
| `.claude/skills/` | Skills de diseño, animación, 3D y video para Claude Code (ver `SKILLS.md`). |

Privado: `noindex` y `robots.txt` bloqueado. No publicar sin protección de acceso.
