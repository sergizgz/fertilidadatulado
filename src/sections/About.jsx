import { CheckCircle } from 'lucide-react'

/** Dev / broma: quitar antes de producción y usar foto real de Lidia con permiso de uso. */
const LIDIA_PHOTO_PLACEHOLDER =
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiwgWTn01Q-MwEsnDamnSG5ca2-hN855sGDmwwByfHMAwcrl8CKOV_BA9AvnWHMq2HxfJRDiTnUks3QtFs7QEuT6r2qdk4QvaeUOUk1BIy0zbW0X2E_-1Nc-7W3onAjZaZRPBOUr8es8FDy/s1600/HandmaidsTale_01_Ann_Dowd_Seamless_JG_07612rt.jpg'

const credentials = [
  'Enfermera especialista, +15 años en reproducción asistida',
  'Experiencia en FIV, IAC, ovodonación y preservación de fertilidad',
  'Acompañamiento emocional y técnico en cada fase del tratamiento',
  'Atención online: accesible desde donde estés',
]

export default function About() {
  return (
    <section id="sobre-mi" className="py-24 bg-cream-dark">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          {/* Imagen: placeholder de desarrollo (sustituir en prod) */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg">
              <img
                src={LIDIA_PHOTO_PLACEHOLDER}
                alt="Placeholder de retrato (sustituir por foto de Lidia en producción)"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-md px-5 py-4">
              <p className="font-serif text-2xl font-semibold text-rose-accent">+15</p>
              <p className="text-xs text-[#6B6B6B] leading-tight">años en<br/>reproducción asistida</p>
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="text-rose-accent font-medium text-sm uppercase tracking-wider mb-3">Sobre mí</p>
            <h2 className="section-title mb-5">
              Hola, soy Lidia.<br />
              <span className="text-rose-accent italic">Y sé lo que sientes.</span>
            </h2>
            <p className="text-[#6B6B6B] leading-relaxed mb-5">
              Llevo más de 15 años trabajando en unidades de reproducción asistida. He visto miles de procesos de cerca — los protocolos, las esperas, el impacto emocional. Y he comprobado que la información marca la diferencia.
            </p>
            <p className="text-[#6B6B6B] leading-relaxed mb-8">
              Muchas mujeres llegan a mí agotadas, confusas, sintiendo que no entienden lo que les pasa. Mi trabajo es cambiar eso: explicarte de verdad lo que nadie te explica en consulta, y acompañarte en cada paso.
            </p>

            <ul className="space-y-3 mb-10">
              {credentials.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-rose-accent mt-0.5 shrink-0" />
                  <span className="text-[#2A2A2A] text-sm leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>

            <a href="/#contacto" onClick={e => { e.preventDefault(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn-primary">
              ¿Hablamos?
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
