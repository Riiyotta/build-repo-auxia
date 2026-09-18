import { Link } from 'react-router-dom'

/**
 * Cross-sell prefooter. Measured on .section_prefooter:
 *   blue ground, .padding-global padding 128px 40px,
 *   .prefooter_content is a 12-col grid, padding 40px, radius 24px,
 *   4px border rgba(255,255,255,.1), gap 16px.
 *   Label .prefooter_title 16px/20.8, h2 48px/45.6 in paper,
 *   button is the paper-filled .is-secondary on blue.
 */
export default function Prefooter({ label, heading, body, cta, to }) {
  return (
    <section className="section_prefooter bg-blue text-paper">
      <div className="padding-global py-24 min-[992px]:py-32">
        <div className="container-large">
          <div className="prefooter_content reveal grid gap-4 rounded-3xl border-4 border-white/10 p-10
                          min-[992px]:grid-cols-12">
            <div className="flex flex-col gap-4 min-[992px]:col-span-7">
              <div className="prefooter_title text-base leading-[1.3]">{label}</div>
              <h2 className="text-h3">{heading}</h2>
            </div>
            <div className="flex flex-col items-start justify-end gap-6 min-[992px]:col-span-5">
              <p className="text-base leading-[1.3] text-paper/80">{body}</p>
              <Link to={to} className="btn border-2 border-paper bg-paper text-ink/90
                                       transition-colors duration-200 hover:bg-transparent hover:text-paper">
                {cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
