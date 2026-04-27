import { Heart } from 'lucide-react'
import { useSiteSettings } from '../hooks/useSiteSettings'

const HERO_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1763106377335-578cf40ce82e?w=1920&h=820&q=85&auto=format&fit=crop'

const HERO_DEFAULTS = {
  hero_badge:       'Asesora especializada en fertilidad',
  hero_title_1:     'Entiende tu ciclo.',
  hero_title_2:     'Acompaña tu proceso.',
  hero_title_3:     'Con respuestas, no silencios.',
  hero_subtitle:    'Entender tu cuerpo es el primer paso para vivir la búsqueda de embarazo con más claridad y tranquilidad. Buscar un embarazo no debería vivirse a ciegas ni en soledad.',
  hero_cta_primary:   'Quiero hablar contigo',
  hero_cta_secondary: 'Conóceme',
  hero_teaser:      '¿Primera vez aquí? Descarga mi guía gratuita sobre fertilidad',
}

function t(settings, key) {
  return settings[key] || HERO_DEFAULTS[key]
}

// Devuelve true si el elemento está visible (por defecto sí, salvo que sea explícitamente '0')
function visible(settings, key) {
  return settings[`${key}_visible`] !== '0'
}

export default function Hero() {
  const { settings, loading } = useSiteSettings()

  const heroImage = loading ? null : (settings.hero_image_url || HERO_IMAGE_FALLBACK)
  const darkness  = (parseInt(settings.hero_darkness  ?? '45') / 100).toFixed(2)
  const rose      = (parseInt(settings.hero_rose      ?? '35') / 100).toFixed(2)
  const posX      = settings.hero_pos_x ?? '56'
  const posY      = settings.hero_pos_y ?? '42'

  const scrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Líneas del título visibles
  const titleLines = [
    { key: 'hero_title_1', className: 'text-white' },
    { key: 'hero_title_2', className: 'text-rose-soft [text-shadow:0_2px_24px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.5)]' },
    { key: 'hero_title_3', className: 'text-white' },
  ].filter(l => visible(settings, l.key))

  const showCtaPrimary   = visible(settings, 'hero_cta_primary')
  const showCtaSecondary = visible(settings, 'hero_cta_secondary')

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: heroImage
          ? `url(${heroImage}), linear-gradient(135deg, #A55A6E 0%, #C9788A 38%, #E09AAA 72%, #F2C8D0 100%)`
          : `linear-gradient(135deg, #A55A6E 0%, #C9788A 38%, #E09AAA 72%, #F2C8D0 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: `${posX}% ${posY}%`,
        backgroundBlendMode: 'normal',
      }}
    >
      <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${darkness})` }} />
      <div className="absolute inset-0 bg-gradient-to-l from-black/55 via-black/15 to-transparent" />
      <div className="absolute inset-0" style={{ background: `rgba(165,90,110,${rose})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full py-12 pb-28 pt-[calc(5.5rem+env(safe-area-inset-top))] md:py-16 md:pt-[calc(6.5rem+env(safe-area-inset-top))] md:pb-32 flex items-center justify-center min-h-screen text-center">
        <div className="max-w-3xl w-full flex flex-col items-center">

          {/* Badge */}
          {visible(settings, 'hero_badge') && (
            <div className="inline-flex items-center gap-2 bg-black/35 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
              <Heart size={13} className="text-rose-soft fill-rose-soft" />
              <span className="text-sm font-medium text-white">{t(settings, 'hero_badge')}</span>
            </div>
          )}

          {/* Título */}
          {titleLines.length > 0 && (
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 [text-shadow:0_2px_28px_rgba(0,0,0,0.75),0_1px_4px_rgba(0,0,0,0.9)]">
              {titleLines.map((l, i) => (
                <span key={l.key}>
                  <span className={l.className}>{t(settings, l.key)}</span>
                  {i < titleLines.length - 1 && <br />}
                </span>
              ))}
            </h1>
          )}

          {/* Subtítulo */}
          {visible(settings, 'hero_subtitle') && (
            <p className="text-white/95 text-base md:text-lg leading-relaxed mb-10 max-w-xl [text-shadow:0_2px_16px_rgba(0,0,0,0.65)]">
              {t(settings, 'hero_subtitle')}
            </p>
          )}

          {/* Botones */}
          {(showCtaPrimary || showCtaSecondary) && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
              {showCtaPrimary && (
                <button
                  onClick={scrollToContact}
                  className="inline-flex items-center justify-center gap-2 bg-rose-accent hover:bg-rose-dark text-white font-medium px-8 py-3.5 rounded-full transition-all duration-200 hover:shadow-lg active:scale-95"
                >
                  {t(settings, 'hero_cta_primary')}
                  <Heart size={16} className="fill-white text-white shrink-0" />
                </button>
              )}
              {showCtaSecondary && (
                <button
                  onClick={() => document.getElementById('sobre-mi')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-rose-soft/15 border border-rose-soft/85 text-white font-medium px-8 py-3.5 rounded-full transition-all duration-200 active:scale-95"
                >
                  {t(settings, 'hero_cta_secondary')}
                </button>
              )}
            </div>
          )}

          {/* Teaser guía gratuita */}
          {visible(settings, 'hero_teaser') && (
            <button
              onClick={() => document.getElementById('guia-gratuita')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 mt-2 transition-opacity duration-200 hover:opacity-80 active:scale-95"
            >
              <span className="text-xl">🎁</span>
              <span className="text-white/75 text-sm underline underline-offset-2 decoration-white/40">
                {t(settings, 'hero_teaser')}
              </span>
            </button>
          )}

        </div>
      </div>
    </section>
  )
}
