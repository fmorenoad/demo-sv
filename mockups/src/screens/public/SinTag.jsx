import { useEffect, useRef, useState } from 'react'
import { href } from '../../router.jsx'
import ServiceIcon from '../../components/ServiceIcon.jsx'
import { Alert, MockNote } from '../../components/ui.jsx'
import { clp } from '../../data/mock.js'

// Pasos pendientes de ejemplo para una patente sin TAG.
const PASOS = [
  { id: 1, fecha: '19-10-2026 11:32', portico: 'Rio Claro NS', cat: 1, monto: 3300, vence: '18-11-2026' },
  { id: 2, fecha: '19-10-2026 18:05', portico: 'Rio Claro SN', cat: 1, monto: 3300, vence: '18-11-2026' },
]

const STEP_LABELS = ['Patente', 'Pasos pendientes', 'Pago', 'Comprobante']

export default function SinTag() {
  const pageRef = useRef(null)
  const [step, setStep] = useState(1)
  const [patente, setPatente] = useState('')
  const [email, setEmail] = useState('')
  const [sel, setSel] = useState({ 1: true, 2: true })
  const chosen = PASOS.filter((p) => sel[p.id])
  const total = chosen.reduce((a, p) => a + p.monto, 0)
  const valid = /^[A-Z]{4}\d{2}$|^[A-Z]{2}\d{4}$/.test(patente)

  useEffect(() => {
    const root = pageRef.current
    if (!root) return undefined
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let observer
    let frame
    let targets = []
    const showAll = () => { root.classList.remove('reveal-ready'); targets.forEach((element) => element.classList.add('is-visible')) }
    const observe = () => {
      targets = [...root.querySelectorAll('.sin-tag-reveal')]
      if (motion.matches || !('IntersectionObserver' in window)) return showAll()
      targets.forEach((element) => {
        const rect = element.getBoundingClientRect()
        element.classList.toggle('is-visible', rect.top < window.innerHeight && rect.bottom > 0)
      })
      root.classList.add('reveal-ready')
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting)
      }), { threshold: 0.08, rootMargin: '0px 0px -6% 0px' })
      targets.forEach((element) => observer.observe(element))
    }
    const refresh = () => { observer?.disconnect(); observer = undefined; observe() }
    frame = requestAnimationFrame(observe)
    motion.addEventListener?.('change', refresh)
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      motion.removeEventListener?.('change', refresh)
      root.classList.remove('reveal-ready')
      targets.forEach((element) => element.classList.remove('is-visible'))
    }
  }, [step])

  return (
    <main ref={pageRef} className="sin-tag-page">
      <section className="sin-tag-hero">
        <div className="sin-tag-hero-media sin-tag-reveal"><img src="/assets/ruta-survias.png" alt="" width="1536" height="1024" /></div>
        <div className="sin-tag-container sin-tag-hero-copy sin-tag-reveal"><h1>Pasé sin TAG</h1><p>Regulariza tus pasos sin recargo dentro de 30 días. No necesitas cuenta.</p></div>
      </section>

      <div className="sin-tag-container sin-tag-flow">
        <ol className="sin-tag-steps sin-tag-reveal" aria-label="Progreso">
          {STEP_LABELS.map((label, index) => <li key={label} className={step === index + 1 ? 'current' : step > index + 1 ? 'complete' : ''} aria-current={step === index + 1 ? 'step' : undefined}>
            <span>{step > index + 1 ? <ServiceIcon type="status" /> : index + 1}</span><strong>{label}</strong>
          </li>)}
        </ol>

        {step === 1 && <div className="sin-tag-layout">
          <form className="sin-tag-card sin-tag-form sin-tag-reveal" noValidate onSubmit={(event) => { event.preventDefault(); if (valid && email.includes('@')) setStep(2) }}>
            <div className="sin-tag-card-head"><ServiceIcon type="car" /><h2>Ingresa la patente del vehículo</h2></div>
            <div className="sin-tag-field"><label htmlFor="sin-tag-plate">Patente</label><span id="sin-tag-plate-hint">Formato ABCD12 o AB1234, sin guion.</span><input id="sin-tag-plate" aria-describedby="sin-tag-plate-hint" className="plate" placeholder="ABCD12" maxLength={6} value={patente} onChange={(e) => setPatente(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} /></div>
            <div className="sin-tag-field"><label htmlFor="sin-tag-email">Correo para el comprobante</label><input id="sin-tag-email" type="email" placeholder="nombre@correo.cl" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <button className="sin-tag-primary" disabled={!valid || !email.includes('@')} type="submit">Buscar pasos pendientes</button>
            <p className="sin-tag-privacy">Protegido con reCAPTCHA. Solo mostramos pasos de los últimos 30 días y nunca datos del titular.</p>
          </form>
          <aside className="sin-tag-card sin-tag-help sin-tag-reveal">
            <div className="sin-tag-card-head"><ServiceIcon type="route" /><h2>¿Cómo funciona?</h2></div>
            <ol className="sin-tag-how"><li>Ingresas la patente y un correo.</li><li>Ves los pasos pendientes con fecha, pórtico y monto.</li><li>Pagas con Webpay en una pantalla segura.</li><li>Recibes el comprobante y la boleta por correo.</li></ol>
            <Alert tone="info">Si pasas seguido, el <a href={href('tag')}>TAG</a> te ahorra este trámite y te da una sola boleta mensual.</Alert>
          </aside>
        </div>}

        {step === 2 && <div className="sin-tag-layout">
          <section className="sin-tag-card sin-tag-reveal">
            <div className="sin-tag-card-head split"><div><ServiceIcon type="bill" /><h2>Pasos pendientes de {patente}</h2></div><span className="sin-tag-badge">{PASOS.length} pendientes</span></div>
            <div className="sin-tag-pass-list">{PASOS.map((p) => <label className="sin-tag-pass" key={p.id}><input type="checkbox" checked={!!sel[p.id]} onChange={() => setSel((current) => ({ ...current, [p.id]: !current[p.id] }))} /><ServiceIcon type="route" /><span><strong>{p.portico} · Cat. {p.cat}</strong><small>{p.fecha} · vence sin recargo el {p.vence}</small></span><b>{clp(p.monto)}</b></label>)}</div>
          </section>
          <aside className="sin-tag-summary sin-tag-reveal"><span className="sin-tag-kicker">Resumen</span><h2>{chosen.length} pasos</h2><div className="sin-tag-total"><span>Total</span><strong>{clp(total)}</strong></div><button className="sin-tag-primary" disabled={!chosen.length} onClick={() => setStep(3)}>Continuar al pago</button><button className="sin-tag-secondary" onClick={() => setStep(1)}>Cambiar patente</button></aside>
        </div>}

        {step === 3 && <div className="sin-tag-layout">
          <section className="sin-tag-card sin-tag-reveal">
            <div className="sin-tag-card-head"><ServiceIcon type="shield" /><h2>Pago seguro</h2></div>
            <dl className="sin-tag-details"><div><dt>Patente</dt><dd>{patente}</dd></div><div><dt>Pasos</dt><dd>{chosen.length}</dd></div><div><dt>Comprobante a</dt><dd>{email}</dd></div><div><dt>Documento</dt><dd>Boleta electrónica</dd></div></dl>
            <fieldset className="sin-tag-payment"><legend>Medio de pago</legend><label><input type="radio" name="pm" defaultChecked /> Webpay · débito o crédito</label><label><input type="radio" name="pm" /> Transferencia (Khipu)</label></fieldset>
            <p className="sin-tag-privacy">Serás redirigido a la pasarela. Survías no almacena datos de tarjeta.</p>
          </section>
          <aside className="sin-tag-summary sin-tag-reveal"><div className="sin-tag-total"><span>Total a pagar</span><strong>{clp(total)}</strong></div><button className="sin-tag-primary" onClick={() => setStep(4)}>Pagar {clp(total)}</button><button className="sin-tag-secondary" onClick={() => setStep(2)}>Volver</button></aside>
        </div>}

        {step === 4 && <section className="sin-tag-card sin-tag-receipt sin-tag-reveal">
          <ServiceIcon type="status" /><h2>Pago realizado</h2><p>Pagaste <strong>{clp(total)}</strong> por {chosen.length} pasos de la patente <strong>{patente}</strong>. Orden N° 884120. Enviamos la boleta y el comprobante a {email}.</p>
          <div><a href="#" className="sin-tag-primary">Descargar comprobante (PDF)</a><a href={href('tag')} className="sin-tag-secondary">Quiero un TAG para no repetir esto</a><button className="sin-tag-secondary" onClick={() => { setStep(1); setPatente(''); setEmail('') }}>Regularizar otra patente</button></div>
        </section>}

        <div className="sin-tag-note sin-tag-reveal"><MockNote><strong>Mockup de Pasé sin TAG.</strong> Flujo público interactivo con datos de ejemplo; la pasarela real es un paso posterior.</MockNote></div>
      </div>
    </main>
  )
}
