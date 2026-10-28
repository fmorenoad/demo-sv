import { useEffect, useRef, useState } from 'react'

// Landing "de servicio" de Survías. Composición inspirada en un template de
// negocio de servicios (cabecera blanca con navegación en píldoras, hero a pantalla
// completa con foto, tarjeta de cifras superpuesta, galería, testimonios en video,
// tarjetas de servicios con precio y pie oscuro), con la paleta corporativa Survías.

const OV = '/#/'
const IMG = { ruta: '/assets/ruta-survias.png', mop: '/assets/actividad-mop.png', asistencia: '/assets/asistencia-en-ruta.png', logo: '/assets/survias-logo.png' }

const Icon = ({ d, size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
)
const I = {
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  play: <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />,
  star: <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" fill="currentColor" stroke="none" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  pin: <><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>,
  car: <><path d="M3 13l2-5a2 2 0 0 1 1.9-1.3h10.2A2 2 0 0 1 19 8l2 5v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /><circle cx="7.5" cy="14.5" r="1" /><circle cx="16.5" cy="14.5" r="1" /></>,
  tag: <><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" /></>,
  card: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" /></>,
}

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect() } }), { threshold: .12 })
    io.observe(el); return () => io.disconnect()
  }, [])
  return ref
}
function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useReveal()
  return <Tag ref={ref} className={'rv ' + className} {...rest}>{children}</Tag>
}

const STATS = [['2', 'Pórticos en la ruta'], ['$3.300', 'Categoría 1 por pórtico'], ['24/7', 'Asistencia en ruta'], ['100%', 'Gestiones en línea']]

const GALERIA = [
  ['Ruta 5 sur', 'Tramo Talca – San Javier', IMG.ruta, '50% 40%', 'none'],
  ['Pórtico Rio Claro', 'Paso libre con TAG', IMG.ruta, '50% 90%', 'saturate(1.15) contrast(1.05)'],
  ['Amanecer en la ruta', 'Km 212, sentido sur', IMG.ruta, '20% 30%', 'sepia(.25) saturate(1.2)'],
  ['Mantención', 'Trabajos programados', IMG.ruta, '70% 95%', 'contrast(1.1)'],
  ['Pórtico Retiro', 'Tramo Parral – Chillán', IMG.ruta, '50% 10%', 'saturate(.9)'],
  ['Seguridad vial', 'Señalización y bermas', IMG.ruta, '85% 70%', 'contrast(1.08) brightness(.95)'],
  ['Paisaje del Maule', 'Campos y cordillera', IMG.ruta, '10% 15%', 'saturate(1.1)'],
  ['Atardecer', 'Sentido norte', IMG.ruta, '40% 60%', 'sepia(.35) saturate(1.3) brightness(.95)'],
]

const HISTORIAS = [
  ['2:10', '“Pagué el paso desde el celular en dos minutos. Sin filas, sin llamar.”', 'Camila Rojas', 'ABCD12 · Auto', IMG.ruta, '50% 60%'],
  ['1:45', '“Con el TAG dejé de pensar en el peaje. La boleta llega sola cada mes.”', 'Rodrigo Pérez', 'EFGH34 · Camioneta', IMG.ruta, '50% 20%'],
  ['3:02', '“Repacté en tres cuotas desde la Oficina Virtual. Todo quedó por escrito.”', 'Paula Díaz', 'JKLM56 · Auto', IMG.ruta, '80% 85%'],
]

const SERVICIOS = [
  [I.car, 'Pasé sin TAG', 'Desde $3.300 por paso', 'Regulariza con tu patente, sin cuenta y sin recargo dentro de 30 días.', OV + 'sin-tag'],
  [I.tag, 'TAG mensual', 'Arriendo desde $1.500/mes', 'Pasa sin detenerte y recibe una sola boleta electrónica al mes.', OV + 'tag'],
  [I.card, 'Pago en línea', 'Webpay, Khipu o PAC', 'Paga tus tránsitos, descarga tus documentos y activa el pago automático.', OV + 'login'],
]

export default function Landing2() {
  const [active, setActive] = useState('inicio')
  useEffect(() => {
    const ids = ['inicio', 'servicios', 'confianza', 'galeria']
    const onScroll = () => {
      const y = window.scrollY + 120
      let cur = 'inicio'
      let best = -1
      ids.forEach((id) => { const el = document.getElementById(id); if (el && el.offsetTop <= y && el.offsetTop > best) { best = el.offsetTop; cur = id } })
      setActive(cur)
    }
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const NAV = [['inicio', 'Inicio'], ['servicios', 'Servicios'], ['confianza', 'Por qué Survías'], ['galeria', 'Galería']]

  return (
    <>
      <header className="tw-header">
        <div className="tw-wrap bar">
          <a href="#inicio" className="brand"><img src={IMG.logo} alt="Survías Maule Ñuble" width="56" height="34" /><span>Survías</span></a>
          <nav className="pills" aria-label="Principal">
            {NAV.map(([id, l]) => <a key={id} href={'#' + id} className={active === id ? 'on' : ''}>{l}</a>)}
            <a href={OV + 'ayuda'}>Ayuda</a>
          </nav>
          <div className="right">
            <a href={OV + 'sin-tag'} className="btn primary">Pagar ahora</a>
            <a href={OV + 'login'} className="login">Ingresar</a>
            <a href="tel:6000062030" className="phone"><Icon d={I.phone} size={16} /> 600 006 2030</a>
          </div>
        </div>
      </header>

      <main>
        <section id="inicio" className="hero">
          <img src={IMG.ruta} alt="" aria-hidden="true" className="hero-bg" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1>Tu ruta, clara.<br />Tu cuenta, al día.</h1>
            <p>Ruta 5 entre Talca y Chillán con tarifas publicadas, asistencia 24/7 y todas tus gestiones en línea: pagar, arrendar tu TAG y revisar tus tránsitos.</p>
            <div className="hero-ctas">
              <a href={OV + 'sin-tag'} className="btn primary lg">Pagar un paso</a>
              <a href="#galeria" className="btn outline lg">Ver la ruta</a>
            </div>
          </div>
        </section>

        <section className="tw-wrap stats-wrap">
          <Reveal className="stats">
            {STATS.map(([v, l]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}
          </Reveal>
        </section>

        <section id="galeria" className="tw-wrap block">
          <Reveal className="sec-head"><h2>La ruta en imágenes</h2><p>Fotos reales de la ruta, los pórticos y el equipo que la opera.</p></Reveal>
          <div className="gallery">
            {GALERIA.map(([t, s, img, pos, filt], k) => (
              <Reveal key={t} as="figure" className="shot" style={{ transitionDelay: (k % 4) * 60 + 'ms' }}>
                <img src={img} alt={t + ', ' + s} style={{ objectPosition: pos, filter: filt }} />
                <figcaption><strong>{t}</strong><span>{s}</span></figcaption>
              </Reveal>
            ))}
          </div>
          <Reveal className="center"><a href={OV + 'ruta'} className="btn outline-dark">Ver estado de la ruta <Icon d={I.arrow} size={16} /></a></Reveal>
        </section>

        <section id="confianza" className="muted-band">
          <div className="tw-wrap block">
            <Reveal className="sec-head"><h2>Historias de la ruta</h2><p>Personas que ya resuelven sus gestiones sin ir al pórtico.</p></Reveal>
            <div className="stories">
              {HISTORIAS.map(([dur, q, n, v, img, pos], k) => (
                <Reveal key={n} as="article" className="story" style={{ transitionDelay: k * 80 + 'ms' }}>
                  <div className="thumb">
                    <img src={img} alt="" aria-hidden="true" style={{ objectPosition: pos }} />
                    <button className="play" aria-label={'Reproducir testimonio de ' + n}><Icon d={I.play} size={26} /></button>
                    <span className="dur">{dur}</span>
                  </div>
                  <div className="body">
                    <div className="stars" aria-label="5 de 5 estrellas">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} d={I.star} size={15} />)}</div>
                    <p>{q}</p>
                    <strong>{n}</strong><small>{v}</small>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="center"><a href={OV + 'ayuda'} className="btn outline-dark">Ver todos los testimonios <Icon d={I.arrow} size={16} /></a></Reveal>
          </div>
        </section>

        <section id="servicios" className="muted-band alt">
          <div className="tw-wrap block">
            <Reveal className="sec-head"><h2>Nuestros servicios</h2><p>Todo lo que necesitas para viajar y pagar sin complicaciones.</p></Reveal>
            <div className="services">
              {SERVICIOS.map(([ic, t, price, d, href], k) => (
                <Reveal key={t} as="article" className="service" style={{ transitionDelay: k * 80 + 'ms' }}>
                  <span className="ico"><Icon d={ic} size={26} /></span>
                  <h3>{t}</h3>
                  <p className="price">{price}</p>
                  <p className="desc">{d}</p>
                  <a href={href} className="more">Ver más <Icon d={I.arrow} size={15} /></a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="tw-wrap block cta">
          <Reveal>
            <h2>¿Listo para dejar las filas atrás?</h2>
            <p>Únete a los conductores que ya gestionan su cuenta Survías en línea, desde el celular y en minutos.</p>
            <div className="hero-ctas">
              <a href={OV + 'login'} className="btn primary lg">Entrar a la Oficina Virtual</a>
              <a href={OV + 'ayuda'} className="btn outline-dark lg">Contáctanos</a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="tw-footer">
        <div className="tw-wrap foot">
          <div className="col brandcol">
            <a href="#inicio" className="brand light"><img src={IMG.logo} alt="" aria-hidden="true" width="56" height="34" /><span>Survías</span></a>
            <p>Concesión Ruta 5, tramo Talca – Chillán. Tarifas claras, asistencia permanente y gestiones en línea.</p>
          </div>
          <div className="col"><h4>Enlaces</h4><a href={OV + 'tarifas'}>Tarifas</a><a href={OV + 'tag'}>TAG</a><a href={OV + 'sin-tag'}>Pasé sin TAG</a><a href={OV + 'login'}>Oficina Virtual</a></div>
          <div className="col"><h4>Recursos</h4><a href={OV + 'ruta'}>Estado de ruta</a><a href={OV + 'ayuda'}>Preguntas frecuentes</a><a href="/landing/">Landing editorial</a><a href="/">Demo navegable</a></div>
          <div className="col"><h4>Contacto</h4><span><Icon d={I.phone} size={15} /> 600 006 2030</span><span><Icon d={I.phone} size={15} /> 600 252 6000 (emergencias)</span><span><Icon d={I.mail} size={15} /> contacto@survias.cl</span><span><Icon d={I.pin} size={15} /> Talca · Linares · Chillán</span></div>
          <div className="col hours"><h4>Atención</h4><span>Lun – Vie <b>8:00 – 20:00</b></span><span>Sábado <b>9:00 – 14:00</b></span><span>Emergencias <b>24 horas</b></span></div>
        </div>
        <div className="tw-wrap copy">© 2026 Survías Maule-Ñuble S.A. · Prototipo con datos de ejemplo</div>
      </footer>
    </>
  )
}
