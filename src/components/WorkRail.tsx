import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMedia } from '../hooks/useMedia'
import FadeIn from './FadeIn'

gsap.registerPlugin(ScrollTrigger)

const VIDEO_A =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4'
const VIDEO_B =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4'

const PROJECTS = [
  {
    index: '01',
    title: 'HALIDE',
    description: 'Booking platform processing 2M reservations a year, rebuilt for speed',
    tags: ['STRATEGY', 'PRODUCT'],
    src: VIDEO_A,
  },
  {
    index: '02',
    title: 'MERIDIAN',
    description: 'Real-time logistics dashboard for a 400-vehicle fleet',
    tags: ['PRODUCT', 'ENGINEERING'],
    src: VIDEO_B,
  },
  {
    index: '03',
    title: 'PAPER & SIGNAL',
    description: 'Editorial commerce for an independent print magazine',
    tags: ['BRAND', 'COMMERCE'],
    src: VIDEO_A,
  },
  {
    index: '04',
    title: 'LOW ORBIT',
    description: 'Interactive annual report — Site of the Day, twice',
    tags: ['MOTION', 'WEBGL'],
    src: VIDEO_B,
  },
]

function Card({
  project,
  desktop,
}: {
  project: (typeof PROJECTS)[number]
  desktop: boolean
}) {
  return (
    <article className={desktop ? 'w-[62vw] max-w-[880px] shrink-0' : 'w-full'} data-card>
      <div
        data-cursor="view"
        className={`group relative overflow-hidden rounded-lg bg-ink-2 ${
          desktop ? 'aspect-[16/10]' : 'aspect-[4/3]'
        }`}
      >
        <video
          data-rail-video
          src={project.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full scale-[1.08] object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.14]"
        />
        <div className="absolute inset-0 bg-ink/20 transition-opacity duration-[800ms] group-hover:opacity-0" />
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="type-display text-[22px] text-bone">{project.title}</h3>
          <p className="mt-1 max-w-[40ch] text-[14px] leading-[1.65] text-bone-dim">
            {project.description}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-3">
          <span className="type-mono text-[11px] text-bone-dim">{project.index}</span>
          <div className="flex gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="type-mono rounded-full border border-hairline px-3 py-1 text-[10px] text-bone-dim"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function WorkRail() {
  const desktop = useMedia('(min-width: 1024px)')
  const rootRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(1)

  // pause off-screen videos
  useEffect(() => {
    const videos = rootRef.current?.querySelectorAll<HTMLVideoElement>('video')
    if (!videos?.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement
          if (entry.isIntersecting) video.play().catch(() => {})
          else video.pause()
        })
      },
      { threshold: 0.1 },
    )
    videos.forEach((v) => io.observe(v))
    return () => io.disconnect()
  }, [desktop])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(
        '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
        () => {
          const track = trackRef.current!
          const rail = gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-pin]',
              pin: true,
              scrub: 1,
              start: 'top top',
              end: () => `+=${window.innerHeight * 3}`,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                setCurrent(Math.min(4, Math.floor(self.progress * 4) + 1))
                if (barRef.current) {
                  gsap.set(barRef.current, { scaleX: self.progress })
                }
              },
            },
          })

          // per-card video parallax across the viewport
          gsap.utils.toArray<HTMLElement>('[data-rail-video]').forEach((video) => {
            gsap.fromTo(
              video,
              { xPercent: -4 },
              {
                xPercent: 4,
                ease: 'none',
                scrollTrigger: {
                  trigger: video,
                  containerAnimation: rail,
                  start: 'left right',
                  end: 'right left',
                  scrub: true,
                },
              },
            )
          })
        },
      )

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-card]').forEach((card) => {
          gsap.fromTo(
            card,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              ease: 'expo.out', // --ease-out-expo
              scrollTrigger: { trigger: card, start: 'top 85%', once: true },
            },
          )
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [desktop])

  return (
    <section id="work" ref={rootRef} className={desktop ? 'h-[400vh]' : ''}>
      {desktop ? (
        <div data-pin className="flex h-screen flex-col overflow-hidden">
          <div className="px-10 pt-24">
            <FadeIn>
            <div className="flex items-baseline gap-4">
              <span className="type-mono text-[12px] text-bone-dim">01</span>
              <span className="type-mono text-[12px] text-bone-dim">SELECTED WORK</span>
              <span className="h-px flex-1 self-center bg-hairline" />
              <span className="type-mono text-[12px] tabular-nums text-bone-dim">
                {current} / 4
              </span>
              <span className="relative h-px w-[120px] self-center bg-hairline">
                <span
                  ref={barRef}
                  className="absolute inset-0 origin-left scale-x-0 bg-bone"
                />
              </span>
            </div>
            </FadeIn>
          </div>
          <div ref={trackRef} className="flex h-full items-center gap-6 px-10">
            <div className="w-[10vw] shrink-0" />
            {PROJECTS.map((project) => (
              <Card key={project.index} project={project} desktop />
            ))}
          </div>
        </div>
      ) : (
        <div className="px-6 py-28 sm:px-10">
          <FadeIn className="mb-14">
            <div className="flex items-baseline gap-4">
              <span className="type-mono text-[11px] text-bone-dim">01</span>
              <span className="type-mono text-[11px] text-bone-dim">SELECTED WORK</span>
              <span className="h-px flex-1 self-center bg-hairline" />
            </div>
          </FadeIn>
          <div className="space-y-14">
            {PROJECTS.map((project) => (
              <Card key={project.index} project={project} desktop={false} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
