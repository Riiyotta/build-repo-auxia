import { useEffect, useRef } from 'react'

/**
 * .cta_canvas — the dot field behind the closing CTA.
 *
 * Measured by intercepting CanvasRenderingContext2D on the original: a
 * full-bleed 1440x562 canvas carrying a 42px-pitch dot grid, origin (6, 8.2),
 * radius 3, fill rgba(255,255,255,0.18) — 35 x 14 dots at 1440 wide.
 *
 * The original runs this inside a ~60fps rAF loop (121 clearRect calls in 2s
 * while parked, 490 fills per frame), but every frame paints the SAME arcs at
 * the same positions, radii and fill: the only op that changes count is `fill`.
 * The field is visually static, so this renders once per size change instead of
 * burning a frame budget to redraw an identical image.
 */

const PITCH = 42
const OX = 6
const OY = 8.2
const DOT_R = 3
const DOT = 'rgba(255,255,255,0.18)'

function draw(canvas) {
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

  ctx.fillStyle = DOT
  for (let x = OX; x <= w; x += PITCH) {
    for (let y = OY; y <= h; y += PITCH) {
      ctx.beginPath()
      ctx.arc(x, y, DOT_R, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

export default function CtaCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const render = () => draw(canvas)
    render()
    const ro = new ResizeObserver(render)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  return (
    <canvas ref={ref} aria-hidden="true"
            className="cta_canvas pointer-events-none absolute inset-0 block h-full w-full" />
  )
}
