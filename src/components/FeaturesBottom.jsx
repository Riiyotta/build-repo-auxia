/**
 * Enterprise assurance block that closes .section_features on both product pages.
 * Measured: .features_bottom flex-col gap 64px;
 *   .features_bottom-top flex-col gap 32px, 904px wide, h2 64px/60.8 (-1.92px ls),
 *   body .text-size-medium 20px/26 muted, 668px wide.
 *   .features_cards flex, gap 64px between cards on the original's row.
 *
 * Each .features_card measured at 1440: 305x287, blue rgb(11,79,255),
 * radius 24px, padding 40px 24px, flex-column with justify-content:
 * space-between — an 80px FILLED icon (paper, no stroke) sits at the top and
 * the 24px/31.2 label at the bottom. Shipping the label alone left the cards
 * as empty blue blocks.
 */
import { FEATURE_ICONS } from './featureIcons'

export default function FeaturesBottom({ heading, body, cards }) {
  return (
    <div className="features_bottom flex flex-col gap-16">
      <div className="features_bottom-top flex max-w-[56.5rem] flex-col gap-8">
        <h2 className="reveal">{heading}</h2>
        <div className="reveal max-w-[41.75rem] text-xl leading-[1.3] text-ink/70"
             data-reveal-delay="80">
          {body}
        </div>
      </div>
      <div className="features_cards grid gap-1 sm:grid-cols-2 min-[992px]:grid-cols-4">
        {cards.map((c, i) => {
          const { label, icon } = typeof c === 'string' ? { label: c, icon: null } : c
          const d = icon ? FEATURE_ICONS[icon] : null
          return (
            <div key={label}
                 className="features_card reveal flex h-[17.9375rem] flex-col justify-between
                            rounded-3xl bg-blue px-6 py-10 text-paper"
                 data-reveal-delay={60 + i * 60}>
              <div className="features_icon-wrapper flex items-start">
                {d && (
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none"
                       aria-hidden="true" className="features_icon">
                    <path d={d} fill="#F0EFE3" />
                  </svg>
                )}
              </div>
              <div className="text-2xl leading-[1.3]">{label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
