"""Fondos de anillos y punto rosa (el motivo del login). Uso: python3 scripts/fondos.py"""
import json, os, cairosvg
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C = json.load(open(f'{ROOT}/tokens/tokens.json'))['color']
out = f'{ROOT}/public/fondos'

def fondo(W, H, bg, ring, dot, dotx, doty, name, op='.2'):
    base = min(W, H)
    radii = [base * k for k in (0.16, 0.30, 0.46, 0.64, 0.84, 1.08)]
    cx, cy = W * dotx, H * doty
    rings = ''.join(f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{r:.0f}" fill="none" stroke="{ring}" stroke-width="2"/>' for r in radii)
    r = base * 0.035
    s = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
         f'<defs><clipPath id="c"><rect width="{W}" height="{H}"/></clipPath></defs><rect width="{W}" height="{H}" fill="{bg}"/>'
         f'<g clip-path="url(#c)">{rings}<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{r*2.6:.0f}" fill="{dot}" fill-opacity="{op}"/>'
         f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{r:.0f}" fill="{dot}"/></g></svg>')
    open(f'{out}/{name}.svg', 'w').write(s)
    cairosvg.svg2png(bytestring=s.encode(), write_to=f'{out}/{name}.png')

for fmt, (W, H) in {'horizontal-1920x1080': (1920, 1080), 'historia-1080x1920': (1080, 1920), 'cuadrado-1080': (1080, 1080)}.items():
    fondo(W, H, C['tinta'], C['anillo'], C['rosa'], .72, .42, f'fondo-negro-{fmt}')
    fondo(W, H, C['rosa'], 'rgba(255,255,255,.35)', C['tinta'], .72, .42, f'fondo-rosa-{fmt}', op='.18')
print('fondos ok')
