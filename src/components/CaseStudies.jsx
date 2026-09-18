/**
 * Customer stories.
 *
 * Measured on the live original: this is NOT a 3-up contained grid. It is a
 * full-bleed horizontal rail (.case-studies_slider, gap 8px) that breaks out of
 * .container-large and runs edge-to-edge at viewport width, holding 8 cards.
 *   .splide__slide — 504px wide (351px at 390), cream #fefdf5, radius 16px,
 *                    padding 24px (16px <768), flex column, space-between.
 *   .case-studies_top — flex ROW gap 24px (column at <480), img-wrap + text.
 *   .case-studies_stat — 104px/93.6px; .case-studies_under — 20px/20px.
 * .case-studies_content carries the rhythm: 128px >=768, 80px at 767, 48px <480,
 * with an 80px gap (32px <480) between heading and rail.
 *
 * The wordmarks are ORIGINAL invented placeholders standing in for the real
 * third-party customer marks, which are not Auxia's to license onward.
 * See Brands.jsx for the full note.
 */
const CASES = [
  {
    name: 'NTT Docomo', logo: 'meridian',
    body: 'NTT Docomo is Japan’s largest mobile carrier, serving over 90 million subscribers and generating annual revenue exceeding $35 billion.',
    stat: '100M+', statLabel: 'dPoint club members',
  },
  {
    name: 'Atlassian', logo: 'orbital',
    body: 'Atlassian is a global SaaS leader serving 300,000+ customers and millions of users with collaboration and developer tools like Jira and Confluence.',
    stat: '300K+', statLabel: 'customers',
  },
  {
    name: 'MUFG', logo: 'northwind',
    body: 'MUFG is one of the world’s leading comprehensive financial groups, with total assets exceeding 400 trillion yen and operations in more than 40 countries.',
    stat: '$3T+', statLabel: 'total assets',
  },
  {
    name: 'Konami', logo: 'quanta',
    body: 'Konami is a global entertainment company with iconic game franchises and $2B+ in annual revenue across digital games, sports, and gaming systems.',
    stat: '$2B+', statLabel: 'annual revenue',
  },
  {
    name: 'The Guardian', logo: 'halcyon',
    body: 'The Guardian is an international news organization reaching over 60 million monthly readers worldwide, supported by millions of paying supporters.',
    stat: '115M', statLabel: 'monthly unique visitors',
  },
  {
    name: 'Assurant', logo: 'cascadia',
    body: 'Assurant is a Fortune 500 insurer generating $10B+ in annual revenue, providing risk management and protection services to millions of customers globally.',
    stat: '$10B+', statLabel: 'annual revenue',
  },
  {
    name: 'Comcast', logo: 'stratafold',
    body: 'Comcast is a global telecommunications and media leader serving over 30 million broadband customers and reaching hundreds of millions of viewers through its portfolio of brands including Xfinity, NBCUniversal, and Sky.',
    stat: '30M+', statLabel: 'broadband customers',
  },
  {
    name: 'Mercari', logo: 'verdant',
    body: "Mercari operates one of the world's largest C2C marketplaces, with 20+ million users primarily across Japan and the US.",
    stat: '20M+', statLabel: 'users',
  },
]

export default function CaseStudies() {
  return (
    <section id="customers" className="section_case-studies">
      <div className="padding-global">
        <div className="container-large">
          <div className="case-studies_content flex flex-col gap-8 py-12
                          min-[480px]:gap-20 min-[480px]:py-20 min-[768px]:py-32">
            <div className="case-studies_heading max-w-[38rem]">
              <div className="reveal text-base leading-[1.3] text-ink/40">Customer Stories</div>
              <h2 className="reveal mt-1" data-reveal-delay="60">
                Powering personalized journeys at scale
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Full-bleed rail — breaks out of padding-global/container-large so the
          cards run edge-to-edge and bleed off the right, as in the original. */}
      <div className="case-studies_slider flex flex-col gap-2 overflow-hidden pb-12
                      min-[480px]:pb-20 min-[768px]:pb-32">
        <div className="case-studies_track flex flex-row gap-2 px-5 md:px-10">
          {CASES.map((c) => (
            <article key={c.name}
                     className="splide__slide flex w-[351px] flex-none flex-col justify-between
                                rounded-2xl bg-cream p-4 min-[768px]:w-[504px] min-[768px]:p-6">
              <div className="case-studies_top flex flex-col gap-6 min-[480px]:flex-row">
                <div className="case-studies_img-wrap flex-none min-[768px]:w-[216px]">
                  <img src={`/assets/logos/${c.logo}.svg`} alt=""
                       className="case-studies_img h-[33px] w-[160px] object-contain object-left
                                  min-[768px]:h-10 min-[768px]:w-[197px]" />
                </div>
                <div className="case-studies_text text-base leading-[1.3]">{c.body}</div>
              </div>
              <div className="case-studies_info">
                <div className="case-studies_stat text-[4rem] font-medium leading-[.9]
                                min-[768px]:text-[6.5rem]">
                  {c.stat}
                </div>
                <div className="case-studies_under text-xl font-medium leading-none">
                  {c.statLabel}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
