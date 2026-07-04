import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { useClock } from '../hooks/useClock'
import { useMedia } from '../hooks/useMedia'
import FadeIn from './FadeIn'

gsap.registerPlugin(ScrollTrigger)

const SOCIALS = ['INSTAGRAM', 'TWITTER', 'LINKEDIN']

export default function Footer() {
  const time = useClock()
  const fine = useMedia('(pointer: fine)')
  const rootRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const ctaLabelRef = useRef<HTMLSpanElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)

  // giant wordmark letter reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-letter]',
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 1,
            ease: 'expo.out', // --ease-out-expo
            stagger: 0.04,
            scrollTrigger: {
              trigger: '[data-wordmark]',
              start: 'top 85%',
              once: true,
            },
          },
        )
      })
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-letter]', { yPercent: 0 })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // magnetic CTA
  useEffect(() => {
    if (!fine || !ctaRef.current) return
    const cta = ctaRef.current
    const label = ctaLabelRef.current!

    const onMove = (e: MouseEvent) => {
      const rect = cta.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist < 120) {
        const clamp = gsap.utils.clamp(-12, 12)
        gsap.to(cta, { x: clamp(dx * 0.35), y: clamp(dy * 0.35), duration: 0.4, ease: 'expo.out' })
        gsap.to(label, { x: clamp(dx * 0.15), y: clamp(dy * 0.15), duration: 0.4, ease: 'expo.out' })
      } else {
        gsap.to([cta, label], { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' })
      }
    }

    const onEnter = (e: MouseEvent) => {
      // accent use #5: kelvin fill sweeps in from the entry point
      const rect = cta.getBoundingClientRect()
      const fill = fillRef.current!
      gsap.set(fill, {
        left: e.clientX - rect.left,
        top: e.clientY - rect.top,
        xPercent: -50,
        yPercent: -50,
        scale: 0,
      })
      gsap.to(fill, { scale: 1, duration: 0.5, ease: 'expo.out' })
      gsap.to(label, { color: 'var(--ink)', duration: 0.3 })
    }
    const onLeave = () => {
      gsap.to(fillRef.current, { scale: 0, duration: 0.5, ease: 'expo.out' })
      gsap.to(ctaLabelRef.current, { color: 'var(--bone)', duration: 0.3 })
      gsap.to([cta, label], { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' })
    }

    window.addEventListener('mousemove', onMove)
    cta.addEventListener('mouseenter', onEnter)
    cta.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cta.removeEventListener('mouseenter', onEnter)
      cta.removeEventListener('mouseleave', onLeave)
    }
  }, [fine])

  return (
    <footer
      id="contact"
      ref={rootRef}
      className="flex min-h-[92svh] flex-col justify-between overflow-hidden pt-28"
    >
      <div className="px-6 sm:px-10">
        <FadeIn>
          <span className="type-mono text-[11px] text-bone-dim sm:text-[12px]">04 / CONTACT</span>
          <h2 className="type-display mt-6 max-w-[24ch] text-[clamp(2rem,5vw,4rem)] leading-[1.02] text-bone">
            HAVE A PRODUCT THAT DESERVES{' '}
            <em className="type-serif text-[1.06em]">better</em>?
          </h2>
        </FadeIn>

        <a
          ref={ctaRef}
          href="mailto:hello@kelvin.studio"
          className="relative mt-10 inline-flex min-h-[44px] items-center gap-2 overflow-hidden rounded-full border border-bone px-8 py-4"
        >
          <span
            ref={fillRef}
            className="absolute h-[400px] w-[400px] scale-0 rounded-full bg-kelvin"
            aria-hidden="true"
          />
          <span ref={ctaLabelRef} className="type-mono relative z-10 flex items-center gap-2 text-[12px] text-bone">
            START A PROJECT
            <ArrowUpRight size={14} />
          </span>
        </a>
      </div>

      <FadeIn delay={0.15} className="mt-24 grid gap-10 px-6 sm:grid-cols-3 sm:px-10">
        <div className="type-mono flex flex-col gap-2 text-[11px] text-bone-dim">
          <a href="mailto:hello@kelvin.studio" className="underline-link w-fit text-bone">
            hello@kelvin.studio
          </a>
          <span>+20 100 000 0000</span>
        </div>
        <div className="type-mono flex flex-col gap-2 text-[11px]">
          {SOCIALS.map((social) => (
            <a key={social} href="#" className="underline-link w-fit text-bone-dim">
              {social} ↗
            </a>
          ))}
        </div>
        <div className="type-mono flex flex-col gap-2 text-[11px] text-bone-dim">
          <span>CAIRO — {time}</span>
          <span>© 2026 KELVIN STUDIO</span>
        </div>
      </FadeIn>

      <div data-wordmark className="mt-16 w-full translate-y-[8%]" aria-label="Kelvin">
        <div className="wordmark-stretch type-condensed w-full text-center text-[clamp(4rem,21vw,19rem)] leading-[0.85] text-bone">
          {'KELVIN®'.split('').map((letter, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <span data-letter className="inline-block">
                {letter}
              </span>
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
