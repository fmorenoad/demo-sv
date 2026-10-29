import { useEffect, useRef, useState } from 'react'
import { href } from '../../router.jsx'
import { Badge, MockNote } from '../../components/ui.jsx'
import Chatbot from '../../components/Chatbot.jsx'
import ServiceIcon from '../../components/ServiceIcon.jsx'
import { FAQ } from '../../data/mock.js'
import '../../ayuda.css'

const PUBLICAS = [
  'Simulador de costo de viaje por categoría y tramo',
  'TAG: cómo arrendarlo y qué hacer si pasaste sin él',
  'Gratuidad lateral: quiénes aplican y cómo acreditarla',
  'Estado de ruta y trabajos programados, con hora de actualización',
]
const PRIVADAS = [
  'Explicación de cobros y tránsitos en lenguaje simple',
  'Pago y repactación guiados (cierre en pantalla segura)',
  'Autofacturación de tránsitos no facturados',
  'Seguimiento de requerimientos por folio',
  'Resumen proactivo al ingresar y accesos rápidos',
  'Suscripción a avisos por tramo',
]

const SHORTCUTS = [
  { label: 'TAG', route: 'tag', icon: 'tag' },
  { label: 'Pasé sin TAG', route: 'sin-tag', icon: 'car' },
  { label: 'Tarifas', route: 'tarifas', icon: 'payment' },
  { label: 'Estado de ruta', route: 'ruta', icon: 'map' },
  { label: 'Oficina Virtual', route: 'login', icon: 'account' },
]
const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

export default function Ayuda() {
  const pageRef = useRef(null)
  const [query, setQuery] = useState('')
  const results = FAQ.filter((item) => normalize(item.q + ' ' + item.a).includes(normalize(query)))

  useEffect(() => {
    const root = pageRef.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const targets = [...root.querySelectorAll('.ayuda-reveal')]
    let observer
    const observe = () => {
      observer?.disconnect()
      if (motion.matches || !('IntersectionObserver' in window)) {
        root.classList.remove('reveal-ready')
        return
      }
      targets.forEach((element) => {
        const rect = element.getBoundingClientRect()
        element.classList.toggle('is-visible', rect.top < window.innerHeight && rect.bottom > 0)
      })
      root.classList.add('reveal-ready')
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting)
      }), { threshold: 0.04 })
      targets.forEach((element) => observer.observe(element))
    }
    observe()
    motion.addEventListener?.('change', observe)
    return () => {
      observer?.disconnect()
      motion.removeEventListener?.('change', observe)
    }
  }, [])

  const search = (event) => {
    event.preventDefault()
    document.getElementById('ayuda-faq-title')?.focus({ preventScroll: true })
    document.getElementById('ayuda-faq')?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  return <div className="ayuda-page" ref={pageRef}>
    <section className="ayuda-hero" aria-labelledby="ayuda-title">
      <img src="/assets/ayuda-hero.webp" alt="" width="2048" height="683" fetchPriority="high" className="ayuda-hero-photo" />
      <div className="ayuda-container ayuda-hero-content">
        <div className="ayuda-hero-copy ayuda-reveal">
          <ServiceIcon type="shield" />
          <h1 id="ayuda-title">Ayuda</h1>
          <p className="ayuda-lead">Preguntas frecuentes, canales de atención y asistente virtual.</p>
          <form className="ayuda-search" role="search" onSubmit={search}>
            <label className="sr-only" htmlFor="ayuda-search">Preguntas frecuentes</label>
            <ServiceIcon type="bill" />
            <input id="ayuda-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Preguntas frecuentes" aria-controls="ayuda-faq-results" />
            <button type="submit">Buscar</button>
          </form>
        </div>
      </div>
    </section>

    <div className="ayuda-container ayuda-main">
      <nav className="ayuda-shortcuts ayuda-reveal" aria-label="Ayuda">
        {SHORTCUTS.map((item) => <a key={item.route} href={href(item.route)}><ServiceIcon type={item.icon} /><span>{item.label}</span></a>)}
      </nav>
      <div className="ayuda-layout">
        <div className="ayuda-content">
          <section className="ayuda-panel ayuda-faq ayuda-reveal" id="ayuda-faq" aria-labelledby="ayuda-faq-title">
            <h2 id="ayuda-faq-title" tabIndex="-1">Preguntas frecuentes</h2>
            <div id="ayuda-faq-results">
              {results.map((item) => <details key={item.q} className="ayuda-question"><summary>{item.q}</summary><p>{item.a}</p></details>)}
              {results.length === 0 && <p className="ayuda-empty" role="status">No se encontraron preguntas.</p>}
            </div>
          </section>

          <section className="ayuda-panel ayuda-reveal" aria-labelledby="ayuda-channels-title">
            <h2 id="ayuda-channels-title">Canales de atención</h2>
            <div className="ayuda-channels">
              <div className="ayuda-channel"><ServiceIcon type="account" /><div><strong>600 006 2030</strong><span>Asistencia comercial</span></div></div>
              <div className="ayuda-channel"><ServiceIcon type="shield" /><div><strong>600 252 6000</strong><span>Emergencias 24/7</span></div></div>
              <div className="ayuda-channel"><ServiceIcon type="bill" /><div><strong>Reclamos y sugerencias</strong><span>Con sesión, en <a href={href('login')}>Mis interacciones</a></span></div></div>
            </div>
            <p className="ayuda-footnote">Los reclamos se responden en un plazo máximo de 5 días hábiles según el Reglamento de Servicio de la Obra.</p>
          </section>

          <section className="ayuda-panel ayuda-reveal" aria-labelledby="ayuda-capabilities-title">
            <h2 id="ayuda-capabilities-title">Qué puede hacer el asistente</h2>
            <div className="ayuda-capabilities">
              <div className="ayuda-capability-group">
                <div className="ayuda-capability-heading"><strong>Sin iniciar sesión</strong><Badge tone="info">Público</Badge></div>
                {PUBLICAS.map((capability) => <div className="ayuda-capability" key={capability}><ServiceIcon type="route" /><span>{capability}</span></div>)}
              </div>
              <div className="ayuda-capability-group">
                <div className="ayuda-capability-heading"><strong>Con sesión iniciada</strong><Badge tone="warn">Autenticado</Badge></div>
                {PRIVADAS.map((capability) => <div className="ayuda-capability" key={capability}><ServiceIcon type="shield" /><span>{capability}</span></div>)}
              </div>
            </div>
            <p className="ayuda-footnote ayuda-security">
              Handoff seguro: el asistente orienta y prepara, pero no confirma pagos ni pide claves o datos de tarjeta.
              Continuidad: puede generar un folio y derivar a un ejecutivo con el contexto cargado.
            </p>
          </section>
        </div>
        <aside className="ayuda-assistant ayuda-reveal"><Chatbot embedded defaultOpen /></aside>
      </div>
      <div className="ayuda-note ayuda-reveal"><MockNote><strong>Mockup de Ayuda.</strong> El asistente es un servicio contratado que responde solo sobre contenidos aprobados por Survías.</MockNote></div>
    </div>
  </div>
}
