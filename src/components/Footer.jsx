import { Link } from 'react-router-dom'
import { AtSign, Mail } from 'lucide-react'

function LogoIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="3.5" fill="none" />
      <path d="M50 48 C50 48 36 38 36 28 C36 22 41 18 46 21 C48 22 49 24 50 26 C51 24 52 22 54 21 C59 18 64 22 64 28 C64 38 50 48 50 48Z" fill="currentColor" opacity="0.9" />
      <line x1="50" y1="48" x2="50" y2="72" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 62 C50 62 40 58 38 52 C42 52 48 56 50 62Z" fill="currentColor" />
      <path d="M50 62 C50 62 60 58 62 52 C58 52 52 56 50 62Z" fill="currentColor" />
    </svg>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#2A2A2A] text-white/70 pt-14 pb-8">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <LogoIcon size={30} />
              <span className="font-serif text-white text-lg">
                Fertilidad <span className="text-rose-soft">a Tu Lado</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Acompañamiento especializado en fertilidad y reproducción asistida. Porque este camino no deberías recorrerlo sola.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Navegación</h4>
            <ul className="space-y-2 text-sm">
              {['Sobre mí', 'Servicios', 'Cómo funciona', 'Testimonios', 'Contacto'].map(item => (
                <li key={item}>
                  <a
                    href={`/#${item.toLowerCase().replace(' ', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}
                    className="hover:text-rose-soft transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://www.instagram.com/fertilidad_atulado/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-rose-soft transition-colors">
                  <AtSign size={16} />
                  @fertilidad_atulado
                </a>
              </li>
              <li>
                <a href="mailto:hola@fertilidadatulado.es" className="flex items-center gap-2 hover:text-rose-soft transition-colors">
                  <Mail size={16} />
                  hola@fertilidadatulado.es
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <span>© {year} Fertilidad a Tu Lado · Lidia</span>
          <div className="flex gap-6">
            <Link to="/aviso-legal" className="hover:text-white/70 transition-colors">Aviso Legal</Link>
            <Link to="/privacidad" className="hover:text-white/70 transition-colors">Privacidad</Link>
            <Link to="/cookies" className="hover:text-white/70 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
