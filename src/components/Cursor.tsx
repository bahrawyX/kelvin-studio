import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useMedia } from '../hooks/useMedia'

export default function Cursor() {
  const fine = useMedia('(pointer: fine)')
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!fine) {
      document.body.style.cursor = ''
      return
    }
    document.body.style.cursor = 'none'

    const dot = dotRef.current!
    const ring = ringRef.current!
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const dotPos = { ...mouse }
    const ringPos = { ...mouse }
    let viewing = false

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 })

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const setView = (on: boolean) => {
      if (viewing === on) return
      viewing = on
      // 0.4s --ease-out-expo state change
      gsap.to(ring, {
        width: on ? 76 : 34,
        height: on ? 76 : 34,
        backgroundColor: on ? 'var(--kelvin)' : 'rgba(0,0,0,0)',
        borderColor: on ? 'rgba(0,0,0,0)' : 'rgba(233,227,215,0.4)',
        duration: 0.4,
        ease: 'expo.out',
      })
      gsap.set(ring, { mixBlendMode: on ? 'normal' : 'difference' })
      gsap.to(labelRef.current, { opacity: on ? 1 : 0, duration: 0.4, ease: 'expo.out' })
      gsap.to(dot, { opacity: on ? 0 : 1, duration: 0.2 })
    }

    const onOver = (e: MouseEvent) => {
      setView(!!(e.target as HTMLElement).closest('[data-cursor="view"]'))
    }
    const onDown = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.4, ease: 'expo.out' })
    }
    const onUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.4, ease: 'expo.out' })
    }

    const tick = () => {
      dotPos.x += (mouse.x - dotPos.x) * 0.35
      dotPos.y += (mouse.y - dotPos.y) * 0.35
      ringPos.x += (mouse.x - ringPos.x) * 0.12
      ringPos.y += (mouse.y - ringPos.y) * 0.12
      gsap.set(dot, { x: dotPos.x, y: dotPos.y })
      gsap.set(ring, { x: ringPos.x, y: ringPos.y })
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    gsap.ticker.add(tick)

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      gsap.ticker.remove(tick)
    }
  }, [fine])

  if (!fine) return null

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[90] h-2 w-2 rounded-full bg-bone mix-blend-difference"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[90] flex h-[34px] w-[34px] items-center justify-center rounded-full border border-bone/40 mix-blend-difference"
      >
        <span ref={labelRef} className="type-mono text-[10px] text-ink opacity-0">
          VIEW
        </span>
      </div>
    </>
  )
}
