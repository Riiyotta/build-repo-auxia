/**
 * Marketing.
 * Measured on the live original: the section carries a DARK ground
 * (rgb(35,35,35)) with paper-coloured type, vertical rhythm 180px at >=992px
 * (80/64 down the scale), and a two-up top row (heading 480px / body 456px)
 * followed by two full-width panels — the muted "mess" panel and the blue
 * "cleanup" panel.
 *
 * Measured rhythm on .marketing_content: 180px >=1280, 80px at 991, 64px <=767.
 * The content wrapper itself has NO flex gap; the 40px separation between the
 * top row and the panels comes from panel margins.
 * Panel padding/gap: 40px/40px >=992, 24px/24px 768-991, 24px vertical +
 * 8px horizontal with a 16px gap below 768.
 * .marketing_p column gap is 24px only at >=1280; it is 8px below that.
 * The "clean" canvas is fluid (363/353/274/217/109), not a fixed height.
 */
import MarketingCanvas from './MarketingCanvas'

export default function Marketing() {
  return (
    <section id="about" className="section_marketing bg-ink text-paper">
      <div className="padding-global">
        <div className="marketing_content container-large flex flex-col py-16 min-[992px]:py-20 min-[1280px]:py-[11.25rem]">

          {/* Top: heading left, body right */}
          <div className="marketing_top flex flex-col justify-between gap-8 min-[992px]:flex-row min-[992px]:gap-20">
            <div className="reveal max-w-[30rem] min-[992px]:w-[30rem] min-[992px]:flex-none">
              <h2>
                Marketing didn&rsquo;t get harder.
                <br />
                <span className="text-paper/40">It got stuck.</span>
              </h2>
            </div>
            <div className="marketing_p reveal flex flex-col gap-2 text-base leading-[1.3] text-paper/70 min-[1280px]:w-[28.5rem] min-[1280px]:flex-none min-[1280px]:gap-6"
                 data-reveal-delay="100">
              <p>
                Marketers are drowning in the workflows and coordination that teams and tools
                require, only to deliver campaigns and journeys that require constant oversight.
                Meanwhile, customers are pushed through static rules built for segments, not
                individuals.
              </p>
              <p>
                Auxia&rsquo;s agents work across your stack and create a unique journey for every
                customer, while continuously learning and optimizing the next interaction.
                Marketing stops resetting and performance compounds over time.
              </p>
            </div>
          </div>

          {/* Panel 1 — the mess */}
          <div className="marketing_mess reveal mt-10 flex flex-col gap-4 border border-white/10 px-2 py-6
                          min-[768px]:gap-6 min-[768px]:p-6 min-[992px]:gap-10 min-[992px]:p-10"
               data-reveal-delay="140">
            <p className="text-2xl leading-none tracking-[-.03em]">
              <span className="text-paper/40">Your journeys are a</span>{' '}
              <span className="text-orange">mess</span>
            </p>
            <div className="marketing_canvas-wrap h-[21.25rem] w-full">
              <MarketingCanvas variant="mess" />
            </div>
          </div>

          {/* Panel 2 — the cleanup */}
          <div className="marketing_cleanup reveal mt-10 flex flex-col gap-4 bg-blue px-2 py-6
                          min-[768px]:gap-6 min-[768px]:p-6 min-[992px]:gap-10 min-[992px]:p-10"
               data-reveal-delay="180">
            <p className="text-2xl leading-none tracking-[-.03em]">
              <span className="text-paper/60">Clean them up with</span>{' '}
              <span className="text-paper">Auxia</span>
            </p>
            <div className="marketing_canvas-wrap aspect-[1152/363] h-auto max-h-[22.6875rem] w-full">
              <MarketingCanvas variant="clean" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
