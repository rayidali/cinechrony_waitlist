#!/usr/bin/env python3
"""
One film curve for every photograph on the site.

Thirteen photographs by thirteen photographers read as a stock library.
The same thirteen pushed through one curve read as one roll somebody shot
on one night, and that is the entire difference between "we bought images"
and "we have a look". So nothing goes into public/media by hand: it goes
through here.

The curve is a scanned print, not an Instagram filter:
  - blacks lifted to 0.055 and highlights rolled to 0.965 (film has no
    true black and no true white; screens do, which is what makes an
    ungraded photograph sit ON a page rather than in it)
  - a gentle smoothstep S for press contrast
  - split tone: highlights warm, shadows cool
  - saturation to 0.90

Usage:
    python3 scripts/grade-photos.py sources.tsv

sources.tsv is TAB separated, one row per output file, no header:
    name <TAB> source-path <TAB> shape <TAB> zoom <TAB> cx <TAB> cy <TAB> exposure

    shape     sq (900x900) | po (1000x1250) | wi (2000x1120)
    zoom      1.0 = cover-crop; >1 crops in (use it to cut a baked-in
              print border, or to reach a photo floating on a mount)
    cx, cy    crop centre 0..1. cy defaults low-ish because faces sit
              high in almost every candid.
    exposure  1.0 = untouched; lift a near-black frame before grading or
              it renders as a rectangle at cell size

Then convert:
    cwebp -q 80 -m 6 out/NAME.png -o public/media/NAME.webp

Requires: pillow, numpy.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance

SHAPES = {"sq": (900, 900), "po": (1000, 1250), "wi": (2000, 1120)}
OUT = Path("out")


def grade(im: Image.Image) -> Image.Image:
    a = np.asarray(im).astype(np.float32) / 255.0
    lo, hi = 0.055, 0.965
    a = np.clip(lo + a * (hi - lo), 0, 1)
    a = a * a * (3 - 2 * a) * 0.34 + a * 0.66
    lum = (a @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32))[..., None]
    warm = np.array([1.045, 1.005, 0.945], dtype=np.float32)
    cool = np.array([0.975, 0.995, 1.055], dtype=np.float32)
    a = np.clip(a * (cool + (warm - cool) * lum), 0, 1)
    out = Image.fromarray((a * 255).astype(np.uint8))
    return ImageEnhance.Color(out).enhance(0.90)


def main(manifest: str) -> None:
    OUT.mkdir(exist_ok=True)
    for line in Path(manifest).read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        name, src, shape, zoom, cx, cy, ev = (line.split("\t") + ["1", "0.5", "0.42", "1"])[:7]
        zoom, cx, cy, ev = float(zoom), float(cx), float(cy), float(ev)
        tw, th = SHAPES[shape]

        im = Image.open(src).convert("RGB")
        if ev != 1.0:
            im = ImageEnhance.Brightness(im).enhance(ev)
        s = max(tw / im.width, th / im.height) * zoom
        im = im.resize((max(tw, round(im.width * s)), max(th, round(im.height * s))), Image.LANCZOS)
        left = min(max(0, round(im.width * cx - tw / 2)), im.width - tw)
        top = min(max(0, round(im.height * cy - th / 2)), im.height - th)
        grade(im.crop((left, top, left + tw, top + th))).save(OUT / f"{name}.png")
        print(f"{name}  {tw}x{th}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
