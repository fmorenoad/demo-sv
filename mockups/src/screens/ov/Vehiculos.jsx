import { useState } from 'react'
import { Page, Card, Badge, Field, Alert, VerifyModal, Toast, MockNote } from '../../components/ui.jsx'
import { VEHICULOS } from '../../data/mock.js'

export default function Vehiculos() {
  const [list, setList] = useState(VEHICULOS)
  const [alta, setAlta] = useState(false)
  const [patente, setPatente] = useState('')
  const [verify, setVerify] = useState(null) // {type, patente}
  const [toast, setToast] = useState('')

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
    <Page title="Vehículos y TAG" subtitle="Hasta 5 vehículos por convenio. Alta, baja, bloqueo y reemplazo de TAG en línea."
      actions={<button className="btn primary sm" onClick={() => setAlta(true)}>Agregar vehículo</button>}>
      {alta && (
        <Card title="Agregar vehículo" right={<button className="link" onClick={() => setAlta(false)}>Cancelar</button>}>
          <div className="grid cols-2" style={{ gap: 10 }}>
            <Field label="Patente" hint="Validamos la patente con el Registro Civil."><input className="input plate" maxLength={6} placeholder="ABCD12" value={patente} onChange={(e) => setPatente(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} /></Field>
            <Field label="Padrón o certificado de inscripción"><input type="file" className="input" /></Field>
            <Field label="¿Necesitas TAG?"><select className="input"><option>Sí, enviar a mi dirección</option><option>Sí, retirar en Talca</option><option>Sí, retirar en Chillán</option><option>No, ya tengo uno (traspaso)</option></select></Field>
            <Field label="Categoría"><select className="input"><option>Cat. 1 · Autos y camionetas</option><option>Cat. 2 · Con remolque</option><option>Cat. 5 · Motocicleta</option></select></Field>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn primary" disabled={!/^[A-Z]{4}\d{2}$|^[A-Z]{2}\d{4}$/.test(patente)} onClick={() => setVerify({ type: 'alta' })}>Solicitar alta</button>
          </div>
        </Card>
      )}

      <div className="section grid" style={{ gap: 12 }}>
        {list.map((v) => (
          <Card key={v.patente}>
            <div className="veh-row">
              <div className="plate-badge">{v.patente}</div>
              <div style={{ flex: 1 }}>
                <strong>{v.marca} {v.modelo} {v.anio}</strong>
                <div className="small muted">{v.tipo} · Cat. {v.cat} · TAG {v.tagId}</div>
              </div>
              <Badge tone={v.tag === 'Activo' ? 'ok' : v.tag === 'Bloqueado' ? 'danger' : 'warn'} dot>{v.tag}</Badge>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              {v.tag === 'Activo' && <button className="btn ghost sm" onClick={() => setVerify({ type: 'bloqueo', patente: v.patente })}>Bloquear TAG (robo o pérdida)</button>}
              {v.tag === 'Bloqueado' && <button className="btn ghost sm" onClick={() => setToast('Reemplazo solicitado. Llega en 3 días hábiles.')}>Solicitar reemplazo</button>}
              {v.tag === 'Pendiente de instalación' && <button className="btn ghost sm" onClick={() => setToast('Instalación agendada: 29-10-2026 10:30, Talca.')}>Agendar instalación</button>}
              <button className="btn ghost sm" onClick={() => setToast('Traspaso de TAG: elige la nueva patente en el formulario de alta.')}>Traspasar a otra patente</button>
              <button className="btn ghost sm" onClick={() => setToast('Reporte enviado. Revisaremos los pórticos de los últimos 7 días.')}>El TAG no suena</button>
              <button className="link danger" onClick={() => setVerify({ type: 'baja', patente: v.patente })}>Dar de baja</button>
            </div>
          </Card>
        ))}
      </div>

      <Alert tone="info" title="Autenticación reforzada">Alta, baja y bloqueo piden un código de verificación. Todo cambio queda registrado en Mis interacciones.</Alert>
      <VerifyModal open={!!verify} title={verify?.type === 'alta' ? 'Confirma el alta del vehículo' : verify?.type === 'bloqueo' ? 'Confirma el bloqueo del TAG' : 'Confirma la baja'} onCancel={() => setVerify(null)} onConfirm={doConfirm} />
      <Toast msg={toast} onDone={() => setToast('')} />
      <MockNote><strong>Mockup de Vehículos y TAG.</strong> Funcionalidad nueva: el portal actual solo lista vehículos.</MockNote>
    </Page>
  )
}
