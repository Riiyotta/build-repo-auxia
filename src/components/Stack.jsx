/**
 * The marketing stack.
 *
 * Measured on the live original: this section is NOT a 3-card grid. It is a
 * .layout48_wrapper flex column (gap 16px) holding three full-width panels:
 *   1. .layout48_component   — cream #fefdf5, radius 24, pad 48/40 (40/16 <768)
 *   2. .layout48_agent       — ink  rgb(35,35,35), radius 24, pad 40
 *   3. .layout48_decisioning — blue rgb(11,79,255), radius 24, pad 40
 *
 * Vertical rhythm lives on the inner .padding-section-large wrapper, not on
 * <section>: 128px >=992, 96px 768-991, 64px <768, 48px <480.
 *
 * Panel 1 inner grids (.layout48_header / .layout48_content) are 2-col
 * 613.53px/454.47px (i.e. 1.35fr/1fr) with column-gap 80px / row-gap 64px at
 * >=992, collapsing to 1 col with 48/32 then 20/20 gaps below.
 * Panels 2-3 use .layout48_agent-grid: 3 cols 567.5/252.2/252.2 (2.25fr/1fr/1fr)
 * gap 40px, -> 2 equal cols at <992, -> 1 col at <768.
 */
const LAYERS = [
  {
    title: 'Auxia Agent Studio',
    body: 'AI marketing agents that research, plan, build, QA, and ship, orchestrating work across the tools you already run, from Braze to Salesforce Marketing Cloud.',
  },
  {
    title: 'Auxia Decisioning',
    body: 'Real-time 1:1 decisioning ranks the next-best experience for every visitor on every signal, so every touchpoint is personalized at scale.',
  },
  {
    title: 'Data & Context',
    body: 'Enterprise data unified across CRM, CDP, and warehouse into a living context graph that knows your business and is updated every run.',
  },
]

const AGENT = {
  title: 'Auxia Agent Studio',
  body: 'The workspace where marketing teams work with agents to plan, build, and ship campaigns.',
  pricing: 'Usage-based pricing',
  capabilities: [
    'Built-in connections',
    'Playbooks & workflows',
    'Rituals for recurring agent execution',
    'Automate approval loops',
    'Governance & guardrails',
  ],
  included: [
    'Onboarding & integrations',
    'Advanced access management',
    'Enterprise grade security & reliability',
    'Dedicated expert support (AI PMs, FDEs)',
  ],
}

const DECISIONING = {
  title: 'Auxia Decisioning',
  body: 'The engine that knows exactly what each customer needs next and delivers it in real time, every time.',
  pricing: 'DECISION-based pricing BASED ON YOUR VOLUME',
  capabilities: [
    'ML feature store',
    'Model library',
    'Real-time personalization',
    'Multi-model experimentation',
    'Flexible goals & weights',
    'Embedded global holdout group',
    'Governance & guardrails',
  ],
  included: [
    'Onboarding & integrations',
    'Advanced access management',
    'Enterprise grade security & reliability',
    'Dedicated expert support (AI PMs, FDEs)',
    'Unlimited user seats',
    'Custom SLAs',
  ],
}

/* .layout48_agent-list-item — grid 16px / 1fr, gap 8px, 8px row gap on the ul */
function CheckList({ items }) {
  return (
    <ul className="layout48_agent-list flex flex-col gap-2">
      {items.map((t) => (
        <li key={t} className="layout48_agent-list-item grid grid-cols-[16px_1fr] gap-2">
          <img src="/assets/icons/checkmark.svg" alt="" className="mt-1 h-4 w-4 brightness-0 invert" />
          <span className="text-base leading-[1.3]">{t}</span>
        </li>
      ))}
    </ul>
  )
}

/* Panels 2 and 3 share .layout48_agent-grid exactly; only ground colour differs. */
function PricingPanel({ data, className }) {
  return (
    <div className={`rounded-3xl p-10 max-[767px]:px-4 ${className}`}>
      <div className="layout48_agent-grid grid gap-10 md:grid-cols-2 min-[992px]:grid-cols-[2.25fr_1fr_1fr]">
        <div className="layout48_title flex flex-col items-start gap-6">
          <h2>{data.title}</h2>
          <p className="text-base leading-[1.3]">{data.body}</p>
          <p className="stack_title eyebrow">{data.pricing}</p>
          <a href="/demo" className="btn btn-white">Request a Demo</a>
        </div>
        <div>
          <p className="stack_title eyebrow mb-4">Capabilities</p>
          <CheckList items={data.capabilities} />
        </div>
        <div>
          <p className="stack_title eyebrow mb-4">Included</p>
          <CheckList items={data.included} />
        </div>
      </div>
    </div>
  )
}

export default function Stack() {
  return (
    <section id="stack" className="section_stack">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-large">
            <div className="layout48_wrapper flex flex-col gap-4">

              {/* Panel 1 — cream */}
              <div className="layout48_component flex flex-col gap-8 rounded-3xl bg-cream
                              px-4 py-10 min-[768px]:gap-12 min-[768px]:p-10 min-[992px]:px-10 min-[992px]:py-12">
                <div className="layout48_header grid gap-5 min-[768px]:gap-x-12 min-[768px]:gap-y-8
                                min-[992px]:grid-cols-[1.35fr_1fr] min-[992px]:gap-x-20 min-[992px]:gap-y-16">
                  <div className="layout48_content-left reveal">
                    <h2>The marketing stack, modernized</h2>
                  </div>
                  <div className="layout48_content-right reveal" data-reveal-delay="80">
                    <p className="text-lg leading-[1.3]">
                      Auxia Agent Studio and Auxia Decisioning replace manual workflows, connect
                      disparate teams, and replace execution with strategy, all while delivering
                      personalized customer experiences.
                    </p>
                  </div>
                </div>

                <div className="layout48_content grid gap-5 min-[768px]:gap-x-12 min-[768px]:gap-y-8
                                min-[992px]:grid-cols-[1.35fr_1fr] min-[992px]:gap-x-20 min-[992px]:gap-y-16">
                  <div className="layout48_content-left is-img reveal">
                    <picture>
                      <source
                        type="image/avif"
                        srcSet="/assets/img/stack-v3-black.avif 1200w, /assets/img/stack-v3-black-1600.avif 1600w"
                        sizes="(min-width: 992px) 614px, 100vw"
                      />
                      <img src="/assets/img/stack-v3-black.avif" alt="Auxia platform architecture"
                           className="layout48_img w-full" loading="lazy" />
                    </picture>
                  </div>
                  <div className="layout48_content-right">
                    {/* .layout32_item-list: 8px block padding, col-gap 24 / row-gap 32 */}
                    <div className="layout32_item-list grid gap-x-6 gap-y-8 py-2">
                      <p className="stack_title eyebrow">
                        One platform, three layers&mdash; built for the agentic marketer
                      </p>
                      {LAYERS.map((l) => (
                        <div key={l.title} className="layout32_item flex flex-row gap-2.5">
                          <div>
                            {/* A real <h3> as on the original — it uses
                                .layout32_title, whose values are constant at
                                every width (24px / 28.8px / ls normal / 500).
                                Tracking and line-height are pinned explicitly
                                so the base h3 rule (-.03em, lh .95) can't
                                leak in; the original's bare h3 is untracked. */}
                            <h3 className="layout32_title text-2xl font-medium leading-[1.2] tracking-normal">{l.title}</h3>
                            <p className="mt-2 text-base leading-[1.3] text-ink/70">{l.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel 2 — ink */}
              <PricingPanel data={AGENT} className="layout48_agent bg-ink text-paper" />

              {/* Panel 3 — blue */}
              <PricingPanel data={DECISIONING} className="layout48_decisioning bg-blue text-paper" />

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
