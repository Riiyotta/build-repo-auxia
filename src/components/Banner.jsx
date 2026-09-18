/**
 * Announcement bar.
 * The original (.banner10_component) is an explicit 40px tall with zero
 * vertical padding — the link's 20.8px line is centred inside it. Using
 * padding to reach the height lands at 37px, so the height is set directly.
 */
export default function Banner() {
  return (
    <section className="banner10_component h-10 bg-blue text-paper">
      <div className="padding-global h-full">
        <div className="container-large flex h-full items-center justify-center">
          <a href="#" className="group flex items-center gap-2 text-xs font-bold leading-[1.3] md:text-base">
            Auxia Launches Agent Studio
            <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  )
}
