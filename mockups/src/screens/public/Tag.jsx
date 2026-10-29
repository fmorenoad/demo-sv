import { useEffect, useRef, useState } from 'react'
import { href } from '../../router.jsx'
import { MockNote } from '../../components/ui.jsx'
import ServiceIcon from '../../components/ServiceIcon.jsx'
import '../../tag.css'

const TAG_URL = 'https://www.survias.cl/tag/'
const DISTRIBUTION_URL = TAG_URL + '#puntos-de-distribucion'
const CHECKLIST = [
  'Revisé los documentos exigidos para mi caso en el sitio oficial.',
  'Tengo mi identificación vigente y la documentación del vehículo.',
  'Revisé la modalidad de entrega y las condiciones del contrato.',
  'Elegí un punto de distribución y confirmé su horario.',
]

export default function Tag() {
  const pageRef = useRef(null)
  const [checked, setChecked] = useState([])
  const toggle = (item) => setChecked((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])

  useEffect(() => {
    const root = pageRef.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const targets = [...root.querySelectorAll('.tag-reveal')]
    let observer
    let frame
    let startFrame
    const observe = () => {
      observer?.disconnect()
      cancelAnimationFrame(frame)
      cancelAnimationFrame(startFrame)
      if (motion.matches || typeof window.IntersectionObserver !== 'function') {
        root.classList.remove('reveal-ready')
        return
      }
      const inset = Math.min(64, window.innerHeight * 0.1)
      targets.forEach((element) => {
        const rect = element.getBoundingClientRect()
        element.style.setProperty('--tag-reveal-y', rect.bottom <= inset ? '-28px' : '28px')
        element.classList.remove('is-visible')
      })
      root.classList.add('reveal-ready')
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          entry.target.style.setProperty('--tag-reveal-y', entry.boundingClientRect.bottom <= inset ? '-28px' : '28px')
        }
        entry.target.classList.toggle('is-visible', entry.isIntersecting)
      }), { threshold: 0, rootMargin: `-${inset}px 0px -${inset}px 0px` })
      // Paint the starting pose before observing, including above-the-fold content.
      startFrame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => targets.forEach((element) => observer.observe(element)))
      })
    }
    observe()
    motion.addEventListener?.('change', observe)
    return () => {
      observer?.disconnect()
      cancelAnimationFrame(frame)
      cancelAnimationFrame(startFrame)
      motion.removeEventListener?.('change', observe)
    }
  }, [])

  return <div className="tag-page" ref={pageRef}>
    <section className="tag-hero" aria-labelledby="tag-title">
      <img src="/assets/tag-hero.webp" alt="" className="tag-hero-photo tag-reveal tag-reveal-media" fetchPriority="high" width="2048" height="683" />
      <div className="tag-container tag-hero-content">
        <div className="tag-hero-copy tag-reveal">
          <span className="tag-hero-mark" aria-hidden="true"><ServiceIcon type="tag" /></span>
          <h1 id="tag-title">Obtén tu <span>TAG</span></h1>
          <p className="tag-lead">Prepara tu documentación y elige un punto de distribución de Survías.</p>
          <div className="tag-actions">
            <a href={DISTRIBUTION_URL} target="_blank" rel="noopener noreferrer" className="tag-button tag-primary"><ServiceIcon type="map" /><span>Ver puntos de distribución ↗</span></a>
            <a href={TAG_URL} target="_blank" rel="noopener noreferrer" className="tag-button tag-secondary"><ServiceIcon type="bill" /><span>Requisitos oficiales ↗</span></a>
          </div>
        </div>
      </div>
    </section>

    <div className="tag-container tag-main">
      <div className="tag-top-grid">
        <section className="tag-panel tag-process tag-reveal" aria-labelledby="tag-process-title">
          <h2 id="tag-process-title">Cómo obtener tu TAG</h2>
          <ol className="tag-step-list">
            <li>
              <span className="tag-step-number" aria-hidden="true">1</span>
              <ServiceIcon type="bill" />
              <div><strong>Revisa los requisitos.</strong><p>Consulta la documentación correspondiente a personas naturales, empresas o terceros autorizados.</p></div>
            </li>
            <li>
              <span className="tag-step-number" aria-hidden="true">2</span>
              <ServiceIcon type="map" />
              <div><strong>Elige un punto de distribución.</strong><p>Revisa las ubicaciones y horarios publicados por Survías antes de acudir.</p></div>
            </li>
            <li>
              <span className="tag-step-number" aria-hidden="true">3</span>
              <ServiceIcon type="status" />
              <div><strong>Completa el trámite.</strong><p>Presenta los documentos y revisa las condiciones del contrato con el equipo de atención.</p></div>
            </li>
          </ol>
        </section>

        <section className="tag-panel tag-delivery tag-reveal" aria-labelledby="tag-delivery-title">
          <h2 id="tag-delivery-title">Modalidades de entrega</h2>
          <div className="tag-delivery-grid">
            <article className="tag-delivery-option">
              <ServiceIcon type="tag" />
              <div><h3>Comodato</h3><p>Dispositivo en préstamo, sujeto a los requisitos y condiciones publicados por Survías.</p></div>
            </article>
            <article className="tag-delivery-option">
              <ServiceIcon type="calendar" />
              <div><h3>Arriendo</h3><p>Dispositivo mediante contrato de arriendo. Consulta el monto y las condiciones vigentes antes de contratar.</p></div>
            </article>
          </div>
          <a className="tag-text-link" href={TAG_URL} target="_blank" rel="noopener noreferrer">Revisar modalidades y contratos ↗</a>
        </section>
      </div>

      <div className="tag-bottom-grid">
        <section className="tag-panel tag-visit tag-reveal" aria-labelledby="tag-visit-title">
          <div className="tag-visit-content">
            <h2 id="tag-visit-title">Prepara tu visita</h2>
            <p className="tag-description">Marca lo que ya tienes listo. Esta lista es una ayuda personal; no envía una solicitud.</p>
            <div className="tag-visit-checklist">{CHECKLIST.map((item) => <label key={item}><input type="checkbox" checked={checked.includes(item)} onChange={() => toggle(item)} /><span>{item}</span></label>)}</div>
            <p className={'tag-progress' + (checked.length === CHECKLIST.length ? ' is-complete' : '')} role="status">{checked.length === CHECKLIST.length ? 'Preparación completa. Ya puedes acudir al punto de distribución elegido.' : `${checked.length} de ${CHECKLIST.length} pasos preparados.`}</p>
          </div>
          <img className="tag-visit-illustration" src="/assets/tag-checklist.webp" width="960" height="640" loading="lazy" alt="" />
        </section>

        <section className="tag-panel tag-account tag-reveal" aria-labelledby="tag-account-title">
          <img src="/assets/tag-windshield.webp" alt="" width="1600" height="533" loading="lazy" className="tag-account-photo" />
          <div className="tag-account-content">
            <h2 id="tag-account-title">¿Ya tienes un TAG?</h2>
            <p className="tag-description">Consulta su estado en el servicio oficial o accede a tu cuenta para gestionar tus vehículos.</p>
            <div className="tag-actions">
              <a className="tag-button tag-secondary" href="https://oficina-virtual.survias.cl/consulta-transitos" target="_blank" rel="noopener noreferrer"><ServiceIcon type="status" /><span>Estado de tu TAG ↗</span></a>
              <a className="tag-button tag-primary" href={href('login')}><ServiceIcon type="account" /><span>Mi Oficina Virtual</span></a>
            </div>
            <a className="tag-text-link tag-return" href={TAG_URL + '#devolver-tag'} target="_blank" rel="noopener noreferrer">Cómo devolver tu dispositivo ↗</a>
          </div>
        </section>
      </div>
      <div className="tag-note tag-reveal"><MockNote>Demo de orientación. Los enlaces abren los servicios oficiales de Survías; obtener un TAG requiere completar el trámite con la concesionaria.</MockNote></div>
    </div>
  </div>
}
