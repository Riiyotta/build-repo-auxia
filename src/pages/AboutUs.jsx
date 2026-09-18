/**
 * /about-us — section inventory measured on the live original, in order:
 *   1 .section_about        1149px  ground rgb(25,25,25)
 *   2 .section_about-market  957px  blue
 *   3 .section_values       1630px  paper
 *   4 .section_team          871px  rgb(230,229,216)
 * The original has NO brands strip, case studies, prefooter or CTA here.
 */
const STATS = [
  { value: '200 B', label: 'Automated decisions' },
  { value: '70 M+', label: 'End users served' },
  { value: '100',   label: 'Unique marketing & product touchpoints' },
]

const VALUES = [
  { title: 'Customer Obsession',
    body: "Auxia's success is measured by our customers' success. Every decision we make — in the product, in support, in strategy — starts with the question: does this make our customers more effective?" },
  { title: 'Quality',
    body: 'We hold ourselves to the highest standard in every aspect of our work. When your system processes billions of decisions, there is no room for “good enough.”' },
  { title: 'Ownership',
    body: 'The best companies are built by teams who take initiative and go beyond their job description. We hire people who treat every problem as their problem.' },
  { title: 'Transparency',
    body: "Trust is built on clear, honest communication — with our customers, our partners, and each other. We surface what's working, what isn't, and why." },
  { title: 'Velocity',
    body: 'Rapid execution and sharp decision-making are how we maintain a competitive edge. We move fast, learn faster, and compound what works.' },
]

/* .values_card margin-top, measured per card on the original at >=992px.
   These pull each card up into the previous one's space, which is what gives
   the zig-zag line its weave. Zero below 992px, where the stagger collapses. */
const VALUES_MT = [
  'min-[992px]:mt-[-4.3rem]',   // -68.8px
  'min-[992px]:mt-[-4.3rem]',   // -68.8px
  'min-[992px]:mt-[-2.7rem]',   // -43.2px
  'min-[992px]:mt-[-2.7rem]',   // -43.2px
  'min-[992px]:mt-[-2.5rem]',   // -40px
]

export default function AboutUs() {
  return (
    <main>
      {/* 1 — hero over the dark #191919 ground */}
      <section className="section_about relative overflow-hidden text-paper"
               style={{ backgroundColor: '#191919' }}>
        <div className="about_pattern pointer-events-none absolute inset-0 opacity-40"
             aria-hidden="true"
             style={{ backgroundImage:
               'repeating-linear-gradient(90deg, rgba(240,239,227,.06) 0 1px, transparent 1px 88px)' }} />
        <div className="padding-global relative">
          <div className="container-large">
            <div className="about_content flex flex-col gap-16 pb-24 pt-28 md:gap-24 min-[992px]:pb-48 min-[992px]:pt-40">
              {/* The divider is NOT a flat rule beside the text. Measured on the
                  original: a full-bleed SVG (.about_tag-line, absolute top:160,
                  left/right:0, viewBox "0 0 1440 182" stretched via width/height
                  100%) running BEHIND the tag, which masks it with its own
                  opaque #191919 background. Two stacked 2px paths: a white base
                  drawn full, and a blue rgb(11,79,255) segment 5% of the path
                  length travelling the whole path every 6s, linear, looping.
                  Hidden below 992px on the original. */}
              <div className="about_tag relative flex items-center">
                <div className="about_tag-line pointer-events-none absolute left-0 right-0 top-0 hidden h-[182px] min-[992px]:block"
                     aria-hidden="true">
                  <svg width="100%" height="100%" viewBox="0 0 1440 182"
                       preserveAspectRatio="none" fill="none">
                    <path className="about_tag-base"
                          d="M0 1H1128C1141.25 1 1152 11.7452 1152 25V157C1152 170.255 1162.75 181 1176 181H1440"
                          stroke="rgba(240,239,227,0.2)" strokeWidth="2" fill="none" />
                    <path className="about_tag-travel"
                          d="M0 1H1128C1141.25 1 1152 11.7452 1152 25V157C1152 170.255 1162.75 181 1176 181H1440"
                          stroke="#0b4fff" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <div className="about_tag-text reveal relative px-4 text-[0.8125rem] uppercase leading-[1.3] text-paper/70"
                     style={{ backgroundColor: '#191919' }}>
                  ABOUT AUXIA
                </div>
                <div className="h-px flex-1 bg-paper/20 min-[992px]:hidden" aria-hidden="true" />
              </div>

              <div className="about_heading max-w-[54.75rem]">
                <h1 className="reveal" data-reveal-delay="60">
                  The intelligence behind every customer interaction
                </h1>
              </div>

              {/* .about_stats-line — full-bleed behind the stats. White base
                  scroll-draws (orig ships "0px, 999999px"), blue follows. */}
              <div className="about_stats relative flex flex-col gap-8">
                <div className="about_stats-line pointer-events-none absolute left-0 right-0 top-0 hidden h-[328px] min-[992px]:block"
                     aria-hidden="true">
                  <svg width="100%" height="100%" viewBox="0 0 1440 328"
                       preserveAspectRatio="none" fill="none">
                    <path className="line-draw"
                          d="M0 327H466C479.255 327 490 316.255 490 303V191C490 177.745 500.745 167 514 167H797.498C810.754 167 821.499 156.254 821.498 142.998L821.491 25.0015C821.49 11.7461 832.236 1 845.491 1H1440"
                          stroke="rgba(240,239,227,0.2)" strokeWidth="2" fill="none" />
                    <path className="line-draw-blue"
                          d="M0 327H466C479.255 327 490 316.255 490 303V191C490 177.745 500.745 167 514 167H797.498C810.754 167 821.499 156.254 821.498 142.998L821.491 25.0015C821.49 11.7461 832.236 1 845.491 1H1440"
                          stroke="#0b4fff" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <div className="about_tag-text is-alt reveal text-[0.8125rem] uppercase leading-[1.3] text-paper/70">
                  POWERING JOURNEYS THAT DRIVE RESULTS
                </div>
                <div className="about_stats-wrap grid gap-4 sm:grid-cols-2 min-[992px]:grid-cols-3">
                  {STATS.map((s, i) => (
                    <div key={s.label} className="about_stats-card reveal flex flex-col gap-2"
                         data-reveal-delay={60 + i * 80}>
                      <div className="about_stat text-[6.5rem] leading-[.9] text-blue">{s.value}</div>
                      <div className="about_stats-text text-2xl leading-[1.1]">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — mission, on blue, with the offsite photo bleeding right */}
      <section className="section_about-market relative overflow-hidden bg-blue text-paper">
        <div className="padding-global">
          <div className="container-large">
            <div className="about-market_content flex flex-col gap-10 pb-24 pt-28 min-[992px]:flex-row min-[992px]:gap-4 min-[992px]:pb-48">
              <div className="about-market_left flex flex-col gap-12 min-[992px]:w-[44.6875rem] min-[992px]:flex-none">
                <div className="about-market_heading">
                  <h2 className="reveal">
                    <span className="text-paper/50">Marketing has a bright future.</span>
                    <br />
                    We set out to build it.
                  </h2>
                </div>
                <div className="about-market_text flex flex-col gap-6 text-2xl leading-[1.3] min-[992px]:pr-16">
                  <p className="reveal" data-reveal-delay="60">
                    Every customer should feel like the only customer, and every interaction
                    should be smarter than the last. That's the standard we're building toward.
                  </p>
                  <p className="reveal" data-reveal-delay="120">
                    Built by a team from Google, Meta, and Lyft who saw that real-time,
                    intelligent decisions outperform static campaigns every time, Auxia is the
                    AI-native platform behind every customer touchpoint. It replaces fragmented
                    marketing execution with a single system that learns from every interaction
                    and compounds performance over time.
                  </p>
                  <p className="reveal" data-reveal-delay="180">
                    To date, we've served over 100 billion decisions for Fortune 500 and Global
                    2000 brands including Atlassian, Comcast, The Guardian, and NTT Docomo.
                  </p>
                </div>
              </div>

              <div className="about-market_visual reveal min-[992px]:flex-1" data-reveal-delay="120">
                <img src="/assets/img/about-offsite.jpg" alt="The Auxia team at an offsite"
                     loading="lazy"
                     className="about-market_img w-full rounded-xl object-cover min-[992px]:h-[23.875rem]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — values */}
      <section className="section_values">
        <div className="padding-global">
          <div className="container-large">
            <div className="values_content flex flex-col gap-10 py-24 min-[992px]:py-36">
              {/* .values_lines3 — a flat 2px rule behind the tag, blue
                  scroll-draws across it. Base is oat #e2e1d3 on paper. */}
              <div className="values_tag-wrap relative flex items-center">
                <div className="values_lines3 pointer-events-none absolute left-0 right-0 top-1/2 hidden h-[2px] -translate-y-1/2 min-[992px]:block"
                     aria-hidden="true">
                  <svg width="100%" height="100%" viewBox="0 0 1098 2"
                       preserveAspectRatio="none" fill="none">
                    <path d="M1098 1.0001L0 1" stroke="#e2e1d3" strokeWidth="2" fill="none" />
                    <path className="line-draw-blue" d="M1098 1.0001L0 1"
                          stroke="#0b4fff" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <div className="values_tag relative bg-paper px-4 text-[0.8125rem] uppercase leading-[1.3] text-ink/70">
                  OUR VALUES
                </div>
                <div className="h-px flex-1 bg-oat-dark min-[992px]:hidden" aria-hidden="true" />
              </div>

              <div className="values_wrap relative min-[992px]:max-w-[68.5rem]">
                {/* .values_lines — the long zig-zag threading the values list.
                    6846px path; blue scroll-draws the whole length. */}
                <div className="values_lines pointer-events-none hidden w-full min-[992px]:block"
                     aria-hidden="true">
                  {/* STATIC, and it defines the wrap height — the original
                      sizes .values_wrap from this SVG (natural ratio
                      1098:1331 = 1.2122 at every width, no
                      preserveAspectRatio override) and absolutely overlays
                      the copy on top. */}
                  <svg width="100%" height="100%" viewBox="0 0 1098 1331" fill="none"
                       className="block w-full">
                    <path d="M0 1H1073C1086.25 1 1097 11.7452 1097 25V206C1097 219.255 1086.25 230 1073 230H163.5C150.245 230 139.5 240.745 139.5 254V426C139.5 439.255 150.245 450 163.5 450H1073C1086.25 450 1097 460.745 1097 474V646C1097 659.255 1086.25 670 1073 670H163.5C150.245 670 139.5 680.745 139.5 694V866C139.5 879.255 150.245 890 163.5 890H1073C1086.25 890 1097 900.745 1097 914V1086C1097 1099.25 1086.25 1110 1073 1110H609C595.745 1110 585 1120.75 585 1134V1306C585 1319.25 595.745 1330 609 1330H786.5"
                          stroke="#e2e1d3" strokeWidth="2" fill="none" />
                    <path className="line-draw-blue"
                          d="M0 1H1073C1086.25 1 1097 11.7452 1097 25V206C1097 219.255 1086.25 230 1073 230H163.5C150.245 230 139.5 240.745 139.5 254V426C139.5 439.255 150.245 450 163.5 450H1073C1086.25 450 1097 460.745 1097 474V646C1097 659.255 1086.25 670 1073 670H163.5C150.245 670 139.5 680.745 139.5 694V866C139.5 879.255 150.245 890 163.5 890H1073C1086.25 890 1097 900.745 1097 914V1086C1097 1099.25 1086.25 1110 1073 1110H609C595.745 1110 585 1120.75 585 1134V1306C585 1319.25 595.745 1330 609 1330H786.5"
                          stroke="#0b4fff" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                {/* .values_data — the copy sits as an ABSOLUTE overlay on top
                    of the static SVG, exactly as the original does: there
                    .values_lines is position:static and defines the wrap's
                    height, while .values_data is position:absolute top/left 0.
                    Building it the other way round (line absolute, copy static)
                    compressed the SVG to the copy's height and made the zig-zag
                    cut through the body text. Static below 992px, where the
                    line is hidden and the cards un-stagger. */}
                <div className="values_data min-[992px]:absolute min-[992px]:inset-x-0 min-[992px]:top-0">
                <div className="values_heading pt-6">
                  <h2 className="reveal">What drives us</h2>
                </div>

                {/* .values_lines2 — the closing flat rule at the foot of the
                    values block (orig: top 1313.56 of a 1334-tall wrap). */}
                <div className="values_lines2 pointer-events-none absolute bottom-0 left-0 right-0 hidden h-[2px] min-[992px]:block"
                     aria-hidden="true">
                  <svg width="100%" height="100%" viewBox="0 0 1098 2"
                       preserveAspectRatio="none" fill="none">
                    <path d="M1098 1.0001L0 1" stroke="#e2e1d3" strokeWidth="2" fill="none" />
                    <path className="line-draw-blue" d="M1098 1.0001L0 1"
                          stroke="#0b4fff" strokeWidth="2" fill="none" />
                  </svg>
                </div>

                {/* Measured on the original: a flex column whose cards ALTERNATE
                    sides (align-self flex-end / flex-start), each pulled up by a
                    negative margin-top, so the .values_lines zig-zag threads
                    through the gap between the two staggered columns. Without
                    the stagger the line has nothing to weave around and cuts
                    straight through the body copy.
                      >=992px  gap 59.2px, alt sides, mt -68.8/-68.8/-43.2/-43.2/-40
                      <992px   gap 16px, align-self center, mt 0, line hidden */}
                <div className="values_cards relative mt-6 flex flex-col items-center gap-4 min-[992px]:mt-36 min-[992px]:ml-[8.7rem] min-[992px]:items-stretch min-[992px]:gap-[3.7rem] min-[992px]:pl-10">
                  {VALUES.map((v, i) => (
                    <div key={v.title}
                         className={`values_card reveal flex w-full max-w-[25rem] flex-col pr-4 ${
                           i % 2 === 0
                             ? 'min-[992px]:self-end'
                             : 'min-[992px]:self-start'
                         } ${VALUES_MT[i]}`}
                         data-reveal-delay={60 + i * 60}>
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true"
                           className="mb-2 text-oat">
                        <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2" />
                        <circle cx="24" cy="24" r="10.5" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <div className="values_h mb-4 bg-paper px-3 text-2xl leading-[1.1] text-oat">
                        {v.title}
                      </div>
                      <div className="values_p text-xl leading-[1.3]">{v.body}</div>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — hiring */}
      <section className="section_team overflow-hidden" style={{ backgroundColor: '#e6e5d8' }}>
        <div className="padding-global">
          <div className="container-large">
            <div className="team_content flex flex-col gap-12 py-28 md:gap-24">
              <div className="team_top flex flex-col gap-8 min-[992px]:flex-row min-[992px]:justify-between">
                <div className="team_heading flex flex-col gap-4 min-[992px]:w-[30rem] min-[992px]:flex-none">
                  <div className="team_tag text-[0.8125rem] uppercase leading-[1.3]">OUR TEAM</div>
                  <h2 className="reveal">Build the future of marketing with us</h2>
                </div>
                <div className="team_right flex flex-col items-start gap-6 min-[992px]:w-[31.5rem] min-[992px]:flex-none">
                  <p className="reveal text-base leading-[1.3]" data-reveal-delay="60">
                    We're growing fast and hiring across engineering, data science, go-to-market,
                    and operations. Join a team that's replacing the campaign model with a system
                    that continuously learns and improves — and doing so for some of the most
                    ambitious companies in the world.
                  </p>
                  <a href="#" className="btn-primary reveal"
                     data-reveal-delay="120">
                    See open roles
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* .team_lines — a CLOSED loop (path ends in Z) drawn around the
                  team photo, inset -48px horizontally and -44px vertically on
                  the original. Base is oat-darkest #c3c2b2 on this ground; the
                  blue segment travels the 3499px loop every 6s, same 5% rule
                  as .about_tag-line. */}
              <div className="team_visual reveal relative" data-reveal-delay="80">
                <div className="team_lines pointer-events-none absolute -inset-x-2 -inset-y-11 hidden min-[480px]:block md:-inset-x-6 min-[992px]:-inset-x-12"
                     aria-hidden="true">
                  <svg width="100%" height="100%" viewBox="0 0 1330 475"
                       preserveAspectRatio="none" fill="none">
                    <path d="M243 417V450C243 463.255 253.745 474 267 474H581C594.255 474 605 463.255 605 450V345C605 331.745 615.745 321 629 321H1305C1318.25 321 1329 310.255 1329 297V25C1329 11.7452 1318.25 1 1305 1H629C615.745 1 605 11.7452 605 25V72.9998C605 86.2546 594.255 96.9998 581 96.9998H25C11.7452 96.9998 1 107.745 1 121V369C1 382.255 11.7452 393 25 393H219C232.255 393 243 403.745 243 417Z" stroke="#c3c2b2" strokeWidth="2" fill="none" />
                    <path className="team-travel" d="M243 417V450C243 463.255 253.745 474 267 474H581C594.255 474 605 463.255 605 450V345C605 331.745 615.745 321 629 321H1305C1318.25 321 1329 310.255 1329 297V25C1329 11.7452 1318.25 1 1305 1H629C615.745 1 605 11.7452 605 25V72.9998C605 86.2546 594.255 96.9998 581 96.9998H25C11.7452 96.9998 1 107.745 1 121V369C1 382.255 11.7452 393 25 393H219C232.255 393 243 403.745 243 417Z"
                          stroke="#0b4fff" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <img src="/assets/img/about-team.png" alt="The Auxia team" loading="lazy"
                     className="team_img relative w-full rounded-2xl object-cover min-[992px]:h-[24.5rem]" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
