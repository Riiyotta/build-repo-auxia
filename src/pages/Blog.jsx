import { useEffect, useMemo, useRef, useState } from 'react'
import CTA from '../components/CTA'

/**
 * /blog — index / listing page.
 *
 * Measured on the reference site's /blog at 1440x900:
 *   section_blog7      667px   bg #f0efe3 (paper), padding-top 72px
 *     .blog7_component padding 80px 0 64px
 *     featured link    grid 540.438px / 675.562px, gap 16px, height 451px
 *     featured image   676x451, radius 16px
 *     featured h3      .heading-style-h4 → 64px/500/60.8px/-1.92px
 *   section_blog-list  1324px  bg #fefdf5
 *     .blog7_filters   87px tall, form is flex + space-between
 *     radio label      padding 32px 16px, label span 13px/400/18.2px
 *     search input     320px wide, padding 32px 0, 14px/500/20px
 *     .blog7_border    2px solid #232323, full-bleed (1440px inside a 1232 container)
 *     .blog7_list      grid 400px x3, gap 40px 16px
 *     card             400x446 — image 400x267 radius 16, content pad 16px 0 16px 4px
 *     card h3          .heading-style-h5 → 20px/500/22px
 *     tagline          12px/500/16.8px/2.4px, colour #0b4fff (blue)
 *     author/date      14px/500/19.6px (.text-size-small)
 *     hover bg         rgba(35,35,35,.05), radius 16, inset -4px (408x454 vs 400x446)
 *     pagination       "Load more", padding 13px 24px, radius 10px,
 *                      1px solid rgba(35,35,35,.1), colour rgba(35,35,35,.7)
 *
 * Responsive (measured):
 *   991px  list → 2 cols, gap 32px 16px; featured → 1 col, gap 32px
 *   767px  list → 1 col, gap 48px 16px; .blog7_component padding 48px 0
 *   390px  list → 1 col, gap 16px
 *
 * Post titles / dates / categories / author are Auxia's own listing content.
 * Thumbnails are Auxia's own imagery, downloaded to /assets/img/.
 */

const CATEGORIES = ['All', 'NEWS', 'INSIGHTS', 'PLATFORM', 'TIPS', 'CASE STUDIES']

const FEATURED = {
  category: 'PLATFORM',
  title: 'The Age of the Supermarketer: Introducing Auxia Agent Studio',
  author: 'Sandeep Menon',
  date: 'July 23, 2026',
  readTime: '5 min',
  img: '/assets/img/blog-agent-studio.png',
  href: '/blog/the-age-of-the-supermarketer-introducing-auxia-agent-studio',
}

const POSTS = [
  {
    category: 'PLATFORM',
    title: "The CMO's Guide to the Changing Marketing Stack",
    author: 'Sandeep Menon',
    date: 'July 14, 2026',
    readTime: '10 min',
    img: '/assets/img/blog-cmo-guide.png',
    href: '/blog/the-cmos-guide-to-the-changing-marketing-stack',
  },
  {
    category: 'PLATFORM',
    title: 'The 10x Marketer: Why Agents, Not Tools, Are the Next Unlock in Marketing',
    author: 'Sandeep Menon',
    date: 'July 9, 2026',
    readTime: '8 min',
    img: '/assets/img/blog-10x-marketer.png',
    href: '/blog/the-10x-marketer-why-agents-not-tools-are-the-next-unlock-in-marketing',
  },
  {
    category: 'NEWS',
    title: '100 Billion Decisions And Counting',
    author: 'Sandeep Menon',
    date: 'March 10, 2026',
    readTime: '6 min',
    img: '/assets/img/blog-100-billion.jpg',
    href: '/blog/100-billion-decisions-and-counting',
  },
  {
    category: 'INSIGHTS',
    title: 'Integrating AI Agents Across 5 Key Marketing Functions',
    author: 'Sandeep Menon',
    date: 'August 21, 2025',
    readTime: '15 min',
    img: '/assets/img/blog-integrating-agents.avif',
    href: '/blog/integrating-ai-agents-across-5-key-marketing-functions',
  },
  {
    category: 'INSIGHTS',
    title: 'AI Agents in Marketing Workflows: From Co-Pilots to Autonomous Campaigns',
    author: 'Sandeep Menon',
    date: 'August 20, 2025',
    readTime: '10 min',
    img: '/assets/img/blog-agents-workflows.avif',
    href: '/blog/ai-agents-in-marketing-workflows-part-1',
  },
  {
    category: 'INSIGHTS',
    title: 'The Great Marketing Stack Consolidation: Why Point Solutions Are Dead',
    author: 'Sandeep Menon',
    date: 'August 4, 2025',
    readTime: '7 min',
    img: '/assets/img/blog-stack-consolidation.avif',
    href: '/blog/the-great-marketing-stack-consolidation',
  },
]

/* .blog7_author-wrapper — "by {name}" over "{date} • {read}".
   Both rows are .text-size-small: 14px/500/19.6px. The "•" divider carries
   8px horizontal margin. */
function AuthorMeta({ author, date, readTime }) {
  return (
    <div className="blog7_author-wrapper flex">
      <div className="blog7_author-text">
        <div className="blog7_author flex">
          <div className="text-sm leading-[1.4]">by</div>
          <div className="blog7_word-spacer w-1" />
          <div className="text-sm leading-[1.4]">{author}</div>
        </div>
        <div className="blog7_date-wrapper flex">
          <div className="text-sm leading-[1.4]">{date}</div>
          <div className="blog7_text-divider mx-2">•</div>
          <div className="text-sm leading-[1.4]">{readTime}</div>
        </div>
      </div>
    </div>
  )
}

export default function Blog() {
  const [active, setActive] = useState('All')
  const [query, setQuery] = useState('')

  const visible = useMemo(
    () =>
      POSTS.filter(
        (p) =>
          (active === 'All' || p.category === active) &&
          (query.trim() === '' ||
            p.title.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [active, query],
  )

  // The motion layer (useMotion) builds its ScrollTriggers once per route, so
  // it never sees cards that mount later when the filter or search changes.
  // React reuses the old DOM nodes, which still carry GSAP's from-state
  // (opacity 0, translateY(20px)) from the initial reveal — so a freshly
  // filtered set renders completely invisible even though it is on screen.
  // Clear that state directly whenever the visible set changes; these cards
  // are already in view, so there is nothing left to scroll-reveal.
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return          // the initial set is owned by useMotion's ScrollTriggers
    }
    document.querySelectorAll('.blog7_item.reveal').forEach((el) => {
      el.classList.add('is-in')
      el.style.opacity = ''
      el.style.transform = ''
    })
  }, [visible])

  return (
    <>
      {/* ---------- Featured ---------- */}
      <section className="section_blog7 bg-paper pt-[4.5rem]">
        <div className="padding-global">
          <div className="container-large">
            <div className="blog7_component py-12 md:pb-16 md:pt-20">
              <div className="blog7_featured-list-wrapper">
                <div className="blog7_featured-list">
                  <div className="blog7_featured-item reveal">
                    <a
                      href={FEATURED.href}
                      className="blog7_featured-item-link group grid max-w-full grid-cols-[minmax(0,1fr)] gap-8 min-[992px]:grid-cols-[minmax(0,540px)_minmax(0,676px)] min-[992px]:gap-4"
                    >
                      <div className="blog7_featured-item-content flex flex-col justify-between">
                        <div className="blog7_item-content-top max-w-[80%]">
                          <div className="mb-1">
                            <div className="text-style-tagline inline-block font-mono text-xs uppercase leading-[1.4] tracking-normal text-blue">
                              {FEATURED.category}
                            </div>
                          </div>
                          <div className="mb-2">
                            <h3 className="text-2xl leading-[.95] tracking-[-.03em] transition-opacity duration-200
                                                group-hover:opacity-70 min-[768px]:text-[3rem] min-[992px]:text-h4">
                              {FEATURED.title}
                            </h3>
                          </div>
                        </div>
                        <div className="mt-4">
                          <AuthorMeta {...FEATURED} />
                        </div>
                      </div>

                      <div className="blog7_featured-image-wrapper overflow-hidden rounded-2xl bg-oat">
                        <img
                          src={FEATURED.img}
                          alt=""
                          width="676"
                          height="451"
                          className="blog7_featured-image h-full w-full object-cover"
                        />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Filters + card grid ---------- */}
      {/* bg #fefdf5 — a paper tint that exists only on this section, so it is
          declared here rather than added as a global token. */}
      <section className="section_blog-list bg-[#fefdf5]">
        <div className="padding-global">
          <div className="container-large">
            <div className="blog7_content">
              <div className="blog7_filters flex">
                <div className="blog7_filters-form w-full">
                  <form
                    className="blog7_filters-form-wrap flex flex-wrap items-stretch justify-between gap-y-2"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div className="blog7_filters-radio flex flex-wrap">
                      {CATEGORIES.map((cat) => (
                        <label
                          key={cat}
                          className="blog7_radio group relative cursor-pointer px-4 py-6 md:py-8"
                        >
                          <input
                            type="radio"
                            name="blog-category"
                            value={cat}
                            checked={active === cat}
                            onChange={() => setActive(cat)}
                            className="sr-only"
                          />
                          <span
                            className={`blog7_label block font-mono text-[.8125rem] font-normal uppercase leading-[1.4]
                                        tracking-[.06em] transition-opacity duration-200 ${
                              active === cat
                                ? 'text-ink opacity-100'
                                : 'text-ink opacity-60 group-hover:opacity-100'
                            }`}
                          >
                            {cat}
                          </span>
                          {/* active underline — the original marks the checked
                              radio; reproduced here as a 2px rule on the ink. */}
                          <span
                            aria-hidden="true"
                            className={`absolute inset-x-4 bottom-0 h-0.5 bg-blue transition-opacity duration-200 ${
                              active === cat ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        </label>
                      ))}
                    </div>

                    <div className="blog7_search-wrap flex w-full items-center gap-2 border-b border-ink/20 md:w-80">
                      <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search"
                        aria-label="Search posts"
                        className="blog7_search w-full bg-transparent py-6 text-sm leading-[1.43] text-ink outline-none placeholder:text-ink/60 md:py-8 [&::-webkit-search-cancel-button]:appearance-none"
                      />
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        className="flex-none text-ink/70"
                      >
                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                        <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </form>
                </div>
              </div>

              {/* Full-bleed 2px rule: the original renders it 1440px wide inside
                  a 1232px container by escaping the padding-global gutters. */}
              <div className="blog7_border relative left-1/2 h-0.5 w-screen -translate-x-1/2 bg-ink" />

              <div className="blog7_list-wrapper pb-24 pt-10 md:pb-32 md:pt-16">
                {visible.length === 0 ? (
                  <p className="py-16 text-center text-lg text-ink/70">
                    No posts match that filter.
                  </p>
                ) : (
                  <div className="blog7_list grid gap-4 gap-y-4 min-[768px]:gap-y-8 min-[768px]:grid-cols-2 min-[992px]:grid-cols-3 min-[992px]:gap-y-10">
                    {visible.map((post, i) => (
                      <div
                        key={post.href}
                        className="blog7_item reveal relative"
                        data-reveal-delay={(i % 3) * 100}
                      >
                        {/* hover ground: 4px bleed on every side, radius 16 */}
                        <div
                          aria-hidden="true"
                          className="blog7_hover-bg pointer-events-none absolute -inset-1 rounded-2xl bg-ink/5 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100"
                        />
                        <a
                          href={post.href}
                          className="blog7_item-link group/card relative block max-w-full"
                        >
                          <div className="blog7_image-wrapper aspect-[400/267] overflow-hidden rounded-2xl bg-oat">
                            <img
                              src={post.img}
                              alt=""
                              width="400"
                              height="267"
                              loading="lazy"
                              className="blog7_image h-full w-full object-cover"
                            />
                          </div>
                          <div className="blog7_item-content py-4 pl-1">
                            <div className="blog7_item-content-top max-w-[80%]">
                              <div className="mb-1">
                                <div className="text-style-tagline inline-block font-mono text-xs uppercase leading-[1.4] tracking-normal text-blue">
                                  {post.category}
                                </div>
                              </div>
                              <div className="mb-1">
                                <h3 className="text-xl leading-[1.1]">{post.title}</h3>
                              </div>
                            </div>
                            <div className="mt-4">
                              <AuthorMeta {...post} />
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination: the original is a Webflow CMS "Load more".
                    There is no second page of data in this build, so the
                    control renders in its real visual state but is disabled. */}
                <div className="pagination mt-16 flex justify-center">
                  <button
                    type="button"
                    disabled
                    className="blog7_pagination rounded-[10px] border border-ink/10 px-6 py-[13px] text-base leading-[1.3] text-ink/70 transition-colors duration-200 hover:border-ink/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Load more
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The original /blog closes with .section_cta (562px, blue, one canvas)
          — the same CTA the product pages use. Its absence left the clone's
          body 516px shorter than the original's 3333px. */}
      <CTA />
    </>
  )
}
