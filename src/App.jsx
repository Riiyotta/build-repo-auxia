import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useMotion } from './hooks/useMotion'
import { useHeroIntro } from './hooks/useHeroIntro'
import Banner from './components/Banner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import AgentStudio from './pages/AgentStudio'
import Decisioning from './pages/Decisioning'
import AboutUs from './pages/AboutUs'
import Blog from './pages/Blog'
import Demo from './pages/Demo'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'

/** Verified on the original: Navbar and Footer are byte-identical shared chrome
 *  on /, /agent-studio, /decisioning and /about-us, so they render once here
 *  around <Routes> rather than per page. */

function NotFound() {
  return (
    <main className="padding-global section-pad">
      <div className="container-large flex flex-col gap-6">
        <h1>Page not found</h1>
        <p className="text-xl leading-[1.3] text-ink/70">
          The page you're looking for doesn't exist or has moved.
        </p>
        <a href="/" className="btn-primary self-start">Back to home</a>
      </div>
    </main>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Shell() {
  return (
    <>
      <ScrollToTop />
      <Banner />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agent-studio" element={<AgentStudio />} />
        <Route path="/decisioning" element={<Decisioning />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

/** useMotion/useHeroIntro take no arguments and bind to whatever is in the DOM
 *  at mount (they are owned by another agent, so their signature is left as-is).
 *  Keying this wrapper on pathname remounts it per route, which re-runs both
 *  hooks against the newly rendered page. */
function MotionScope({ children }) {
  useMotion()
  useHeroIntro()
  return children
}

function Routed() {
  const { pathname } = useLocation()
  return <MotionScope key={pathname}><Shell /></MotionScope>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routed />
    </BrowserRouter>
  )
}
