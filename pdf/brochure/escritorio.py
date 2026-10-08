"""img/escritorio.jpg: la laptop de pixely.pe (escena de Magnific con pantalla verde) con la pantalla
de Mercado de Partners en computadora (marca de ejemplo Casa Norte).
Uso: python3 pdf/brochure/escritorio.py   (busca ../pixely_web y ../pixely junto a este repo)"""
import os
import numpy as np
from PIL import Image, ImageFilter

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
ESCENA = os.environ.get('ESCENA', f'{RAIZ}/pixely_web/media-src/escenas/escena-laptop.webp')
CAPTURA = os.environ.get('CAPTURA', f'{RAIZ}/pixely/frontend/layout/e2e-vitrina/d-mercado.png')
SALIDA = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img', 'escritorio.jpg')

im = Image.open(ESCENA).convert('RGB')
a = np.asarray(im).astype(np.float32)
R, G, B = a[..., 0], a[..., 1], a[..., 2]
verde = G - np.maximum(R, B)
alfa = np.clip((verde - 40) / 70, 0, 1)
duro = verde > 80
# La pantalla: filas y columnas casi enteras de verde (descarta reflejos sueltos en el teclado)
filas = np.nonzero(duro.sum(1) > duro.shape[1] * 0.15)[0]
cols = np.nonzero(duro.sum(0) > duro.shape[0] * 0.15)[0]
x0, y0, x1, y1 = cols.min(), filas.min(), cols.max(), filas.max()
fuera = np.ones_like(alfa, bool); fuera[y0 - 2:y1 + 3, x0 - 2:x1 + 3] = False
alfa[fuera] = 0
alfa[y0 + 3:y1 - 2, x0 + 3:x1 - 2] = np.maximum(alfa[y0 + 3:y1 - 2, x0 + 3:x1 - 2], duro[y0 + 3:y1 - 2, x0 + 3:x1 - 2])
# El brillo verde que cae en el marco y la mesa se vuelve neutro
a[..., 1] = np.where(verde > 0, np.maximum(R, B) + np.clip(verde, 0, None) * 0.15, G)
limpia = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
mascara = Image.fromarray((alfa * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))

# La captura llena el alto de la pantalla y se recorta por la derecha (el menú lateral queda completo)
sw, sh = x1 - x0 + 1, y1 - y0 + 1
cap = Image.open(CAPTURA).convert('RGB')
cw = round(cap.width * sh / cap.height)
cap = cap.resize((cw, sh), Image.LANCZOS).crop((0, 0, sw, sh)) if cw >= sw else cap.resize((sw, round(cap.height * sw / cap.width)), Image.LANCZOS).crop((0, 0, sw, sh))
lleno = Image.new('RGB', im.size, (10, 10, 12)); lleno.paste(cap, (x0, y0))
foto = Image.composite(lleno, limpia, mascara)

# Encuadre del brochure: la laptop centrada, 2,07 : 1
cx, cy = (x0 + x1) / 2, (y0 + y1) / 2 + sh * 0.2
w = sw * 2.05; h = w / 2.07
foto.crop((round(cx - w / 2), round(cy - h / 2), round(cx + w / 2), round(cy + h / 2))).resize((1400, round(1400 / 2.07)), Image.LANCZOS).save(SALIDA, quality=90)
print('✓', SALIDA)
