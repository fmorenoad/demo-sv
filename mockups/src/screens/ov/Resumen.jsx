import { useState } from 'react'
import { href } from '../../router.jsx'
import { Page, Card, Tile, Badge, Alert, MockNote } from '../../components/ui.jsx'
import { USER, VEHICULOS, TRANSITOS, GASTO_MENSUAL, REQUERIMIENTOS, clp } from '../../data/mock.js'

// Gráfico de barras de una serie (gasto mensual). Marcas finas, extremo redondeado, tooltip al pasar.
function GastoChart({ data }) {
  const [hover, setHover] = useState(null)
  const W = 520, H = 180, padL = 44, padB = 28, padT = 16
  const max = Math.max(...data.map((d) => d.monto)) * 1.15
  const bw = (W - padL - 8) / data.length
  const y = (v) => padT + (H - padT - padB) * (1 - v / max)
  const ticks = [0, max / 3, (max * 2) / 3, max].map((v) => Math.round(v / 1000) * 1000)
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Gasto mensual en peajes, últimos seis meses">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - 8} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth="1" />
            <text x={padL - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill="var(--muted)">{t >= 1000 ? Math.round(t / 1000) + 'k' : t}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = padL + i * bw + bw * 0.3
          const w = bw * 0.4
          const top = y(d.monto)
          const h = H - padB - top
          return (
            <g key={d.mes} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={padL + i * bw} y={padT} width={bw} height={H - padT - padB} fill="transparent" />
              <path d={`M${x},${H - padB} V${top + 4} a4,4 0 0 1 4,-4 h${w - 8} a4,4 0 0 1 4,4 V${H - padB} Z`} fill={hover === i ? 'var(--accent-600)' : 'var(--accent)'} />
              <text x={x + w / 2} y={H - padB + 16} textAnchor="middle" fontSize="11" fill="var(--ink)">{d.mes}</text>
              {(hover === i || i === data.length - 1) && (
                <text x={x + w / 2} y={top - 6} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--ink)">{clp(d.monto)}</text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function Resumen() {
  const pendientes = TRANSITOS.filter((t) => t.estado === 'No facturado')
  const deuda = pendientes.reduce((a, t) => a + t.monto, 0)
  const mes = TRANSITOS.filter((t) => t.fecha.endsWith('-10-2026'))
  const abiertos = REQUERIMIENTOS.filter((r) => r.estado !== 'Cerrado').length

  return (
    <Page
      title={`Hola, ${USER.nombre}`}
      subtitle={`Convenio ${USER.convenio} · ${USER.tipoConvenio} · ${VEHICULOS.length} vehículos`}
      actions={<><a href={href('ov/transitos')} className="btn ghost sm">Ver tránsitos</a><a href={href('ov/pagar')} className="btn primary sm">Pagar {clp(deuda)}</a></>}
    >
      {deuda > 0 && (
        <Alert tone="warn" title={`Tienes ${pendientes.length} tránsitos no facturados por ${clp(deuda)}`} action={<a href={href('ov/pagar')} className="btn primary sm">Pagar ahora</a>}>
          Puedes pagarlos ahora o esperar la boleta mensual del 23-11-2026. Si prefieres, <a href={href('ov/repactar')}>simula una repactación</a>.
        </Alert>
      )}

      <div className="section tiles four">
        <Tile k="Deuda vigente" v={clp(deuda)} sub={`${pendientes.length} tránsitos sin facturar`} tone="warn" />
        <Tile k="Tránsitos del mes" v={mes.length} sub={`${clp(mes.reduce((a, t) => a + t.monto, 0))} en octubre`} />
        <Tile k="Vehículos" v={VEHICULOS.length} sub={`${VEHICULOS.filter((v) => v.tag === 'Activo').length} con TAG activo`} />
        <Tile k="Requerimientos abiertos" v={abiertos} sub="1 requiere antecedentes" />
      </div>

      <div className="section grid sidebar">
        <Card title="Gasto mensual" right={<span className="xsmall muted">Últimos 6 meses · boletas emitidas</span>}>
          <GastoChart data={GASTO_MENSUAL} />
          <div className="xsmall muted" style={{ marginTop: 6 }}>Pasa el cursor sobre una barra para ver el monto. <a href={href('ov/transitos')}>Ver tabla de tránsitos</a>.</div>
        </Card>

        <Card title="Accesos rápidos">
          <div className="grid" style={{ gap: 8 }}>
            <a href={href('ov/pagar')} className="btn primary block">Pagar / autofacturar tránsitos</a>
            <a href={href('ov/transitos')} className="btn navy block">Ver mis tránsitos</a>
            <a href={href('ov/repactar')} className="btn ghost block">Simular repactación</a>
            <a href={href('ov/vehiculos')} className="btn ghost block">Gestionar vehículos y TAG</a>
            <a href={href('ov/interacciones')} className="btn ghost block">Mis interacciones comerciales</a>
          </div>
        </Card>
      </div>

      <div className="section grid cols-2">
        <Card title="Vehículos asociados" right={<a href={href('ov/vehiculos')} className="small">Gestionar</a>} tight>
          <table className="table">
            <thead><tr><th>Patente</th><th>Vehículo</th><th>TAG</th></tr></thead>
            <tbody>
              {VEHICULOS.map((v) => (
                <tr key={v.patente}>
                  <td><strong>{v.patente}</strong></td>
                  <td>{v.marca} {v.modelo} {v.anio}<div className="xsmall muted">{v.tipo}</div></td>
                  <td><Badge tone={v.tag === 'Activo' ? 'ok' : 'warn'} dot>{v.tag}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Últimos tránsitos" right={<a href={href('ov/transitos')} className="small">Ver todos</a>} tight>
          <table className="table">
            <thead><tr><th>Fecha</th><th>Pórtico</th><th>Patente</th><th className="num">Monto</th></tr></thead>
            <tbody>
              {TRANSITOS.slice(0, 5).map((t) => (
                <tr key={t.id}>
                  <td>{t.fecha}<div className="xsmall muted">{t.hora}</div></td>
                  <td>{t.portico}</td>
                  <td>{t.patente}</td>
                  <td className="num">{clp(t.monto)}{t.estado === 'No facturado' && <div className="xsmall" style={{ color: 'var(--warn)' }}>pendiente</div>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <MockNote><strong>Demo con sesión.</strong> Datos ficticios del titular María Pérez Soto. Toda la información corresponde solo al convenio seleccionado.</MockNote>
    </Page>
  )
}
