import { cloneElement, useId, useState } from 'react'
import { Card, Badge, Alert, VerifyModal, Toast, MockNote } from '../../components/ui.jsx'
import { VEHICULOS } from '../../data/mock.js'
import ServiceIcon from '../../components/ServiceIcon.jsx'
import '../../vehiculos.css'

function Field({ label, hint, children }) {
  const id = useId()
  return <div className="field">
    <label htmlFor={id}>{label}</label>
    {cloneElement(children, { id, ...(hint ? { 'aria-describedby': id + '-hint' } : {}) })}
    {hint && <div id={id + '-hint'} className="vehiculos-hint">{hint}</div>}
  </div>
}

export default function Vehiculos() {
  const [list, setList] = useState(VEHICULOS)
  const [alta, setAlta] = useState(false)
  const [patente, setPatente] = useState('')
  const [verify, setVerify] = useState(null)
  const [toast, setToast] = useState('')
  const [detail, setDetail] = useState(null)
  const activeCount = list.filter((v) => v.tag === 'Activo').length
  const pendingCount = list.filter((v) => v.tag !== 'Activo' && v.tag !== 'Bloqueado').length
  const metrics = [
    { label: 'Vehículos asociados', value: list.length, hint: 'Máximo permitido: 5', icon: 'car' },
    { label: 'TAG activos', value: activeCount, hint: 'Dispositivos habilitados', icon: 'status' },
    { label: 'Pendientes', value: pendingCount, hint: 'Instalación o solicitud en curso', icon: 'calendar' },
  ]

  const doConfirm = () => {
    const v = verify; setVerify(null)
    if (v.type === 'alta') {
      setList((l) => [...l, { patente, tipo: 'Auto', marca: 'Por confirmar', modelo: '', anio: '', tag: 'Solicitud en curso', tagId: '—', cat: 1 }])
      setToast(`Solicitud de alta para ${patente} ingresada. Folio REQ-2026-04640.`)
      setAlta(false); setPatente('')
    } else if (v.type === 'bloqueo') {
      setList((l) => l.map((x) => x.patente === v.patente ? { ...x, tag: 'Bloqueado' } : x))
      setToast(`TAG de ${v.patente} bloqueado. Los tránsitos posteriores no se cobran.`)
    } else if (v.type === 'baja') {
      setList((l) => l.filter((x) => x.patente !== v.patente))
      setToast(`${v.patente} desvinculado del convenio.`)
    }
  }

  return (
    <div className="vehiculos-page">
      <header className="vehiculos-head">
        <div>
          <p className="vehiculos-eyebrow">Mis vehículos</p>
          <h1>Vehículos y TAG</h1>
          <p>Hasta 5 vehículos por convenio. Alta, baja, bloqueo y reemplazo de TAG en línea.</p>
        </div>
        <button className="btn primary" onClick={() => setAlta(true)}><span aria-hidden="true">+</span> Agregar vehículo</button>
      </header>

      <div className="vehiculos-metrics" aria-label="Resumen de vehículos">
        {metrics.map((metric) => <section className="vehiculos-metric" key={metric.label}>
          <ServiceIcon type={metric.icon} />
          <div><h2>{metric.label}</h2><strong>{metric.value}</strong><p>{metric.hint}</p></div>
        </section>)}
      </div>
      {alta && (
        <Card className="vehiculos-add" title="Agregar vehículo" right={<button className="link" onClick={() => setAlta(false)}>Cancelar</button>}>
          <div className="vehiculos-fields">
            <Field label="Patente" hint="Validamos la patente con el Registro Civil."><input className="input plate" maxLength={6} placeholder="ABCD12" value={patente} onChange={(e) => setPatente(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} /></Field>
            <Field label="Padrón o certificado de inscripción"><input type="file" className="input" /></Field>
            <Field label="¿Necesitas TAG?"><select className="input"><option>Sí, enviar a mi dirección</option><option>Sí, retirar en Talca</option><option>Sí, retirar en Chillán</option><option>No, ya tengo uno (traspaso)</option></select></Field>
            <Field label="Categoría"><select className="input"><option>Cat. 1 · Autos y camionetas</option><option>Cat. 2 · Con remolque</option><option>Cat. 5 · Motocicleta</option></select></Field>
          </div>
          <div className="vehiculos-form-actions">
            <button className="btn primary" disabled={!/^[A-Z]{4}\d{2}$|^[A-Z]{2}\d{4}$/.test(patente)} onClick={() => setVerify({ type: 'alta' })}>Solicitar alta</button>
          </div>
        </Card>
      )}

      <div className="vehiculos-grid">
        {list.map((v) => (
          <article className="vehiculo-card" key={v.patente}>
            <div className="vehiculo-top">
              <span className="vehiculo-plate">{v.patente}</span>
              <Badge tone={v.tag === 'Activo' ? 'ok' : v.tag === 'Bloqueado' ? 'danger' : 'warn'}>{v.tag}</Badge>
            </div>
            <div className="vehiculo-illustration"><ServiceIcon type="car" /></div>
            <h2>{v.marca} {v.modelo}</h2>
            <p className="vehiculo-meta">{[v.anio, v.tipo, `Cat. ${v.cat}`].filter(Boolean).join(' · ')}</p>
            <div className="vehiculo-tag">
              <span>Dispositivo TAG</span>
              <strong>{v.tagId === '—' ? 'Sin TAG asignado' : v.tagId}</strong>
            </div>
            <div className="vehiculo-actions">
              <button className="btn primary" aria-expanded={detail === v.patente} aria-controls={`vehicle-detail-${v.patente}`}
                onClick={() => setDetail(detail === v.patente ? null : v.patente)}>
                <span aria-hidden="true">→</span> {detail === v.patente ? 'Ocultar detalle' : 'Ver detalle'}
              </button>
              <details className="vehiculo-more">
                <summary className="btn ghost"><span aria-hidden="true">···</span> Más acciones</summary>
                <div className="vehiculo-menu">
                  {v.tag === 'Activo' && <button onClick={() => setVerify({ type: 'bloqueo', patente: v.patente })}>Bloquear TAG (robo o pérdida)</button>}
                  {v.tag === 'Bloqueado' && <button onClick={() => setToast('Reemplazo solicitado. Llega en 3 días hábiles.')}>Solicitar reemplazo</button>}
                  {v.tag === 'Pendiente de instalación' && <button onClick={() => setToast('Instalación agendada: 29-10-2026 10:30, Talca.')}>Agendar instalación</button>}
                  <button onClick={() => setToast('Traspaso de TAG: elige la nueva patente en el formulario de alta.')}>Traspasar a otra patente</button>
                  <button onClick={() => setToast('Reporte enviado. Revisaremos los pórticos de los últimos 7 días.')}>El TAG no suena</button>
                  <button className="danger" onClick={() => setVerify({ type: 'baja', patente: v.patente })}>Dar de baja</button>
                </div>
              </details>
            </div>
            <div id={`vehicle-detail-${v.patente}`} hidden={detail !== v.patente}>
              <dl className="vehiculo-detail">
                <div><dt>Patente</dt><dd>{v.patente}</dd></div>
                <div><dt>Tipo</dt><dd>{v.tipo}</dd></div>
                <div><dt>Año</dt><dd>{v.anio || 'Por confirmar'}</dd></div>
                <div><dt>Categoría</dt><dd>{v.cat}</dd></div>
                <div><dt>Estado del TAG</dt><dd>{v.tag}</dd></div>
                <div><dt>TAG</dt><dd>{v.tagId}</dd></div>
              </dl>
            </div>
          </article>
        ))}
      </div>

      <div className="vehiculos-security">
        <ServiceIcon type="shield" />
      <Alert tone="info" title="Autenticación reforzada">Alta, baja y bloqueo piden un código de verificación. Todo cambio queda registrado en Mis interacciones.</Alert>
      </div>
      <VerifyModal open={!!verify} title={verify?.type === 'alta' ? 'Confirma el alta del vehículo' : verify?.type === 'bloqueo' ? 'Confirma el bloqueo del TAG' : 'Confirma la baja'} onCancel={() => setVerify(null)} onConfirm={doConfirm} />
      <Toast msg={toast} onDone={() => setToast('')} />
      <MockNote><strong>Mockup de Vehículos y TAG.</strong> Funcionalidad nueva: el portal actual solo lista vehículos.</MockNote>
    </div>
  )
}
