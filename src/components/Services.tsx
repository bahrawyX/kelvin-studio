import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Minus, Plus } from 'lucide-react'
import SectionHeader from './SectionHeader'
import FadeIn from './FadeIn'
import { useMedia } from '../hooks/useMedia'

// four distinct minimal photos, one per accordion row
const IMG_1 = 'https://picsum.photos/seed/kelvin-product/640/480'
const IMG_2 = 'https://picsum.photos/seed/kelvin-dev/640/480'
const IMG_3 = 'https://picsum.photos/seed/kelvin-brand/640/480'
const IMG_4 = 'https://picsum.photos/seed/kelvin-motion/640/480'

const SERVICES = [
  {
    index: '01',
    name: 'Product Design',
    body: 'End-to-end product design from research to a tested, shippable system — not screens, systems.',
    meta: ['UX Architecture', 'Design Systems', 'Prototyping'],
    img: IMG_1,
  },
  {
    index: '02',
    name: 'Creative Development',
    body: 'The layer where design survives contact with the browser. Performance budgets are part of the design.',
    meta: ['React / Next.js', 'WebGL', 'Motion Engineering'],
    img: IMG_2,
  },
  {
    index: '03',
    name: 'Brand Systems',
    body: 'Identity built to flex across product, motion and print without falling apart.',
    meta: ['Identity', 'Art Direction', 'Guidelines'],
    img: IMG_3,
  },
  {
    index: '04',
    name: 'Motion',
    body: 'Movement with intent — from micro-interactions to full launch films.',
    meta: ['Interaction Motion', '3D', 'Launch Films'],
    img: IMG_4,
  },
]

export default function Services() {
  const fine = useMedia('(pointer: fine)')
  const rootRef = useRef<HTMLElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const prevHovered = useRef<number | null>(null)
  const bodyRefs = useRef<(HTMLDivElement | null)[]>([])
  const [open, setOpen] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  const toggle = (i: number) => {
    const next = open === i ? null : i
    // close current
    if (open !== null && bodyRefs.current[open]) {
      gsap.to(bodyRefs.current[open], {
        height: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.inOut', // --ease-inout-soft
      })
    }
    if (next !== null && bodyRefs.current[next]) {
      gsap.to(bodyRefs.current[next], {
        height: 'auto',
        duration: 0.6,
        ease: 'power3.inOut',
      })
      gsap.to(bodyRefs.current[next], { opacity: 1, duration: 0.4, delay: 0.1 })
    }
    setOpen(next)
  }

  // cached images can finish before React attaches onLoad — reveal them on mount
  useEffect(() => {
    stripRef.current?.querySelectorAll('img').forEach((img) => {
      if (img.complete && img.naturalWidth > 0) img.classList.remove('opacity-0')
    })
  }, [fine])

  // mouseleave never fires when the page scrolls under a still cursor — clear manually
  useEffect(() => {
    const clear = () => setHovered(null)
    window.addEventListener('scroll', clear, { passive: true })
    window.addEventListener('wheel', clear, { passive: true })
    return () => {
      window.removeEventListener('scroll', clear)
      window.removeEventListener('wheel', clear)
    }
  }, [])

  // hover preview follows cursor with lerp + velocity rotation
  useEffect(() => {
    if (!fine) return
    const preview = previewRef.current!
    const mouse = { x: 0, y: 0 }
    const pos = { x: 0, y: 0 }
    let lastX = 0
    let velocity = 0

    const onMove = (e: MouseEvent) => {
      velocity = e.clientX - lastX
      lastX = e.clientX
      mouse.x = e.clientX + 24
      mouse.y = e.clientY - 100
    }
    const tick = () => {
      pos.x += (mouse.x - pos.x) * 0.1
      pos.y += (mouse.y - pos.y) * 0.1
      velocity *= 0.9
      gsap.set(preview, {
        x: pos.x,
        y: pos.y,
        rotate: gsap.utils.clamp(-6, 6, velocity),
      })
    }
    window.addEventListener('mousemove', onMove)
    gsap.ticker.add(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      gsap.ticker.remove(tick)
    }
  }, [fine])

  useEffect(() => {
    if (!fine || !previewRef.current) return
    const strip = stripRef.current
    if (hovered !== null) {
      // filmstrip: slide to the hovered row's slot — direction follows the cursor
      // (row 2 → 1 scrolls the column down, 1 → 2 scrolls it up).
      if (strip) {
        if (prevHovered.current === null) {
          // entering from outside: jump straight to the row's image, no travel
          gsap.set(strip, { yPercent: -hovered * 25 })
        } else if (prevHovered.current !== hovered) {
          gsap.to(strip, {
            yPercent: -hovered * 25,
            duration: 0.65,
            ease: 'expo.out', // --ease-out-expo
          })
        }
      }
      gsap.to(previewRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'expo.out',
      })
    } else {
      gsap.to(previewRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        ease: 'expo.out',
      })
    }
    prevHovered.current = hovered
  }, [hovered, fine])

  return (
    <section
      id="services"
      ref={rootRef}
      className="mx-auto max-w-[1440px] px-6 py-28 sm:px-10 sm:py-40"
    >
      <SectionHeader index="03" label="WHAT WE DO" />

      <div>
        {SERVICES.map((service, i) => (
          <FadeIn key={service.index} delay={i * 0.08}>
          <div
            className={`border-t border-hairline transition-colors duration-300 hover:bg-ink-2 ${
              i === SERVICES.length - 1 ? 'border-b' : ''
            }`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <button
              aria-expanded={open === i}
              aria-controls={`service-body-${i}`}
              onClick={() => toggle(i)}
              className="grid w-full cursor-pointer grid-cols-[3rem_1fr_auto] items-center gap-6 px-4 py-8 text-left sm:px-8 sm:py-10"
            >
              <span className="type-mono text-[11px] text-bone-dim sm:text-[12px]">
                {service.index}
              </span>
              <span className="type-display text-[clamp(1.6rem,3.5vw,2.8rem)] leading-[1.05] text-bone">
                {service.name}
              </span>
              <span className="relative h-5 w-5">
                <Plus
                  size={20}
                  className={`absolute inset-0 text-bone-dim transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open === i ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                  }`}
                />
                <Minus
                  size={20}
                  className={`absolute inset-0 text-bone-dim transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open === i ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                  }`}
                />
              </span>
            </button>
            <div
              id={`service-body-${i}`}
              role="region"
              ref={(el) => {
                bodyRefs.current[i] = el
              }}
              className="h-0 overflow-hidden opacity-0"
            >
              <div className="grid grid-cols-[3rem_1fr] gap-6 px-4 pb-10 sm:px-8">
                <span />
                <div>
                  <p className="max-w-[46ch] text-[15px] leading-[1.65] text-bone-dim">
                    {service.body}
                  </p>
                  <p className="type-mono mt-4 text-[11px] text-bone-dim">
                    {service.meta.join(' · ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          </FadeIn>
        ))}
      </div>

      {/* fixed hover preview (desktop only): vertical filmstrip, one slot per accordion row.
          All four images mount upfront so they're loaded before the first hover;
          a shimmer skeleton covers any slot still decoding. */}
      {fine && (
        <div
          ref={previewRef}
          className="pointer-events-none fixed left-0 top-0 z-30 aspect-[4/3] w-[200px] overflow-hidden rounded-sm opacity-0"
          style={{ transform: 'scale(0.9)' }}
          aria-hidden="true"
        >
          <div ref={stripRef} className="w-full" style={{ height: '400%' }}>
            {SERVICES.map((service, i) => (
              <div key={i} className="relative h-1/4 w-full">
                <div className="skeleton absolute inset-0" />
                <img
                  src={service.img}
                  alt=""
                  loading="eager"
                  decoding="async"
                  onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                  className="relative h-full w-full object-cover opacity-0 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
