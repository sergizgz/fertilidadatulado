const steps = [
  {
    number: '01',
    title: 'Me contactas',
    description: 'Escríbeme por el formulario o por Instagram. Cuéntame brevemente dónde estás y qué necesitas. Sin compromiso.',
  },
  {
    number: '02',
    title: 'Primera sesión',
    description: 'Nos conocemos en videollamada. Me cuentas tu situación, tus dudas, tu historial. Juntas encontramos el mejor enfoque para ti.',
  },
  {
    number: '03',
    title: 'Te acompaño',
    description: 'Empezamos el acompañamiento adaptado a tu proceso. Con información clara, seguimiento cercano y un canal directo conmigo cuando lo necesites.',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-cream-dark">
      <div className="max-w-5xl mx-auto px-5">
        <div className="text-center mb-14">
          <p className="text-rose-accent font-medium text-sm uppercase tracking-wider mb-3">El proceso</p>
          <h2 className="section-title mb-4">Así es como trabajo</h2>
          <p className="section-subtitle max-w-lg mx-auto">
            Sin burocracia, sin esperas largas. Empezamos cuando tú estés lista.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-rose-medium/30" style={{ left: '16.67%', right: '16.67%' }} />

          {steps.map((step, i) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-rose-soft border-2 border-rose-medium/30 flex items-center justify-center z-10 relative">
                  <span className="font-serif text-lg font-semibold text-rose-accent">{step.number}</span>
                </div>
              </div>
              <h3 className="font-serif text-xl font-medium text-[#2A2A2A] mb-3">{step.title}</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <a
            href="/#contacto"
            onClick={e => { e.preventDefault(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="btn-primary"
          >
            Empezar ahora
          </a>
        </div>
      </div>
    </section>
  )
}
