import { useState } from 'react'
import { href } from '../../router.jsx'
import { Page, Card, Badge, Alert, Toast, MockNote } from '../../components/ui.jsx'
import { DOCUMENTOS, TRANSITOS, clp } from '../../data/mock.js'

export default function Pagos() {
  const [toast, setToast] = useState('')
  const pendientes = TRANSITOS.filter((t) => t.estado === 'No facturado')
  const deuda = pendientes.reduce((a, t) => a + t.monto, 0)

  return (
    <Page title="Pagos y documentos" subtitle="Deuda vigente, medios de pago y tus boletas y facturas."
      actions={<a href={href('ov/pagar')} className="btn primary sm">Pagar {clp(deuda)}</a>}>
      <div className="grid sidebar">
        <Card title="Deuda vigente" right={<Badge tone="warn" dot>{pendientes.length} tránsitos no facturados</Badge>}>
          <div className="debt-row">
            <div><div className="k xsmall muted">Monto</div><div className="big">{clp(deuda)}</div></div>
            <div><div className="k xsmall muted">Próxima boleta</div><div><strong>23-11-2026</strong></div></div>
            <div><div className="k xsmall muted">Vence sin recargo</div><div><strong>08-12-2026</strong></div></div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
            <a href={href('ov/pagar')} className="btn primary">Pagar y facturar ahora</a>
            <a href={href('ov/repactar')} className="btn ghost">Simular repactación</a>
            <button className="btn ghost" onClick={() => setToast('PAC activado en demo: los pagos se cargarán a tu cuenta el día 5 de cada mes.')}>Activar pago automático (PAC)</button>
          </div>
        </Card>

        <Card title="Medios de pago">
          <div className="kv"><span className="muted">Webpay</span><strong>Débito y crédito</strong></div>
          <div className="kv"><span className="muted">Transferencia</span><strong>Khipu</strong></div>
          <div className="kv"><span className="muted">Automático</span><strong>PAC / PAT</strong></div>
          <div className="kv"><span className="muted">Presencial</span><strong>Puntos de atención</strong></div>
          <Alert tone="info">Si un pago se aprueba pero la boleta queda pendiente, verás ambos estados por separado y nunca se cobra dos veces.</Alert>
        </Card>
      </div>

      <div className="section">
        <Card title="Documentos emitidos" right={<span className="xsmall muted">{DOCUMENTOS.length} documentos · últimos 12 meses</span>} tight>
          <div className="table-scroll">
            <table className="table">
              <thead><tr><th>Documento</th><th>N°</th><th>Emisión</th><th className="num">Monto</th><th>Estado de pago</th><th>Medio</th><th className="center">Descargar</th></tr></thead>
              <tbody>
                {DOCUMENTOS.map((d) => (
                  <tr key={d.nro}>
                    <td><strong>{d.tipo}</strong><div className="xsmall muted">{d.tipoLabel}</div></td>
                    <td>{d.nro}</td>
                    <td>{d.fecha}</td>
                    <td className="num">{clp(d.monto)}</td>
                    <td>{d.pagado ? <Badge tone="ok" dot>Pagado el {d.fechaPago}</Badge> : <Badge tone="warn" dot>Pendiente</Badge>}</td>
                    <td className="small">{d.medio}</td>
                    <td className="center"><button className="link" onClick={() => setToast(`Descargando ${d.tipoLabel} N° ${d.nro}…`)}>PDF ↓</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-body" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn ghost sm" onClick={() => setToast('Preparando ZIP con 5 documentos…')}>Descargar todos (ZIP)</button>
            <a href={href('ov/suscripciones')} className="btn ghost sm">Recibir boleta por email</a>
          </div>
        </Card>
      </div>

      <Toast msg={toast} onDone={() => setToast('')} />
      <MockNote><strong>Mockup de Pagos y documentos.</strong> Corrige lo observado en el portal: monto real por documento, fecha y medio de pago en texto, pago siempre visible.</MockNote>
    </Page>
  )
}
