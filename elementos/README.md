# Elementos gráficos

Piezas gráficas de Pixely (arte de portada, gráficos de datos, marcos de pantalla, señales, íconos, estructura de página, fotos y plantillas), diseñadas **una por una** antes de usarse.

- `elementos.json`: la lista, con intención, dónde se usa, prioridad y estado (`Por diseñar`, `En diseño`, `Aprobado`, `Rechazado`).
- Se ve en el catálogo, página **Elementos gráficos** (`node componentes/scripts/build.mjs` y se vuelve a publicar).
- Regla: los PDF, la web, los videos y las redes usan **solo elementos Aprobados**. Si un documento necesita algo que no existe, primero se agrega aquí como intención, se diseña y se aprueba.
- Proceso: intención → referencias (de la persona, o 2 o 3 direcciones propuestas con el sistema de diseño) → propuestas con variantes (claro, oscuro, tamaños) → aprobado.
- Orden de trabajo (8 oct): **primero se terminan los elementos**. Recién después se arman los documentos, **página por página**: se muestra una página, se aprueba y se pasa a la siguiente. Nunca un PDF completo de una vez.
- Un elemento aprobado guarda en `elementos.json` su `final` (nombre, qué dice y reglas de uso) y sus archivos en `public/elementos/` (`<n>-oscuro.svg`, `<n>-claro.svg`). Los PDF lo usan desde ahí; lo descartado se borra.

## Aprobados
- **01 Arte de portada**: esfera «componiendo» en grises (`componentes/src/arte-orbe.js`; SVG con `node elementos/01/exportar.mjs`). Ya está en la tarjeta y en la portada y el cierre del brochure; la ficha del plan Pro la usa cuando se regenere.
