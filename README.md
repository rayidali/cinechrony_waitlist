# cinechrony: marketing site

The marketing website for [cinechrony](https://www.cinechrony.com). You
find films while scrolling; this is where they stop disappearing.

Next.js (App Router), no UI framework, one hand-written stylesheet.

## The design system: printed poster (v4, 2026-08)

**Two rules decide everything: say less than feels safe, and let colour be
a field with a hard edge rather than a glow.**

### v4: the cut (2026-08-10)

The page said about 700 words. Corner and Rodeo, the two references this
redesign is measured against, say four or five and then show you
something. Every paragraph here was arguing in prose for a product that
was sitting next to it in a screenshot already making the same case
better. So:

- **The landing page is under 120 words.** Feature rows lost their
  paragraphs and kept a headline and two chips. The three grab beats kept
  three words each. The founder essay: three paragraphs about films being
  social: is deleted outright.
- **Photographs replaced it.** Twenty-four now: eleven in the hero
  calendar's film cells, seven in the crew wall on the rust band, one
  duotone under the friday line, and five with no background at all: see
  the cutouts below. The crew wall
  makes the essay's argument in about a second, headlined with the one line
  worth keeping from it.
- **Five of them are cut out and pasted on top.** A wide print of a full
  cinema sat under the hero calendar first and it was, correctly, hated: a
  rectangle of photograph beside a design stays a picture NEXT TO the
  design however it is cropped or graded. Lifting the background out
  inverts the relationship: a figure stands in FRONT of the calendar,
  breaks its left rule, sits on a band seam with its feet hanging into the
  next colour, and throws a shadow on the paper. Same photography, opposite
  read, and the only version of it that is a collage rather than a gallery.
  Two steps make one: `scripts/cutout.swift` (Vision's subject
  segmentation, nothing to install. It is in the OS) then
  `scripts/make-cutouts.py` for the film curve and the die-cut white trim.
  The trim is not decoration: a figure with its sky deleted and nothing
  else done to it reads as an image that failed to load, and the white edge
  is what makes it deliberate. It also hides Vision's one-pixel fringe of
  old background, which is the kind of fix you take.
- **The whole page is one painted landscape.** "The background is a plain
  colour" survived flat fields, objects on the fields, duotone gradients, a
  photograph screenprinted into each band in one ink, and then a painted
  landscape pinned to the foot of four bands with its sky continuing above
  as flat colour. Two of those failures are worth keeping. The screenprint:
  a greyscale still multiplied into a band can only ever put down more of
  that band's own colour, so the property that made it safe for the palette
  is what made it invisible. And the capped landscape: on a 900px band it
  was a picture, on the 2200px band it was 60% flat colour with a picture
  along the bottom edge, which is the original report restated.
  `scripts/riso-mural.py` paints **one** landscape now, top of the page to
  the bottom of the footer, and cuts it into a slice per band: morning sky,
  a hedgerow, into the shade, a sunflower field, the sunset, a wildflower
  meadow, dusk, a lake, deep night, first light. Drawn rather than
  photographed is what lets scenery into a strict palette at all: every
  colour is chosen rather than found, so it cannot arrive as a second
  palette the way a full-colour photograph would.
- **It is fitted by height, and the band heights are why that works.**
  Measured at 390 / 768 / 1440 / 1920, every band's height moves by at most
  ~1.3x while its width moves by 5x. So each slice is drawn at roughly its
  band's real height and laid down with `background-size: auto 100%;
  background-repeat: repeat-x`, which fills the band edge to edge, never
  touches the aspect, and lands EXACTLY on the top and bottom edges at
  every viewport. That exactness is the whole trick: it is what makes slice
  N's bottom row meet slice N+1's top row at every viewport too, so the
  page is one painting rather than ten pictures. `cover` would have
  magnified a tall band's drawing 1.6x and turned a stippled field into
  confetti; stretching to `100% 100%` would have squeezed a sun into an
  ellipse on a phone. Every drawing routine wraps in x for the repeat:
  integer-harmonic ridgelines, clouds stamped again at x +/- W, the channel
  misregistration applied with a roll rather than a shift that would leave a
  raw stripe down the seam. The build prints the seam width and the two
  colours at every join.
- **Neighbours in the same register join invisibly; a register flip is a
  hard horizon.** The two lightness windows below do not overlap, so where
  the page goes from a paper band to a saturated one there is no colour
  legal on both sides and no blend is possible. That is not a compromise:
  land against a bright sky is the reference board's favourite picture, and
  it is the most common line in the genre.
- **The five bands that invert have a second pull for dark mode.** Cream by
  day, near-black by night, and a pale sky behind dark mode's light type
  would be a worse bug than the flat colour this replaced. So the same
  ground is painted twice and the second walk is after sunset. They are CSS
  backgrounds rather than `<img>` for that exact reason: only a background
  can be swapped by `[data-theme="dark"]`, so the manual theme toggle is
  obeyed and only the file you can see is downloaded. The page has a time
  of day. The marquee strip is the odd one: `--on-color-dark` is oklch 0.17
  in both themes, so it stays a paper slice at night and gets a dusk pull
  instead of a night one.
- **The mural cannot ship unreadable, and it made the site more readable
  rather than less.** Each slice declares the oklch lightness window its
  band's type needs (WCAG solved backwards: ink is 0.165, so 0.635 is
  exactly 4.5:1; `--on-color` is 0.97, so 0.52 is), the build refuses any
  colour outside it, and then re-measures the rendered pixels because grain
  moves them. `check:contrast-pixels` went from **11 failing text runs to
  0**: a painted ground is built inside a window and a duotone gradient
  never was. Two things fell out of holding that line. Accent red comes off
  a scened band entirely, because 11px of oklch-0.44 red on the palest sky
  this system permits is 2.93:1 and lifting the red does not reach 4.5 even
  at oklch 0.88, by which point it is not red; dropping it also lifted the
  night slices' ceiling from 0.325 back to 0.50. And the close band is
  built UNDER its window rather than inside it, because the two buttons on
  it are cream at oklch 0.94 rather than `--on-color`'s 0.97, and a window
  sized for the worst ink a band is known to carry is the wrong number when
  the band carries something dimmer.
- **The masthead stays solid, and that was tested rather than assumed.** It
  is the one strip the mural does not reach, so it was built as a window:
  78% paper with a backdrop blur. It fails, and not on taste. The bar is
  sticky, so its ground is every band in turn, and the moment the field
  stopped being a known colour `check:contrast` put the mono links at
  3.28:1. At night, 22% of the marigold band's hedgerow lifts the field
  under cream type to about 2.9:1, and the opacity that fixes that shows no
  painting at all.
- **Every band has its own stock, and none of them is flat.** "The
  background is a plain colour" was said four times and answered twice by
  adding *objects* to the same cream. It is answered in the substrate now:
  six papers (cream, ochre, rose, mint, deep and their dark twins), a
  sun-fade running warm off the top edge into rose at the bottom, and a 4px
  halftone dot screen over it. The saturated bands are **duotone**: rust
  into oxblood, forest into deep teal, blue into dusk, on a long diagonal.
  That is the seventies poster move: two inks on one pull, the second
  showing through where the first thins out. Grain says "shot on film";
  halftone says "printed on a press"; a duotone says both were done on
  purpose. Set `background-color` AND `background-image` separately, never
  the `background` shorthand: see the gate note below.
- **A fourth face.** Fraunces, variable, `SOFT 60 / WONK 1`: an old-style
  display serif with the slanted alternates and soft terminals of hand-cut
  type. It carries the poster line, the `<em>` in every headline, and the
  short retro lines that replaced paragraphs. Newsreader was correct and
  quiet and had no period; Fraunces dates the page on purpose.
- **A sunburst.** `repeating-conic-gradient`, masked to a disc, behind the
  crew headline. The single most 1970s shape there is, and the only one
  that earns a place under a display line.

**One rule stayed and one bent.** Bands still stop dead at their edges. Nothing melts into the next. But bands are no longer *flat*: the tint and
the dot screen live INSIDE the hard edge, which is what a printed field
actually looks like. A soft interior in a hard shape reads as print; the
same gradient fading out into the page is the ambient wash v2 died of.

### The v3 foundation, unchanged

v2 built atmosphere out of ambient light: bokeh, a projector sun, radial
step-glows, gradient "scenes" melting into each other, tilted mockups
floating on coloured washes. That is the thing that reads as generated
rather than designed: soft light everywhere and no structure anywhere. v3
inverts it:

- **Hard edges.** Bands are solid stock and stop where the next one starts.
  Radius is 0 on everything except buttons, which stay pills because the
  app's are.
- **A visible armature.** Hairline rules, a real grid, mono captions under
  plates the way a photograph is captioned in print.
- **Grain, not glow.** Two fixed layers over the whole page, a harder pass
  on every saturated field and every plate, and a lens vignette. All the
  noise is run through `feColorMatrix saturate 0` and blended with
  `overlay`: raw `feTurbulence` is *colour* noise, and multiplied over
  cream at any usable opacity it reads as dirt rather than film. Desaturated
  and overlaid it centres on mid-grey and lightens and darkens in equal
  measure, which is what silver halide actually does.
- **Objects, drawn not rendered.** A set of cut-out stickers (disco ball,
  popcorn, martini, VHS, ticket, butterfly, sparkle, daisy, cursor, reel)
  drift at the margins of five bands. They sit behind the content, are
  clipped by the band edge so they read as pasted onto a sheet, and thin
  out on phones. Corner's equivalents are photoreal 3D renders on a
  photographic sky; those would fight flat cream paper, so these are drawn
  with a hairline ink edge and welded to the page by the same grain pass.
  Placements live in `SCENES` in `src/components/stickers.tsx`.
- **Type carries the page.** Display lines are always lowercase, which is
  the app's own rule, with one word per headline switching to Newsreader
  italic: a second display voice rather than a fourth font. (v4 moved that
  role to Fraunces; see above.)
- **The cinema layer is borrowed from real objects.** Marquee bulbs chasing
  above and below the running titles, a NOW SHOWING house board, a row of
  seat backs along the closing band, and section markers numbered as reels.
  Nothing is texture for its own sake: each one is a thing the product's own
  subject would have, which is also why the clapper board came out. It is
  the one film object that is pure cliché, and the sprocket rails, cue mark,
  slate and VHS display went with the plates they were attached to.
- **The product is shown, never drawn.** Every screenshot is a real capture
  of the shipped app, the same set that went to App Store Connect.

- **Gradients are allowed, bleed is not.** The grainy aura: four
  overlapping radial stops on a deep base, heavily grained: fills the
  closing band, two calendar cells and the story orb. Every one of them
  stops at a hard edge. A soft interior inside a hard shape reads as print;
  the same gradient fading out into the paper is the ambient wash v2 died
  of, and that distinction is the only reason both can live here.
- **Colour on a coloured field never dims.** Saturated bands set an ink
  (`--on-color` / `--on-color-dark`) that does NOT flip with the theme,
  because the field under it does not flip either, and they do not reduce
  opacity for secondary text. Calendar cell fills are artwork and hold one
  value in both themes; only the ink cell inverts, because its job is to
  contrast with the page. Verified by `contrast.mjs` rather than by eye.
- **Motion is touch-first.** Nothing the page needs sits behind `:hover`: a phone has no hover, and one that fakes it leaves the state stuck on
  after a tap. Entrances (the calendar deals itself in, cell by cell) play
  identically everywhere; hover polish is sealed inside
  `(hover: hover) and (pointer: fine)`; `:active` gives a thumb an answer.
  Transform and opacity only, so nothing touches layout.

- **The photographs are one roll.** Twenty-eight free-licence frames, all
  run through a single curve in `scripts/grade-photos.py`: blacks lifted
  to 0.055, highlights rolled to 0.965, a smoothstep S, warm highlights and
  cool shadows, saturation 0.90. That one pass is what stops twenty-eight
  photographs by twenty-eight photographers reading as a stock library.
  Never drop a photograph in ungraded; you will see it before you can name
  it. The cutouts go through the same curve by importing it rather than
  copying it: a second copy of those six lines is how the two quietly
  drift apart.
- **A cutout hanging off the SIDE widens the page; one hanging over a SEAM
  is the point.** `.cut-band` is `overflow-x: clip` with `overflow-y:
  visible`: the one pair CSS lets disagree, because `hidden` on either
  axis forces the other to scroll and would guillotine the straddle. It is
  on every band a cutout leans out of. Without it the hero grew 32px of
  horizontal scroll on a phone, which reads as a broken layout rather than
  as a bleed.
- **An opaque gradient seals the contrast walk.** `background: linear-gradient(...)`
  resets `background-color` to transparent, so `contrast.mjs` kept climbing
  past a fully opaque band and reported the cream PAGE as the field for
  cream type: twenty failures, every one imaginary. Two fixes, both kept:
  the bands declare a real `background-color` under the gradient (which is
  also the fallback if it fails to parse), and the auditor now stops
  walking the moment it meets a gradient with a fully opaque stop.
- **A photo cell is a dark cell.** Calendar cells carrying a photograph get
  an ink field, the picture dimmed onto it, and a radial scrim under the
  numeral.
- **The contrast gate is now two gates, because the first one is blind to
  pictures.** `contrast.mjs` reads computed CSS and is exact for a flat
  field or a gradient; it cannot see an `<img>`, and five surfaces are now
  photographs. `contrast-pixels.mjs` screenshots each route twice: once
  normally, once with every glyph transparent: diffs them to find the
  pixels the glyphs actually cover, and measures the ground under exactly
  those. It found **46 failures the CSS gate passes**, none of them
  introduced by the photographs: the primary CTA at 4.0:1 on five routes
  (the page-wide grain overlay lightens the button), the biggest pull quote
  on the site at 2.34:1, and a muted-ink token sized against cream being
  used on tinted stock. Those are fixed and the count is **11**, all
  between 3.79 and 4.48 and mostly dark mode. Two traps it walked into
  first, both now closed in the script: sampling a text run's whole BOX
  finds the darkest pixel of a photograph nowhere near the glyphs, and the
  stickers drift on an infinite loop, so anything moving between the two
  captures reads as a glyph. Freeze animation before you diff frames.

**Faces are the app's three plus one:** Bricolage Grotesque for display and
UI, Space Mono for labels, Newsreader for the prose that is left (mostly
the legal documents and the FAQ), and Fraunces as the vintage display
voice. Manrope is gone; it was here in v2 and nowhere in the product.

**The hero is the signature.** It is a real month: seven columns, date
numerals, film cells, and the film-red dot that means a movie night. Not a
borrowed layout: it is the app's own diary screen at poster scale, which is
why it can hold the first viewport with no explanation. It is composed to
look finished with no photography at all (the film cells are solid poster
inks) and turns photographic the moment files land in `media`. See
[ASSETS.md](./ASSETS.md).

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing: the diary hero, the grab, the poster, what it does, movie night, the year, the story, the close |
| `/beta` | TestFlight join flow (live) |
| `/install` | Add-to-home-screen guide for iPhone and Android |
| `/waitlist` | The list, now aimed at the App Store release (Loops) |
| `/support` | Support email and FAQ (App Store support URL) |
| `/privacy` | Canonical privacy policy (App Store privacy URL) |
| `/terms` | Canonical terms of service |

## Development

```bash
npm install
npm run dev              # http://localhost:3000
npm run build            # production build
npm run lint
npm run check:contrast          # WCAG audit from computed CSS
npm run check:contrast-pixels   # WCAG audit from rendered pixels
```

`check:contrast` reads the computed colour of every text run on every route
in both themes, resolves the field it actually sits on (including every stop
of a gradient, and takes the worst one), and exits non-zero on any AA
failure. It exists because a dark-mode contrast bug survived three rounds of
review: a full-page screenshot scaled to thumbnail width hides one
completely. `CHROME=` overrides the browser path, `BASE=` the origin.

## Configuration

Everything that changes at launch lives in one file: `src/lib/site.ts`.

- `appUrl`: where every "open the web app" button points. Currently the
  PWA on Vercel; switch to `https://app.cinechrony.com` after the subdomain
  split.
- `testflightUrl`: the public TestFlight link. **Live.** It sat `null` for
  nineteen days while the beta was open and empty, so `/beta` spent that
  whole time telling visitors the beta had not started. If you ever set it
  back to `null`, `/beta` and the hero fall back to the waitlist on their
  own.
- `waitlist`: the Loops form endpoint.
- `media`. Every screenshot, photograph and video slot. Five are real; the
  rest render designed placeholders until a file exists.

## Domain architecture

- `cinechrony.com` (apex + `www`) serves this site.
- The app moves to `app.cinechrony.com`. A PWA installs whatever origin
  you are on, so `/install` always sends people to the app origin first.
- App Store Connect points at `cinechrony.com/privacy`, `/terms` and
  `/support`. Keep those routes stable.

## Deploying

Pushes to `main` deploy via Vercel.
