import { useState } from 'react'
import { href } from '../../router.jsx'
import { Card, Badge, Alert, Toast, MockNote } from '../../components/ui.jsx'
import { DOCUMENTOS, TRANSITOS, clp } from '../../data/mock.js'
import ServiceIcon from '../../components/ServiceIcon.jsx'
import '../../pagos.css'

const PAYMENT_METHODS = [
  { label: 'Webpay', detail: 'Débito y crédito', icon: 'payment' },
  { label: 'Transferencia', detail: 'Khipu', icon: 'account' },
  { label: 'Automático', detail: 'PAC / PAT', icon: 'status' },
  { label: 'Presencial', detail: 'Puntos de atención', icon: 'map' },
]

export default function Pagos() {
  const [toast, setToast] = useState('')
  const pendientes = TRANSITOS.filter((t) => t.estado === 'No facturado')
  const deuda = pendientes.reduce((a, t) => a + t.monto, 0)

  return (
    <div className="pagos-page">
      <header className="pagos-head">
        <div>
          <p className="pagos-eyebrow">Facturación</p>
          <h1>Pagos y documentos</h1>
          <p>Deuda vigente, medios de pago y tus boletas y facturas.</p>
        </div>
        <a href={href('ov/pagar')} className="btn primary"><ServiceIcon type="payment" /> Pagar {clp(deuda)}</a>
      </header>

      <div className="pagos-overview">
        <Card className="pagos-debt" title="Deuda vigente">
          <div className="pagos-debt-status"><Badge tone="warn">{pendientes.length} tránsitos no facturados</Badge></div>
          <div className="pagos-amount">
            <span>Monto</span>
            <strong>{clp(deuda)}</strong>
          </div>
          <dl className="pagos-dates">
            <div><dt>Próxima boleta</dt><dd>23-11-2026</dd></div>
            <div><dt>Vence sin recargo</dt><dd>08-12-2026</dd></div>
          </dl>
          <div className="pagos-debt-actions">
            <a href={href('ov/pagar')} className="btn primary"><span aria-hidden="true">→</span> Pagar y facturar ahora</a>
            <a href={href('ov/repactar')} className="btn ghost">Simular repactación</a>
          </div>
          <button className="pagos-pac" onClick={() => setToast('PAC activado en demo: los pagos se cargarán a tu cuenta el día 5 de cada mes.')}>Activar pago automático (PAC)</button>
        </Card>

        <Card className="pagos-methods" title="Medios de pago">
          <ul className="pagos-method-list">
            {PAYMENT_METHODS.map((method) => <li key={method.label}>
              <ServiceIcon type={method.icon} />
              <div><strong>{method.label}</strong><span>{method.detail}</span></div>
            </li>)}
          </ul>
          <Alert tone="info">Si un pago se aprueba pero la boleta queda pendiente, verás ambos estados por separado y nunca se cobra dos veces.</Alert>
        </Card>
      </div>

      <Card className="pagos-documents" title="Documentos emitidos" right={<span className="pagos-document-count">{DOCUMENTOS.length} documentos · últimos 12 meses</span>} tight>
        <div className="pagos-document-tools">
          <button className="btn ghost" onClick={() => setToast('Preparando ZIP con 5 documentos…')}><span aria-hidden="true">↓</span> Descargar todos (ZIP)</button>
        </div>
        <div className="pagos-table-scroll" role="region" aria-label="Documentos emitidos, tabla desplazable" tabIndex={0}>
          <table className="table">
            <thead><tr><th scope="col">Documento</th><th scope="col">N°</th><th scope="col">Emisión</th><th scope="col" className="num">Monto</th><th scope="col">Estado de pago</th><th scope="col">Medio</th><th scope="col" className="center">Descargar</th></tr></thead>
            <tbody>
              {DOCUMENTOS.map((d) => (
                <tr key={d.nro}>
                  <td><strong>{d.tipoLabel}</strong><div className="pagos-document-type">{d.tipo}</div></td>
                  <td>{d.nro}</td>
                  <td>{d.fecha}</td>
                  <td className="num">{clp(d.monto)}</td>
                  <td>{d.pagado ? <Badge tone="ok">Pagado el {d.fechaPago}</Badge> : <Badge tone="warn">Pendiente</Badge>}</td>
                  <td>{d.medio}</td>
                  <td className="center"><button className="link" aria-label={`Descargar PDF de ${d.tipoLabel} N° ${d.nro}`} onClick={() => setToast(`Descargando ${d.tipoLabel} N° ${d.nro}…`)}>PDF ↓</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagos-document-footer">
          <a href={href('ov/suscripciones')}>Recibir boleta por email <span aria-hidden="true">→</span></a>
        </div>
      </Card>

      <Toast msg={toast} onDone={() => setToast('')} />
      <MockNote><strong>Mockup de Pagos y documentos.</strong> Corrige lo observado en el portal: monto real por documento, fecha y medio de pago en texto, pago siempre visible.</MockNote>
    </div>
  )
}
