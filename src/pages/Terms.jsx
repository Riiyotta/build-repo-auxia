/**
 * /terms — long-form legal page.
 *
 * Shares the exact layout shell measured on /privacy-policy (both use
 * .section_legal → .legal_content grid 400px / 712px, gap 120px,
 * padding 128px 0 40px; sticky .legal_left; .legal_rich-wrapper padding 40px).
 *
 * Measured on the reference site's /terms at 1440x900:
 *   section_legal        13774px
 *   .legal_rich-wrapper  712x13606
 *   TOC                  2 entries — "Terms of use agreement", "Purchases; payment"
 *   structure            2 h2, 20 h3, 42 p, 5 ul (38 li total)
 *   typography           identical to /privacy-policy:
 *                        h2 48px/500/45.6px/-1.44px, margin 40px 0 24px
 *                        h3 24px/500/22.8px/-0.72px,  margin 24px 0
 *                        p  16px/500/24px, margin 24px 0, measure 632px
 *                        ul padding-left 24px, list-style square
 *
 * Heading names and per-section block counts are reproduced from the original.
 * The BODY PROSE IS PLACEHOLDER — see the banner rendered at the top of the
 * page. Do not ship publicly without replacing it.
 */

const TOC = [
  { id: 'terms-of-use', label: 'Terms of use agreement' },
  { id: 'purchases-payment', label: 'Purchases; payment' },
]

/* The original nests 20 h3 subsections under the second h2. Each carries
   1-3 paragraphs; five of them carry a square-bulleted list. */
const SUBSECTIONS = [
  { h3: 'Refund and return', p: 2 },
  { h3: 'User representations', p: 1, ul: 7 },
  { h3: 'Contribution license', p: 3 },
  { h3: 'Submissions', p: 1 },
  { h3: 'Prohibited activities', p: 2, ul: 12 },
  { h3: 'Intellectual property rights', p: 3 },
  { h3: 'Third party websites and content', p: 2 },
  { h3: 'Site management', p: 1, ul: 5 },
  { h3: 'Term and termination', p: 2 },
  { h3: 'Modifications', p: 2 },
  { h3: 'Disputes', p: 4 },
  { h3: 'Corrections', p: 1 },
  { h3: 'Disclaimers', p: 2 },
  { h3: 'Limitations of liability', p: 2 },
  { h3: 'Indemnity', p: 1, ul: 6 },
  { h3: 'Notices', p: 1 },
  { h3: 'User data', p: 1 },
  { h3: 'Electronic contracting', p: 2 },
  { h3: 'Miscellaneous', p: 1, ul: 8 },
  { h3: 'Contact us', p: 2 },
]

const LOREM = [
  'Placeholder copy. This paragraph occupies the position of a passage in the published terms of use and is written only to match its approximate length. It refers in general terms to the agreement formed between a visitor and the operator of a site, and to the visitor\'s acknowledgement that continued use indicates acceptance of the terms in force.',
  'Placeholder copy. Representative filler standing in for language about eligibility and capacity. The real document at this point addresses who may lawfully form a binding agreement, the representations a user makes on registering, and the consequences of providing inaccurate information.',
  'Placeholder copy. This block substitutes for a passage concerning fees, billing and currency. In the published document this position is occupied by language describing accepted payment methods, the timing of charges, applicable taxes, and the user\'s obligation to keep billing details current.',
  'Placeholder copy. Filler text of comparable measure to the original passage. It gestures at the operator\'s reservation of rights to refuse, limit or cancel an order, to correct pricing errors, and to suspend availability of a service without prior notice.',
  'Placeholder copy. This paragraph replaces language about permitted and impermissible uses of a service. None of the statements here describe actual practice or create any obligation; they exist solely to reproduce the visual rhythm of the document.',
  'Placeholder copy. Standing in for a passage about ownership of content and the licence a user grants when submitting material. The real text addresses the scope, duration and revocability of that licence and the warranties the submitting party gives.',
  'Placeholder copy. Representative text matched in length to the corresponding passage. At this point the published document typically addresses disclaimers of warranty, the allocation of risk, and the extent to which liability may be limited under applicable law.',
]

const LI = [
  'Placeholder list item standing in for one enumerated obligation or restriction.',
  'Placeholder list item; the published document enumerates a further condition here.',
  'Placeholder list item matched in length to the corresponding entry in the original.',
  'Placeholder list item — representative filler, not an actual term.',
  'Placeholder list item occupying the position of an enumerated prohibition.',
  'Placeholder list item; replace with the real enumerated term before public use.',
  'Placeholder list item standing in for an additional condition of use.',
  'Placeholder list item reproducing the structure of the published list.',
  'Placeholder list item — no obligation is created by this text.',
  'Placeholder list item matched to the original entry\'s approximate measure.',
  'Placeholder list item; the real document continues the enumeration here.',
  'Placeholder list item closing the enumerated set in this subsection.',
]

function Para({ i }) {
  return (
    <p className="my-6 max-w-[39.5rem] text-base leading-[1.5] text-ink">
      {LOREM[i % LOREM.length]}
    </p>
  )
}

function Bullets({ n, seed }) {
  return (
    <ul
      className="my-6 max-w-[39.5rem] pl-6 text-base leading-[1.5] text-ink"
      style={{ listStyleType: 'square' }}
    >
      {Array.from({ length: n }).map((_, i) => (
        <li key={i}>{LI[(i + seed) % LI.length]}</li>
      ))}
    </ul>
  )
}

export default function Terms() {
  let pc = 0
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
              <h2 className="text-h2">Terms and Conditions</h2>
              <nav className="legal_toc flex flex-col gap-3" aria-label="On this page">
                {TOC.map((s) => (
                  <div key={s.id} className="fs-toc_link-wrapper flex">
                    <a
                      href={`#${s.id}`}
                      className="fs-toc_link block border-l-2 border-ink/10 px-4 py-2 text-sm
                                 leading-[1.3] text-ink/70 transition-colors duration-200
                                 hover:border-ink/40 hover:text-ink"
                    >
                      {s.label}
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
                  structure and length of Auxia's published terms and conditions. It states
                  no actual terms. Replace it with the real document before any public use.
                </p>
              </div>

              <div className="legal_rich">
                <section id="terms-of-use" className="scroll-mt-24">
                  <h2 className="mb-6 mt-10 text-h3">Terms of use agreement</h2>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Para key={i} i={pc++} />
                  ))}
                </section>

                <section id="purchases-payment" className="scroll-mt-24">
                  <h2 className="mb-6 mt-10 text-h3">Purchases; payment</h2>
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Para key={`lead-${i}`} i={pc++} />
                  ))}

                  {SUBSECTIONS.map((s, si) => (
                    <div key={s.h3}>
                      <h3 className="my-6 text-2xl font-medium leading-[.95] tracking-[-.03em]">
                        {s.h3}
                      </h3>
                      {Array.from({ length: s.p }).map((_, i) => (
                        <Para key={i} i={pc++} />
                      ))}
                      {s.ul && <Bullets n={s.ul} seed={si} />}
                    </div>
                  ))}
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
