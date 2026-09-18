/**
 * /privacy-policy — long-form legal page.
 *
 * Measured on the reference site's /privacy-policy at 1440x900:
 *   section_legal        7964px, inherits body bg #f0efe3 (paper)
 *   .legal_content       grid 400px / 712px, gap 120px, padding 128px 0 40px
 *   .legal_left          sticky top 0, flex col, gap 40px, padding-top 40px
 *     h2 .heading-style-h2 → 64px/500/60.8px/-1.92px  "Privacy Policy"
 *     .legal_toc         flex col, gap 12px
 *     .fs-toc_link       14px/500/18.2px, rgba(35,35,35,.7),
 *                        padding 8px 16px, border-left 2px rgba(35,35,35,.1)
 *   .legal_rich-wrapper  712px, flex col, gap 24px, padding 40px
 *     h2                 48px/500/45.6px/-1.44px, margin 40px 0 24px
 *     h3                 24px/500/22.8px/-0.72px,  margin 24px 0
 *     p                  16px/500/24px,            margin 24px 0, measure 632px
 *     ul                 padding-left 24px, list-style square
 *     li                 16px/500/24px
 *     a                  16px/500/24px, colour #232323, underlined
 *
 * Responsive (measured):
 *   991px  .legal_content → flex column, gap 32px; left not sticky;
 *          rich-wrapper padding 32px
 *   767px  gap 24px on left; rich-wrapper padding 24px
 *   390px  rich-wrapper padding 24px 16px
 *
 * Section names / heading hierarchy / paragraph + list counts per section are
 * reproduced from the original. The BODY PROSE IS PLACEHOLDER — see the banner
 * rendered at the top of the page. Do not ship publicly without replacing it.
 */

const SECTIONS = [
  {
    id: 'how-we-collect',
    h2: 'How we collect and use your personal information',
    blocks: [
      { t: 'p', n: 5 },
    ],
  },
  {
    id: 'do-we-share',
    h2: 'Do we share your personal information?',
    blocks: [
      { t: 'h3', text: 'General Provisions' },
      { t: 'p', n: 3 },
      { t: 'h3', text: 'Analytics' },
      { t: 'p', n: 2 },
      { t: 'h3', text: 'Social Media' },
      { t: 'p', n: 2 },
      { t: 'h3', text: 'Third-Party Service Providers' },
      { t: 'p', n: 3 },
      { t: 'h3', text: 'Third-Party Platforms' },
      { t: 'p', n: 2 },
    ],
  },
  { id: 'security', h2: 'Security', blocks: [{ t: 'p', n: 2 }] },
  {
    id: 'data-retention',
    h2: 'Data retention and deletion',
    blocks: [{ t: 'p', n: 2 }],
  },
  {
    id: 'privacy-rights-eu',
    h2: 'Privacy rights - EU users',
    blocks: [
      { t: 'p', n: 1 },
      {
        t: 'ul',
        items: [
          'Placeholder: the right to request access to a copy of the personal information held about you.',
          'Placeholder: the right to request correction or erasure of that personal information.',
          'Placeholder: the right to ask that processing of your personal information be limited.',
          'Placeholder: the right to data portability, where that right applies.',
          'Placeholder: the right to object to the processing of your personal information.',
        ],
      },
      { t: 'p', n: 3 },
      {
        t: 'ul',
        items: [
          'Placeholder: contact details for the relevant EU supervisory authority go here.',
          'Placeholder: contact details for the relevant national supervisory authority go here.',
        ],
      },
      { t: 'p', n: 1 },
      {
        t: 'ul',
        items: [
          'Placeholder: EU representative name and registered address go here.',
          'Placeholder: UK representative name and registered address go here.',
        ],
      },
    ],
  },
  {
    id: 'privacy-rights-california',
    h2: 'Privacy rights - California users',
    blocks: [{ t: 'p', n: 7 }],
  },
  { id: 'children', h2: 'Children', blocks: [{ t: 'p', n: 2 }] },
  { id: 'do-not-track', h2: 'Do-not-track notice', blocks: [{ t: 'p', n: 1 }] },
  { id: 'governing-law', h2: 'Governing law', blocks: [{ t: 'p', n: 1 }] },
  {
    id: 'privacy-notice-changes',
    h2: 'Privacy notice changes',
    blocks: [{ t: 'p', n: 2 }],
  },
  { id: 'contact', h2: 'Contact', blocks: [{ t: 'p', n: 3 }] },
]

/* Placeholder paragraphs of comparable length to the original's prose
   (roughly 55-75 words each). Cycled so every section reads differently. */
const LOREM = [
  'Placeholder copy. This paragraph stands in for a passage of the published privacy notice and is written only to occupy a comparable amount of vertical space. It describes, in general terms, the categories of information a visitor might provide and the circumstances in which that information would ordinarily be collected, without stating any actual commitment on behalf of the company.',
  'Placeholder copy. This paragraph is representative filler text matched to the length of the corresponding passage in the real document. It refers in a generic way to automatically-collected technical details such as network identifiers, device characteristics and browsing activity, and to the general purposes for which such details are typically processed by a website operator.',
  'Placeholder copy. The text here is not legal language and creates no obligations. It occupies the position of a passage describing how collected information may be analysed, aggregated or combined with other records in order to operate, secure and improve a service, and how long such processing would normally be expected to continue.',
  'Placeholder copy. This block substitutes for a passage concerning disclosure to other parties. In the published document this position is occupied by language about contractors, affiliates, vendors and suppliers, the contractual restrictions imposed on them, and the limited circumstances in which information may be passed on.',
  'Placeholder copy. Standing in for a passage about legal process and corporate transactions, this paragraph occupies the same measure as the original text. The real document addresses responses to lawful requests and the treatment of information in the event of a merger, acquisition or transfer of assets.',
  'Placeholder copy. This filler paragraph replaces language about the choices available to a visitor, including how preferences may be expressed, how communications may be declined, and where to direct a question. None of the statements here should be read as describing actual practice.',
  'Placeholder copy. Representative text of similar length to the original passage. It gestures at the safeguards that an operator would customarily describe at this point in a privacy notice — organisational measures, access controls and the inherent limits of transmitting information over a public network.',
]

function Para({ i }) {
  return (
    <p className="my-6 max-w-[39.5rem] text-base leading-[1.5] text-ink">
      {LOREM[i % LOREM.length]}
    </p>
  )
}

export default function PrivacyPolicy() {
  return (
    <section className="section_legal">
      <div className="padding-global">
        <div className="container-large">
          <div
            className="legal_content flex flex-col gap-8 pb-10 pt-32
                       min-[992px]:grid min-[992px]:grid-cols-[400px_minmax(0,712px)]
                       min-[992px]:gap-[7.5rem]"
          >
            {/* ---------- Sticky left rail ---------- */}
            <div className="legal_left flex flex-col gap-6 min-[992px]:sticky min-[992px]:top-0 min-[992px]:h-fit min-[992px]:gap-10 min-[992px]:pt-10">
              <h2 className="text-h2">Privacy Policy</h2>
              <nav className="legal_toc flex flex-col gap-3" aria-label="On this page">
                {SECTIONS.map((s) => (
                  <div key={s.id} className="fs-toc_link-wrapper flex">
                    <a
                      href={`#${s.id}`}
                      className="fs-toc_link block border-l-2 border-ink/10 px-4 py-2 text-sm
                                 leading-[1.3] text-ink/70 transition-colors duration-200
                                 hover:border-ink/40 hover:text-ink"
                    >
                      {s.h2}
                    </a>
                  </div>
                ))}
              </nav>
            </div>

            {/* ---------- Rich text column ---------- */}
            <div className="legal_rich-wrapper flex flex-col gap-4 px-4 py-6 min-[768px]:p-6 min-[992px]:gap-6 min-[992px]:p-10">
              {/* Visible placeholder notice — required before public use. */}
              <div
                role="note"
                className="reveal rounded-btn border-2 border-warning-dark/30 bg-warning p-4 text-warning-dark"
              >
                <p className="text-base font-medium leading-[1.4]">
                  Placeholder copy — not a legal document.
                </p>
                <p className="mt-1 max-w-[39.5rem] text-base leading-[1.5]">
                  The body text on this page is representative filler written to match the
                  structure and length of Auxia's published privacy notice. It states no
                  actual policy. Replace it with the real policy text before any public use.
                </p>
              </div>

              <div className="legal_rich">
                <Para i={0} />
                <Para i={1} />
                <p className="my-6 max-w-[39.5rem] text-base leading-[1.5] text-ink">
                  Company Information
                  <br />
                  Auxia Inc.
                  <br />
                  555 Hamilton Avenue
                  <br />
                  Palo Alto, CA 94301
                  <br />
                  Email:{' '}
                  <a href="#" className="text-ink underline">
                    support@example.com
                  </a>
                </p>

                {SECTIONS.map((s, si) => {
                  let pi = si
                  return (
                    <section key={s.id} id={s.id} className="scroll-mt-24">
                      <h2 className="mb-6 mt-10 text-h3">{s.h2}</h2>
                      {s.blocks.map((b, bi) => {
                        if (b.t === 'h3')
                          return (
                            <h3
                              key={bi}
                              className="my-6 text-2xl font-medium leading-[.95] tracking-[-.03em]"
                            >
                              {b.text}
                            </h3>
                          )
                        if (b.t === 'ul')
                          return (
                            <ul
                              key={bi}
                              className="my-6 max-w-[39.5rem] list-square pl-6 text-base leading-[1.5] text-ink"
                              style={{ listStyleType: 'square' }}
                            >
                              {b.items.map((it) => (
                                <li key={it}>{it}</li>
                              ))}
                            </ul>
                          )
                        return Array.from({ length: b.n }).map((_, k) => (
                          <Para key={`${bi}-${k}`} i={pi++ + k} />
                        ))
                      })}
                    </section>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
