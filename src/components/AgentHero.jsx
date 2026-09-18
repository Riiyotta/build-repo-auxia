import { Link } from 'react-router-dom'

/**
 * Agent Studio hero. Measured on .section_agent-hero:
 *   ground rgb(35,35,35) = ink, section padding-top 112px,
 *   .agent-hero_content flex-col gap 80px, padding 64px 0
 *   .agent-hero_top flex-col gap 24px
 *     .stack_title 14px/18.2 paper
 *     .agent-hero_info flex-row gap 16px: heading 800px | right rail 400px
 *       h1 104px/98.8 (-3.12px ls)
 *       right rail flex-col gap 40px: .text-size-medium 20px/26, then the CTA
 *   .agent-hero_marquee: prompt pills, 53px tall, 16px padding, 20px gap,
 *     ink ground on a 1px paper/20 hairline; the track is duplicated and scrolls.
 *   .agent-hero_visual 504px wide, radius 16px, ground rgb(25,25,25).
 */
const PROMPTS = [
  'Share the latest competitor insights',
  'Draft weekly performance report',
  'Analyze and improve your funnel',
  'Launch or revamp a campaign',
  'Manage internal approval workflows',
  'Prep QBR',
  'Find underperforming lifecycle campaigns',
  'Look for brand signal spikes',
]

export default function AgentHero() {
  return (
    <section className="section_agent-hero relative overflow-hidden bg-ink pt-28 text-paper">
      {/* .agent-hero_background — same dot field as /decisioning but tuned for
          the dark ground: 2px dots of rgba(68,68,68,0.5) on a 20px tile. */}
      <div className="agent-hero_background pointer-events-none absolute inset-0"
           aria-hidden="true"
           style={{
             backgroundImage:
               'radial-gradient(circle, rgba(68,68,68,0.5) 2px, rgba(0,0,0,0) 2px)',
             backgroundSize: '20px 20px',
           }} />
      <div className="padding-global relative">
        <div className="container-large">
          <div className="agent-hero_content flex flex-col gap-10 py-16 md:gap-20">
            <div className="agent-hero_top flex flex-col gap-6">
              <div className="stack_title reveal">
                AUXIA AGENT STUDIO
              </div>
              <div className="agent-hero_info flex flex-col gap-4 min-[992px]:flex-row">
                <div className="agent-hero_heading min-[992px]:w-[50rem] min-[992px]:flex-none">
                  <h1 className="reveal" data-reveal-delay="60">
                    The full campaign workflow, run by agents
                  </h1>
                </div>
                <div className="agent-hero_right flex flex-col gap-10 min-[992px]:w-[25rem] min-[992px]:flex-none">
                  <div className="reveal text-xl leading-[1.3]" data-reveal-delay="120">
                    Auxia Agent Studio replaces fragmented tools and agency handoffs with AI
                    agents that run the full campaign workflow, from brief to experiment,
                    content, setup, analysis, and optimization, on your stack and in your
                    brand voice, with you approving every step.
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

            {/* Prompt-pill marquee + agent card */}
            <div className="agent-hero_img-wrap flex flex-col gap-10">
              <div className="marquee-rail marquee-paused">
                <div className="animate-marquee flex w-max items-center gap-5"
                     style={{ '--marquee-duration': '50s' }}>
                  {[...PROMPTS, ...PROMPTS].map((t, i) => (
                    <div key={`${t}-${i}`}
                         className="agent-hero_item flex-none whitespace-nowrap rounded-xl
                                    border border-paper/20 bg-ink p-4 text-base leading-[1.3]">
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              <div className="agent-hero_visual reveal mx-auto w-full max-w-[31.5rem] overflow-hidden rounded-2xl"
                   style={{ backgroundColor: '#191919' }} data-reveal-delay="120">
                <div className="agent-hero_visual-top flex flex-row items-center gap-[0.9rem] p-[1.35rem]">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                    <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.5"
                            className="text-paper/30" />
                    <path d="M12 18l4 4 8-8" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round" className="text-blue" />
                  </svg>
                  <div className="agent-hero_name text-lg leading-[1.2]">Auxia Agent</div>
                </div>
                <div className="agent-hero_bottom p-[1.35rem] pt-0">
                  <div className="agent-hero_prompt-wrap rounded-xl border border-paper/15 p-4
                                  text-[0.9rem] leading-[1.3] text-paper/70">
                    Launch or revamp a campaign
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* .agent-hero_background — faint rule field behind the content */}
      <div className="agent-hero_background pointer-events-none absolute inset-0 opacity-30"
           aria-hidden="true"
           style={{ backgroundImage:
             'repeating-linear-gradient(90deg, rgba(68,68,68,.5) 0 1px, transparent 1px 88px)' }} />
    </section>
  )
}
