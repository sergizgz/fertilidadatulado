import { Heart } from 'lucide-react'

/** Apaisada (cover ~21:9 desde original). Unsplash — Jametlene Reskp / pareja y embarazo al atardecer. */
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1763106377335-578cf40ce82e?w=1920&h=820&q=85&auto=format&fit=crop'

/** Otras opciones libres (cambia la URL de arriba): manos y sol — Brooke Balentine · pareja luz cálida — Hanna Lazar
 *  https://images.unsplash.com/photo-1741900460437-99811b6d938f?w=1920&h=820&q=85&auto=format&fit=crop
 *  https://images.unsplash.com/photo-1763713512973-4be054e5400d?w=1920&h=820&q=85&auto=format&fit=crop
 */

export default function Hero() {
  const scrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        /* Misma familia cromática que el resto del sitio (rose-accent / rose-soft / cream) */
        backgroundImage: `url(${HERO_IMAGE}), linear-gradient(135deg, #A55A6E 0%, #C9788A 38%, #E09AAA 72%, #F2C8D0 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: '56% 42%',
        backgroundBlendMode: 'normal',
      }}
    >
      {/*
        Contraste: base oscura neutra + refuerzo hacia la derecha (sol / flare).
        El velo rosa va solo como capa suave para marca, sin “lavar” la foto.
      */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-l from-black/55 via-black/15 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-rose-dark/35 via-rose-dark/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45" />

      {/* Contenido: pt generoso para no solapar el header fijo (h-16 / md:h-20) + aire sobre el badge */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full py-12 pb-28 pt-[calc(5.5rem+env(safe-area-inset-top))] md:py-16 md:pt-[calc(6.5rem+env(safe-area-inset-top))] md:pb-32 flex items-center justify-center min-h-screen text-center">
        <div className="max-w-3xl w-full flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-black/35 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
            <Heart size={13} className="text-rose-soft fill-rose-soft" />
            <span className="text-sm font-medium text-white">Asesora especializada en fertilidad</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 [text-shadow:0_2px_28px_rgba(0,0,0,0.75),0_1px_4px_rgba(0,0,0,0.9)]">
            <span className="text-white">Entiende tu ciclo.</span>
            <br />
            <span className="text-rose-soft [text-shadow:0_2px_24px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.5)]">Acompaña tu proceso.</span>
            <br />
            <span className="text-white">Con respuestas, no silencios.</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-white/95 text-base md:text-lg leading-relaxed mb-10 max-w-xl [text-shadow:0_2px_16px_rgba(0,0,0,0.65)]">
            Soy Lidia, enfermera con más de 15 años en reproducción asistida. Te doy la información real que tu clínica no siempre tiene tiempo de explicarte.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
            <button
              onClick={scrollToContact}
              className="inline-flex items-center justify-center gap-2 bg-rose-accent hover:bg-rose-dark text-white font-medium px-8 py-3.5 rounded-full transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              Quiero hablar contigo
              <Heart size={16} className="fill-white text-white shrink-0" />
            </button>
            <button
              onClick={() => document.getElementById('sobre-mi')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-rose-soft/15 border border-rose-soft/85 text-white font-medium px-8 py-3.5 rounded-full transition-all duration-200 active:scale-95"
            >
              Conóceme
            </button>
          </div>
        </div>
      </div>

    </section>
  )
}
