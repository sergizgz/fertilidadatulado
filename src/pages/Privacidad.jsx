import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const SECTIONS = [
  {
    number: '01',
    title: 'Responsable del Tratamiento',
    content: (
      <div className="space-y-1">
        <p><span className="font-medium text-[#4A4A4A]">Nombre:</span> Fertilidad a Tu Lado</p>
        <p><span className="font-medium text-[#4A4A4A]">Correo:</span>{' '}
          <a href="mailto:hola@fertilidadatulado.com" className="text-rose-accent hover:text-rose-dark underline underline-offset-2">
            hola@fertilidadatulado.com
          </a>
        </p>
      </div>
    ),
  },
  {
    number: '02',
    title: 'Datos que recopilamos',
    content: (
      <div className="space-y-2">
        <p>Únicamente los datos necesarios para atender tu consulta o solicitud:</p>
        <ul className="space-y-1.5 mt-2">
          {['Nombre', 'Correo electrónico', 'Información que compartas voluntariamente en tu mensaje'].map(item => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-accent shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    number: '03',
    title: 'Finalidad del tratamiento',
    content: (
      <div className="space-y-2">
        <p>Utilizamos tus datos exclusivamente para:</p>
        <ul className="space-y-1.5 mt-2">
          {[
            'Responder a tus consultas',
            'Gestionar solicitudes de acompañamiento',
            'Mantener comunicación para resolver dudas relacionadas con nuestros servicios',
          ].map(item => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-accent shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    number: '04',
    title: 'Legitimación',
    content: (
      <p>La base legal para el tratamiento es tu consentimiento, otorgado al enviar el formulario.</p>
    ),
  },
  {
    number: '05',
    title: 'Conservación de los datos',
    content: (
      <p>Tus datos se conservarán únicamente durante el tiempo necesario para responder tu consulta o mientras exista una relación profesional. Posteriormente serán eliminados de manera segura.</p>
    ),
  },
  {
    number: '06',
    title: 'Destinatarios',
    content: (
      <p>No compartimos tus datos con terceros. No cedemos, vendemos ni transferimos información personal.</p>
    ),
  },
  {
    number: '07',
    title: 'Tus derechos',
    content: (
      <div className="space-y-2">
        <p>Puedes ejercer tus derechos en cualquier momento:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
          {['Acceso', 'Rectificación', 'Supresión', 'Limitación', 'Portabilidad', 'Oposición'].map(right => (
            <div key={right} className="flex items-center gap-2 bg-cream rounded-lg px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-accent shrink-0" />
              <span className="text-sm text-[#4A4A4A]">{right}</span>
            </div>
          ))}
        </div>
        <p className="mt-3">Para ejercerlos, escribe a:{' '}
          <a href="mailto:hola@fertilidadatulado.com" className="text-rose-accent hover:text-rose-dark underline underline-offset-2">
            hola@fertilidadatulado.com
          </a>
        </p>
      </div>
    ),
  },
  {
    number: '08',
    title: 'Medidas de seguridad',
    content: (
      <p>Aplicamos medidas técnicas y organizativas adecuadas para garantizar la seguridad y confidencialidad de tus datos.</p>
    ),
  },
  {
    number: '09',
    title: 'Reclamaciones',
    content: (
      <p>Si consideras que tus derechos no han sido respetados, puedes presentar una reclamación ante la{' '}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-rose-accent hover:text-rose-dark underline underline-offset-2">
          Agencia Española de Protección de Datos (AEPD)
        </a>.
      </p>
    ),
  },
]

export default function Privacidad() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

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
          <p className="text-xs text-[#9B9B9B] mt-4">Última actualización: enero 2025</p>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-3xl mx-auto px-5 py-12 md:py-16">
        <div className="space-y-4">
          {SECTIONS.map((section) => (
            <div key={section.number} className="bg-white border border-cream-darker/30 rounded-2xl overflow-hidden">
              <div className="flex items-start gap-4 p-6">
                <span className="font-serif text-2xl font-bold text-rose-soft shrink-0 leading-none mt-0.5">
                  {section.number}
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif text-lg font-semibold text-[#2A2A2A] mb-3">
                    {section.title}
                  </h2>
                  <div className="text-sm text-[#6B6B6B] leading-relaxed">
                    {section.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Volver */}
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
