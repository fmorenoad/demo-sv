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
  const alerta = INCIDENTES.find((i) => i.nivel !== 'ok')
  return (
    <main className="wrap home">
      <section className="home-intro" aria-labelledby="home-title">
        <div className="home-copy home-photo-copy">
          <img className="home-cover" src="/assets/ruta-survias.png" alt="Ruta entre campos y cordillera, imagen del sitio oficial de Survías" width="1536" height="1024" />
          <div className="home-copy-content">
          <p className="eyebrow">Ruta 5 / Talca — Chillán</p>
          <h1 id="home-title">Tu ruta.<br />Todo más simple.</h1>
          <p className="home-lead">Información para tu viaje y servicios para tu cuenta, en un solo lugar.</p>
          <div className="hero-ctas"><a href={href('login')} className="btn primary">Ingresar a la Oficina Virtual <span aria-hidden="true">↗</span></a><a href={href('sin-tag')} className="text-link">Pasé sin TAG <span aria-hidden="true">→</span></a></div>
          <p className="home-caption">Conectamos las regiones del Maule y Ñuble.</p>
          </div>
        </div>
        <aside className="route-overview" aria-labelledby="route-title">
          <div className="overview-head"><h2 id="route-title">Estado de la ruta</h2><span className="xsmall muted">Demo · 12:40 h</span></div>
          <div className="route-endpoints"><span>Talca</span><span className="route-number">5</span><span>Chillán</span></div>
          <div className="route-track" aria-hidden="true"><span /><span /><span /></div>
          {INCIDENTES.map((i) => <div key={i.id} className="route-row"><span className={'dot ' + i.nivel} /><div><strong>{i.tramo}</strong><span className="small muted">{i.tipo}</span></div></div>)}
          <a href={href('ruta')} className="text-link overview-link">Ver estado y avisos <span aria-hidden="true">→</span></a>
        </aside>
      </section>
      {alerta && <div className="route-notice"><span className="notice-label">Aviso en ruta</span><p><strong>{alerta.tipo} en {alerta.tramo}.</strong> {alerta.texto}</p><a href={href('ruta')}>Ver detalle <span aria-hidden="true">→</span></a></div>}
      <CustomerServices />
      <section className="home-services" aria-labelledby="services-title">
        <div className="section-heading"><h2 id="services-title">Servicios en línea</h2><p className="small muted">Gestiones simples, donde estés.</p></div>
        <div className="service-grid">{SERVICES.map((s, index) => <a key={s.route} className="service-link" href={href(s.route)}><div className="online-service-heading"><ServiceIcon type={s.icon} /><span className="service-number" aria-hidden="true">0{index + 1}</span></div><h3>{s.title}</h3><p>{s.text}</p><span className="service-action">{s.label} <span aria-hidden="true">↗</span></span></a>)}</div>
      </section>
      <section className="home-information grid cols-2">
        <Card title={<span className="heading-with-icon"><ServiceIcon type="roadworks" />Trabajos programados</span>} right={<a href={href('ruta')} className="small">Ver calendario →</a>}>
          {TRABAJOS.slice(0, 2).map((w) => <div className="work-item" key={w.id}><div className="when">{w.cuando}</div><div><h4>{w.titulo}</h4><p className="small muted">{w.detalle}</p></div></div>)}
        </Card>
        <Card title="Preguntas frecuentes" right={<a href={href('ayuda')} className="small">Ver todas →</a>}>
          {FAQ.slice(0, 3).map((f) => <details key={f.q} className="faq"><summary>{f.q}</summary><p className="small muted">{f.a}</p></details>)}
        </Card>
      </section>
      <div className="official-updates">
        <article className="official-story"><p className="eyebrow">Comunidad y seguridad vial</p><h2>Juntos por rutas más seguras</h2><a href="https://www.survias.cl/wp-content/uploads/2026/09/Imagen-Actividad-MOP.png" target="_blank" rel="noopener noreferrer"><img src="/assets/actividad-mop.png" alt="Comunicado oficial sobre actividad de seguridad vial del Ministerio de Obras Públicas con apoyo de Survías. Abrir imagen para leer el detalle." loading="lazy" width="1196" height="378" /></a><p className="small muted">Una actividad del Ministerio de Obras Públicas, con apoyo de Survías, para promover la seguridad vial entre los conductores.</p><a className="text-link" href="https://www.survias.cl/" target="_blank" rel="noopener noreferrer">Información del sitio oficial <span aria-hidden="true">↗</span></a></article>
        <SocialFeed />
      </div>
      <section className="subscription-strip"><div><h2>Información de tu ruta, a tiempo.</h2><p className="muted small">Recibe avisos de trabajos e incidentes en tu tramo habitual.</p></div><a href={href('ruta')} className="btn ghost">Configurar avisos <span aria-hidden="true">→</span></a></section>
      <MockNote>Propuesta de experiencia digital para Survías. Prototipo navegable con datos de ejemplo.</MockNote>
    </main>
  )
}






