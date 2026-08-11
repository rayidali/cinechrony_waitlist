#!/usr/bin/env python3
"""
Paint the mural. Flat colour, a diagonal horizon, and everything smeared.

    python3 scripts/paint-mural.py           # writes out/scene-*.png

WHAT THIS REPLACED, AND WHY THE LAST ONE WAS THE WRONG PICTURE.

The previous press drew gradient skies, cumulus clouds built from unions of
circles, a sun that was a plain disc, and flower fields made of stippled
dots. That is a flat vector poster: a 1970s travel print. The reference is
not that and never was. It is a painting, and four things make it:

  1. THE SKY IS ONE FLAT COLOUR. No gradient. No clouds. No sun. Half the
     frame is a single saturated blue and the only thing happening in it is
     paper tooth.
  2. EVERYTHING ELSE IS SMEARED along one diagonal. Not soft focus:
     directional, like a long exposure from a moving car. Forms dissolve
     into streaks and only a little grit survives.
  3. THE HORIZON IS A DIAGONAL, and it stays crisp while the smear runs
     past it.
  4. HEAVY PAPER TOOTH over the whole pull, with the colour separating
     slightly along the smear. That tooth is a CSS layer rather than
     something this file bakes in, and `tooth()` below says why: a lossy
     encoder eats fine noise and keeps coarse blotch, so baking it shipped
     dirt instead of paper.

Point 3 is the one that decides the architecture. Blurring along a line
does not blur an edge PARALLEL to that line, so the crest and the smear
share an angle and the horizon survives the very pass that dissolves the
flowers. Getting that from one blurred image is luck; getting it reliably
means two layers:

    the PLATE   flat sky, flat ground, a crisp wrapping crest. Never blurred.
    the DRIFT   flower ribbons, grass, the car, on alpha. Blurred hard.

which is also how the picture is actually built, so the code and the
painting agree.

TILING SURVIVES THE BLUR. Slices repeat sideways on a wide screen, so
nothing here may break horizontal periodicity. The smear is a weighted sum
of shifted copies: horizontally with np.roll, which wraps, and vertically
with edge replication, which is invisible because the top and bottom rows
of every slice are a flat colour by construction. Crests are single-period
sines, so they meet themselves at the tile edge; over any window narrower
than half a tile a big one reads as a straight diagonal.

CONTRAST IS MEASURED, NOT PROXIED, AND THAT IS WHAT BOUGHT THE COLOUR.
The old press gated on an oklch lightness window: 0.66 and up for a band
with dark ink. That number was derived for a neutral, and it was costing
the whole palette, because luminance depends on hue as much as lightness.
`--ink` is oklch 0.165 and its real luminance is 0.0044, so a ground needs
luminance 0.195 to clear 4.5:1, and oklch(0.62 0.15 244) is rgb(12 141 217)
at 5.4:1: a vivid azure, not the pastel the window insisted on. Each colour
is now checked against the actual ink of its actual band, so the question
"how blue can this sky be" is answered by measurement.

The reference's own cobalt, about rgb(23 88 148), is 2.6:1 on a paper band
and cannot go there at any saturation. It is 6.8:1 on a saturated one, so
the five bands that carry light ink get the reference colour exactly, and
the five that carry dark ink get the same painting in its high-key register.
The page alternates between them, which is a better answer than a
compromise applied evenly to both.

A blend of two legal colours is always legal: every channel of an
interpolation lies between its endpoints, so its luminance does too. That
is why a blur this heavy cannot break the floor, and why the rendered-pixel
audit at the end has never had to catch one.

Requires: pillow, numpy.
"""

from __future__ import annotations

import math
import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

OUT = Path("out")
SS = 2  # supersample factor for the drawing; the blur runs at 1x

# One wind for the whole page. Every crest is built to this slope and every
# smear runs along it, which is what keeps the horizons crisp and makes ten
# slices read as one painting rather than ten.
ANGLE = 15.0


# ---------------------------------------------------------------- colour ---
def oklch(lightness: float, chroma: float, hue: float) -> tuple[int, int, int]:
    """oklch -> 8-bit sRGB. The site's tokens are written in oklch, so the
    painting is mixed in the same space as the ink it has to sit beside."""
    a = chroma * math.cos(math.radians(hue))
    b = chroma * math.sin(math.radians(hue))
    l_ = lightness + 0.3963377774 * a + 0.2158037573 * b
    m_ = lightness - 0.1055613458 * a - 0.0638541728 * b
    s_ = lightness - 0.0894841775 * a - 1.2914855480 * b
    l3, m3, s3 = l_**3, m_**3, s_**3
    lin = (
        +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
        -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
        -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3,
    )
    out = []
    for v in lin:
        v = max(0.0, min(1.0, v))
        v = 12.92 * v if v <= 0.0031308 else 1.055 * v ** (1 / 2.4) - 0.055
        out.append(int(round(max(0.0, min(1.0, v)) * 255)))
    return tuple(out)  # type: ignore[return-value]


def rel_lum(rgb: tuple[int, int, int]) -> float:
    def c(v: float) -> float:
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4

    r, g, b = (c(x) for x in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    x, y = sorted((rel_lum(a), rel_lum(b)), reverse=True)
    return (x + 0.05) / (y + 0.05)


INK = oklch(0.165, 0.012, 60)  # --ink, what a paper band prints in
ON_COLOR = oklch(0.97, 0.006, 80)  # --on-color, what a saturated band prints in
# The close band's two buttons are cream at oklch 0.94 rather than
# `--on-color`'s 0.97. Dimmer ink needs a darker ground, so that slice is
# scored against what it actually carries.
ON_BUTTON = oklch(0.94, 0.008, 80)


class Ramp:
    """Every colour one slice is allowed, checked against the ink that is
    actually printed on that band. A picture nobody can read is a build
    failure, not a judgement call at review time.

    This used to be an oklch lightness window and the window was costing
    the palette: it is derived for a neutral, and luminance depends on hue
    at least as much as on lightness. Measuring the real thing is both
    stricter where it matters and far more generous where it does not."""

    NEED = 4.5

    def __init__(self, over: tuple[int, int, int]):
        self.over = over
        self.dark_band = rel_lum(over) > 0.5  # light ink => the band is dark
        self.used: list[tuple[str, tuple[int, int, int], float]] = []

    def __call__(self, name: str, L: float, C: float, h: float) -> tuple[int, int, int]:
        rgb = oklch(L, C, h)
        r = contrast(rgb, self.over)
        if r < self.NEED:
            raise SystemExit(
                f"  {name}: oklch({L} {C} {h}) is rgb{rgb}, {r:.2f}:1 against this "
                f"band's ink rgb{self.over}. Needs {self.NEED}. Type on it would not survive."
            )
        self.used.append((name, rgb, r))
        return rgb

    def report(self) -> float:
        worst = min(c for _, _, c in self.used)
        for name, rgb, c in sorted(self.used, key=lambda u: u[2])[:3]:
            flag = "  <-- worst" if c == worst else ""
            print(f"      {name:<13} rgb{rgb}  {c:.2f}:1{flag}")
        return worst


# --------------------------------------------------------------- drawing ---
class Sc:
    """One slice, as two layers.

    `plate` is the flat picture: sky, ground, a crisp crest. It is never
    blurred, which is the only reason the horizon stays a hard line while
    everything on top of it dissolves.

    `drift` is what gets smeared: flower ribbons, grass, a car. It carries
    alpha so the smear can trail off into the plate rather than into black.
    """

    def __init__(self, w: int, h: int, sky):
        self.w, self.h = w, h
        self.W, self.H = w * SS, h * SS
        self.plate = Image.new("RGB", (self.W, self.H), sky)
        self.drift = Image.new("RGBA", (self.W, self.H), (0, 0, 0, 0))
        # a third layer, smeared a fifth as far. The car needs to still be a
        # car: at the length that turns a bank of scrub into wisps, a car
        # 230px wide is gone completely, and the reference has one thing in
        # it that is moving slower than the flowers are.
        self.sharp = Image.new("RGBA", (self.W, self.H), (0, 0, 0, 0))
        self.pd = ImageDraw.Draw(self.plate)
        self.dd = ImageDraw.Draw(self.drift)
        self.sd = ImageDraw.Draw(self.sharp)
        self.post: list = []  # drawn after the smear: discs stay round

    # -- the crest ---------------------------------------------------------
    RUN = 0.72  # the fraction of a tile the straight part occupies

    def crest(self, y0: float, amp: float, flip: bool = False) -> np.ndarray:
        """A horizon: STRAIGHT for 72% of the tile, then turning back over
        the other 28% so it meets itself at the tile edge.

        The first cut of this was a sine, which wraps perfectly and reads as
        a dome. A hillside is not a dome. What the reference has is one
        straight diagonal, and the only way to have that AND a seamless tile
        is to spend part of the tile turning around: the turn is parked on
        the seam, where the far side of the hill would be anyway, and the
        straight run is centred so it is what a reader is looking at.
        `background-position: center` is what makes that true.

        The amplitude defaults FROM the page's smear angle, so the crest
        runs at the same slope as the blur and survives it: a blur along a
        line does not soften an edge parallel to that line."""
        t = ((np.arange(self.W) / self.W) + self.RUN / 2 - 0.5) % 1.0
        u = np.clip((t - self.RUN) / (1 - self.RUN), 0, 1)
        v = np.where(t < self.RUN, 1 - 2 * t / self.RUN, -1 + 2 * (u * u * (3 - 2 * u)))
        return y0 * self.H + amp * self.W * (-v if flip else v)

    def below(self, crest: np.ndarray, colour) -> None:
        pts = [(int(x), float(crest[x])) for x in range(self.W)]
        self.pd.polygon(pts + [(self.W, self.H), (0, self.H)], fill=colour)

    # -- what gets smeared -------------------------------------------------
    def ribbon(self, crest: np.ndarray, dy: float, spread: float, colours, n: int,
               r0: float, r1: float, seed: int, el: float = 3.6) -> None:
        """A mass of flowering scrub following a crest. Hard little dabs,
        because the smear is what softens them and a fraction of them is
        deliberately left crisp: the reference has that grit in it, and a
        picture with none of it reads as a gradient rather than as paint."""
        rng = random.Random(seed)
        base = dy * self.H
        for _ in range(n):
            x = rng.randrange(self.W)
            t = rng.random()
            # two randoms rather than one: a flat distribution gives a
            # slab of flowers with a hard edge, and what a bank of scrub has
            # is a dense middle that thins out into the grass
            y = crest[x] + base + (rng.random() + rng.random() - 1.0) * spread * self.H
            r = (r0 + (r1 - r0) * t) * self.W * rng.uniform(0.6, 1.5)
            c = rng.choice(colours)
            for px in (x, x + self.W, x - self.W) if (x < r * el or x > self.W - r * el) else (x,):
                self.dd.ellipse([px - r * el, y - r, px + r * el, y + r], fill=c + (255,))

    def streaks(self, crest: np.ndarray, dy0: float, dy1: float, colour, n: int,
                seed: int, alpha: int = 150) -> None:
        """Long thin marks down the slope. What stops a flat green field
        from being one flat green field once the smear has run over it."""
        rng = random.Random(seed)
        for _ in range(n):
            x = rng.randrange(self.W)
            y = crest[x] + rng.uniform(dy0, dy1) * self.H
            ln = rng.uniform(0.03, 0.13) * self.W
            th = rng.uniform(0.002, 0.006) * self.H
            self.dd.rectangle([x, y, x + ln, y + th], fill=colour + (alpha,))
            if x + ln > self.W:
                self.dd.rectangle([x - self.W, y, x + ln - self.W, y + th], fill=colour + (alpha,))

    def car(self, cx: float, cy: float, w: float, body, roof) -> None:
        """The one figure in the reference, and it survives being drawn
        badly: at this smear length a car is a dark wedge with a bright
        line along the top, which is all that is left of any car doing
        sixty. It is on the grab band, where the page is about something
        going past too fast to hold on to."""
        x, y, w = cx * self.W, cy * self.H, w * self.W
        h = w * 0.30
        self.sd.polygon(
            [(x - w / 2, y + h * 0.5), (x - w * 0.40, y - h * 0.1),
             (x + w * 0.32, y - h * 0.18), (x + w / 2, y + h * 0.15),
             (x + w * 0.44, y + h * 0.5)], fill=body + (255,))
        self.sd.polygon(
            [(x - w * 0.20, y - h * 0.12), (x - w * 0.06, y - h * 0.52),
             (x + w * 0.16, y - h * 0.50), (x + w * 0.24, y - h * 0.16)], fill=roof + (255,))
        self.sd.rectangle([x - w * 0.46, y + h * 0.16, x + w * 0.30, y + h * 0.30],
                          fill=roof + (255,))

    def disc(self, cx: float, cy: float, r: float, colour) -> None:
        """Drawn AFTER the smear, so it stays round. A sun that has been
        through a directional blur is a lozenge, and a lozenge is not a
        sun."""
        def paint(im: Image.Image) -> None:
            d = ImageDraw.Draw(im)
            x, y, rr = cx * self.w, cy * self.h, r * self.w
            d.ellipse([x - rr, y - rr, x + rr, y + rr], fill=colour)
        self.post.append(paint)


# ------------------------------------------------------------ the smear ---
def _shift(a: np.ndarray, dx: int, dy: int) -> np.ndarray:
    """Horizontally periodic, vertically clamped. The wrap is what keeps
    the tile seamless; the clamp is invisible because the first and last
    row of every slice are a flat colour by construction."""
    b = np.roll(a, dx, axis=1)
    if dy > 0:
        b = np.concatenate([np.repeat(b[:1], dy, axis=0), b[:-dy]], axis=0)
    elif dy < 0:
        d = -dy
        b = np.concatenate([b[d:], np.repeat(b[-1:], d, axis=0)], axis=0)
    return b


def _smear(a: np.ndarray, n: int, sigma: float, step: int) -> np.ndarray:
    cx, cy = math.cos(math.radians(ANGLE)), math.sin(math.radians(ANGLE))
    idx = np.arange(-n, n + 1, step)
    w = np.exp(-0.5 * (idx / sigma) ** 2)
    w /= w.sum()
    out = np.zeros_like(a)
    for i, wi in zip(idx, w):
        out += wi * _shift(a, int(round(i * cx)), int(round(i * cy)))
    return out


def smear(a: np.ndarray, length: int, keep: float = 0.11, core: int = 5) -> np.ndarray:
    """Two scales at once, and the short one is the point. A single long
    kernel gives a wash: every dab dissolves and the result is a gradient
    with a grain overlay. The reference keeps bright cores with long trails
    behind them, which is a sharp kernel and a long one added together."""
    step = max(1, length // 40)
    return (
        keep * a
        + (1 - keep) * (0.38 * _smear(a, core, core * 0.62, 1)
                        + 0.62 * _smear(a, length, length * 0.40, step))
    )


def fringe(a: np.ndarray, px: int) -> np.ndarray:
    """Red one way along the smear, blue the other. Two passes of a real
    press never line up, and the reference's flower masses carry exactly
    this: cool on one edge of a streak, warm on the other."""
    cx, cy = math.cos(math.radians(ANGLE)), math.sin(math.radians(ANGLE))
    dx, dy = int(round(px * cx)), int(round(px * cy))
    out = a.copy()
    out[:, :, 0] = _shift(a[:, :, 0:1], dx, dy)[:, :, 0]
    out[:, :, 2] = _shift(a[:, :, 2:3], -dx, -dy)[:, :, 0]
    return out


def settle(a: np.ndarray, top, bottom, k: int = 6) -> np.ndarray:
    """Ease the first and last few rows to the exact join colours.

    The mural's whole claim is that slice N's bottom row IS slice N+1's top
    row. Everything above leaves those rows alone in principle, and `in
    principle` is not a contract. Six rows of ramp is invisible and makes it
    one."""
    out = a.copy()
    for i in range(k):
        w = 1.0 - i / k
        out[i] = out[i] * (1 - w) + np.array(top, dtype=np.float32) / 255 * w
        out[-1 - i] = out[-1 - i] * (1 - w) + np.array(bottom, dtype=np.float32) / 255 * w
    return out


# ------------------------------------------------------------- the build ---
def render(sc: Sc, length: float, keep: float = 0.11) -> np.ndarray:
    def over(base: np.ndarray, layer: Image.Image, px: int, keep_: float) -> np.ndarray:
        lay = np.asarray(layer.resize((sc.w, sc.h), Image.LANCZOS)).astype(np.float32) / 255
        rgb, alpha = lay[:, :, :3], lay[:, :, 3:4]
        # premultiplied, or a smear pulls transparent black into every trail
        sm = smear(np.concatenate([rgb * alpha, alpha], axis=2), px, keep=keep_)
        return base * (1 - sm[:, :, 3:4]) + sm[:, :, :3]

    plate = np.asarray(sc.plate.resize((sc.w, sc.h), Image.LANCZOS)).astype(np.float32) / 255
    out = over(plate, sc.drift, int(length * sc.w), keep)
    out = over(out, sc.sharp, max(6, int(length * sc.w * 0.19)), 0.42)
    return fringe(out, 2)


# The CSS layer this file is painted to sit under: `.scene::after` carries
# soft-light noise at this opacity. The audit simulates it, because a
# contrast number measured on a picture that is not the one on screen is
# not a measurement.
TOOTH = 0.40

# MEASURED IN A REAL BROWSER, NOT MODELLED. `--grain-fine` is SVG
# turbulence and Python cannot reproduce feTurbulence, so these are the
# 99.98th-percentile LIFT the composited layer applies, sampled by backdrop
# value off a canvas at TOOTH opacity. Two things about the real layer that
# a reasonable guess got wrong in both directions: its luminance is
# entirely ABOVE 0.5 (mean 0.732), so soft-light only ever LIGHTENS, which
# makes it harmless under dark ink and dangerous under light ink; and its
# alpha averages 0.5, which halves everything. The first cut of this audit
# assumed noise centred on 0.5 at full alpha and failed a paper slice that
# could not have failed.
_LIFT_AT = np.arange(0.05, 0.96, 0.10)
_LIFT = np.array([0.0273, 0.0524, 0.0560, 0.0541, 0.0495,
                  0.0429, 0.0350, 0.0260, 0.0161, 0.0055])


def tooth(a: np.ndarray, dark_band: bool) -> np.ndarray:
    """What the CSS grain will do to these pixels. NOT written to the file.

    THE TOOTH IS NOT BAKED ANY MORE, AND THE ENCODER IS THE WHOLE REASON.
    It used to be, in two octaves, and it was measured: on a flat patch of
    sky the shipped WebP carried a total deviation of 4.44, of which 3.73
    was LOW-FREQUENCY BLOTCH. Lossy compression is a low-pass filter and
    fine noise is pure high-frequency entropy, so the codec threw away the
    part that reads as paper and kept the part that reads as dirt, which is
    exactly how it was reported: a layer of dirt with spots on it. Pushing
    the tooth through the encoder is not an option either, because fine
    grain alone survives at q90 and costs 350KB for ONE slice against 3KB
    for the same picture clean.

    So the painting ships clean and the tooth is a CSS layer at exactly one
    device pixel, where it is never resampled and never compressed. It is
    scoped to `.scene`, not to the viewport, which is the whole difference
    between this and the fixed film pass that came off the page: this one
    scrolls with the picture it belongs to.

    Soft-light rather than overlay: overlay pushes saturation and contrast,
    which is a second opinion about colours this file has already measured.

    Applied for the audit ONLY on a dark band, because the layer only
    lightens: that closes on light ink and opens up under dark ink, so
    leaving a paper slice alone is the pessimistic reading of both."""
    if not dark_band:
        return a
    return np.clip(a + np.interp(a, _LIFT_AT, _LIFT), 0, 1)


def audit(name: str, im: np.ndarray, ramp: Ramp) -> None:
    """The ramp checks the colours ASKED FOR. This checks the pixels that
    came out, after the smear has mixed them and the grain has moved them,
    which is the only version anybody looks at."""
    lin = np.where(im <= 0.03928, im / 12.92, ((im + 0.055) / 1.055) ** 2.4)
    lum = 0.2126 * lin[:, :, 0] + 0.7152 * lin[:, :, 1] + 0.0722 * lin[:, :, 2]
    ol = rel_lum(ramp.over)
    # the dangerous end is whichever one CLOSES on the type: light ink is
    # threatened by the brightest ground, dark ink by the darkest
    worst = lum.max() if ramp.dark_band else lum.min()
    c = (max(ol, worst) + 0.05) / (min(ol, worst) + 0.05)
    # 0.02% of pixels may be worse: grain is random noise and a handful of
    # extreme samples say nothing about the field a glyph sits on
    tail = np.percentile(lum, 99.98 if ramp.dark_band else 0.02)
    ct = (max(ol, tail) + 0.05) / (min(ol, tail) + 0.05)
    print(f"      rendered worst {c:.2f}:1, 99.98th pct {ct:.2f}:1")
    if ct < 4.5:
        raise SystemExit(f"  {name}: rendered ground falls to {ct:.2f}:1. Lift the ramp.")


# =============================================================== THE WALK ==
# One landscape, top of the page to the bottom of the footer. Light theme
# runs a day and dark theme runs the same ground after sunset, so the five
# bands whose stock inverts are painted twice. The other five carry light
# ink in both themes, which means they get the reference's own colour
# exactly: its cobalt is 6.8:1 against cream and 2.6:1 against ink, so it
# can live on half of these bands and on none of the others.

AMP = math.tan(math.radians(ANGLE)) / math.tau  # crest slope == smear angle


def sc_sky(c: Ramp, night: bool) -> tuple[Sc, float]:
    """Hero. Almost all flat sky, because the headline and the calendar
    live here and the quiet part of a painting goes where the words go."""
    n = night
    sky = c("sky", *((0.230, 0.085, 262) if n else (0.670, 0.140, 243)))
    sc = Sc(1800, 850, sky)
    k = sc.crest(0.845, AMP * 0.9)
    sc.below(k, c("hill", *((0.255, 0.090, 152) if n else (0.670, 0.150, 154))))
    sc.streaks(k, 0.02, 0.16, c("grass", *((0.215, 0.075, 150) if n else (0.735, 0.150, 132))), 260, 11)
    sc.ribbon(k, -0.012, 0.055, [
        c("bloom", *((0.375, 0.075, 342) if n else (0.815, 0.135, 352))),
        c("bloom pale", *((0.320, 0.060, 300) if n else (0.945, 0.035, 88))),
        c("bloom warm", *((0.345, 0.070, 20) if n else (0.820, 0.130, 34))),
    ], 900, 0.0030, 0.0080, 12)
    return sc, 0.105


def sc_hedge(c: Ramp, night: bool) -> tuple[Sc, float]:
    """The marquee strip: ninety pixels of the same scrub, no sky in it at
    all. It carries the colour the hero ends on, so that join is a match
    rather than a horizon.

    THE ONE SLICE WHOSE NIGHT PULL IS STILL A DAY PULL. `--on-color-dark`
    is oklch 0.17 in both themes, so the marigold band never inverts and
    this strip must stay bright whatever the hour. It gets the day's
    palette with the warmth taken out rather than a night one, or the page
    walks out of a night sky into a sunlit hedgerow for ninety pixels."""
    n = night
    base = c("field", *((0.660, 0.075, 168) if n else (0.670, 0.150, 154)))
    sc = Sc(1950, 90, base)
    k = sc.crest(0.5, AMP * 0.35, flip=True)
    sc.streaks(k, -0.45, 0.45, c("grass", *((0.700, 0.060, 176) if n else (0.735, 0.150, 132))), 220, 21)
    sc.ribbon(k, 0.0, 0.9, [
        c("bloom", *((0.735, 0.055, 262) if n else (0.815, 0.135, 352))),
        c("bloom pale", *((0.810, 0.030, 250) if n else (0.945, 0.035, 88))),
    ], 420, 0.0022, 0.0050, 22)
    return sc, 0.075


def sc_shade(c: Ramp, night: bool) -> tuple[Sc, float]:
    """The crew wall, and the only tall dark band. Deep spruce under a
    near-black sky, with the last of the light caught in the scrub."""
    sky = c("sky", 0.315, 0.080, 208)
    sc = Sc(1500, 1400, sky)
    k1 = sc.crest(0.300, AMP * 1.15)
    sc.below(k1, c("ridge far", 0.420, 0.100, 172))
    k2 = sc.crest(0.545, AMP * 0.95)
    sc.below(k2, c("ridge", 0.340, 0.100, 158))
    k3 = sc.crest(0.780, AMP * 0.8)
    sc.below(k3, c("near", 0.245, 0.085, 150))
    sc.streaks(k2, 0.02, 0.22, c("grass", 0.395, 0.100, 142), 320, 31)
    sc.streaks(k3, 0.03, 0.30, c("shadow", 0.195, 0.070, 155), 260, 34, alpha=110)
    sc.ribbon(k1, 0.008, 0.045, [
        c("bloom", 0.420, 0.080, 60),
        c("bloom warm", 0.470, 0.095, 48),
    ], 700, 0.0035, 0.0090, 32)
    sc.ribbon(k3, -0.010, 0.050, [
        c("low bloom", 0.330, 0.070, 30),
        c("low pale", 0.395, 0.055, 70),
    ], 800, 0.0035, 0.0105, 33)
    return sc, 0.115


def sc_field(c: Ramp, night: bool) -> tuple[Sc, float]:
    """The grab band, and the reference composition itself: flat sky over
    a hillside of flowering scrub with something driving through it too
    fast to see properly."""
    n = night
    sky = c("sky", *((0.240, 0.095, 258) if n else (0.655, 0.150, 246)))
    sc = Sc(2200, 800, sky)
    k = sc.crest(0.430, AMP * 1.05)
    sc.below(k, c("hill", *((0.265, 0.095, 150) if n else (0.660, 0.155, 152))))
    sc.streaks(k, 0.03, 0.50, c("grass", *((0.225, 0.080, 146) if n else (0.720, 0.155, 136))), 380, 41)
    sc.streaks(k, 0.05, 0.55, c("shadow", *((0.180, 0.060, 158) if n else (0.590, 0.145, 158))), 300, 45, alpha=120)
    blooms = [
        c("bloom", *((0.395, 0.085, 340) if n else (0.790, 0.150, 352))),
        c("bloom pale", *((0.330, 0.065, 296) if n else (0.945, 0.035, 90))),
        c("bloom warm", *((0.360, 0.080, 18) if n else (0.800, 0.145, 40))),
        c("bloom cool", *((0.345, 0.070, 268) if n else (0.760, 0.110, 306))),
    ]
    sc.ribbon(k, -0.020, 0.045, blooms, 1000, 0.0028, 0.0070, 42)
    sc.ribbon(k, 0.360, 0.055, blooms, 1100, 0.0030, 0.0080, 43)
    sc.ribbon(k, 0.820, 0.075, blooms, 1300, 0.0034, 0.0095, 44)
    sc.car(0.44, 0.870, 0.105,
           c("car", *((0.300, 0.075, 262) if n else (0.640, 0.115, 250))),
           c("car roof", *((0.420, 0.030, 250) if n else (0.930, 0.020, 240))))
    return sc, 0.135


def sc_sunset(c: Ramp, night: bool) -> tuple[Sc, float]:
    """The poster band. The board's loudest picture and the page's turn:
    a hot flat sky, a near-black land, one hard line between them."""
    sky = c("sky", 0.470, 0.170, 40)
    sc = Sc(1850, 480, sky)
    k = sc.crest(0.640, AMP * 1.2)
    sc.below(k, c("land", 0.200, 0.080, 32))
    sc.streaks(k, 0.05, 0.55, c("scrub", 0.260, 0.090, 40), 260, 51)
    sc.ribbon(k, -0.020, 0.070, [
        c("rim", 0.440, 0.150, 62),
        c("rim deep", 0.375, 0.140, 32),
    ], 900, 0.0030, 0.0085, 52)
    sc.disc(0.50, 0.545, 0.030, c("sun", 0.495, 0.130, 70))
    return sc, 0.120


def sc_meadow(c: Ramp, night: bool) -> tuple[Sc, float]:
    """What it does. The tallest band on the page, so it is mostly sky and
    the scrub is banked along the bottom third, under three screenshots."""
    n = night
    sky = c("sky", *((0.225, 0.085, 268) if n else (0.680, 0.135, 248)))
    sc = Sc(1700, 1700, sky)
    k = sc.crest(0.600, AMP * 1.5, flip=True)
    sc.below(k, c("hill", *((0.250, 0.085, 156) if n else (0.675, 0.150, 152))))
    sc.streaks(k, 0.02, 0.36, c("grass", *((0.210, 0.070, 152) if n else (0.740, 0.145, 134))), 380, 61)
    sc.streaks(k, 0.04, 0.40, c("shadow", *((0.170, 0.055, 160) if n else (0.600, 0.140, 160))), 300, 65, alpha=120)
    blooms = [
        c("bloom", *((0.380, 0.085, 348) if n else (0.800, 0.140, 356))),
        c("bloom pale", *((0.325, 0.060, 300) if n else (0.950, 0.030, 40))),
        c("bloom warm", *((0.350, 0.075, 24) if n else (0.810, 0.135, 30))),
    ]
    sc.ribbon(k, -0.012, 0.030, blooms, 1100, 0.0026, 0.0058, 62)
    sc.ribbon(k, 0.215, 0.042, blooms, 1300, 0.0030, 0.0072, 63)
    sc.ribbon(k, 0.430, 0.058, blooms, 1400, 0.0032, 0.0085, 64)
    return sc, 0.125


def sc_dusk(c: Ramp, night: bool) -> tuple[Sc, float]:
    """Movie night. Deep indigo, a moon that stays round because it is
    printed after the smear, and one dark ridge."""
    sky = c("sky", 0.365, 0.145, 268)
    sc = Sc(2250, 520, sky)
    k = sc.crest(0.690, AMP * 1.1)
    sc.below(k, c("ridge", 0.215, 0.075, 258))
    sc.streaks(k, 0.05, 0.50, c("scrub", 0.270, 0.085, 262), 280, 71)
    sc.ribbon(k, -0.018, 0.065, [
        c("bloom", 0.430, 0.090, 300),
        c("bloom cool", 0.395, 0.080, 258),
    ], 900, 0.0028, 0.0080, 72)
    sc.disc(0.52, 0.330, 0.017, c("moon", 0.480, 0.055, 92))
    return sc, 0.115


def sc_lake(c: Ramp, night: bool) -> tuple[Sc, float]:
    """The year. Ridges receding into water that is holding the last of
    the light, which the smear makes for free: long marks on a flat blue
    is all a lake has ever been."""
    sky = c("sky", 0.395, 0.115, 300)
    sc = Sc(2150, 700, sky)
    k1 = sc.crest(0.495, AMP * 1.25, flip=True)
    sc.below(k1, c("ridge far", 0.330, 0.090, 176))
    k2 = sc.crest(0.580, AMP * 0.9, flip=True)
    sc.below(k2, c("ridge", 0.245, 0.075, 160))
    water = c("water", 0.345, 0.095, 248)
    sc.pd.rectangle([0, 0.660 * sc.H, sc.W, sc.H], fill=water)
    sc.streaks(sc.crest(0.660, 0.0), 0.02, 0.34, c("ripple", 0.410, 0.085, 244), 340, 81, alpha=190)
    sc.streaks(sc.crest(0.680, 0.0), 0.01, 0.14, c("glint", 0.470, 0.100, 60), 90, 82, alpha=200)
    sc.ribbon(k1, 0.004, 0.030, [
        c("rim", 0.440, 0.110, 44),
        c("rim cool", 0.400, 0.090, 320),
    ], 700, 0.0026, 0.0068, 83)
    sc.disc(0.50, 0.470, 0.019, c("sun", 0.480, 0.105, 58))
    return sc, 0.115


def sc_night(c: Ramp, night: bool) -> tuple[Sc, float]:
    """The close, and the deepest point of the walk.

    SCORED AGAINST WHAT IT ACTUALLY CARRIES. The two buttons on this band
    are cream at oklch 0.94 rather than `--on-color`'s 0.97, and dimmer ink
    needs a darker ground: the version built for 0.97 put them at 4.29:1 in
    check:contrast-pixels. A window sized for the worst ink a band is KNOWN
    to carry is the wrong number the moment the band carries something
    dimmer, so this one is scored against the button."""
    sky = c("sky", 0.245, 0.085, 288)
    sc = Sc(1900, 490, sky)
    k = sc.crest(0.870, AMP * 0.85)
    sc.below(k, c("ridge", 0.165, 0.055, 276))
    sc.ribbon(k, -0.030, 0.090, [
        c("bloom", 0.310, 0.075, 312),
        c("bloom cool", 0.285, 0.060, 268),
    ], 800, 0.0026, 0.0075, 91)
    return sc, 0.120


def sc_dawn(c: Ramp, night: bool) -> tuple[Sc, float]:
    """The footer, and the end of the walk. In light theme it is first
    light, which is the only reason a cream footer under a night sky is
    not a mistake: the page runs a full day and finishes where it began."""
    n = night
    sky = c("sky", *((0.185, 0.060, 292) if n else (0.700, 0.105, 340)))
    sc = Sc(2200, 560, sky)
    k = sc.crest(0.730, AMP * 1.15, flip=True)
    sc.below(k, c("hill", *((0.155, 0.050, 250) if n else (0.685, 0.140, 154))))
    sc.streaks(k, 0.04, 0.42, c("grass", *((0.195, 0.055, 230) if n else (0.745, 0.135, 138))), 300, 101)
    sc.ribbon(k, -0.016, 0.060, [
        c("bloom", *((0.300, 0.070, 320) if n else (0.870, 0.110, 48))),
        c("bloom pale", *((0.255, 0.055, 280) if n else (0.955, 0.030, 70))),
        c("bloom warm", *((0.330, 0.075, 30) if n else (0.805, 0.130, 8))),
    ], 950, 0.0028, 0.0078, 102)
    return sc, 0.120


# name -> (paint, ink it must survive, night register?)
SCENES = {
    "scene-sky": (sc_sky, INK, False),
    "scene-sky-dark": (sc_sky, ON_COLOR, True),
    "scene-hedge": (sc_hedge, INK, False),
    "scene-hedge-dark": (sc_hedge, INK, True),
    "scene-shade": (sc_shade, ON_COLOR, True),
    "scene-field": (sc_field, INK, False),
    "scene-field-dark": (sc_field, ON_COLOR, True),
    "scene-sunset": (sc_sunset, ON_COLOR, True),
    "scene-meadow": (sc_meadow, INK, False),
    "scene-meadow-dark": (sc_meadow, ON_COLOR, True),
    "scene-dusk": (sc_dusk, ON_COLOR, True),
    "scene-lake": (sc_lake, ON_COLOR, True),
    "scene-night": (sc_night, ON_BUTTON, True),
    "scene-dawn": (sc_dawn, INK, False),
    "scene-dawn-dark": (sc_dawn, ON_COLOR, True),
}

ORDER = ["scene-sky", "scene-hedge", "scene-shade", "scene-field", "scene-sunset",
         "scene-meadow", "scene-dusk", "scene-lake", "scene-night", "scene-dawn"]


def seam(im: np.ndarray) -> float:
    """How far the left edge is from the right, in mean 8-bit distance.
    These repeat sideways on a wide screen, so a tile that does not meet
    itself prints a vertical scar down the page."""
    return float(np.abs(im[:, 0] - im[:, -1]).mean() * 255)


def main() -> None:
    OUT.mkdir(exist_ok=True)
    edges: dict[str, tuple] = {}
    for name, (fn, over, night) in SCENES.items():
        print(f"  {name}")
        ramp = Ramp(over)
        sc, length = fn(ramp, night)
        print(f"      {sc.w}x{sc.h}, ramp worst {ramp.report():.2f}:1")
        im = render(sc, length)
        # the joins are read off the picture before grain, then enforced,
        # so a slice that drifts away from its neighbour is a build failure
        # rather than a seam somebody notices on a preview
        top = tuple(int(v) for v in im[0].mean(axis=0) * 255)
        bot = tuple(int(v) for v in im[-1].mean(axis=0) * 255)
        im = settle(im, top, bot)
        out = Image.fromarray((im * 255).round().astype(np.uint8))
        for paint in sc.post:
            paint(out)  # after the smear, so a sun is a disc and not a lozenge
        # re-read, because a disc painted after the audit is a colour nobody
        # checked, and the sun is the brightest thing in three of these
        im = np.asarray(out).astype(np.float32) / 255
        audit(name, tooth(im, ramp.dark_band), ramp)
        print(f"      tile seam {seam(im):.1f}/255")
        edges[name] = (top, bot)
        out.save(OUT / f"{name}.png")

    print("\n  the stitch (bottom of one slice -> top of the next)")
    for a, b in zip(ORDER, ORDER[1:]):
        lo, hi = edges[a][1], edges[b][0]
        step = abs(rel_lum(lo) - rel_lum(hi))
        print(f"      {a:<18} -> {b:<18} rgb{lo} / rgb{hi}   "
              f"{'match' if step < 0.02 else 'horizon'}")


if __name__ == "__main__":
    main()
