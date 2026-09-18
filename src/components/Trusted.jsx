/**
 * Trusted.
 * Measured on the live original: dark ground rgb(35,35,35), content padding
 * 128px top/bottom with a 128px gap between the top row and the grid (32px at
 * <768). The grid is 3 equal columns, gap 16px at >=992 and 40px below.
 * Cards have no border/background — they are 24px-padded columns with a 48px
 * internal gap and an 80px icon. The blue rule is a 4px-wide VERTICAL bar
 * absolutely positioned on the card's left edge running its full height (the
 * original animates its height via GSAP; the static baseline is full height).
 * Measured .trusted_grid: 3x400px cols gap 16px at >=992, and a single-column
 * flex/grid stack with gap 40px below 992 — not md:grid-cols-3.
 */
const PILLARS = [
  { title: 'SOC 2 Type II Certified', body: 'Independently verified security and controls.' },
  { title: 'Private By Design',       body: 'Customer data is never used to train models or shared externally.' },
  { title: 'GDPR Compliant',          body: 'Compliant with GDPR and global data protection standards.' },
]

export default function Trusted() {
  return (
    <section className="section_trusted bg-ink text-paper">
      <div className="padding-global">
        <div className="trusted_content container-large flex flex-col gap-8 py-16 md:gap-32 md:py-32">

          <div className="trusted_top flex flex-col justify-between gap-8 lg:flex-row">
            <div className="reveal lg:w-[30.5rem] lg:flex-none">
              <h2>
                <span className="text-paper/40">Built for enterprise.</span>{' '}
                Trusted globally.
              </h2>
            </div>
            <p className="reveal text-base leading-[1.3] text-paper/70 lg:w-[25rem] lg:flex-none lg:pr-12"
               data-reveal-delay="80">
              Built with enterprise-grade security, privacy, and reliability, at its core, Auxia is
              trusted by industry leaders worldwide.
            </p>
          </div>

          <div className="trusted_grid grid gap-10 min-[992px]:grid-cols-3 min-[992px]:gap-4">
            {PILLARS.map((p) => (
              <div key={p.title}
                   className="trusted_card relative flex flex-col gap-12 px-6">
                <div className="trusted_line absolute left-0 top-0 h-full w-1 bg-blue" />
                <img src="/assets/icons/checkmark.svg" alt=""
                     className="h-20 w-20 brightness-0 invert" />
                <div className="trusted_info flex flex-col gap-4">
                  <h3>{p.title}</h3>
                  <p className="text-base leading-[1.3] text-paper/50">{p.body}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
