# Elementos gráficos

Piezas gráficas de Pixely (arte de portada, gráficos de datos, marcos de pantalla, señales, íconos, estructura de página, fotos y plantillas), diseñadas **una por una** antes de usarse.

- `elementos.json`: la lista, con intención, dónde se usa, prioridad y estado (`Por diseñar`, `En diseño`, `Aprobado`, `Rechazado`).
- Se ve en el catálogo, página **Elementos gráficos** (`node componentes/scripts/build.mjs` y se vuelve a publicar).
- Regla: los PDF, la web, los videos y las redes usan **solo elementos Aprobados**. Si un documento necesita algo que no existe, primero se agrega aquí como intención, se diseña y se aprueba.
- Proceso: intención → referencias (de la persona, o 2 o 3 direcciones propuestas con el sistema de diseño) → propuestas con variantes (claro, oscuro, tamaños) → aprobado.
