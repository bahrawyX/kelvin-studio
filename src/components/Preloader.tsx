import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { getLenis } from '../hooks/useLenis'

export default function Preloader({
  onIntro,
  onDone,
}: {
  onIntro: () => void
  onDone: () => void
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    getLenis()?.stop()

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(wordmarkRef.current, { yPercent: 0 })
        if (counterRef.current) counterRef.current.textContent = '100'
        gsap.to(rootRef.current, {
          opacity: 0,
          duration: 0.4,
          delay: 0.4,
          onStart: onIntro,
          onComplete: () => {
            getLenis()?.start()
            onDone()
          },
        })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const counter = { v: 0 }
        const tl = gsap.timeline()

        // wordmark masked line-reveal
        tl.fromTo(
          wordmarkRef.current,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.8, ease: 'expo.out' }, // --ease-out-expo
          0,
        )

        // counter: accelerates mid-way, settles at the end
        tl.to(
          counter,
          {
            v: 100,
            duration: 2.2,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(
                  Math.floor(counter.v),
                ).padStart(3, '0')
              }
            },
          },
          0,
        )

        // at 100: counter snaps to kelvin for 150ms (accent use #1)
        tl.set(counterRef.current, { color: 'var(--kelvin)' })
        tl.set(counterRef.current, { color: 'var(--bone-dim)' }, '+=0.15')

        // curtain lifts upward; hero intro overlaps 0.35s before it finishes
        tl.to(rootRef.current, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.0,
          ease: 'power3.inOut', // --ease-inout-soft
          onStart: () => {
            gsap.delayedCall(0.65, onIntro)
          },
          onComplete: () => {
            getLenis()?.start()
            onDone()
          },
        })
      })
    }, rootRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-end justify-between bg-ink p-6 sm:p-10"
      style={{ clipPath: 'inset(0 0 0 0)' }}
      aria-hidden="true"
    >
      <span className="block overflow-hidden">
        <span ref={wordmarkRef} className="type-condensed block text-[20px] text-bone">
          KELVIN&reg;
        </span>
      </span>
      <span
        ref={counterRef}
        className="type-mono text-[clamp(3rem,10vw,7rem)] tabular-nums leading-none text-bone-dim"
      >
        000
      </span>
    </div>
  )
}
