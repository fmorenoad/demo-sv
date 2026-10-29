import { useEffect, useRef, useState } from 'react'
import SocialFeed from '../../components/SocialFeed.jsx'
import ServiceIcon from '../../components/ServiceIcon.jsx'
import TarifasSelect from '../../components/TarifasSelect.jsx'
import { Alert, MockNote } from '../../components/ui.jsx'
import { INCIDENTES, TRABAJOS, TRAMOS, PORTICOS } from '../../data/mock.js'

function RouteMap() {
  // Esquema lineal de la ruta: ciudades, pórticos y zona de trabajos.
  const pts = [
    { x: 40, label: 'Talca' }, { x: 220, label: 'San Javier' }, { x: 400, label: 'Linares' }, { x: 580, label: 'Parral' }, { x: 760, label: 'Chillán' },
  ]
  return (
    <svg viewBox="0 0 800 120" className="route-map" role="img" aria-label="Esquema de la ruta Talca a Chillán con pórticos Rio Claro y Retiro y trabajos entre Talca y San Javier">
      <line x1="40" y1="60" x2="760" y2="60" stroke="var(--line)" strokeWidth="8" strokeLinecap="round" />
      <line x1="40" y1="60" x2="760" y2="60" stroke="var(--ok)" strokeWidth="8" strokeLinecap="round" />
      <line x1="150" y1="60" x2="200" y2="60" stroke="var(--warn)" strokeWidth="8" strokeLinecap="round" />
      {pts.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy="60" r="7" fill="var(--surface)" stroke="var(--navy)" strokeWidth="2" />
          <text x={p.x} y="95" textAnchor="middle" fontSize="12" fill="var(--ink)">{p.label}</text>
        </g>
      ))}
      <g>
        <rect x="118" y="20" width="64" height="20" rx="4" fill="var(--navy)" />
        <text x="150" y="34" textAnchor="middle" fontSize="11" fill="#fff">Rio Claro</text>
        <line x1="150" y1="40" x2="150" y2="52" stroke="var(--navy)" strokeWidth="2" />
      </g>
      <g>
        <rect x="648" y="20" width="56" height="20" rx="4" fill="var(--navy)" />
        <text x="676" y="34" textAnchor="middle" fontSize="11" fill="#fff">Retiro</text>
        <line x1="676" y1="40" x2="676" y2="52" stroke="var(--navy)" strokeWidth="2" />
      </g>
      <text x="175" y="112" textAnchor="middle" fontSize="11" fill="var(--warn)">Trabajos km 182–188</text>
    </svg>
  )
}

export default function EstadoRuta() {
  const pageRef = useRef(null)
  const detailTimerRef = useRef()
  const [tramo, setTramo] = useState(TRAMOS[0])
  const [canal, setCanal] = useState('SMS')
  const [ok, setOk] = useState(false)
  const [acepta, setAcepta] = useState(false)
  const [selectedIncidentId, setSelectedIncidentId] = useState(INCIDENTES[0].id)
  const [displayedIncidentId, setDisplayedIncidentId] = useState(INCIDENTES[0].id)
  const [detailPhase, setDetailPhase] = useState('idle')
  const selectedIncident = INCIDENTES.find((incident) => incident.id === displayedIncidentId) || INCIDENTES[0]
  const relatedWork = TRABAJOS.filter((work) => work.tramo === selectedIncident.tramo)
  const tramoOptions = TRAMOS.map((option) => ({ value: option, label: option }))

  const selectIncident = (id) => {
    setSelectedIncidentId(id)
    clearTimeout(detailTimerRef.current)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayedIncidentId(id)
      setDetailPhase('idle')
      return
    }
    setDetailPhase('exit')
    detailTimerRef.current = window.setTimeout(() => {
      setDisplayedIncidentId(id)
      setDetailPhase('enter')
      detailTimerRef.current = window.setTimeout(() => setDetailPhase('idle'), 280)
    }, 180)
  }

  useEffect(() => () => clearTimeout(detailTimerRef.current), [])

  useEffect(() => {
    const root = pageRef.current
    if (!root) return undefined
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const targets = [...root.querySelectorAll('.ruta-reveal')]
    let observer
    const showAll = () => { root.classList.remove('reveal-ready'); targets.forEach((element) => element.classList.add('is-visible')) }
    const observe = () => {
      if (motion.matches || !('IntersectionObserver' in window)) return showAll()
      targets.forEach((element) => {
        const rect = element.getBoundingClientRect()
        element.classList.toggle('is-visible', rect.top < window.innerHeight && rect.bottom > 0)
      })
      root.classList.add('reveal-ready')
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting)), { threshold: 0.08, rootMargin: '0px 0px -6% 0px' })
      targets.forEach((element) => observer.observe(element))
    }
    const handleMotion = () => { observer?.disconnect(); observer = undefined; observe() }
    observe()
    motion.addEventListener?.('change', handleMotion)
    return () => {
      observer?.disconnect()
      motion.removeEventListener?.('change', handleMotion)
      root.classList.remove('reveal-ready')
      targets.forEach((element) => element.classList.remove('is-visible'))
    }
  }, [])

  return (
    <main ref={pageRef} className="ruta-page">
      <section className="ruta-hero">
        <div className="ruta-hero-media ruta-reveal"><img src="/assets/ruta-survias.png" alt="" width="1536" height="1024" /></div>
        <div className="ruta-container ruta-hero-content ruta-reveal">
          <h1>Estado de la ruta</h1>
          <p>Estado y trabajos con datos de demostración. Consulta también las publicaciones del canal oficial de X.</p>
        </div>
      </section>

      <div className="ruta-container ruta-layout">
        <div className="ruta-main">
          <section className="ruta-map-panel ruta-reveal"><div className="ruta-map-scroll" tabIndex="0"><RouteMap /></div></section>

          <section className="ruta-incidents" aria-label="Estado de los tramos">
            {INCIDENTES.map((i) => <button type="button" aria-pressed={selectedIncidentId === i.id} onClick={() => selectIncident(i.id)} key={i.id} className={'ruta-incident ruta-reveal ' + i.nivel}>
              <span className="ruta-incident-icon"><ServiceIcon type={i.nivel === 'ok' ? 'status' : 'roadworks'} /></span>
              <div><h2>{i.tramo}</h2><span className={'ruta-status ' + i.nivel}>{i.tipo}</span><p>{i.texto}</p><small>Actualizado {i.hora} · Survías</small></div>
            </button>)}
          </section>

          <section className="ruta-detail ruta-reveal" aria-live="polite">
            <div className={'ruta-detail-inner ' + detailPhase}>
              <span className="ruta-detail-icon"><ServiceIcon type={selectedIncident.nivel === 'ok' ? 'status' : 'roadworks'} /></span>
              <div className="ruta-detail-copy">
                <div><h2>{selectedIncident.tramo}</h2><span className={'ruta-status ' + selectedIncident.nivel}>{selectedIncident.tipo}</span></div>
                <p>{selectedIncident.texto}</p>
                <small>Actualizado {selectedIncident.hora} · Survías</small>
                {relatedWork.length > 0 && <h3 className="ruta-detail-work-heading">Calendario de trabajos programados</h3>}
                {relatedWork.map((work) => <dl className="ruta-detail-work" key={work.id}>
                  <div><dt><ServiceIcon type="bill" /><span>Trabajo</span></dt><dd>{work.titulo}</dd></div>
                  <div><dt><ServiceIcon type="calendar" /><span>Fecha</span></dt><dd>{work.cuando}</dd></div>
                  <div><dt><ServiceIcon type="map" /><span>Tramo</span></dt><dd>{work.tramo}</dd></div>
                  <div><dt><ServiceIcon type="status" /><span>Efecto esperado</span></dt><dd>{work.efecto}</dd></div>
                </dl>)}
              </div>
            </div>
          </section>

          <section className="ruta-calendar ruta-reveal" aria-labelledby="calendar-title">
            <div className="ruta-section-head"><div><h2 id="calendar-title">Calendario de trabajos programados</h2><span>Act. 25-10-2026</span></div><ServiceIcon type="roadworks" /></div>
            <div className="ruta-work-head" aria-hidden="true"><span>Fecha</span><span>Trabajo</span><span>Tramo</span><span>Efecto esperado</span></div>
            <div className="ruta-work-list">
              {TRABAJOS.map((w) => <article className="ruta-work-item ruta-reveal" key={w.id}>
                <time>{w.cuando}</time>
                <span className="ruta-work-icon"><ServiceIcon type="roadworks" /></span>
                <div className="ruta-work-copy"><h3>{w.titulo}</h3><p>{w.detalle}</p><dl><div><dt>Tramo</dt><dd>{w.tramo}</dd></div><div><dt>Efecto esperado</dt><dd>{w.efecto}</dd></div></dl></div>
              </article>)}
            </div>
          </section>
        </div>

        <aside className="ruta-sidebar">
          <section className="ruta-notifications ruta-reveal" aria-labelledby="notifications-title">
            <div className="ruta-section-head"><div><h2 id="notifications-title">Recibe avisos en tu celular</h2></div><ServiceIcon type="status" /></div>
            {ok ? (
              <Alert tone="ok" title="Avisos activados">
                Te avisaremos por {canal} sobre trabajos e incidentes en {tramo}. Puedes darte de baja desde el mismo mensaje.
                <div style={{ marginTop: 10 }}><button className="btn ghost sm" onClick={() => setOk(false)}>Cambiar preferencias</button></div>
              </Alert>
            ) : (
              <>
                <p className="ruta-form-intro">Elige un tramo y un canal. No pedimos tu ubicación.</p>
                <div className="ruta-field"><TarifasSelect id="ruta-tramo" label="Tramo" value={tramo} options={tramoOptions} onChange={setTramo} /></div>
                <fieldset className="ruta-field"><legend>Canal</legend><div className="ruta-channels">{['SMS', 'WhatsApp', 'Email'].map((c) => <button key={c} type="button" className={canal === c ? 'on' : ''} aria-pressed={canal === c} onClick={() => setCanal(c)}>{c}</button>)}</div></fieldset>
                <div className="ruta-field"><label htmlFor="ruta-contacto">{canal === 'Email' ? 'Correo' : 'Celular'}</label><input id="ruta-contacto" placeholder={canal === 'Email' ? 'nombre@correo.cl' : '+56 9 ____ ____'} /></div>
                <label className="ruta-consent"><input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} /><span>Acepto recibir avisos sobre este tramo. Máximo 3 mensajes por semana; baja inmediata respondiendo BAJA.</span></label>
                <button className="ruta-submit" disabled={!acepta} onClick={() => setOk(true)}>Activar avisos</button>
              </>
            )}
          </section>
          <div className="ruta-social ruta-reveal"><SocialFeed /></div>
        </aside>
      </div>

      <div className="ruta-container ruta-sources ruta-reveal"><Alert tone="info" title="Fuentes de información">El estado de la ruta proviene del centro de control de Survías. Los datos de tráfico de terceros (por ejemplo Waze) se mostrarán identificados como tales cuando la integración esté disponible; si una fuente no responde, esta página lo indica y mantiene los canales oficiales: 600 252 6000.</Alert></div>
      <div className="ruta-container ruta-note ruta-reveal"><MockNote><strong>Mockup de Estado de ruta.</strong> Incidentes y trabajos son de ejemplo. Pórticos: {PORTICOS.map((p) => p.nombre).join(' y ')}.</MockNote></div>
    </main>
  )
}
