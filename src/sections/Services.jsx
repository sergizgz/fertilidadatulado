import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Leaf, Heart, Stethoscope, Baby, Calendar, BookOpen,
  MessageCircle, Star, Shield, Sparkles, Moon, Sun,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

export const ICON_MAP = {
  leaf:           Leaf,
  heart:          Heart,
  stethoscope:    Stethoscope,
  baby:           Baby,
  calendar:       Calendar,
  'book-open':    BookOpen,
  'message-circle': MessageCircle,
  star:           Star,
  shield:         Shield,
  sparkles:       Sparkles,
  moon:           Moon,
  sun:            Sun,
}

function ServiceCard({ s }) {
  const Icon = ICON_MAP[s.icon] ?? Heart
  const scrollToContact = () =>
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className={`relative rounded-3xl p-8 flex flex-col h-full transition-all duration-200 ${
      s.featured
        ? 'bg-rose-accent text-white shadow-xl shadow-rose-accent/20'
        : 'bg-white border border-cream-darker/40 hover:shadow-md'
    }`}>
      {s.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-dark text-white text-xs font-medium px-4 py-1 rounded-full whitespace-nowrap">
          Más solicitado
        </span>
      )}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${s.featured ? 'bg-white/20' : 'bg-rose-soft'}`}>
        <Icon size={22} className={s.featured ? 'text-white' : 'text-rose-accent'} />
      </div>
      <h3 className={`font-serif text-xl font-medium mb-3 ${s.featured ? 'text-white' : 'text-[#2A2A2A]'}`}>
        {s.title}
      </h3>
      <p className={`text-sm leading-relaxed mb-6 ${s.featured ? 'text-white/80' : 'text-[#6B6B6B]'}`}>
        {s.description}
      </p>
      <ul className="space-y-2 mb-8 flex-1">
        {(Array.isArray(s.includes) ? s.includes : (s.includes ? JSON.parse(s.includes) : [])).map(item => (
          <li key={item} className={`text-sm flex items-center gap-2 ${s.featured ? 'text-white/90' : 'text-[#2A2A2A]'}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.featured ? 'bg-white' : 'bg-rose-accent'}`} />
            {item}
          </li>
        ))}
      </ul>
      <button
        onClick={scrollToContact}
        className={`w-full py-3 rounded-full font-medium text-sm transition-all duration-200 ${
          s.featured
            ? 'bg-white text-rose-accent hover:bg-rose-soft'
            : 'border-2 border-rose-accent text-rose-accent hover:bg-rose-accent hover:text-white'
        }`}
      >
        {s.cta}
      </button>
    </div>
  )
}

export default function Services() {
  const [services, setServices] = useState([])
  const [offset, setOffset]     = useState(0)
  const containerRef            = useRef(null)
  const [slideStep, setSlideStep] = useState(0) // px per step

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('sort_order')
      .then(({ data }) => { if (data) setServices(data) })
  }, [])

  const calcSlide = useCallback(() => {
    if (!containerRef.current) return
    const w   = containerRef.current.clientWidth
    const gap = 24 // gap-6
    const cardW = (w - gap * 2) / 3
    setSlideStep(cardW + gap)
  }, [])

  useEffect(() => {
    calcSlide()
    const ro = new ResizeObserver(calcSlide)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [calcSlide, services.length])

  const scrollToContact = () =>
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })

  const isCarousel = services.length > 3
  const canPrev    = offset > 0
  const canNext    = offset + 3 < services.length

  return (
    <section id="servicios" className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-14">
          <p className="text-rose-accent font-medium text-sm uppercase tracking-wider mb-3">Servicios</p>
          <h2 className="section-title mb-4">¿Cómo puedo ayudarte?</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Cada mujer es diferente. Cada proceso, también. Aquí encontrarás el acompañamiento que necesitas en este momento.
          </p>
        </div>

        {isCarousel ? (
          <div className="relative">
            {/* Flechas */}
            <button
              onClick={() => setOffset(o => Math.max(0, o - 1))}
              disabled={!canPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-cream-darker/30 flex items-center justify-center text-rose-accent disabled:opacity-30 hover:bg-rose-soft/20 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setOffset(o => Math.min(services.length - 3, o + 1))}
              disabled={!canNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-cream-darker/30 flex items-center justify-center text-rose-accent disabled:opacity-30 hover:bg-rose-soft/20 transition-all"
            >
              <ChevronRight size={18} />
            </button>

            {/* Track */}
            <div ref={containerRef} className="overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${offset * slideStep}px)` }}
              >
                {services.map(s => (
                  <div
                    key={s.id}
                    className="flex-none pt-4"
                    style={{ width: `calc((100% - 48px) / 3)` }}
                  >
                    <ServiceCard s={s} />
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-8">
              {Array.from({ length: services.length - 2 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setOffset(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === offset ? 'w-5 bg-rose-accent' : 'w-2 bg-rose-soft'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div ref={containerRef} className={`grid grid-cols-1 gap-6 pt-4 ${
            services.length === 1 ? '' :
            services.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
          }`}>
            {services.map(s => (
              <div key={s.id} className={s.featured ? 'md:scale-105' : ''}>
                <ServiceCard s={s} />
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-[#9B9B9B] text-sm mt-10">
          ¿No sabes cuál es el tuyo?{' '}
          <button
            onClick={scrollToContact}
            className="text-rose-accent underline underline-offset-2 hover:text-rose-dark"
          >
            Escríbeme y lo vemos juntas.
          </button>
        </p>
      </div>
    </section>
  )
}
