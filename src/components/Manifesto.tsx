import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeader from './SectionHeader'
import FadeIn from './FadeIn'

gsap.registerPlugin(ScrollTrigger)

const TEXT =
  'Kelvin is a small team of designers and engineers who believe the gap between a good product and a great one is measured in details nobody asked for. We take on six projects a year. We say no a lot. What we ship, we stand behind for the life of the product.'

const SERIF_WORDS = new Set(['great', 'details'])

const STATS = [
  { value: 7, label: 'YEARS OPERATING', tag: '/ EST. 2019' },
  { value: 41, label: 'PRODUCTS SHIPPED', tag: '/ AND COUNTING' },
  { value: 12, label: 'DESIGN AWARDS', tag: '/ WORLDWIDE' },
]

export default function Manifesto() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // reading pace = scroll pace
        gsap.fromTo(
          '[data-word]',
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.02,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-manifesto]',
              start: 'top 75%',
              end: 'bottom 45%',
              scrub: true,
            },
          },
        )

        // giant watermark drifts slower than the page (parallax) while the section scrolls
        gsap.fromTo(
          '[data-watermark]',
          { y: -60 },
          {
            y: 120,
            ease: 'none',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )

        // the ✺ glyph rotates a full turn across the section
        gsap.fromTo(
          '[data-glyph]',
          { rotate: 0 },
          {
            rotate: 360,
            ease: 'none',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )

        // stat blocks drift in at offset rates — the grid feels layered, not flat
        gsap.utils.toArray<HTMLElement>('[data-stat-block]').forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: 40 + i * 28 },
            {
              y: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: '[data-stats]',
                start: 'top bottom',
                end: 'top 40%',
                scrub: true,
              },
            },
          )
        })

        // stat count-up, once
        const numbers = gsap.utils.toArray<HTMLElement>('[data-stat]')
        ScrollTrigger.create({
          trigger: '[data-stats]',
          start: 'top 85%',
          once: true,
          onEnter: () => {
            numbers.forEach((el, i) => {
              const target = Number(el.dataset.stat)
              const obj = { v: 0 }
              gsap.to(obj, {
                v: target,
                duration: 2.2,
                delay: i * 0.2,
                ease: 'power2.inOut',
                onUpdate: () => {
                  el.textContent = String(Math.floor(obj.v)).padStart(2, '0')
                },
              })
            })
          },
        })
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-word]', { opacity: 1 })
        gsap.utils.toArray<HTMLElement>('[data-stat]').forEach((el) => {
          el.textContent = String(Number(el.dataset.stat)).padStart(2, '0')
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="studio"
      ref={rootRef}
      className="relative mx-auto max-w-[1440px] overflow-hidden px-6 py-28 sm:px-10 sm:py-40"
    >
      {/* giant outlined section number, parallax-drifting behind the content */}
      <span
        data-watermark
        aria-hidden="true"
        className="type-display pointer-events-none absolute -right-4 top-10 select-none text-[clamp(10rem,26vw,24rem)] leading-none text-transparent sm:right-4"
        style={{ WebkitTextStroke: '1px rgba(142,135,121,0.22)' }}
      >
        02
      </span>

      <div className="relative">
        <SectionHeader index="02" label="STUDIO" />

        <div className="flex items-start gap-5">
          <span
            data-glyph
            aria-hidden="true"
            className="mt-2 hidden shrink-0 text-[22px] leading-none text-bone-dim sm:block"
          >
            ✺
          </span>
          <p
            data-manifesto
            className="max-w-[52rem] text-[clamp(1.4rem,3.2vw,2.6rem)] leading-[1.25] text-bone"
          >
            {TEXT.split(' ').map((word, i) => {
              const clean = word.replace(/[.,]/g, '')
              const serif = SERIF_WORDS.has(clean)
              return (
                <span key={i} data-word className={serif ? 'type-serif' : undefined}>
                  {word}{' '}
                </span>
              )
            })}
          </p>
        </div>

        <div
          data-stats
          className="mt-16 grid gap-y-10 border-t border-hairline pt-10 sm:grid-cols-3 sm:gap-y-0"
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              data-stat-block
              className={`group px-1 py-4 transition-colors duration-300 hover:bg-ink-2 sm:px-8 sm:py-6 ${
                i > 0 ? 'sm:border-l sm:border-hairline' : 'sm:pl-0'
              }`}
            >
              <FadeIn delay={i * 0.1}>
                <span className="type-mono block text-[10px] text-bone-dim/60">
                  {stat.tag}
                </span>
                <span
                  data-stat={stat.value}
                  className="type-display mt-3 block text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
                >
                  00
                </span>
                <span className="type-mono mt-2 block text-[11px] text-bone-dim sm:text-[12px]">
                  {stat.label}
                </span>
              </FadeIn>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
