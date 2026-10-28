import ServiceIcon from './ServiceIcon.jsx'
import { href } from '../router.jsx'

const LINKS = [
  { icon: 'tag', title: 'Obtén tu TAG', text: 'Revisa los requisitos y encuentra un punto de distribución.', url: href('tag'), action: 'Cómo obtenerlo' },
  { icon: 'status', title: 'Estado de tu TAG', text: 'Accede a la consulta oficial de Survías.', url: 'https://oficina-virtual.survias.cl/consulta-transitos', action: 'Consultar estado' },
  { icon: 'balance', title: 'Consulta de saldo TSC', text: 'Solicita el saldo de tu Tarjeta Sin Contacto a clientestsc@survias.cl.', url: 'mailto:clientestsc@survias.cl?subject=Consulta%20de%20saldo%20TSC', action: 'Consultar por correo' },
  { icon: 'bill', title: 'Conoce tu boleta', text: 'Consulta la guía oficial para entender tu documento de cobro.', url: 'https://www.survias.cl/wp-content/uploads/2025/09/Informativo-Documento-de-Cobro.pdf', action: 'Ver guía · PDF' },
  { icon: 'payment', title: 'Medios de pago', text: 'Conoce las alternativas disponibles para pagar tu cuenta.', url: 'https://www.survias.cl/wp-content/uploads/2025/09/Metodos-de-pago-Final.pdf', action: 'Ver medios · PDF' },
  { icon: 'map', title: 'Mapa de la ruta', text: 'Consulta el mapa oficial del tramo Talca–Chillán.', url: 'https://www.survias.cl/la-via/#mapa-ruta', action: 'Ver mapa' },
]

export default function CustomerServices() {
  return <section className="customer-services" aria-labelledby="customer-services-title">
    <div className="section-heading"><h2 id="customer-services-title">Información y servicios para ti</h2><p className="small muted">Los accesos de siempre, a mano.</p></div>
    <div className="customer-service-grid">{LINKS.map((item) => {
      const external = item.url.startsWith('https:')
      return <a key={item.title} className="customer-service" href={item.url} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
        <ServiceIcon type={item.icon} /><h3>{item.title}</h3><p>{item.text}</p><span className="service-action">{item.action}<span aria-hidden="true">{external ? '↗' : '→'}</span></span>
        {external && <span className="sr-only">Abre el sitio oficial en una pestaña nueva.</span>}
      </a>
    })}</div>
  </section>
}

