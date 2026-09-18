import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Motion port of the reference site.
 *
 * Every duration / ease / stagger / ScrollTrigger offset below was read off the
 * live original (Webflow + GSAP 3.15) — either from `ScrollTrigger.getAll()` /
 * `gsap.globalTimeline` at runtime, or from the site's own inline animation
 * source. Values are NOT approximations.
 *
 * Original reveal vocabulary (all `start: 'top 80%'`, play-once):
 *   [fd-h2]         SplitText words, masked · yPercent 100 → 0, opacity 0 → 1,
 *                   duration 1.2, stagger 0.05, ease power4.out
 *   [fd-paragraph]  SplitText lines, masked · yPercent 100 → 0, opacity 0 → 1,
 *                   duration 1,   stagger 0.1,  ease power4.out
 *   [fd-fade-children] children  · y 25 → 0, opacity 0 → 1,
 *                   duration 1.5, stagger 0.12, ease power4.out
 *   [fd-fade]       element      · y 20 → 0, opacity 0 → 1,
 *                   duration 1.3, ease power4.out
 *
 * SplitText is a GSAP Club (paid) plugin, so line/word splitting is done here
 * with an equivalent DOM splitter; the resulting tweens use the original's
 * exact numbers.
 */

const REDUCED = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------------------ *
 * Minimal SplitText stand-in.
 * The original splits h2 into masked WORDS and paragraphs into masked LINES.
 * Masks are overflow:clip wrappers so the yPercent:100 start sits hidden.
 * ------------------------------------------------------------------ */
function splitMasked(el, mode) {
  if (el.dataset.split === '1') {
    return Array.from(el.querySelectorAll(':scope > .fd-mask > .fd-part'))
  }

  const text = el.textContent.replace(/\s+/g, ' ').trim()
  if (!text) return []

  el.setAttribute('aria-label', text)
  el.dataset.split = '1'

  // The `.reveal` CSS baseline holds the CONTAINER at opacity:0 so content is
  // visible without JS. Once we split, motion moves to the inner .fd-part
  // spans and the single-fade pass deliberately skips this element — so
  // nothing would ever clear that baseline and the whole heading would stay
  // invisible with fully-opaque words inside it.
  //
  // This must be a CLASS, not gsap.set(): an inline style written inside a
  // gsap.context() is stripped when that context reverts (StrictMode's
  // double-mount does exactly that), which silently restored the invisible
  // baseline. `.is-in` is plain CSS and survives revert.
  el.classList.add('is-in')

  const mk = (content) => {
    const mask = document.createElement('span')
    mask.className = 'fd-mask'
    mask.setAttribute('aria-hidden', 'true')
    const part = document.createElement('span')
    part.className = 'fd-part'
    part.textContent = content
    mask.appendChild(part)
    return mask
  }

  if (mode === 'words') {
    // Walk the original children so authored <br> line breaks survive the
    // split — flattening to textContent silently drops them, which collapsed
    // headings like "get harder.<br>It got stuck." onto one line.
    const source = Array.from(el.childNodes)
    el.textContent = ''
    let wordIndex = 0
    source.forEach((node) => {
      if (node.nodeName === 'BR') {
        el.appendChild(document.createElement('br'))
        wordIndex = 0
        return
      }
      const chunk = (node.textContent || '').replace(/\s+/g, ' ').trim()
      if (!chunk) return
      chunk.split(' ').forEach((w) => {
        if (wordIndex++) el.appendChild(document.createTextNode(' '))
        el.appendChild(mk(w))
      })
    })
    return Array.from(el.querySelectorAll(':scope > .fd-mask > .fd-part'))
  }

  // lines: lay words out, group by offsetTop, then rebuild one mask per line.
  el.textContent = ''
  const words = text.split(' ').map((w, i) => {
    const s = document.createElement('span')
    s.className = 'fd-probe'
    s.textContent = i ? ` ${w}` : w
    el.appendChild(s)
    return s
  })

  const lines = []
  let top = null
  words.forEach((w) => {
    const t = Math.round(w.offsetTop)
    if (top === null || Math.abs(t - top) > 2) { lines.push([]); top = t }
    lines[lines.length - 1].push(w.textContent)
  })

  el.textContent = ''
  lines.forEach((l) => {
    const mask = mk(l.join('').trim())
    mask.style.display = 'block'
    el.appendChild(mask)
  })
  return Array.from(el.querySelectorAll(':scope > .fd-mask > .fd-part'))
}

/* Chars splitter — the original uses SplitText({types:'chars'}) on
 * .automations_text and staggers from the centre at 0.01s each. */
function splitChars(el) {
  if (!el) return []
  if (el.dataset.split === 'c') return Array.from(el.querySelectorAll('.fd-char'))
  const text = el.textContent.replace(/\s+/g, ' ').trim()
  el.setAttribute('aria-label', text)
  el.dataset.split = 'c'
  el.textContent = ''
  for (const ch of text) {
    const s = document.createElement('span')
    s.className = 'fd-char'
    s.setAttribute('aria-hidden', 'true')
    s.textContent = ch
    s.style.display = 'inline-block'
    s.style.whiteSpace = 'pre'
    el.appendChild(s)
  }
  return Array.from(el.querySelectorAll('.fd-char'))
}

export function useMotion() {
  useEffect(() => {
    if (REDUCED()) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'))
      return
    }

    // The CSS baseline keeps .reveal at opacity:0 for the no-JS case. GSAP owns
    // it from here, so hand control over before measuring anything.
    document.documentElement.classList.add('motion-js')

    const ctx = gsap.context(() => {
      /* ---------------- headings: masked words ---------------- *
       * original: duration 1.2, stagger 0.05, power4.out, top 80% */
      gsap.utils.toArray('h1, h2').forEach((el) => {
        const parts = splitMasked(el, 'words')
        if (!parts.length) return
        // Hero copy is driven by the load-time intro timeline (useHeroIntro),
        // exactly as on the original — it must not also get a ScrollTrigger.
        if (el.closest('.hero_main')) return
        gsap.from(parts, {
          yPercent: 100,
          opacity: 0,
          duration: 1.2,
          stagger: 0.05,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        })
      })

      /* ---------------- paragraphs: masked lines -------------- *
       * original: duration 1, stagger 0.1, power4.out, top 80% */
      gsap.utils.toArray('p.reveal, .hero_p, .brands_h, .eyebrow.reveal')
        .forEach((el) => {
          const parts = splitMasked(el, 'lines')
          if (!parts.length) return
          if (el.closest('.hero_main')) return   // owned by useHeroIntro
          gsap.from(parts, {
            yPercent: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 80%' },
          })
        })

      /* ---------------- grouped children ---------------------- *
       * original [fd-fade-children]: y 25, duration 1.5,
       * stagger 0.12, power4.out, top 80% */
      gsap.utils.toArray('[data-fade-children]').forEach((el) => {
        gsap.set(el.children, { opacity: 0, y: 25 })
        gsap.to(el.children, {
          opacity: 1,
          y: 0,
          duration: 1.5,
          stagger: 0.12,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        })
      })

      /* ---------------- single fades -------------------------- *
       * original [fd-fade]: y 20, duration 1.3, power4.out, top 80% */
      gsap.utils.toArray('.reveal').forEach((el) => {
        if (el.dataset.split) return                 // split pass owns it
        if (el.closest('[data-fade-children]')) return // parent handles it
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 80%' },
          })
      })

      /* ---------------- Trusted cards ------------------------- *
       * original: trigger .trusted_card, start 'top 70%',
       * timeline delay index*0.2
       *   line   height 0 → 100%      d 1    power3.out
       *   icon   y 32 → 0, op 0 → 1   d 0.8  power3.out  @ '<0.2'
       *   words  yPercent 100 → 0     d 0.8  stagger .05 power4.out @ '<0.1'
       *   lines  yPercent 100 → 0     d 1    stagger .08 power4.out @ '<0.2' */
      gsap.utils.toArray('.trusted_card').forEach((card, i) => {
        const line = card.querySelector('.trusted_line')
        const icon = card.querySelector('.trusted_icon')
        const heading = card.querySelector('h3')
        const text = card.querySelector('p')

        const words = heading ? splitMasked(heading, 'words') : []
        const lines = text ? splitMasked(text, 'lines') : []

        if (line) gsap.set(line, { height: '0%' })
        if (icon) gsap.set(icon, { opacity: 0, y: 32 })
        gsap.set([...words, ...lines], { yPercent: 100, opacity: 0 })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 70%' },
          delay: i * 0.2,
        })
        if (line) tl.to(line, { height: '100%', duration: 1, ease: 'power3.out' })
        if (icon) tl.to(icon, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '<0.2')
        if (words.length) tl.to(words, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power4.out' }, '<0.1')
        if (lines.length) tl.to(lines, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.08, ease: 'power4.out' }, '<0.2')
      })

      /* ---------------- Automations counter ------------------- *
       * original: trigger .section_automations,
       * start 'center bottom', end 'center center', scrub 1
       *   .automations_h  from scale 2, yPercent 50, xPercent -30,
       *                   opacity 0, blur(20px), duration .5, ease none
       *   counter 0 → N   duration .5, ease none, '<'
       *   chars           from opacity 0, blur(2px), duration .5,
       *                   stagger {from:'center', each:0.01}, '<50%' */
      const counterEl = document.querySelector('.automations_counter')
      const section = document.querySelector('.section_automations')
      if (section && counterEl) {
        // The counter's at-rest DOM text is "00" (matching the original), so the
        // target cannot be read from it — it must be declared. data-count-to
        // carries the real value; 200 is the original's figure ("200 billion").
        const finalVal = parseInt(counterEl.dataset.countTo, 10) || 200
        const obj = { val: 0 }
        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'center bottom',
            end: 'center center',
            scrub: 1,
          },
        })
          .from('.automations_h', {
            scale: 2, yPercent: 50, xPercent: -30,
            opacity: 0, filter: 'blur(20px)',
            duration: 0.5, ease: 'none',
          })
          .to(obj, {
            val: finalVal, duration: 0.5, ease: 'none',
            onUpdate: () => {
              const v = Math.round(obj.val)
              counterEl.textContent = v < 10 ? `0${v}` : String(v)
            },
          }, '<')
          .from(splitChars(document.querySelector('.automations_text')), {
            opacity: 0,
            filter: 'blur(2px)',
            duration: 0.5,
            stagger: { from: 'center', each: 0.01 },
            ease: 'none',
          }, '<50%')
      }

      /* ---------------- Automations pinned panel -------------- *
       * original: start 'center center', end '+=60%', pin, scrub 1
       *   .automations_behind yPercent -100, y 100dvh, ease none */
      const behind = document.querySelector('.automations_behind')
      if (section && behind && window.innerWidth > 991) {
        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'center center',
            end: '+=60%',
            pin: true,
            scrub: 1,
          },
        }).to(behind, { yPercent: -100, y: '100dvh', duration: 1, ease: 'none' })
      }

      /* ---------------- Footer logo --------------------------- *
       * original: .footer_logo path from yPercent -120, opacity 0,
       * duration 1.5, stagger 0.2, power4.out, start 'center bottom' */
      const footerLogo = document.querySelector('.footer_logo-wrap')
      if (footerLogo) {
        // The original staggers the 5 <path> glyphs of an inline SVG wordmark.
        // This build ships the wordmark as a single <img>, so there is nothing
        // to stagger — the same tween runs on the one element instead.
        const parts = footerLogo.querySelectorAll('path')
        gsap.from(parts.length ? parts : footerLogo, {
          yPercent: -120,
          opacity: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: 'power4.out',
          scrollTrigger: { trigger: footerLogo, start: 'center bottom' },
        })
      }
    })

      /* ---------------- Travelling line segments -------------- *
       * Measured on the original's /about-us: .about_tag-line and .team_lines
       * each carry a white base path plus a blue path whose dash pattern is a
       * short segment that travels the full path and wraps, continuously.
       *
       *   segment length = 5% of the path's own length
       *     (79.97/1599.41 and 174.95/3499 both = 5.00%)
       *   dashoffset 0 -> -length, ease 'none', 6s, repeat -1
       *     (sampled 0.2624 px/ms over 1599.41px => 6.10s;
       *      team_lines 0.5807 px/ms over 3499px => 6.03s)
       *
       * This is a loop, NOT a scroll-draw — it runs at scrollY 0 and never
       * settles, unlike the process connectors below.
       */
      document.querySelectorAll('.about_tag-travel, .team-travel').forEach((path) => {
        let len = 0
        try {
          len = path.getTotalLength()
        } catch {
          return
        }
        if (!len) return

        const seg = len * 0.05
        gsap.set(path, { strokeDasharray: `${seg}px, ${len - seg}px`, strokeDashoffset: 0 })
        gsap.to(path, {
          strokeDashoffset: -len,
          duration: 6,
          ease: 'none',
          repeat: -1,
        })
      })

      /* ---------------- About-page scroll-drawn lines --------- *
       * The /about-us line system pairs a static base path with a blue path
       * that draws in on scroll (the original ships these collapsed at
       * "0px, 999999px", exactly like the process connectors). Same mechanism
       * as DrawSVGPlugin: animate strokeDasharray to the measured length.
       */
      document.querySelectorAll('.line-draw-blue').forEach((path) => {
        let len = 0
        try {
          len = path.getTotalLength()
        } catch {
          return
        }
        if (!len) return

        const wrap = path.closest('[aria-hidden="true"]')?.parentElement || path
        gsap.fromTo(
          path,
          { strokeDasharray: `0px, ${len}px` },
          {
            strokeDasharray: `${len}px, ${len}px`,
            ease: 'none',
            scrollTrigger: { trigger: wrap, start: 'top 85%', end: 'bottom 60%', scrub: 1 },
          }
        )
      })

      /* ---------------- Product-hero timeline ----------------- *
       * One master timeline on /decisioning, measured by sampling the
       * original's computed styles every ~150ms after its trigger.
       *
       * At-rest offsets (each group has its own):
       *   .agent-hero_line    scaleX(0)
       *   .agent-hero_tag     opacity 0, x -32
       *   .agent-hero_user    opacity 0, y  48
       *   .agent-hero_ingest  opacity 0, y  32
       *   .agent-hero_offers  opacity 0, y  32
       *   .agent-hero_cards   opacity 0, y  40
       *   .agent-hero_exp     opacity 0, y  64
       *
       * Order: the rail draws first (~0-635ms), then each tag leads its own
       * column's content — tag1 @1.11s then the 3 users cascade ~0.15s apart,
       * tag2 @2.04s then the ingest cards, tag3 @2.50s then the offers panel,
       * tag4 @2.96s then the content cards, tag5 then the experience image.
       * Tags fire ~0.5s apart. The tags are NOT a standalone animation: each
       * one is the cue for the group beneath it.
       */
      const heroLine = document.querySelector('.agent-hero_line')
      const heroTags = gsap.utils.toArray('.agent-hero_tag')
      if (heroTags.length) {
        const groups = [
          '.agent-hero_user',
          '.agent-hero_ingest',
          '.agent-hero_offers',
          '.agent-hero_cards',
          '.agent-hero_exp',
        ].map((sel) => gsap.utils.toArray(sel))
        const yFor = [48, 32, 32, 40, 64]

        const heroTl = heroTags[0].closest('.agent-hero_timeline') || heroTags[0]
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroTl,
            // Measured: the original fires when .agent-hero_timeline's top
            // reaches 54% of the viewport height (scrollY 125 at vh=900).
            start: 'top 54%',
            invalidateOnRefresh: true,
          },
        })

        // The sequence runs ~3.5s once triggered. If the viewer scrolls
        // straight past the hero it would be left part-played, stranding the
        // later groups (offers / cards / experience) at opacity 0 forever.
        // Once the timeline has left the viewport, snap it to the end so no
        // content is ever permanently invisible.
        ScrollTrigger.create({
          trigger: heroTl,
          start: 'bottom top',
          once: true,
          onEnter: () => tl.progress(1),
        })

        if (heroLine) {
          gsap.set(heroLine, { transformOrigin: 'left center' })
          tl.fromTo(heroLine, { scaleX: 0 }, { scaleX: 1, duration: 0.65, ease: 'power2.out' }, 0)
        }

        heroTags.forEach((tag, i) => {
          // Tag i starts at 0.6s + i * 0.5s. The 0.6s lead lets the rail finish
          // drawing first, matching the original's order; a longer lead-in made
          // the whole sequence appear to trigger far later than the original's,
          // because nothing is visible until the first tag moves.
          const at = 0.6 + i * 0.5
          tl.fromTo(tag,
            { opacity: 0, x: -32 },
            { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, at)

          const items = groups[i]
          if (items && items.length) {
            tl.fromTo(items,
              { opacity: 0, y: yFor[i] },
              { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out' },
              at + 0.35)
          }
        })
      }

      /* ---------------- Process connectors -------------------- *
       * The flowchart's blue paths ship collapsed (stroke-dasharray
       * "0px, 999999px") exactly as the original does, and the progress
       * rails ship at zero size. Both are inert until scrubbed, so without
       * these tweens 24 elements render as invisible gaps.
       *
       * The original uses GSAP's DrawSVGPlugin (a paid Club plugin); this
       * is the same mechanism DrawSVG uses internally — animating
       * strokeDasharray from 0 to the path's own measured length.
       */
      document.querySelectorAll('.process-blue, .process-m-blue').forEach((path) => {
        let len = 0
        try {
          len = path.getTotalLength()
        } catch {
          return                       // not a rendered geometry element
        }
        if (!len) return

        const wrap = path.closest('.process_lines-wrap') || path

        gsap.fromTo(
          path,
          { strokeDasharray: `0px, ${len}px` },
          {
            strokeDasharray: `${len}px, ${len}px`,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top 85%',
              end: 'bottom 55%',
              scrub: 1,
            },
          }
        )
      })

      // Horizontal rail (opening prompt) and the vertical stage rails.
      document.querySelectorAll('.process_progress').forEach((el) => {
        gsap.fromTo(el, { width: '0%' }, {
          width: '100%', ease: 'none',
          scrollTrigger: { trigger: el.parentElement || el,
            start: 'top 85%', end: 'bottom 60%', scrub: 1 },
        })
      })
      document.querySelectorAll('.process_progress2').forEach((el) => {
        gsap.fromTo(el, { height: '0%' }, {
          height: '100%', ease: 'none',
          scrollTrigger: { trigger: el.parentElement || el,
            start: 'top 85%', end: 'bottom 60%', scrub: 1 },
        })
      })

    // Sections mount with images still loading; refresh once settled so the
    // measured start offsets line up with final layout.
    // Expose for measurement/QA parity with the original, which has GSAP global.
    window.gsap = gsap
    window.ScrollTrigger = ScrollTrigger

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = setTimeout(refresh, 600)

    return () => {
      clearTimeout(t)
      window.removeEventListener('load', refresh)
      ctx.revert()
      document.documentElement.classList.remove('motion-js')
    }
  }, [])
}
