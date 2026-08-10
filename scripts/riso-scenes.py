#!/usr/bin/env python3
"""
Draw the band scenery. Risograph landscapes, flat colour, printed grain.

    python3 scripts/riso-scenes.py            # writes out/scene-*.png

WHY THESE ARE DRAWN AND NOT PHOTOGRAPHED.

The first answer to "the background is a plain colour" was objects, the
second was duotone gradients, the third was a real photograph screenprinted
in ONE INK. All three were still, correctly, "a plain colour": a greyscale
photo multiplied into a band can only ever put down more of that band's own
ink, so the very property that made it safe made it invisible.

The reference boards are not photographs. They are painted: flat fields,
hard horizons, a sun that is a plain disc, clouds that are unions of
circles, grain over the whole pull. So this draws them. Drawn means every
colour is chosen rather than found, which is the only way scenery can enter
a strict palette without becoming a second one, and it means the quiet part
of the picture can be put exactly where the words go.

CONTRAST IS DECIDED IN THE RAMP, NOT PATCHED AFTERWARDS.

Each scene declares the lightness window it is allowed to live in, taken
from the type that sits on it:

  paper bands (dark ink on them)   L 0.66 .. 0.99
  saturated bands (light ink)      L 0.00 .. 0.50

Those two numbers are just WCAG solved backwards. Ink is oklch 0.165, so a
ground at oklch L 0.635 is exactly 4.5:1 and everything above it clears;
`--on-color` is oklch 0.97, so a ground at oklch L 0.52 is exactly 4.5:1
and everything below it clears. Every colour in a scene is checked against
its own window at build time and the run FAILS rather than shipping a
pretty band nobody can read. `check:contrast-pixels` then measures the same
thing off the rendered page, which is the part that cannot be argued with.

Requires: pillow, numpy.
"""

from __future__ import annotations

import math
import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = Path("out")
# 1800 wide is a size decision, not a quality one. Grain is random noise and
# random noise does not compress: at 2200 the four light-theme scenes came to
# 240KB of decoration, at 1800 they come to 181KB, and the difference is
# invisible because a soft illustration behind text is the one image on a
# page that can afford to be resampled.
W, H = 1800, 1150
SS = 2  # supersample factor; everything is drawn at SS and shrunk once


# ---------------------------------------------------------------- colour ---
def oklch(lightness: float, chroma: float, hue: float) -> tuple[int, int, int]:
    """oklch -> 8-bit sRGB. The site's tokens are written in oklch, so the
    scenery is mixed in the same space as the inks it has to sit beside."""
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


INK = oklch(0.165, 0.012, 60)  # --ink, what sits on a paper band
ON_COLOR = oklch(0.97, 0.006, 80)  # --on-color, what sits on a saturated one
ACCENT_DARK = oklch(0.75, 0.155, 35)  # --accent-text in dark mode, the row labels


class Ramp:
    """The colours one scene is allowed to use, and the window they must
    stay inside. Asking for a colour outside the window raises: a scene
    that cannot be read is a bug at build time, not a judgement call at
    review time."""

    def __init__(self, lo: float, hi: float, over: tuple[int, int, int]):
        self.lo, self.hi, self.over = lo, hi, over
        self.used: list[tuple[str, tuple[int, int, int], float]] = []

    def __call__(self, name: str, L: float, C: float, h: float) -> tuple[int, int, int]:
        if not (self.lo - 1e-9 <= L <= self.hi + 1e-9):
            raise SystemExit(
                f"  {name}: oklch L={L} is outside this band's window "
                f"[{self.lo}, {self.hi}]. Type on it would not survive."
            )
        rgb = oklch(L, C, h)
        self.used.append((name, rgb, contrast(rgb, self.over)))
        return rgb

    def report(self) -> float:
        worst = min(c for _, _, c in self.used)
        for name, rgb, c in sorted(self.used, key=lambda u: u[2]):
            flag = "  <-- worst" if c == worst else ""
            print(f"      {name:<14} rgb{rgb}  {c:.2f}:1{flag}")
        return worst


# --------------------------------------------------------------- drawing ---
def canvas(stops: list[tuple[float, tuple[int, int, int]]]) -> Image.Image:
    """A vertical gradient, drawn one row at a time. Skies are the only
    place a gradient belongs here; everything else is a flat field."""
    im = Image.new("RGB", (W * SS, H * SS))
    d = ImageDraw.Draw(im)
    for y in range(H * SS):
        t = y / (H * SS - 1)
        for i in range(len(stops) - 1):
            p0, c0 = stops[i]
            p1, c1 = stops[i + 1]
            if p0 <= t <= p1 or i == len(stops) - 2:
                k = 0 if p1 == p0 else min(1, max(0, (t - p0) / (p1 - p0)))
                d.line(
                    [(0, y), (W * SS, y)],
                    fill=tuple(round(c0[j] + (c1[j] - c0[j]) * k) for j in range(3)),
                )
                break
    return im


def ridgeline(seed: int, amp: float, waves: int) -> list[float]:
    """A hill silhouette: a few sines of different periods added together.
    Returns one height offset per supersampled column, in [-amp, amp]."""
    rng = random.Random(seed)
    parts = [(rng.uniform(0.6, 1.6) * (k + 1), rng.uniform(0, math.tau), 1 / (k + 1))
             for k in range(waves)]
    n = W * SS
    out = []
    for x in range(n):
        t = x / n
        v = sum(w * math.sin(math.tau * f * t + p) for f, p, w in parts)
        out.append(v / sum(w for _, _, w in parts) * amp)
    return out


def hill(im: Image.Image, top: float, colour, seed: int, amp: float, waves: int = 3) -> None:
    """Fill everything below a ridgeline. Drawn as one polygon so the edge
    is a real hard edge, which is what separates a printed field from a
    blurred photograph."""
    d = ImageDraw.Draw(im)
    ys = ridgeline(seed, amp * H * SS, waves)
    base = top * H * SS
    pts = [(x, base + ys[x]) for x in range(W * SS)]
    d.polygon(pts + [(W * SS, H * SS), (0, H * SS)], fill=colour)


def cloud(im: Image.Image, cx: float, cy: float, w: float, h: float, colour, seed: int) -> None:
    """A flat cumulus: a union of circles on a baseline with a flat bottom.
    This is how every cloud on the reference boards is built, and the flat
    bottom is the whole tell."""
    d = ImageDraw.Draw(im)
    rng = random.Random(seed)
    cx, cy, w, h = cx * W * SS, cy * H * SS, w * W * SS, h * H * SS
    lobes = rng.randint(6, 8)
    for i in range(lobes):
        t = i / (lobes - 1)
        # tallest in the middle, tapering to the ends
        r = h * (0.42 + 0.58 * math.sin(math.pi * t) ** 0.8) * rng.uniform(0.86, 1.18)
        x = cx - w / 2 + w * t
        # jitter each lobe's centre a little, or the row of circles stays a
        # row of circles instead of becoming one cloud
        y = cy - r * 0.28 + rng.uniform(-0.1, 0.1) * h
        d.ellipse([x - r, y - r, x + r, y + r], fill=colour)
    d.rectangle([cx - w / 2, cy, cx + w / 2, cy + h * 0.34], fill=colour)


def disc(im: Image.Image, cx: float, cy: float, r: float, colour) -> None:
    d = ImageDraw.Draw(im)
    cx, cy, r = cx * W * SS, cy * H * SS, r * W * SS
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=colour)


def stipple(
    im: Image.Image,
    y0: float,
    y1: float,
    colours: list,
    seed: int,
    n: int,
    r0: float,
    r1: float,
    under=None,
) -> None:
    """Flower heads. Density and size both grow toward the bottom, which is
    the only perspective cue a flat picture gets.

    `under` is a foliage pass laid down first. Mixing the green into the
    same random draw as the blooms gives confetti: leaves BESIDE flowers
    at the same depth. Putting it underneath gives a field: green showing
    through the gaps, which is where green actually is."""
    d = ImageDraw.Draw(im)
    rng = random.Random(seed)
    passes = ([(under, int(n * 0.55), 1.15)] if under else []) + [(None, n, 1.0)]
    for fill, count, scale in passes:
        for _ in range(count):
            t = rng.random() ** 0.62  # bias toward the near edge
            y = (y0 + (y1 - y0) * t) * H * SS
            x = rng.random() * W * SS
            r = (r0 + (r1 - r0) * t) * W * SS * rng.uniform(0.7, 1.34) * scale
            d.ellipse(
                [x - r, y - r * 0.86, x + r, y + r * 0.86],
                fill=fill or rng.choice(colours),
            )


def stars(im: Image.Image, y1: float, colour, seed: int, n: int) -> None:
    d = ImageDraw.Draw(im)
    rng = random.Random(seed)
    for _ in range(n):
        x, y = rng.random() * W * SS, rng.random() * y1 * H * SS
        r = rng.uniform(1.4, 3.4) * SS
        d.ellipse([x - r, y - r, x + r, y + r], fill=colour)


# ------------------------------------------------------------- finishing ---
def press(im: Image.Image, grain: float, seed: int) -> Image.Image:
    """Take the drawing off the press: shrink, misregister, grain.

    The 1px channel offset is the cheapest and most convincing print tell
    there is: two passes of a real press never line up perfectly, and a
    picture where they do reads as a screen rather than a sheet."""
    im = im.resize((W, H), Image.LANCZOS)
    r, g, b = im.split()
    r = r.transform(r.size, Image.AFFINE, (1, 0, -1, 0, 1, 0), resample=Image.BILINEAR)
    b = b.transform(b.size, Image.AFFINE, (1, 0, 1, 0, 1, 0), resample=Image.BILINEAR)
    im = Image.merge("RGB", (r, g, b))

    rng = np.random.default_rng(seed)
    a = np.asarray(im).astype(np.float32)
    # two frequencies: fine tooth, and the coarse blotch of uneven ink
    fine = rng.normal(0, grain * 255, a.shape[:2])
    coarse = rng.normal(0, grain * 255 * 1.5, (H // 12 + 1, W // 12 + 1))
    coarse = np.asarray(
        Image.fromarray(coarse.astype(np.float32), mode="F").resize((W, H), Image.BICUBIC)
    )
    a += (fine + coarse)[:, :, None]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def audit(name: str, im: Image.Image, ramp: Ramp) -> None:
    """The ramp check is on the colours ASKED FOR. This is on the pixels
    that came out, after grain and misregistration have moved them, which
    is the only version anybody looks at."""
    a = np.asarray(im).astype(np.float32) / 255.0
    lin = np.where(a <= 0.03928, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)
    lum = 0.2126 * lin[:, :, 0] + 0.7152 * lin[:, :, 1] + 0.0722 * lin[:, :, 2]
    dark_band = ramp.hi < 0.6
    ol = rel_lum(ramp.over)
    # the dangerous end is whichever one CLOSES on the type: light ink is
    # threatened by the brightest ground, dark ink by the darkest
    worst = lum.max() if dark_band else lum.min()
    c = (max(ol, worst) + 0.05) / (min(ol, worst) + 0.05)
    # 0.02% of pixels are allowed to be worse: grain is random noise and a
    # handful of extreme samples say nothing about a field a glyph sits on
    tail = np.percentile(lum, 99.98 if dark_band else 0.02)
    ct = (max(ol, tail) + 0.05) / (min(ol, tail) + 0.05)
    print(f"      rendered worst {c:.2f}:1, 99.98th pct {ct:.2f}:1")
    if ct < 4.5:
        raise SystemExit(f"  {name}: rendered ground falls to {ct:.2f}:1. Lift the ramp.")


# ---------------------------------------------------------------- scenes ---
# Paper bands carry dark ink, so their floor is what matters; saturated
# bands carry light ink, so their ceiling is.
PAPER = (0.66, 0.995)
DARK = (0.0, 0.50)
# A THIRD WINDOW, BECAUSE WHITE IS NOT THE ONLY INK ON A DARK BAND. The
# what-it-does band carries three small accent-red labels directly on the
# picture, and in dark mode that red is oklch 0.75: far darker than
# `--on-color`, so it needs a far darker ground: 0.36 rather than 0.52.
# Lifting the red instead was tried and does not work; it is still under
# 4.5:1 at oklch L 0.88, by which point it is not red. So the scene gives
# way, which suits it anyway, being a night meadow with no sun in it.
DARK_ACCENT = (0.0, 0.325)

# THE TWO REGISTERS. The blue and forest bands are dark in both themes, so
# one dark picture serves both. The two paper bands INVERT: cream by day,
# near-black by night, and a pale sky behind dark-mode's light type would
# be a worse bug than the flat colour this set exists to fix. So those two
# are drawn twice, and the second pull is the same landscape after sunset.
# It costs nothing to draw and it is a better idea than a compromise: the
# page has a time of day.


def scene_flowers(c: Ramp, night: bool) -> Image.Image:
    """The grab band. A sunflower field, and the sun going down on it."""
    n = night
    im = canvas(
        [
            (0.00, c("sky top", *((0.245, 0.090, 286) if n else (0.900, 0.055, 236)))),
            (0.42, c("sky mid", *((0.375, 0.110, 344) if n else (0.945, 0.045, 96)))),
            (0.66, c("sky low", *((0.470, 0.120, 56) if n else (0.925, 0.085, 84)))),
        ]
    )
    if n:
        stars(im, 0.34, c("star", 0.470, 0.025, 280), 15, 60)
    disc(im, 0.775, 0.30, 0.078, c("sun", *((0.470, 0.120, 66) if n else (0.905, 0.115, 80))))
    white = c("cloud", *((0.400, 0.090, 330) if n else (0.985, 0.012, 92)))
    cloud(im, 0.20, 0.24, 0.30, 0.09, white, 11)
    cloud(im, 0.58, 0.15, 0.22, 0.065, white, 12)
    cloud(im, 0.88, 0.44, 0.26, 0.075, white, 13)
    cloud(im, 0.34, 0.47, 0.20, 0.055, white, 14)
    hill(im, 0.615, c("far hill", *((0.330, 0.060, 168) if n else (0.845, 0.055, 132))), 21, 0.030)
    hill(im, 0.665, c("near hill", *((0.255, 0.055, 150) if n else (0.775, 0.085, 140))), 22, 0.024)
    hill(im, 0.735, c("field", *((0.300, 0.075, 92) if n else (0.865, 0.105, 96))), 23, 0.016, waves=2)
    stipple(
        im,
        0.74,
        1.02,
        [
            c("bloom", *((0.410, 0.110, 84) if n else (0.855, 0.135, 86))),
            c("bloom warm", *((0.350, 0.105, 66) if n else (0.805, 0.135, 72))),
            c("bloom pale", *((0.465, 0.095, 92) if n else (0.935, 0.085, 92))),
        ],
        31,
        n=1500,
        r0=0.0035,
        r1=0.0165,
        under=c("leaf", *((0.215, 0.055, 152) if n else (0.700, 0.095, 146))),
    )
    return im


def scene_meadow(c: Ramp, night: bool) -> Image.Image:
    """What it does. Wildflowers under a big sky, which is the reference
    board's single most repeated picture."""
    n = night
    im = canvas(
        [
            (0.00, c("sky top", *((0.170, 0.070, 274) if n else (0.815, 0.095, 240)))),
            (0.38, c("sky mid", *((0.238, 0.095, 262) if n else (0.885, 0.070, 236)))),
            (0.58, c("sky low", *((0.305, 0.090, 250) if n else (0.955, 0.030, 220)))),
        ]
    )
    if n:
        stars(im, 0.36, c("star", 0.318, 0.022, 262), 44, 70)
    white = c("cloud", *((0.282, 0.075, 268) if n else (0.985, 0.010, 250)))
    cloud(im, 0.16, 0.20, 0.34, 0.10, white, 41)
    cloud(im, 0.62, 0.30, 0.28, 0.085, white, 42)
    cloud(im, 0.93, 0.13, 0.24, 0.07, white, 43)
    hill(im, 0.545, c("far hill", *((0.260, 0.055, 186) if n else (0.760, 0.080, 168))), 51, 0.034)
    hill(im, 0.605, c("near hill", *((0.215, 0.050, 158) if n else (0.685, 0.090, 150))), 52, 0.026)
    hill(im, 0.665, c("meadow", *((0.245, 0.060, 20) if n else (0.905, 0.055, 26))), 53, 0.018, waves=2)
    stipple(
        im,
        0.67,
        1.02,
        [
            c("bloom", *((0.290, 0.085, 8) if n else (0.800, 0.095, 14))),
            c("bloom deep", *((0.275, 0.085, 358) if n else (0.745, 0.105, 6))),
            c("bloom pale", *((0.320, 0.060, 22) if n else (0.945, 0.045, 24))),
        ],
        61,
        n=1700,
        r0=0.0035,
        r1=0.0170,
        under=c("stem", *((0.185, 0.045, 156) if n else (0.700, 0.090, 152))),
    )
    return im


def scene_night(c: Ramp, night: bool) -> Image.Image:
    """Movie night. Dusk going over, a moon, a bank of flat cloud.

    EVERYTHING WORTH SEEING LIVES IN THE BOTTOM HALF, and that is a layout
    fact rather than a taste. The picture is pinned to the foot of its
    band, so a short band crops the TOP: the first cut put the moon at 0.24
    and it was gone entirely from a 450px band, which is the only band this
    scene is ever used on. The ground can never be cropped, so the ground
    is where the composition goes."""
    im = canvas(
        [
            (0.00, c("sky top", 0.235, 0.095, 288)),
            (0.46, c("sky mid", 0.360, 0.150, 264)),
            (0.78, c("sky low", 0.440, 0.135, 246)),
        ]
    )
    stars(im, 0.74, c("star", 0.470, 0.030, 250), 71, 120)
    disc(im, 0.815, 0.585, 0.050, c("moon", 0.455, 0.070, 92))
    band = c("cloud", 0.420, 0.105, 268)
    cloud(im, 0.24, 0.575, 0.36, 0.070, band, 72)
    cloud(im, 0.66, 0.700, 0.30, 0.060, band, 73)
    cloud(im, 0.05, 0.745, 0.26, 0.050, c("cloud low", 0.455, 0.100, 254), 74)
    hill(im, 0.815, c("ridge far", 0.290, 0.075, 258), 81, 0.030)
    hill(im, 0.880, c("ridge near", 0.205, 0.055, 236), 82, 0.022)
    return im


def scene_hills(c: Ramp, night: bool) -> Image.Image:
    """The year. Ridges receding, a low sun, water holding the light.

    ORDER IS THE WHOLE PICTURE HERE. The first cut drew the lake before the
    ridges and buried it completely: a flat picture has no depth buffer, so
    back-to-front IS the composition. Sky, sun, the far ridges the sun sets
    behind, then the water in front of them, then the shore in front of
    that."""
    im = canvas(
        [
            (0.00, c("sky top", 0.290, 0.105, 268)),
            (0.36, c("sky mid", 0.400, 0.115, 320)),
            (0.54, c("sky low", 0.465, 0.105, 44)),
        ]
    )
    disc(im, 0.31, 0.480, 0.072, c("sun", 0.470, 0.110, 62))
    # same reason as scene_night: a short band keeps the ground and loses
    # the top, so the clouds sit lower than a painter would put them
    cloud(im, 0.72, 0.315, 0.32, 0.070, c("cloud", 0.435, 0.095, 350), 91)
    cloud(im, 0.14, 0.225, 0.24, 0.055, c("cloud high", 0.400, 0.100, 300), 92)
    hill(im, 0.520, c("ridge far", 0.415, 0.070, 176), 101, 0.032, waves=4)
    hill(im, 0.575, c("ridge mid", 0.320, 0.070, 160), 102, 0.026)
    # the lake, in front of the ridges, with the sun's path down it
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0.625 * H * SS, W * SS, H * SS], fill=c("water", 0.375, 0.090, 250))
    # WATER FIRST, REFLECTION SECOND, and the order of those two is the
    # whole lesson. Two attempts drew the sun path as the point of the lake:
    # a symmetric stack of widening bars, then the same stack jittered and
    # broken. Both read as a staircase climbing to the sun, because a
    # widening cone of marks on an otherwise empty rectangle IS a triangle
    # whatever you do to its edges. What says "lake" is the surface: long
    # horizontal striations right across it. The sun only needs three or
    # four warm dashes under it once the water is already water.
    rng = random.Random(117)
    ripple = c("ripple", 0.415, 0.085, 246)
    for _ in range(22):
        y = rng.uniform(0.635, 0.955) * H * SS
        x0 = rng.uniform(-0.05, 0.72) * W * SS
        x1 = x0 + rng.uniform(0.14, 0.52) * W * SS
        d.rectangle([x0, y, x1, y + rng.uniform(0.003, 0.007) * H * SS], fill=ripple)
    glint = c("glint", 0.455, 0.095, 58)
    for i in range(5):
        y = (0.652 + i * 0.052 + rng.uniform(-0.006, 0.006)) * H * SS
        half = (0.020 + i * 0.011) * W * SS * rng.uniform(0.8, 1.15)
        cx = (0.31 + rng.uniform(-0.01, 0.01)) * W * SS
        d.rectangle([cx - half, y, cx + half, y + 0.0065 * H * SS], fill=glint)
    hill(im, 0.945, c("shore", 0.205, 0.055, 152), 103, 0.018, waves=2)
    return im


# The ink each window is scored against: whatever the LEAST forgiving thing
# printed on that band is.
OVER = {PAPER: INK, DARK: ON_COLOR, DARK_ACCENT: ACCENT_DARK}

# name -> (draw, grain, window, night register?)
SCENES = {
    "scene-flowers": (scene_flowers, 0.011, PAPER, False),
    "scene-flowers-dark": (scene_flowers, 0.010, DARK, True),
    "scene-meadow": (scene_meadow, 0.011, PAPER, False),
    "scene-meadow-dark": (scene_meadow, 0.010, DARK_ACCENT, True),
    "scene-night": (scene_night, 0.010, DARK, True),
    "scene-hills": (scene_hills, 0.010, DARK, True),
}


def main() -> None:
    OUT.mkdir(exist_ok=True)
    for name, (fn, grain, window, night) in SCENES.items():
        print(f"  {name}")
        ramp = Ramp(*window, OVER[window])
        im = fn(ramp, night)
        print(f"      ramp worst {ramp.report():.2f}:1")
        im = press(im, grain, seed=abs(hash(name)) % 9973)
        audit(name, im, ramp)
        im.save(OUT / f"{name}.png")


if __name__ == "__main__":
    main()
