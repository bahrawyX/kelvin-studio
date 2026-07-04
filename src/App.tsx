import { useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from './hooks/useLenis'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import WorkRail from './components/WorkRail'
import Services from './components/Services'
import ClientBand from './components/ClientBand'
import Footer from './components/Footer'

export default function App() {
  const [intro, setIntro] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useLenis()

  return (
    <>
      {/* film grain above everything */}
      <div className="grain pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" />

      <Cursor />

      {!loaded && (
        <Preloader
          onIntro={() => setIntro(true)}
          onDone={() => {
            setLoaded(true)
            ScrollTrigger.refresh()
          }}
        />
      )}

      <Nav />

      <main className="relative z-10">
        <Hero intro={intro} />
        <Manifesto />
        <WorkRail />
        <Services />
        <ClientBand />
      </main>

      <Footer />
    </>
  )
}
