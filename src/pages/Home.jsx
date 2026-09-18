import Hero from '../components/Hero'
import Brands from '../components/Brands'
import Marketing from '../components/Marketing'
import Stack from '../components/Stack'
import Process from '../components/Process'
import Automations from '../components/Automations'
import CaseStudies from '../components/CaseStudies'
import Trusted from '../components/Trusted'
import CTA from '../components/CTA'

/** Homepage section composition — moved verbatim out of App.jsx when the
 *  router was introduced. Banner/Navbar/Footer are shared chrome and now live
 *  in App.jsx around <Routes>. */
export default function Home() {
  return (
    <main>
      <Hero />
      <Brands />
      <Marketing />
      <Stack />
      <Process />
      <Automations />
      <CaseStudies />
      <Trusted />
      <CTA />
    </main>
  )
}
