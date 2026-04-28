import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

const DEFAULT_SECTIONS = [
  { title: 'Responsable del Tratamiento', content: 'Nombre: Fertilidad a Tu Lado\nCorreo: hola@fertilidadatulado.com' },
  { title: 'Datos que recopilamos', content: 'Únicamente los datos necesarios para atender tu consulta o solicitud:\n• Nombre\n• Correo electrónico\n• Información que compartas voluntariamente en tu mensaje' },
  { title: 'Finalidad del tratamiento', content: 'Utilizamos tus datos exclusivamente para:\n• Responder a tus consultas\n• Gestionar solicitudes de acompañamiento\n• Mantener comunicación para resolver dudas relacionadas con nuestros servicios' },
  { title: 'Legitimación', content: 'La base legal para el tratamiento es tu consentimiento, otorgado al enviar el formulario.' },
  { title: 'Conservación de los datos', content: 'Tus datos se conservarán únicamente durante el tiempo necesario para responder tu consulta o mientras exista una relación profesional. Posteriormente serán eliminados de manera segura.' },
  { title: 'Destinatarios', content: 'No compartimos tus datos con terceros. No cedemos, vendemos ni transferimos información personal.' },
  { title: 'Tus derechos', content: 'Puedes ejercer tus derechos en cualquier momento:\n• Acceso\n• Rectificación\n• Supresión\n• Limitación\n• Portabilidad\n• Oposición\n\nPara ejercerlos, escribe a: hola@fertilidadatulado.com' },
  { title: 'Medidas de seguridad', content: 'Aplicamos medidas técnicas y organizativas adecuadas para garantizar la seguridad y confidencialidad de tus datos.' },
  { title: 'Reclamaciones', content: 'Si consideras que tus derechos no han sido respetados, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).' },
]

// Renderiza el texto plano: líneas con • → lista, resto → párrafos
function RenderContent({ text }) {
  const lines = text.split('\n')
  const elements = []
  let bulletBuffer = []

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return
    elements.push(
      <ul key={`ul-${elements.length}`} className="space-y-1.5 mt-1">
        {bulletBuffer.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-accent shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    )
    bulletBuffer = []
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
      bulletBuffer.push(trimmed.replace(/^[•\-]\s*/, ''))
    } else if (trimmed === '') {
      flushBullets()
    } else {
      flushBullets()
      elements.push(<p key={`p-${i}`} className={elements.length > 0 ? 'mt-2' : ''}>{trimmed}</p>)
    }
  })
  flushBullets()

  return <>{elements}</>
}

export default function Privacidad() {
  const [sections, setSections] = useState(DEFAULT_SECTIONS)
  const [lastUpdated, setLastUpdated] = useState('enero 2025')

  useEffect(() => {
    window.scrollTo(0, 0)
    supabase.from('site_settings').select('key, value')
      .in('key', ['privacy_sections', 'privacy_last_updated'])
      .then(({ data }) => {
        if (!data) return
        const map = Object.fromEntries(data.map(r => [r.key, r.value]))
        try {
          const parsed = map.privacy_sections ? JSON.parse(map.privacy_sections) : null
          if (Array.isArray(parsed) && parsed.length) setSections(parsed)
        } catch { /**/ }
        if (map.privacy_last_updated) setLastUpdated(map.privacy_last_updated)
      })
  }, [])

  return (
    <>
      <SEO
        title="Política de Privacidad"
        description="Política de privacidad de Fertilidad a Tu Lado — cómo tratamos tus datos personales conforme al RGPD y la LOPDGDD."
        canonical="/privacidad"
      />

      {/* Hero */}
      <div className="bg-cream-dark border-b border-cream-darker/40">
        <div className="max-w-3xl mx-auto px-5 py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-accent mb-3">Legal</p>
          <h1 className="font-serif text-3xl md:text-4xl text-[#2A2A2A] mb-4">Política de Privacidad</h1>
          <p className="text-[#6B6B6B] text-sm leading-relaxed max-w-xl">
            En cumplimiento del Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica de
            Protección de Datos y Garantía de Derechos Digitales (LOPDGDD), te informamos sobre cómo
            tratamos tus datos cuando contactas con nosotros.
          </p>
          <p className="text-xs text-[#9B9B9B] mt-4">Última actualización: {lastUpdated}</p>
        </div>
      </div>

      {/* Secciones */}
      <div className="max-w-3xl mx-auto px-5 py-12 md:py-16">
        <div className="space-y-4">
          {sections.map((section, i) => (
            <div key={i} className="bg-white border border-cream-darker/30 rounded-2xl overflow-hidden">
              <div className="flex items-start gap-4 p-6">
                <span className="font-serif text-2xl font-bold text-rose-soft shrink-0 leading-none mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif text-lg font-semibold text-[#2A2A2A] mb-3">
                    {section.title}
                  </h2>
                  <div className="text-sm text-[#6B6B6B] leading-relaxed">
                    <RenderContent text={section.content} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pie */}
        <div className="mt-10 pt-8 border-t border-cream-darker/40 flex flex-wrap gap-4 items-center justify-between">
          <Link to="/" className="text-sm text-rose-accent hover:text-rose-dark font-medium transition-colors">
            ← Volver al inicio
          </Link>
          <div className="flex gap-4 text-xs text-[#9B9B9B]">
            <Link to="/aviso-legal" className="hover:text-rose-accent transition-colors">Aviso Legal</Link>
            <Link to="/cookies" className="hover:text-rose-accent transition-colors">Política de Cookies</Link>
          </div>
        </div>
      </div>
    </>
  )
}
