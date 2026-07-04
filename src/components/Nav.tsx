import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from '../hooks/useLenis'
import { useClock } from '../hooks/useClock'

gsap.registerPlugin(ScrollTrigger)

const LINKS = [
  { num: '01', word: 'WORK', target: '#work' },
  { num: '02', word: 'STUDIO', target: '#studio' },
  { num: '03', word: 'SERVICES', target: '#services' },
  { num: '04', word: 'CONTACT', target: '#contact' },
]

export default function Nav() {
  const time = useClock()
  const navRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const yTo = gsap.quickTo(navRef.current, 'yPercent', {
          duration: 0.5,
          ease: 'expo.out', // --ease-out-expo
        })

        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            setScrolled(self.scroll() > 80)
            if (self.direction === 1 && self.scroll() > 120) yTo(-100)
            else yTo(0)
          },
        })
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => setScrolled(self.scroll() > 80),
        })
      })
    }, navRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!overlayRef.current) return
    const links = overlayRef.current.querySelectorAll('[data-overlay-link]')
    if (menuOpen) {
      gsap.to(overlayRef.current, {
        clipPath: 'inset(0% 0 0% 0)',
        duration: 0.7,
        ease: 'power3.inOut', // --ease-inout-soft
      })
      gsap.fromTo(
        links,
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07, delay: 0.3 },
      )
    } else {
      gsap.to(overlayRef.current, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.7,
        ease: 'power3.inOut',
      })
    }
  }, [menuOpen])

  const scrollTo = (target: string) => {
    setMenuOpen(false)
    getLenis()?.scrollTo(target, { offset: -72 })
  }

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 z-40 flex h-[72px] w-full items-center justify-between px-6 transition-colors duration-300 sm:px-10 ${
          scrolled
            ? 'border-b border-hairline bg-ink/70 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <a href="#" className="type-condensed text-[16px] text-bone" onClick={(e) => { e.preventDefault(); getLenis()?.scrollTo(0) }}>
          KELVIN&reg;
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <button
              key={link.num}
              onClick={() => scrollTo(link.target)}
              className="nav-link type-mono flex gap-1.5 text-[11px]"
            >
              <span className="nav-num text-bone-dim">{link.num}</span>
              <span className="nav-word text-bone-dim">{link.word}</span>
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <span className="type-mono text-[11px] tabular-nums text-bone-dim">
            CAI {time} GMT+2
          </span>
          <span className="flex items-center gap-2">
            {/* accent use #4: availability pulse */}
            <span className="kelvin-pulse h-[6px] w-[6px] rounded-full" />
            <span className="type-mono text-[11px] text-bone-dim">AVAILABLE Q3</span>
          </span>
        </div>

        <button
          onClick={() => setMenuOpen(true)}
          className="type-mono flex min-h-[44px] items-center text-[11px] text-bone md:hidden"
        >
          MENU
        </button>
      </header>

      {/* Mobile overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-50 flex flex-col justify-between bg-ink p-6 md:hidden ${
          menuOpen ? '' : 'pointer-events-none'
        }`}
        style={{ clipPath: 'inset(0 0 100% 0)' }}
      >
        <div className="flex items-center justify-between">
          <span className="type-condensed text-[16px] text-bone">KELVIN&reg;</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="type-mono flex min-h-[44px] items-center text-[11px] text-bone-dim"
          >
            CLOSE
          </button>
        </div>
        <div className="flex flex-col gap-3 pb-10">
          {LINKS.map((link) => (
            <span key={link.num} className="block overflow-hidden">
              <button
                data-overlay-link
                onClick={() => scrollTo(link.target)}
                className="type-display block text-[clamp(2.5rem,12vw,4rem)] leading-[1.05] text-bone"
              >
                {link.word}
              </button>
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
