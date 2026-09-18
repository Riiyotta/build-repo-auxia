import { Link } from 'react-router-dom'

/**
 * Decisioning hero. Measured on .section_agent-hero.is-decision:
 *   ground rgb(11,79,255) = blue, section padding-top 112px,
 *   .agent-hero_content flex-col gap 80px, padding 64px 0
 *   heading rail 800px | right rail 400px, h1 104px/98.8, body 20px/26
 *   .agent-hero_timeline: a 2px paper/20 progress rail over a 4-column
 *   flex row (gap 32px) — USER / INGEST / DECISIONS / CONTENT.
 *     .agent-hero_tag pill: 6px/10px padding, radius 1440px, ground rgb(62,115,255)
 *     .agent-hero_offers card: 16px padding, radius 16px, blue ground,
 *       1px rgba(255,255,255,.3) border.
 *   The rail fill and the column contents animate on the original; this builds
 *   the resting state — see the Animation handoff note.
 */
const USERS = [
  { name: 'Alex Morgan',   tags: ['TRAVEL ENTHUSIAST', 'FREQUENT FLYER'] },
  { name: 'Sam Chen',      tags: ['EVERYDAY SPENDER', 'GROCERIES, GAS'] },
  { name: 'Jordan Reeves', tags: ['PREMIUM LIFESTYLE', 'FINE DINING'] },
]

const SIGNALS = [
  ['page_view', 'JFK→LHR'], ['search', 'flights'],
  ['scroll', 'hotels'], ['cart', 'prem. econ.'],
]

const OFFERS = [
  ['5X ON BLUEWING FLI…', '0.54'], ['4X MARLOW POINTS', '0.40'],
  ['$200 TRAVEL CREDIT', '0.25'],  ['$85 TSA PRECHECK', '0.12'],
  ['CENTURION LOUNGE', '0.00'],    ['HERTZ GOLD 4X', '0.00'],
  ['$100 HOTELS CREDIT', '0.00'],  ['FX FEE WAIVER', '0.00'],
]

function Tag({ children }) {
  return (
    <div className="agent-hero_tag inline-flex flex-none items-center rounded-full px-2.5 py-1.5
                    font-mono text-[0.8125rem] uppercase leading-[1.3]"
         style={{ backgroundColor: '#3e73ff' }}>
      {children}
    </div>
  )
}

/* .agent-hero_cards — measured on the original's CONTENT column. */
const CONTENT_CARDS = [
  { cat: 'travel', score: '0.94', headline: '5x on Bluewing flights',
    rationale: 'Selected for Alex from 312 candidates' },
  { cat: 'hotel', score: '0.88', headline: '4x Marlow points', rationale: '' },
]

export default function DecisionHero() {
  return (
    <section className="section_agent-hero is-decision relative overflow-hidden bg-blue pt-28 text-paper">
      {/* .agent-hero_background.is-alt — the hero dot field. Measured on the
          original: a CSS radial-gradient (NOT a canvas), absolute inset-0,
          2px dots of rgba(255,255,255,0.2) on a 20px x 20px tile. */}
      <div className="agent-hero_background is-alt pointer-events-none absolute inset-0"
           aria-hidden="true"
           style={{
             backgroundImage:
               'radial-gradient(circle, rgba(255,255,255,0.2) 2px, rgba(0,0,0,0) 2px)',
             backgroundSize: '20px 20px',
           }} />
      <div className="padding-global relative">
        <div className="container-large">
          <div className="agent-hero_content flex flex-col gap-10 py-16 md:gap-20">
            <div className="agent-hero_top flex flex-col gap-6">
              <div className="stack_title reveal">
                AUXIA DECISIONING
              </div>
              <div className="agent-hero_info flex flex-col gap-4 min-[992px]:flex-row">
                {/* The original constrains this to 800px, where its PP Neue Montreal
                    h1 sets in 3 lines. Archivo (the OFL substitute) runs a touch
                    wider and tips "decision" onto a 4th line at exactly 800px,
                    which made the hero 255px too tall. 52.5rem/840px is the
                    nearest width that restores the original's 3-line set
                    (measured threshold: 820px). */}
                <div className="agent-hero_heading min-[992px]:w-[52.5rem] min-[992px]:flex-none">
                  <h1 className="reveal" data-reveal-delay="60">
                    The engine behind every customer decision
                  </h1>
                </div>
                <div className="agent-hero_right flex flex-col gap-10 min-[992px]:w-[25rem] min-[992px]:flex-none">
                  <div className="reveal text-xl leading-[1.3]" data-reveal-delay="120">
                    Auxia Decisioning makes a real-time, one-to-one call for every customer on
                    every request, using first-party and session data.
                  </div>
                  <div className="agent-hero_cta reveal" data-reveal-delay="180">
                    <Link to="/demo" className="btn border-2 border-paper bg-paper text-ink/90
                                                transition-colors duration-200 hover:bg-transparent hover:text-paper">
                      Request a Demo
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* The original is display:block (no gap); its 2px rule carries
                margin-bottom:-16px, pulling the 450px grid up so the whole
                timeline is 2 - 16 + 450 = 436px. */}
            <div className="agent-hero_timeline block">
              {/* progress rail — Animation drives the fill width */}
              <div className="agent-hero_line mb-6 h-0.5 w-full bg-paper/20 min-[992px]:-mb-4" aria-hidden="true">
                <div className="agent-hero_progress h-full w-full bg-paper" />
              </div>

              {/* The original is a FLEX row whose columns size to their content
                  (156/176/236/268px), not an equal-width grid. Forcing 4 equal
                  284px columns made every column wrap more and pushed the
                  timeline 117px taller than the original's 450px. */}
              <div className="agent-hero_timeline-grid flex flex-col gap-8 min-[992px]:h-[28.125rem] min-[992px]:max-h-[28.125rem] min-[992px]:flex-row min-[992px]:items-stretch">
                {/* USER */}
                <div className="agent-hero_wrap flex flex-col items-start gap-6 min-[992px]:h-full min-[992px]:flex-none min-[992px]:overflow-hidden">
                  <Tag>USER</Tag>
                  {USERS.map((u) => (
                    <div key={u.name} className="agent-hero_user flex flex-col gap-1">
                      <div className="text-xl leading-[1.2]">{u.name}</div>
                      {u.tags.map((t) => (
                        <div key={t} className="font-mono text-xs uppercase leading-[1.3] text-paper/60">
                          {t}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* INGEST */}
                <div className="agent-hero_wrap flex flex-col items-start gap-6 min-[992px]:h-full min-[992px]:flex-none min-[992px]:overflow-hidden">
                  <Tag>INGEST</Tag>
                  <div className="agent-hero_ingest-wrap flex w-full flex-col gap-2">
                    {['INGEST', 'TRANSACTIONS', 'ATTRIBUTES'].map((group) => (
                      <div key={group} className="agent-hero_ingest flex flex-col gap-2">
                        <div className="font-mono text-xs uppercase leading-[1.3] text-paper/60">
                          {group}
                        </div>
                        {SIGNALS.map(([k, v]) => (
                          <div key={group + k}
                               className="flex items-center justify-between gap-2 rounded-lg
                                          border border-white/20 px-2.5 py-1.5 font-mono text-xs uppercase leading-[1.3]">
                            <span className="text-paper/70">{k}</span>
                            <span>{v}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* DECISIONS */}
                <div className="agent-hero_wrap flex flex-col items-start gap-6 min-[992px]:h-full min-[992px]:flex-none min-[992px]:overflow-hidden">
                  <Tag>DECISIONS</Tag>
                  <div className="agent-hero_offers flex w-full flex-col gap-2 rounded-2xl
                                  border border-white/30 bg-blue p-4">
                    <div className="text-xl leading-[1.2]">Ranked Offers</div>
                    {OFFERS.map(([label, score], i) => (
                      <div key={label}
                           className="flex items-center gap-2 font-mono text-xs uppercase leading-[1.3] tracking-[-.05em]">
                        <span className="w-4 flex-none text-paper/60">{i + 1}</span>
                        <span className="flex-1 truncate">{label}</span>
                        <span className="flex-none tabular-nums text-paper/70">{score}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CONTENT — the original's 268px column holds two offer
                    cards (.agent-hero_cards): a category + confidence score,
                    a headline, then a rationale and a "Pick" CTA. */}
                <div className="agent-hero_wrap flex flex-col items-start gap-6 min-[992px]:w-[16.75rem] min-[992px]:flex-none">
                  <Tag>CONTENT</Tag>
                  <div className="agent-hero_cnt flex w-full flex-col gap-2">
                    {CONTENT_CARDS.map((c, i) => (
                      <div key={c.cat}
                           className={`agent-hero_cards flex flex-col gap-1 rounded-xl border p-3 ${
                             i === 0 ? 'border-white/40 bg-white/10' : 'border-white/20'}`}>
                        <div className="flex items-center justify-between font-mono text-xs uppercase leading-[1.3] text-paper/70">
                          <span>{c.cat}</span>
                          <span className="agent-hero_percent tabular-nums">{c.score}</span>
                        </div>
                        <div className="text-base leading-[1.2]">{c.headline}</div>
                        {i === 0 && (
                          <div className="mt-1 flex items-end justify-between gap-2">
                            <div className="font-mono text-[0.625rem] uppercase leading-[1.3] text-paper/60">
                              {c.rationale}
                            </div>
                            <span className="agent-hero_card-cta flex-none rounded-md bg-paper px-2 py-1 font-mono text-[0.625rem] uppercase leading-none text-ink">
                              Pick
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* .agent-hero_wrap.is-exp — the only flexible column
                    (flex: 1 1 0%). Holds the "experience" tag and the card
                    image, which renders 267x336 on the original. */}
                <div className="agent-hero_wrap is-exp flex w-full flex-col items-start gap-6 min-[992px]:min-w-0 min-[992px]:flex-1">
                  <Tag>EXPERIENCE</Tag>
                  <div className="agent-hero_exp w-full max-w-[16.6875rem]">
                    <img src="/assets/img/dc-flightcard.png" alt="" loading="lazy"
                         className="agent-hero_exp-img w-full rounded-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
