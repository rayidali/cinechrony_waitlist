# What the site still needs from a human

Short list, because most of it is already done. The five product captures
are **real** now: they are the same App Store Connect shoot, converted to
WebP and wired up, so every screenshot on the site is the shipped app
rather than a drawing of it. Nothing on the page is waiting on a
screenshot.

Two things cannot be produced from this machine, and one of them is worth
doing this week.

To wire any of these up: drop the file in `public/media/`, then set its
`src` in the `media` map in `src/lib/site.ts` (for example
`src: "/media/demo-hero.mp4"`). The placeholder disappears on its own.

---

## 1. The demo film — `demo-hero` (video)

**Where it goes:** the wide plate at the bottom of "one reel in. every film
out." on the landing page. Right now it is a black plate with a play mark
and an honest caption.

**Why it is first:** it is the only place on the site where the hero loop
actually *moves*, and the loop is the product.

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

## 2. Six square photographs — `grid-1` … `grid-6`

**Where they go:** the film cells of the calendar grid in the hero, and
they are the single biggest upgrade available to this page.

**Read this before shooting anything:** the grid is composed to look
finished without them. Those six cells are solid poster inks today, which
is a real composition rather than a hole. So this is an improvement, not a
blocker, and a bad photograph is worse than the ink.

**What they should be:** the feeling on the reference boards — real, warm,
slightly grainy, a bit vintage. Not stock-photo people pointing at
laptops.

Good subjects, roughly in order of usefulness:

1. A phone held in one hand, mid-scroll, screen slightly blown out.
2. Friends on a sofa, lit only by a screen. Backs of heads are fine, better
   even.
3. A dark room with a projector or a TV throwing light on a wall.
4. Popcorn, a bowl, hands in it.
5. A cinema seat row, empty, house lights up.
6. A laptop or telly at night, from across the room.

**Format:** square, 1:1, at least 900 × 900. JPG, PNG or WebP. They get a
slight saturation and contrast lift in CSS to sit on the paper, so hand
them over untouched.

**Faces:** avoid recognisable ones unless you have the person's yes. Backs,
hands, silhouettes and screens all read better here anyway.

**If shooting is not going to happen:** say the word and I will pull six
from a free-licence library (Unsplash or Pexels, both fine for commercial
use with no attribution required) and wire them up. Your call, because it
is your brand and stock has a look.

---

## 3. One wide photograph — `poster-still` (optional)

**Where it goes:** behind the red poster band, "and it's still there on
friday." Set it and the band gets a photograph under the type instead of a
flat field.

Landscape, at least 2000px wide, and it must survive being darkened with
big serif type over it. A quiet, dim, low-contrast frame works; a busy one
does not. **The flat red field is genuinely good as it is**, so only do
this if you have a shot you love.

---

## Already handled, do not re-shoot

| Slot | State |
|---|---|
| `app-grab` | live — the scan result, five films from one reel |
| `app-diary` | live — the month calendar |
| `app-list` | live — a shared list with a night planned |
| `app-film` | live — a film open with the clip attached |
| `app-year` | live — the year grid |

Those came from `/tmp/asc-shots-d/raw` (the App Store shoot, build 23),
resized to 1440px tall and converted to WebP at quality 82. To refresh
them after a UI change, re-run `scripts/appstore-screenshots.tmp.mjs` in
the app repo and convert the same way.

## Links, not files

- **TestFlight** — wired. `site.testflightUrl` points at the live public
  link, so `/beta` shows the real join flow.
- **App Store badge + link** — add when the App Store release lands. It
  goes in the hero and the closing band, next to the TestFlight button.
