# What the site still needs from a human

**One open slot, and it is deliberately open.** The "reel 03 · the grab"
section has no image under its three beats — the scan capture came out on
10.08 because you are shooting something better for it. Everything else is
filled: six real captures of the shipped app and twenty-two graded
photographs, no placeholder frames anywhere.

To wire anything up: drop the file in `public/media/`, then set its `src`
in the `media` map in `src/lib/site.ts`.

---

## 1. The grab section's visual — YOU ARE MAKING THIS

**Where it goes:** under the three beats in "one reel in. every film out."
The section currently ends on the beats, which is a clean stop rather than
a hole — so there is no rush and nothing looks broken while you work.

**What the slot wants:** the scan actually happening. The old capture was
a still of the finished result, which is the least interesting frame of a
forty-second event. `app-grab` is still registered in `media`, so a new
still drops straight in; a video needs the `kind: "video"` slot and the
film frame putting back (see below).

---

## 2. The demo film — removed, and available on request

The `demo-hero` video slot and the film-frame plate that held it came out
on 10.08. It was a 16:9 black rectangle captioned AWAITING CAPTURE sitting
on the one screen that has to feel finished: a placeholder advertising its
own absence.

**If you shoot it, say so and it goes back in** — the slot, the sprocket
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

## 3. The photographs — filled, and worth replacing eventually

Twenty-two frames are live: eleven in the hero calendar's film cells, ten
in the crew wall on the rust band, one behind the red poster band. They are
**free-licence frames from Unsplash**, chosen for the film-camera feeling
on the reference boards — flash at night, grain, backs of heads, a drive-in
sign, a rooftop screening, a garden projector, a red cinema, popcorn.

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
| `app-grab` | registered but NOT ON THE PAGE — see 1 above |
| `app-diary` | live — the month calendar |
| `app-list` | live — "date night" with the night pinned and the poster grid |
| `app-film` | live — a film open, showing "the clip that did it" |
| `app-year` | live — the year grid |
| `grid-1` … `grid-11` | live — the hero calendar's film cells |
| `crew-1` … `crew-10` | live — the crew wall |
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
