import { useEffect, useRef } from 'react'

/**
 * .features_canvas-line — the connector between feature rows.
 *
 * Measured by intercepting CanvasRenderingContext2D on the original's product
 * pages. Each connector is a 1232x180 canvas (backing store at 2x DPR) that
 * strokes the path TWICE at lineWidth 3: a full oat #e2e1d3 track, then a
 * blue #0b4fff progress line dashed over it.
 *
 * The path uses arcTo with a 40px corner radius — intercepting only
 * moveTo/lineTo hides the arcs and makes it look like a sharp dog-leg:
 *   moveTo(x0, 0) lineTo(x0, 50)
 *   arcTo(x0, 90, x1, 90, 40) lineTo(x1, 90)
 *   arcTo(x2, 90, x2, 130, 40) lineTo(x2, 180)
 *
 * It is NOT static — the line DRAWS ITSELF IN on scroll via setLineDash:
 *   setLineDash([drawn, pathLen]), drawn sweeping 0 -> pathLen - 10.
 * Measured lengths: 779.66 at 1232px wide, 763.66 at 1200, 619.66 at 912
 * (467.66 / 459.66 / 387.67 for the short closing variant).
 *
 * Progress vs the canvas's viewport position, sampled on the original at
 * vh=900: top 584 -> 37%, 466 -> 70%, 365 -> 97%, <=355 -> 100% and holds.
 * That is a ramp from top = 0.75*vh down to 0.40*vh.
 *
 * Rows alternate which side their image sits on, so the connectors alternate
 * direction; the last one lands centre to meet the closing block.
 */

const TRACK = '#e2e1d3'      // the full-length rail
const PROGRESS = '#0b4fff'   // the blue line that draws in over it
const LINE_W = 3
const VB_W = 1232
const VB_H = 180
const RADIUS = 40

const Q1 = 304 / VB_W
const Q3 = 928 / VB_W
const RUNOUT = 40

function geometry(variant, w) {
  const q1 = w * Q1
  const q3 = w * Q3
  const mid = w * (616 / VB_W)
  if (variant === 'ltr') return { x0: q1, x1: q3 - RUNOUT, x2: q3 }
  if (variant === 'close') return { x0: q1, x1: mid - RUNOUT, x2: mid }
  return { x0: q3, x1: q1 + RUNOUT, x2: q1 }
}

function tracePath(ctx, g, sy) {
  ctx.moveTo(g.x0, 0)
  ctx.lineTo(g.x0, 50 * sy)
  ctx.arcTo(g.x0, 90 * sy, g.x1, 90 * sy, RADIUS)
  ctx.lineTo(g.x1, 90 * sy)
  ctx.arcTo(g.x2, 90 * sy, g.x2, 130 * sy, RADIUS)
  ctx.lineTo(g.x2, 180 * sy)
}

/**
 * Length of the rounded path: the straight runs plus two quarter-circles,
 * with each corner's arc replacing RADIUS of straight run on both sides.
 */
function pathLength(g, sy) {
  const y50 = 50 * sy
  const y90 = 90 * sy
  const y180 = 180 * sy
  const down1 = Math.max(0, y90 - y50 - RADIUS)
  const across = Math.max(0, Math.abs(g.x2 - g.x0) - 2 * RADIUS)
  const down2 = Math.max(0, y180 - y90 - RADIUS)
  const quarter = (Math.PI / 2) * RADIUS
  return y50 + down1 + quarter + across + quarter + down2
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

  // the original's y values are authored against a 180px box
  const sy = h / VB_H
  const g = geometry(variant, w)
  // Two layers, exactly as the original strokes them per frame:
  //   1. the full oat track, undashed
  //   2. the blue progress line dashed over it, [drawn, pathLen + 10] — the
  //      gap total is padded 10px past the real length so the tail never
  //      re-enters (measured 769.66 drawn of a 779.66 total at 1232px wide).
  const len = pathLength(g, sy)
  const drawn = len * progress

  ctx.lineWidth = LINE_W
  ctx.lineJoin = 'round'
  ctx.lineCap = 'butt'

  ctx.strokeStyle = TRACK
  ctx.setLineDash([])
  ctx.beginPath()
  tracePath(ctx, g, sy)
  ctx.stroke()

  if (drawn > 0.5) {
    ctx.strokeStyle = PROGRESS
    ctx.setLineDash([drawn, len + 10])
    ctx.beginPath()
    tracePath(ctx, g, sy)
    ctx.stroke()
    ctx.setLineDash([])
  }
}

export default function FeatureConnector({ variant = 'rtl' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const progressNow = () => {
      if (reduced) return 1
      const r = canvas.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const start = vh * 0.75
      const end = vh * 0.4
      return Math.max(0, Math.min(1, (start - r.top) / (start - end)))
    }

    let raf = 0
    let last = -1
    const render = () => {
      raf = 0
      const pr = Math.round(progressNow() * 200) / 200
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
    <div className="features_canvas-wrap h-20 w-full md:h-[11.25rem]" aria-hidden="true">
      <canvas ref={ref} className="features_canvas-line block h-full w-full" />
    </div>
  )
}
