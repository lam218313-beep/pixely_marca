"""Mapa de golpes del anuncio. Lo usan la música y la imagen: un solo reloj para las dos.

120 BPM a 60 fps: un tiempo = 0,5 s = 30 fotogramas exactos; una semicorchea = 0,125 s = 7,5 fotogramas.
Todo golpe importante cae en un tiempo o en una corchea (15 fotogramas), así coincide con el inicio de un fotograma.
"""
BPM = 120
FPS = 60
W, H = 1080, 1920
DUR = 15.0
BEAT = 60 / BPM          # 0,5 s
S16 = BEAT / 4           # 0,125 s


def b(n):
    """Tiempo (s) del tiempo n (n puede ser fraccionario: 1/4 = semicorchea)."""
    return n * BEAT


# Planos: los cortes caen en fotogramas exactos (4 s = 240, 8 s = 480, 12 s = 720)
PLANOS = [(0.0, 4.0, 'A'), (4.0, 8.0, 'B'), (8.0, 12.0, 'C'), (12.0, 15.0, 'D')]

# Golpes con imagen (tiempo, qué pasa). La música dispara un sonido en cada uno.
GOLPES = {
    'tu': b(0), 'publicidad': b(1), 'no_sale': b(2), 'ocurrencia': b(3), 'tachon': b(3.5),
    'orden': b(4), 'datos': b(5),
    'puntos': [b(4 + i / 2) for i in range(8)],          # 8 datos, uno por corchea (2,0 a 3,75 s)
    'whip_ab': b(7.75),
    'estudiamos': b(8), 'mercado': b(9),
    'barras': [b(8 + i / 2) for i in range(6)],          # 6 barras, una por corchea (4,0 a 5,25 s)
    'funciona': b(11),
    'armamos': b(12), 'estrategia': b(13),
    'nodos': [b(12), b(13), b(14), b(15)],               # objetivo, estrategia, dato, tu pieza
    'zoom_bc': b(15.5),
    'apruebas': b(16), 'cada_pieza': b(17),
    'redoble': [b(18 + i / 4) for i in range(12)],       # 9,0 a 10,375: no; ver abajo
    'aprobada': b(20),
    'push': b(20.75),
    'fichas': [b(21 + i / 4) for i in range(12)],        # 12 piezas, una por semicorchea (10,5 a 11,875 s)
    'impacto': b(24),
    'letras': [b(24 + i / 4) for i in range(6)],         # p i x e l y (12,0 a 12,625 s)
    'punto': b(26), 'rebote': b(26.5), 'lema': b(27), 'cta': b(28),
}
# Redoble del build: semicorcheas de 9,0 a 9,625 s (6 golpes) y silencio de 9,75 a 10,0 (respiro antes del sello)
GOLPES['redoble'] = [b(18 + i / 4) for i in range(6)]
GOLPES['respiro'] = b(19.5)

# Las semicorcheas impares caen a medio fotograma (7,5 fotogramas por semicorchea). Para que imagen y sonido coincidan
# exacto, todo golpe se ajusta al inicio de su fotograma (adelanto máximo de 8 ms en el sonido: imperceptible).
def _q(t):
    import math
    return math.floor(t * FPS + 1e-6) / FPS


GOLPES = {k: ([_q(x) for x in v] if isinstance(v, list) else _q(v)) for k, v in GOLPES.items()}


def plano(t):
    for a, z, n in PLANOS:
        if a <= t < z:
            return a, z, n
    return PLANOS[-1]
