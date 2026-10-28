import { useState } from 'react'
import { Page, Card, Toggle, Field, Alert, Toast, MockNote } from '../../components/ui.jsx'
import { USER, TRAMOS } from '../../data/mock.js'

export default function Suscripciones() {
  const [s, setS] = useState({ boleta: true, deuda: true, transito: false, vencimiento: true, ruta: true, pagoOk: true })
  const [canal, setCanal] = useState({ email: true, sms: true, whatsapp: false, push: false })
  const [tramo, setTramo] = useState(TRAMOS[0])
  const [toast, setToast] = useState('')
  const t = (k) => (v) => setS((x) => ({ ...x, [k]: v }))
  const c = (k) => (v) => setCanal((x) => ({ ...x, [k]: v }))

  return (
    <Page title="Suscripciones y avisos" subtitle="Decide qué te avisamos y por dónde. Puedes cambiarlo cuando quieras."
      actions={<button className="btn primary sm" onClick={() => setToast('Preferencias guardadas.')}>Guardar</button>}>
      <div className="grid sidebar">
        <div className="grid" style={{ gap: 16 }}>
          <Card title="Documentos">
            <Toggle checked={s.boleta} onChange={t('boleta')} label="Boleta por email" hint={`Cada mes a ${USER.email}. Reemplaza el envío en papel.`} />
            <Toggle checked={s.pagoOk} onChange={t('pagoOk')} label="Comprobante de cada pago" hint="Al aprobarse un pago en línea o un cargo PAC." />
          </Card>
          <Card title="Cuenta y cobros">
            <Toggle checked={s.deuda} onChange={t('deuda')} label="Aviso de nueva boleta y monto" hint="El día de la emisión." />
            <Toggle checked={s.vencimiento} onChange={t('vencimiento')} label="Recordatorio de vencimiento" hint="3 días antes de la fecha límite sin recargo." />
            <Toggle checked={s.transito} onChange={t('transito')} label="Aviso por cada tránsito" hint="Resumen diario de los pasos de tus vehículos. Útil si prestas el auto." />
          </Card>
          <Card title="Estado de la ruta">
            <Toggle checked={s.ruta} onChange={t('ruta')} label="Avisos de trabajos e incidentes" hint="Solo del tramo que elijas. Máximo 3 mensajes por semana." />
            {s.ruta && (
              <Field label="Tramo habitual">
                <select className="input" value={tramo} onChange={(e) => setTramo(e.target.value)}>{TRAMOS.map((x) => <option key={x}>{x}</option>)}</select>
              </Field>
            )}
          </Card>
        </div>

        <div className="grid" style={{ gap: 16 }}>
          <Card title="Canales">
            <Toggle checked={canal.email} onChange={c('email')} label="Correo" hint={USER.email} />
            <Toggle checked={canal.sms} onChange={c('sms')} label="SMS" hint={USER.telefono} />
            <Toggle checked={canal.whatsapp} onChange={c('whatsapp')} label="WhatsApp" hint="Requiere confirmar el número una vez." />
            <Toggle checked={canal.push} onChange={c('push')} label="Notificaciones en el teléfono" hint="Instala la Oficina Virtual como app (PWA)." />
          </Card>
          <Alert tone="info" title="Tu consentimiento">Guardamos fecha y hora de cada cambio. Los mensajes nunca incluyen patentes, saldos ni datos de cuenta; solo un enlace seguro a la Oficina Virtual.</Alert>
        </div>
      </div>
      <Toast msg={toast} onDone={() => setToast('')} />
      <MockNote><strong>Mockup de Suscripciones.</strong> En el portal actual esta sección solo informa el estado de la boleta por email; aquí se propone configurable.</MockNote>
    </Page>
  )
}
