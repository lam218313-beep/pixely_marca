"""Herramientas de dibujo: skia (vectores), lector de trazos SVG, textos con interletrado y curvas de movimiento."""
import math
import re
import skia

F = '/home/user/pixely_marca/public/kit-redes/fuentes/'
TF = {k: skia.Typeface.MakeFromFile(F + v) for k, v in {
    'unb': 'Unbounded-Bold.ttf', 'unbx': 'Unbounded-ExtraBold.ttf',
    'man': 'Manrope-SemiBold.ttf', 'manb': 'Manrope-Bold.ttf', 'manx': 'Manrope-ExtraBold.ttf', 'manm': 'Manrope-Medium.ttf'}.items()}

# Colores de tokens.json y de comun/base.css
INK, CARBON, CARBON2, LINE, ANILLO = (10, 10, 12), (22, 22, 27), (31, 31, 38), (38, 38, 46), (52, 52, 60)
GRIS, T3, MUTE, PINK, PINKL, WHITE = (180, 180, 190), (138, 138, 150), (74, 74, 85), (235, 12, 110), (255, 122, 176), (255, 255, 255)


def col(c, a=1.0):
    return skia.Color(int(c[0]), int(c[1]), int(c[2]), int(max(0, min(1, a)) * 255))


def paint(c, a=1.0, stroke=None, cap=skia.Paint.kRound_Cap):
    p = skia.Paint(AntiAlias=True, Color=col(c, a))
    if stroke:
        p.setStyle(skia.Paint.kStroke_Style)
        p.setStrokeWidth(stroke)
        p.setStrokeCap(cap)
        p.setStrokeJoin(skia.Paint.kRound_Join)
    return p


# ---------- curvas ----------
def clamp(x, a=0.0, b=1.0):
    return a if x < a else b if x > b else x


def prog(t, t0, dur):
    return clamp((t - t0) / dur) if dur > 0 else float(t >= t0)


def out_expo(x):
    return 1.0 if x >= 1 else 1 - 2 ** (-10 * x)


def in_expo(x):
    return 0.0 if x <= 0 else 2 ** (10 * x - 10)


def out_cubic(x):
    return 1 - (1 - x) ** 3


def in_cubic(x):
    return x ** 3


def inout_cubic(x):
    return 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2


def out_back(x, s=1.70158):
    x -= 1
    return 1 + (s + 1) * x ** 3 + s * x ** 2


def spring(x, zeta=0.42, w=17.0):
    """Resorte amortiguado normalizado en segundos (x = tiempo desde el disparo)."""
    if x <= 0:
        return 0.0
    wd = w * math.sqrt(1 - zeta ** 2)
    return 1 - math.exp(-zeta * w * x) * (math.cos(wd * x) + zeta * w / wd * math.sin(wd * x))


def lerp(a, b, x):
    return a + (b - a) * x


def decay(t, t0, tau):
    """Pulso que sube de golpe en t0 y cae exponencial (para golpes de cámara y destellos)."""
    return math.exp(-(t - t0) / tau) if t >= t0 else 0.0


# ---------- texto ----------
_fonts = {}


def font(k, size):
    key = (k, round(size * 4))
    if key not in _fonts:
        f = skia.Font(TF[k], size)
        f.setSubpixel(True)
        f.setEdging(skia.Font.Edging.kAntiAlias)
        f.setHinting(skia.FontHinting.kNone)
        _fonts[key] = f
    return _fonts[key]


def text_width(s, k, size, track=0.0):
    f = font(k, size)
    g = f.textToGlyphs(s)
    return sum(f.getWidths(g)) + track * size * (len(g) - 1)


def draw_text(c, s, x, y, k, size, color, a=1.0, track=-0.02, align='left'):
    """Texto en una línea con interletrado (track en em). Devuelve el ancho."""
    f = font(k, size)
    g = f.textToGlyphs(s)
    ws = f.getWidths(g)
    xs, cx = [], 0.0
    for w in ws:
        xs.append(cx)
        cx += w + track * size
    width = cx - track * size
    ox = x - (width if align == 'right' else width / 2 if align == 'center' else 0)
    blob = skia.TextBlob.MakeFromPosTextH(s, [ox + v for v in xs], y, f)
    if blob:
        c.drawTextBlob(blob, 0, 0, paint(color, a))
    return width


def glyph_xs(s, k, size, track=-0.02):
    f = font(k, size)
    ws = f.getWidths(f.textToGlyphs(s))
    xs, cx = [], 0.0
    for w in ws:
        xs.append((cx, w))
        cx += w + track * size
    return xs


# ---------- trazos SVG (M L H V C S Q T A Z, absolutos y relativos) ----------
_num = re.compile(r'[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?')
_tok = re.compile(r'([MmLlHhVvCcSsQqTtAaZz])|([-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?)')


def svg_path(d):
    p = skia.Path()
    toks = [(m.group(1), m.group(2)) for m in _tok.finditer(d)]
    i, cmd = 0, None
    x = y = sx = sy = 0.0
    lc = None  # último punto de control (para S/T)

    def nums(n):
        nonlocal i
        out = [float(toks[i + k][1]) for k in range(n)]
        i += n
        return out
    while i < len(toks):
        if toks[i][0]:
            cmd = toks[i][0]
            i += 1
            if cmd in 'Zz':
                p.close()
                x, y = sx, sy
                lc = None
                continue
        rel = cmd.islower()
        C = cmd.upper()
        if C == 'M':
            nx, ny = nums(2)
            if rel:
                nx += x; ny += y
            p.moveTo(nx, ny)
            x, y, sx, sy = nx, ny, nx, ny
            cmd = 'l' if rel else 'L'
            lc = None
        elif C == 'L':
            nx, ny = nums(2)
            if rel:
                nx += x; ny += y
            p.lineTo(nx, ny); x, y = nx, ny; lc = None
        elif C == 'H':
            (nx,) = nums(1)
            x = nx + x if rel else nx
            p.lineTo(x, y); lc = None
        elif C == 'V':
            (ny,) = nums(1)
            y = ny + y if rel else ny
            p.lineTo(x, y); lc = None
        elif C == 'C':
            a = nums(6)
            if rel:
                a = [a[0] + x, a[1] + y, a[2] + x, a[3] + y, a[4] + x, a[5] + y]
            p.cubicTo(*a); lc = (a[2], a[3]); x, y = a[4], a[5]
        elif C == 'S':
            a = nums(4)
            if rel:
                a = [a[0] + x, a[1] + y, a[2] + x, a[3] + y]
            c1 = (2 * x - lc[0], 2 * y - lc[1]) if lc else (x, y)
            p.cubicTo(c1[0], c1[1], *a); lc = (a[0], a[1]); x, y = a[2], a[3]
        elif C == 'Q':
            a = nums(4)
            if rel:
                a = [a[0] + x, a[1] + y, a[2] + x, a[3] + y]
            p.quadTo(*a); lc = (a[0], a[1]); x, y = a[2], a[3]
        elif C == 'T':
            a = nums(2)
            if rel:
                a = [a[0] + x, a[1] + y]
            c1 = (2 * x - lc[0], 2 * y - lc[1]) if lc else (x, y)
            p.quadTo(c1[0], c1[1], *a); lc = c1; x, y = a
        elif C == 'A':
            rx, ry, rot, large, sweep, nx, ny = nums(7)
            if rel:
                nx += x; ny += y
            p.arcTo(rx, ry, rot, skia.Path.ArcSize.kLarge_ArcSize if large else skia.Path.ArcSize.kSmall_ArcSize,
                    skia.PathDirection.kCW if sweep else skia.PathDirection.kCCW, nx, ny)
            x, y = nx, ny; lc = None
    return p


def svg_shapes(src):
    """Trazos de un ícono del set (path, rect y circle) como lista de skia.Path."""
    out = []
    for tag, attrs in re.findall(r'<(path|rect|circle)\s([^>]*)/?>', src):
        A = dict(re.findall(r'(\w+)="([^"]*)"', attrs))
        if tag == 'path':
            out.append(svg_path(A['d']))
        elif tag == 'rect':
            r = float(A.get('rx', 0))
            pp = skia.Path()
            pp.addRRect(skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(float(A['x']), float(A['y']), float(A['width']), float(A['height'])), r, r))
            out.append(pp)
        else:
            pp = skia.Path()
            pp.addCircle(float(A['cx']), float(A['cy']), float(A['r']))
            out.append(pp)
    return out


ICONOS = {
    'flag': '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
    'chart': '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
    'store': '<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9h18v1.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M5 13.5V21h14v-7.5M10 21v-5h4v5"/>',
    'image': '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    'check': '<path d="M20 6 9 17l-5-5"/>',
    'pencil': '<path d="M21.2 6.8a2.8 2.8 0 0 0-4-4L4 16v4h4z"/><path d="m14.5 5.5 4 4"/>',
    'play': '<path d="m6 3 14 9-14 9z"/>',
    'message': '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
}
ICON_PATHS = {k: svg_shapes(v) for k, v in ICONOS.items()}


def draw_icon(c, name, cx, cy, size, color, a=1.0, sw=1.9, fill=False):
    s = size / 24.0
    c.save()
    c.translate(cx - size / 2, cy - size / 2)
    c.scale(s, s)
    p = paint(color, a, stroke=None if fill else sw)
    for pp in ICON_PATHS[name]:
        c.drawPath(pp, p)
    c.restore()


# ---------- logo oficial (pixely_marca/public/kit-redes/logos/pixely-sobre-negro.svg) ----------
_logo_src = open('/home/user/pixely_marca/public/kit-redes/logos/pixely-sobre-negro.svg').read()
LOGO = [(svg_path(d), f) for d, f in re.findall(r'<path d="([^"]*)" fill="([^"]*)"/>', _logo_src)]
LOGO_VB = (0, -760, 4028, 1000)


def trim_path(path, t0, t1):
    """Parte de un trazo entre las fracciones t0 y t1 de su largo (para dibujar líneas que avanzan)."""
    if t1 <= t0:
        return None
    meas = skia.PathMeasure(path, False)
    total, segs = 0.0, []
    while True:
        segs.append(meas.getLength())
        total += segs[-1]
        if not meas.nextContour():
            break
    out = skia.Path()
    meas = skia.PathMeasure(path, False)
    acc = 0.0
    for L in segs:
        a, z = t0 * total - acc, t1 * total - acc
        if z > 0 and a < L:
            meas.getSegment(max(0, a), min(L, z), out, True)
        acc += L
        meas.nextContour()
    return out
