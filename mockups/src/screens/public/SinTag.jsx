import { useState } from 'react'
import { href } from '../../router.jsx'
import { Page, Card, Steps, Field, Alert, Badge, MockNote } from '../../components/ui.jsx'
import { clp } from '../../data/mock.js'

// Pasos pendientes de ejemplo para una patente sin TAG.
const PASOS = [
  { id: 1, fecha: '19-10-2026 11:32', portico: 'Rio Claro NS', cat: 1, monto: 3300, vence: '18-11-2026' },
  { id: 2, fecha: '19-10-2026 18:05', portico: 'Rio Claro SN', cat: 1, monto: 3300, vence: '18-11-2026' },
]

export default function SinTag() {
  const [step, setStep] = useState(1)
  const [patente, setPatente] = useState('')
  const [email, setEmail] = useState('')
  const [sel, setSel] = useState({ 1: true, 2: true })
  const chosen = PASOS.filter((p) => sel[p.id])
  const total = chosen.reduce((a, p) => a + p.monto, 0)
  const valid = /^[A-Z]{4}\d{2}$|^[A-Z]{2}\d{4}$/.test(patente)

  return (
    <Page title="Pasé sin TAG" subtitle="Regulariza tus pasos sin recargo dentro de 30 días. No necesitas cuenta.">
      <Steps steps={['Patente', 'Pasos pendientes', 'Pago', 'Comprobante']} current={step} />

      {step === 1 && (
        <div className="grid sidebar">
          <Card title="Ingresa la patente del vehículo">
            <Field label="Patente" hint="Formato ABCD12 o AB1234, sin guion.">
              <input className="input plate" placeholder="ABCD12" maxLength={6} value={patente} onChange={(e) => setPatente(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} />
            </Field>
            <Field label="Correo para el comprobante">
              <input className="input" type="email" placeholder="nombre@correo.cl" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <button className="btn primary" disabled={!valid || !email.includes('@')} onClick={() => setStep(2)}>Buscar pasos pendientes</button>
            <p className="xsmall muted" style={{ marginTop: 10 }}>Protegido con reCAPTCHA. Solo mostramos pasos de los últimos 30 días y nunca datos del titular.</p>
          </Card>
          <Card title="¿Cómo funciona?">
            <ol className="num-list small">
              <li>Ingresas la patente y un correo.</li>
              <li>Ves los pasos pendientes con fecha, pórtico y monto.</li>
              <li>Pagas con Webpay en una pantalla segura.</li>
              <li>Recibes el comprobante y la boleta por correo.</li>
            </ol>
            <Alert tone="info">Si pasas seguido, el <a href={href('tag')}>TAG</a> te ahorra este trámite y te da una sola boleta mensual.</Alert>
          </Card>
        </div>
      )}

      {step === 2 && (
        <div className="grid sidebar">
          <Card title={`Pasos pendientes de ${patente}`} right={<Badge tone="warn">{PASOS.length} pendientes</Badge>}>
            {PASOS.map((p) => (
              <label className="pay-row" key={p.id}>
                <input type="checkbox" checked={!!sel[p.id]} onChange={() => setSel((s) => ({ ...s, [p.id]: !s[p.id] }))} />
                <div className="meta">
                  <div className="t">{p.portico} · Cat. {p.cat}</div>
                  <div className="small muted">{p.fecha} · vence sin recargo el {p.vence}</div>
                </div>
                <div className="amt">{clp(p.monto)}</div>
              </label>
            ))}
          </Card>
          <div className="total-box">
            <div className="eyebrow">Resumen</div>
            <h3 style={{ margin: '6px 0 14px' }}>{chosen.length} pasos</h3>
            <div className="total-line grand"><span>Total</span><span>{clp(total)}</span></div>
            <button className="btn primary block" style={{ marginTop: 16 }} disabled={!chosen.length} onClick={() => setStep(3)}>Continuar al pago</button>
            <button className="btn ghost block" style={{ marginTop: 8 }} onClick={() => setStep(1)}>Cambiar patente</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid sidebar">
          <Card title="Pago seguro">
            <div className="kv"><span className="muted">Patente</span><strong>{patente}</strong></div>
            <div className="kv"><span className="muted">Pasos</span><strong>{chosen.length}</strong></div>
            <div className="kv"><span className="muted">Comprobante a</span><strong>{email}</strong></div>
            <div className="kv"><span className="muted">Documento</span><strong>Boleta electrónica</strong></div>
            <Field label="Medio de pago">
              <div className="pay-methods">
                <label className="pm on"><input type="radio" name="pm" defaultChecked /> Webpay · débito o crédito</label>
                <label className="pm"><input type="radio" name="pm" /> Transferencia (Khipu)</label>
              </div>
            </Field>
            <p className="xsmall muted">Serás redirigido a la pasarela. Survías no almacena datos de tarjeta.</p>
          </Card>
          <div className="total-box">
            <div className="total-line grand"><span>Total a pagar</span><span>{clp(total)}</span></div>
            <button className="btn primary block" style={{ marginTop: 16 }} onClick={() => setStep(4)}>Pagar {clp(total)}</button>
            <button className="btn ghost block" style={{ marginTop: 8 }} onClick={() => setStep(2)}>Volver</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <Card style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 44 }}>✅</div>
            <h3 style={{ marginTop: 8 }}>Pago realizado</h3>
            <p className="small muted" style={{ margin: '6px 0 18px' }}>
              Pagaste <strong>{clp(total)}</strong> por {chosen.length} pasos de la patente <strong>{patente}</strong>.
              Orden N° 884120. Enviamos la boleta y el comprobante a {email}.
            </p>
            <div className="grid" style={{ gap: 8 }}>
              <a href="#" className="btn navy block">Descargar comprobante (PDF)</a>
              <a href={href('tag')} className="btn ghost block">Quiero un TAG para no repetir esto</a>
              <button className="btn ghost block" onClick={() => { setStep(1); setPatente(''); setEmail('') }}>Regularizar otra patente</button>
            </div>
          </div>
        </Card>
      )}

      <MockNote><strong>Mockup de Pasé sin TAG.</strong> Flujo público interactivo con datos de ejemplo; la pasarela real es un paso posterior.</MockNote>
    </Page>
  )
}
