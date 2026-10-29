import { useEffect, useRef } from 'react'
import ServiceIcon from '../../components/ServiceIcon.jsx'
import CustomerServices from '../../components/CustomerServices.jsx'
import { href } from '../../router.jsx'
import { Card, MockNote } from '../../components/ui.jsx'
import SocialFeed from '../../components/SocialFeed.jsx'
import { TRABAJOS, INCIDENTES, FAQ } from '../../data/mock.js'

const SERVICES = [
  { route: 'tarifas', icon: 'calculator', title: 'Tarifas y simulador', text: 'Consulta las tarifas por categoría y calcula el costo de tu recorrido.', label: 'Calcular viaje' },
  { route: 'tag', icon: 'tag', title: 'Obtén tu TAG', text: 'Solicita tu dispositivo y conoce cómo habilitarlo para circular por la ruta.', label: 'Conocer el servicio' },
  { route: 'login', icon: 'account', title: 'Oficina Virtual', text: 'Revisa tus tránsitos, paga tus cuentas y administra tus vehículos.', label: 'Ingresar a mi cuenta' },
]
export default function Inicio() {
  const homeRef = useRef(null)
  const alerta = INCIDENTES.find((i) => i.nivel !== 'ok')

  useEffect(() => {
    const root = homeRef.current
    if (!root) return undefined
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const targets = [...root.querySelectorAll('.home-copy-content, .route-card-content, .home-cover, .route-notice, .customer-service, .official-story, .social-feed, .service-link, .home-information .card, .subscription-strip')]
    let observer

    targets.forEach((element, index) => {
      element.classList.add('home-reveal')
      element.style.setProperty('--reveal-delay', `${(index % 6) * 45}ms`)
    })

    const showAll = () => {
      root.classList.remove('reveal-ready')
      targets.forEach((element) => element.classList.add('is-visible'))
    }

    const observe = () => {
      if (motion.matches || !('IntersectionObserver' in window)) {
        showAll()
        return
      }
      targets.forEach((element) => {
        const rect = element.getBoundingClientRect()
        element.classList.toggle('is-visible', rect.top < window.innerHeight && rect.bottom > 0)
      })
      root.classList.add('reveal-ready')
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting))
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' })
      targets.forEach((element) => observer.observe(element))
    }

    const handleMotionChange = () => {
      observer?.disconnect()
      observer = undefined
      observe()
    }

    observe()
    motion.addEventListener?.('change', handleMotionChange)
    return () => {
      observer?.disconnect()
      motion.removeEventListener?.('change', handleMotionChange)
      root.classList.remove('reveal-ready')
      targets.forEach((element) => {
        element.classList.remove('home-reveal', 'is-visible')
        element.style.removeProperty('--reveal-delay')
      })
    }
  }, [])

  return (
    <main ref={homeRef} className="home">
      <section className="home-intro" aria-labelledby="home-title">
        <div className="home-copy home-photo-copy">
          <img className="home-cover" src="/assets/ruta-survias.png" alt="Ruta entre campos y cordillera, imagen del sitio oficial de Survías" width="1536" height="1024" />
          <div className="home-copy-content">
            <p className="eyebrow">Ruta 5 · tramo Talca — Chillán</p>
            <h1 id="home-title">Tu ruta.<br />Todo más <span>simple.</span></h1>
            <p className="home-lead">Información para tu viaje, servicios para tu cuenta y toda la gestión en un solo lugar.</p>
            <div className="hero-ctas"><a href={href('login')} className="btn primary">Ingresar a la Oficina Virtual <span aria-hidden="true">→</span></a><a href={href('sin-tag')} className="btn hero-secondary">Pasé sin TAG <span aria-hidden="true">→</span></a></div>
          </div>
        </div>
        <aside className="route-overview" aria-labelledby="route-title">
          <div className="route-card-content">
            <div className="overview-head">
              <div className="route-card-title"><span className="route-card-icon" aria-hidden="true"><svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8 24 12 4m8 20L16 4M9.5 17h9M11 10h6" /><path d="M4 24h20" /></svg></span><h2 id="route-title">Estado de la ruta</h2></div>
              <span className="route-demo"><strong>Demo</strong><span>12:40 h</span></span>
            </div>
            <div className="route-endpoints"><span>Talca</span><span className="route-number">5</span><span>Chillán</span></div>
            <div className="route-track" aria-hidden="true"><span /><span /><span /></div>
            <div className="route-segments">
              {INCIDENTES.map((i) => <a href={href('ruta')} key={i.id} className={'route-row status-' + i.nivel}>
                <span className={'route-status-icon ' + i.nivel} aria-hidden="true">{i.nivel === 'ok' ? <svg viewBox="0 0 20 20"><path d="m5 10 3 3 7-7" /></svg> : <svg viewBox="0 0 20 20"><path d="M3 15h14M6 15 8 5h4l2 10M7 11h6" /></svg>}</span>
                <span><strong>{i.tramo}</strong><small>{i.tipo}</small></span><span className="route-row-arrow" aria-hidden="true">→</span>
              </a>)}
            </div>
            <a href={href('ruta')} className="text-link overview-link">Ver estado y avisos <span className="overview-arrow" aria-hidden="true">→</span></a>
          </div>
        </aside>
      </section>
      <div className="home-container">
        {alerta && <div className="route-notice"><ServiceIcon type="roadworks" /><span className="notice-label">Aviso en ruta</span><p><strong>{alerta.tipo} en {alerta.tramo}.</strong> {alerta.texto}</p><a href={href('ruta')}>Ver detalle <span aria-hidden="true">→</span></a></div>}
        <CustomerServices />
      </div>
      <div className="official-updates home-container">
        <article className="official-story"><p className="eyebrow">Comunidad y seguridad vial</p><h2>Juntos por rutas más seguras</h2><a href="https://www.survias.cl/wp-content/uploads/2026/09/Imagen-Actividad-MOP.png" target="_blank" rel="noopener noreferrer"><img src="/assets/actividad-mop.png" alt="Comunicado oficial sobre actividad de seguridad vial del Ministerio de Obras Públicas con apoyo de Survías. Abrir imagen para leer el detalle." loading="lazy" width="1196" height="378" /></a><p className="small muted">Una actividad del Ministerio de Obras Públicas, con apoyo de Survías, para promover la seguridad vial entre los conductores.</p><a className="text-link" href="https://www.survias.cl/" target="_blank" rel="noopener noreferrer">Información del sitio oficial <span aria-hidden="true">↗</span></a></article>
        <SocialFeed />
      </div>
      <div className="home-management home-container">
        <section className="home-services" aria-labelledby="services-title">
          <div className="section-heading"><div><p className="eyebrow">Trámites y gestión</p><h2 id="services-title">Servicios en línea</h2></div><p className="small muted">Realiza tus trámites y consultas de forma rápida y segura.</p></div>
          <div className="service-grid">{SERVICES.map((s) => <a key={s.route} className="service-link" href={href(s.route)}><div className="online-service-heading"><ServiceIcon type={s.icon} /></div><h3>{s.title}</h3><p>{s.text}</p><span className="service-action">{s.label} <span aria-hidden="true">→</span></span></a>)}</div>
        </section>
        <section className="home-information" aria-labelledby="information-title">
          <h2 id="information-title">Información útil</h2>
          <Card title={<span className="heading-with-icon"><ServiceIcon type="roadworks" />Trabajos programados</span>} right={<a href={href('ruta')} className="small">Ver calendario →</a>}>
            {TRABAJOS.slice(0, 2).map((w) => <div className="work-item" key={w.id}><div className="when">{w.cuando}</div><div><h4>{w.titulo}</h4><p className="small muted">{w.detalle}</p></div></div>)}
          </Card>
          <Card title="Preguntas frecuentes" right={<a href={href('ayuda')} className="small">Ver todas →</a>}>
            {FAQ.slice(0, 3).map((f) => <details key={f.q} className="faq"><summary>{f.q}</summary><p className="small muted">{f.a}</p></details>)}
          </Card>
        </section>
      </div>
      <div className="home-container">
        <section className="subscription-strip"><div><p className="eyebrow">Tu ruta, a tiempo</p><h2>Recibe avisos de trabajos e incidentes<br />en tu tramo habitual.</h2></div><div className="subscription-action"><a href={href('ruta')} className="btn ghost">Configurar avisos <span aria-hidden="true">→</span></a><p className="xsmall">Personaliza tus preferencias y viaja más informado.</p></div></section>
        <MockNote>Propuesta de experiencia digital para Survías. Prototipo navegable con datos de ejemplo.</MockNote>
      </div>
    </main>
  )
}






