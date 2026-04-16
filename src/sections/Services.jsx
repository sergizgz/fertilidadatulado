import { Stethoscope, Heart, Leaf } from 'lucide-react'

const services = [
  {
    icon: Leaf,
    title: 'Asesoría Preconcepción',
    description: 'Para mujeres que quieren prepararse antes de buscar el embarazo. Optimizamos tu ciclo, tus analíticas y tus hábitos para llegar en las mejores condiciones.',
    includes: ['Análisis de ciclo y ovulación', 'Hábitos y nutrición', 'Revisión de analíticas', 'Plan personalizado'],
    cta: 'Quiero prepararme',
  },
  {
    icon: Heart,
    title: 'Acompañamiento en FIV/IAC',
    description: 'Apoyo emocional y técnico durante todo tu tratamiento de reproducción asistida. Entenderás cada paso del protocolo, sin confusión ni miedo.',
    includes: ['Explicación del protocolo', 'Gestión emocional', 'Seguimiento semanal', 'Canal directo conmigo'],
    cta: 'Quiero acompañamiento',
    featured: true,
  },
  {
    icon: Stethoscope,
    title: 'Consulta Puntual',
    description: 'Tienes dudas concretas y necesitas una respuesta experta. Una sesión individual para resolver lo que tu médico no tuvo tiempo de explicarte.',
    includes: ['60 minutos contigo', 'Revisión de informes', 'Preguntas sin límite', 'Resumen por escrito'],
    cta: 'Reservar consulta',
  },
]

export default function Services() {
  const scrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
  }

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                className={`relative rounded-3xl p-8 flex flex-col transition-all duration-200 ${
                  s.featured
                    ? 'bg-rose-accent text-white shadow-xl shadow-rose-accent/20 scale-105'
                    : 'bg-white border border-cream-darker/40 hover:shadow-md'
                }`}
              >
                {s.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-dark text-white text-xs font-medium px-4 py-1 rounded-full">
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
                  {s.includes.map((item) => (
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
          })}
        </div>

        <p className="text-center text-[#9B9B9B] text-sm mt-10">
          ¿No sabes cuál es el tuyo? <button onClick={scrollToContact} className="text-rose-accent underline underline-offset-2 hover:text-rose-dark">Escríbeme y lo vemos juntas.</button>
        </p>
      </div>
    </section>
  )
}
