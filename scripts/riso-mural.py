#!/usr/bin/env python3
"""
Paint the mural. One continuous landscape, cut into one slice per band.

    python3 scripts/riso-mural.py            # writes out/scene-*.png

WHAT CHANGED, AND WHY IT HAD TO.

The previous set drew four scenes, pinned each to the FOOT of its band and
continued the sky above it as a flat colour. On a 900px band that is a
picture; on the 2200px band it is 60% flat colour with a picture along the
bottom, which is "a layer of background over the image" said precisely.
The cap existed because `cover` on a tall band magnifies the drawing 1.6x
and turns a stippled field into confetti. Both problems are the same
problem: the picture was being fitted to the band by scaling it.

It is fitted by HEIGHT now and only by height, and the band heights say
that works. Measured across 390 / 768 / 1440 / 1920, every band's height
moves by at most ~1.3x while its WIDTH moves by 5x. So each slice is drawn
at roughly its band's real height, laid down with

    background-size: auto 100%;  background-repeat: repeat-x;

which fills the band edge to edge, never distorts (the aspect is never
touched), and lands on the band's top and bottom edge EXACTLY. That last
part is the whole trick: because the fit is exact at both edges at every
viewport, slice N's bottom row meets slice N+1's top row at every viewport
too. The page is one painting, not nine.

THE SLICES TILE HORIZONTALLY. A wide desktop needs more width than a
picture drawn for a phone has, and repeat-x supplies it, so every drawing
routine here wraps in x: ridgelines are integer harmonics, clouds and
blooms are stamped again at x +/- W. Seamless is a property of the press,
not a thing to check for afterwards.

THE JOINS. Neighbours in the same register (both paper, or both saturated)
share an exact colour and the seam is invisible. Where the register flips
they cannot: the two windows below do not overlap, so no colour is legal
on both sides. That join is a hard horizon instead, which is not a
compromise but the most common line in this entire genre: near-black land
against a bright sky is the reference board's favourite picture.

CONTRAST IS DECIDED IN THE RAMP, NOT PATCHED AFTERWARDS.

  paper bands (dark ink on them)   L 0.66 .. 0.995
  saturated bands (light ink)      L 0.00 .. 0.50

Those are WCAG solved backwards. Ink is oklch 0.165, so a ground at oklch
L 0.635 is exactly 4.5:1; `--on-color` is oklch 0.97, so a ground at L
0.52 is exactly 4.5:1. Every colour is checked against its own window at
build time and the run FAILS rather than shipping a pretty band nobody can
read, then the rendered pixels are re-measured because grain moves them.
`check:contrast-pixels` scores the same thing off the real page.

The third window the previous set needed is gone: accent red is no longer
printed on a scened band at all (globals.css turns `--accent-text` into
currentColor under `:has(> .scene)`), because small red type on a painted
field was never going to be read anyway. Dropping it lifted the ceiling on
the night scenes from 0.325 to 0.50, which is most of their colour back.

Requires: pillow, numpy.
"""

from __future__ import annotations

import math
import random
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

OUT = Path("out")
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

PAPER = (0.66, 0.995)
DARK = (0.0, 0.50)
OVER = {PAPER: INK, DARK: ON_COLOR}


class Ramp:
    """The colours one slice is allowed to use, and the window they must
    stay inside. Asking for a colour outside the window raises: a scene
    that cannot be read is a bug at build time, not a judgement call at
    review time."""

    def __init__(self, window: tuple[float, float]):
        self.lo, self.hi = window
        self.over = OVER[window]
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
        for name, rgb, c in sorted(self.used, key=lambda u: u[2])[:4]:
            flag = "  <-- worst" if c == worst else ""
            print(f"      {name:<14} rgb{rgb}  {c:.2f}:1{flag}")
        return worst


# --------------------------------------------------------------- drawing ---
@dataclass
class Cv:
    """One slice's canvas. Every helper works in 0..1 coordinates against
    it, so a routine written for the 90px marquee strip also draws the
    1700px meadow without a single number changing."""

    im: Image.Image
    w: int  # supersampled width
    h: int  # supersampled height

    @property
    def d(self) -> ImageDraw.ImageDraw:
        return ImageDraw.Draw(self.im)


def canvas(w: int, h: int, stops: list[tuple[float, tuple[int, int, int]]]) -> Cv:
    """A vertical gradient, drawn one row at a time. Skies are the only
    place a gradient belongs here; everything else is a flat field."""
    W, H = w * SS, h * SS
    im = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(im)
    for y in range(H):
        t = y / (H - 1)
        for i in range(len(stops) - 1):
            p0, c0 = stops[i]
            p1, c1 = stops[i + 1]
            if p0 <= t <= p1 or i == len(stops) - 2:
                k = 0 if p1 == p0 else min(1, max(0, (t - p0) / (p1 - p0)))
                d.line([(0, y), (W, y)], fill=tuple(round(c0[j] + (c1[j] - c0[j]) * k) for j in range(3)))
                break
    return Cv(im, W, H)


def ridgeline(cv: Cv, seed: int, amp: float, waves: int) -> list[float]:
    """A hill silhouette: a few sines added together, one height per
    column. The frequencies are INTEGERS so the line meets itself at the
    tile edge; a ridge that does not wrap is a visible vertical scar every
    time the slice repeats across a wide screen."""
    rng = random.Random(seed)
    parts = [(k + 1, rng.uniform(0, math.tau), 1 / (k + 1)) for k in range(waves)]
    tot = sum(w for _, _, w in parts)
    return [
        sum(w * math.sin(math.tau * f * (x / cv.w) + p) for f, p, w in parts) / tot * amp
        for x in range(cv.w)
    ]


def hill(cv: Cv, top: float, colour, seed: int, amp: float, waves: int = 3) -> None:
    """Fill everything below a ridgeline. Drawn as one polygon so the edge
    is a real hard edge, which is what separates a printed field from a
    blurred photograph."""
    ys = ridgeline(cv, seed, amp * cv.h, waves)
    base = top * cv.h
    pts = [(x, base + ys[x]) for x in range(cv.w)]
    cv.d.polygon(pts + [(cv.w, cv.h), (0, cv.h)], fill=colour)


def wrapped(cv: Cv, draw, cx: float, span: float) -> None:
    """Stamp a shape at cx, and again one tile over if it crosses an edge.
    This is the entire tiling discipline: nothing is clipped, everything
    that leaves the right edge arrives at the left."""
    draw(cx)
    if cx - span < 0:
        draw(cx + cv.w)
    elif cx + span > cv.w:
        draw(cx - cv.w)


def cloud(cv: Cv, cx: float, cy: float, w: float, h: float, colour, seed: int) -> None:
    """A flat cumulus: a union of circles on a baseline with a flat bottom.
    This is how every cloud on the reference boards is built, and the flat
    bottom is the whole tell."""
    rng = random.Random(seed)
    cx, cy, w, h = cx * cv.w, cy * cv.h, w * cv.w, h * cv.h
    lobes = rng.randint(6, 8)
    # geometry decided once, then stamped at every wrapped position, or the
    # two halves of a cloud straddling the seam would be different clouds
    plan = []
    for i in range(lobes):
        t = i / (lobes - 1)
        r = h * (0.42 + 0.58 * math.sin(math.pi * t) ** 0.8) * rng.uniform(0.86, 1.18)
        plan.append((t, r, rng.uniform(-0.1, 0.1) * h))

    def stamp(x0: float) -> None:
        for t, r, jitter in plan:
            x = x0 - w / 2 + w * t
            y = cy - r * 0.28 + jitter
            cv.d.ellipse([x - r, y - r, x + r, y + r], fill=colour)
        cv.d.rectangle([x0 - w / 2, cy, x0 + w / 2, cy + h * 0.34], fill=colour)

    wrapped(cv, stamp, cx, w * 0.75)


def disc(cv: Cv, cx: float, cy: float, r: float, colour) -> None:
    cx, cy, r = cx * cv.w, cy * cv.h, r * cv.w
    wrapped(cv, lambda x: cv.d.ellipse([x - r, cy - r, x + r, cy + r], fill=colour), cx, r)


def stipple(cv: Cv, y0: float, y1: float, colours: list, seed: int, n: int,
            r0: float, r1: float, under=None) -> None:
    """Flower heads. Density and size both grow toward the bottom, which is
    the only perspective cue a flat picture gets.

    `under` is a foliage pass laid down first. Mixing the green into the
    same random draw as the blooms gives confetti: leaves BESIDE flowers at
    the same depth. Putting it underneath gives a field: green showing
    through the gaps, which is where green actually is."""
    rng = random.Random(seed)
    passes = ([(under, int(n * 0.55), 1.15)] if under else []) + [(None, n, 1.0)]
    for fill, count, scale in passes:
        for _ in range(count):
            t = rng.random() ** 0.62  # bias toward the near edge
            y = (y0 + (y1 - y0) * t) * cv.h
            x = rng.random() * cv.w
            r = (r0 + (r1 - r0) * t) * cv.w * rng.uniform(0.7, 1.34) * scale
            c = fill or rng.choice(colours)
            wrapped(cv, lambda px, r=r, y=y, c=c: cv.d.ellipse(
                [px - r, y - r * 0.86, px + r, y + r * 0.86], fill=c), x, r)


def stars(cv: Cv, y1: float, colour, seed: int, n: int) -> None:
    rng = random.Random(seed)
    for _ in range(n):
        x, y = rng.random() * cv.w, rng.random() * y1 * cv.h
        r = rng.uniform(1.4, 3.4) * SS
        cv.d.ellipse([x - r, y - r, x + r, y + r], fill=colour)


def striations(cv: Cv, y0: float, y1: float, colour, seed: int, n: int) -> None:
    """Long horizontal marks. What makes a rectangle of blue read as water
    is the surface, not the reflection: two earlier attempts drew the sun's
    path as the point of the lake and both read as a staircase, because a
    widening cone of marks on an empty rectangle IS a triangle whatever you
    do to its edges."""
    rng = random.Random(seed)
    for _ in range(n):
        y = rng.uniform(y0, y1) * cv.h
        x0 = rng.uniform(-0.05, 0.9) * cv.w
        x1 = x0 + rng.uniform(0.12, 0.46) * cv.w
        th = rng.uniform(0.004, 0.010) * cv.h
        cv.d.rectangle([x0, y, x1, y + th], fill=colour)
        if x1 > cv.w:
            cv.d.rectangle([x0 - cv.w, y, x1 - cv.w, y + th], fill=colour)


# ------------------------------------------------------------- finishing ---
def press(cv: Cv, w: int, h: int, grain: float, seed: int) -> Image.Image:
    """Take the drawing off the press: shrink, misregister, grain.

    The 1px channel offset is the cheapest and most convincing print tell
    there is: two passes of a real press never line up perfectly, and a
    picture where they do reads as a screen rather than a sheet. It is
    applied with wraparound so it does not leave a one-pixel stripe of raw
    channel down the tile seam."""
    im = cv.im.resize((w, h), Image.LANCZOS)
    r, g, b = im.split()
    a_r = np.roll(np.asarray(r), -1, axis=1)
    a_b = np.roll(np.asarray(b), 1, axis=1)
    im = Image.merge("RGB", (Image.fromarray(a_r), g, Image.fromarray(a_b)))

    rng = np.random.default_rng(seed)
    a = np.asarray(im).astype(np.float32)
    # two frequencies: fine tooth, and the coarse blotch of uneven ink
    fine = rng.normal(0, grain * 255, a.shape[:2])
    coarse = rng.normal(0, grain * 255 * 1.5, (max(2, h // 12), max(2, w // 12)))
    coarse = np.asarray(
        Image.fromarray(coarse.astype(np.float32), mode="F").resize((w, h), Image.BICUBIC)
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


def seam(im: Image.Image) -> float:
    """How far the left edge is from the right one, in mean 8-bit channel
    distance. These slices repeat-x on a wide screen, so a tile that does
    not meet itself prints a vertical scar down the page. Everything is
    drawn to wrap; this is the number that proves it did."""
    a = np.asarray(im).astype(np.float32)
    return float(np.abs(a[:, 0] - a[:, -1]).mean())


def joins(name: str, im: Image.Image) -> tuple[tuple[int, int, int], tuple[int, int, int]]:
    """The mean of the top row and of the bottom row. These are the two
    numbers the mural is stitched with: the bottom of one slice has to be
    the top of the next, and printing them is how a mismatch gets caught by
    reading the build log instead of by scrolling the site."""
    a = np.asarray(im).astype(np.float32)
    return (tuple(int(v) for v in a[0].mean(axis=0)), tuple(int(v) for v in a[-1].mean(axis=0)))


# ============================================================== THE MURAL ==
# One landscape, top of the page to the bottom of the footer. Light theme
# runs a full day: morning sky, a hedgerow, into the shade, a sunflower
# field, the sunset, a wildflower meadow, dusk, the lake, deep night, and
# first light in the footer. Dark theme is the same walk after sunset, so
# the four paper bands that invert get a second pull rather than a
# compromise: the page has a time of day.


def sc_sky(c: Ramp, night: bool) -> Cv:
    """Hero. Almost all sky, because the headline and the calendar live
    here: the quiet part of a picture goes where the words go."""
    n = night
    cv = canvas(1800, 850, [
        (0.00, c("zenith", *((0.130, 0.055, 280) if n else (0.700, 0.105, 248)))),
        (0.52, c("sky mid", *((0.230, 0.075, 268) if n else (0.860, 0.070, 234)))),
        (0.86, c("horizon", *((0.330, 0.090, 250) if n else (0.965, 0.022, 210)))),
    ])
    if n:
        stars(cv, 0.62, c("star", 0.400, 0.020, 250), 3, 150)
    white = c("cloud", *((0.285, 0.070, 262) if n else (0.990, 0.008, 96)))
    cloud(cv, 0.09, 0.31, 0.19, 0.100, white, 11)
    cloud(cv, 0.31, 0.19, 0.15, 0.075, white, 12)
    cloud(cv, 0.53, 0.36, 0.18, 0.090, white, 13)
    cloud(cv, 0.74, 0.22, 0.16, 0.078, white, 14)
    cloud(cv, 0.93, 0.42, 0.17, 0.085, white, 15)
    hill(cv, 0.885, c("far hill", *((0.245, 0.055, 200) if n else (0.830, 0.050, 168))), 21, 0.035)
    hill(cv, 0.945, c("field", *((0.185, 0.050, 160) if n else (0.760, 0.090, 138))), 22, 0.022, waves=2)
    return cv


def sc_hedge(c: Ramp, night: bool) -> Cv:
    """The marquee strip, 90px of hedgerow. It carries the same field
    colour the hero ends on, so that join is a colour match rather than a
    horizon, and it is the only slice on the page with no sky in it.

    THE ONE SLICE WHOSE NIGHT PULL IS STILL A PAPER PULL. The marigold
    band does not invert: `--on-color-dark` is oklch 0.17 in both themes,
    so the ink stays dark and this strip stays above 0.66 whatever the
    hour. It cannot be a night field, so it is a dusk one instead: the
    same hedgerow at the floor of its window with the warmth taken out.
    Without it the page walks from a night sky into a sunlit meadow and
    back out again, ninety pixels of the wrong time of day."""
    n = night
    cv = canvas(1950, 90, [
        (0.00, c("field", *((0.700, 0.055, 168) if n else (0.760, 0.090, 138)))),
        (1.00, c("field deep", *((0.665, 0.055, 176) if n else (0.700, 0.095, 132)))),
    ])
    stipple(cv, 0.10, 1.02, [
        c("bloom", *((0.735, 0.045, 250) if n else (0.870, 0.105, 92))),
        c("bloom warm", *((0.695, 0.050, 288) if n else (0.815, 0.120, 74))),
        c("bloom pale", *((0.790, 0.030, 240) if n else (0.940, 0.060, 96))),
    ], 33, n=420, r0=0.0028, r1=0.0075,
        under=c("leaf", *((0.670, 0.045, 186) if n else (0.680, 0.100, 146))))
    return cv


def sc_shade(c: Ramp, night: bool) -> Cv:
    """The crew wall. The one tall dark band, and the only one lit from
    below: a canopy overhead, a lit horizon at the foot. It is what you
    see standing under trees looking out, and it puts the brightest thing
    in the slice at the bottom edge, where the next band's sky begins."""
    cv = canvas(1500, 1400, [
        (0.00, c("canopy dark", 0.165, 0.050, 148)),
        (0.34, c("canopy", 0.215, 0.065, 138)),
        (0.62, c("air", 0.300, 0.080, 60)),
        (0.86, c("glow", 0.470, 0.110, 52)),
    ])
    disc(cv, 0.50, 0.905, 0.055, c("low sun", 0.495, 0.100, 60))
    hill(cv, 0.720, c("ridge far", 0.330, 0.075, 40), 41, 0.030, waves=4)
    hill(cv, 0.790, c("ridge mid", 0.245, 0.070, 30), 42, 0.024)
    hill(cv, 0.855, c("ridge near", 0.170, 0.055, 26), 43, 0.018, waves=2)
    # the canopy hanging into the top of the frame, drawn as a ridge on its
    # back so the leaf edge points downward
    leaf = c("leaf", 0.175, 0.055, 145)
    ys = ridgeline(cv, 44, 0.055 * cv.h, 4)
    cv.d.polygon([(x, 0.235 * cv.h + ys[x]) for x in range(cv.w)] + [(cv.w, 0), (0, 0)], fill=leaf)
    stipple(cv, 0.02, 0.22, [leaf, c("leaf lit", 0.250, 0.070, 136)], 45,
            n=520, r0=0.006, r1=0.016)
    return cv


def sc_field(c: Ramp, night: bool) -> Cv:
    """The grab band. A sunflower field under a deep blue zenith, the sky
    paling as it drops to the horizon, which is both how a sky works and
    how this slice gets from its own darkest legal colour at the top to
    its brightest in the middle."""
    n = night
    cv = canvas(2200, 800, [
        (0.00, c("zenith", *((0.115, 0.050, 274) if n else (0.665, 0.115, 250)))),
        (0.40, c("sky mid", *((0.215, 0.080, 300) if n else (0.880, 0.065, 232)))),
        (0.66, c("horizon", *((0.330, 0.105, 348) if n else (0.960, 0.045, 96)))),
    ])
    if n:
        stars(cv, 0.34, c("star", 0.415, 0.022, 280), 51, 80)
    disc(cv, 0.50, 0.250, 0.038, c("sun", *((0.420, 0.115, 60) if n else (0.930, 0.110, 84))))
    white = c("cloud", *((0.330, 0.085, 330) if n else (0.990, 0.010, 92)))
    cloud(cv, 0.11, 0.240, 0.16, 0.100, white, 52)
    cloud(cv, 0.30, 0.145, 0.13, 0.075, white, 53)
    cloud(cv, 0.66, 0.185, 0.15, 0.085, white, 54)
    cloud(cv, 0.86, 0.410, 0.15, 0.082, white, 59)
    hill(cv, 0.615, c("far hill", *((0.260, 0.055, 168) if n else (0.860, 0.050, 132))), 55, 0.032)
    hill(cv, 0.680, c("near hill", *((0.205, 0.050, 150) if n else (0.795, 0.080, 140))), 56, 0.024)
    hill(cv, 0.750, c("field", *((0.235, 0.070, 92) if n else (0.870, 0.100, 96))), 57, 0.016, waves=2)
    stipple(cv, 0.76, 1.02, [
        c("bloom", *((0.350, 0.105, 84) if n else (0.860, 0.130, 86))),
        c("bloom warm", *((0.300, 0.100, 66) if n else (0.815, 0.130, 72))),
        c("bloom pale", *((0.410, 0.090, 92) if n else (0.940, 0.080, 92))),
    ], 58, n=1800, r0=0.0030, r1=0.0125,
        under=c("leaf", *((0.180, 0.050, 152) if n else (0.720, 0.090, 146))))
    return cv


def sc_sunset(c: Ramp, night: bool) -> Cv:
    """The poster band. The board's single loudest picture: a hot sky and
    a near-black land, one hard line between them. It is also where the
    day turns, so every slice below this one is an evening."""
    cv = canvas(1850, 480, [
        (0.00, c("sky top", 0.335, 0.140, 22)),
        (0.46, c("sky hot", 0.470, 0.165, 42)),
        (0.74, c("sky low", 0.430, 0.150, 30)),
    ])
    disc(cv, 0.50, 0.700, 0.058, c("sun", 0.495, 0.130, 62))
    cloud(cv, 0.17, 0.330, 0.18, 0.115, c("cloud", 0.395, 0.130, 18), 61)
    cloud(cv, 0.50, 0.215, 0.13, 0.080, c("cloud high", 0.355, 0.125, 8), 62)
    cloud(cv, 0.84, 0.300, 0.17, 0.105, c("cloud", 0.395, 0.130, 18), 65)
    hill(cv, 0.760, c("ridge", 0.215, 0.075, 30), 63, 0.040, waves=4)
    hill(cv, 0.870, c("land", 0.135, 0.050, 34), 64, 0.026)
    return cv


def sc_meadow(c: Ramp, night: bool) -> Cv:
    """What it does. The tallest band on the page and the board's most
    repeated picture: wildflowers, a lot of sky, three film screenshots
    printed over the top of it."""
    n = night
    cv = canvas(1700, 1700, [
        (0.00, c("zenith", *((0.120, 0.055, 288) if n else (0.680, 0.110, 252)))),
        (0.34, c("sky mid", *((0.205, 0.070, 272) if n else (0.855, 0.075, 240)))),
        (0.60, c("horizon", *((0.300, 0.075, 256) if n else (0.965, 0.028, 220)))),
    ])
    if n:
        stars(cv, 0.40, c("star", 0.395, 0.020, 262), 71, 130)
    white = c("cloud", *((0.270, 0.065, 268) if n else (0.990, 0.010, 250)))
    cloud(cv, 0.09, 0.180, 0.19, 0.062, white, 72)
    cloud(cv, 0.32, 0.290, 0.17, 0.055, white, 73)
    cloud(cv, 0.55, 0.150, 0.18, 0.058, white, 74)
    cloud(cv, 0.76, 0.330, 0.16, 0.052, white, 79)
    cloud(cv, 0.95, 0.215, 0.17, 0.056, white, 80)
    hill(cv, 0.580, c("far hill", *((0.245, 0.050, 186) if n else (0.790, 0.070, 168))), 75, 0.030)
    hill(cv, 0.645, c("near hill", *((0.195, 0.045, 158) if n else (0.720, 0.085, 150))), 76, 0.024)
    hill(cv, 0.705, c("meadow", *((0.225, 0.055, 20) if n else (0.905, 0.055, 26))), 77, 0.016, waves=2)
    stipple(cv, 0.71, 1.02, [
        c("bloom", *((0.275, 0.080, 8) if n else (0.815, 0.090, 14))),
        c("bloom deep", *((0.255, 0.080, 358) if n else (0.760, 0.100, 6))),
        c("bloom pale", *((0.305, 0.055, 22) if n else (0.945, 0.045, 24))),
    ], 78, n=2300, r0=0.0025, r1=0.0105,
        under=c("stem", *((0.170, 0.042, 156) if n else (0.715, 0.085, 152))))
    return cv


def sc_dusk(c: Ramp, night: bool) -> Cv:
    """Movie night. Dusk going over, a moon, a bank of flat cloud. It ends
    on the ridge colour the lake slice begins with, so the three evening
    bands below are one unbroken picture."""
    cv = canvas(2250, 520, [
        (0.00, c("sky top", 0.215, 0.090, 292)),
        (0.44, c("sky mid", 0.345, 0.150, 266)),
        (0.74, c("sky low", 0.440, 0.130, 246)),
    ])
    stars(cv, 0.70, c("star", 0.470, 0.030, 250), 81, 130)
    disc(cv, 0.52, 0.400, 0.026, c("moon", 0.470, 0.065, 92))
    band = c("cloud", 0.410, 0.105, 268)
    cloud(cv, 0.14, 0.560, 0.19, 0.080, band, 82)
    cloud(cv, 0.40, 0.680, 0.17, 0.068, band, 83)
    cloud(cv, 0.70, 0.545, 0.18, 0.075, band, 87)
    cloud(cv, 0.92, 0.700, 0.16, 0.062, c("cloud low", 0.450, 0.100, 254), 84)
    hill(cv, 0.840, c("ridge far", 0.280, 0.075, 258), 85, 0.032)
    hill(cv, 0.925, c("ridge near", 0.195, 0.055, 244), 86, 0.020)
    return cv


def sc_lake(c: Ramp, night: bool) -> Cv:
    """The year. Ridges receding and the water holding the last of it.

    ORDER IS THE WHOLE PICTURE. An early cut drew the lake before the
    ridges and buried it: a flat picture has no depth buffer, so
    back-to-front IS the composition."""
    cv = canvas(2150, 700, [
        (0.00, c("sky top", 0.195, 0.055, 244)),
        (0.34, c("sky mid", 0.330, 0.095, 300)),
        (0.52, c("sky low", 0.440, 0.100, 40)),
    ])
    disc(cv, 0.50, 0.455, 0.032, c("sun", 0.470, 0.105, 58))
    cloud(cv, 0.20, 0.300, 0.17, 0.062, c("cloud", 0.400, 0.090, 350), 91)
    cloud(cv, 0.78, 0.260, 0.16, 0.058, c("cloud", 0.400, 0.090, 350), 93)
    cloud(cv, 0.05, 0.185, 0.14, 0.048, c("cloud high", 0.360, 0.090, 300), 92)
    hill(cv, 0.535, c("ridge far", 0.395, 0.065, 176), 101, 0.030, waves=4)
    hill(cv, 0.595, c("ridge mid", 0.300, 0.065, 160), 102, 0.024)
    cv.d.rectangle([0, 0.645 * cv.h, cv.w, cv.h], fill=c("water", 0.355, 0.085, 250))
    striations(cv, 0.655, 0.960, c("ripple", 0.400, 0.080, 246), 117, 26)
    rng = random.Random(118)
    glint = c("glint", 0.450, 0.090, 58)
    for i in range(5):
        y = (0.672 + i * 0.050) * cv.h
        half = (0.016 + i * 0.009) * cv.w * rng.uniform(0.8, 1.15)
        cv.d.rectangle([0.50 * cv.w - half, y, 0.50 * cv.w + half, y + 0.008 * cv.h], fill=glint)
    hill(cv, 0.955, c("shore", 0.180, 0.050, 152), 103, 0.016, waves=2)
    return cv


def sc_night(c: Ramp, night: bool) -> Cv:
    """The close. Deepest point of the walk, and the only slice with no
    horizon in it at all: the CTA sits on open sky."""
    # THE ONLY SLICE BUILT UNDER ITS OWN WINDOW RATHER THAN INSIDE IT.
    # 0.50 is the ceiling for `--on-color`, oklch 0.97, and the two buttons
    # printed on this one are cream at oklch 0.94: dimmer ink needs a darker
    # ground, and check:contrast-pixels found them at 4.29:1 on the version
    # that stopped at the window. A window is sized for the worst ink a band
    # is KNOWN to carry, so when a band carries something dimmer the window
    # is the wrong number and the measurement is the right one.
    cv = canvas(1900, 490, [
        (0.00, c("sky top", 0.145, 0.045, 252)),
        (0.55, c("sky mid", 0.200, 0.070, 288)),
        (1.00, c("sky low", 0.275, 0.090, 318)),
    ])
    stars(cv, 0.88, c("star", 0.420, 0.020, 268), 121, 260)
    cloud(cv, 0.22, 0.840, 0.20, 0.080, c("cloud", 0.245, 0.075, 300), 122)
    cloud(cv, 0.55, 0.905, 0.18, 0.072, c("cloud low", 0.280, 0.080, 320), 123)
    cloud(cv, 0.86, 0.800, 0.19, 0.076, c("cloud", 0.245, 0.075, 300), 124)
    return cv


def sc_dawn(c: Ramp, night: bool) -> Cv:
    """The footer, and the end of the walk. In light theme it is first
    light: the page runs a full day and finishes where it started, which
    is the only reason a cream footer under a night sky is not a mistake.
    In dark theme it is the deepest colour on the page instead."""
    n = night
    cv = canvas(2200, 560, [
        (0.00, c("sky top", *((0.115, 0.040, 280) if n else (0.680, 0.095, 302)))),
        (0.40, c("sky mid", *((0.165, 0.050, 300) if n else (0.860, 0.070, 20)))),
        (0.72, c("first light", *((0.245, 0.075, 34) if n else (0.965, 0.035, 68)))),
    ])
    if n:
        stars(cv, 0.52, c("star", 0.360, 0.018, 270), 131, 120)
    warm = c("cloud", *((0.195, 0.055, 300) if n else (0.930, 0.055, 34)))
    cloud(cv, 0.18, 0.310, 0.18, 0.085, warm, 132)
    cloud(cv, 0.50, 0.230, 0.15, 0.070, c("cloud high", *((0.160, 0.050, 290) if n else (0.880, 0.070, 24))), 133)
    cloud(cv, 0.81, 0.345, 0.17, 0.080, warm, 136)
    hill(cv, 0.790, c("ridge", *((0.145, 0.045, 240) if n else (0.790, 0.065, 96))), 134, 0.034, waves=4)
    hill(cv, 0.900, c("field", *((0.105, 0.035, 200) if n else (0.700, 0.090, 140))), 135, 0.022)
    return cv


# name -> (draw, grain, window, night register?)
SCENES = {
    "scene-sky": (sc_sky, 0.011, PAPER, False),
    "scene-sky-dark": (sc_sky, 0.009, DARK, True),
    "scene-hedge": (sc_hedge, 0.011, PAPER, False),
    "scene-hedge-dark": (sc_hedge, 0.011, PAPER, True),
    "scene-shade": (sc_shade, 0.009, DARK, True),
    "scene-field": (sc_field, 0.011, PAPER, False),
    "scene-field-dark": (sc_field, 0.009, DARK, True),
    "scene-sunset": (sc_sunset, 0.010, DARK, True),
    "scene-meadow": (sc_meadow, 0.011, PAPER, False),
    "scene-meadow-dark": (sc_meadow, 0.009, DARK, True),
    "scene-dusk": (sc_dusk, 0.010, DARK, True),
    "scene-lake": (sc_lake, 0.010, DARK, True),
    "scene-night": (sc_night, 0.010, DARK, True),
    "scene-dawn": (sc_dawn, 0.011, PAPER, False),
    "scene-dawn-dark": (sc_dawn, 0.009, DARK, True),
}


def main() -> None:
    OUT.mkdir(exist_ok=True)
    edges: dict[str, tuple] = {}
    for name, (fn, grain, window, night) in SCENES.items():
        print(f"  {name}")
        ramp = Ramp(window)
        cv = fn(ramp, night)
        w, h = cv.w // SS, cv.h // SS
        print(f"      {w}x{h}, ramp worst {ramp.report():.2f}:1")
        im = press(cv, w, h, grain, seed=abs(hash(name)) % 9973)
        audit(name, im, ramp)
        edges[name] = joins(name, im)
        gap = seam(im)
        print(f"      tile seam {gap:.1f}/255" + ("" if gap < 12 else "   <-- WIDE, it will show"))
        im.save(OUT / f"{name}.png")

    # The stitch, printed rather than assumed. Neighbours in the same
    # register should agree closely; a register flip is a hard horizon and
    # is EXPECTED to disagree, so this reports the numbers and does not
    # judge them.
    print("\n  the stitch (bottom of one slice -> top of the next)")
    for a, b in ORDER:
        if a not in edges or b not in edges:
            continue
        lo, hi = edges[a][1], edges[b][0]
        step = abs(rel_lum(lo) - rel_lum(hi))
        kind = "match" if step < 0.02 else "horizon"
        print(f"      {a:<18} -> {b:<18} rgb{lo} / rgb{hi}   {kind}")


ORDER = [
    ("scene-sky", "scene-hedge"),
    ("scene-hedge", "scene-shade"),
    ("scene-shade", "scene-field"),
    ("scene-field", "scene-sunset"),
    ("scene-sunset", "scene-meadow"),
    ("scene-meadow", "scene-dusk"),
    ("scene-dusk", "scene-lake"),
    ("scene-lake", "scene-night"),
    ("scene-night", "scene-dawn"),
]

if __name__ == "__main__":
    main()
