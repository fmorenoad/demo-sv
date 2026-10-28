import { useState } from 'react'
import { href } from '../../router.jsx'
import { Page, Card, Badge, Field, MockNote } from '../../components/ui.jsx'
import { TARIFAS, PORTICOS, clp } from '../../data/mock.js'

const CIUDADES = ['Talca', 'San Javier', 'Linares', 'Parral', 'Chillán']
// Pórticos que se cruzan entre ciudades (índices del arreglo CIUDADES).
const porticosEntre = (a, b) => {
  const [i, j] = [CIUDADES.indexOf(a), CIUDADES.indexOf(b)].sort((x, y) => x - y)
  const cruzados = []
  if (i <= 0 && j >= 1) cruzados.push(PORTICOS[0]) // Rio Claro entre Talca y San Javier
  if (i <= 3 && j >= 4) cruzados.push(PORTICOS[1]) // Retiro entre Parral y Chillán
  return cruzados
}

export default function Tarifas() {
  const [cat, setCat] = useState(1)
  const [origen, setOrigen] = useState('Talca')
  const [destino, setDestino] = useState('Chillán')
  const [punta, setPunta] = useState(false)
  const tarifa = TARIFAS.find((t) => t.cat === cat)
  const cruzados = origen === destino ? [] : porticosEntre(origen, destino)
  const unit = punta ? tarifa.punta : tarifa.normal
  const total = cruzados.length * unit

  return (
    <Page title="Tarifas" subtitle="Valores por pórtico según categoría de vehículo. Vigentes desde el 1 de enero de 2026.">
      <div className="grid sidebar">
        <Card title="Tarifas vigentes por pórtico" right={<Badge tone="info">IVA incluido</Badge>} tight>
          <table className="table">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Vehículos</th>
                <th className="num">Horario normal</th>
                <th className="num">Horario punta</th>
              </tr>
            </thead>
            <tbody>
              {TARIFAS.map((t) => (
                <tr key={t.cat}>
                  <td><strong>Cat. {t.cat}</strong></td>
                  <td>{t.nombre}</td>
                  <td className="num">{clp(t.normal)}</td>
                  <td className="num">{clp(t.punta)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="card-body small muted">
            Horario punta: viernes 17:00–21:00 y domingos 16:00–22:00 (ejemplo). Pórticos: {PORTICOS.map((p) => `${p.nombre} (${p.km})`).join(' y ')}.
            Gratuidad lateral para residentes acreditados de comunas aledañas.
          </div>
        </Card>

        <Card title="Simulador de costo de viaje">
          <Field label="Categoría de vehículo">
            <select className="input" value={cat} onChange={(e) => setCat(Number(e.target.value))}>
              {TARIFAS.map((t) => <option key={t.cat} value={t.cat}>Cat. {t.cat} · {t.nombre}</option>)}
            </select>
          </Field>
          <div className="grid cols-2" style={{ gap: 10 }}>
            <Field label="Origen">
              <select className="input" value={origen} onChange={(e) => setOrigen(e.target.value)}>
                {CIUDADES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Destino">
              <select className="input" value={destino} onChange={(e) => setDestino(e.target.value)}>
                {CIUDADES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <label className="small" style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
            <input type="checkbox" checked={punta} onChange={(e) => setPunta(e.target.checked)} /> Viajo en horario punta
          </label>
          <div className="total-box">
            <div className="eyebrow">Resultado</div>
            {cruzados.length ? (
              <>
                {cruzados.map((p) => (
                  <div className="total-line" key={p.id}><span className="muted">Pórtico {p.nombre}</span><span>{clp(unit)}</span></div>
                ))}
                <div className="total-line grand"><span>Total {origen} – {destino}</span><span>{clp(total)}</span></div>
              </>
            ) : (
              <p className="small muted">Ese trayecto no cruza pórticos de Survías. Costo: $0.</p>
            )}
          </div>
          <p className="xsmall muted" style={{ marginTop: 10 }}>El cálculo usa solo las tarifas publicadas. Con TAG no te detienes y la boleta llega por email.</p>
          <a href={href('tag')} className="btn ghost block" style={{ marginTop: 10 }}>Quiero un TAG</a>
        </Card>
      </div>

      <div className="section grid cols-3">
        <Card title="Gratuidad lateral">
          <p className="small muted">Residentes de Río Claro, San Rafael, Retiro y Parral pueden acreditar domicilio para pasar sin costo por el pórtico de su comuna.</p>
          <a href={href('ayuda')} className="small">Cómo acreditar →</a>
        </Card>
        <Card title="Pasé sin TAG">
          <p className="small muted">Regulariza tu paso dentro de 30 días pagando la tarifa normal, sin recargo.</p>
          <a href={href('sin-tag')} className="small">Regularizar ahora →</a>
        </Card>
        <Card title="Medios de pago">
          <p className="small muted">Webpay (débito y crédito), transferencia, PAC/PAT y pago presencial en puntos de atención.</p>
          <a href={href('login')} className="small">Pagar en la Oficina Virtual →</a>
        </Card>
      </div>

      <MockNote>
        <strong>Mockup de Tarifas.</strong> La categoría 1 ($3.300) coincide con lo observado en el portal real; el resto de valores y el horario punta son ejemplos.
      </MockNote>
    </Page>
  )
}
