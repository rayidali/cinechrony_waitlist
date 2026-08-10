#!/usr/bin/env python3
"""
Screenprint a photograph onto a band.

    python3 scripts/band-scenes.py scenes.tsv

The bands were flat colour, then duotone gradients, and they still read as
"a plain background" — which is fair, because a gradient is still just the
colour. This puts a real photograph in them: a sunflower field, wildflowers,
a night sky, rolling hills. Scenery, on the reference boards, is what makes
a page feel like a printed thing rather than a website.

THE WHOLE TRICK IS THAT IT IS ONE INK.

The output is GREYSCALE remapped into [floor, 1.0] and composited with
`mix-blend-mode: multiply`. Multiply by a grey scales every channel
equally, so the hue and the chroma of the band survive exactly — the
photograph can only put more of the band's OWN ink down, never a new
colour. That is what a one-colour screenprint physically is, and it is why
this cannot fight the palette however strong you push it. A photograph
dropped in at full colour would be a second palette arriving unannounced.

It is also the reason the floor matters more than it looks. Multiply only
ever darkens, so:

  - light paper + dark type  → the field gets DARKER and contrast FALLS.
    This is the one dangerous direction, hence floor 0.88 for paper bands.
  - dark field + light type  → the field gets darker and contrast RISES.
    Safe, so saturated bands take a much harder screen.

`contrast.mjs` is CSS-only and cannot see an image, so it will measure the
un-multiplied band and report a field lighter than the real one. The floor
is what makes that proxy honest; see the note in globals.css for the
measured worst case, which was sampled off rendered pixels rather than
argued.

scenes.tsv is TAB separated, one row per output, no header:
    name <TAB> source <TAB> floor <TAB> cy <TAB> gamma

    floor   darkest multiplier, 0..1. 0.88 paper, ~0.72 saturated.
    cy      crop centre 0..1 vertically (skies sit high, fields low)
    gamma   <1 lifts midtones so only the true darks print; >1 inks more

Requires: pillow, numpy.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

OUT = Path("out")
SIZE = (2000, 1200)


def screen(im: Image.Image, floor: float, gamma: float) -> Image.Image:
    g = np.asarray(im.convert("L")).astype(np.float32) / 255.0
    # normalise first: an already-dark photograph and an already-bright one
    # must both land on the same ink range, or the four bands screen at four
    # different strengths and stop reading as one press run
    lo, hi = float(np.percentile(g, 1)), float(np.percentile(g, 99))
    if hi - lo < 1e-3:
        hi = lo + 1e-3
    g = np.clip((g - lo) / (hi - lo), 0, 1)
    g = np.power(g, gamma)
    return Image.fromarray((np.clip(floor + g * (1.0 - floor), 0, 1) * 255).astype(np.uint8))


def main(manifest: str) -> None:
    OUT.mkdir(exist_ok=True)
    for line in Path(manifest).read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        name, src, floor, cy, gamma = (line.split("\t") + ["0.88", "0.5", "1"])[:5]
        floor, cy, gamma = float(floor), float(cy), float(gamma)

        im = Image.open(src).convert("RGB")
        tw, th = SIZE
        s = max(tw / im.width, th / im.height)
        im = im.resize((max(tw, round(im.width * s)), max(th, round(im.height * s))), Image.LANCZOS)
        left = (im.width - tw) // 2
        top = min(max(0, round(im.height * cy - th / 2)), im.height - th)
        out = screen(im.crop((left, top, left + tw, top + th)), floor, gamma)
        out.save(OUT / f"{name}.png")
        arr = np.asarray(out).astype(np.float32) / 255.0
        print(f"{name}  {tw}x{th}  ink {arr.min():.3f}..{arr.max():.3f}  mean {arr.mean():.3f}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
