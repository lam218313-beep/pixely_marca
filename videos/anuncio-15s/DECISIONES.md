# Anuncio Pixely · 15 s · Decisiones

**Entrega:** `public/piezas/videos/Pixely-Anuncio-15s.mp4` (1080 × 1920, 60 fps, H.264 + AAC, 15,0 s).
**Fuente:** esta carpeta (`videos/anuncio-15s`). Todo está hecho con código propio: nada de plantillas, *skills*, modelos de imagen, video o audio, ni muestras de sonido.

---

## 1. La idea

Pixely vende un proceso, no diseños sueltos. El titular de la web lo dice mejor que nada: *«Tu publicidad no sale de la ocurrencia de un diseñador. Sale de datos reales.»* El anuncio convierte esa frase en movimiento: **garabatos que se ordenan en datos**. A partir de ahí recorre el proceso en cuatro golpes y cierra en el logo.

| Tiempo | Plano | Lo que se ve | Texto en pantalla |
|---|---|---|---|
| 0,0–2,0 s | A | Garabatos de lapicero que tiemblan; cada palabra entra de golpe; tachón rosa | «Tu publicidad / no sale de una / ocurrencia.» |
| 2,0–4,0 s | A | Los garabatos se enderezan y se vuelven la grilla de un gráfico; ocho datos caen, uno por corchea, unidos por una línea rosa | «Sale de / datos reales.» |
| 4,0–6,0 s | B | Seis barras crecen, una por corchea; la más alta se vuelve rosa: «Este funciona» | «Estudiamos / tu mercado.» |
| 6,0–8,0 s | B | La barra rosa se encoge en un punto que recorre la cadena Objetivo → Estrategia → Dato de tu mercado → Tu pieza | «Armamos / tu estrategia.» |
| 8,0–10,0 s | C | Sube un celular con Pixely Partners (pantalla Validar); la pieza se arrastra; el botón de aprobar late con el redoble; respiro | «Tú apruebas / cada pieza.» |
| 10,0–12,0 s | C | Cae el sello «Aprobada» (caída de la música); las 12 piezas de una campaña aparecen, una por semicorchea, con el contador | «12 piezas en cada campaña.» |
| 12,0–15,0 s | D | Logo oficial letra por letra; el punto rosa cae, toca en el golpe y rebota | «pixely.» · «Publicidad estratégica» · «Escríbenos · pixely.pe» |

Las frases son verdaderas y salen de lo aprobado: el estudio de mercado, la estrategia, la aprobación de cada pieza en Partners y las campañas de 12 piezas.

---

## 2. Decisiones

### Un solo reloj para la música y la imagen
- **120 BPM a 60 fps:** un tiempo dura 0,5 s, que son exactamente **30 fotogramas**, y una corchea son 15. Así cada golpe cae en el inicio de un fotograma, sin redondeos.
- `cues.py` guarda el mapa de golpes (66 en total) y lo leen las dos partes: la música dispara un sonido en cada golpe y la imagen anima el elemento en el mismo instante. Lo que se ve, suena.
- Las apariciones (palabras, datos, barras, nodos, piezas, letras) empiezan en el fotograma del golpe. Las anticipaciones son intencionales y terminan exactamente en el golpe: la frase vieja se va justo antes de que entre la nueva, el sello cae 6 fotogramas y toca la tarjeta en el golpe, y el punto rosa cae y toca en el golpe.

### Marca
- **Colores:** negro tinta #0A0A0C de fondo, blanco y gris para el texto, y el rosa #EB0C6E solo como acento: el punto final de cada título, los datos clave, la barra que funciona, el sello y el punto del logo.
- **Tipografía:** Unbounded Bold y ExtraBold en los titulares, con interletrado de -0,02 em; Manrope en etiquetas, lema y llamado. Son los archivos oficiales del kit (`public/kit-redes/fuentes`).
- **Elementos aprobados del catálogo:** trama de puntadas (02) muy suave de fondo, resplandor rosa (03), barras que crecen (09, en versión gráfico), cadena de una pieza con íconos (12), celular vitrina (13), sello «Aprobada» (20), íconos del set (23) y título con punto rosa (24).
- **Logo oficial:** son los 7 trazos de `public/kit-redes/logos/pixely-sobre-negro.svg`, leídos con un lector de SVG escrito para este proyecto (`motor.py`). Cada letra entra por separado, y el punto rosa, que es un trazo propio, cae y rebota. Como el logo existía, no hubo que redibujar nada.
- **Reglas de la marca respetadas:**
  - No hay precios (el anuncio es una pieza de captación).
  - No se dice «IA».
  - No se prometen ventas: no se usa el eslogan «Publicidad que vende», y el lema es «Publicidad estratégica», el mismo de la web.
  - Los nombres son solo «Pixely» y «Pixely Partners», y la marca del ejemplo es la ficticia Casa Norte.

### Formato vertical
- **Zonas seguras:** el texto importante va entre 290 y 1 350 px de alto, lejos de las zonas que tapan los botones de Reels y TikTok (arriba y abajo).
- **Tamaño de los titulares:** van de 88 a 120 px de alto. Medí cada frase en Unbounded antes de diseñar, para que todas quepan en los 896 px útiles de ancho sin achicarlas.

### Movimiento
- **Curvas:** salidas exponenciales para los golpes de texto, resortes amortiguados para lo que aparece (datos, piezas, letras) y aceleración para los látigos y el acercamiento.
- **Cámara viva:** un pulso de escala de 0,9 % en cada bombo, pulsos mayores en los golpes grandes y temblor amortiguado en el sello, el impacto del logo y el toque del punto.
- **Transiciones:**
  - **4 s:** látigo lateral.
  - **8 s:** acercamiento al nodo «Tu pieza» hasta llenar la pantalla de rosa, y corte seco a negro con el celular que sube.
  - **10,4 s:** empuje lateral, dentro del mismo plano.
  - **12 s:** corte seco al logo, con estallido rosa.

### Desenfoque de movimiento real
- **Cómo se hace:** cada fotograma es el promedio de 12 submuestras, o 32 en los tramos rápidos. Son renders completos de la escena en instantes distintos dentro del obturador, que es de 180°: de t a t + 1/120 s. Se promedian en coma flotante y después se pasan a 8 bits con un grano fino que evita bandas en los degradados.
- **Sin mezclar fotogramas en los cortes:** los cortes caen en el inicio exacto de un fotograma (4, 8 y 12 s, que son los fotogramas 240, 480 y 720) y el obturador se abre en ese instante. Además, cada submuestra se limita al plano dueño del fotograma. Ninguna submuestra cruza un corte y no hay fundidos.

### Música, compuesta y sintetizada desde cero (`musica.py`)
- **Progresión en La menor:** Am | Am7 | Fmaj7 | Cadd9 | G (subida) | Am(add9) (caída) | F(add9) → Cmaj9 en el logo, que resuelve hacia el mayor.
- **Instrumentos,** todos generados con numpy:
  - Percusión: bombo (seno con caída de tono, armónico y chasquido), palmas (tres ráfagas de ruido filtrado), hats, redoble y platillos.
  - Notas: bajo (sierra saturada con filtro que se abre), pad (sierras desafinadas en estéreo), plucks FM, campanas FM, blips y un acorde corto en la caída.
  - Efectos: subida de ruido con filtro de barrido, platillo al revés, *whooshes* con filtro de barrido y paneo, sub-impacto, tachón de marcador y tics de lápiz.
- **Melodía que sigue a la imagen:**
  - Cada dato suena con una nota del arpegio, y las barras suben de nota mientras crecen.
  - Cada nodo es un acorde que trepa, cada una de las 12 piezas un blip en escala pentatónica ascendente, y cada letra del logo una nota del acorde final.
  - El punto rosa suena con una campana al tocar y otra más suave al rebotar.
- **Mezcla:** reverb por convolución (respuesta al impulso sintética), *ducking* del bajo y el pad con cada bombo, compresión de bus y limitador con 3 ms de anticipación.
- **Volumen:** -14 LUFS, el estándar de las redes, con picos reales por debajo de -1 dBTP.

### Herramientas
- **Python + numpy** para la música, la acumulación de submuestras y el grano.
- **skia** para dibujar los vectores, con las fuentes TTF oficiales.
- **ffmpeg** solo para codificar: H.264 High 4.2, CRF 15, yuv420p, color BT.709, AAC de 256 kbps y `faststart`. Es el binario que ya trae el repositorio de videos.

---

## 3. Lo que descarté

- **Remotion,** que es como se hizo el reel del manual: lo descarté para cumplir «solo código, sin herramientas existentes» y para controlar el obturador submuestra por submuestra.
- **Dibujar con Chromium (canvas):** es más lento y no deja promediar en coma flotante, lo que deja bandas en el desenfoque.
- **128 BPM:** un tiempo duraría 28,125 fotogramas y los golpes quedarían entre fotogramas.
- **El eslogan «Publicidad que vende»:** las reglas de la marca prohíben prometer ventas.
- **Mostrar precios:** prohibido en piezas de captación.
- **Fotos de la marca:** el encargo pedía solo código; todo está dibujado con vectores, incluida la pieza de ejemplo.
- **Fundidos entre planos:** el encargo pide cortes limpios.
- **Garabatos en ondas:** parecían montañas o un sismógrafo. Los cambié por rulos de lapicero, que se leen como «ocurrencias».
- **Primera mezcla con graves dominantes** (entre 10 y 15 dB por encima de los medios): en el parlante del celular habría sonado vacía.
- **Un «0» en el contador antes de la primera pieza:** confundía.
- **El celular chico** (500 px de ancho): dejaba la mitad de abajo vacía. Pasó a 580 px.

---

## 4. Iteraciones

1. **Motor y mapa de golpes:** lector de SVG propio, textos con interletrado y prueba de velocidad de skia (unos 30 ms por submuestra).
2. **Música v1:** sin poder oírla, la revisé con espectrograma y energía por bandas. Los graves bajo 80 Hz dominaban por 10-15 dB.
3. **Música v2:** bombo con armónico de 100-250 Hz y chasquido, bajo saturado, estante de -5 dB bajo 75 Hz, más palmas, plucks y hats, y un golpe de medios en cada palabra del gancho. Quedó con los medios a la par de los graves.
4. **Música v3:** acorde brillante en la caída del sello y golpes de palabra más presentes. Quedó a -13,9 LUFS.
5. **Escenas, prueba 1:** al cambiar de frase, la vieja se cruzaba con la nueva; ahora sale justo antes del golpe y la nueva entra en limpio. Los garabatos pasaron de ondas a rulos.
6. **Escenas, prueba 2:** «Este funciona» tapaba la etiqueta del gráfico (la subí) y las etiquetas de los nodos eran chicas (pasaron de 28 a 32 px).
7. **Escenas, prueba 3:** saqué el «0» del contador, agrandé el celular, suavicé el destello del sello (del 42 % al 30 %) y agrandé el lema y el llamado (de 46 a 54 px y de 38 a 44 px).
8. **Render v1:** falló porque el ffmpeg disponible no lee video crudo. Los fotogramas pasaron a viajar como PNG sin pérdida.
9. **Render v1 completo y revisión:**
   - El látigo de los 4 s dejaba dos fotogramas casi negros: acorté los recorridos para que se vea movimiento a ambos lados del corte.
   - El impacto de los 12 s era débil en imagen: le sumé un estallido rosa.
   - Algunas apariciones tardaban 3-4 fotogramas en llegar a su tamaño: las aceleré.
   - Las etiquetas de color BT.709 no quedaban marcadas en el archivo: las corregí.
10. **Render v2 y revisión final** (sección 5).

---

## 5. Revisión del MP4 final

{REVISION}

---

## 6. Tiempo total

{TIEMPO}

---

## 7. Cómo regenerarlo

```sh
cd videos/anuncio-15s
# skia necesita libEGL: se usa la de Chromium que trae Playwright
mkdir -p lib && cp /opt/pw-browsers/chromium-1194/chrome-linux/libEGL.so lib/libEGL.so.1
export LD_LIBRARY_PATH=$PWD/lib
pip install skia-python numpy pillow opencv-python-headless
python3 musica.py 0.9           # musica.wav (el número es la ganancia para llegar a -14 LUFS)
python3 render.py video anuncio.mp4
python3 revisar.py anuncio.mp4  # especificaciones, sincronía, volumen, cortes y hoja de contactos en revision/
```
