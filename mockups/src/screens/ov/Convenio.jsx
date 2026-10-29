import { cloneElement, useEffect, useId, useRef, useState } from 'react'
import { Card, Alert, VerifyModal, Toast, MockNote } from '../../components/ui.jsx'
import { USER, REGIONES, COMUNAS } from '../../data/mock.js'
import ServiceIcon from '../../components/ServiceIcon.jsx'
import '../../convenio.css'

function Field({ label, hint, children }) {
  const id = useId()
  return <div className="field">
    <label htmlFor={id}>{label}</label>
    {cloneElement(children, { id, ...(hint ? { 'aria-describedby': id + '-hint' } : {}) })}
    {hint && <div id={id + '-hint'} className="xsmall muted convenio-hint">{hint}</div>}
  </div>
}

export default function Convenio() {
  const pageRef = useRef(null)
  const [form, setForm] = useState({ ...USER.direccion })
  const [dirty, setDirty] = useState(false)
  const [verify, setVerify] = useState(false)
  const [toast, setToast] = useState('')
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value, ...(k === 'region' ? { comuna: '' } : {}) })); setDirty(true) }
  const comunas = COMUNAS[form.region] || []

  useEffect(() => {
    const root = pageRef.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const targets = [...root.querySelectorAll('.convenio-reveal')]
    let observer
    const activate = () => {
      observer?.disconnect()
      if (motion.matches || typeof IntersectionObserver === 'undefined') {
        root.classList.remove('convenio-motion-ready')
        return
      }
      targets.forEach((element) => {
        const rect = element.getBoundingClientRect()
        element.classList.toggle('is-visible', rect.top < innerHeight && rect.bottom > 0)
      })
      root.classList.add('convenio-motion-ready')
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting)
      }), { threshold: 0.03 })
      targets.forEach((element) => observer.observe(element))
    }
    activate()
    motion.addEventListener?.('change', activate)
    return () => {
      observer?.disconnect()
      motion.removeEventListener?.('change', activate)
    }
  }, [])

  return (
    <div className="convenio-page" ref={pageRef}>
      <header className="convenio-head convenio-reveal">
        <h1>Datos del convenio</h1>
        <p>{`Convenio ${USER.convenio} · ${USER.tipoConvenio}`}</p>
      </header>
      <div className="convenio-layout">
        <div className="convenio-main">
          <Card className="convenio-holder convenio-reveal" title={<><ServiceIcon type="account" /><span>Titular</span></>}>
            <div className="convenio-fields">
              <Field label="RUT"><input className="input" value={USER.rut} disabled /></Field>
              <Field label="Nombre"><input className="input" value={USER.nombre} disabled /></Field>
              <Field label="Apellidos"><input className="input" value={USER.apellidos} disabled /></Field>
              <Field label="Tipo de convenio"><input className="input" value={USER.tipoConvenio} disabled /></Field>
            </div>
            <p className="xsmall muted">Los datos del titular provienen del Registro Civil y no se editan aquí. Para cambiar el titular, abre un requerimiento.</p>
          </Card>

          <Card className="convenio-address convenio-reveal" title={<><ServiceIcon type="map" /><span>Dirección del convenio</span></>} right={dirty && <span className="badge warn">Cambios sin guardar</span>}>
            <div className="convenio-street-row">
              <Field label="Calle"><input className="input" value={form.calle} onChange={set('calle')} /></Field>
              <Field label="Número"><input className="input" value={form.numero} onChange={set('numero')} /></Field>
              <Field label="Depto / casa"><input className="input" value={form.depto} onChange={set('depto')} placeholder="Opcional" /></Field>
            </div>
            <div className="convenio-fields">
              <Field label="Región">
                <select className="input" value={form.region} onChange={set('region')}>
                  <option value="">Seleccione</option>
                  {REGIONES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Comuna" hint={!comunas.length && form.region ? 'Demo: solo Maule y Ñuble tienen comunas cargadas.' : undefined}>
                <select className="input" value={form.comuna} onChange={set('comuna')} disabled={!comunas.length}>
                  <option value="">Seleccione</option>
                  {comunas.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Referencia"><input className="input" value={form.detalle} onChange={set('detalle')} placeholder="Ej.: frente a la plaza" /></Field>
            <div className="convenio-actions">
              <button className="btn ghost" disabled={!dirty} onClick={() => { setForm({ ...USER.direccion }); setDirty(false) }}>Descartar</button>
              <button className="btn primary" disabled={!dirty || !form.comuna} onClick={() => setVerify(true)}>Guardar cambios</button>
            </div>
          </Card>
        </div>

        <aside className="convenio-aside">
          <Card className="convenio-help convenio-reveal" title="Qué puedes cambiar aquí">
            <ul className="convenio-help-list">
              <li><ServiceIcon type="map" /><span>Dirección del convenio (con verificación por código).</span></li>
              <li><ServiceIcon type="account" /><span>Correo y teléfono: en <a href="#/ov/cuenta">Mi cuenta</a>.</span></li>
              <li><ServiceIcon type="car" /><span>Vehículos y TAG: en <a href="#/ov/vehiculos">Vehículos y TAG</a>.</span></li>
              <li><ServiceIcon type="calendar" /><span>Boleta por email y avisos: en <a href="#/ov/suscripciones">Suscripciones</a>.</span></li>
            </ul>
          </Card>
          <section className="convenio-security convenio-reveal">
            <ServiceIcon type="shield" />
            <Alert tone="info" title="Por qué pedimos un código">Cambiar la dirección afecta tus documentos tributarios. Confirmamos con un código al correo registrado y dejamos registro del cambio.</Alert>
          </section>
        </aside>
      </div>

      <VerifyModal open={verify} onCancel={() => setVerify(false)} onConfirm={() => { setVerify(false); setDirty(false); setToast('Dirección actualizada. Te enviamos un correo de confirmación.') }} />
      <Toast msg={toast} onDone={() => setToast('')} />
      <div className="convenio-note convenio-reveal"><MockNote><strong>Mockup de Convenio.</strong> En el portal actual este formulario está deshabilitado; aquí se propone editable con autenticación reforzada.</MockNote></div>
    </div>
  )
}
