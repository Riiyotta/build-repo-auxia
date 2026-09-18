import { useEffect, useRef } from 'react'

/**
 * The Marketing section's two <canvas> fields.
 *
 * This is a CUSTOMER JOURNEY DIAGRAM, not an abstract line chart: a faint dot
 * grid with channel glyphs (laptop / envelope / phone) placed on it, thin paths
 * threading between them, white node dots at touchpoints, and — in the "mess"
 * variant — a red ✕ marking a drop-off.
 *
 * Measured off the live original by intercepting CanvasRenderingContext2D:
 *   - dot grid on a 42px pitch, r≈3, origin (6, 8)
 *   - paths stroked at lineWidth 2 in rgba(255,255,255,0.1) / #F0EFE3
 *   - geometry is STATIC (redrawn on resize/scroll, but identical each frame),
 *     so this renders once rather than running an animation loop
 *
 * `variant="mess"`  → paths wander and cross, one ends in a ✕
 * `variant="clean"` → paths run straight and parallel into a single endpoint
 */

/* Measured by intercepting ctx.arc on the original at 1440x900, with the
   section settled in view: a 30 x 18 field at 37.09px pitch, first dot at
   (55.65, 18.55), radius 5.01, fill rgba(255,255,255,0.1).
   The clone previously used a 42px pitch at r=2.2, which read as a much
   sparser, finer field than the original's.
   The dots also grow 0 -> 5.01 as the section scrolls in (scroll-driven, not a
   rAF loop — parked in view the original issues zero redraws). */
const PITCH = 37.09
const OX = 55.65
const OY = 18.55
const DOT_R = 5.01
const DOT = 'rgba(255,255,255,0.10)'
const PATH = 'rgba(240,239,227,0.30)'
const NODE = '#F0EFE3'
const RED = '#e5484d'

const gx = (c) => OX + c * PITCH
const gy = (r) => OY + r * PITCH

/* --- channel glyphs, drawn at ~18px, centred on a grid node --- */
function glyphLaptop(ctx, x, y) {
  ctx.strokeStyle = NODE
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.roundRect(x - 9, y - 7, 18, 12, 1.5)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x - 12, y + 7)
  ctx.lineTo(x + 12, y + 7)
  ctx.stroke()
}

function glyphMail(ctx, x, y) {
  ctx.strokeStyle = NODE
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.roundRect(x - 9, y - 6, 18, 12, 1.5)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x - 9, y - 5)
  ctx.lineTo(x, y + 2)
  ctx.lineTo(x + 9, y - 5)
  ctx.stroke()
}

function glyphPhone(ctx, x, y) {
  ctx.strokeStyle = NODE
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.roundRect(x - 5.5, y - 9, 11, 18, 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(x, y + 5.5, 0.9, 0, Math.PI * 2)
  ctx.fillStyle = NODE
  ctx.fill()
}

function nodeDot(ctx, x, y) {
  ctx.beginPath()
  ctx.arc(x, y, 3.2, 0, Math.PI * 2)
  ctx.fillStyle = NODE
  ctx.fill()
}

function cross(ctx, x, y) {
  ctx.strokeStyle = RED
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  const s = 6
  ctx.beginPath()
  ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s)
  ctx.moveTo(x + s, y - s); ctx.lineTo(x - s, y + s)
  ctx.stroke()
}

function polyline(ctx, pts) {
  ctx.strokeStyle = PATH
  ctx.lineWidth = 1
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.beginPath()
  pts.forEach(([c, r], i) => (i ? ctx.lineTo(gx(c), gy(r)) : ctx.moveTo(gx(c), gy(r))))
  ctx.stroke()
}

function draw(canvas, variant, progress = 1) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  if (!w || !h) return

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)

  const cols = Math.floor((w - OX) / PITCH)
  const rows = Math.floor((h - OY) / PITCH)

  // --- dot grid ---
  // The original grows each dot 0 -> DOT_R as the section scrolls into view.
  const dotR = DOT_R * progress
  ctx.fillStyle = DOT
  if (dotR > 0.01) {
    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath()
        ctx.arc(gx(c), gy(r), dotR, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  const last = cols
  const mid = Math.max(1, Math.round(rows / 2))

  if (variant === 'clean') {
    // Resolved: parallel paths converging on one endpoint.
    const lanes = [mid - 2, mid, mid + 2].filter((r) => r >= 0 && r <= rows)
    lanes.forEach((r) => polyline(ctx, [[1, r], [last - 3, r], [last - 1, mid]]))
    lanes.forEach((r) => nodeDot(ctx, gx(1), gy(r)))
    glyphMail(ctx, gx(1), gy(lanes[0]))
    glyphPhone(ctx, gx(1), gy(lanes[lanes.length - 1]))
    nodeDot(ctx, gx(last - 1), gy(mid))
    glyphLaptop(ctx, gx(last - 1), gy(mid))
    return
  }

  // --- mess: a few sparse routes that wander and cross, leaving most of the
  // grid empty. The original reads as ~4 long journeys, not a dense chart. ---
  const p1 = [[2, 1], [7, 1], [11, mid], [15, rows - 1]]
  const p2 = [[1, mid], [4, mid + 2], [9, mid - 1], [14, mid + 1], [20, 1], [cols, 0]]
  const p3 = [[7, 0], [12, mid + 2], [18, rows], [24, mid]]
  const p4 = [[19, 1], [21, mid - 1], [23, mid + 2]]

  ;[p1, p2, p3, p4].forEach((p) => polyline(ctx, p.filter(([c, r]) => c <= cols && r >= 0 && r <= rows)))

  // touchpoint nodes — only where routes genuinely turn
  ;[[7, 1], [11, mid], [4, mid + 2], [20, 1], [24, mid], [18, rows]]
    .filter(([c, r]) => c <= cols && r >= 0 && r <= rows)
    .forEach(([c, r]) => nodeDot(ctx, gx(c), gy(r)))

  // channel glyphs
  if (cols > 3) glyphMail(ctx, gx(2), gy(1))
  if (cols > 8) glyphLaptop(ctx, gx(7), gy(0))
  if (cols > 20) glyphMail(ctx, gx(19), gy(1))
  if (rows > 2) glyphPhone(ctx, gx(1), gy(mid))
  if (cols > 26) glyphPhone(ctx, gx(cols), gy(0))

  // the drop-off
  if (cols > 5) cross(ctx, gx(5), gy(mid))
}

export default function MarketingCanvas({ variant = 'mess', className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Scroll-driven, matching the original: the dots are at r=0 while the
    // section is still below the viewport and reach full size as it settles in.
    const progressNow = () => {
      if (reduced) return 1
      const r = canvas.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // Measured on the original: once the canvas has entered the viewport the
      // dots sit at their full 5.01 radius for as long as the section is on
      // screen — they only ramp while it is still crossing the fold. Ramping
      // across the whole scroll-through left the clone stuck near r=3.2.
      const entered = vh - r.top          // px of the canvas past the fold
      if (entered <= 0) return 0
      return Math.min(1, entered / 120)
    }

    let raf = 0
    let last = -1
    const render = () => {
      raf = 0
      const pr = Math.round(progressNow() * 100) / 100
      if (pr === last) return
      last = pr
      draw(canvas, variant, pr)
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(render) }

    render()
    const ro = new ResizeObserver(() => { last = -1; schedule() })
    ro.observe(canvas)
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [variant])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`marketing_canvas block h-full w-full ${className}`}
    />
  )
}
