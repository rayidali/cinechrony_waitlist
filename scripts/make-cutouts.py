#!/usr/bin/env python3
"""
Turn a Vision matte into a die-cut sticker.

Two steps make a cutout, and this is the second:

    swift scripts/cutout.swift shot.jpg raw.png      # lift the figure
    python3 scripts/make-cutouts.py cutouts.tsv      # make it a sticker

WHY A WHITE EDGE. A figure with the background deleted and nothing else
done to it reads as a mistake — a photograph that failed to load its own
sky. The white edge is what makes it deliberate: it is the trim a die-cut
sticker leaves, and the eye has known that shape since Panini albums. It
also solves a real problem for free, which is that Vision's matte carries a
one-pixel fringe of whatever was behind the person, and a fringe hidden
under a 14px border is a fringe nobody will ever see.

The edge is a BLURRED-THEN-THRESHOLDED alpha, never a dilated one. A real
die cut does not follow individual hairs; it simplifies. Blurring first is
what produces that simplification, and it is the difference between a
sticker and a photograph with a white halo.

Everything still goes through the ONE film curve in grade-photos.py — a
cutout that skipped it would be the one photograph on the site lit
differently, which is exactly what the curve exists to prevent.

cutouts.tsv is TAB separated, one row per output, no header:
    name <TAB> matte.png <TAB> height <TAB> edge <TAB> exposure

    height    output height in px (width follows the silhouette)
    edge      white trim in px at THAT height; 0 for no sticker edge
    exposure  1.0 = untouched; lift a dark frame before grading

Then convert (alpha survives; -q 82 is where these stop shedding hair):
    cwebp -q 82 -m 6 -alpha_q 100 out/NAME.png -o public/media/NAME.webp

Requires: pillow, numpy.
"""
import importlib.util
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

# grade-photos.py is not importable by name (the hyphen), and copying the
# curve here would be how the two quietly drift apart.
_spec = importlib.util.spec_from_file_location("gp", Path(__file__).with_name("grade-photos.py"))
_gp = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_gp)

OUT = Path("out")
PAPER = (250, 246, 237)


def sticker(im: Image.Image, edge: int) -> Image.Image:
    """Graded figure on its own die-cut trim."""
    a = im.getchannel("A")

    # Harden the matte. Vision feathers its edge over ~3px and those pixels
    # still hold the old background; 0.34 -> 0 and 0.78 -> 1 drops the
    # faintest of them while leaving enough gradient for hair to survive.
    n = np.asarray(a).astype(np.float32) / 255.0
    a = Image.fromarray((np.clip((n - 0.34) / 0.44, 0, 1) * 255).astype(np.uint8))

    rgb = _gp.grade(im.convert("RGB"))
    fig = Image.merge("RGBA", (*rgb.split(), a))
    if edge <= 0:
        return fig

    pad = edge * 3
    fig = Image.new("RGBA", (fig.width + pad * 2, fig.height + pad * 2), (0, 0, 0, 0))
    fig.paste(Image.merge("RGBA", (*rgb.split(), a)), (pad, pad))

    cut = fig.getchannel("A").filter(ImageFilter.GaussianBlur(edge * 0.62))
    cut = cut.point(lambda v: 255 if v > 46 else 0)
    # one soft pass back over the hard threshold, so the trim has a cut
    # edge rather than a staircase
    cut = cut.filter(ImageFilter.GaussianBlur(0.7))

    out = Image.new("RGBA", fig.size, (0, 0, 0, 0))
    out.paste(Image.new("RGBA", fig.size, (*PAPER, 255)), (0, 0), cut)
    out.alpha_composite(fig)
    return out.crop(out.getchannel("A").getbbox())


def main(manifest: str) -> None:
    OUT.mkdir(exist_ok=True)
    for line in Path(manifest).read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        name, src, h, edge, ev = (line.split("\t") + ["520", "14", "1"])[:5]
        h, edge, ev = int(h), int(edge), float(ev)

        im = Image.open(src).convert("RGBA")
        im = im.crop(im.getchannel("A").getbbox())
        if ev != 1.0:
            rgb = ImageEnhance.Brightness(im.convert("RGB")).enhance(ev)
            im = Image.merge("RGBA", (*rgb.split(), im.getchannel("A")))

        # Work at output scale so `edge` means the same thing everywhere:
        # a trim specified in output pixels but cut on a 3000px matte comes
        # out as a hairline.
        s = h / im.height
        im = im.resize((max(1, round(im.width * s)), h), Image.LANCZOS)

        out = sticker(im, edge)
        out.save(OUT / f"{name}.png")
        print(f"{name}  {out.width}x{out.height}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
