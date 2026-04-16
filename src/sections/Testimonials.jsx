import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Ana M.',
    location: 'Madrid',
    text: 'Lidia me explicó paso a paso el protocolo de FIV que me habían prescrito. Por fin entendí qué me estaban haciendo y por qué. Esa tranquilidad no tiene precio.',
    stars: 5,
  },
  {
    name: 'Carmen y Javier',
    location: 'Valencia',
    text: 'Llevábamos dos años buscando embarazo sin entender nada. Lidia nos ayudó a interpretar nuestros informes y a hacernos las preguntas correctas en consulta. Un cambio enorme.',
    stars: 5,
  },
  {
    name: 'Laura P.',
    location: 'Barcelona',
    text: 'Lo que más valoro es que nunca me hizo sentir una paciente más. Me escuchó, me entendió y estuvo ahí en los momentos difíciles. La recomiendo a todas.',
    stars: 5,
  },
]

export default function Testimonials() {
  return (
    <section id="testimonios" className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-14">
          <p className="text-rose-accent font-medium text-sm uppercase tracking-wider mb-3">Testimonios</p>
          <h2 className="section-title mb-4">Lo que dicen quienes ya han pasado por aquí</h2>
          <p className="section-subtitle max-w-lg mx-auto">
            Cada historia es diferente. Lo que comparten: información que marca la diferencia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card flex flex-col">
              <Quote size={28} className="text-rose-soft mb-4" />
              <p className="text-[#2A2A2A] leading-relaxed text-sm flex-1 mb-6 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-cream-dark">
                <div className="w-10 h-10 rounded-full bg-rose-soft flex items-center justify-center text-rose-accent font-medium text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-medium text-[#2A2A2A] text-sm">{t.name}</p>
                  <p className="text-[#9B9B9B] text-xs">{t.location}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} size={14} className="text-rose-accent fill-rose-accent" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
