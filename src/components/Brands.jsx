/**
 * Customer logo marquee.
 *
 * The original shows nine third-party corporate marks. Those belong to the
 * respective companies (not Auxia), so they are NOT reproduced here — neither
 * as files nor redrawn as SVG paths. What ships instead are ORIGINAL invented
 * wordmarks at the same 5:1 aspect and slot geometry, so the layout and marquee
 * rhythm are exact. Swap in real SVGs once you've confirmed usage rights.
 */
const BRANDS = [
  'northwind', 'lumenline', 'cascadia', 'quanta', 'verdant',
  'orbital', 'meridian', 'stratafold', 'halcyon',
]

export default function Brands() {
  return (
    <section className="section_brands overflow-hidden">
      <div className="padding-global">
        <div className="brands_content container-large flex flex-col gap-4 py-8 md:gap-8 md:py-12 min-[992px]:gap-10 min-[992px]:py-20">
          <p className="brands_h text-xl leading-[1.3] text-ink/40">
            Leading brands grow with Auxia
          </p>

          <div className="marquee-rail relative"
               style={{ maskImage: 'linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)',
                        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)' }}>
            <div className="animate-marquee flex w-max items-center gap-16"
                 /* Original: Splide auto-scroll, speed 0.7 desktop / 1 mobile,
                    measured at 42.2 px/sec leftward, pauseOnHover:false.
                    Track half-width 1984px / 42.2 = 47s per loop. */
                 style={{ '--marquee-duration': '47s' }}>
              {[...BRANDS, ...BRANDS].map((b, i) => (
                <img key={`${b}-${i}`} src={`/assets/logos/${b}.svg`} alt=""
                     className="h-8 w-40 flex-none object-contain opacity-60
                                transition-opacity duration-200 hover:opacity-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
