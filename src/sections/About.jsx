import { CheckCircle } from 'lucide-react'
import { useSiteSettings } from '../hooks/useSiteSettings'

const LIDIA_PHOTO_FALLBACK = '/lidia.jpg'

const DEFAULT_PARAGRAPHS = [
  'Llevo más de 15 años trabajando en unidades de reproducción asistida, especialmente desde el área de enfermería reproductiva. He estado muy cerca de miles de procesos: tratamientos, decisiones, esperas… y, sobre todo, del impacto emocional que conllevan. Y si hay algo que he aprendido, es que la información —clara, honesta y bien explicada— marca una diferencia enorme.',
  'Durante años viví todo esto desde el lado clínico. Pero en 2022 me convertí en madre, y tiempo después volví a serlo. Esa experiencia transformó por completo mi forma de entender este proceso. Porque cuando eres tú quien desea con todas sus fuerzas, quien espera, quien duda… todo se vive de una manera muy distinta.',
  'En primera persona entendí la incertidumbre, la necesidad de respuestas claras y lo difícil que es, a veces, no tener a quién acudir. Por eso decidí dar un paso más: acompañar desde un lugar diferente, donde puedas preguntar sin miedo y no tengas que sentirte sola en tu proceso.',
]

const DEFAULT_CREDENTIALS = [
  'Enfermera especialista, +15 años en reproducción asistida',
  'Experiencia en FIV, IA, ovodonación y preservación de fertilidad',
  'Acompañamiento emocional y técnico en cada fase del tratamiento',
  'Atención online: accesible desde donde estés',
]

export default function About() {
  const { settings } = useSiteSettings()
  const lidiaPhoto = settings.lidia_photo_url || LIDIA_PHOTO_FALLBACK
  const years = settings.bio_years || '15'

  const paragraphs = (() => {
    try {
      const parsed = settings.bio_paragraphs ? JSON.parse(settings.bio_paragraphs) : null
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PARAGRAPHS
    } catch { return DEFAULT_PARAGRAPHS }
  })()

  const credentials = (() => {
    try {
      const parsed = settings.bio_credentials ? JSON.parse(settings.bio_credentials) : null
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CREDENTIALS
    } catch { return DEFAULT_CREDENTIALS }
  })()

  return (
    <section id="sobre-mi" className="py-24 bg-cream-dark">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          {/* Imagen */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-lg h-full min-h-[480px]">
              <img
                src={lidiaPhoto}
                alt="Lidia, enfermera especialista en reproducción asistida"
                className="w-full h-full object-cover object-[center_20%]"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-md px-5 py-4">
              <p className="font-serif text-2xl font-semibold text-rose-accent">+{years}</p>
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

            {paragraphs.map((p, i) => (
              <p key={i} className={`text-[#6B6B6B] leading-relaxed ${i < paragraphs.length - 1 ? 'mb-5' : 'mb-8'}`}>
                {p}
              </p>
            ))}

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
