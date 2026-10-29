import { useState } from 'react'
import { Card, Badge, Field, Alert, Toast, MockNote } from '../../components/ui.jsx'
import { REQUERIMIENTOS, CHATS } from '../../data/mock.js'
import ServiceIcon from '../../components/ServiceIcon.jsx'
import '../../interacciones.css'

const TONE = { Respondido: 'ok', 'En revisión': 'warn', Cerrado: 'info', Recibido: 'info', 'Requiere antecedentes': 'warn' }

export default function Interacciones() {
  const [tab, setTab] = useState('req')
  const [open, setOpen] = useState(REQUERIMIENTOS[0].folio)
  const [q, setQ] = useState('')
  const [nuevo, setNuevo] = useState(false)
  const [toast, setToast] = useState('')
  const reqs = REQUERIMIENTOS.filter((r) => !q || r.folio.toLowerCase().includes(q.toLowerCase()) || r.materia.toLowerCase().includes(q.toLowerCase()))
  const r = reqs.find((request) => request.folio === open)
  const metrics = [
    ['bill', 'Requerimientos', REQUERIMIENTOS.length],
    ['calendar', 'En revisión', REQUERIMIENTOS.filter((request) => request.estado === 'En revisión').length],
    ['status', 'Respondidos', REQUERIMIENTOS.filter((request) => request.estado === 'Respondido').length],
  ]

  return (
    <section className="interactions-page" aria-labelledby="interactions-title">
      <header className="interactions-head">
        <div><div className="interactions-eyebrow">Servicio al cliente</div>
          <h1 id="interactions-title">Mis interacciones comerciales</h1>
          <p>Requerimientos, reclamos y conversaciones con el asistente, con su número de caso y estado.</p>
        </div>
        <button type="button" className="btn primary" onClick={() => setNuevo(true)}><ServiceIcon type="bill" />Nuevo requerimiento</button>
      </header>
      <div className="interactions-metrics">
        {metrics.map(([icon, label, value]) => <div className="interactions-metric" key={label}><ServiceIcon type={icon} /><div><span>{label}</span><strong>{value}</strong></div></div>)}
      </div>
      <div className="interactions-tabs" aria-label="Tipo de interacción">
        <button type="button" aria-pressed={tab === 'req'} className={tab === 'req' ? 'on' : ''} onClick={() => setTab('req')}><ServiceIcon type="bill" />Requerimientos <span className="count">{REQUERIMIENTOS.length}</span></button>
        <button type="button" aria-pressed={tab === 'chat'} className={tab === 'chat' ? 'on' : ''} onClick={() => setTab('chat')}><ServiceIcon type="account" />Conversaciones con el asistente <span className="count">{CHATS.length}</span></button>
      </div>
      {nuevo && (
        <Card className="interactions-new" title="Nuevo requerimiento" right={<button className="link" onClick={() => setNuevo(false)}>Cancelar</button>}>
          <div className="grid cols-2" style={{ gap: 10 }}>
            <Field label="Tipo"><select aria-label="Tipo" className="input"><option>Reclamo</option><option>Consulta</option><option>Solicitud</option><option>Sugerencia</option></select></Field>
            <Field label="Materia"><select aria-label="Materia" className="input"><option>Cobro de tránsito</option><option>TAG</option><option>Documentos</option><option>Datos del convenio</option><option>Otro</option></select></Field>
          </div>
          <Field label="Tránsito relacionado (opcional)"><select aria-label="Tránsito relacionado (opcional)" className="input"><option>Ninguno</option><option>21-10-2026 08:12 · Rio Claro NS · ABCD12</option><option>19-10-2026 09:05 · Retiro NS · EFGH34</option></select></Field>
          <Field label="Descripción"><textarea aria-label="Descripción" className="input" rows={4} placeholder="Cuéntanos qué pasó. Puedes adjuntar fotos o documentos." /></Field>
          <Field label="Adjuntos"><input aria-label="Adjuntos" type="file" className="input" multiple /></Field>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button className="btn primary" onClick={() => { setNuevo(false); setToast('Requerimiento REQ-2026-04633 ingresado. Plazo de respuesta: 5 días hábiles.') }}>Enviar requerimiento</button>
          </div>
        </Card>
      )}

      {tab === 'req' && (
        <div className="interactions-workspace">
          <Card title="Listado de casos" className="interactions-list">
            <div className="interactions-list-label"><strong>Requerimientos</strong><span>{reqs.length} casos</span></div>
            <Field label="Buscar por folio o materia"><input aria-label="Buscar por folio o materia" className="input" placeholder="REQ-2026-…" value={q} onChange={(e) => setQ(e.target.value)} /></Field>
            <div className="interactions-filters">
              <Field label="Estado"><select aria-label="Estado" className="input"><option>Todos</option><option>Recibido</option><option>En revisión</option><option>Requiere antecedentes</option><option>Respondido</option><option>Cerrado</option></select></Field>
              <Field label="Período"><select aria-label="Período" className="input"><option>Últimos 12 meses</option><option>2026</option><option>2025</option></select></Field>
            </div>
            <div className="interactions-cases">
              {reqs.map((request) => <button type="button" key={request.folio} className={'interactions-case' + (open === request.folio ? ' selected' : '')} onClick={() => setOpen(open === request.folio ? null : request.folio)} aria-expanded={open === request.folio} aria-controls="interaction-detail">
                <span className="interactions-case-top"><span>{request.folio}</span><Badge tone={TONE[request.estado]}>{request.estado}</Badge></span>
                <strong>{request.materia}</strong><span className="interactions-case-date">ingresado el {request.fecha}</span>
              </button>)}
              {!reqs.length && <p className="interactions-empty" role="status">No se encontraron requerimientos.</p>}
            </div>
          </Card>
          <Card title="Detalle del requerimiento" className="interactions-detail">
            <div id="interaction-detail">
              {r ? <>
                <div className="interactions-detail-head">
                  <div><div className="interactions-eyebrow">{r.folio}</div><h2>{r.materia}</h2></div>
                  <Badge tone={TONE[r.estado]} dot>{r.estado}</Badge>
                  <p>ingresado el {r.fecha} · {r.canal} · Actualizado {r.actualizado}</p>
                </div>
                  <div className="req-body">
                    <h3 className="interactions-followup">Seguimiento del requerimiento</h3>
                    <div className="timeline">
                      <div className="tl"><span className="dot ok" /><div><strong>Recibido</strong><div className="xsmall muted">{r.fecha}</div></div></div>
                      <div className="tl"><span className={'dot ' + (r.estado === 'Recibido' ? '' : 'ok')} /><div><strong>En revisión</strong><div className="xsmall muted">{r.estado === 'Recibido' ? 'Pendiente' : 'Asignado a ejecutivo comercial'}</div></div></div>
                      {r.pendiente && <div className="tl"><span className="dot warn" /><div><strong>Requiere antecedentes</strong><div className="xsmall muted">{r.pendiente}</div><button className="btn ghost sm" style={{ marginTop: 6 }} onClick={() => setToast('Adjunto recibido. El caso vuelve a revisión.')}>Adjuntar documento</button></div></div>}
                      <div className="tl"><span className={'dot ' + (r.respuesta ? 'ok' : '')} /><div><strong>{r.estado === 'Cerrado' ? 'Respondido y cerrado' : 'Respondido'}</strong><div className="xsmall muted">{r.respuesta ? r.actualizado : 'Plazo máximo: 5 días hábiles'}</div></div></div>
                    </div>
                    {r.respuesta && (
                      <Alert tone="ok" title="Respuesta de Survías">
                        {r.respuesta}
                        {r.adjunto && <div style={{ marginTop: 8 }}><button className="link interactions-attachment" onClick={() => setToast(`Descargando ${r.adjunto}…`)}><ServiceIcon type="bill" />{r.adjunto}</button></div>}
                      </Alert>
                    )}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                      {r.estado !== 'Cerrado' && <button className="btn ghost sm" onClick={() => setToast('Mensaje agregado al caso ' + r.folio)}><ServiceIcon type="account" />Agregar comentario</button>}
                      {r.estado === 'Respondido' && <button className="btn ghost sm" onClick={() => setToast('Caso reabierto. Un ejecutivo lo revisará.')}><ServiceIcon type="status" />No estoy conforme</button>}
                      <button className="btn ghost sm" onClick={() => setToast('No reconocer esta interacción la marca para revisión de seguridad.')}><ServiceIcon type="shield" />No reconozco esta interacción</button>
                    </div>
                  </div>
              </> : <div className="interactions-empty"><ServiceIcon type="bill" /><p>{reqs.length ? 'Selecciona un requerimiento para ver su detalle.' : 'No se encontraron requerimientos.'}</p></div>}
            </div>
          </Card>
        </div>
      )}
      {tab === 'chat' && (
        <div className="interactions-chats">
          {CHATS.map((c) => (
            <Card key={c.id} className="interactions-chat">
              <div className="interactions-chat-head">
                <div className="interactions-chat-mark"><ServiceIcon type="account" /></div>
                <div className="interactions-chat-heading">
                  <div className="interactions-chat-meta">{c.id} · {c.fecha}</div>
                  <h2>{c.tema}</h2>
                </div>
                {c.derivado ? <Badge tone="warn" dot>Derivado · {c.folio}</Badge> : <Badge tone="ok" dot>Resuelto por el asistente</Badge>}
              </div>
              <p className="interactions-chat-summary">{c.resumen}</p>
              <div className="interactions-chat-actions">
                <button type="button" className="btn primary sm" onClick={() => setToast('Retomando conversación ' + c.id + ' en el asistente…')}><ServiceIcon type="account" />Retomar conversación</button>
                <button type="button" className="btn ghost sm" onClick={() => setToast('Descargando resumen de ' + c.id)}><ServiceIcon type="bill" />Descargar resumen</button>
                <button type="button" className="link interactions-chat-report" onClick={() => setToast('Gracias. Revisaremos el resumen de ' + c.id)}><ServiceIcon type="status" />Reportar resumen erróneo</button>
              </div>
            </Card>
          ))}
          <div className="interactions-retention"><ServiceIcon type="shield" /><p>Las conversaciones se conservan 12 meses según la política de retención. Puedes pedir su eliminación en Mi cuenta.</p></div>
        </div>
      )}

      <Toast msg={toast} onDone={() => setToast('')} />
      <MockNote><strong>Mockup de Mis interacciones comerciales.</strong> Reemplaza el salto al portal SAU con otro login: todo queda dentro de la Oficina Virtual.</MockNote>
    </section>
  )
}
