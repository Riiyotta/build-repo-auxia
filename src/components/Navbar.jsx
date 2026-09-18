import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// Measured on the original's navbar. On the original, Platform and
// Documentation point at the platform/docs apps; this clone is
// self-contained and ships NO outbound links to live Auxia properties, so
// they resolve to '#' and are marked aria-disabled.
const LINKS = [
  { label: 'About', href: '/about-us', internal: true },
  { label: 'Documentation', href: '#', disabled: true },
  { label: 'Blog', href: '/blog', internal: true },
]

const PRODUCTS = [
  { label: 'Agent Studio', href: '/agent-studio', internal: true },
  { label: 'Decisioning', href: '/decisioning', internal: true },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Measured on the original: .navbar1_component is position:relative with a
  // constant 72px height. It scrolls away with the page — it never sticks,
  // never hides/reveals, and its background/height/border never change.
  return (
    <header className="relative z-50 bg-paper">
      <nav className="navbar1_container mx-auto flex h-16 max-w-nav items-center justify-between px-5 min-[768px]:px-10 min-[992px]:h-[4.5rem]">
        <Link to="/" className="flex items-center" aria-label="Auxia home">
          <img src="/assets/icons/logo.svg" alt="Auxia" className="h-8 w-auto md:h-10" />
        </Link>

        {/* Desktop nav — order measured on the original: About (x736),
            Documentation (x813), Blog (x954), Products (x1036). "Platform"
            exists in the original's DOM but ships display:none (class "hide"),
            so it is not rendered here either. Webflow's breakpoint is 992. */}
        <div className="navbar1_menu hidden items-center gap-4 min-[992px]:flex">
          <div className="navbar1_menu-links flex items-center gap-1">
          {LINKS.map((l) =>
            l.internal
              ? <Link key={l.label} to={l.href} className="nav-link">{l.label}</Link>
              : <a key={l.label} href={l.href} className="nav-link"
                   aria-disabled={l.disabled || undefined}>{l.label}</a>
          )}
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button className="nav-link flex items-center gap-1.5" aria-expanded={productsOpen}>
              Products
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"
                   className={`transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`}>
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            {/* Original (Webflow dropdown): data-duration="400", data-easing="ease",
                transform translate3d(0, 3rem, 0) + opacity 0 -> translate3d(0,0,0) + opacity 1.
                Items themselves only transition background-color 0.2s — no stagger. */}
            <div className={`absolute left-0 top-full w-56 pt-2 transition-[opacity,transform] duration-[400ms] ease-[ease] ${
                   productsOpen ? 'pointer-events-auto translate-y-0 opacity-100'
                                : 'pointer-events-none translate-y-12 opacity-0'}`}>
              <div className="overflow-hidden rounded-btn border border-oat bg-paper p-1 shadow-lg">
                  {PRODUCTS.map((p) => (
                    <Link key={p.label} to={p.href}
                       className="block rounded px-3 py-2 text-ink/80 transition-colors duration-200 hover:bg-blue hover:text-paper">
                      {p.label}
                    </Link>
                  ))}
              </div>
            </div>
          </div>

          </div>

          <Link to="/demo" className="btn-primary btn-small">Request a demo</Link>
          {/* The original shows ONLY 日本語 here: its ENG anchor carries
              w--current and computes to display:none, so a two-way toggle was
              never on the page. The /ja locale is not built in this clone, so
              this is inert rather than a dead outbound link. */}
          <div className="navbar1_locales flex items-center pl-4">
            <span className="navbar1_local-link text-base leading-[1.3] text-ink/50">日本語</span>
          </div>
        </div>

        {/* Mobile toggle */}
        <button className="flex h-10 w-10 items-center justify-center min-[992px]:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          <div className="flex w-6 flex-col gap-1.5">
            <span className={`h-0.5 w-full bg-ink transition-transform duration-300 ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-0.5 w-full bg-ink transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-full bg-ink transition-transform duration-300 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile drawer — original: Webflow nav menu, inline
          `transition: all, transform 400ms`, slides from translateY(-100%) to 0
          while page scroll is locked. */}
      <div className={`absolute left-0 right-0 top-full overflow-hidden border-t border-oat-dark bg-paper transition-transform duration-[400ms] ease-[ease] min-[992px]:hidden ${
             open ? 'translate-y-0' : 'pointer-events-none -translate-y-full'}`}
           aria-hidden={!open}>
          <div className="flex flex-col gap-1 px-5 py-6">
            {[...PRODUCTS, ...LINKS].map((l) =>
              l.internal
                ? <Link key={l.label} to={l.href} onClick={() => setOpen(false)}
                        className="border-b border-oat/50 py-3 text-lg">{l.label}</Link>
                : <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                     className="border-b border-oat/50 py-3 text-lg">{l.label}</a>
            )}
            <Link to="/demo" onClick={() => setOpen(false)} className="btn-primary mt-4 w-full !px-5 !py-3 !text-lg">Request a demo</Link>
          </div>
      </div>
    </header>
  )
}
