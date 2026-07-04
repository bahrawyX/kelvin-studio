import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { FilmGrain, Godrays, Shader, Smoke, Vignette } from 'shaders/react'
import Marquee from './Marquee'
import FadeIn from './FadeIn'

export default function Hero({ intro }: { intro: boolean }) {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!intro) return
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // fan-open line reveal, overlapping the preloader curtain
        gsap.fromTo(
          '[data-hero-line]',
          { yPercent: 110, rotate: 2, transformOrigin: 'left bottom' },
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.2,
            ease: 'expo.out', // --ease-out-expo
            stagger: 0.09,
          },
        )
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-hero-line]', { yPercent: 0, rotate: 0 })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [intro])

  return (
    <section ref={rootRef} className="relative flex h-[100svh] flex-col">
      {/* atmosphere: animated shader backdrop, warm darkroom tones */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <Shader style={{ width: '100%', height: '100%' }}>
          {/* amber smoke curling up from the bottom of the darkroom — stirred by the cursor */}
          <Smoke
            colorA="#c98a45"
            colorB="#2e2115"
            emitFrom={{ x: 0.5, y: 1 }}
            direction={0}
            speed={16}
            spread={70}
            emitRadius={0.2}
            intensity={0.85}
            dissipation={0.22}
            detail={28}
            gravity={0.35}
            mouseInfluence={0.35}
            mouseRadius={0.16}
          />
          {/* one hard light source raking down from the top corner */}
          <Godrays
            center={{ x: 0.15, y: 0 }}
            density={0.35}
            intensity={0.45}
            spotty={1.2}
            speed={0.35}
            rayColor="#d8a253"
            backgroundColor="transparent"
          />
          <Vignette color="#0e0d0b" radius={0.62} falloff={0.55} intensity={0.9} />
          <FilmGrain strength={0.06} />
        </Shader>
        {/* light meter center mark */}
        <div className="absolute left-1/2 top-0 hidden h-full w-px bg-hairline sm:block" />
      </div>

      {/* meta row */}
      <FadeIn delay={0.9} className="z-10">
        <div className="flex justify-between px-6 pt-28 sm:px-10 sm:pt-32">
          <span className="type-mono text-[11px] text-bone-dim sm:text-[12px]">
            CREATIVE ENGINEERING STUDIO
          </span>
          <span className="type-mono hidden text-[11px] text-bone-dim sm:block sm:text-[12px]">
            30.0444&deg; N, 31.2357&deg; E
          </span>
        </div>
      </FadeIn>

      {/* headline pinned to bottom */}
      <div className="z-10 flex flex-1 flex-col justify-end px-6 pb-6 sm:px-10">
        <h1 className="type-display text-[clamp(2.6rem,8.5vw,7.5rem)] leading-[0.98] tracking-[-0.02em] text-bone">
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              WE BUILD DIGITAL
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              PRODUCTS WITH <em className="type-serif text-[1.06em] text-bone">unreasonable</em>
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              ATTENTION TO CRAFT.
            </span>
          </span>
        </h1>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-20 right-6 z-10 flex flex-col items-center gap-2 sm:right-10" aria-hidden="true">
        <span className="type-mono text-[10px] text-bone-dim">SCROLL</span>
        <span className="cue-line block h-6 w-px bg-bone-dim" />
      </div>

      {/* marquee at hero bottom edge */}
      <Marquee />
    </section>
  )
}
