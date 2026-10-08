"""Genera comun/qr-whatsapp.svg: el QR que abre WhatsApp con un mensaje listo, con el logo al centro.
Uso: python3 pdf/comun/qr.py   (necesita: pip install segno; usa el dibujo de la "p." de logo-qr.svg)"""
import os, re, urllib.parse
import segno

MENSAJE = '¡Hola Pixely! 👋 Quiero que mi negocio destaque ✨'
URL = 'https://wa.me/51949268607?text=' + urllib.parse.quote(MENSAJE, safe='')
AQUI = os.path.dirname(os.path.abspath(__file__))
SALIDA = os.path.join(AQUI, 'qr-whatsapp.svg')

# Corrección "H" (aguanta ~30 % tapado), para que el logo del centro no estorbe al leerlo
qr = segno.make(URL, error='h', micro=False)
borde = 4
n = qr.symbol_size(border=0)[0]
lado = n + 2 * borde
filas = []
for y, fila in enumerate(qr.matrix):
    x = 0
    while x < n:
        if fila[x]:
            ini = x
            while x < n and fila[x]: x += 1
            filas.append(f'M{ini + borde} {y + borde}h{x - ini}v1h-{x - ini}z')
        else:
            x += 1

# Logo: el cuadrado negro con la "p." de Pixely, centrado, de 1/6 del ancho (probado: así se lee igual que sin logo)
t = lado * 0.165
x0 = (lado - t) / 2
k = t / 12.3  # el dibujo de la "p." se hizo para un cuadrado de 12,3
viejo = open(os.path.join(AQUI, 'logo-qr.svg')).read()
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {lado} {lado}" width="{lado * 10}" height="{lado * 10}" shape-rendering="crispEdges">'
       f'<rect width="{lado}" height="{lado}" fill="#fff"/><path d="{"".join(filas)}" fill="#0A0A0C"/>'
       f'<rect x="{x0:.3f}" y="{x0:.3f}" width="{t:.3f}" height="{t:.3f}" rx="{3.12 * k:.3f}" fill="#0A0A0C"/>'
       f'<g transform="translate({x0 + 1.7211238 * k:.4f} {x0 + 7.7752973 * k:.4f}) scale({0.0076412688 * k:.7f} {-0.0076412688 * k:.7f})" shape-rendering="geometricPrecision">{viejo}</g></svg>')
open(SALIDA, 'w').write(svg)
# El mismo QR en el paquete de QR (public/piezas/qr): con fondo blanco y transparente
PACK = os.path.join(AQUI, '..', '..', 'public', 'piezas', 'qr')
open(os.path.join(PACK, 'qr-whatsapp.svg'), 'w').write(svg)
open(os.path.join(PACK, 'qr-whatsapp-transparente.svg'), 'w').write(svg.replace(f'<rect width="{lado}" height="{lado}" fill="#fff"/>', ''))
print(f'QR versión {qr.version} ({n}×{n} módulos) · {URL}')
