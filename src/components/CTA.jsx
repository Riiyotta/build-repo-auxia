import CtaCanvas from './CtaCanvas'
/**
 * CTA.
 * Measured on the live original: blue ground rgb(11,79,255), content padding
 * 180px top/bottom (128px at <768), heading block LEFT-aligned at 698px wide
 * with a 32px gap to the button group — not centred. Buttons are the white /
 * dark-tertiary pair, not the paper-ground primary/secondary pair.
 */
export default function CTA() {
  return (
    <section id="cta" className="section_cta relative overflow-hidden bg-blue text-paper">
      <CtaCanvas />
      <div className="padding-global relative">
        <div className="container-large">
          <div className="cta_content py-32 min-[992px]:py-[11.25rem]">
            <div className="cta_heading flex max-w-[43.625rem] flex-col gap-8">
              <h2 className="reveal">
                Turn every customer interaction into impact.
              </h2>
              <div className="reveal button-group flex flex-col items-start gap-4 md:flex-row md:flex-wrap md:items-center"
                   data-reveal-delay="100">
                <a href="#" className="btn-white">Request a Demo</a>
                <a href="#stack" className="btn-tertiary">See how it works</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
