import { useEffect } from 'react'
import gsap from 'gsap'

/**
 * Hero intro + looping visual cycle.
 *
 * Every value below is transcribed from the original's own inline hero script
 * (the reference site ships it unminified inside `.section_hero > .hide.w-embed.w-script`).
 * Nothing here is estimated.
 *
 * ---- Intro (preloaderTlA, fires on load, not on scroll) ----
 *   .nav_fixed        yPercent -100, opacity 0, d 1.5, power4.out   @ 0.3
 *   h1.lines          y 32, opacity 0, rotation 4,
 *                     transformOrigin 'left center',
 *                     d 1, stagger 0.15, back.out                   @ 0.5
 *   p.lines           yPercent 100, opacity 0, d 1, stagger 0.1,
 *                     power4.out                                    @ '<0.3'
 *   .button-group     y 32, filter blur(10px), opacity 0, d 1,
 *                     power4.out                                    @ '<0.3'
 *   lineATl                                                         @ 0
 *
 * ---- lineATl (defaults ease 'none') ----
 *   .hero_lines-left   from xPercent -100            d 1
 *   #hero-lw           from drawSVG 0                d 1.5
 *                      onStart -> .hero_tag { scale 1, opacity 1,
 *                                 d 1, delay 0.6, stagger 0.3, power4.out }
 *   .hero_lines-right  from clipPath inset(0% 100% 0% 0%) d 1  @ '-=0.3'
 *
 * DrawSVGPlugin is GSAP Club (paid). The same visual result is produced here
 * with stroke-dasharray / stroke-dashoffset, which is exactly what DrawSVG
 * animates internally — same technique already used for `.process-blue` in
 * useMotion.js.
 *
 * ---- Per-cycle phase (repeats forever, 3 cycles then loops) ----
 *   lineBTl:  [hero-l1] xPercent -100 -> 0            d 1     ease none
 *             #hero-lb  drawSVG 0% 0% -> 0% 100%      d 1.5   ease none
 *             [hero-l2] clipPath inset(0 100% 0 0) -> inset(0) d 1 @ '-=0.3'
 *   .hero_tag-text-wrap  width 0 -> auto  d 1   stagger 0.3 power4.out @ '<0.9'
 *   .hero_tag            MUTED -> ACTIVE  d 1.2 stagger 0.3 power4.out @ '<'
 *   promptTl        @ '<0.2'   content autoAlpha/blur(10px)->0 d1.5 power3.out
 *                              items y 1em->0 opacity d1 stagger .15 power3.out @0.2
 *   agentWorkflowTl @ '<0.4'   same in/out + per-item enable at t = 1.4 + i*0.35
 *                              (color/borderColor d 0.5 power2.out, spinner->check)
 *   decisioningTl   @ '<0.4'   same reveal; active row lights at t = 1 + cycle*0.15
 *                              person -> #0b4fff d0.8, text -> #232323 d0.8 power2.out
 *   variantTl       @ '<0.4'   content autoAlpha+blur d1.5, img scale 1.2->1 d1.5,
 *                              info items y10->0 d1 stagger .15 power3.out @0.3
 *   hold 1s, then phase-out: undraw + stepContents autoAlpha 0, blur(5px),
 *                            y 32, d 1, stagger 0.2, power3.out @ '<0.3'
 *
 * Tag colours (verbatim):
 *   MUTED  color #c3c2b2  bg #f0efe3  border #e2e1d3
 *   ACTIVE color #0b4fff  bg #d8dade  border #d8dade
 */

const TAG_MUTED = { color: '#c3c2b2', backgroundColor: '#f0efe3', borderColor: '#e2e1d3' }
const TAG_ACTIVE = { color: '#0b4fff', backgroundColor: '#d8dade', borderColor: '#d8dade' }

const ENABLED_COLOR = '#232323'
const ENABLED_BORDER = '#d8dade'

export function useHeroIntro() {
  useEffect(() => {
    // Reduced motion: leave every element at its natural, fully-visible state.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const root = document.querySelector('.section_hero')
    if (!root) return

    // Signals to CSS that GSAP owns the hero's start states from here. Until
    // this lands, the stylesheet keeps everything visible for the no-JS case.
    document.documentElement.classList.add('motion-js')

    const ctx = gsap.context(() => {
      const q = (s) => gsap.utils.toArray(root.querySelectorAll(s))

      /* ---------------- intro ---------------- */
      const h1 = q('.hero_main h1 .fd-part')
      const p1 = q('.hero_main .hero_p .fd-part')
      const nav = document.querySelector('.navbar1_container, .nav_fixed')
      const group = root.querySelector('.hero_main .button-group')

      const intro = gsap.timeline()
      if (nav) intro.from(nav, { yPercent: -100, opacity: 0, duration: 1.5, ease: 'power4.out' }, 0.3)
      if (h1.length) intro.from(h1, {
        y: 32, opacity: 0, rotation: 4, transformOrigin: 'left center',
        duration: 1, stagger: 0.15, ease: 'back.out',
      }, 0.5)
      if (p1.length) intro.from(p1, {
        yPercent: 100, opacity: 0, duration: 1, stagger: 0.1, ease: 'power4.out',
      }, '<0.3')
      if (group) intro.from(group, {
        y: 32, filter: 'blur(10px)', opacity: 0, duration: 1, ease: 'power4.out',
      }, '<0.3')

      /* ---------------- shared handles ---------------- */
      const visual = root.querySelector('.hero_visual')
      const mobile = root.querySelector('.hero_mobile')
      const isDesktop = visual && getComputedStyle(visual).display !== 'none'
      const scope = isDesktop ? visual : mobile
      if (!scope) return

      const tags = gsap.utils.toArray(scope.querySelectorAll('.hero_tag'))
      const tagWraps = gsap.utils.toArray(scope.querySelectorAll('.hero_tag-text-wrap'))
      const promptBox = scope.querySelector('.hero_step1-box')
      const workflowList = scope.querySelector('.hero_step2-list')
      const workflowItems = gsap.utils.toArray(scope.querySelectorAll('.hero_step2-list-item'))
      const audienceList = scope.querySelector('.hero_step3-list')
      const audienceRows = audienceList
        ? gsap.utils.toArray(audienceList.children) : []
      const variantWraps = gsap.utils.toArray(scope.querySelectorAll('.hero_step4 [data-step-last], .hero_m-card-wrap [data-step-last]'))

      const stepContents = [promptBox, workflowList, audienceList, ...variantWraps].filter(Boolean)

      // Stack the 2nd/3rd variant cards on top of the first (original does the
      // same with gsap.set position:absolute).
      variantWraps.slice(1).forEach((el) => gsap.set(el, { position: 'absolute', top: 0, left: 0 }))

      // Spinner: rotation 360, d 1, ease none, repeat -1, origin 50% 50%
      const spinners = gsap.utils.toArray(scope.querySelectorAll('img.hero_step2-list-icon'))
      if (spinners.length) {
        gsap.to(spinners, {
          rotation: 360, duration: 1, ease: 'none', repeat: -1, transformOrigin: '50% 50%',
        })
      }

      /* ---------------- the connector line (DrawSVG equivalent) ---------- */
      const lw = root.querySelector('#hero-lw')
      const lb = root.querySelector('#hero-lb')
      const lenOf = (el) => (el && el.getTotalLength ? el.getTotalLength() : 0)
      const lwLen = lenOf(lw)
      const lbLen = lenOf(lb)
      if (lw) gsap.set(lw, { strokeDasharray: lwLen, strokeDashoffset: lwLen })
      if (lb) gsap.set(lb, { strokeDasharray: lbLen, strokeDashoffset: lbLen, opacity: 0 })

      const linesLeft = root.querySelector('.hero_lines-left')
      const linesRight = root.querySelector('.hero_lines-right')
      const l1 = root.querySelector('[hero-l1]')
      const l2 = root.querySelector('[hero-l2]')

      // lineATl — the one-time draw of the grey rail.
      const lineATl = gsap.timeline({ defaults: { ease: 'none' } })
      if (linesLeft) lineATl.from(linesLeft, { xPercent: -100, duration: 1 })
      if (lw) {
        lineATl.to(lw, {
          strokeDashoffset: 0,
          duration: 1.5,
          onStart: () => {
            gsap.to(tags, {
              scale: 1, opacity: 1, duration: 1, delay: 0.6, stagger: 0.3, ease: 'power4.out',
            })
          },
        })
      }
      if (linesRight) {
        lineATl.from(linesRight, { clipPath: 'inset(0% 100% 0% 0%)', duration: 1 }, '-=0.3')
      }

      const mLines = gsap.utils.toArray(scope.querySelectorAll('.hero_m-line'))

      /* ---------------- per-phase builders ---------------- */
      // Blue progress draw for one cycle.
      function createLineBTl() {
        const tl = gsap.timeline({ defaults: { ease: 'none' } })
        tl.set([l1, l2, lb].filter(Boolean), { opacity: 1 }, 0)
        if (l1) tl.fromTo(l1, { xPercent: -100 }, { xPercent: 0, duration: 1 })
        if (lb) tl.fromTo(lb, { strokeDashoffset: lbLen }, { strokeDashoffset: 0, duration: 1.5 })
        if (l2) {
          tl.fromTo(l2, { clipPath: 'inset(0% 100% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, '-=0.3')
        }
        // Mobile rail equivalent: the original fills .hero_m-line widths 0 -> 100%.
        if (mLines.length) {
          tl.fromTo(mLines, { width: '0%' }, { width: '100%', duration: 1, stagger: 0.3 }, 0)
        }
        return tl
      }

      function createLineBUndraw() {
        const tl = gsap.timeline({ defaults: { ease: 'none' } })
        if (l1) tl.to(l1, { xPercent: 100, duration: 1 })
        if (lb) {
          tl.to(lb, {
            strokeDashoffset: -lbLen,
            duration: 1.5,
            onStart: () => {
              gsap.to(tagWraps, { width: 0, duration: 1, delay: 0.6, stagger: 0.3, ease: 'power4.out' })
              gsap.to(tags, { ...TAG_MUTED, duration: 1.2, delay: 0.6, stagger: 0.3, ease: 'power4.out' })
            },
          })
        }
        if (l2) tl.to(l2, { clipPath: 'inset(0% 0% 0% 100%)', duration: 1 }, '-=0.3')
        if (mLines.length) tl.to(mLines, { width: '0%', duration: 1, stagger: 0.3 }, 0)
        return tl
      }

      // Shared reveal: content un-blurs over 1.5s, children stagger in at 0.2.
      function revealInto(tl, content, items, extraSets) {
        if (!content) return tl
        tl.set(content, { autoAlpha: 0, filter: 'blur(10px)', y: 0 }, 0)
          .set(items, { y: '1em', opacity: 0 }, 0)
        if (extraSets) extraSets(tl)
        tl.to(content, { autoAlpha: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' }, 0)
          .to(items, { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }, 0.2)
        return tl
      }

      function createPromptTl() {
        const items = promptBox ? gsap.utils.toArray(promptBox.children) : []
        return revealInto(gsap.timeline(), promptBox, items)
      }

      function createAgentWorkflowTl() {
        const tl = gsap.timeline()
        if (!workflowList) return tl
        revealInto(tl, workflowList, workflowItems, (t) => {
          t.set(workflowItems, { color: '#c3c2b2', borderColor: '#e2e1d3' }, 0)
          workflowItems.forEach((item) => {
            const done = item.querySelector('.hero_step2-list-icon.is-done')
            const spin = item.querySelector('img.hero_step2-list-icon')
            if (done) t.set(done, { display: 'none' }, 0)
            if (spin) t.set(spin, { display: 'flex' }, 0)
          })
        })
        // Per-item "completed" flip: t = 1.4 + i * 0.35
        workflowItems.forEach((item, i) => {
          const done = item.querySelector('.hero_step2-list-icon.is-done')
          const spin = item.querySelector('img.hero_step2-list-icon')
          const t = 1.4 + i * 0.35
          tl.to(item, {
            color: ENABLED_COLOR, borderColor: ENABLED_BORDER,
            duration: 0.5, ease: 'power2.out',
          }, t)
          if (done) tl.set(done, { display: 'flex' }, t)
          if (spin) tl.set(spin, { display: 'none' }, t)
        })
        return tl
      }

      function createDecisioningTl(cycle) {
        const tl = gsap.timeline()
        if (!audienceList) return tl
        const persons = gsap.utils.toArray(audienceList.querySelectorAll('.hero_step1-person'))
        const texts = gsap.utils.toArray(audienceList.querySelectorAll('.hero_step3-text'))
        revealInto(tl, audienceList, audienceRows, (t) => {
          t.set(persons, { color: '#c3c2b2' }, 0).set(texts, { color: '#c3c2b2' }, 0)
        })
        const active = audienceRows[cycle]
        if (active) {
          const person = active.querySelector('.hero_step1-person')
          const text = active.querySelector('.hero_step3-text')
          const t = 1 + cycle * 0.15
          if (person) tl.to(person, { color: '#0b4fff', duration: 0.8, ease: 'power2.out' }, t)
          if (text) tl.to(text, { color: '#232323', duration: 0.8, ease: 'power2.out' }, t)
        }
        return tl
      }

      function createVariantTl(cycle) {
        const tl = gsap.timeline()
        const content = variantWraps[cycle]
        if (!content) return tl
        const img = content.querySelector('.hero_step3-img')
        const infoItems = gsap.utils.toArray(content.querySelectorAll('.hero_step3-info > *'))
        tl.set(variantWraps, { autoAlpha: 0 }, 0)
          .set(content, { filter: 'blur(10px)', y: 0 }, 0)
          .set(img, { scale: 1.2 }, 0)
          .set(infoItems, { y: 10, opacity: 0 }, 0)
        tl.to(content, { autoAlpha: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' }, 0)
          .to(img, { scale: 1, duration: 1.5, ease: 'power3.out' }, 0)
          .to(infoItems, { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }, 0.3)
        return tl
      }

      function addPhaseIn(tl, cycle, pos) {
        tl.add(createLineBTl(), pos)
          .fromTo(tagWraps, { width: 0 },
            { width: 'auto', duration: 1, stagger: 0.3, ease: 'power4.out', immediateRender: false }, '<0.9')
          .fromTo(tags, TAG_MUTED,
            { ...TAG_ACTIVE, duration: 1.2, stagger: 0.3, ease: 'power4.out', immediateRender: false }, '<')
          .add(createPromptTl(), '<0.2')
          .add(createAgentWorkflowTl(), '<0.4')
          .add(createDecisioningTl(cycle), '<0.4')
          .add(createVariantTl(cycle), '<0.4')
          .to({}, { duration: 1 })
      }

      function addPhaseOut(tl) {
        tl.add(createLineBUndraw(), '-=0.5')
          .to(stepContents, {
            autoAlpha: 0, filter: 'blur(5px)', y: 32,
            duration: 1, stagger: 0.2, ease: 'power3.out',
          }, '<0.3')
          .to({}, { duration: 0.3 })
      }

      /* ---------------- assemble ---------------- */
      gsap.set(tagWraps, { width: 0 })
      gsap.set(tags, { scale: 0, opacity: 0, ...TAG_MUTED })
      gsap.set(stepContents, { autoAlpha: 0 })

      const loop = gsap.timeline({ repeat: -1 })
      loop.set([l1, l2, lb].filter(Boolean), { opacity: 0 })
      addPhaseIn(loop, 0, 0)
      addPhaseOut(loop)
      addPhaseIn(loop, 1, '-=0.5')
      addPhaseOut(loop)
      addPhaseIn(loop, 2, '-=0.5')
      addPhaseOut(loop)
      loop.set([l1, l2, lb].filter(Boolean), { opacity: 0 })

      intro.add(lineATl, 0).add(loop)
    }, root)

    return () => ctx.revert()
  }, [])
}
