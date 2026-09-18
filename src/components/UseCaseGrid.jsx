/**
 * "USE CASES" card grid. Measured on .section_grid:
 *   ground rgb(254,253,245) — one step warmer than --paper, so it is written
 *   literally here rather than borrowed from the paper token.
 *   .grid_content padding 120px 0, flex-col gap 64px
 *   .grid_info flex-col gap 24px, 640px wide with 60px right padding
 *     eyebrow .stack_title 14px/18.2, h2 64px/60.8
 *   .grid_cards grid gap 16px — 3 cols on agent-studio (400px),
 *     4 cols on decisioning (296px). Column count is passed in.
 *   .grid_card padding 24px, radius 24px, 1px border rgb(226,225,211) = oat-dark,
 *     48px icon, title .text-size-large 24px/26.4, body 16px/20.8 muted.
 */
const ICONS = {
  launch:   'M4 12h16M12 4v16',
  diagnose: 'M4 18l5-6 4 4 7-9',
  approve:  'M5 13l4 4L19 7',
  refresh:  'M4 12a8 8 0 1 1 2.3 5.7M4 12V6m0 6h6',
  report:   'M6 20V10m6 10V4m6 16v-7',
  board:    'M4 5h16v11H4zM9 20h6',
}

export default function UseCaseGrid({ eyebrow, heading, cards, cols = 3 }) {
  return (
    <section className="section_grid" style={{ backgroundColor: '#fefdf5' }}>
      <div className="padding-global">
        <div className="container-large">
          <div className="grid_content flex flex-col gap-10 py-16 md:gap-16 min-[992px]:py-[7.5rem]">
            <div className="grid_info flex max-w-[40rem] flex-col gap-6 min-[992px]:pr-[3.75rem]">
              <p className="stack_title reveal">{eyebrow}</p>
              <h2 className="reveal" data-reveal-delay="60">{heading}</h2>
            </div>

            <div className={`grid_cards grid gap-4 sm:grid-cols-2 ${
                              cols === 4 ? 'min-[992px]:grid-cols-4' : 'min-[992px]:grid-cols-3'}`}>
              {cards.map((c, i) => (
                <div key={c.title}
                     className="grid_card reveal flex flex-col justify-between gap-16
                                rounded-3xl border border-oat-dark p-6"
                     data-reveal-delay={60 + (i % cols) * 60}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true"
                       className="text-blue">
                    <path d={ICONS[c.icon] || ICONS.launch} stroke="currentColor"
                          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex flex-col gap-4">
                    <div className="text-2xl leading-[1.1]">{c.title}</div>
                    <div className="grid_text text-base leading-[1.3] text-ink/70">{c.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
