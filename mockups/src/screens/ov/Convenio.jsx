import { useState } from 'react'
import { Page, Card, Field, Alert, VerifyModal, Toast, MockNote } from '../../components/ui.jsx'
import { USER, REGIONES, COMUNAS } from '../../data/mock.js'

export default function Convenio() {
  const [form, setForm] = useState({ ...USER.direccion })
  const [dirty, setDirty] = useState(false)
  const [verify, setVerify] = useState(false)
  const [toast, setToast] = useState('')
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value, ...(k === 'region' ? { comuna: '' } : {}) })); setDirty(true) }
  const comunas = COMUNAS[form.region] || []

  return (
    <Page title="Datos del convenio" subtitle={`Convenio ${USER.convenio} · ${USER.tipoConvenio}`}>
      <div className="grid sidebar">
        <div className="grid" style={{ gap: 16 }}>
          <Card title="Titular">
            <div className="grid cols-2" style={{ gap: 10 }}>
              <Field label="RUT"><input className="input" value={USER.rut} disabled /></Field>
              <Field label="Nombre"><input className="input" value={USER.nombre} disabled /></Field>
              <Field label="Apellidos"><input className="input" value={USER.apellidos} disabled /></Field>
              <Field label="Tipo de convenio"><input className="input" value={USER.tipoConvenio} disabled /></Field>
            </div>
            <p className="xsmall muted">Los datos del titular provienen del Registro Civil y no se editan aquí. Para cambiar el titular, abre un requerimiento.</p>
          </Card>

          <Card title="Dirección del convenio" right={dirty && <span className="badge warn">Cambios sin guardar</span>}>
            <div className="grid cols-2" style={{ gap: 10 }}>
              <Field label="Calle"><input className="input" value={form.calle} onChange={set('calle')} /></Field>
              <div className="grid cols-2" style={{ gap: 10 }}>
                <Field label="Número"><input className="input" value={form.numero} onChange={set('numero')} /></Field>
                <Field label="Depto / casa"><input className="input" value={form.depto} onChange={set('depto')} placeholder="Opcional" /></Field>
              </div>
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
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn ghost" disabled={!dirty} onClick={() => { setForm({ ...USER.direccion }); setDirty(false) }}>Descartar</button>
              <button className="btn primary" disabled={!dirty || !form.comuna} onClick={() => setVerify(true)}>Guardar cambios</button>
            </div>
          </Card>
        </div>

        <div className="grid" style={{ gap: 16 }}>
          <Card title="Qué puedes cambiar aquí">
            <ul className="small muted check-list">
              <li>Dirección del convenio (con verificación por código).</li>
              <li>Correo y teléfono: en <a href="#/ov/cuenta">Mi cuenta</a>.</li>
              <li>Vehículos y TAG: en <a href="#/ov/vehiculos">Vehículos y TAG</a>.</li>
              <li>Boleta por email y avisos: en <a href="#/ov/suscripciones">Suscripciones</a>.</li>
            </ul>
          </Card>
          <Alert tone="info" title="Por qué pedimos un código">Cambiar la dirección afecta tus documentos tributarios. Confirmamos con un código al correo registrado y dejamos registro del cambio.</Alert>
        </div>
      </div>

      <VerifyModal open={verify} onCancel={() => setVerify(false)} onConfirm={() => { setVerify(false); setDirty(false); setToast('Dirección actualizada. Te enviamos un correo de confirmación.') }} />
      <Toast msg={toast} onDone={() => setToast('')} />
      <MockNote><strong>Mockup de Convenio.</strong> En el portal actual este formulario está deshabilitado; aquí se propone editable con autenticación reforzada.</MockNote>
    </Page>
  )
}
