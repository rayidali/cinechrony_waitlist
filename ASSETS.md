# What the site still needs from a human

**One open slot, and it is deliberately open.** The "reel 02 · the grab"
section has no image under its three beats: the scan capture came out on
10.08 because you are shooting something better for it. Everything else is
filled: five real captures of the shipped app, twenty-four graded
photographs and one drawn mural in fifteen slices, no placeholder frames
anywhere.

To wire anything up: drop the file in `public/media/`, then set its `src`
in the `media` map in `src/lib/site.ts`. The mural is the one exception,
and section 3 says why: it is CSS backgrounds, so it lives in
`globals.css` instead.

---

## 1. The grab section's visual (YOU ARE MAKING THIS)

**Where it goes:** under the three beats in "one reel in. every film out."
The section currently ends on the beats, which is a clean stop rather than
a hole, so there is no rush and nothing looks broken while you work.

**What the slot wants:** the scan actually happening. The old capture was
a still of the finished result, which is the least interesting frame of a
forty-second event. `app-grab` is still registered in `media`, so a new
still drops straight in; a video needs the `kind: "video"` slot and the
film frame putting back (see below).

---

## 2. The demo film: removed, and available on request

The `demo-hero` video slot and the film-frame plate that held it came out
on 10.08. It was a 16:9 black rectangle captioned AWAITING CAPTURE sitting
on the one screen that has to feel finished: a placeholder advertising its
own absence.

**If you shoot it, say so and it goes back in**: the slot, the sprocket
rails, the cue mark and the slate are one commit away in the history.

**Worth knowing:** this is the same take as the fresh scan the App Store
submission needs. One recording settles both.

- One continuous take, 30 to 45 seconds. No cuts, no captions, no music.
- Share a reel to cinechrony from Instagram or TikTok, let the scan run on
  screen, show the films arriving with their ratings, end on the list with
  the clip still attached to a film.
- MP4 (H.264), 1080p or a clean phone screen recording. It autoplays muted
  and loops, so it has to read with the sound off.
- Under about 8 MB if you can. Trim dead air at both ends.
- No notification banners, no low battery, nothing personal in frame.

---

## 3. The photographs: filled, and worth replacing eventually

Twenty-four frames are live: eleven in the hero calendar's film cells,
seven in the crew wall on the rust band (it was ten across three rows until
10.08; three rows read as a mood board, and crew-4, crew-5 and crew-9 are
benched in `media` rather than deleted), one behind the red poster band,
and **five cutouts**: people lifted out of their backgrounds and pasted on
top of the layout (a figure with a camcorder over the hero calendar, a hand
with a popcorn box, a hand with a disposable camera, four pairs of legs
dangling over a band seam, five friends sitting on another one). The wide
photograph that used to sit under the calendar is gone; a cutout is what
replaced it, and the difference is that a rectangle sits NEXT TO a design
while a cutout stands in front of it. They are all
**free-licence frames from Unsplash**, chosen for the film-camera feeling
on the reference boards: flash at night, grain, backs of heads, a drive-in
sign, a rooftop screening, a garden projector, a red cinema, popcorn.

**The band backgrounds are not photographs at all** (11.08), and they are
not four scenes either. They were, briefly: greyscale stills multiplied
into each band in one ink, which was safe for the palette by construction
and invisible for exactly the same reason, because multiplying a grey into
a colour can only ever lay down more of that colour. Then four painted
landscapes pinned to the foot of their bands with the sky continuing above
as flat colour, which on the 2200px band was 60% flat colour with a
picture along the bottom edge.

`scripts/paint-mural.py` paints **one** landscape now, from the top of the
page to the bottom of the footer, and cuts it into a slice per band:
morning sky, a hedgerow, into the shade, a sunflower field, the sunset, a
wildflower meadow, dusk, a lake, deep night, first light.

**It is painted the way the reference is painted, which took two goes.**
The first drew gradient skies, clouds built from circles, a disc sun and
stippled dot fields: a flat vector poster, not this. The reference is flat
saturated colour, one diagonal horizon, everything else smeared along that
diagonal like a long exposure from a moving car, and heavy paper tooth over
the whole pull. So each slice is a flat plate that is never blurred, a
drift layer that is blurred hard, and a third layer for the car, which at
the smear length that turns scrub into wisps would otherwise vanish.

**One thing to know before you touch it: the order is load-bearing.** Each
slice's bottom row is the next slice's top row, so moving a band in
`page.tsx` without moving its slice breaks the join. The build prints the
two colours at every seam and says whether it is a `match` (same register)
or a `horizon` (the register flips, and no colour is legal on both sides).

**Two honest caveats, both yours to weigh:**

1. **They are the right photographs of the wrong people.** The site now
   says "this is the crew" using seven groups of strangers in the wall and
   five more cut out and pasted over the layout. For a product whose whole
   pitch is *your friends*, your own camera roll beats this on the only
   axis that matters. If you have twenty candid frames from real nights,
   they are a straight upgrade and I will swap them in.
2. **Licensing, and it is sharper for the cutouts.** The Unsplash licence
   covers commercial use with no attribution, but it does not grant rights
   to the *people depicted*: nobody signed a model release. That is how
   most indie sites work and the exposure is small. It is worth noting the
   cutouts raise it a little rather than leaving it flat: a face in a 110px
   calendar cell and a person lifted out of their background and printed
   360px tall over the hero are not quite the same use, and the second one
   is the more identifiable.

**If you replace them,** put the originals somewhere and run them through
the grader rather than dropping them in raw:

```bash
python3 scripts/grade-photos.py sources.tsv     # rectangles → out/*.png
cwebp -q 80 -m 6 out/crew-1.png -o public/media/crew-1.webp
```

A cutout is two steps, and the first one is free: Vision's subject
segmentation ships in macOS, so there is nothing to install:

```bash
swift scripts/cutout.swift shot.jpg raw.png     # lift the figure
python3 scripts/make-cutouts.py cutouts.tsv     # grade + die-cut trim
cwebp -q 82 -m 6 -alpha_q 100 out/cut-legs.png -o public/media/cut-legs.webp
```

Pick sources with **air around the subject**. A photograph already cropped
tight to a person produces a cutout with flat edges where the frame was,
which reads as a crop rather than a cut and is the one failure mode of the
whole pipeline. `cutout.swift` exits 3 and says `NO_SUBJECT` when Vision
finds nobody, rather than writing a silent empty file.

The mural needs no source material, only a rebuild:

```bash
python3 scripts/paint-mural.py                  # fifteen PNGs into out/
for f in out/scene-*.png; do n=$(basename "$f" .png); \
  cwebp -q 62 -m 6 -sharp_yuv "$f" -o "public/media/$n.webp"; done
```

Two things it will not let you do. It refuses to write a slice carrying a
colour under 4.5:1 against the ink of its own band, measured rather than
approximated by a lightness window, and it
re-measures the rendered pixels afterwards because grain moves them, so a
picture you like but cannot read fails at build time rather than at review
time. It also prints each tile's horizontal seam width, because the slices
repeat sideways on a wide screen and a tile that does not meet itself
prints a scar down the page.

The one curve is the whole point: it is what stops a set of photographs
from different cameras reading as a stock library. A frame dropped in
ungraded will stick out immediately, and you will see it before you can
name it. Formats: hero cells 1:1 (900×900), crew wall 4:5 (1000×1250), the
poster still 2000×1120 wide, cutouts whatever shape the person is.

---

## Already handled, do not re-shoot

| Slot | State |
|---|---|
| `app-grab` | registered but NOT ON THE PAGE: see 1 above |
| `app-diary` | live: the month calendar |
| `app-list` | live, "date night" with the night pinned and the poster grid |
| `app-film` | live: a film open, showing "the clip that did it" |
| `app-year` | live: the year grid |
| `grid-1` … `grid-11` | live: the hero calendar's film cells |
| `crew-1` `crew-2` `crew-3` `crew-6` `crew-7` `crew-8` `crew-10` | live: the crew wall, two rows |
| `poster-still` | live: duotone under the friday line |
| the mural, ten slices | live, painted: `sky` `hedge` `shade` `field` `sunset` `meadow` `dusk` `lake` `night` `dawn`, in page order |
| five dark pulls | live, painted: `sky` `hedge` `field` `meadow` `dawn` again, for the five bands whose stock inverts |
| `poster-still` | BENCHED: the photograph under the friday line. The mural is the picture on that band now, and two of them is mud |
| `crew-4` `crew-5` `crew-9` | BENCHED: graded and on disk, off the page |
| `cut-camcorder` | live: over the hero calendar, breaking its left rule |
| `cut-popcorn` | live: top right of the hero calendar |
| `cut-legs` | live: sitting on the crew/grab seam |
| `cut-camera` | live: reaching in past "every film out." |
| `cut-bench` | live: sitting on the seam above movie night |
| `hero-strip` | GONE: the wide print under the calendar, replaced by the cutouts |

The five `app-*` came from `/tmp/asc-shots-d/raw` (the App Store shoot,
build 23), resized to 1440px tall and converted to WebP at quality 82. To
refresh them after a UI change, re-run `scripts/appstore-screenshots.tmp.mjs`
in the app repo and convert the same way.

## Links, not files

- **TestFlight**: wired. `site.testflightUrl` points at the live public
  link, so `/beta` shows the real join flow.
- **App Store badge + link**: add when the App Store release lands. It
  goes in the hero and the closing band, next to the TestFlight button.
