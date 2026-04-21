import SEO from '../components/SEO'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Services from '../sections/Services'
import HowItWorks from '../sections/HowItWorks'
import Testimonials from '../sections/Testimonials'
import BlogPreview from '../sections/BlogPreview'
import Contact from '../sections/Contact'

export default function Home() {
  return (
    <>
      <SEO
        description="Lidia, enfermera especialista en reproducción asistida con +15 años de experiencia. Acompañamiento personalizado en fertilidad, FIV/IA y búsqueda de embarazo. Atención online."
        canonical="/"
      />
      <Hero />
      <About />
      <Services />
      <HowItWorks />
      <Testimonials />
      <BlogPreview />
      <Contact />
    </>
  )
}
