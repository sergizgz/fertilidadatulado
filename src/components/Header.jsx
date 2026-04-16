import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

function LogoIcon({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="3.5" fill="none" />
      <path
        d="M50 48 C50 48 36 38 36 28 C36 22 41 18 46 21 C48 22 49 24 50 26 C51 24 52 22 54 21 C59 18 64 22 64 28 C64 38 50 48 50 48Z"
        fill="currentColor"
        opacity="0.9"
      />
      <line x1="50" y1="48" x2="50" y2="72" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 62 C50 62 40 58 38 52 C42 52 48 56 50 62Z" fill="currentColor" />
      <path d="M50 62 C50 62 60 58 62 52 C58 52 52 56 50 62Z" fill="currentColor" />
    </svg>
  )
}

const navLinks = [
  { label: 'Sobre mí', href: '/#sobre-mi' },
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Cómo funciona', href: '/#como-funciona' },
  { label: 'Testimonios', href: '/#testimonios' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  const handleNavClick = (e, href) => {
    if (href.startsWith('/#')) {
      e.preventDefault()
      const id = href.replace('/#', '')
      if (location.pathname !== '/') {
        window.location.href = href
        return
      }
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      setOpen(false)
    }
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 bg-cream/95 backdrop-blur-md ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16 md:h-20">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <LogoIcon size={34} className="text-rose-accent transition-colors duration-300" />
          <span className="font-serif font-medium text-lg leading-tight text-[#2A2A2A]">
            Fertilidad
            <span className="text-rose-accent"> a Tu Lado</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => handleNavClick(e, link.href)}
              className="hover:text-rose-accent transition-colors text-sm font-medium text-[#6B6B6B]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#contacto"
            onClick={e => handleNavClick(e, '/#contacto')}
            className="text-sm font-medium px-5 py-2.5 rounded-full bg-rose-accent text-white hover:bg-rose-dark transition-all duration-200 active:scale-95"
          >
            Contactar
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-1 text-[#2A2A2A]"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-cream/98 backdrop-blur-md border-t border-cream-darker/30 px-5 py-6 flex flex-col gap-5">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => handleNavClick(e, link.href)}
              className="text-[#2A2A2A] font-medium text-base"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#contacto"
            onClick={e => handleNavClick(e, '/#contacto')}
            className="btn-primary justify-center mt-2"
          >
            Contactar
          </a>
        </div>
      )}
    </header>
  )
}
