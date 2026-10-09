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
- **02 Trama de marca**: puntadas (`node elementos/02/exportar.mjs` → `public/elementos/02-puntadas-<tono>.svg`, baldosa sin costuras).
- **03 Resplandor rosa**: el de la vitrina de pixely.pe, `radial-gradient(60% 55% at 50% 38%, rgba(235, 12, 110, .20), transparent 70%)` (fondos PNG con `elementos/03/exportar.mjs`).
- **04 Muesca de sección**: la de pixely.pe tal cual (`--notch` en `pixely_web/src/styles/tokens.css`).
- **13 Celular**: marco «vitrina» de pixely.pe. **14 Laptop**: escena real (`pdf/brochure/escritorio.py`). **15 Acercamiento**: lupa. **16 Llamada**: punto, línea y etiqueta. **17 Funciones alrededor**: dos columnas. Todos con capturas reales y, detrás, solo el resplandor (sin trama). Se dibujan en `componentes/scripts/elementos-vistas.mjs`.
- **18 Insignia sobre foto**: píldora oscura. **19 Número de paso**: número grande rosa. **20 Sello «Aprobada»**: etiqueta en rosa sólido. **21 Selector de plan**: escalera de nivel (Lite ⅓, Basic ⅔, Pro completo). **22 Incluido / no incluido**: tabla de los tres planes (filas provisionales hasta definir los planes).
- **23 Íconos ilustrados**: trazo con punto rosa. **24 Encabezado**: etiqueta rosa y título (34 / 10,5 / 16 px en A4). **25 Pie**: número grande en rosa, pegado abajo. **26 Tarjeta «cómo funciona»**: alternadas. **28 Hablemos**: tarjeta rosa con botón y QR.
- **05 Barras comparativas**: columnas con una rosa («Este funciona»). **06 Reparto de ideas**: barra repartida. **07 Calificación**: medio arco con los competidores como puntos. **08 Frente al promedio**: lista con flechas ▲▼. **09 Piezas por plan**: barras que crecen (imágenes y reels). **10 Tiempo**: dos cifras frente a frente. **11 La brecha**: lista «¿se ve lo bueno?». **12 Cadena de una pieza**: cuatro íconos con flechas. **31 Cifras**: cuadrícula 2 × 2 con íconos. Todos en página negra y blanca, solo para los PDF.
- **27 Línea de proceso**: tu primera semana (7 casillas, día 7 en rosa, «desde ahí, cada mes»). **29 Fotos**: esquinas redondeadas + la guía «se ve real / se nota IA» (sin neón puesto en la escena).
- **30 Plantillas de redes**: arriba blanco con la esfera clara, abajo el bloque negro recto con el título (post, carrusel e historia).

Todos los elementos están aprobados (9 oct). Siguiente: armar los documentos página por página.
