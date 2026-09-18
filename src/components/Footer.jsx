import { Link } from 'react-router-dom'

/**
 * Footer.
 * Measured on the live original: blue ground, .footer_content padding
 * 0 top / 64px bottom with a 128px gap (48px at <768). The bottom row is a
 * 2-column grid (608px / 608px, gap 16px); the right cell is itself a 3-column
 * grid of 192px link columns. Headings are 12px/500/16.8px, links 20px/500/26px.
 * The oversized wordmark above it is the original's .footer_logo SVG.
 */
// Measured on the original's footer. `internal` marks react-router routes.
// This clone is self-contained: the original's outbound links (LinkedIn,
// the platform/docs apps) and its mailto are NOT shipped — they
// resolve to '#' so nothing here reaches a live Auxia property.
const COLUMNS = [
  { heading: 'company', links: [
      ['About', '/about-us', true],
      ['Linkedin', '#'],
  ] },
  { heading: 'product', links: [
      ['Platform', '#'],
      ['Documentation', '#'],
  ] },
  { heading: 'resources', links: [
      ['Blog', '/blog', true],
      ['info@example.com', '#'],
  ] },
]

export default function Footer() {
  return (
    <footer className="footer_component relative overflow-hidden bg-blue text-paper">
      <div className="padding-global">
        <div className="footer_content container-large flex flex-col gap-12 pb-16 md:gap-32">

          {/* Oversized wordmark — the original renders the logotype at container width */}
          <div className="footer_logo-wrap w-full" aria-hidden="true">
            <img src="/assets/icons/logo.svg" alt=""
                 className="w-full brightness-0 invert" />
          </div>

          <div className="footer_bottom grid gap-4 md:grid-cols-2">
            <div className="footer_legal flex flex-col gap-2">
              <div className="footer_legal-text font-mono text-xs uppercase leading-[1.3] opacity-80">
                &copy; 2026 Auxia. All Rights reserved.
              </div>
              <div className="footer_legal-links flex items-center gap-4">
                <Link to="/terms" className="footer_legal-link text-base leading-[1.3] text-paper hover:opacity-70">Terms</Link>
                <div className="footer_dot h-1 w-1 bg-white/50" />
                <Link to="/privacy-policy" className="footer_legal-link text-base leading-[1.3] text-paper hover:opacity-70">Privacy</Link>
              </div>
            </div>

            <div className="footer_right grid grid-cols-3 gap-4">
              {COLUMNS.map((col) => (
                <div key={col.heading} className="footer_column flex flex-col gap-4">
                  <div className="footer_h font-mono text-xs uppercase leading-[1.4] opacity-70">
                    {col.heading}
                  </div>
                  {col.links.map(([label, href, internal]) =>
                    internal
                      ? <Link key={label} to={href}
                              className="footer_link text-xl leading-[1.3] text-paper transition-opacity duration-200 hover:opacity-70">
                          {label}
                        </Link>
                      : <a key={label} href={href}
                           className="footer_link text-xl leading-[1.3] text-paper transition-opacity duration-200 hover:opacity-70">
                          {label}
                        </a>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
