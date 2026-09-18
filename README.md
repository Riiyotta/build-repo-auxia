# build-repo-auxia

A React 19 + Vite + Tailwind v3 rebuild of a marketing site, produced as a
front-end fidelity exercise: the design system and motion were measured from a
rendered reference and reimplemented, rather than copied as markup.

```bash
npm install
npm run dev     # http://localhost:5390
npm run build
npm run lint
```

## Information architecture

`ia.json` is the hand-edited source of truth for the site's routes, templates
and reusable sections; `IA.md` and `matrix.csv` are generated from it by
`build.mjs` and should never be hand-edited. `validate.mjs` checks `ia.json`'s
own internal claims (route sums, section references, category coverage)
before you trust it.

```bash
node validate.mjs   # checks ia.json's internal consistency
node build.mjs       # regenerates IA.md and matrix.csv from ia.json
```

All 8 named routes plus the wildcard `*` are declared in one `<Routes>` block
in `src/App.jsx`, wrapped in a single shared `Shell` (`Banner` + `Navbar` +
page + `Footer`) with no pathname-based conditionals anywhere in those three
chrome components — so all 9 routes carry identical shell chrome. That yields
8 distinct page templates (the two product routes, `/agent-studio` and
`/decisioning`, are similar enough to share most of their section list but
differ in two real, verified ways — see below — so they're modeled as two
templates rather than one with hidden conditionals). Findings:

- **3 shell sections** (`shell.banner`, `shell.navbar`, `shell.footer`) are
  the only sections shared across all 8 templates and all 9 routes — every
  other section is used by at most 3 templates.
- **10 of 25 sections are shared** across more than one template; the other
  **15 are single-use** and stay page-local (e.g. all 3 About-page sections,
  both blog sections, the demo form, legal prose) rather than being built as
  speculative shared components.
- The two product pages are the clearest near-duplicate pair worth watching:
  `hero.product`, `brands.marquee`, `features.rows`, `use-case.grid` and
  `prefooter.crosssell` are shared between them, but `/agent-studio` carries
  a `case-studies.rail` and a closing `cta.band` that `/decisioning` does
  not — `/decisioning`'s `prefooter.crosssell` closes the page instead.
  `use-case.grid` is also shared but renders a different column/card count
  per route (3 cols/6 cards vs. 4 cols/4 cards).
- Legal/long-form is the single largest template by route count (2 of 9
  routes, `/privacy-policy` and `/terms`) sharing one `legal.prose` section
  and layout shell — every other template covers exactly 1 route.

See `IA.md` for the full per-template section tables and section reference,
and `matrix.csv` for a section × template spreadsheet view.

## Approach

The reference is a Webflow site using GSAP (ScrollTrigger, SplitText,
ScrollSmoother, DrawSVG), Splide carousels and Plyr. Rather than lifting its
markup, the design system was extracted by measuring computed styles and
intercepting canvas calls in headless Chromium, then rebuilt:

- **Colors** — tokens read from CSS custom properties into `tailwind.config.js`
  (`#0b4fff` blue, `#f0efe3` paper, `#232323` ink, `#e2e1d3` oat-dark, plus the
  full brand/system ramp).
- **Type scale** — taken from the `.heading-style-*` utilities rather than base
  element rules: h1 `6.5rem`, h2/h4 `4rem`, h3 `3rem`, all at weight 500,
  line-height .95, letter-spacing -.03em, with 991px / 767px step-downs.
- **Breakpoints** — Webflow's **992 / 768 / 480**, not Tailwind's defaults.
  Mixing the two was the single most common source of layout drift.
- **Layout** — container widths (`77rem` / `64rem` / `48rem`), the `90rem` nav
  container, and the global padding system.
- **Hero** — the reference scales its entire right-hand visual off a single
  `font-size: clamp(8px, 1vw, 1rem)` root with every child in `em`. That system
  is preserved rather than flattened to fixed pixels.

## Motion

GSAP (free plugins only) drives scroll reveals in `src/hooks/useMotion.js`.
SplitText and DrawSVG are paid Club plugins, so both are reproduced by hand — a
DOM word/line splitter, and `stroke-dasharray` animation respectively.
ScrollSmoother is deliberately not used.

Canvas work was reverse-engineered by monkey-patching
`CanvasRenderingContext2D` and recording real draw calls:

- **Feature connectors** — a 4-point path with `arcTo` 40px corners, stroked
  twice per frame: a full oat track plus a blue progress line dashed over it via
  `setLineDash`, drawing in on scroll.
- **Dot fields** — the CTA grid (42px pitch, r3) and marketing panels (37.09px
  pitch, r5.01, growing on scroll) are canvas; the product-hero fields are CSS
  `radial-gradient` on a 20px tile.
- **Product hero timeline** — a master timeline where each tag pill cues its own
  column's content, with per-group offsets measured off the reference
  (users y48, ingest y32, offers y32, cards y40, experience y64).

All motion respects `prefers-reduced-motion`.

## Fonts

Both faces are SIL Open Font License and are **self-hosted** in
`public/assets/fonts/`, so the site makes no external requests.

**Archivo** substitutes a commercial grotesque. It was chosen by measurement,
not by eye: ten free grotesques were compared against the reference's own
advance widths. Archivo came first at **3.69% mean deviation across a 7-string
sample, 5.21% worst case** — and, importantly, the tightest worst case, so it
stays consistent rather than matching some strings and drifting on others.
Inter, the obvious first guess, placed last at 9.98%.

**IBM Plex Mono** matches the reference's mono face exactly.

To swap in a licensed face, change `fontFamily.sans` in `tailwind.config.js` and
the `@font-face` block in `src/index.css`.

## Third-party material is not included

- **Customer logos.** The reference shows nine third-party corporate marks.
  Those belong to their respective owners, so they are not reproduced here —
  neither copied nor redrawn as SVG paths. Nine **original invented wordmarks**
  ship instead (`public/assets/logos/`), each a distinct geometric glyph at the
  same 5:1 aspect as the real slots so layout and marquee rhythm stay exact.
- **Commercial font.** See above — never bundled.
- **Legal copy.** `/privacy-policy` and `/terms` use representative placeholder
  prose with a visible in-page notice, not anyone's real legal text.
- **No outbound links.** Links to the reference's live properties resolve to
  `#`; the demo form is local React state only and posts nowhere.

## Verified

Measured in headless Chromium against the reference at 1440 / 1280 / 992 / 991 /
768 / 390:

- h1 renders at 648.0 × 197.6px at 1440 wide — 0.00% width delta
- canvas geometry matches call-for-call (connector path length 779.66, dot grids
  identical in pitch, origin, radius and fill)
- no horizontal overflow at any width
- no console errors, no content stranded in a pre-reveal hidden state
- no external network requests

## Licence

The build tooling and hand-written components here are provided as-is for
reference. Site copy, brand marks and product imagery belong to their owner and
are not licensed for reuse.
