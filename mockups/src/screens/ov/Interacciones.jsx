import { useState } from 'react'
import { Page, Card, Badge, Field, Alert, Toast, MockNote } from '../../components/ui.jsx'
import { REQUERIMIENTOS, CHATS } from '../../data/mock.js'

const TONE = { Respondido: 'ok', 'En revisión': 'warn', Cerrado: 'info', Recibido: 'info', 'Requiere antecedentes': 'warn' }

export default function Interacciones() {
  const [tab, setTab] = useState('req')
  const [open, setOpen] = useState(REQUERIMIENTOS[0].folio)
  const [q, setQ] = useState('')
  const [nuevo, setNuevo] = useState(false)
  const [toast, setToast] = useState('')
  const reqs = REQUERIMIENTOS.filter((r) => !q || r.folio.toLowerCase().includes(q.toLowerCase()) || r.materia.toLowerCase().includes(q.toLowerCase()))

  return (
    <Page title="Mis interacciones comerciales" subtitle="Requerimientos, reclamos y conversaciones con el asistente, con su número de caso y estado."
      actions={<button className="btn primary sm" onClick={() => setNuevo(true)}>Nuevo requerimiento</button>}>
      <div className="tabs">
        <button className={tab === 'req' ? 'on' : ''} onClick={() => setTab('req')}>Requerimientos <span className="count">{REQUERIMIENTOS.length}</span></button>
        <button className={tab === 'chat' ? 'on' : ''} onClick={() => setTab('chat')}>Conversaciones con el asistente <span className="count">{CHATS.length}</span></button>
      </div>

      {nuevo && (
        <Card title="Nuevo requerimiento" right={<button className="link" onClick={() => setNuevo(false)}>Cancelar</button>}>
          <div className="grid cols-2" style={{ gap: 10 }}>
            <Field label="Tipo"><select className="input"><option>Reclamo</option><option>Consulta</option><option>Solicitud</option><option>Sugerencia</option></select></Field>
            <Field label="Materia"><select className="input"><option>Cobro de tránsito</option><option>TAG</option><option>Documentos</option><option>Datos del convenio</option><option>Otro</option></select></Field>
          </div>
          <Field label="Tránsito relacionado (opcional)"><select className="input"><option>Ninguno</option><option>21-10-2026 08:12 · Rio Claro NS · ABCD12</option><option>19-10-2026 09:05 · Retiro NS · EFGH34</option></select></Field>
          <Field label="Descripción"><textarea className="input" rows={4} placeholder="Cuéntanos qué pasó. Puedes adjuntar fotos o documentos." /></Field>
          <Field label="Adjuntos"><input type="file" className="input" multiple /></Field>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button className="btn primary" onClick={() => { setNuevo(false); setToast('Requerimiento REQ-2026-04633 ingresado. Plazo de respuesta: 5 días hábiles.') }}>Enviar requerimiento</button>
          </div>
        </Card>
      )}

      {tab === 'req' && (
        <>
          <Card>
            <div className="filters">
              <Field label="Buscar por folio o materia"><input className="input" placeholder="REQ-2026-…" value={q} onChange={(e) => setQ(e.target.value)} /></Field>
              <Field label="Estado"><select className="input"><option>Todos</option><option>Recibido</option><option>En revisión</option><option>Requiere antecedentes</option><option>Respondido</option><option>Cerrado</option></select></Field>
              <Field label="Período"><select className="input"><option>Últimos 12 meses</option><option>2026</option><option>2025</option></select></Field>
            </div>
          </Card>
          <div className="section grid" style={{ gap: 12 }}>
            {reqs.map((r) => (
              <Card key={r.folio} className={open === r.folio ? 'open' : ''}>
                <button className="req-head" onClick={() => setOpen(open === r.folio ? null : r.folio)} aria-expanded={open === r.folio}>
                  <div>
                    <div className="small muted">{r.folio} · ingresado el {r.fecha} · {r.canal}</div>
                    <strong>{r.materia}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Badge tone={TONE[r.estado]} dot>{r.estado}</Badge>
                    <div className="xsmall muted" style={{ marginTop: 4 }}>Actualizado {r.actualizado}</div>
                  </div>
                </button>
                {open === r.folio && (
                  <div className="req-body">
                    <div className="timeline">
                      <div className="tl"><span className="dot ok" /><div><strong>Recibido</strong><div className="xsmall muted">{r.fecha}</div></div></div>
                      <div className="tl"><span className={'dot ' + (r.estado === 'Recibido' ? '' : 'ok')} /><div><strong>En revisión</strong><div className="xsmall muted">{r.estado === 'Recibido' ? 'Pendiente' : 'Asignado a ejecutivo comercial'}</div></div></div>
                      {r.pendiente && <div className="tl"><span className="dot warn" /><div><strong>Requiere antecedentes</strong><div className="xsmall muted">{r.pendiente}</div><button className="btn ghost sm" style={{ marginTop: 6 }} onClick={() => setToast('Adjunto recibido. El caso vuelve a revisión.')}>Adjuntar documento</button></div></div>}
                      <div className="tl"><span className={'dot ' + (r.respuesta ? 'ok' : '')} /><div><strong>{r.estado === 'Cerrado' ? 'Respondido y cerrado' : 'Respondido'}</strong><div className="xsmall muted">{r.respuesta ? r.actualizado : 'Plazo máximo: 5 días hábiles'}</div></div></div>
                    </div>
                    {r.respuesta && (
                      <Alert tone="ok" title="Respuesta de Survías">
                        {r.respuesta}
                        {r.adjunto && <div style={{ marginTop: 8 }}><button className="link" onClick={() => setToast(`Descargando ${r.adjunto}…`)}>📎 {r.adjunto}</button></div>}
                      </Alert>
                    )}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                      {r.estado !== 'Cerrado' && <button className="btn ghost sm" onClick={() => setToast('Mensaje agregado al caso ' + r.folio)}>Agregar comentario</button>}
                      {r.estado === 'Respondido' && <button className="btn ghost sm" onClick={() => setToast('Caso reabierto. Un ejecutivo lo revisará.')}>No estoy conforme</button>}
                      <button className="btn ghost sm" onClick={() => setToast('No reconocer esta interacción la marca para revisión de seguridad.')}>No reconozco esta interacción</button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}

      {tab === 'chat' && (
        <div className="section grid" style={{ gap: 12 }}>
          {CHATS.map((c) => (
            <Card key={c.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div className="small muted">{c.id} · {c.fecha}</div>
                  <strong>{c.tema}</strong>
                </div>
                {c.derivado ? <Badge tone="warn" dot>Derivado · {c.folio}</Badge> : <Badge tone="ok" dot>Resuelto por el asistente</Badge>}
              </div>
              <p className="small muted" style={{ margin: '10px 0' }}>{c.resumen}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn ghost sm" onClick={() => setToast('Retomando conversación ' + c.id + ' en el asistente…')}>Retomar conversación</button>
                <button className="btn ghost sm" onClick={() => setToast('Descargando resumen de ' + c.id)}>Descargar resumen</button>
                <button className="link" onClick={() => setToast('Gracias. Revisaremos el resumen de ' + c.id)}>Reportar resumen erróneo</button>
              </div>
            </Card>
          ))}
          <Alert tone="info">Las conversaciones se conservan 12 meses según la política de retención. Puedes pedir su eliminación en Mi cuenta.</Alert>
        </div>
      )}

      <Toast msg={toast} onDone={() => setToast('')} />
      <MockNote><strong>Mockup de Mis interacciones comerciales.</strong> Reemplaza el salto al portal SAU con otro login: todo queda dentro de la Oficina Virtual.</MockNote>
    </Page>
  )
}
