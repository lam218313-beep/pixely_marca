# pixely_marca — línea gráfica de Pixely (privado)

Sitio de referencia con logos, colores, tipografía, fondos, capturas y piezas terminadas.
**Privado:** `noindex` + `robots.txt` bloqueado. No publicar sin protección de acceso.

## Fuente única
`tokens/tokens.json` → `npm run tokens` genera:
- `src/tokens.css` (web y este sitio)
- `exports/tokens.ts` (videos, Remotion → `pixely_videos/src/marca.ts`)
- `exports/tokens.py` (PDFs e imágenes en Python)

`npm run logos` regenera logos (`public/logos`) y fondos (`public/fondos`) con Python (fontTools + cairosvg).

## Uso
`npm install && npm run dev` · `npm run build` (salida en `dist/`)
