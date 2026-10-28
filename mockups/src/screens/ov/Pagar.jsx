import { useState } from 'react'
import { href } from '../../router.jsx'
import { Page, Card, Steps, Badge, Field, MockNote } from '../../components/ui.jsx'
import { TRANSITOS, USER, clp } from '../../data/mock.js'

const PENDIENTES = TRANSITOS.filter((t) => t.estado === 'No facturado')

export default function Pagar() {
  const [sel, setSel] = useState(Object.fromEntries(PENDIENTES.map((t) => [t.id, true])))
  const [step, setStep] = useState(1)
  const [doc, setDoc] = useState('boleta')
  const [medio, setMedio] = useState('webpay')
  const chosen = PENDIENTES.filter((t) => sel[t.id])
  const total = chosen.reduce((a, t) => a + t.monto, 0)

  return (
    <Page title="Pagar y facturar tránsitos" subtitle="Elige qué pagar, confirma tus datos y recibe el comprobante.">
      <Steps steps={['Elegir', 'Confirmar', 'Pagar', 'Comprobante']} current={step} />

      {step === 1 && (
        <div className="grid sidebar">
          <Card title="Tránsitos no facturados" right={<Badge tone="warn">{PENDIENTES.length} elegibles</Badge>}>
            {PENDIENTES.map((t) => (
              <label className="pay-row" key={t.id}>
                <input type="checkbox" checked={!!sel[t.id]} onChange={() => setSel((s) => ({ ...s, [t.id]: !s[t.id] }))} />
                <div className="meta">
                  <div className="t">{t.portico} · {t.patente}</div>
                  <div className="small muted">{t.fecha} {t.hora} · Cat. {t.cat}</div>
                </div>
                <div className="amt">{clp(t.monto)}</div>
              </label>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button className="link" onClick={() => setSel(Object.fromEntries(PENDIENTES.map((t) => [t.id, true])))}>Seleccionar todos</button>
              <button className="link" onClick={() => setSel({})}>Ninguno</button>
            </div>
          </Card>
          <div className="total-box">
            <div className="eyebrow">Resumen</div>
            <h3 style={{ margin: '6px 0 14px' }}>{chosen.length} tránsitos</h3>
            <div className="total-line"><span className="muted">Neto</span><span>{clp(Math.round(total / 1.19))}</span></div>
            <div className="total-line"><span className="muted">IVA (19 %)</span><span>{clp(total - Math.round(total / 1.19))}</span></div>
            <div className="total-line grand"><span>Total</span><span>{clp(total)}</span></div>
            <button className="btn primary block" style={{ marginTop: 16 }} disabled={!chosen.length} onClick={() => setStep(2)}>Continuar</button>
            <p className="xsmall muted" style={{ marginTop: 10 }}>Verás el detalle y tus datos antes de confirmar.</p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid sidebar">
          <Card title="Confirma tus datos y el documento">
            <div className="grid cols-2" style={{ marginBottom: 16 }}>
              <div><div className="k xsmall muted">Titular</div><div><strong>{USER.nombreCompleto}</strong></div></div>
              <div><div className="k xsmall muted">RUT</div><div>{USER.rut}</div></div>
              <div><div className="k xsmall muted">Envío</div><div>{USER.email} + aviso SMS</div></div>
              <div><div className="k xsmall muted">Convenio</div><div>{USER.convenio}</div></div>
            </div>
            <Field label="Documento tributario">
              <div className="seg">
                <button type="button" className={doc === 'boleta' ? 'on' : ''} onClick={() => setDoc('boleta')}>Boleta electrónica</button>
                <button type="button" className={doc === 'factura' ? 'on' : ''} onClick={() => setDoc('factura')}>Factura electrónica</button>
              </div>
            </Field>
            {doc === 'factura' && (
              <div className="grid cols-2" style={{ gap: 10 }}>
                <Field label="RUT empresa"><input className="input" placeholder="76.123.456-7" /></Field>
                <Field label="Razón social"><input className="input" placeholder="Empresa SpA" /></Field>
                <Field label="Giro"><input className="input" placeholder="Transporte de carga" /></Field>
                <Field label="Dirección comercial"><input className="input" placeholder="Calle 123, Talca" /></Field>
              </div>
            )}
            <table className="table">
              <thead><tr><th>Tránsito</th><th>Fecha</th><th className="num">Monto</th></tr></thead>
              <tbody>{chosen.map((t) => <tr key={t.id}><td>{t.portico} · {t.patente}</td><td>{t.fecha} {t.hora}</td><td className="num">{clp(t.monto)}</td></tr>)}</tbody>
            </table>
          </Card>
          <div className="total-box">
            <div className="total-line grand"><span>Total a pagar</span><span>{clp(total)}</span></div>
            <button className="btn primary block" style={{ marginTop: 16 }} onClick={() => setStep(3)}>Confirmar y elegir medio de pago</button>
            <button className="btn ghost block" style={{ marginTop: 8 }} onClick={() => setStep(1)}>Volver</button>
            <p className="xsmall muted" style={{ marginTop: 10 }}>No se cobra dos veces si la emisión del documento queda pendiente.</p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid sidebar">
          <Card title="Medio de pago">
            <div className="pay-methods">
              <label className={'pm' + (medio === 'webpay' ? ' on' : '')}><input type="radio" name="medio" checked={medio === 'webpay'} onChange={() => setMedio('webpay')} /> Webpay · débito o crédito</label>
              <label className={'pm' + (medio === 'khipu' ? ' on' : '')}><input type="radio" name="medio" checked={medio === 'khipu'} onChange={() => setMedio('khipu')} /> Transferencia (Khipu)</label>
              <label className={'pm' + (medio === 'pac' ? ' on' : '')}><input type="radio" name="medio" checked={medio === 'pac'} onChange={() => setMedio('pac')} /> Cuenta inscrita (PAC) · Banco terminado en 4421</label>
            </div>
            <p className="xsmall muted" style={{ marginTop: 10 }}>Serás redirigido a la pasarela en una pantalla segura. Survías no almacena datos de tarjeta.</p>
          </Card>
          <div className="total-box">
            <div className="total-line grand"><span>Total</span><span>{clp(total)}</span></div>
            <button className="btn primary block" style={{ marginTop: 16 }} onClick={() => setStep(4)}>Pagar {clp(total)}</button>
            <button className="btn ghost block" style={{ marginTop: 8 }} onClick={() => setStep(2)}>Volver</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <Card style={{ maxWidth: 580, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 44 }}>✅</div>
            <h3 style={{ marginTop: 8 }}>Pago realizado</h3>
            <p className="small muted" style={{ margin: '6px 0 14px' }}>
              Pagaste <strong>{clp(total)}</strong> por {chosen.length} tránsitos. Orden N° 884131 · {medio === 'webpay' ? 'Webpay' : medio === 'khipu' ? 'Khipu' : 'PAC'}.
            </p>
            <div className="status-list">
              <div><Badge tone="ok" dot>Pago aprobado</Badge><span className="xsmall muted">hoy 12:48</span></div>
              <div><Badge tone="ok" dot>{doc === 'factura' ? 'Factura' : 'Boleta'} emitida N° 10781002</Badge><span className="xsmall muted">hoy 12:48</span></div>
              <div><Badge tone="ok" dot>Enviada a {USER.email}</Badge><span className="xsmall muted">hoy 12:49</span></div>
              <div><Badge tone="info" dot>SMS con enlace seguro</Badge><span className="xsmall muted">en curso</span></div>
            </div>
            <div className="grid" style={{ gap: 8, marginTop: 16 }}>
              <a href="#" className="btn navy block">Descargar comprobante (PDF)</a>
              <a href={href('ov/pagos')} className="btn ghost block">Ver documentos</a>
              <a href={href('ov/resumen')} className="btn ghost block">Volver al resumen</a>
            </div>
          </div>
        </Card>
      )}

      <MockNote><strong>Mockup del flujo de pago / autofacturación.</strong> Interactivo para la demo; la pasarela real es un paso posterior.</MockNote>
    </Page>
  )
}
