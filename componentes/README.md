# pixely_ui — repositorio de componentes de interfaz (privado)

Catálogo pieza por pieza de la interfaz de Pixely Partners (app) y pixely.pe (web): HTML + CSS listo para copiar,
cuándo usarlo, qué evitar y de dónde sale cada uno. Los marcados **Propuesto** aún no existen en código.

- `src/components/*.js`: un archivo por categoría. Cada componente = `{id, cat, nombre, origen, estado, fuente, desc, usar, evitar, stage, html, css, usa}`.
- `src/icons.js`: set de íconos de interfaz (trazo Lucide).
- `scripts/build.mjs` → `artifact/index.html` (página única que se publica como Artifact privado).
- Clases: `p-*` = Partners (sistema Noche), `w-*` = web. Las muestras dependen de los tokens de `pixely_marca` (`tokens/tokens.json`).

Siguientes repositorios: animaciones (por categorías) e imágenes/videos/íconos.
