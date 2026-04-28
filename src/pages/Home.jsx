import SEO from '../components/SEO'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Services from '../sections/Services'
import HowItWorks from '../sections/HowItWorks'
import Testimonials from '../sections/Testimonials'
import LeadMagnet from '../sections/LeadMagnet'
import BlogPreview from '../sections/BlogPreview'
import Contact from '../sections/Contact'
import { useSiteSettings } from '../hooks/useSiteSettings'

export default function Home() {
  const { settings } = useSiteSettings()

  // Devuelve true si la sección es visible (por defecto sí, salvo que esté explícitamente en '0')
  const vis = (key) => settings[`section_${key}_visible`] !== '0'

  return (
    <>
      <SEO
        description="Lidia, enfermera especialista en reproducción asistida con +15 años de experiencia. Acompañamiento personalizado en fertilidad, FIV/IA y búsqueda de embarazo. Atención online."
        canonical="/"
      />
      <Hero />
      {vis('about')        && <About />}
      {vis('services')     && <Services />}
      {vis('howitworks')   && <HowItWorks />}
      {vis('testimonials') && <Testimonials />}
      {vis('leadmagnet')   && <LeadMagnet />}
      {vis('blogpreview')  && <BlogPreview />}
      {vis('contact')      && <Contact />}
    </>
  )
}
