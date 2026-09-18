/* Process — rebuilt to match the live original's flowchart composition.
   Structure (measured on the reference site at 1440x900, .section_process = 5362px):
     .process_top                       heading + lede
     .process_wrapper  contains 6 .process_wrap blocks:
       wrap 0: .process_step1 (prompt card + 2px rail + "Activating agents" pill)
               + connector (left-start variant) + tag
       wrap 1-5: .process_steps (step-wrap column + image) + connector + tag
       wrap 5 also carries the half-height .is-last connector and .process_last CTA.
   Every connector is an inline 940x369 SVG in a 147px-inset flex row with a
   -6px bottom margin so consecutive paths butt together.                       */

/* --- 940x369 connector paths. The original ships two mirrored variants: ---
   "rtl": starts top-right, ends bottom-left.  "ltr": starts top-left, ends bottom-right. */
const PATH_RTL =
  'M939 0V156.326C939 169.581 928.255 180.326 915 180.326H25C11.7452 180.326 1 191.071 1 204.326V369'
const PATH_LTR =
  'M1.00001 0V156.326C1.00001 169.581 11.7452 180.326 25 180.326H915C928.255 180.326 939 191.071 939 204.326V369'

/* Mobile connectors (<=991px): 296x320 zig-zag, and a 149x320 half variant. */
const PATH_MBL =
  'M148 0V56C148 69.2548 137.255 80 124 80H25C11.7452 80 1 90.7452 1 104V136C1 149.255 11.7452 160 25 160H271C284.255 160 295 170.745 295 184V216C295 229.255 284.255 240 271 240H172C158.745 240 148 250.745 148 264V320'
const PATH_MBL_HALF =
  'M1 0V136C1 149.255 11.7452 160 25 160H124C137.255 160 148 170.745 148 184V320'

/* .process_tag — absolute, white pill over the connector, translate(0,-40%) */
function Tag({ children }) {
  return (
    <div className="process_tag absolute -translate-y-[40%] bg-white px-2 py-1 font-mono text-xs uppercase leading-[1.3] min-[992px]:-translate-y-[40%] min-[480px]:px-4">
      <div className="process_tag-text">{children}</div>
    </div>
  )
}

/* .process_icon — the 4-path "sparkle list" glyph used on every stage pill */
function StepIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 18 18" fill="none"
         className="process_icon -mt-[2px] w-[1.125rem] shrink-0">
      <path d="M2.8125 3.75C2.50184 3.75 2.25 4.00184 2.25 4.3125C2.25 4.62316 2.50184 4.875 2.8125 4.875H15.1875C15.4981 4.875 15.75 4.62316 15.75 4.3125C15.75 4.00184 15.4981 3.75 15.1875 3.75H2.8125Z" fill="currentColor" />
      <path d="M13.2531 7.62345C13.1578 7.43288 12.9631 7.3125 12.75 7.3125C12.5369 7.3125 12.3422 7.43288 12.2469 7.62345L11.2057 9.70575L9.12345 10.7469C8.93288 10.8421 8.8125 11.0369 8.8125 11.25C8.8125 11.4631 8.93288 11.6579 9.12345 11.7531L11.2057 12.7943L12.2469 14.8765C12.3422 15.0671 12.5369 15.1875 12.75 15.1875C12.9631 15.1875 13.1578 15.0671 13.2531 14.8765L14.2943 12.7943L16.3765 11.7531C16.5671 11.6579 16.6875 11.4631 16.6875 11.25C16.6875 11.0369 16.5671 10.8421 16.3765 10.7469L14.2943 9.70575L13.2531 7.62345Z" fill="currentColor" />
      <path d="M2.8125 8.4375C2.50184 8.4375 2.25 8.68935 2.25 9C2.25 9.31065 2.50184 9.5625 2.8125 9.5625H6.9375C7.24816 9.5625 7.5 9.31065 7.5 9C7.5 8.68935 7.24816 8.4375 6.9375 8.4375H2.8125Z" fill="currentColor" />
      <path d="M2.8125 13.125C2.50184 13.125 2.25 13.3769 2.25 13.6875C2.25 13.9981 2.50184 14.25 2.8125 14.25H5.4375C5.74816 14.25 6 13.9981 6 13.6875C6 13.3769 5.74816 13.125 5.4375 13.125H2.8125Z" fill="currentColor" />
    </svg>
  )
}

/* .process_icon on .process_step1 — the 7-path "gear/star" glyph */
function StartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 18 18" fill="none"
         className="process_icon -mt-[2px] w-[1.125rem] shrink-0">
      <path d="M10.3201 14.7432C10.5913 14.592 10.934 14.6889 11.0854 14.9601C11.2367 15.2313 11.1391 15.5741 10.8679 15.7254L10.0051 16.2074C9.38053 16.5558 8.61988 16.5558 7.99536 16.2074L7.13254 15.7254C6.8613 15.5741 6.7637 15.2313 6.91501 14.9601C7.06639 14.6889 7.40917 14.592 7.68036 14.7432L8.54316 15.2244C8.82711 15.3829 9.17331 15.3829 9.45726 15.2244L10.3201 14.7432Z" fill="currentColor" />
      <path d="M2.625 10.1719C2.9356 10.1719 3.18739 10.4238 3.1875 10.7344V11.6858C3.18762 12.0247 3.3709 12.3373 3.6665 12.5032L4.49414 12.9676C4.76495 13.1196 4.86146 13.4628 4.70948 13.7336C4.55741 14.0044 4.21421 14.1009 3.94336 13.9489L3.11573 13.4846C2.4653 13.1197 2.06262 12.4316 2.0625 11.6858V10.7344C2.0626 10.4238 2.3144 10.1719 2.625 10.1719Z" fill="currentColor" />
      <path d="M15.3752 10.1719C15.6858 10.1719 15.9376 10.4238 15.9377 10.7344V11.6858C15.9376 12.4316 15.5349 13.1197 14.8845 13.4846L14.0569 13.9489C13.786 14.1009 13.4428 14.0044 13.2907 13.7336C13.1388 13.4628 13.2352 13.1196 13.5061 12.9676L14.3337 12.5032C14.6293 12.3373 14.8126 12.0247 14.8127 11.6858V10.7344C14.8128 10.4238 15.0646 10.1719 15.3752 10.1719Z" fill="currentColor" />
      <path d="M9 5.625C9.20333 5.625 9.3855 5.75016 9.45848 5.93994L9.94193 7.19604C10.0943 7.59212 10.4071 7.9057 10.8032 8.0581L12.0601 8.54147C12.2497 8.61452 12.375 8.7967 12.375 9.00002C12.3749 9.20327 12.2497 9.38552 12.0601 9.4585L10.8032 9.94187C10.4072 10.0943 10.0943 10.4072 9.94193 10.8032L9.45848 12.06C9.38543 12.2497 9.20325 12.375 9 12.375C8.79675 12.375 8.61457 12.2497 8.54152 12.06L8.05807 10.8032C7.90575 10.4072 7.59278 10.0943 7.19678 9.94187L5.93994 9.4585C5.75024 9.38552 5.62506 9.20327 5.625 9.00002C5.625 8.7967 5.75025 8.61452 5.93994 8.54147L7.19678 8.0581C7.59285 7.9057 7.90575 7.59212 8.05807 7.19604L8.54152 5.93994C8.6145 5.75016 8.79667 5.625 9 5.625Z" fill="currentColor" />
      <path d="M3.94336 4.05248C4.21425 3.90049 4.55744 3.99697 4.70948 4.26781C4.86137 4.53869 4.76496 4.88191 4.49414 5.03392L3.6665 5.49828C3.3709 5.66416 3.18757 5.9767 3.1875 6.31567V7.26708C3.18731 7.57756 2.93554 7.82956 2.625 7.82956C2.31446 7.82956 2.06269 7.57756 2.0625 7.26708V6.31567C2.06257 5.56984 2.46529 4.88181 3.11573 4.51684L3.94336 4.05248Z" fill="currentColor" />
      <path d="M13.2907 4.26781C13.4427 3.99696 13.7859 3.90049 14.0568 4.05248L14.8845 4.51683C15.5349 4.88181 15.9376 5.56983 15.9377 6.31566V7.26708C15.9375 7.57756 15.6858 7.82956 15.3752 7.82956C15.0646 7.82956 14.8128 7.57756 14.8127 7.26708V6.31566C14.8126 5.9767 14.6293 5.66416 14.3337 5.49828L13.506 5.03392C13.2352 4.88191 13.1388 4.5387 13.2907 4.26781Z" fill="currentColor" />
      <path d="M7.99539 1.79258C8.61992 1.44414 9.38057 1.44414 10.0051 1.79258L10.8679 2.27451C11.1392 2.42592 11.2368 2.76863 11.0855 3.03989C10.934 3.31094 10.5912 3.40787 10.3201 3.25669L9.45729 2.77549C9.17334 2.61701 8.82714 2.61701 8.54319 2.77549L7.68039 3.25669C7.40919 3.40787 7.06642 3.31094 6.91504 3.03989C6.76373 2.76863 6.86133 2.42592 7.13257 2.27451L7.99539 1.79258Z" fill="currentColor" />
    </svg>
  )
}

/* .process_cta — 294px min-width pill, 2px oat-dark border, 100vw radius */
function StepPill({ children, start = false }) {
  return (
    <div className="process_cta flex w-full min-w-[18.375rem] max-w-full items-center justify-center gap-2 rounded-[100vw] border-2 border-oat-dark bg-white p-4 text-center text-base font-medium leading-[1.4] text-oat-darkest">
      {start ? <StartIcon /> : <StepIcon />}
      <div>{children}</div>
    </div>
  )
}

/* Vertical rail that runs behind a step column on desktop, hidden <=991px.
   .process_progress-vertical: inset 0, 2px wide, z-index -1. `alt` pins it right. */
function VerticalRail({ alt = false }) {
  return (
    <div className={`process_progress-vertical absolute inset-y-0 -z-10 hidden w-[2px] bg-oat-dark min-[992px]:block ${alt ? 'right-1/2' : 'left-1/2'}`}>
      <div className="process_progress2 h-0 w-full bg-blue" />
    </div>
  )
}

/* .process_line-mbl — mobile-only vertical connector stub (3px wide, 10rem / 5rem) */
function MobileStub({ small = false }) {
  return (
    <div className={`process_line-mbl relative block w-[3px] min-[992px]:hidden ${small ? 'h-[5rem]' : 'h-[10rem]'}`}>
      <div className="process_progress-vertical absolute inset-0 w-full bg-oat-dark">
        <div className="process_progress2 h-0 w-full bg-blue" />
      </div>
    </div>
  )
}

/* .process_image-wrapper — 24px radius, clipped, the original's 4-layer shadow */
/* Rest state for the animated blue draw-paths: collapsed, exactly as the
   original ships them (stroke-dasharray: 0px, 999999px). The motion layer
   tweens strokeDasharray open on scroll. */
const DRAW_REST = { strokeDasharray: '0px, 999999px', strokeDashoffset: '0.001' }

const IMG_SHADOW =
  '0 406px 162px rgba(0,0,0,.01), 0 228px 137px rgba(0,0,0,.05), 0 20px 40px rgba(0,0,0,.09), 0 25px 56px rgba(0,0,0,.1)'

function StageImage({ ratio, src, avif, alt, className = '' }) {
  return (
    <div
      className={`process_image-wrapper relative z-[2] w-full overflow-clip rounded-3xl bg-white min-[992px]:bg-transparent ${className}`}
      style={{ aspectRatio: ratio, boxShadow: IMG_SHADOW }}
    >
      <picture>
        {avif && <source srcSet={avif} type="image/avif" />}
        <img src={src} alt={alt} loading="lazy"
             className="process_img absolute inset-0 h-full w-full max-w-full object-fill" />
      </picture>
    </div>
  )
}

/* The five stages, in original order. `side` = which side the text column sits
   on at >=992px; `tag` is the uppercase mono label on the connector BELOW it. */
const STAGES = [
  {
    title: 'Spot weak campaigns',
    body: 'Agents continuously audit your repeat-purchase programs, separating what’s working from what isn’t and surfacing exactly where revenue is leaking before you have to ask.',
    side: 'left',
    images: [{ ratio: '1632 / 1620', src: '/assets/img/spot-weak-campaigns.jpg', avif: '/assets/img/spot-weak-campaigns.avif' }],
    tag: 'identifying next steps',
    connector: { dir: 'ltr', variant: 'alt' },
  },
  {
    title: 'Build workflows & playbooks',
    body: 'Use natural language to build configurable, reusable playbooks — triggers, steps, approvers, and guardrails — that agents run for you across every program.',
    side: 'right',
    images: [{ ratio: '1632 / 840', src: '/assets/img/playbook-refresh.jpg' }],
    tag: 'reviewing Workflows & Playbooks',
    connector: { dir: 'rtl', variant: 'right' },
  },
  {
    title: 'Automate recurring work',
    body: 'Hand execution to the agents. They draft the experiment design, stand up the campaign in your stack, and adjust live programs — doing the work a marketer would, end to end.',
    side: 'left',
    images: [
      { ratio: '800 / 924', src: '/assets/img/journey-builder.jpg' },
      { ratio: '800 / 924', src: '/assets/img/spot-weak-campaigns.jpg' },
    ],
    tag: 'identifying needed approvals',
    connector: { dir: 'ltr', variant: 'alt' },
  },
  {
    title: 'Automate manual approvals',
    body: 'Agents route each decision to the right people — in Slack, where your team already works. Approve, reject, or comment, and the agent picks it right back up. Marketing is multi-player.',
    side: 'right',
    images: [{ ratio: '1632 / 946', src: '/assets/img/slack-ui.jpg' }],
    tag: 'Personalizing 1:1 Experiences',
    connector: { dir: 'rtl', variant: 'right' },
  },
  {
    title: 'Deliver 1:1 personalization at scale',
    body: 'Auxia Decisioning makes the per-customer call in real time, ranking content, offer, channel, and timing for each individual. One brief generates a unique experience for everyone.',
    side: 'left',
    images: [{ ratio: '1632 / 744', src: '/assets/img/radius-shadow.avif', avif: '/assets/img/radius-shadow.avif' }],
    tag: null,
    connector: null,
  },
]

export default function Process() {
  return (
    <section id="agent-studio" className="section_process">
      <div className="padding-global">
        <div className="container-large">
          {/* .process_content — measured on the original across 12 widths:
              pb 180/80/64/48 at 992/768/480, gap 80/80/48/32 at 768/480.
              The pb steps at 768 (not 992): 768-991 is 80px, not 64px. */}
          <div className="process_content flex flex-col gap-8 pb-12 min-[480px]:gap-12 min-[480px]:pb-16 md:gap-20 md:pb-20 min-[992px]:pb-[11.25rem]">

            <div className="process_top reveal flex max-w-[50rem] flex-col gap-4">
              <div className="process_heading max-w-[36rem]">
                <h2 className="heading-style-h1 text-h1 max-[991px]:text-[4rem] max-[767px]:text-[2.5rem]">
                  Become a 10x Marketer
                </h2>
              </div>
              <p className="process_p text-base leading-[1.3] text-ink opacity-70 min-[992px]:text-2xl">
                AI Agents learn your business, accelerate your workflows, and personalize each
                customer’s ideal touchpoint, with autonomy you define and control.
              </p>
            </div>

            <div className="process_wrapper is-eng">

              {/* ---- wrap 0: the opening prompt ---- */}
              <div className="process_wrap reveal" data-reveal-delay="60">
                <div className="process_step1 flex flex-col items-center justify-between min-[992px]:flex-row">
                  <div className="process_start max-w-[40ch] flex-none rounded-btn bg-white p-5 text-base font-medium leading-[.95] tracking-[-.01em] max-[767px]:px-5 max-[767px]:py-4">
                    Can you provide me a weekly performance write up<br />on our repeat purchase funnel?
                  </div>
                  {/* 2px horizontal rail, desktop only */}
                  <div className="process_progress-horizontal hidden h-[2px] w-full bg-oat-dark min-[992px]:block">
                    <div className="process_progress h-full w-0 bg-blue" />
                  </div>
                  <MobileStub small />
                  <div className="w-[18.375rem] max-w-full">
                    <StepPill start>Activating agents</StepPill>
                  </div>
                </div>
                <div className="process_lines-wrap relative flex items-center justify-center min-[992px]:mb-[-6px] min-[992px]:px-[147px]">
                  <ConnectorBody dir="rtl" tag="analyzing historical behavior" />
                </div>
              </div>

              {/* ---- wraps 1..5: the five stages ---- */}
              {STAGES.map((s, i) => {
                const textCol = (
                  <div className="process_step-wrap relative order-[-9999] flex w-[18.5rem] max-w-full flex-col items-center justify-start min-[992px]:order-none">
                    <StepPill>{s.title}</StepPill>
                    <div className="process_text bg-white px-0 py-4 text-center text-sm leading-[1.3] text-ink/70 min-[992px]:py-6">
                      {s.body}
                    </div>
                    <VerticalRail alt={s.side === 'right'} />
                  </div>
                )
                const imgCol =
                  s.images.length > 1 ? (
                    <div className="process_image-wrap flex w-full flex-row gap-4 max-[991px]:order-[9999]">
                      {s.images.map((im, j) => (
                        <StageImage key={j} {...im} alt={s.title} className="flex-1" />
                      ))}
                    </div>
                  ) : (
                    <StageImage {...s.images[0]} alt={s.title}
                                className="max-[991px]:order-[9999] min-[992px]:flex-1" />
                  )

                return (
                  <div key={s.title} className="process_wrap reveal" data-reveal-delay="60">
                    <div className="process_steps relative flex flex-col items-center justify-start gap-0 min-[992px]:flex-row min-[992px]:items-stretch min-[992px]:gap-[7.75rem]">
                      {s.side === 'left' ? (
                        <>
                          {textCol}
                          <MobileStub />
                          {imgCol}
                        </>
                      ) : (
                        <>
                          {imgCol}
                          <MobileStub />
                          {textCol}
                        </>
                      )}
                    </div>

                    {s.connector && (
                      <div className={`process_lines-wrap relative flex items-center justify-center min-[992px]:mb-[-6px] ${
                        s.connector.variant === 'alt'
                          ? 'min-[992px]:pl-[146px] min-[992px]:pr-[147px]'
                          : 'pr-[146px] min-[992px]:pl-[147px] min-[992px]:pr-[146px]'}`}>
                        <ConnectorBody {...s.connector} tag={s.tag} />
                      </div>
                    )}

                    {/* last stage: half connector + closing CTA */}
                    {i === STAGES.length - 1 && (
                      <>
                        <div className="process_lines-wrap is-last flex items-center justify-center pl-[146px] min-[992px]:mb-[-6px] min-[992px]:justify-start min-[992px]:pl-[146px] min-[992px]:pr-[147px]">
                          <div className="process_lines is-last hidden w-1/2 min-[992px]:block">
                            <svg width="100%" height="100%" viewBox="0 0 940 369" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path className="process-white" d={PATH_LTR} stroke="#E2E1D3" strokeWidth="4" />
                              <path className="process-blue" d={PATH_LTR} stroke="#0B4FFF" strokeWidth="4" style={DRAW_REST} />
                            </svg>
                          </div>
                          <div className="process_lines-mbl block w-1/2 min-[992px]:hidden">
                            <svg width="100%" height="100%" viewBox="0 0 149 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d={PATH_MBL_HALF} stroke="#E2E1D3" strokeWidth="3" />
                              <path className="process-m-blue" d={PATH_MBL_HALF} stroke="#0B4FFF" strokeWidth="3" style={DRAW_REST} />
                            </svg>
                          </div>
                        </div>

                        <div className="process_last reveal mx-auto flex max-w-[41rem] flex-col items-center justify-start gap-8 text-center"
                             data-reveal-delay="120">
                          <h2 className="heading-style-h2 text-h2 max-[991px]:text-[3rem] max-[767px]:text-[2rem]">
                            Become a 10x Marketer
                          </h2>
                          <p className="text-xl leading-[1.3] text-ink opacity-70">
                            Use the power of AI to handle execution as you focus on strategy and scale
                          </p>
                          <a href="#demo" className="btn-primary">Request a Demo</a>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Connector body + its tag, used inside .process_lines-wrap */
function ConnectorBody({ dir, tag }) {
  const d = dir === 'rtl' ? PATH_RTL : PATH_LTR
  return (
    <>
      <div className="process_lines hidden w-full min-[992px]:block">
        <svg width="100%" height="100%" viewBox="0 0 940 369" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className="process-white" d={d} stroke="#E2E1D3" strokeWidth="2" />
          <path className="process-blue" d={d} stroke="#0B4FFF" strokeWidth="2" style={DRAW_REST} />
        </svg>
      </div>
      <div className="process_lines-mbl block w-[70%] min-[992px]:hidden">
        <svg width="100%" height="100%" viewBox="0 0 296 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d={PATH_MBL} stroke="#E2E1D3" strokeWidth="2" />
          <path className="process-m-blue" d={PATH_MBL} stroke="#0B4FFF" strokeWidth="2" style={DRAW_REST} />
        </svg>
      </div>
      {tag && <Tag>{tag}</Tag>}
    </>
  )
}
