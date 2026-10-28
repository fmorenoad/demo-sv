import { useState } from 'react'
import { href } from '../../router.jsx'
import { Page, Card, Steps, Field, Alert, VerifyModal, MockNote } from '../../components/ui.jsx'
import { clp } from '../../data/mock.js'

// Deuda vencida de ejemplo para el simulador (distinta de los tránsitos no facturados).
const DEUDA_VENCIDA = 48600
const INTERES = { 3: 0.0, 6: 0.012, 12: 0.018 } // tasa mensual de ejemplo

export default function Repactar() {
  const [cuotas, setCuotas] = useState(6)
  const [pie, setPie] = useState(10000)
  const [step, setStep] = useState(1)
  const [acepta, setAcepta] = useState(false)
  const [verify, setVerify] = useState(false)
  const saldo = DEUDA_VENCIDA - pie
  const tasa = INTERES[cuotas]
  const cuota = tasa ? Math.round((saldo * tasa) / (1 - Math.pow(1 + tasa, -cuotas))) : Math.round(saldo / cuotas)
  const totalPagar = cuota * cuotas + pie
  const fechas = Array.from({ length: cuotas }, (_, i) => `05-${String(((10 + i) % 12) + 1).padStart(2, '0')}-${10 + i >= 12 ? 2027 : 2026}`)

  return (
    <Page title="Repactar deuda" subtitle="Simula alternativas, revisa condiciones y acepta en línea. Sin letra chica.">
      <Steps steps={['Simular', 'Revisar condiciones', 'Comprobante']} current={step} />

      {step === 1 && (
        <div className="grid sidebar">
          <Card title="Simulador">
            <div className="debt-row" style={{ marginBottom: 14 }}>
              <div><div className="k xsmall muted">Deuda vencida</div><div className="big">{clp(DEUDA_VENCIDA)}</div></div>
              <div><div className="k xsmall muted">Documentos</div><div><strong>3 boletas</strong> (feb–abr 2026)</div></div>
            </div>
            <Field label={`Pie inicial: ${clp(pie)}`}>
              <input type="range" min={0} max={DEUDA_VENCIDA} step={1000} value={pie} onChange={(e) => setPie(Number(e.target.value))} style={{ width: '100%' }} />
            </Field>
            <Field label="Número de cuotas">
              <div className="seg">
                {[3, 6, 12].map((n) => <button key={n} type="button" className={cuotas === n ? 'on' : ''} onClick={() => setCuotas(n)}>{n} cuotas {INTERES[n] ? '' : '· sin interés'}</button>)}
              </div>
            </Field>
            <table className="table" style={{ marginTop: 8 }}>
              <thead><tr><th>N°</th><th>Vencimiento</th><th className="num">Cuota</th></tr></thead>
              <tbody>{fechas.slice(0, 4).map((f, i) => <tr key={f}><td>{i + 1}</td><td>{f}</td><td className="num">{clp(cuota)}</td></tr>)}
                {cuotas > 4 && <tr><td colSpan={3} className="xsmall muted" style={{ textAlign: 'center' }}>… y {cuotas - 4} cuotas más</td></tr>}</tbody>
            </table>
          </Card>
          <div className="total-box">
            <div className="eyebrow">Tu plan</div>
            <div className="total-line"><span className="muted">Pie hoy</span><span>{clp(pie)}</span></div>
            <div className="total-line"><span className="muted">{cuotas} cuotas de</span><span>{clp(cuota)}</span></div>
            <div className="total-line"><span className="muted">Interés mensual</span><span>{(tasa * 100).toFixed(1)} %</span></div>
            <div className="total-line grand"><span>Total a pagar</span><span>{clp(totalPagar)}</span></div>
            <div className="xsmall muted" style={{ marginTop: 6 }}>Costo del plan: {clp(totalPagar - DEUDA_VENCIDA)}</div>
            <button className="btn primary block" style={{ marginTop: 16 }} onClick={() => setStep(2)}>Continuar con este plan</button>
            <a href={href('ov/pagos')} className="btn ghost block" style={{ marginTop: 8 }}>Prefiero pagar todo</a>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid sidebar">
          <Card title="Condiciones del convenio de pago">
            <ul className="small muted check-list">
              <li>Pie de {clp(pie)} se paga hoy con Webpay o transferencia.</li>
              <li>{cuotas} cuotas mensuales de {clp(cuota)}, vencimiento el día 5 de cada mes, cargadas a tu cuenta inscrita o pagadas en línea.</li>
              <li>Interés mensual {(tasa * 100).toFixed(1)} %. Sin gastos de cobranza mientras el plan esté al día.</li>
              <li>Puedes prepagar el saldo en cualquier momento sin costo.</li>
              <li>Dos cuotas impagas dejan sin efecto el plan y reactivan la deuda original.</li>
            </ul>
            <label className="small" style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 12 }}>
              <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} style={{ marginTop: 3 }} />
              <span>He leído y acepto las condiciones. Entiendo que esta aceptación tiene validez de contrato electrónico y quedará registrada con fecha, hora y código de verificación.</span>
            </label>
          </Card>
          <div className="total-box">
            <div className="total-line grand"><span>Pie a pagar hoy</span><span>{clp(pie)}</span></div>
            <button className="btn primary block" style={{ marginTop: 16 }} disabled={!acepta} onClick={() => setVerify(true)}>Aceptar y pagar pie</button>
            <button className="btn ghost block" style={{ marginTop: 8 }} onClick={() => setStep(1)}>Cambiar plan</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <Card style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 44 }}>📅</div>
            <h3 style={{ marginTop: 8 }}>Repactación aceptada</h3>
            <p className="small muted" style={{ margin: '6px 0 14px' }}>Convenio de pago N° RP-2026-01187. Pie de {clp(pie)} pagado. Te enviamos el contrato y el calendario de cuotas a tu correo.</p>
          </div>
          <table className="table">
            <thead><tr><th>N°</th><th>Vencimiento</th><th className="num">Cuota</th><th>Estado</th></tr></thead>
            <tbody>{fechas.map((f, i) => <tr key={f}><td>{i + 1}</td><td>{f}</td><td className="num">{clp(cuota)}</td><td className="muted small">Programada</td></tr>)}</tbody>
          </table>
          <div className="grid" style={{ gap: 8, marginTop: 16 }}>
            <a href="#" className="btn navy block">Descargar contrato y calendario (PDF)</a>
            <a href={href('ov/resumen')} className="btn ghost block">Volver al resumen</a>
          </div>
        </Card>
      )}

      <VerifyModal open={verify} title="Confirma la repactación" onCancel={() => setVerify(false)} onConfirm={() => { setVerify(false); setStep(3) }} />
      {step === 1 && <Alert tone="info" title="Cómo se calcula">Interés simple mensual sobre el saldo, cuota fija (sistema francés). Las tasas son de ejemplo; las reales dependen de la política comercial de Survías.</Alert>}
      <MockNote><strong>Mockup de Repactación.</strong> El código del portal actual ya contiene funciones de simulación no expuestas; aquí se proponen como flujo completo.</MockNote>
    </Page>
  )
}
