/**
 * Automations.
 * Measured on the live original at 1440x900 — this is NOT a marquee. It is a
 * static field of 36 rows behind the copy, revealed by scroll motion only.
 *
 *   .section_automations            900px tall, overflow hidden, bg rgb(22,22,22)
 *     .padding-global > .container-large
 *       .automations_content        relative, flex, items-center, h 900px
 *         .automations_behind       1328.06px tall, flex-col — overflows the
 *                                   section, which is why it clips. Two
 *                                   .automations_wrapper groups (24 + 12 rows),
 *                                   each with margin-bottom 12px.
 *           .automations_wrapper    873.375px / 430.688px
 *             .automations_list     flex-col, justify-between, gap 12px
 *               .automations_item   24.89px, flex, items-center, gap 16px
 *                 .automations_name 13px/500 IBM Plex Mono, rgb(240,239,227)
 *                 .automations_spacer 2px rule, flex-1, rgba(255,255,255,.05)
 *                 .automations_tag  pill, bg rgba(11,79,255,.2), px-2 py-1,
 *                                   gap 4px: 12px bolt icon + .automations_text2
 *         .automations_info         absolute inset-0 z-1, flex-col centre, gap 16px
 *           .automations_h          120px/500/-3.6px blue — "<counter> billion"
 *             .automations_counter  inline-block, min-w 192px, text-right, "00"
 *           .automations_text       48px/500/-1.44px paper
 *           .automations_bg         absolute inset-0 z-[-1] radial vignette
 *
 * Original font is PP Neue Montreal (commercial); Archivo is the project's
 * documented substitution — font-family is intentionally unchanged.
 *
 * Breakpoints measured on the original:
 *   >=992  h 120px / counter min-w 192px / text 48px / info gap 16px
 *   <=991  h  96px / counter min-w 144px / text 32px  (767 is identical)
 *   <=479  the whole block scales with the viewport (100vw/520); at 390px that
 *          lands on h 78px, text 23.4px, name/tag 9.75px, icon 7.3125px,
 *          tag padding 2.4375px, info gap 8px. Reproduced with vw-derived
 *          values below rather than a fixed 390px breakpoint.
 *
 * NOTE: .automations_behind is sized h-[148%] (NOT inset-0) on purpose — the
 * pinned scrub in useMotion.js needs the panel to overflow the viewport.
 */

/* 36 rows, in the original's DOM order: [event name, resulting action tag]. */
const ROWS = [
  ['SUBSCRIBED TO SMS', 'EXIT-INTENT BANNER'],
  ['ACCOUNT CREATED', 'WIN BACK EMAIL'],
  ['SEARCH RESULT CLICKED', 'BACK-IN-STOCK EMAIL'],
  ['SEARCH COMPLETED', 'FLASH SALE PUSH'],
  ['PAYMENT FAILED', 'LOYALTY REWARD REMINDER'],
  ['SUBSCRIPTION STARTED', 'GEO-TRIGGERED OFFER'],
  ['SUBSCRIBED TO EMAIL', 'POST-PURCHASE UPSELL'],
  ['SALE CATEGORY VIEWED', 'BACK-IN-STOCK EMAIL'],
  ['GIFT CARD APPLIED', 'LOYALTY SMS'],
  ['CHECKOUT STARTED', 'PRICE ALERT PUSH'],
  ['OFFER APPLIED', 'EARLY ACCESS POPUP'],
  ['REVIEWS VIEWED', 'BROWSE ABANDONMENT EMAIL'],
  ['SEARCH RESULT CLICKED', 'ORDER STATUS PUSH'],
  ['CATEGORY PAGE VIEWED', 'FLASH SALE SMS'],
  ['REFERRAL SENT', 'LIFECYCLE NURTURE'],
  ['WISHLIST SHARED', 'OFFER BANNER'],
  ['PURCHASE COMPLETED', 'WIN-BACK EMAIL'],
  ['LOYALTY PROGRAM SIGNUP', 'LOYALTY MILESTONE PUSH'],
  ['BOOKING CANCELLED', 'CART ABANDONED SMS'],
  ['BOOKING FLOW STARTED', 'CROSS-SELL PROMO'],
  ['ACCOUNT CREATED', 'WELCOME EMAIL'],
  ['COMPARISON TOOL USED', 'OFFER CONTENT CARD'],
  ['CHECK IN COMPLETED', 'HOMEPAGE BANNER'],
  ['PRICE ALERT CREATED', 'PRICE ALERT PUSH'],
  /* second .automations_wrapper starts here (12 rows) */
  ['GIFT CARD APPLIED', 'LOYALTY SMS'],
  ['REFERRAL SENT', 'LIFECYCLE NURTURE'],
  ['SEARCH COMPLETED', 'FLASH SALE PUSH'],
  ['BOOKING CANCELLED', 'CART ABANDONED SMS'],
  ['WISHLIST SHARED', 'OFFER BANNER'],
  ['ACCOUNT CREATED', 'WELCOME EMAIL'],
  ['REVIEWS VIEWED', 'BROWSE ABANDONMENT EMAIL'],
  ['CHECK IN COMPLETED', 'HOMEPAGE BANNER'],
  ['PAYMENT FAILED', 'LOYALTY REWARD REMINDER'],
  ['OFFER APPLIED', 'EARLY ACCESS POPUP'],
  ['SEARCH RESULT CLICKED', 'BACK-IN-STOCK EMAIL'],
  ['BOOKING FLOW STARTED', 'CROSS-SELL PROMO'],
]

/* The original splits the 36 rows across two .automations_wrapper groups. */
const GROUPS = [ROWS.slice(0, 24), ROWS.slice(24)]

/* .automations_icon — 12x12 lightning bolt, fill currentColor (blue). */
function BoltIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none" aria-hidden="true"
         className="automations_icon block h-[12px] w-[12px] shrink-0 overflow-hidden
                    text-blue max-[479px]:h-[calc(100vw*7.3125/390)] max-[479px]:w-[calc(100vw*7.3125/390)]">
      <path fill="currentColor"
            d="M7.00155 1.17695C7.00155 0.56364 6.2102 0.317239 5.86205 0.82212L1.58813 7.0193C1.30219 7.4339 1.59899 7.9991 2.10264 7.9991H5.00154V10.8212C5.00154 11.4345 5.79285 11.681 6.14105 11.1761L10.415 4.97894C10.7009 4.56433 10.4041 3.99911 9.90045 3.99911H7.00155V1.17695Z" />
    </svg>
  )
}

function Item({ name, tag }) {
  return (
    <div role="listitem" className="automations_item flex items-center gap-4">
      <div className="automations_name flex-none whitespace-nowrap font-mono text-[13px]
                      font-medium leading-[1.3] text-paper max-[479px]:text-[calc(100vw*9.75/390)]">
        {name}
      </div>
      <div className="automations_spacer h-[2px] min-w-0 flex-1 rounded-full bg-white/5" />
      <div className="automations_tag flex flex-none items-center gap-1 rounded-full
                      bg-blue/20 px-2 py-1 font-mono text-[13px] font-medium leading-[1.3] text-paper
                      max-[479px]:gap-[calc(100vw*2.4375/390)] max-[479px]:p-[calc(100vw*2.4375/390)]
                      max-[479px]:text-[calc(100vw*9.75/390)]">
        <BoltIcon />
        <div className="automations_text2 whitespace-nowrap">{tag}</div>
      </div>
    </div>
  )
}

export default function Automations() {
  return (
    <section id="decisioning"
             className="section_automations relative isolate h-[900px] max-h-[900px] overflow-hidden
                        bg-[#161616] text-paper">
      <div className="padding-global h-full">
        <div className="container-large h-full">
          <div className="automations_content relative flex h-full items-center">

            {/* Tag field, behind the copy. 1328px against a 900px section — the
                overflow is what the pinned scrub travels through, so this stays
                h-[148%] rather than inset-0. */}
            <div className="automations_behind absolute inset-x-0 top-0 h-[148%] flex flex-col"
                 aria-hidden="true">
              {GROUPS.map((group, gi) => (
                <div key={gi} className="automations_wrapper mb-3">
                  <div role="list"
                       className="automations_list flex flex-col justify-between gap-3">
                    {group.map(([name, tag], i) => (
                      <Item key={`${gi}-${i}`} name={name} tag={tag} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Foreground copy */}
            <div className="automations_info absolute inset-0 z-[1] flex flex-col items-center
                            justify-center gap-4 max-[479px]:gap-2">
              <div className="automations_h text-center text-[96px] font-medium leading-[.95]
                              tracking-[-.03em] text-blue min-[992px]:text-[120px]
                              max-[479px]:text-[calc(100vw*78/390)]">
                {/* Rests at "00" like the original; useMotion counts up to data-count-to. */}
                <span data-count-to="200"
                      className="automations_counter inline-block min-w-[144px] text-right
                                 min-[992px]:min-w-[192px] max-[479px]:min-w-[calc(100vw*120.9/390)]">
                  00
                </span>{' '}billion
              </div>
              <div className="automations_text text-center text-[32px] font-medium leading-[.95]
                              tracking-[-.045em] text-paper min-[992px]:text-[48px]
                              max-[479px]:text-[calc(100vw*23.4/390)]">
                automated decisions served
              </div>

              {/* Radial vignette that pulls the centre back to near-black */}
              <div className="automations_bg absolute inset-0 z-[-1]" aria-hidden="true"
                   style={{ backgroundImage:
                     'radial-gradient(circle, rgb(25,25,25) 15%, rgba(255,255,255,0))' }} />
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
