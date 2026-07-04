import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import FadeIn from './FadeIn'

const CLIENTS = ['AURELIA', 'NORTHWIND', 'KAFR TECH', 'OSSIA', 'BLUEPRINT CO', 'HELIOTROPE']

export default function ClientBand() {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // rightward drift, opposite of the hero tape
        tlRef.current = gsap.fromTo(
          trackRef.current,
          { xPercent: -50 },
          { xPercent: 0, duration: 18, ease: 'none', repeat: -1 },
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const slow = () => {
    if (tlRef.current) gsap.to(tlRef.current, { timeScale: 0.2, duration: 0.6 })
  }
  const resume = () => {
    if (tlRef.current) gsap.to(tlRef.current, { timeScale: 1, duration: 0.6 })
  }

  return (
    <FadeIn>
    <div
      ref={rootRef}
      className="overflow-hidden border-y border-hairline py-16"
      onMouseEnter={slow}
      onMouseLeave={resume}
    >
      <div ref={trackRef} className="flex w-max whitespace-nowrap" aria-hidden="true">
        {[0, 1].map((half) => (
          <span key={half} className="type-display flex items-center text-[15px] text-bone-dim">
            {Array.from({ length: 4 }, () => CLIENTS)
              .flat()
              .map((client, i) => (
                <span key={i} className="flex items-center">
                  <span className="px-5">{client}</span>
                  <span className="h-1 w-1 rounded-full bg-bone-dim" />
                </span>
              ))}
          </span>
        ))}
      </div>
      <ul className="sr-only">
        {CLIENTS.map((client) => (
          <li key={client}>{client}</li>
        ))}
      </ul>
    </div>
    </FadeIn>
  )
}
