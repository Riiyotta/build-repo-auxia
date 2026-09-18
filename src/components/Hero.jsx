/**
 * Hero — structure ported 1:1 from the reference site's DOM.
 *
 * Composition (measured at 1440x900 on the original):
 *   .hero_content   position:relative; padding 160px 0 56px
 *   .hero_visual    position:ABSOLUTE; top:80px; left/right 0; height 347px
 *                   font-size clamp(8px, 1vw, 1rem)  -> 14.4px @1440
 *                   It is the em-scaling root; every child below is in `em`.
 *   .hero_main      padding-top:320px  <- reserves the visual's band, which is
 *                   why the visual reads ABOVE the h1 in a single flow column.
 *                   NOT a 2-column grid.
 *
 * Inside .hero_visual (all one row, measured lefts at 1440):
 *   .hero_lines-wrap   x104  w1232 h71   margin 14.4px 0 -80.64px
 *   .hero_step1-wrapper x104 (absolute, right:1016px)
 *   .hero_right        x516.7 flex row gap 14.4px margin-top 64.8px
 *     .hero_step2  x516.7 w265 h226   .hero_step3 x796 w266 h278
 *     .hero_step4  x1076.8 w259 h51
 *
 * Below 992px the desktop visual is display:none and `.hero_mobile` (a
 * horizontal tag rail + a horizontally-scrolling card row) takes over.
 */

const WORKFLOW = [
  'Analyze existing campaigns',
  'Build campaign brief',
  'Define goals, guardrails',
  'Pull content from CMS',
  'Route for approval',
  'Send via Auxia Decisioning',
]

/* Each audience is THREE DISCRETE FIELDS. The original separates them with
   <br> (desktop row 1 uses U+2028 line separators) — they are never one
   concatenated string. Rendering them as separate elements keeps them legible
   before motion runs and with JS off. */
const AUDIENCES = [
  ['Adventure Seeker', '2+ Friends Referred', 'Sorted by Lowest Price'],
  ['Luxury Traveler',  '3+ Bookings in 12M',  'Logged into Loyalty'],
  ['Family Planner',   'App Installed',       'Reviewed Past Stay'],
]

const VARIANTS = [
  { img: '/assets/img/star-gaze.jpg' },
  { img: '/assets/img/canyon.jpg' },
  { img: '/assets/img/journey-builder.jpg' },
]

const LIGHTNING_D =
  'M5.86228 0.822223C6.21043 0.317344 7.00192 0.563411 7.00193 1.17672V3.99898H9.90036C10.4039 ' +
  '3.99898 10.7007 4.56388 10.415 4.97847L6.1406 11.1757C5.7924 11.6804 5.00212 11.4343 5.00193 ' +
  '10.8212V7.99898H2.10251C1.59908 7.99891 1.3024 7.43403 1.58786 7.01949L5.86228 0.822223Z'

const PERSON_D =
  'M7.80078 6.17773C9.10527 6.83667 10 8.18868 10 9.75V10.5H2V9.75C2 8.18875 2.89481 6.83668 ' +
  '4.19922 6.17773C4.70832 6.53748 5.32925 6.75 6 6.75C6.67065 6.75 7.29173 6.53733 7.80078 ' +
  '6.17773ZM6 1.25C7.3117 1.25 8.375 2.31333 8.375 3.625C8.375 4.93668 7.3117 6 6 6C4.68832 6 ' +
  '3.625 4.93668 3.625 3.625C3.625 2.31333 4.68832 1.25 6 1.25Z'

const CHECK_D =
  'M8.5679 2.40943C8.8941 1.96408 9.51978 1.86762 9.96537 2.19361C10.4107 2.51981 10.5072 3.1455 ' +
  '10.1812 3.59107L5.79154 9.59107C5.63093 9.81019 5.38793 9.95511 5.11869 9.99147C4.84916 ' +
  '10.0277 4.5758 9.95258 4.36283 9.78346L2.00247 7.90846C1.57015 7.56503 1.49815 6.93562 ' +
  '1.84134 6.50318C2.18485 6.07076 2.81417 5.99858 3.24662 6.34205L4.79154 7.56959L8.5679 2.40943Z'

/* The connector rail path, verbatim from the original SVG (viewBox 0 0 1231 71) */
const LINE_D =
  'M0 1H248.5C261.755 1 272.5 11.7452 272.5 25V45.416C272.5 58.6708 283.245 69.416 296.5 69.416H1230.5'

function Tag({ children }) {
  return (
    <div className="hero_tag flex flex-none items-center rounded-full border-2 px-[.75em] py-[.4em]">
      <svg viewBox="0 0 12 12" fill="none" className="hero_lightning block w-[.8333em] flex-none">
        <path fillRule="evenodd" clipRule="evenodd" d={LIGHTNING_D} fill="currentColor" />
      </svg>
      <div className="hero_tag-text-wrap overflow-hidden">
        <div className="hero_tag-text whitespace-nowrap pl-[.375em] pt-px font-mono text-[.75em] uppercase leading-[1.2] text-ink">
          {children}
        </div>
      </div>
    </div>
  )
}

function Person() {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="hero_step1-person block w-[.75em] flex-none">
      <path d={PERSON_D} fill="currentColor" />
    </svg>
  )
}

function VariantCard({ img }) {
  return (
    <div data-step-last="" className="hero_steps-wrap flex w-full items-center justify-center rounded-[.75em]">
      <div className="hero_step3-content relative flex w-full flex-col items-start justify-between gap-[.8333em] overflow-hidden rounded-[.75em] p-[1.25em] text-paper"
           style={{ aspectRatio: '2.9 / 3.7' }}>
        <div className="hero_step3-info flex h-full w-full flex-col items-start justify-end gap-[.75em]">
          <div className="hero_steps-h text-[1.5em] leading-[1.05] tracking-[-.02em]">Discover the Swiss Alps</div>
          <div className="hero_steps-p text-[.8125em] leading-[1.3] opacity-70">
            Breathtaking peaks, cozy chalets, and world-class hiking await.
          </div>
          <div className="hero_steps-btn rounded-[.5rem] bg-white/10 px-[1em] py-[.5em] text-[1em] tracking-[-.02em]">
            Book now
          </div>
        </div>
        <img src={img} alt="" className="hero_step3-img absolute inset-0 -z-20 h-full w-full max-w-full object-cover" />
        <div className="hero_step3-overlay absolute inset-0 -z-10"
             style={{ backgroundImage: 'linear-gradient(#19191930 26%, #191919)' }} />
      </div>
    </div>
  )
}

function PromptBox() {
  return (
    <div className="hero_step1-box flex w-full flex-col gap-[.8333em] rounded-[.8333em] border border-ink/10 bg-[#fefdf5] px-[1.1111em] py-[.8333em]">
      <p className="hero_step1-text text-[1.1111em] leading-[1.3]">
        Diagnose the leaks in our repeat purchase funnel and initiate new campaigns to close them
      </p>
      <div className="hero_step1-arrow ml-auto w-[1.6667em]">
        <svg viewBox="0 0 28 28" fill="none" className="block h-full w-full">
          <rect width="28" height="28" rx="6" fill="#0B4FFF" />
          <path d="M9.83594 12.6667L14.0026 8.5L18.1693 12.6667M14.0026 9V19.5" stroke="white"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

function WorkflowList() {
  return (
    <div className="hero_step2-list flex w-[18.75em] flex-col items-start justify-between gap-[.5556em]">
      {WORKFLOW.map((step) => (
        <div key={step}
             className="hero_step2-list-item flex w-full items-center justify-between gap-[.2778em] whitespace-nowrap rounded-full border-2 border-blue-light py-[.1389em] pl-[.2778em] pr-[.5556em]">
          <div className="hero_step2-list-icon is-done hidden w-[.8333em] flex-none text-blue" aria-hidden="true">
            <svg viewBox="0 0 12 12" fill="none" className="block h-full w-full">
              <path d={CHECK_D} fill="currentColor" />
            </svg>
          </div>
          <img src="/assets/img/spinner.png" alt=""
               className="hero_step2-list-icon flex w-[.8333em] flex-none" />
          <p className="hero_step2-text flex-1 truncate font-mono text-[.7778em] uppercase leading-[1.3] tracking-[.014em] opacity-70">
            {step}
          </p>
        </div>
      ))}
    </div>
  )
}

function AudienceList() {
  return (
    <div className="hero_step3-list flex w-[15.5556em] max-w-[15.5556em] flex-col overflow-hidden">
      {AUDIENCES.map((fields, i) => (
        <div key={fields[0]}
             className={`${i === 0 ? 'hero_step1-small' : 'hero_step1'} flex w-full items-start justify-start gap-[1em] pb-[1.5em] pt-[.5em] font-mono uppercase text-oat`}>
          <Person />
          {/* Three discrete fields, each its own element — never concatenated. */}
          <div className="hero_step3-text text-[.8333em] leading-[1.3] text-oat">
            {fields.map((f) => <div key={f}>{f}</div>)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Hero() {
  return (
    <section
      /* The original floats banner+nav OVER the hero (its body children are
         position:fixed under ScrollSmoother), so .section_hero starts at y=0
         and .hero_content's padding-top clears the chrome. This clone keeps the
         chrome in normal flow, so the hero is pulled back up by the chrome's
         height: 40 banner + 72 nav = 112px, and 40 + 64 = 104px below 992px. */
      className="section_hero relative -mt-[104px] overflow-hidden pt-14 min-[992px]:-mt-[112px] md:pt-[4.5rem]">
      <div className="padding-global">
        <div className="container-large">
          <div className="hero_content relative flex flex-col pb-14 pt-16 min-[992px]:block min-[992px]:pt-40">

            {/* ================= DESKTOP VISUAL (>=992px) =================
                Absolutely positioned at top:80px so it occupies the band that
                .hero_main's 320px padding-top reserves. This is what puts the
                visual ABOVE the h1 in one horizontal flow row. */}
            <div data-eng="" aria-hidden="true"
                 className="hero_visual absolute inset-x-0 top-20 hidden h-[347px] flex-col items-start justify-between min-[992px]:flex"
                 style={{ fontSize: 'clamp(8px, 1vw, 1rem)' }}>

              {/* ---- connector rail: x104 w1232 h71 ---- */}
              <div className="hero_lines-wrap relative z-0 flex w-full items-start justify-start"
                   style={{ height: '71px', margin: '1em 0 -5.6em' }}>
                <div className="hero_lines-left absolute -left-full bottom-[69px] h-[2px] w-full overflow-hidden bg-oat-dark">
                  <div hero-l1="" className="hero_lines-progress h-[2px] w-full bg-blue" />
                </div>
                <svg viewBox="0 0 1231 71" fill="none" width="100%"
                     className="hero_lines -z-10 block w-full overflow-hidden" style={{ height: '71px' }}>
                  <path d={LINE_D} stroke="#E2E1D3" strokeWidth="2" />
                  <path id="hero-lw" d={LINE_D} stroke="#E2E1D3" strokeWidth="2" />
                  <path id="hero-lb" d={LINE_D} stroke="#0B4FFF" strokeWidth="2" />
                </svg>
                <div className="hero_lines-cover absolute bg-paper"
                     style={{ top: '56.64px', left: '86%', width: '12em', height: '2em' }} />
                <div className="hero_lines-right absolute h-[2px] w-full bg-oat-dark"
                     style={{ top: '68.55px', left: '86%' }}>
                  <div hero-l2="" className="hero_lines-progress h-[2px] w-full bg-blue" />
                </div>
              </div>

              {/* ---- step 1: absolute at left 0 ---- */}
              <div className="hero_step1-wrapper absolute left-0 top-0 flex w-[15em] flex-col items-start gap-[1.6667em]">
                <Tag>ask Agent</Tag>
                <PromptBox />
              </div>

              {/* ---- steps 2/3/4 in ONE ROW ---- */}
              <div className="hero_right relative z-[2] flex items-start justify-start gap-[1em]"
                   style={{ marginTop: '4.5em', marginLeft: '28.6597em' }}>
                <div className="hero_step2 flex w-[18.4028em] flex-col items-start gap-[1.5em]">
                  <Tag>Agent workflow</Tag>
                  <WorkflowList />
                </div>
                <div className="hero_step3 flex w-[18.5em] flex-col items-start gap-[1.5em]">
                  <Tag>AI Decisioning</Tag>
                  <AudienceList />
                </div>
                <div className="hero_step4 flex w-[18em] flex-col items-start gap-[1.5em]">
                  <Tag>personalized variant</Tag>
                  <div step2-wrap="" className="hero_steps-content relative flex w-full flex-col gap-[1em]">
                    {VARIANTS.map((v) => <VariantCard key={v.img} img={v.img} />)}
                  </div>
                </div>
              </div>
            </div>

            {/* ================= MOBILE VISUAL (<992px) =================
                Measured on the original at 390: .hero_mobile h421.4, gap 32px,
                .hero_m-wrap h29.4 (tag rail, 16px connector segments),
                .hero_m-cards h360 driven by the tallest (variant) card.
                Cards run at font-size 16px — NOT the desktop em root — with
                inner widths 240 / 244 / 224 / 282 and wrap padding 0 8px
                (0 16px at 767). The row scrolls horizontally, full-bleed. */}
            <div data-eng="" aria-hidden="true"
                 className="hero_mobile relative -mx-5 flex flex-col gap-8 min-[992px]:hidden">
              <div className="hero_m-wrap flex items-center px-4" style={{ fontSize: '16px' }}>
                {['ask Agent', 'Agent workflow', 'AI Decisioning', 'personalized variant'].map((t, i) => (
                  <div key={t} className="flex flex-none items-center">
                    {i > 0 && (
                      <div className="hero_m-line-wrap is-2 h-[2px] w-4 flex-none bg-oat-dark">
                        <div className="hero_m-line h-full w-0 bg-blue" />
                      </div>
                    )}
                    <Tag>{t}</Tag>
                  </div>
                ))}
                <div className="hero_m-line-wrap is-3 h-[2px] flex-1 bg-oat-dark">
                  <div className="hero_m-line h-full w-0 bg-blue" />
                </div>
              </div>
              <div className="hero_m-cards flex items-start overflow-x-auto"
                   style={{ fontSize: '16px', scrollbarWidth: 'none' }}>
                <div className="hero_m-card-wrap flex-none px-2 md:px-4">
                  <div className="w-[240px]"><PromptBox /></div>
                </div>
                <div className="hero_m-card-wrap flex-none px-2 md:px-4">
                  <div className="w-[244px]"><WorkflowList /></div>
                </div>
                <div className="hero_m-card-wrap flex-none px-2 md:px-4">
                  <div className="w-[224px]"><AudienceList /></div>
                </div>
                <div className="hero_m-card-wrap flex-none px-2 md:px-4">
                  <div step2-wrap="" className="hero_steps-content relative flex w-[282px] flex-col gap-[1em] min-[480px]:w-[390px]">
                    {VARIANTS.map((v) => <VariantCard key={v.img} img={v.img} />)}
                  </div>
                </div>
              </div>
            </div>

            {/* ================= COPY =================
                padding-top 320px @>=992 reserves the absolute visual's band;
                60px @<992 (measured 767) and 30px @390. */}
            <div className="hero_main flex max-w-[480px] flex-col gap-4 pt-[30px] min-[480px]:pt-[60px] min-[992px]:max-w-[40.5rem] min-[992px]:gap-10 min-[992px]:pt-[320px]">
              <h1 className="heading-style-h1">The marketer, multiplied</h1>
              <p className="hero_p max-w-[31.5625rem] text-lg leading-[1.3] text-ink min-[992px]:text-xl">
                Auxia agents work with your teams across your existing marketing stack, while its
                decisioning engine personalizes each customer experience in real time.
              </p>
              <div className="button-group flex flex-col items-start gap-4 md:flex-row md:flex-wrap md:items-center">
                <a href="#cta" className="btn-primary">Request a Demo</a>
                <a href="#stack" className="btn-secondary">See how it works</a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
