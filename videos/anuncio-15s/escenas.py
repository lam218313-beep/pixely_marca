"""Las cuatro escenas del anuncio, dibujadas con vectores (skia). draw(c, t) pinta el instante t en segundos.

A (0-4 s)  gancho: «Tu publicidad no sale de una ocurrencia.» garabatos que se ordenan en datos.
B (4-8 s)  «Estudiamos tu mercado.» barras que crecen -> «Armamos tu estrategia.» cadena de 4 pasos.
C (8-12 s) «Tú apruebas cada pieza.» celular con Partners, sello «Aprobada», 12 piezas por campaña.
D (12-15 s) logo oficial letra por letra, punto rosa que cae y rebota, lema y llamado.
"""
import math
import numpy as np
import skia
from motor import (INK, CARBON, CARBON2, LINE, ANILLO, GRIS, T3, MUTE, PINK, PINKL, WHITE, col, paint, clamp, prog,
                   out_expo, in_expo, out_cubic, in_cubic, inout_cubic, out_back, spring, lerp, decay,
                   draw_text, text_width, glyph_xs, font, draw_icon, LOGO, trim_path)
from cues import GOLPES as G, W, H, plano, b

X0 = 92                       # margen
CW = W - 2 * X0               # 896 px útiles
TRACK = -0.02


# ---------------- utilidades de escena ----------------
def slam_state(t, te, dur=0.24, s0=1.32, dy=28):
    """Entrada de golpe: aparece en te (fotograma exacto del golpe), grande y se asienta."""
    k = t - te
    if k < 0:
        return None
    e = out_expo(clamp(k / dur))
    return dict(a=clamp(k / 0.03), s=lerp(s0, 1.0, e), dy=lerp(dy, 0, e))


def text_slam(c, s, x, y, k, size, color, t, te, track=TRACK, dot_pink=False, extra_a=1.0):
    st = slam_state(t, te)
    if not st:
        return
    w = text_width(s, k, size, track)
    cx, cy = x + w / 2, y - size * 0.36
    c.save()
    c.translate(cx, cy + st['dy'])
    c.scale(st['s'], st['s'])
    c.translate(-cx, -cy)
    a = st['a'] * extra_a
    if dot_pink and s.endswith('.'):
        draw_text(c, s[:-1], x, y, k, size, color, a, track)
        draw_text(c, '.', x + text_width(s[:-1], k, size, track) + track * size, y, k, size, PINK, a, track)
    else:
        draw_text(c, s, x, y, k, size, color, a, track)
    c.restore()


def exit_up(t, t_end, dur=0.09, dist=200):
    """Salida hacia arriba que termina justo en t_end (el golpe de la frase nueva): la nueva entra en limpio."""
    e = in_cubic(clamp((t - (t_end - dur)) / dur))
    return -dist * e, 1 - e


def rrect(c, x, y, w, h, r, p):
    c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(x, y, w, h), r, r), p)


def glow(c, cx, cy, r, color=PINK, a=0.35):
    sh = skia.GradientShader.MakeRadial((cx, cy), max(r, 1), [col(color, a), col(color, a * 0.35), col(color, 0)], [0, 0.45, 1])
    p = skia.Paint(AntiAlias=True)
    p.setShader(sh)
    c.drawCircle(cx, cy, r, p)


_trama = None


def trama(c, a=1.0):
    """Elemento 02 · trama de puntadas, muy suave."""
    global _trama
    if _trama is None:
        s = skia.Surface(W, H)
        cc = s.getCanvas()
        cc.clear(skia.ColorTRANSPARENT)
        p = paint((255, 255, 255), 0.045)
        for yy in range(18, H, 36):
            for xx in range(18, W, 36):
                cc.drawCircle(xx, yy, 1.6, p)
        _trama = s.makeImageSnapshot()
    pp = skia.Paint(Alphaf=a)
    c.drawImage(_trama, 0, 0, skia.SamplingOptions(), pp)


# ---------------- cámara: pulso en cada bombo y temblor en los golpes grandes ----------------
KICK_BEATS = [b(n) for n in list(range(4, 18)) + list(range(20, 24))]
BIG = [(G['tu'], .035), (G['publicidad'], .02), (G['no_sale'], .02), (G['ocurrencia'], .02), (G['orden'], .03),
       (G['aprobada'], .05), (G['impacto'], .03), (G['punto'], .018)]
SHAKE = [(G['aprobada'], 20, 0.22), (G['impacto'], 9, 0.2), (G['punto'], 6, 0.16)]


def camera(c, t):
    s = 1.0 + sum(0.009 * decay(t, kb, 0.08) for kb in KICK_BEATS if kb <= t < kb + 0.5)
    s += sum(a * decay(t, tb, 0.09) for tb, a in BIG if tb <= t < tb + 0.6)
    dx = dy = 0.0
    for ts, amp, tau in SHAKE:
        if ts <= t < ts + 1.0:
            e = decay(t, ts, tau) * amp
            dx += e * math.sin((t - ts) * 93.0 + 1.3)
            dy += e * math.sin((t - ts) * 71.0 + 0.4)
    c.translate(W / 2 + dx, H / 2 + dy)
    c.scale(s, s)
    c.translate(-W / 2, -H / 2)


# ======================= A · gancho (0-4 s) =======================
rng = np.random.default_rng(11)
NSCR = 7
SCR = []
for i in range(NSCR):
    u = np.linspace(0, 1, 260)
    ph = rng.uniform(0, 6.28, 4)
    loops = rng.uniform(5, 9)                       # cuántos rulos da el lapicero
    rad = 38 + 34 * np.sin(u * 6.28 * rng.uniform(0.6, 1.6) + ph[0]) ** 2
    x = -80 + u * 1240 + rad * np.cos(u * 6.28 * loops + ph[1])
    y = (450 + i * 150 + 70 * np.sin(u * 6.28 * rng.uniform(0.5, 1.2) + ph[2])
         + rad * 0.8 * np.sin(u * 6.28 * loops + ph[1]))
    if i % 2:
        x = x[::-1]
        y = y[::-1]
    SCR.append((x, y, rng.uniform(4, 6.5), rng.uniform(0, 0.25)))
GRID_Y = [1110 + i * 72 for i in range(NSCR)]
PTS_V = [0.22, 0.4, 0.31, 0.52, 0.47, 0.66, 0.6, 0.86]
PTS = [(150 + i * (930 - 150) / 7, GRID_Y[-1] - v * (GRID_Y[-1] - GRID_Y[0]) * 0.95) for i, v in enumerate(PTS_V)]


def path_from(xs, ys):
    p = skia.Path()
    p.moveTo(float(xs[0]), float(ys[0]))
    for k in range(1, len(xs) - 1):
        mx, my = (xs[k] + xs[k + 1]) / 2, (ys[k] + ys[k + 1]) / 2
        p.quadTo(float(xs[k]), float(ys[k]), float(mx), float(my))
    p.lineTo(float(xs[-1]), float(ys[-1]))
    return p


def scene_A(c, t):
    m = inout_cubic(prog(t, G['orden'], 0.34))              # garabato -> orden
    step = math.floor((t - 0.125) / 0.25)                    # el garabato tiembla en cada tic (semicorchea a contratiempo)
    # garabatos (ocurrencias) que se vuelven líneas de una grilla de datos
    for i, (xs, ys, sw, st0) in enumerate(SCR):
        r = np.random.default_rng(1000 + i * 37 + step)
        jit = (1 - m) * 5.5
        jx = xs + r.normal(0, jit, len(xs))
        jy = ys + r.normal(0, jit, len(ys))
        lx = np.linspace(-40, W + 40, len(xs))
        ly = np.full(len(xs), GRID_Y[i], float)
        px = jx * (1 - m) + lx * m
        py = jy * (1 - m) + ly * m
        draw_p = prog(t, 0.04 + i * 0.2, 0.55)
        draw_p = out_cubic(draw_p)
        if draw_p <= 0:
            continue
        pth = path_from(px, py)
        part = trim_path(pth, 0, draw_p) if draw_p < 1 else pth
        ccol = tuple(lerp(a_, b_, m) for a_, b_ in zip(ANILLO, LINE))
        c.drawPath(part, paint(ccol, 0.95, stroke=lerp(sw, 2.5, m)))
    # datos: puntos que caen en la grilla, uno por corchea, unidos por la línea rosa
    if t >= G['orden']:
        pts_on = []
        for i, (px, py) in enumerate(PTS):
            te = G['puntos'][i]
            if t < te:
                break
            k = t - te
            r = 13 * spring(k, 0.45, 26) * (1.25 if i == 7 else 1)
            pts_on.append((px, py))
            if i > 0:
                x0, y0 = PTS[i - 1]
                e = out_cubic(clamp(k / 0.2))
                c.drawLine(x0, y0, lerp(x0, px, e), lerp(y0, py, e), paint(PINK, 1, stroke=6))
            ring = clamp(k / 0.4)
            if ring < 1:
                c.drawCircle(px, py, 14 + 46 * out_cubic(ring), paint(WHITE if i < 7 else PINK, 0.55 * (1 - ring), stroke=3))
        for i, (px, py) in enumerate(pts_on):
            k = t - G['puntos'][i]
            r = 13 * spring(k, 0.45, 26) * (1.3 if i == 7 else 1)
            c.drawCircle(px, py, max(r, 0), paint(PINK if i == 7 else WHITE))
            if i == 7:
                glow(c, px, py, 120, PINK, 0.35 * clamp(k / 0.2))
    # frase 1
    oy, oa = exit_up(t, G['orden'])
    if oa > 0:
        c.save()
        c.translate(0, oy)
        text_slam(c, 'Tu', X0, 760, 'unb', 100, WHITE, t, G['tu'], extra_a=oa)
        text_slam(c, 'publicidad', X0 + text_width('Tu ', 'unb', 100, TRACK), 760, 'unb', 100, WHITE, t, G['publicidad'], extra_a=oa)
        text_slam(c, 'no sale de una', X0, 885, 'unb', 100, WHITE, t, G['no_sale'], extra_a=oa)
        text_slam(c, 'ocurrencia.', X0, 1040, 'unb', 120, T3, t, G['ocurrencia'], dot_pink=True, extra_a=oa)
        # tachón rosa sobre «ocurrencia»
        k = t - G['tachon']
        if k >= 0:
            wv = text_width('ocurrencia', 'unb', 120, TRACK)
            pth = skia.Path()
            pth.moveTo(X0 - 14, 1004)
            pth.cubicTo(X0 + wv * 0.3, 990, X0 + wv * 0.65, 1012, X0 + wv + 16, 996)
            e = out_cubic(clamp(k / 0.16))
            c.drawPath(trim_path(pth, 0, max(e, 0.001)), paint(PINK, oa, stroke=13))
        c.restore()
    # frase 2
    text_slam(c, 'Sale de', X0, 640, 'unb', 104, WHITE, t, G['orden'])
    text_slam(c, 'datos reales.', X0, 762, 'unb', 104, PINK, t, G['datos'])


# ======================= B · mercado y estrategia (4-8 s) =======================
BARS_H = [0.42, 0.6, 0.33, 1.0, 0.5, 0.27]
BW, BGAP = 112, (CW - 6 * 112) / 5
BASE_Y, BMAX = 1520, 430
NODES = [(X0 + 62 + i * (CW - 124) / 3, 1300) for i in range(4)]
NODE_IC = ['flag', 'chart', 'store', 'image']
NODE_TXT = [['Objetivo'], ['Estrategia'], ['Dato de tu', 'mercado'], ['Tu pieza']]
ARR = G['nodos']                  # llegada del punto a cada nodo (= golpe)
TRAVEL = 0.15


def bar_rect(i):
    return X0 + i * (BW + BGAP), BASE_Y


def scene_B(c, t):
    trama(c, 0.9)
    collapse = in_cubic(prog(t, ARR[0] - 0.18, 0.18))       # 5,82 -> 6,0: las barras se van, la rosa se vuelve punto
    # etiqueta del gráfico
    la = 1 - collapse
    if la > 0:
        draw_text(c, 'PUBLICACIONES DE TU RUBRO', X0, 930, 'manb', 26, T3, la * clamp((t - 4.05) / 0.2), 0.16)
    for i, hf in enumerate(BARS_H):
        te = G['barras'][i]
        if t < te:
            continue
        k = t - te
        g = out_back(clamp(k / 0.34), 1.6)
        x, yb = bar_rect(i)
        h = BMAX * hf * max(g, 0)
        pink = i == 3 and t >= G['funciona']
        if i == 3 and collapse > 0:
            # la barra rosa se encoge hasta ser el punto que viaja al primer nodo
            nx, ny = NODES[0]
            cx0, cy0 = x + BW / 2, yb - h / 2
            w2 = lerp(BW, 34, collapse)
            h2 = lerp(h, 34, collapse)
            cx, cy = lerp(cx0, nx, collapse), lerp(cy0, ny, collapse)
            rrect(c, cx - w2 / 2, cy - h2 / 2, w2, h2, lerp(16, 17, collapse), paint(PINK))
            continue
        if i != 3 and collapse > 0:
            h *= 1 - collapse
            if h < 1:
                continue
        if pink:
            kk = t - G['funciona']
            glow(c, x + BW / 2, yb - h * 0.6, 260, PINK, 0.32 * clamp(kk / 0.15))
            cc = tuple(lerp(a_, b_, clamp(kk / 0.1)) for a_, b_ in zip((48, 48, 58), PINK))
            rrect(c, x, yb - h, BW, h + 16, 16, paint(cc))
        else:
            sh = skia.GradientShader.MakeLinear([(0, yb - h), (0, yb)], [col((52, 52, 62)), col((28, 28, 34))])
            p = skia.Paint(AntiAlias=True)
            p.setShader(sh)
            rrect(c, x, yb - h, BW, h + 16, 16, p)
    # base del gráfico (tapa las esquinas de abajo)
    if t >= G['barras'][0] and collapse < 1:
        c.drawRect(skia.Rect.MakeLTRB(X0 - 10, BASE_Y, X0 + CW + 10, BASE_Y + 24), paint(INK))
        c.drawLine(X0, BASE_Y, X0 + CW, BASE_Y, paint(LINE, 1 - collapse, stroke=3))
    # «Este funciona»
    k = t - G['funciona']
    if k >= 0 and collapse < 1:
        x, yb = bar_rect(3)
        s = spring(k, 0.45, 24)
        px, py = x + BW / 2, yb - BMAX - 64
        c.save()
        c.translate(px, py)
        c.scale(s, s)
        w = text_width('Este funciona', 'manx', 30, 0.0) + 44
        rrect(c, -w / 2, -26, w, 52, 26, paint(PINK, 1 - collapse))
        draw_text(c, 'Este funciona', 0, 11, 'manx', 30, WHITE, 1 - collapse, 0.0, 'center')
        c.restore()
    # cadena de la estrategia
    if t >= ARR[0] - 0.18:
        appear = out_cubic(prog(t, ARR[0] - 0.1, 0.25))
        for i, (nx, ny) in enumerate(NODES):
            lit = t >= ARR[i]
            kk = t - ARR[i]
            pop = 1 + 0.18 * decay(t, ARR[i], 0.07) if lit else 1.0
            r = 62 * pop
            if i > 0 and t >= ARR[i] - TRAVEL:
                x0, y0 = NODES[i - 1]
                e = in_cubic(clamp((t - (ARR[i] - TRAVEL)) / TRAVEL))
                c.drawLine(x0 + 62, y0, lerp(x0 + 62, nx - 62, e), ny, paint(PINK, 1, stroke=5))
            fill = PINK if (i == 3 and lit) else CARBON
            c.drawCircle(nx, ny, r, paint(fill, appear))
            c.drawCircle(nx, ny, r, paint(WHITE if lit else LINE, appear * (0.9 if lit else 1), stroke=3))
            draw_icon(c, NODE_IC[i], nx, ny, 50 * pop, WHITE if lit else MUTE, appear, 2.0)
            for j, ln in enumerate(NODE_TXT[i]):
                draw_text(c, ln, nx, ny + 116 + j * 40, 'manb', 32, PINK if i == 3 else (WHITE if lit else T3), appear, 0.0, 'center')
            if lit:
                ring = clamp(kk / 0.45)
                if ring < 1:
                    c.drawCircle(nx, ny, 62 + 70 * out_cubic(ring), paint(PINK, 0.6 * (1 - ring), stroke=4))
            if i == 3 and lit:
                glow(c, nx, ny, 240, PINK, 0.3 * clamp(kk / 0.2))
        # punto viajero
        for i in range(1, 4):
            a0, a1 = ARR[i] - TRAVEL, ARR[i]
            if a0 <= t < a1:
                e = in_cubic((t - a0) / TRAVEL)
                x0, y0 = NODES[i - 1]
                x1, y1 = NODES[i]
                c.drawCircle(lerp(x0, x1, e), lerp(y0, y1, e), 17, paint(PINK))
    # textos
    oy, oa = exit_up(t, G['armamos'])
    if oa > 0:
        c.save()
        c.translate(0, oy)
        text_slam(c, 'Estudiamos', X0, 640, 'unb', 110, WHITE, t, G['estudiamos'], extra_a=oa)
        text_slam(c, 'tu mercado.', X0, 772, 'unb', 110, WHITE, t, G['mercado'], dot_pink=True, extra_a=oa)
        c.restore()
    text_slam(c, 'Armamos', X0, 640, 'unb', 104, WHITE, t, G['armamos'])
    text_slam(c, 'tu estrategia.', X0, 766, 'unb', 104, WHITE, t, G['estrategia'], dot_pink=True)


# ======================= C · Partners, sello y 12 piezas (8-12 s) =======================
PH_W = 580
PH_H = PH_W * 839 / 412
PH_X = (W - PH_W) / 2
PH_Y = 630


def piece_art(c, x, y, w, h, variant=0, a=1.0):
    """Una pieza de ejemplo (marca ficticia Casa Norte), dibujada con formas."""
    c.save()
    c.clipRRect(skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(x, y, w, h), w * 0.06, w * 0.06), skia.ClipOp.kIntersect, True)
    sh = skia.GradientShader.MakeLinear([(x, y), (x, y + h)], [col((34, 30, 40), a), col((14, 14, 18), a)])
    p = skia.Paint(AntiAlias=True)
    p.setShader(sh)
    c.drawRect(skia.Rect.MakeXYWH(x, y, w, h), p)
    if variant == 0:
        glow(c, x + w * 0.62, y + h * 0.36, w * 0.75, PINK, 0.45 * a)
        c.drawCircle(x + w * 0.62, y + h * 0.36, w * 0.27, paint(PINK, a))
        # producto: caja con banda
        bx, by, bw, bh = x + w * 0.2, y + h * 0.3, w * 0.36, w * 0.44
        rrect(c, bx, by, bw, bh, w * 0.04, paint(WHITE, a))
        c.drawRect(skia.Rect.MakeXYWH(bx, by + bh * 0.62, bw, bh * 0.16), paint(PINK, a))
        draw_text(c, 'CASA NORTE', x + w * 0.08, y + h * 0.74, 'manb', w * 0.045, GRIS, a, 0.14)
        draw_text(c, 'Nueva', x + w * 0.08, y + h * 0.84, 'unb', w * 0.095, WHITE, a, -0.02)
        draw_text(c, 'colección', x + w * 0.08, y + h * 0.94, 'unb', w * 0.095, WHITE, a, -0.02)
    c.restore()


def phone(c, t, x, y, w):
    h = w * 839 / 412
    r = w * 0.158
    sh = skia.GradientShader.MakeLinear([(x, y), (x + w, y + h)], [col((58, 58, 68)), col((18, 18, 22)), col((38, 38, 46))], [0, 0.4, 1])
    p = skia.Paint(AntiAlias=True)
    p.setShader(sh)
    glow(c, x + w / 2, y + h * 0.45, w * 1.1, PINK, 0.16)
    rrect(c, x, y, w, h, r, p)
    rrect(c, x + 1.5, y + 1.5, w - 3, h - 3, r - 1.5, paint(WHITE, 0.12, stroke=2))
    sx, sy, sw, shh = x + w * 0.027, y + h * 0.0134, w * 0.946, h * 0.9732
    rrect(c, sx, sy, sw, shh, w * 0.138, paint(INK))
    c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(x + w * 0.36, y + h * 0.026, w * 0.28, h * 0.03), 99, 99), paint((0, 0, 0)))
    return sx, sy, sw, shh


def scene_C_phone(c, t):
    k_in = t - G['apruebas']
    rise = out_back(clamp(k_in / 0.42), 1.25)
    oy = (1 - rise) * 1350
    push = 0.03 * in_cubic(prog(t, G['respiro'], G['aprobada'] - G['respiro'])) * (1 if t < G['aprobada'] else 0)
    c.save()
    c.translate(W / 2, PH_Y + PH_H / 2)
    c.scale(1 + push, 1 + push)
    c.translate(-W / 2, -(PH_Y + PH_H / 2))
    c.translate(0, oy)
    sx, sy, sw, shh = phone(c, t, PH_X, PH_Y, PH_W)
    # interfaz de Validar
    draw_text(c, 'Validar', sx + 30, sy + 92, 'unb', 30, WHITE, 1, -0.02)
    pill_w = text_width('1 de 3', 'manb', 18, 0) + 28
    rrect(c, sx + sw - 30 - pill_w, sy + 66, pill_w, 34, 17, paint(CARBON2))
    draw_text(c, '1 de 3', sx + sw - 30 - pill_w / 2, sy + 89, 'manb', 18, GRIS, 1, 0, 'center')
    segw = (sw - 60 - 16) / 3
    for i in range(3):
        rrect(c, sx + 30 + i * (segw + 8), sy + 120, segw, 7, 4, paint(PINK if i == 0 else LINE))
    # tarjeta de la pieza (se arrastra a la derecha durante el redoble)
    cx, cy, cw, ch = sx + 24, sy + 150, sw - 48, (sw - 48) * 1.25
    drag = out_cubic(prog(t, G['redoble'][0], 0.75)) if t < G['aprobada'] else 1.0
    swipe = in_cubic(prog(t, G['push'], 0.16))
    c.save()
    c.translate(cx + cw / 2 + 18 * drag + 900 * swipe, cy + ch / 2)
    c.rotate(3.5 * drag + 14 * swipe)
    pk = t - G['cada_pieza']
    pop = 0.92 + 0.08 * spring(pk, 0.5, 22) if pk >= 0 else 0.92
    c.scale(pop, pop)
    c.translate(-(cx + cw / 2), -(cy + ch / 2))
    rrect(c, cx, cy, cw, ch, 28, paint(CARBON))
    if pk >= 0:
        piece_art(c, cx + 12, cy + 12, cw - 24, ch - 24, 0, clamp(pk / 0.08))
    else:
        rrect(c, cx + 12, cy + 12, cw - 24, ch - 24, 22, paint(CARBON2))
    ka = t - G['aprobada']
    if ka >= 0:
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(cx, cy, cw, ch), 28, 28), paint(PINK, 1, stroke=4))
    c.restore()
    # botones: cambios (lápiz) y aprobar (check)
    by = cy + ch + 78
    c.drawCircle(sx + sw * 0.3, by, 46, paint(CARBON2))
    draw_icon(c, 'pencil', sx + sw * 0.3, by, 40, GRIS, 1, 2.0)
    pulse = sum(0.16 * decay(t, h_, 0.07) for h_ in G['redoble'] if h_ <= t < h_ + 0.4)
    bx = sx + sw * 0.7
    for h_ in G['redoble']:
        kk = t - h_
        if 0 <= kk < 0.4:
            c.drawCircle(bx, by, 46 + 44 * out_cubic(kk / 0.4), paint(PINK, 0.5 * (1 - kk / 0.4), stroke=3))
    c.drawCircle(bx, by, 46 * (1 + pulse), paint(PINK))
    draw_icon(c, 'check', bx, by, 40 * (1 + pulse), WHITE, 1, 2.6)
    # sello «Aprobada» (elemento 20): cae desde arriba y toca la tarjeta justo en el golpe
    t_fall = 0.1
    kf = t - (G['aprobada'] - t_fall)
    if kf >= 0 and swipe < 1:
        if t < G['aprobada']:
            s = lerp(2.6, 1.0, in_cubic(kf / t_fall))
            sq = 1.0
        else:
            s = 1.0
            sq = 1 - 0.1 * decay(t, G['aprobada'], 0.05)
        px, py = cx + cw / 2 + 900 * swipe + 18, cy + ch * 0.46
        c.save()
        c.translate(px, py)
        c.rotate(-7 + 14 * swipe)
        c.scale(s / sq ** 0.5, s * sq)
        tw = text_width('Aprobada', 'unb', 40, -0.01)
        pw = tw + 70 + 56
        rrect(c, -pw / 2, -46, pw, 92, 46, paint(PINK))
        draw_icon(c, 'check', -pw / 2 + 52, 0, 40, WHITE, 1, 3.0)
        draw_text(c, 'Aprobada', -pw / 2 + 92, 15, 'unb', 40, WHITE, 1, -0.01)
        c.restore()
        if ka >= 0:
            ring = clamp(ka / 0.5)
            c.drawCircle(px, py, 60 + 900 * out_cubic(ring), paint(PINK, 0.55 * (1 - ring), stroke=6))
    c.restore()


TILES = [(X0 + (i % 4) * (206 + 24), 990 + (i // 4) * (206 + 24)) for i in range(12)]


def tile_art(c, i, x, y, s):
    """Las 12 piezas de una campaña: principal, anuncio, 4 historias, 5 variaciones y el reel."""
    rrect(c, x, y, s, s, 24, paint(CARBON))
    c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(x, y, s, s), 24, 24), paint(LINE, 1, stroke=2))
    m = s * 0.16
    if i == 0:      # principal
        c.drawCircle(x + s * 0.62, y + s * 0.4, s * 0.22, paint(PINK))
        rrect(c, x + m, y + s * 0.36, s * 0.3, s * 0.34, 8, paint(WHITE))
        rrect(c, x + m, y + s * 0.78, s * 0.5, s * 0.07, 4, paint(WHITE, 0.8))
    elif i == 1:    # anuncio
        rrect(c, x + m, y + m, s - 2 * m, s - 2 * m, 16, paint(PINK))
        draw_text(c, '-20%', x + s / 2, y + s * 0.58, 'unbx', s * 0.2, WHITE, 1, -0.02, 'center')
    elif 2 <= i <= 5:   # historias 9:16
        hw = s * 0.36
        hh = hw * 16 / 9
        hx, hy = x + (s - hw) / 2, y + (s - hh) / 2
        rrect(c, hx, hy, hw, hh, 10, paint(CARBON2))
        c.drawCircle(hx + hw / 2, hy + hh * (0.3 + 0.1 * (i % 2)), hw * 0.26, paint(PINK if i % 2 == 0 else WHITE))
        rrect(c, hx + hw * 0.15, hy + hh * 0.72, hw * 0.7, hh * 0.06, 3, paint(WHITE, 0.85))
    elif 6 <= i <= 10:  # variaciones
        v = i - 6
        bg = [PINK, CARBON2, WHITE, CARBON2, PINK][v]
        rrect(c, x + m * 0.7, y + m * 0.7, s - 1.4 * m, s - 1.4 * m, 16, paint(bg))
        fg = WHITE if bg != WHITE else INK
        bw_ = s * (0.3 + 0.05 * v)
        rrect(c, x + (s - bw_) / 2, y + s * 0.3, bw_, s * 0.4, 8, paint(fg))
        c.drawRect(skia.Rect.MakeXYWH(x + (s - bw_) / 2, y + s * 0.52, bw_, s * 0.07), paint(PINK if bg != PINK else INK))
    else:           # reel
        rrect(c, x + m * 0.7, y + m * 0.7, s - 1.4 * m, s - 1.4 * m, 16, paint(PINK))
        draw_icon(c, 'play', x + s / 2 + 4, y + s / 2, s * 0.36, WHITE, 1, fill=True)


def scene_C_doce(c, t):
    n = sum(1 for tf in G['fichas'] if t >= tf)
    k_last = t - G['fichas'][n - 1] if n else 1.0
    punch = 1 + 0.07 * decay(k_last, 0, 0.07) if n else 1.0
    if n:
        c.save()
        c.translate(X0, 640)
        c.scale(punch, punch)
        draw_text(c, str(n), 0, 0, 'unbx', 320, PINK, 1, -0.03)
        c.restore()
    for j, ln in enumerate(['piezas en', 'cada campaña.']):
        te = G['fichas'][0] + j * 0.0625
        k = t - te
        if k < 0:
            continue
        e = out_expo(clamp(k / 0.3))
        yb = 770 + j * 100
        c.save()
        c.clipRect(skia.Rect.MakeLTRB(0, yb - 96, W, yb + 26))
        c.translate(0, (1 - e) * 110)
        if ln.endswith('.'):
            wv = draw_text(c, ln[:-1], X0, yb, 'unb', 88, WHITE, 1, TRACK)
            draw_text(c, '.', X0 + wv + TRACK * 88, yb, 'unb', 88, PINK, 1, TRACK)
        else:
            draw_text(c, ln, X0, yb, 'unb', 88, WHITE, 1, TRACK)
        c.restore()
    for i, (x, y) in enumerate(TILES):
        tf = G['fichas'][i]
        k = t - tf
        if k < 0:
            continue
        s = out_back(clamp(k / 0.24), 2.2)
        rot = (6 if i % 2 else -6) * (1 - out_cubic(clamp(k / 0.3)))
        c.save()
        c.translate(x + 103, y + 103)
        c.rotate(rot)
        c.scale(max(s, 0.001), max(s, 0.001))
        c.translate(-(x + 103), -(y + 103))
        tile_art(c, i, x, y, 206)
        fl = 0.55 * decay(t, tf, 0.06)
        if fl > 0.01:
            rrect(c, x, y, 206, 206, 24, paint(WHITE, fl))
        c.restore()


def scene_C(c, t):
    trama(c, 0.9)
    out = in_cubic(prog(t, G['push'], 0.15))
    inn = out_expo(prog(t, G['push'], 0.24))
    if out < 1:
        c.save()
        c.translate(-1300 * out, 0)
        text_slam(c, 'Tú apruebas', X0, 410, 'unb', 104, WHITE, t, G['apruebas'])
        text_slam(c, 'cada pieza.', X0, 534, 'unb', 104, WHITE, t, G['cada_pieza'], dot_pink=True)
        scene_C_phone(c, t)
        c.restore()
        fl = 0.3 * decay(t, G['aprobada'], 0.06) if t >= G['aprobada'] else 0
        if fl > 0.005:
            c.drawRect(skia.Rect.MakeWH(W, H), paint(WHITE, fl))
    if t >= G['push']:
        c.save()
        c.translate(1300 * (1 - inn), 0)
        scene_C_doce(c, t)
        c.restore()


# ======================= D · logo (12-15 s) =======================
LG_W = 820
_lb = [p.getBounds() for p, _ in LOGO]
LG_L, LG_R = min(r.left() for r in _lb), max(r.right() for r in _lb)
LG_S = LG_W / (LG_R - LG_L)
LG_X = (W - LG_W) / 2 - LG_L * LG_S
LG_Y = 1000          # línea base del logo


def scene_D(c, t):
    k13 = t - 12.6
    glow(c, W + 80, H + 140, 1500, PINK, 0.30 * out_cubic(clamp(k13 / 0.9)))
    glow(c, -200, -200, 1000, PINK, 0.10 * out_cubic(clamp(k13 / 0.9)))
    push = 1 + 0.025 * inout_cubic(prog(t, 12.0, 3.0))
    c.save()
    c.translate(W / 2, LG_Y - 100)
    c.scale(push, push)
    c.translate(-W / 2, -(LG_Y - 100))
    for k, (pth, fill) in enumerate(LOGO):
        if k < 6:
            te = G['letras'][k]
            kk = t - te
            if kk < 0:
                continue
            s = spring(kk, 0.5, 24)
            dy = -260 * (1 - s)
            c.save()
            c.translate(LG_X, LG_Y + dy)
            c.scale(LG_S, LG_S)
            c.drawPath(pth, paint(WHITE, clamp(kk / 0.035)))
            c.restore()
        else:
            # punto rosa: cae, toca en el golpe (13,0), rebota y vuelve a tocar en 13,25
            t0, t1, t2 = G['letras'][-1], G['punto'], G['rebote']
            if t < t0:
                continue
            bb = pth.getBounds()
            fall = 1180.0
            if t < t1:
                u = (t - t0) / (t1 - t0)
                yoff = -fall * (1 - u * u)
            elif t < t2:
                u = (t - t1) / (t2 - t1)
                yoff = -72 * 4 * u * (1 - u)
            else:
                yoff = 0.0
            sq = 0.0
            for tc, a in ((t1, 0.32), (t2, 0.16)):
                if t >= tc:
                    sq += a * decay(t, tc, 0.045)
            stretch = 0.0
            if t < t1:
                stretch = 0.35 * ((t - t0) / (t1 - t0)) ** 2
            sy_ = (1 - sq) * (1 + stretch)
            sx_ = (1 + sq * 0.9) / (1 + stretch * 0.5)
            cxp = LG_X + (bb.left() + bb.right()) / 2 * LG_S
            byp = LG_Y + bb.bottom() * LG_S
            c.save()
            c.translate(cxp, byp + yoff)
            c.scale(sx_, sy_)
            c.translate(-cxp, -byp)
            c.translate(LG_X, LG_Y)
            c.scale(LG_S, LG_S)
            c.drawPath(pth, paint(PINK))
            c.restore()
            if t >= t1:
                for tc in (t1, t2):
                    ring = clamp((t - tc) / 0.5)
                    if 0 < ring < 1:
                        c.drawCircle(cxp, byp - 24, 30 + (220 if tc == t1 else 120) * out_cubic(ring), paint(PINK, 0.5 * (1 - ring), stroke=4))
                glow(c, cxp, byp - 26, 200, PINK, 0.35 * clamp((t - t1) / 0.15))
    c.restore()
    # lema y llamado
    k = t - G['lema']
    if k >= 0:
        e = out_expo(clamp(k / 0.35))
        c.save()
        c.clipRect(skia.Rect.MakeLTRB(0, 1084, W, 1160))
        c.translate(0, (1 - e) * 76)
        draw_text(c, 'Publicidad estratégica', W / 2, 1136, 'manb', 54, GRIS, 1, 0.01, 'center')
        c.restore()
    k = t - G['cta']
    if k >= 0:
        s = spring(k, 0.5, 22)
        txt = 'Escríbenos · pixely.pe'
        tw = text_width(txt, 'manx', 44, 0.0)
        pw, ph = tw + 72 + 52, 104
        c.save()
        c.translate(W / 2, 1290)
        c.scale(s, s)
        rrect(c, -pw / 2, -ph / 2, pw, ph, ph / 2, paint(CARBON))
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(-pw / 2, -ph / 2, pw, ph), ph / 2, ph / 2), paint(WHITE, 0.22, stroke=2))
        draw_icon(c, 'message', -pw / 2 + 58, 0, 40, PINK, 1, 2.4)
        draw_text(c, txt, -pw / 2 + 96, 15, 'manx', 44, WHITE, 1, 0.0)
        c.restore()


# ---------------- salida de un plano (látigo) ----------------
def whip_out(t, t_cut, dur=0.18):
    return -1350 * in_cubic(prog(t, t_cut - dur, dur))


def whip_in(t, t_cut, dur=0.22):
    return 1350 * (1 - out_expo(prog(t, t_cut, dur)))


def draw(c, t, shot_name=None):
    a, z, name = plano(t) if shot_name is None else next(p for p in __import__('cues').PLANOS if p[2] == shot_name)
    c.clear(col(INK))
    c.save()
    camera(c, t)
    if name == 'A':
        c.translate(whip_out(t, 4.0), 0)
        scene_A(c, t)
    elif name == 'B':
        c.translate(whip_in(t, 4.0), 0)
        # acercamiento al nodo «Tu pieza» al final del plano (7,75 -> 8,0)
        zk = in_expo(prog(t, G['zoom_bc'], 8.0 - G['zoom_bc']))
        if zk > 0:
            nx, ny = NODES[3]
            s = 1 + 26 * zk
            c.translate(nx, ny)
            c.scale(s, s)
            c.translate(-nx, -ny)
        scene_B(c, t)
    elif name == 'C':
        scene_C(c, t)
    else:
        scene_D(c, t)
    c.restore()
