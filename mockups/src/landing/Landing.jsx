import { useEffect, useRef, useState } from 'react'

// Landing editorial de Survías. Composición inspirada en una landing de servicios
// (bloques a sangre, tipografía display, listas numeradas, tiles con flecha),
// con la paleta corporativa Survías: rojo-naranja, charcoal y gris pizarra.

const OV = '/#/'
const IMG = {
  ruta: '/assets/ruta-survias.png',
  mop: '/assets/actividad-mop.png',
  asistencia: '/assets/asistencia-en-ruta.png',
}

const Arrow = ({ dark }) => (
  <span className={'arrow' + (dark ? ' dark' : '')} aria-hidden="true">
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  </span>
)
const ArrowUp = () => (
  <span className="arrow" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8" /></svg>
  </span>
)

// Línea divisoria con un pequeño trazo de ruta (equivalente al latido del template).
const RoadLine = ({ light }) => (
  <svg className={'roadline' + (light ? ' light' : '')} viewBox="0 0 600 24" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 12 H230 l8 -9 l8 18 l8 -18 l8 18 l8 -9 H600" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect() } })
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useReveal()
  return <Tag ref={ref} className={'reveal ' + className} {...rest}>{children}</Tag>
}

const TILES = [
  { t: 'Tarifas', img: IMG.ruta, pos: '50% 60%', href: OV + 'tarifas' },
  { t: 'TAG', img: IMG.asistencia, pos: '50% 50%', href: OV + 'tag' },
  { t: 'Pasé sin TAG', img: IMG.mop, pos: '20% 50%', href: OV + 'sin-tag' },
  { t: 'Estado de ruta', img: IMG.ruta, pos: '50% 20%', href: OV + 'ruta' },
]

const SERVICIOS = [
  ['01', 'Pasé sin TAG', 'Regulariza tu paso con la patente, sin crear cuenta y sin recargo dentro de 30 días.', OV + 'sin-tag'],
  ['02', 'Arrienda tu TAG', 'Pasa sin detenerte y recibe una sola boleta al mes en tu correo.', OV + 'tag'],
  ['03', 'Paga tus tránsitos', 'Elige qué pagar, confirma tus datos y recibe la boleta en minutos.', OV + 'login'],
  ['04', 'Repacta tu deuda', 'Simula cuotas, revisa condiciones claras y acepta en línea.', OV + 'login'],
]

const PASOS = [
  ['1', 'Ingresa tu patente', 'Un formulario de un minuto, desde el teléfono, a cualquier hora.'],
  ['2', 'Revisa tus pasos', 'Ves fecha, pórtico y monto de cada tránsito, con el total antes de pagar.'],
  ['3', 'Paga y recibe tu boleta', 'Webpay o transferencia en una pantalla segura. La boleta llega a tu correo.'],
]

const CONFIANZA = [
  ['Precio claro', 'Tarifas publicadas por categoría y pórtico. Lo que ves es lo que pagas.'],
  ['Boleta electrónica', 'Cada pago genera su documento tributario y queda en tu historial.'],
  ['Datos protegidos', 'Tu información solo la ve tu equipo de atención. Nunca se vende.'],
  ['Asistencia 24/7', 'Emergencias en ruta al 600 252 6000, todos los días del año.'],
]

const HISTORIAS = [
  ['“Pagué el paso desde el celular en el estacionamiento del supermercado. Dos minutos.”', 'C', 'Camila', 'PASÉ SIN TAG'],
  ['“Con el TAG dejé de pensar en el peaje. La boleta llega sola cada mes.”', 'R', 'Rodrigo', 'TAG MENSUAL'],
  ['“Repacté en tres cuotas sin llamar a nadie. Todo quedó por escrito.”', 'P', 'Paula', 'REPACTACIÓN'],
]

const LINKS = [
  ['Consultar mis tránsitos', OV + 'login'], ['Pagar en línea', OV + 'login'], ['Arrendar un TAG', OV + 'tag'],
  ['Ver estado de la ruta', OV + 'ruta'], ['Repactar deuda', OV + 'login'], ['Hacer una consulta', OV + 'ayuda'],
]

const TICKER = ['Pórticos Rio Claro y Retiro', 'Categoría 1 desde $3.300', 'Boleta por email', 'Pago en línea', 'Asistencia 24/7', 'Sin filas']

export default function Landing() {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={'lp-header' + (solid ? ' solid' : '')}>
        <nav className="lp-nav" aria-label="Principal">
          <a href="#servicios">Servicios</a>
          <a href="#pasos">Cómo funciona</a>
          <a href="#confianza">Confianza</a>
          <a href={OV + 'ayuda'}>Ayuda</a>
        </nav>
        <a href="#top" className="lp-brand" aria-label="Survías, inicio">
          <span>SUR</span>VÍAS <small>Maule · Ñuble</small>
        </a>
        <nav className="lp-nav right" aria-label="Acceso">
          <a href={OV + 'login'}>Oficina Virtual</a>
        </nav>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero-copy">
            <h1>Tu ruta,<br />sin filas<br />ni sorpresas.</h1>
            <RoadLine light />
            <p>Paga tus tránsitos desde el celular, arrienda tu TAG en línea y revisa el estado de la Ruta 5 entre Talca y Chillán antes de salir.</p>
          </div>
          <div className="hero-photo">
            <img src={IMG.ruta} alt="Ruta 5 entre campos del Maule, con la cordillera al fondo" />
          </div>
          <div className="hero-tiles">
            {TILES.map((t) => (
              <a key={t.t} href={t.href} className="tile">
                <span className="thumb"><img src={t.img} alt="" style={{ objectPosition: t.pos }} /></span>
                <span className="t">{t.t}</span>
                <Arrow />
              </a>
            ))}
          </div>
        </section>

        {/* TICKER */}
        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[...TICKER, ...TICKER, ...TICKER].map((t, i) => <span key={i}>{t} <i>·</i> </span>)}
          </div>
        </div>

        {/* MANIFIESTO */}
        <section className="manifesto">
          <Reveal as="p" className="manifesto-text">
            <span className="dim">La mayoría posterga el trámite del peaje. Una fila en el pórtico cuesta una mañana. Así que la sacamos. Pagas en línea el mismo día. Ves un precio claro antes de pagar.</span>{' '}
            <span>Y un equipo real responde cuando escribes.</span>
          </Reveal>
          <Reveal><a href={OV + 'login'} className="pill light">Entrar a la Oficina Virtual</a></Reveal>
        </section>

        {/* SERVICIOS */}
        <section id="servicios" className="servicios">
          <div className="servicios-list">
            <Reveal className="sec-head">
              <h2>Qué<br />resolvemos</h2>
              <p>Cuatro gestiones de todos los días, cada una resuelta en línea y con confirmación por escrito.</p>
            </Reveal>
            <Reveal as="ol" className="numbered">
              {SERVICIOS.map(([n, t, d, href]) => (
                <li key={n}>
                  <span className="n">{n}</span>
                  <span className="body"><h3>{t}</h3><p>{d}</p></span>
                  <a href={href} className="more">Ver más <ArrowUp /></a>
                </li>
              ))}
            </Reveal>
          </div>
          <Reveal className="servicios-photo">
            <img src={IMG.ruta} alt="Ruta 5 entre campos del Maule" style={{ objectPosition: '50% 100%' }} />
          </Reveal>
        </section>

        {/* TRES PASOS */}
        <section id="pasos" className="pasos">
          <Reveal className="pasos-intro">
            <h2>Tres pasos,<br />sin ir al pórtico</h2>
            <p>Desde donde estés, normalmente en menos de cinco minutos.</p>
            <a href={OV + 'sin-tag'} className="pill brand">Regularizar un paso</a>
          </Reveal>
          <div className="pasos-list">
            {PASOS.map(([n, t, d]) => (
              <Reveal key={n} className="paso">
                <span className="big">{n}</span>
                <div><h3>{t}</h3><p>{d}</p></div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CONFIANZA */}
        <section id="confianza" className="confianza">
          <Reveal className="sec-center">
            <h2>Una ruta en la que confías</h2>
            <p>Concesión Ruta 5, tramo Talca – Chillán. Operación continua y canales de atención publicados.</p>
          </Reveal>
          <div className="confianza-grid">
            {CONFIANZA.map(([t, d]) => (
              <Reveal key={t} className="trust">
                <span className="ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" /><path d="M9 12l2 2 4-4" /></svg>
                </span>
                <div><h3>{t}</h3><p>{d}</p></div>
              </Reveal>
            ))}
          </div>
          <Reveal><a href={OV + 'ayuda'} className="text-link">Conoce los canales de atención →</a></Reveal>
        </section>

        {/* HISTORIAS */}
        <section className="historias">
          <img className="historias-bg" src={IMG.ruta} alt="" aria-hidden="true" />
          <div className="historias-inner">
            <Reveal as="h2">Personas reales,<br />ruta real</Reveal>
            <div className="historias-grid">
              {HISTORIAS.map(([q, i, n, tag], k) => (
                <Reveal key={n} className="story" style={{ transitionDelay: k * 80 + 'ms' }}>
                  <p>{q}</p>
                  <div className="who"><span className="av">{i}</span><span><strong>{n}</strong><small>{tag}</small></span></div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* LINK TILES */}
        <section className="enlaces">
          <Reveal as="h2">Tu ruta, <span className="dim">resuelta</span></Reveal>
          <RoadLine light />
          <Reveal as="p" className="lead">Elige qué quieres resolver y la Oficina Virtual te lleva directo.</Reveal>
          <div className="enlaces-grid">
            {LINKS.map(([t, href], k) => (
              <Reveal key={t} as="a" href={href} className="tile" style={{ transitionDelay: k * 60 + 'ms' }}>
                <span className="t">{t}</span><Arrow />
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER / CTA */}
      <footer className="lp-footer">
        <div className="cta">
          <div>
            <p className="eyebrow">Empieza aquí</p>
            <h2>Entra hoy a tu Oficina Virtual</h2>
            <a href={OV + 'login'} className="underline">Ingresar</a>
          </div>
          <div className="cta-photo"><img src={IMG.ruta} alt="" aria-hidden="true" /></div>
        </div>
        <div className="foot-bar">
          <p>Asistencia comercial 600 006 2030 · Emergencias 600 252 6000 · Survías Maule-Ñuble S.A. · Ruta 5, Talca – Chillán · contacto@survias.cl</p>
          <nav aria-label="Enlaces"><a href={OV + 'tarifas'}>Tarifas</a><a href={OV + 'ruta'}>Estado de ruta</a><a href={OV + 'ayuda'}>Ayuda</a><a href="/">Demo navegable</a></nav>
          <p>© Survías, 2026 · Prototipo con datos de ejemplo</p>
        </div>
      </footer>
    </>
  )
}
