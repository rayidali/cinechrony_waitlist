# What the site still needs from a human

Short list, and it got shorter. Every screenshot on the site is the shipped
app, and **every photograph slot is now filled** — thirteen film-look
frames, all graded through one curve. So nothing on the page is a
placeholder frame any more.

Exactly **one** thing is genuinely missing, and it is the only slot on the
site that still draws a hatched empty plate.

To wire anything up: drop the file in `public/media/`, then set its `src`
in the `media` map in `src/lib/site.ts`.

---

## 1. The demo film — `demo-hero` (video) — THE ONLY OPEN SLOT

**Where it goes:** the wide plate at the bottom of "one reel in. every film
out." Right now it is a black film frame with sprockets, a cue mark, a play
mark and a technical slate — designed, but empty.

**Why it is the last one:** it is the only place on the site where the hero
loop actually *moves*, and the loop is the product. Everything else is a
still of something that happens over forty seconds.

**Worth knowing:** this is the same take as the fresh scan the App Store
submission needs. One recording settles both — it produces the first real
pipeline data point since 03.08 and gives the site its film.

- One continuous take, 30 to 45 seconds. No cuts, no captions, no music.
- Share a reel to cinechrony from Instagram or TikTok, let the scan run on
  screen, show the films arriving with their ratings, end on the list with
  the clip still attached to a film.
- MP4 (H.264), 1080p or a clean phone screen recording. It autoplays muted
  and loops, so it has to read with the sound off.
- Under about 8 MB if you can. Trim dead air at both ends.
- No notification banners, no low battery, nothing personal in frame.

---

## 2. The photographs — filled, and worth replacing eventually

Thirteen frames are live: six in the hero calendar's film cells, six in the
crew wall on the rust band, one behind the red poster band. They are
**free-licence frames from Unsplash**, chosen for the film-camera feeling
on the reference boards — flash at night, grain, backs of heads, a marquee,
an outdoor screening, popcorn.

**Two honest caveats, both yours to weigh:**

1. **They are the right photographs of the wrong people.** The site now
   says "this is the crew" using six groups of strangers. For a product
   whose whole pitch is *your friends*, your own camera roll beats this on
   the only axis that matters. If you have twenty candid frames from real
   nights, they are a straight upgrade and I will swap them in.
2. **Licensing.** The Unsplash licence covers commercial use with no
   attribution, but it does not grant rights to the *people depicted* —
   nobody signed a model release. That is how most indie sites work and the
   exposure is small, but it is a real difference from photographs of
   friends who said yes.

**If you replace them,** put the originals somewhere and run them through
the grader rather than dropping them in raw:

```bash
python3 scripts/grade-photos.py sources.tsv     # writes out/*.png
cwebp -q 80 -m 6 out/crew-1.png -o public/media/crew-1.webp
```

The one curve is the whole point: it is what stops a set of photographs
from different cameras reading as a stock library. A frame dropped in
ungraded will stick out immediately, and you will see it before you can
name it. Formats: hero cells 1:1 (900×900), crew wall 4:5 (1000×1250), the
poster still 2000×1120 wide.

---

## Already handled, do not re-shoot

| Slot | State |
|---|---|
| `app-grab` | live — the scan result, five films from one reel |
| `app-diary` | live — the month calendar |
| `app-list` | live — a shared list with a night planned |
| `app-film` | live — a film open with the clip attached |
| `app-year` | live — the year grid |
| `grid-1` … `grid-6` | live — the hero calendar's film cells |
| `crew-1` … `crew-6` | live — the crew wall |
| `poster-still` | live — duotone under the friday line |

The five `app-*` came from `/tmp/asc-shots-d/raw` (the App Store shoot,
build 23), resized to 1440px tall and converted to WebP at quality 82. To
refresh them after a UI change, re-run `scripts/appstore-screenshots.tmp.mjs`
in the app repo and convert the same way.

## Links, not files

- **TestFlight** — wired. `site.testflightUrl` points at the live public
  link, so `/beta` shows the real join flow.
- **App Store badge + link** — add when the App Store release lands. It
  goes in the hero and the closing band, next to the TestFlight button.
