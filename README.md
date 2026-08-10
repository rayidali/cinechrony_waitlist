# cinechrony — marketing site

The marketing website for [cinechrony](https://www.cinechrony.com). You
find films while scrolling; this is where they stop disappearing.

Next.js (App Router), no UI framework, one hand-written stylesheet.

## The design system — printed poster (v4, 2026-08)

**Two rules decide everything: say less than feels safe, and let colour be
a field with a hard edge rather than a glow.**

### v4 — the cut (2026-08-10)

The page said about 700 words. Corner and Rodeo, the two references this
redesign is measured against, say four or five and then show you
something. Every paragraph here was arguing in prose for a product that
was sitting next to it in a screenshot already making the same case
better. So:

- **The landing page is under 120 words.** Feature rows lost their
  paragraphs and kept a headline and two chips. The three grab beats kept
  three words each. The founder essay — three paragraphs about films being
  social — is deleted outright.
- **Photographs replaced it.** Twenty-eight now: eleven in the hero
  calendar's film cells, seven in the crew wall on the rust band, one
  duotone under the friday line, four screenprinted into whole bands, and
  five with no background at all — see the cutouts below. The crew wall
  makes the essay's argument in about a second, headlined with the one line
  worth keeping from it.
- **Five of them are cut out and pasted on top.** A wide print of a full
  cinema sat under the hero calendar first and it was, correctly, hated: a
  rectangle of photograph beside a design stays a picture NEXT TO the
  design however it is cropped or graded. Lifting the background out
  inverts the relationship — a figure stands in FRONT of the calendar,
  breaks its left rule, sits on a band seam with its feet hanging into the
  next colour, and throws a shadow on the paper. Same photography, opposite
  read, and the only version of it that is a collage rather than a gallery.
  Two steps make one: `scripts/cutout.swift` (Vision's subject
  segmentation, nothing to install — it is in the OS) then
  `scripts/make-cutouts.py` for the film curve and the die-cut white trim.
  The trim is not decoration: a figure with its sky deleted and nothing
  else done to it reads as an image that failed to load, and the white edge
  is what makes it deliberate. It also hides Vision's one-pixel fringe of
  old background, which is the kind of fix you take.
- **Four bands have a photograph screenprinted into them.** "The background
  is a plain colour" survived flat fields, objects on the fields, and
  duotone gradients — fairly, because a gradient of a colour is still that
  colour. So there is scenery in it now: a sunflower field on the grab
  band, a wildflower meadow behind what-it-does, a night sky under movie
  night, rolling hills under the year. **One ink.** The files are greyscale
  and composite with `multiply`, which scales every channel equally, so hue
  and chroma are untouched and the photograph can only lay down more of the
  band's own colour. A full-colour still would be a second palette arriving
  unannounced; this cannot introduce one however hard it is pushed, which
  is the only reason a page this colour-disciplined can have photographic
  backgrounds at all. `scripts/band-scenes.py` bakes them.
- **Every band has its own stock, and none of them is flat.** "The
  background is a plain colour" was said four times and answered twice by
  adding *objects* to the same cream. It is answered in the substrate now:
  six papers (cream, ochre, rose, mint, deep and their dark twins), a
  sun-fade running warm off the top edge into rose at the bottom, and a 4px
  halftone dot screen over it. The saturated bands are **duotone** — rust
  into oxblood, forest into deep teal, blue into dusk, on a long diagonal.
  That is the seventies poster move: two inks on one pull, the second
  showing through where the first thins out. Grain says "shot on film";
  halftone says "printed on a press"; a duotone says both were done on
  purpose. Set `background-color` AND `background-image` separately, never
  the `background` shorthand — see the gate note below.
- **A fourth face.** Fraunces, variable, `SOFT 60 / WONK 1` — an old-style
  display serif with the slanted alternates and soft terminals of hand-cut
  type. It carries the poster line, the `<em>` in every headline, and the
  short retro lines that replaced paragraphs. Newsreader was correct and
  quiet and had no period; Fraunces dates the page on purpose.
- **A sunburst.** `repeating-conic-gradient`, masked to a disc, behind the
  crew headline. The single most 1970s shape there is, and the only one
  that earns a place under a display line.

**One rule stayed and one bent.** Bands still stop dead at their edges —
nothing melts into the next. But bands are no longer *flat*: the tint and
the dot screen live INSIDE the hard edge, which is what a printed field
actually looks like. A soft interior in a hard shape reads as print; the
same gradient fading out into the page is the ambient wash v2 died of.

### The v3 foundation, unchanged

v2 built atmosphere out of ambient light — bokeh, a projector sun, radial
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
  `overlay` — raw `feTurbulence` is *colour* noise, and multiplied over
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
  italic — a second display voice rather than a fourth font. (v4 moved that
  role to Fraunces; see above.)
- **The cinema layer is borrowed from real objects.** Marquee bulbs chasing
  above and below the running titles, a NOW SHOWING house board, a row of
  seat backs along the closing band, and section markers numbered as reels.
  Nothing is texture for its own sake: each one is a thing the product's own
  subject would have — which is also why the clapper board came out. It is
  the one film object that is pure cliché, and the sprocket rails, cue mark,
  slate and VHS display went with the plates they were attached to.
- **The product is shown, never drawn.** Every screenshot is a real capture
  of the shipped app, the same set that went to App Store Connect.

- **Gradients are allowed, bleed is not.** The grainy aura — four
  overlapping radial stops on a deep base, heavily grained — fills the
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
- **Motion is touch-first.** Nothing the page needs sits behind `:hover` —
  a phone has no hover, and one that fakes it leaves the state stuck on
  after a tap. Entrances (the calendar deals itself in, cell by cell) play
  identically everywhere; hover polish is sealed inside
  `(hover: hover) and (pointer: fine)`; `:active` gives a thumb an answer.
  Transform and opacity only, so nothing touches layout.

- **The photographs are one roll.** Twenty-eight free-licence frames, all
  run through a single curve in `scripts/grade-photos.py` — blacks lifted
  to 0.055, highlights rolled to 0.965, a smoothstep S, warm highlights and
  cool shadows, saturation 0.90. That one pass is what stops twenty-eight
  photographs by twenty-eight photographers reading as a stock library.
  Never drop a photograph in ungraded; you will see it before you can name
  it. The cutouts go through the same curve by importing it rather than
  copying it — a second copy of those six lines is how the two quietly
  drift apart.
- **A cutout hanging off the SIDE widens the page; one hanging over a SEAM
  is the point.** `.cut-band` is `overflow-x: clip` with `overflow-y:
  visible` — the one pair CSS lets disagree, because `hidden` on either
  axis forces the other to scroll and would guillotine the straddle. It is
  on every band a cutout leans out of. Without it the hero grew 32px of
  horizontal scroll on a phone, which reads as a broken layout rather than
  as a bleed.
- **An opaque gradient seals the contrast walk.** `background: linear-gradient(...)`
  resets `background-color` to transparent, so `contrast.mjs` kept climbing
  past a fully opaque band and reported the cream PAGE as the field for
  cream type — twenty failures, every one imaginary. Two fixes, both kept:
  the bands declare a real `background-color` under the gradient (which is
  also the fallback if it fails to parse), and the auditor now stops
  walking the moment it meets a gradient with a fully opaque stop.
- **A photo cell is a dark cell.** Calendar cells carrying a photograph get
  an ink field, the picture dimmed onto it, and a radial scrim under the
  numeral.
- **The contrast gate is now two gates, because the first one is blind to
  pictures.** `contrast.mjs` reads computed CSS and is exact for a flat
  field or a gradient; it cannot see an `<img>`, and five surfaces are now
  photographs. `contrast-pixels.mjs` screenshots each route twice — once
  normally, once with every glyph transparent — diffs them to find the
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

**The hero is the signature.** It is a real month — seven columns, date
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

- `appUrl` — where every "open the web app" button points. Currently the
  PWA on Vercel; switch to `https://app.cinechrony.com` after the subdomain
  split.
- `testflightUrl` — the public TestFlight link. **Live.** It sat `null` for
  nineteen days while the beta was open and empty, so `/beta` spent that
  whole time telling visitors the beta had not started. If you ever set it
  back to `null`, `/beta` and the hero fall back to the waitlist on their
  own.
- `waitlist` — the Loops form endpoint.
- `media` — every screenshot, photograph and video slot. Five are real; the
  rest render designed placeholders until a file exists.

## Domain architecture

- `cinechrony.com` (apex + `www`) serves this site.
- The app moves to `app.cinechrony.com`. A PWA installs whatever origin
  you are on, so `/install` always sends people to the app origin first.
- App Store Connect points at `cinechrony.com/privacy`, `/terms` and
  `/support`. Keep those routes stable.

## Deploying

Pushes to `main` deploy via Vercel.
