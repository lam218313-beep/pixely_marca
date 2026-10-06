"""Genera los logos de Pixely (SVG y PNG) desde la tipografía Unbounded 800.
Uso: python3 scripts/logos.py  ->  public/logos/*"""
import json, io, os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import cairosvg

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tok = json.load(open(f'{ROOT}/tokens/tokens.json'))
C = tok['color']
f = TTFont(f'{ROOT}/public/fonts/unbounded-latin-wght-normal.woff2')
f = instantiateVariableFont(f, {'wght': 800})
gs, cmap, upm = f.getGlyphSet(), f.getBestCmap(), f['head'].unitsPerEm
TRACK = -0.01 * upm  # letter-spacing -0.01em, igual que la web

def build(text='pixely.'):
    x, parts = 0, []
    for i, ch in enumerate(text):
        g = gs[cmap[ord(ch)]]
        pen = SVGPathPen(gs)
        tp = TransformPen(pen, (1, 0, 0, -1, x, 0))
        g.draw(tp)
        parts.append((ch, pen.getCommands()))
        x += g.width + TRACK
    return parts, x - TRACK

parts, width = build()
asc = 760  # alto aprox. de la 'l' y 'i' en unidades de fuente
desc = 240  # descendente de 'p' e 'y'
VB = f'0 {-asc} {width:.0f} {asc+desc}'

def svg(letters, dot, bg=None, pad=0, w=None):
    vbx = f'{-pad} {-asc-pad} {width+2*pad:.0f} {asc+desc+2*pad}'
    body = ''.join(f'<path d="{d}" fill="{dot if ch=="." else letters}"/>' for ch, d in parts)
    rect = f'<rect x="{-pad}" y="{-asc-pad}" width="{width+2*pad:.0f}" height="{asc+desc+2*pad}" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vbx}">{rect}{body}</svg>'

variants = {
    'pixely-sobre-negro':  dict(letters=C['blanco'], dot=C['rosa']),
    'pixely-sobre-blanco': dict(letters=C['tinta'],  dot=C['rosa']),
    'pixely-sobre-rosa':   dict(letters=C['blanco'], dot=C['tinta'], bg=C['rosa'], pad=160),
    'pixely-negro':        dict(letters=C['tinta'],  dot=C['tinta']),
    'pixely-blanco':       dict(letters=C['blanco'], dot=C['blanco']),
}
out = f'{ROOT}/public/logos'
for name, kw in variants.items():
    s = svg(**kw)
    open(f'{out}/{name}.svg', 'w').write(s)
    cairosvg.svg2png(bytestring=s.encode(), write_to=f'{out}/{name}.png', output_width=2000)

# La "p." sola (marca de redes): p + punto de la misma tipografía, centrada en un cuadrado
pp, pd = parts[0][1], parts[-1][1]
adv_p = gs[cmap[ord('p')]].width + TRACK
xs = [0, adv_p + 0]  # el punto empieza justo después de la p
def pmark(bg, pfill, dotfill, size=1024):
    # caja de la p. : ancho = p + punto; alto de -asc..desc recortado a x-height..descendente
    pen = SVGPathPen(gs); gs[cmap[ord('.')]].draw(TransformPen(pen, (1, 0, 0, -1, adv_p, 0)))
    pw = adv_p + gs[cmap[ord('.')]].width
    ph = 700 + 240   # de la altura de x aprox. al descendente
    sc = size * 0.50 / pw
    tx = (size - pw*sc)/2
    ty = size/2 + (700-240)/2*sc*0.0 + 150*sc
    ty = size/2 + (700 - 470)*sc*0.5
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}"><rect width="{size}" height="{size}" fill="{bg}"/>'
            f'<g transform="translate({tx:.1f} {ty:.1f}) scale({sc:.4f})"><path d="{pp}" fill="{pfill}"/><path d="{pen.getCommands()}" fill="{dotfill}"/></g></svg>')

for name, args in {'p-sobre-rosa': (C['rosa'], C['blanco'], C['tinta']), 'p-sobre-negro': (C['tinta'], C['blanco'], C['rosa'])}.items():
    s_ = pmark(*args)
    open(f'{out}/{name}.svg', 'w').write(s_)
    cairosvg.svg2png(bytestring=s_.encode(), write_to=f'{out}/{name}.png', output_width=1024)
print('logos ok', width)
