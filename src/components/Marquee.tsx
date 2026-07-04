import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { getLenis } from '../hooks/useLenis'

const UNIT = 'PRODUCT DESIGN ✺ CREATIVE DEVELOPMENT ✺ MOTION ✺ BRAND SYSTEMS ✺ '

export default function Marquee() {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // base drift on a doubled track
        const drift = gsap.to(trackRef.current, {
          xPercent: -50,
          duration: 28,
          ease: 'none',
          repeat: -1,
        })

        // velocity skew: scroll speed shears the tape and speeds it up
        let targetSkew = 0
        const lenis = getLenis()
        const onScroll = (e: { velocity: number }) => {
          targetSkew = gsap.utils.clamp(-8, 8, e.velocity * 0.6)
        }
        lenis?.on('scroll', onScroll)

        let currentSkew = 0
        const tick = () => {
          // ease back over ~0.6s when scrolling stops
          currentSkew += (targetSkew - currentSkew) * 0.1
          targetSkew *= 0.92
          gsap.set(trackRef.current, { skewX: currentSkew })
          drift.timeScale(1 + Math.abs(currentSkew) * 0.35)
        }
        gsap.ticker.add(tick)

        return () => {
          lenis?.off('scroll', onScroll)
          gsap.ticker.remove(tick)
        }
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="relative z-10 overflow-hidden border-y border-hairline py-3">
      <div ref={trackRef} className="flex w-max whitespace-nowrap" aria-hidden="true">
        {[0, 1].map((half) => (
          <span key={half} className="type-condensed text-[13px] text-bone-dim">
            {Array.from({ length: 6 }, () => UNIT).join('')}
          </span>
        ))}
      </div>
      <ul className="sr-only">
        <li>Product Design</li>
        <li>Creative Development</li>
        <li>Motion</li>
        <li>Brand Systems</li>
      </ul>
    </div>
  )
}
