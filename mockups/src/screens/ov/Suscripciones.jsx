import { useState } from 'react'
import { Card, Toggle, Field, Toast, MockNote } from '../../components/ui.jsx'
import { USER, TRAMOS } from '../../data/mock.js'
import ServiceIcon from '../../components/ServiceIcon.jsx'
import '../../suscripciones.css'

export default function Suscripciones() {
  const [s, setS] = useState({ boleta: true, deuda: true, transito: false, vencimiento: true, ruta: true, pagoOk: true })
  const [canal, setCanal] = useState({ email: true, sms: true, whatsapp: false, push: false })
  const [tramo, setTramo] = useState(TRAMOS[0])
  const [toast, setToast] = useState('')
  const t = (k) => (v) => setS((x) => ({ ...x, [k]: v }))
  const c = (k) => (v) => setCanal((x) => ({ ...x, [k]: v }))

  return (
    <div className="ov-subscriptions">
      <header className="subscriptions-heading">
        <span className="subscriptions-heading-icon"><ServiceIcon type="status" /></span>
        <div className="subscriptions-heading-copy"><h1>Suscripciones y avisos</h1><p>Decide qué te avisamos y por dónde. Puedes cambiarlo cuando quieras.</p></div>
        <button className="btn primary sm" onClick={() => setToast('Preferencias guardadas.')}><ServiceIcon type="status" />Guardar</button>
      </header>
      <div className="subscriptions-columns">
        <div className="subscriptions-stack">
          <Card title={<span className="subscriptions-card-title"><ServiceIcon type="bill" />Documentos</span>}>
            <Toggle checked={s.boleta} onChange={t('boleta')} label="Boleta por email" hint={`Cada mes a ${USER.email}. Reemplaza el envío en papel.`} />
            <Toggle checked={s.pagoOk} onChange={t('pagoOk')} label="Comprobante de cada pago" hint="Al aprobarse un pago en línea o un cargo PAC." />
          </Card>
          <Card title={<span className="subscriptions-card-title"><ServiceIcon type="payment" />Cuenta y cobros</span>}>
            <Toggle checked={s.deuda} onChange={t('deuda')} label="Aviso de nueva boleta y monto" hint="El día de la emisión." />
            <Toggle checked={s.vencimiento} onChange={t('vencimiento')} label="Recordatorio de vencimiento" hint="3 días antes de la fecha límite sin recargo." />
            <Toggle checked={s.transito} onChange={t('transito')} label="Aviso por cada tránsito" hint="Resumen diario de los pasos de tus vehículos. Útil si prestas el auto." />
          </Card>
          <Card title={<span className="subscriptions-card-title"><ServiceIcon type="roadworks" />Estado de la ruta</span>}>
            <Toggle checked={s.ruta} onChange={t('ruta')} label="Avisos de trabajos e incidentes" hint="Solo del tramo que elijas. Máximo 3 mensajes por semana." />
            {s.ruta && (
              <Field label="Tramo habitual">
                <select aria-label="Tramo habitual" className="input" value={tramo} onChange={(e) => setTramo(e.target.value)}>{TRAMOS.map((x) => <option key={x}>{x}</option>)}</select>
              </Field>
            )}
          </Card>
        </div>

        <div className="subscriptions-stack">
          <Card title={<span className="subscriptions-card-title"><ServiceIcon type="account" />Canales</span>}>
            <Toggle checked={canal.email} onChange={c('email')} label="Correo" hint={USER.email} />
            <Toggle checked={canal.sms} onChange={c('sms')} label="SMS" hint={USER.telefono} />
            <Toggle checked={canal.whatsapp} onChange={c('whatsapp')} label="WhatsApp" hint="Requiere confirmar el número una vez." />
            <Toggle checked={canal.push} onChange={c('push')} label="Notificaciones en el teléfono" hint="Instala la Oficina Virtual como app (PWA)." />
          </Card>
          <Card className="subscriptions-consent" title={<span className="subscriptions-card-title"><ServiceIcon type="shield" />Tu consentimiento</span>}>
            <p>Guardamos fecha y hora de cada cambio. Los mensajes nunca incluyen patentes, saldos ni datos de cuenta; solo un enlace seguro a la Oficina Virtual.</p>
          </Card>
        </div>
      </div>
      <Toast msg={toast} onDone={() => setToast('')} />
      <MockNote><strong>Mockup de Suscripciones.</strong> En el portal actual esta sección solo informa el estado de la boleta por email; aquí se propone configurable.</MockNote>
    </div>
  )
}
