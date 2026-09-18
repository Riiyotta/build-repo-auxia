# Auxia — React 19 + Vite + Tailwind v3 rebuild of a Webflow marketing site. All 8 named routes plus the wildcard '*' are declared in src/App.jsx's single <Routes> block, wrapped in one shared Shell (Banner + Navbar + ...routes... + Footer) with no pathname-based conditionals in any of the three chrome components.

Source: Auxia — React 19 + Vite + Tailwind v3 rebuild of a Webflow marketing site. All 8 named routes plus the wildcard '*' are declared in src/App.jsx's single <Routes> block, wrapped in one shared Shell (Banner + Navbar + ...routes... + Footer) with no pathname-based conditionals in any of the three chrome components.
Status: **measured-from-source** · production approved: **false**
9 routes · 8 templates · 25 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 3 templates (Legal / long-form prose, Homepage, Product page — Agent Studio) account for 4 of 9 routes (44%). The remaining 5 routes span 5 templates.

| template | routes | share |
|---|---:|---:|
| Legal / long-form prose | 2 | 22% |
| Homepage | 1 | 11% |
| Product page — Agent Studio | 1 | 11% |
| Product page — Decisioning | 1 | 11% |
| About Us | 1 | 11% |
| Blog index | 1 | 11% |
| Demo request form | 1 | 11% |
| 404 fallback | 1 | 11% |

## Page chrome

**9 routes carry chrome = `full`** — Homepage, Product page — Agent Studio, Product page — Decisioning, About Us, Blog index, Demo request form, Legal / long-form prose, 404 fallback.

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | implementation | scope |
|---|---|---:|---:|---|---|
| `shell.banner` | SHELL | 8 | 9 | `src/components/Banner.jsx` | Present identically on all 9 routes (all 8 named routes plus the wildcard 404) — rendered once by the shared Shell wrapper, first element on every page. |
| `shell.navbar` | SHELL | 8 | 9 | `src/components/Navbar.jsx` | Present identically on all 9 routes — verified no useLocation/pathname conditional in Navbar.jsx itself; App.jsx's own doc comment naming only 4 routes is stale. |
| `shell.footer` | SHELL | 8 | 9 | `src/components/Footer.jsx` | Present identically on all 9 routes as the final element of the shared Shell. |
| `brands.marquee` | PROOF | 3 | 3 | `src/components/Brands.jsx` | Present on the homepage and both product pages (3 routes total): /, /agent-studio, /decisioning. |
| `cta.band` | CONVERSION | 3 | 3 | `src/components/CTA.jsx` | Present on the homepage, /blog, and /agent-studio (3 routes total) — absent on /decisioning, whose prefooter.crosssell closes that page instead. |
| `hero.product` | HERO | 2 | 2 | `src/components/AgentHero.jsx + src/components/DecisionHero.jsx` | Present on both product routes (2 routes: /agent-studio and /decisioning), rendered by two distinct components under one section contract. |
| `case-studies.rail` | PROOF | 2 | 2 | `src/components/CaseStudies.jsx` | Present on the homepage and /agent-studio only (2 routes total) — confirmed absent from /decisioning. |
| `features.rows` | PRODUCT | 2 | 2 | `src/components/FeatureRows.jsx + src/components/FeaturesBottom.jsx` | Present on both product routes (2 routes: /agent-studio and /decisioning). |
| `use-case.grid` | PRODUCT | 2 | 2 | `src/components/UseCaseGrid.jsx` | Present on both product routes (2 routes), with differing cols/card-count per route. |
| `prefooter.crosssell` | CONVERSION | 2 | 2 | `src/components/Prefooter.jsx` | Present on both product routes (2 routes: /agent-studio and /decisioning). |
| `legal.prose` | CONTENT | 1 | 2 | `src/pages/PrivacyPolicy.jsx + src/pages/Terms.jsx` | Present on both legal routes (2 routes: /privacy-policy and /terms), sharing an identical layout shell. |
| `hero.marketing` | HERO | 1 | 1 | `src/components/Hero.jsx` | Present only on the homepage (1 route). |
| `hero.about` | HERO | 1 | 1 | `src/pages/AboutUs.jsx:40-118` | Present only on /about-us (1 route). |
| `trusted.grid` | PROOF | 1 | 1 | `src/components/Trusted.jsx` | Present only on the homepage (1 route). |
| `marketing.split` | PRODUCT | 1 | 1 | `src/components/Marketing.jsx` | Present only on the homepage (1 route). |
| `stack.panels` | PRODUCT | 1 | 1 | `src/components/Stack.jsx` | Present only on the homepage (1 route). |
| `process.flowchart` | PRODUCT | 1 | 1 | `src/components/Process.jsx` | Present only on the homepage (1 route). |
| `automations.field` | PRODUCT | 1 | 1 | `src/components/Automations.jsx` | Present only on the homepage (1 route). |
| `about.market` | ABOUT | 1 | 1 | `src/pages/AboutUs.jsx:120-160` | Present only on /about-us (1 route). |
| `about.values` | ABOUT | 1 | 1 | `src/pages/AboutUs.jsx:162-263` | Present only on /about-us (1 route). |
| `about.team` | ABOUT | 1 | 1 | `src/pages/AboutUs.jsx:265-314` | Present only on /about-us (1 route). |
| `blog.featured` | CONTENT | 1 | 1 | `src/pages/Blog.jsx:165-215` | Present only on /blog (1 route). |
| `blog.list` | CONTENT | 1 | 1 | `src/pages/Blog.jsx:216-357` | Present only on /blog (1 route). |
| `demo.form` | CONVERSION | 1 | 1 | `src/pages/Demo.jsx` | Present only on /demo (1 route). |
| `utility.not-found` | UTILITY | 1 | 1 | `src/App.jsx#NotFound` | Present only on the wildcard '*' route (1 route). |

**10 shared sections** appear in more than one template and belong in a component library.

**15 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

## Templates

### Homepage — `template.home`

1 route · `/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.banner` | shared ×8 |
| 2 | SHELL | `shell.navbar` | shared ×8 |
| 3 | HERO | `hero.marketing` | page-local |
| 4 | PROOF | `brands.marquee` | shared ×3 |
| 5 | PRODUCT | `marketing.split` | page-local |
| 6 | PRODUCT | `stack.panels` | page-local |
| 7 | PRODUCT | `process.flowchart` | page-local |
| 8 | PRODUCT | `automations.field` | page-local |
| 9 | PROOF | `case-studies.rail` | shared ×2 |
| 10 | PROOF | `trusted.grid` | page-local |
| 11 | CONVERSION | `cta.band` | shared ×3 |
| 12 | SHELL | `shell.footer` | shared ×8 |

### Product page — Agent Studio — `template.product-agent-studio`

1 route · `/agent-studio` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.banner` | shared ×8 |
| 2 | SHELL | `shell.navbar` | shared ×8 |
| 3 | HERO | `hero.product` | shared ×2 |
| 4 | PROOF | `brands.marquee` | shared ×3 |
| 5 | PRODUCT | `features.rows` | shared ×2 |
| 6 | PRODUCT | `use-case.grid` | shared ×2 |
| 7 | PROOF | `case-studies.rail` | shared ×2 |
| 8 | CONVERSION | `prefooter.crosssell` | shared ×2 |
| 9 | CONVERSION | `cta.band` | shared ×3 |
| 10 | SHELL | `shell.footer` | shared ×8 |

### Product page — Decisioning — `template.product-decisioning`

1 route · `/decisioning` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.banner` | shared ×8 |
| 2 | SHELL | `shell.navbar` | shared ×8 |
| 3 | HERO | `hero.product` | shared ×2 |
| 4 | PROOF | `brands.marquee` | shared ×3 |
| 5 | PRODUCT | `features.rows` | shared ×2 |
| 6 | PRODUCT | `use-case.grid` | shared ×2 |
| 7 | CONVERSION | `prefooter.crosssell` | shared ×2 |
| 8 | SHELL | `shell.footer` | shared ×8 |

### About Us — `template.about`

1 route · `/about-us` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.banner` | shared ×8 |
| 2 | SHELL | `shell.navbar` | shared ×8 |
| 3 | HERO | `hero.about` | page-local |
| 4 | ABOUT | `about.market` | page-local |
| 5 | ABOUT | `about.values` | page-local |
| 6 | ABOUT | `about.team` | page-local |
| 7 | SHELL | `shell.footer` | shared ×8 |

### Blog index — `template.blog-index`

1 route · `/blog` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.banner` | shared ×8 |
| 2 | SHELL | `shell.navbar` | shared ×8 |
| 3 | CONTENT | `blog.featured` | page-local |
| 4 | CONTENT | `blog.list` | page-local |
| 5 | CONVERSION | `cta.band` | shared ×3 |
| 6 | SHELL | `shell.footer` | shared ×8 |

### Demo request form — `template.demo-form`

1 route · `/demo` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.banner` | shared ×8 |
| 2 | SHELL | `shell.navbar` | shared ×8 |
| 3 | CONVERSION | `demo.form` | page-local |
| 4 | SHELL | `shell.footer` | shared ×8 |

### Legal / long-form prose — `template.legal`

2 routes · `/privacy-policy`, `/terms` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.banner` | shared ×8 |
| 2 | SHELL | `shell.navbar` | shared ×8 |
| 3 | CONTENT | `legal.prose` | page-local |
| 4 | SHELL | `shell.footer` | shared ×8 |

### 404 fallback — `template.not-found`

1 route · `*` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.banner` | shared ×8 |
| 2 | SHELL | `shell.navbar` | shared ×8 |
| 3 | UTILITY | `utility.not-found` | page-local |
| 4 | SHELL | `shell.footer` | shared ×8 |

## Section reference

### SHELL

_Chrome present identically on all 9 routes: announcement banner, primary nav, and footer, rendered once by the shared Shell wrapper in src/App.jsx regardless of page._

**`shell.banner`** — Top-of-page announcement bar driving awareness of a new launch. Text + link only, no motion.

· Present identically on all 9 routes (all 8 named routes plus the wildcard 404) — rendered once by the shared Shell wrapper, first element on every page. · appears on 9 routes · implemented by `src/components/Banner.jsx`

**`shell.navbar`** — Primary site navigation and brand mark: up to 3 nav links and up to 2 product links. Position:relative, constant height, never sticky.

· Present identically on all 9 routes — verified no useLocation/pathname conditional in Navbar.jsx itself; App.jsx's own doc comment naming only 4 routes is stale. · appears on 9 routes · implemented by `src/components/Navbar.jsx`

**`shell.footer`** — Closing site chrome: oversized self wordmark, up to 3 link columns, legal line. All outbound links point at '#' rather than real external destinations.

· Present identically on all 9 routes as the final element of the shared Shell. · appears on 9 routes · implemented by `src/components/Footer.jsx`

### HERO

_Page-opening block establishing that page's core value proposition; always the first content section after shell chrome._

**`hero.marketing`** — Homepage hero: the 1:1 personalization pitch headline plus an animated workflow/audience visual (desktop) or a horizontally-scrolling card row (mobile, a structural swap not a resize).

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/Hero.jsx`

**`hero.product`** — Product-page hero establishing the specific product's value prop. Two content variants sharing one contract: 'agent-studio' (prompts list, generated-UI visual) and 'decisioning' (users/tags, offers list, solid-blue ground, no dot field).

· Present on both product routes (2 routes: /agent-studio and /decisioning), rendered by two distinct components under one section contract. · appears on 2 routes · implemented by `src/components/AgentHero.jsx + src/components/DecisionHero.jsx`

**`hero.about`** — About-page hero: mission statement over a dark (#191919) ground plus exactly 3 real headline stats.

· Present only on /about-us (1 route). · appears on 1 routes · implemented by `src/pages/AboutUs.jsx:40-118`

### PROOF

_Social and customer proof: logo strip, customer case-study rail, and trust/compliance pillars._

**`brands.marquee`** — Social-proof logo strip, CSS infinite-scroll marquee (measured ~42.2px/sec). All 9 logos are original invented wordmarks standing in for real third-party marks — never a real company's logo.

· Present on the homepage and both product pages (3 routes total): /, /agent-studio, /decisioning. · appears on 3 routes · implemented by `src/components/Brands.jsx`

**`case-studies.rail`** — Customer proof: full-bleed horizontal rail of up to 8 case-study cards (a scrollable rail here, a real Splide carousel on the reference). Names/stats are Auxia's own published claims; logos are the same invented-wordmark set as brands.marquee.

· Present on the homepage and /agent-studio only (2 routes total) — confirmed absent from /decisioning. · appears on 2 routes · implemented by `src/components/CaseStudies.jsx`

**`trusted.grid`** — Trust/compliance pillars (SOC2, privacy, GDPR) — exactly 3 pillar cards over a dark ground with a GSAP-animated left-edge rule.

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/Trusted.jsx`

### PRODUCT

_Product-explanation and capability modules: problem/solution framing, the product stack, workflow diagrams, feature rows, use-case grids, and scale/automation statements._

**`marketing.split`** — Problem statement on a dark ground contrasting a messy vs. clean customer journey via two generated-UI diagrams (redrawn static content, not frame-by-frame animation).

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/Marketing.jsx`

**`stack.panels`** — The 3-layer product stack (Agent Studio / Decisioning / Data & Context) as three full-width stacked panels — explicitly not a 3-column grid.

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/Stack.jsx`

**`process.flowchart`** — 6-step agent workflow as a literal vertical flowchart: SVG connector paths and tag pills between steps (1 opening prompt wrap + 5 real stage entries).

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/Process.jsx`

**`automations.field`** — Scale statement: a live-decision counter over a dense, static 36-row field of automation names, revealed by pinned scroll-scrub — explicitly not an auto-scrolling marquee.

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/Automations.jsx`

**`features.rows`** — Alternating image/copy feature rows (4-6 items) with an animated canvas connector between rows, closed by a 4-card enterprise-assurance block nested inside the last row's content.

· Present on both product routes (2 routes: /agent-studio and /decisioning). · appears on 2 routes · implemented by `src/components/FeatureRows.jsx + src/components/FeaturesBottom.jsx`

**`use-case.grid`** — Use-case card grid, column count and card count vary by product: 3 columns / 6 cards on /agent-studio, 4 columns / 4 cards on /decisioning.

· Present on both product routes (2 routes), with differing cols/card-count per route. · appears on 2 routes · implemented by `src/components/UseCaseGrid.jsx`

### ABOUT

_About-page-only narrative blocks: mission statement, company values, hiring cross-sell._

**`about.market`** — Mission statement over a blue brand-surface ground with a real team photo.

· Present only on /about-us (1 route). · appears on 1 routes · implemented by `src/pages/AboutUs.jsx:120-160`

**`about.values`** — Company values, exactly 5 entries, presented as a zig-zag threaded list on desktop (a static SVG zig-zag line, scroll-drawn) that collapses to a plain column below 992px.

· Present only on /about-us (1 route). · appears on 1 routes · implemented by `src/pages/AboutUs.jsx:162-263`

**`about.team`** — Hiring/careers cross-sell closing the about page — the only template where the last content section is not a cta.band/prefooter; site-wide shell.footer still follows it.

· Present only on /about-us (1 route). · appears on 1 routes · implemented by `src/pages/AboutUs.jsx:265-314`

### CONTENT

_Blog and legal long-form content: featured post spotlight, filterable post grid, legal document layout._

**`blog.featured`** — Featured post spotlight rendered above the filterable listing; always the first content section on the blog index.

· Present only on /blog (1 route). · appears on 1 routes · implemented by `src/pages/Blog.jsx:165-215`

**`blog.list`** — Filterable/searchable card grid of blog posts with pagination control. Filtering is local-state only, no network request; responsive 3/2/1-column grid.

· Present only on /blog (1 route). · appears on 1 routes · implemented by `src/pages/Blog.jsx:216-357`

**`legal.prose`** — Long-form legal document layout: sticky TOC rail + rich-text column, identical shape between the two legal pages. Body prose is representative placeholder text; a visible role="note" warning banner disclosing this is required and confirmed rendered on both pages.

· Present on both legal routes (2 routes: /privacy-policy and /terms), sharing an identical layout shell. · appears on 2 routes · implemented by `src/pages/PrivacyPolicy.jsx + src/pages/Terms.jsx`

### CONVERSION

_Conversion asks: closing CTA band, sibling-product cross-sell, demo-request form._

**`cta.band`** — Closing full-width conversion band with a live dot-field canvas backdrop, heading and primary/secondary CTA.

· Present on the homepage, /blog, and /agent-studio (3 routes total) — absent on /decisioning, whose prefooter.crosssell closes that page instead. · appears on 3 routes · implemented by `src/components/CTA.jsx`

**`prefooter.crosssell`** — Cross-sells the sibling product before the footer. On /decisioning this is the last content section before shell.footer; on /agent-studio a cta.band follows it instead.

· Present on both product routes (2 routes: /agent-studio and /decisioning). · appears on 2 routes · implemented by `src/components/Prefooter.jsx`

**`demo.form`** — Demo-request lead form: copy rail plus a local-state-only form. Performs zero network requests — the real reference posts to HubSpot and mounts a Cloudflare Turnstile widget, neither reproduced here.

· Present only on /demo (1 route). · appears on 1 routes · implemented by `src/pages/Demo.jsx`

### UTILITY

_Fallback content for any route that matches nothing else._

**`utility.not-found`** — 404 fallback for any unmatched route: heading, body copy, and a link back to home.

· Present only on the wildcard '*' route (1 route). · appears on 1 routes · implemented by `src/App.jsx#NotFound`
