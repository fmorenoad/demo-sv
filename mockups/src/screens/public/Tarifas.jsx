import { useEffect, useRef, useState } from 'react'
import { href } from '../../router.jsx'
import ServiceIcon from '../../components/ServiceIcon.jsx'
import TarifasSelect from '../../components/TarifasSelect.jsx'
import { MockNote } from '../../components/ui.jsx'
import { TARIFAS, PORTICOS, clp } from '../../data/mock.js'

const CIUDADES = ['Talca', 'San Javier', 'Linares', 'Parral', 'Chillán']
const CITY_OPTIONS = CIUDADES.map((city) => ({ value: city, label: city }))
const CATEGORY_OPTIONS = TARIFAS.map((tarifa) => ({ value: tarifa.cat, label: `Cat. ${tarifa.cat} · ${tarifa.nombre}` }))

// Pórticos que se cruzan entre ciudades (índices del arreglo CIUDADES).
const porticosEntre = (a, b) => {
  const [i, j] = [CIUDADES.indexOf(a), CIUDADES.indexOf(b)].sort((x, y) => x - y)
  const cruzados = []
  if (i <= 0 && j >= 1) cruzados.push(PORTICOS[0]) // Rio Claro entre Talca y San Javier
  if (i <= 3 && j >= 4) cruzados.push(PORTICOS[1]) // Retiro entre Parral y Chillán
  return cruzados
}

const SUPPORT = [
  { icon: 'shield', title: 'Gratuidad lateral', text: 'Residentes de Río Claro, San Rafael, Retiro y Parral pueden acreditar domicilio para pasar sin costo por el pórtico de su comuna.', route: 'ayuda', action: 'Cómo acreditar' },
  { icon: 'tag', title: 'Pasé sin TAG', text: 'Regulariza tu paso dentro de 30 días pagando la tarifa normal, sin recargo.', route: 'sin-tag', action: 'Regularizar ahora' },
  { icon: 'payment', title: 'Medios de pago', text: 'Webpay (débito y crédito), transferencia, PAC/PAT y pago presencial en puntos de atención.', route: 'login', action: 'Pagar en la Oficina Virtual' },
]

export default function Tarifas() {
  const pageRef = useRef(null)
  const [cat, setCat] = useState(1)
  const [origen, setOrigen] = useState('Talca')
  const [destino, setDestino] = useState('Chillán')
  const [punta, setPunta] = useState(false)
  const tarifa = TARIFAS.find((t) => t.cat === cat)
  const cruzados = origen === destino ? [] : porticosEntre(origen, destino)
  const unit = punta ? tarifa.punta : tarifa.normal
  const total = cruzados.length * unit

  useEffect(() => {
    const root = pageRef.current
    if (!root) return undefined
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const targets = [...root.querySelectorAll('.tarifas-reveal')]
    let observer
    let focusFrame
    const visibility = new Map()
    const updateTarget = (element, visible, rect = element.getBoundingClientRect()) => {
      visibility.set(element, visible)
      if (!visible) element.dataset.revealSide = rect.bottom < window.innerHeight / 2 ? 'above' : 'below'
      const interacting = element.contains(document.activeElement) || element.querySelector('[aria-expanded="true"]')
      element.classList.toggle('is-visible', visible || Boolean(interacting))
    }
    const showAll = () => {
      root.classList.remove('reveal-ready')
      targets.forEach((element) => element.classList.add('is-visible'))
    }
    const observe = () => {
      if (motion.matches || !('IntersectionObserver' in window)) return showAll()
      targets.forEach((element) => {
        const rect = element.getBoundingClientRect()
        updateTarget(element, rect.top < window.innerHeight * .94 && rect.bottom > window.innerHeight * .06, rect)
      })
      root.classList.add('reveal-ready')
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => updateTarget(entry.target, entry.isIntersecting, entry.boundingClientRect))
      }, { threshold: 0, rootMargin: '-6% 0px -6% 0px' })
      targets.forEach((element) => observer.observe(element))
    }
    const handleMotion = () => { observer?.disconnect(); observer = undefined; observe() }
    const handleFocus = () => {
      cancelAnimationFrame(focusFrame)
      focusFrame = requestAnimationFrame(() => {
        if (!root.classList.contains('reveal-ready')) return
        targets.forEach((element) => updateTarget(element, visibility.get(element)))
      })
    }
    observe()
    motion.addEventListener?.('change', handleMotion)
    root.addEventListener('focusin', handleFocus)
    root.addEventListener('focusout', handleFocus)
    return () => {
      observer?.disconnect()
      cancelAnimationFrame(focusFrame)
      motion.removeEventListener?.('change', handleMotion)
      root.removeEventListener('focusin', handleFocus)
      root.removeEventListener('focusout', handleFocus)
      root.classList.remove('reveal-ready')
      targets.forEach((element) => {
        element.classList.remove('is-visible')
        delete element.dataset.revealSide
      })
    }
  }, [])

  return (
    <main ref={pageRef} className="tarifas-page">
      <section className="tarifas-hero tarifas-reveal">
        <img src="/assets/ruta-survias.png" alt="Ruta 5 entre campos y cordillera en el tramo Talca a Chillán" width="1536" height="1024" />
        <div className="tarifas-container tarifas-hero-content">
          <nav className="tarifas-breadcrumb" aria-label="Migas de pan"><a href={href('inicio')}>Inicio</a><span aria-hidden="true">›</span><span aria-current="page">Tarifas</span></nav>
          <p className="tarifas-kicker">Ruta 5 · Talca — Chillán</p>
          <h1>Calcula el costo de tu viaje</h1>
          <p className="tarifas-lead">Consulta las tarifas de esta demostración y simula tu recorrido según tu vehículo.</p>
          <div className="tarifas-meta" aria-label="Alcance de los datos">
            <span><ServiceIcon type="status" /><span><strong>Datos de demostración</strong><small>No reemplazan una cotización</small></span></span>
            <span><ServiceIcon type="route" /><span><strong>Referencia 2026</strong><small>Valores indicados en la tabla</small></span></span>
            <span><ServiceIcon type="bill" /><span><strong>IVA incluido</strong><small>En los valores mostrados</small></span></span>
          </div>
        </div>
      </section>

      <div className="tarifas-container tarifas-layout">
        <section className="tarifas-panel tarifas-simulator tarifas-reveal" aria-labelledby="simulator-title">
          <div className="tarifas-panel-head"><span className="tarifas-icon-box"><ServiceIcon type="calculator" /></span><div><h2 id="simulator-title">Simulador de costo de viaje</h2><p>Selecciona origen, destino y vehículo para obtener un cálculo estimado.</p></div></div>
          <div className="tarifas-controls">
            <TarifasSelect id="tarifa-origen" label="Origen" value={origen} options={CITY_OPTIONS} onChange={setOrigen} />
            <TarifasSelect id="tarifa-destino" label="Destino" value={destino} options={CITY_OPTIONS} onChange={setDestino} />
            <div className="tarifas-category"><TarifasSelect id="tarifa-categoria" label="Categoría de vehículo" value={cat} options={CATEGORY_OPTIONS} onChange={setCat} /></div>
          </div>
          <label className="tarifas-peak" htmlFor="tarifa-punta"><input id="tarifa-punta" type="checkbox" checked={punta} onChange={(e) => setPunta(e.target.checked)} /><span className="tarifas-switch" aria-hidden="true" /><span><strong>Viajo en horario punta</strong><small>Viernes 17:00–21:00 y domingos 16:00–22:00 (ejemplo).</small></span></label>
        </section>

        <aside className="tarifas-result tarifas-reveal" aria-live="polite" aria-labelledby="result-title">
          <div className="tarifas-result-top"><p id="result-title">Resultado estimado</p><span className="tarifas-iva">IVA incluido</span></div>
          <div className="tarifas-vehicle"><span className="tarifas-icon-box"><ServiceIcon type="car" /></span><span><strong>{tarifa.nombre}</strong><small>Categoría {tarifa.cat} · {punta ? 'horario punta' : 'horario normal'}</small></span></div>
          <strong className="tarifas-total">{clp(total)}</strong>
          <div className="tarifas-route"><ServiceIcon type="route" /><span><strong>{origen} → {destino}</strong><small>{cruzados.length ? `${cruzados.length} ${cruzados.length === 1 ? 'pórtico' : 'pórticos'} en tu recorrido` : 'Sin pórticos en este trayecto'}</small></span></div>
          <div className="tarifas-breakdown">{cruzados.length ? cruzados.map((p) => <div key={p.id}><span>Pórtico {p.nombre} <small>({p.km})</small></span><strong>{clp(unit)}</strong></div>) : <p>Ese trayecto no cruza pórticos de Survías. Costo: $0.</p>}</div>
          <div className="tarifas-grand"><span>Total del viaje</span><strong>{clp(total)}</strong></div>
          <a href={href('tag')} className="tarifas-primary">Quiero un TAG <span aria-hidden="true">→</span></a>
          <a href={href('ruta')} className="tarifas-map"><ServiceIcon type="map" /> Ver mapa de la ruta</a>
        </aside>

        <section className="tarifas-panel tarifas-table-panel tarifas-reveal" aria-labelledby="table-title">
          <div className="tarifas-panel-head"><span className="tarifas-icon-box"><ServiceIcon type="bill" /></span><div><h2 id="table-title">Tarifas vigentes por pórtico</h2><p>Valores por pórtico según categoría de vehículo. Referencia desde el 1 de enero de 2026.</p></div><span className="tarifas-table-badge">IVA incluido</span></div>
          <div className="tarifas-table-scroll" tabIndex="0" aria-label="Tabla de tarifas; desplázate horizontalmente si es necesario"><table><thead><tr><th>Categoría</th><th>Tipo de vehículo</th><th>Horario normal</th><th>Horario punta</th></tr></thead><tbody>{TARIFAS.map((t) => <tr key={t.cat} className={t.cat === cat ? 'current' : ''} aria-current={t.cat === cat ? 'true' : undefined}><td><strong>Cat. {t.cat}</strong>{t.cat === cat && <span className="sr-only"> (categoría seleccionada)</span>}</td><td>{t.nombre}</td><td>{clp(t.normal)}</td><td>{clp(t.punta)}</td></tr>)}</tbody></table></div>
          <p className="tarifas-table-note">Pórticos incluidos en la demostración: {PORTICOS.map((p) => `${p.nombre} (${p.km})`).join(' y ')}. La gratuidad lateral requiere acreditación.</p>
        </section>
      </div>

      <section className="tarifas-container tarifas-support" aria-label="Información relacionada">
        {SUPPORT.map((item) => <article key={item.title} className="tarifas-support-card tarifas-reveal"><span className="tarifas-support-icon"><ServiceIcon type={item.icon} /></span><div><h2>{item.title}</h2><p>{item.text}</p><a href={href(item.route)}>{item.action} <span aria-hidden="true">→</span></a></div></article>)}
      </section>

      <div className="tarifas-container tarifas-note tarifas-reveal"><MockNote><strong>Mockup de Tarifas.</strong> La categoría 1 ($3.300) coincide con lo observado en el portal real; el resto de valores y el horario punta son ejemplos.</MockNote></div>
    </main>
  )
}
