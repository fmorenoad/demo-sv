import { useMemo, useState } from 'react'
import { href } from '../../router.jsx'
import { Card, Badge, Field, Toast, MockNote } from '../../components/ui.jsx'
import { TRANSITOS, VEHICULOS, clp } from '../../data/mock.js'
import ServiceIcon from '../../components/ServiceIcon.jsx'
import '../../transitos.css'

const RANGOS = [['mes', 'Este mes'], ['3m', 'Últimos 3 meses'], ['anio', 'Año 2026'], ['todo', 'Todo']]

export default function Transitos() {
  const [patente, setPatente] = useState('todas')
  const [estado, setEstado] = useState('todos')
  const [rango, setRango] = useState('3m')
  const [toast, setToast] = useState('')

  const rows = useMemo(() => TRANSITOS.filter((t) =>
    (patente === 'todas' || t.patente === patente) &&
    (estado === 'todos' || t.estado === estado) &&
    (rango !== 'mes' || t.fecha.endsWith('-10-2026'))
  ), [patente, estado, rango])

  const total = rows.reduce((a, t) => a + t.monto, 0)
  const porPatente = VEHICULOS.map((v) => ({ patente: v.patente, n: rows.filter((t) => t.patente === v.patente).length, monto: rows.filter((t) => t.patente === v.patente).reduce((a, t) => a + t.monto, 0) })).filter((p) => p.n)
  const pendientes = rows.filter((t) => t.estado === 'No facturado')

  return (
    <div className="ov-transits">
      <header className="transits-heading">
        <span className="transits-heading-icon"><ServiceIcon type="route" /></span>
        <div className="transits-heading-copy"><h1>Detalle de tránsitos</h1><p>Todos tus vehículos en una sola vista, con totales por patente y período.</p></div>
        <div className="transits-export">
          <button className="btn ghost sm" onClick={() => setToast('Exportando CSV con ' + rows.length + ' tránsitos…')}><ServiceIcon type="status" />Exportar CSV</button>
          <button className="btn ghost sm" onClick={() => setToast('Generando PDF…')}><ServiceIcon type="bill" />Descargar PDF</button>
        </div>
      </header>
      <Card>
        <div className="transits-filters">
          <Field label="Patente">
            <select aria-label="Patente" className="input" value={patente} onChange={(e) => setPatente(e.target.value)}>
              <option value="todas">Todas las patentes</option>
              {VEHICULOS.map((v) => <option key={v.patente} value={v.patente}>{v.patente} · {v.marca} {v.modelo}</option>)}
            </select>
          </Field>
          <Field label="Estado">
            <select aria-label="Estado" className="input" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="No facturado">No facturados</option>
              <option value="Facturado">Facturados</option>
            </select>
          </Field>
          <Field label="Período">
            <div className="seg" role="group" aria-label="Período">
              {RANGOS.map(([k, l]) => <button key={k} type="button" className={rango === k ? 'on' : ''} aria-pressed={rango === k} onClick={() => setRango(k)}>{l}</button>)}
            </div>
          </Field>
        </div>
      </Card>

      <div className="transits-metrics">
        <div className="tile"><ServiceIcon type="route" /><div><div className="k">Tránsitos</div><div className="v">{rows.length}</div></div></div>
        <div className="tile"><ServiceIcon type="balance" /><div><div className="k">Total del período</div><div className="v">{clp(total)}</div></div></div>
        <div className="tile warn"><ServiceIcon type="bill" /><div><div className="k">No facturado</div><div className="v">{clp(pendientes.reduce((a, t) => a + t.monto, 0))}</div><div className="xsmall muted">{pendientes.length} tránsitos</div></div></div>
      </div>

      <div className="transits-columns">
        <Card tight>
          <div className="table-scroll" role="region" aria-label="Detalle de tránsitos" tabIndex={0}>
            <table className="table">
              <thead><tr><th scope="col">Patente</th><th scope="col">Fecha</th><th scope="col">Hora</th><th scope="col">Pórtico</th><th scope="col">Categoría</th><th scope="col">Estado</th><th scope="col" className="num">Monto</th></tr></thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id}>
                    <td><strong>{t.patente}</strong></td>
                    <td className="nowrap">{t.fecha}</td>
                    <td>{t.hora}</td>
                    <td className="nowrap">{t.portico}</td>
                    <td className="nowrap">Cat. {t.cat}</td>
                    <td><Badge tone={t.estado === 'Facturado' ? 'ok' : 'warn'}>{t.estado}</Badge></td>
                    <td className="num">{clp(t.monto)}</td>
                  </tr>
                ))}
                {!rows.length && <tr><td colSpan={7} className="muted" style={{ textAlign: 'center', padding: 24 }}>Sin tránsitos para los filtros elegidos.</td></tr>}
              </tbody>
              <tfoot><tr><td colSpan={6}><strong>Total</strong> · {rows.length} tránsitos</td><td className="num"><strong>{clp(total)}</strong></td></tr></tfoot>
            </table>
          </div>
          <div className="card-body xsmall muted">Mostrando {rows.length} de {rows.length} · Los tránsitos aparecen hasta 48 horas después del paso.</div>
        </Card>

        <div className="transits-stack">
          <Card className="transits-plates" title={<span className="transits-card-title"><ServiceIcon type="car" />Total por patente</span>} tight>
            <table className="table">
              <tbody>
                {porPatente.map((p) => <tr key={p.patente}><td><strong>{p.patente}</strong><div className="xsmall muted">{p.n} tránsitos</div></td><td className="num">{clp(p.monto)}</td></tr>)}
              </tbody>
            </table>
          </Card>
          {pendientes.length > 0 && (
            <Card className="transits-payment">
              <div className="transits-payment-label"><ServiceIcon type="payment" /><div className="eyebrow">No facturados</div></div>
              <p className="small muted" style={{ margin: '6px 0 12px' }}>Puedes pagar y facturar ahora los {pendientes.length} tránsitos pendientes.</p>
              <a href={href('ov/pagar')} className="btn primary block">Pagar {clp(pendientes.reduce((a, t) => a + t.monto, 0))}</a>
            </Card>
          )}
        </div>
      </div>

      <Toast msg={toast} onDone={() => setToast('')} />
      <MockNote><strong>Mockup de Tránsitos.</strong> Resuelve lo observado en el portal: vista de todas las patentes, totales, atajos de período y exportación.</MockNote>
    </div>
  )
}
