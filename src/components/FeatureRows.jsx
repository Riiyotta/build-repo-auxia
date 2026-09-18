import FeatureConnector from './FeatureConnector'
/**
 * Alternating feature rows — shared by /agent-studio and /decisioning.
 *
 * Measured on both originals (.section_features > .features_content):
 *   content padding 120px top / 180px bottom, column gap 40px
 *   .features_item is a 12-col grid, 88px tracks, 16px gap
 *     even rows: .features_info spans cols 1-5 (504px), .features_empty col 6,
 *                .features_img-wrap spans 7-12 (608px)
 *     odd rows:  image first (1-6), empty, info (8-12)
 *   .features_info  flex-col gap 24px
 *     .features_top flex-col gap 12px -> eyebrow 14px/18.2 blue, h2 48px/45.6 (-1.44px ls)
 *     .features_list flex-col gap 24px
 *       .layout32_item flex-row gap 10px -> 8px blue dot, title 20px/24, body 16px/20.8 muted
 *   .features_img-wrap radius 24px, image fills 608px wide
 *   Between rows: .features_canvas-wrap 1232x180 holding an animated connector
 *     <canvas>. Reproduced here as a static SVG rail — see the Animation note.
 */

/* `children` is the .features_bottom block. On the original it lives INSIDE
   .features_content, preceded by a 6th connector that closes to centre — not
   as a sibling section, which is how the clone had it. */
export default function FeatureRows({ items, children }) {
  return (
    <section className="section_features">
      <div className="padding-global">
        <div className="container-large">
          <div className="features_content flex flex-col gap-10 pb-24 pt-16 md:pb-32 min-[992px]:pb-[11.25rem] min-[992px]:pt-[7.5rem]">
            {items.map((item, i) => {
              const imgFirst = i % 2 === 1
              return (
                <div key={item.eyebrow}>
                  {/* Connector above every row after the first. The original
                      alternates direction with the row's image side: canvases
                      0,2,4 run right-to-left and 1,3 left-to-right. */}
                  {i > 0 && <FeatureConnector variant={i % 2 === 1 ? 'rtl' : 'ltr'} />}
                  <div className="features_item grid items-center gap-4 min-[992px]:grid-cols-12">
                    <div className={`features_img-wrap overflow-hidden rounded-3xl reveal
                                     min-[992px]:col-span-6 ${imgFirst ? 'min-[992px]:col-start-1 min-[992px]:order-none' : 'min-[992px]:col-start-7 order-last'}`}
                         data-reveal-delay="80">
                      <img src={item.img} alt="" loading="lazy"
                           className="features_img block w-full" />
                    </div>

                    <div className={`features_info flex flex-col gap-6
                                     min-[992px]:col-span-5 ${imgFirst ? 'min-[992px]:col-start-8' : 'min-[992px]:col-start-1'}`}>
                      <div className="features_top flex flex-col gap-3">
                        <p className="stack_title reveal !opacity-100 text-blue">
                          {item.eyebrow}
                        </p>
                        <h2 className="reveal text-h3" data-reveal-delay="60">{item.title}</h2>
                      </div>
                      <div className="features_list flex flex-col gap-6">
                        {item.points.map((pt, j) => (
                          <div key={pt.title} className="layout32_item reveal flex flex-row gap-2.5"
                               data-reveal-delay={100 + j * 60}>
                            <div className="mt-2 h-2 w-2 flex-none rounded-full bg-blue" />
                            <div className="flex flex-col gap-2">
                              <h3 className="layout32_title is-small text-xl leading-[1.2] tracking-normal">{pt.title}</h3>
                              <p className="text-base leading-[1.3] text-ink/70">{pt.body}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {children && (
              <>
                <FeatureConnector variant="close" />
                {children}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
