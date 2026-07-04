import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { getLenis } from '../hooks/useLenis'

const STATUS = [
  { at: 0, label: 'CALIBRATING COLOR TEMP' },
  { at: 34, label: 'DEVELOPING ASSETS' },
  { at: 68, label: 'FIXING CONTRAST' },
  { at: 96, label: 'READY' },
]

export default function Preloader({
  onIntro,
  onDone,
}: {
  onIntro: () => void
  onDone: () => void
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLSpanElement>(null)
  const statusRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const tempRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)

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
        // ---- safelight: a warm pool of light that follows the cursor through the dark ----
        const mouse = { x: window.innerWidth * 0.7, y: window.innerHeight * 0.35 }
        const pos = { ...mouse }
        const onMove = (e: MouseEvent) => {
          mouse.x = e.clientX
          mouse.y = e.clientY
        }
        const followTick = () => {
          pos.x += (mouse.x - pos.x) * 0.08
          pos.y += (mouse.y - pos.y) * 0.08
          gsap.set(lightRef.current, { x: pos.x, y: pos.y })
        }
        window.addEventListener('mousemove', onMove)
        gsap.ticker.add(followTick)
        gsap.set(lightRef.current, { xPercent: -50, yPercent: -50, x: pos.x, y: pos.y })
        gsap.fromTo(
          lightRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.2, ease: 'expo.out' }, // --ease-out-expo
        )

        const counter = { v: 0 }
        let statusIndex = -1
        const tl = gsap.timeline()

        // wordmark masked line-reveal
        tl.fromTo(
          wordmarkRef.current,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.8, ease: 'expo.out' },
          0,
        )

        // counter accelerates mid-way and settles; temp + status + bar ride along
        tl.to(
          counter,
          {
            v: 100,
            duration: 2.2,
            ease: 'power2.inOut',
            onUpdate: () => {
              const v = counter.v
              if (counterRef.current) {
                counterRef.current.textContent = String(Math.floor(v)).padStart(3, '0')
              }
              if (tempRef.current) {
                // the kelvin scale itself: 1,000K warm → 20,000K cold daylight blue
                const kelvin = Math.floor(1000 + (v / 100) * 19000)
                tempRef.current.textContent = `${kelvin.toLocaleString('en-US')}K`
              }
              if (barRef.current) gsap.set(barRef.current, { scaleX: v / 100 })
              // cycle darkroom status labels with a masked swap
              const next = STATUS.reduce((acc, s, i) => (v >= s.at ? i : acc), 0)
              if (next !== statusIndex && statusRef.current) {
                statusIndex = next
                statusRef.current.textContent = STATUS[next].label
                gsap.fromTo(
                  statusRef.current,
                  { yPercent: 110 },
                  { yPercent: 0, duration: 0.5, ease: 'expo.out' },
                )
              }
            },
          },
          0,
        )

        // at 100: counter + progress bar snap to kelvin for 150ms (accent use #1)
        tl.set([counterRef.current, barRef.current], {
          color: 'var(--kelvin)',
          backgroundColor: 'var(--kelvin)',
        })
        tl.set(
          [counterRef.current, barRef.current],
          { color: 'var(--bone-dim)', backgroundColor: 'var(--bone)' },
          '+=0.15',
        )

        // curtain lifts; hero intro overlaps 0.35s before it finishes
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

        return () => {
          window.removeEventListener('mousemove', onMove)
          gsap.ticker.remove(followTick)
        }
      })
    }, rootRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] overflow-hidden bg-ink"
      style={{ clipPath: 'inset(0 0 0 0)' }}
      aria-hidden="true"
    >
      {/* cursor-following safelight */}
      <div
        ref={lightRef}
        className="pointer-events-none absolute left-0 top-0 h-[55vmax] w-[55vmax] opacity-0"
        style={{
          background:
            'radial-gradient(closest-side, rgba(201,128,58,0.13), transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* top row: meta */}
      <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-6 sm:p-10">
        <span className="type-mono text-[11px] text-bone-dim">KELVIN — LOADING</span>
        <span ref={tempRef} className="type-mono text-[11px] tabular-nums text-bone-dim">
          1,000K
        </span>
      </div>

      {/* bottom row: wordmark + status / counter */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6 sm:p-10">
        <div>
          <span className="block overflow-hidden">
            <span
              ref={wordmarkRef}
              className="type-condensed block text-[20px] text-bone"
            >
              KELVIN&reg;
            </span>
          </span>
          <span className="mt-2 block overflow-hidden">
            <span ref={statusRef} className="type-mono block text-[10px] text-bone-dim">
              CALIBRATING COLOR TEMP
            </span>
          </span>
        </div>
        <span
          ref={counterRef}
          className="type-mono text-[clamp(3rem,10vw,7rem)] tabular-nums leading-none text-bone-dim"
        >
          000
        </span>
      </div>

      {/* progress hairline along the bottom edge */}
      <div
        ref={barRef}
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-bone"
      />
    </div>
  )
}
