# Pixely Videos

Videos y animaciones de Pixely hechos con [Remotion](https://www.remotion.dev): cada video es código React, con las mismas fuentes (Unbounded y Manrope) y los mismos colores que pixely.pe y Pixely Partners.

## Comandos

```bash
npm run studio                                    # vista previa interactiva en el navegador
npx remotion render src/index.ts <Id> out/<archivo>.mp4 --codec=h264
npx remotion still  src/index.ts <Id> out/<archivo>.png --frame=30
```

Formatos: vertical 1080x1920 para Reels, TikTok, YouTube Shorts e historias; se pueden agregar horizontales (1920x1080) y cuadrados (1080x1080) en `src/Root.tsx`.

## Estructura

- `src/marca.ts`: colores, fuentes y su carga.
- `src/Root.tsx`: lista de composiciones.
- `public/fonts`, `public/brand`, `public/capturas`: fuentes, íconos y capturas de Partners.
- `.agents/skills/`: skills oficiales de Remotion para Claude (mejores prácticas, captions, render, studio, etc.).

## Notas de este entorno

`remotion.config.ts` apunta al Chrome headless shell que ya está instalado en la máquina de trabajo (`/opt/pw-browsers/...`). En otra computadora, quitar esa línea o definir la variable `CHROME`.

## Licencia de Remotion

Gratis para individuos y empresas con fines de lucro de hasta 3 empleados. Si el equipo de la empresa crece por encima de ese tamaño hace falta una licencia de empresa (ver `node_modules/remotion/LICENSE.md`).
