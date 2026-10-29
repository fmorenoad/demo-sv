import { useEffect, useRef, useState } from 'react'
import { href } from '../../router.jsx'
import { Card, Badge, Alert, MockNote } from '../../components/ui.jsx'
import ServiceIcon from '../../components/ServiceIcon.jsx'
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
          return (
            <g key={d.mes} className="ov-chart-bar" tabIndex="0" aria-label={`${d.mes}: ${clp(d.monto)}`} onFocus={() => setHover(i)} onBlur={() => setHover(null)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={padL + i * bw} y={padT} width={bw} height={H - padT - padB} fill="transparent" />
              <path d={`M${x},${H - padB} V${top + 4} a4,4 0 0 1 4,-4 h${w - 8} a4,4 0 0 1 4,4 V${H - padB} Z`} fill={hover === i || i === data.length - 1 ? 'var(--accent)' : '#d4dde3'} />
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

function Metric({ icon, label, value, detail }) {
  return <article className="ov-metric ov-reveal"><ServiceIcon type={icon} /><div><div className="ov-metric-label">{label}</div><strong className="ov-metric-value">{value}</strong><p>{detail}</p></div></article>
}

export default function Resumen() {
  const dashboardRef = useRef(null)
  useEffect(() => {
    const root = dashboardRef.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const targets = [...root.querySelectorAll('.ov-reveal')]
    let observer
    const activate = () => {
      observer?.disconnect()
      if (motion.matches || typeof IntersectionObserver === 'undefined') { root.classList.remove('ov-motion-ready'); return }
      targets.forEach((element) => {
        const rect = element.getBoundingClientRect()
        element.classList.toggle('is-visible', rect.top < innerHeight && rect.bottom > 0)
      })
      root.classList.add('ov-motion-ready')
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting)), { threshold: .04 })
      targets.forEach((element) => observer.observe(element))
    }
    activate()
    motion.addEventListener?.('change', activate)
    return () => { observer?.disconnect(); motion.removeEventListener?.('change', activate) }
  }, [])
  const pendientes = TRANSITOS.filter((t) => t.estado === 'No facturado')
  const deuda = pendientes.reduce((a, t) => a + t.monto, 0)
  const mes = TRANSITOS.filter((t) => t.fecha.endsWith('-10-2026'))
  const abiertos = REQUERIMIENTOS.filter((r) => r.estado !== 'Cerrado').length

  return (
    <div className="ov-dashboard" ref={dashboardRef}>
      <header className="ov-dashboard-head ov-reveal">
        <div><h1>{`Hola, ${USER.nombre}`}</h1><p>{`Convenio ${USER.convenio} · ${USER.tipoConvenio} · ${VEHICULOS.length} vehículos`}</p></div>
        <div className="ov-dashboard-actions"><a href={href('ov/transitos')} className="btn ghost sm"><ServiceIcon type="route" />Ver tránsitos</a><a href={href('ov/pagar')} className="btn primary sm"><ServiceIcon type="payment" />Pagar {clp(deuda)}</a></div>
      </header>
      {deuda > 0 && (
        <div className="ov-debt ov-reveal"><Alert tone="warn" title={`Tienes ${pendientes.length} tránsitos no facturados por ${clp(deuda)}`} action={<a href={href('ov/pagar')} className="btn primary sm">Pagar ahora</a>}>
          Puedes pagarlos ahora o esperar la boleta mensual del 23-11-2026. Si prefieres, <a href={href('ov/repactar')}>simula una repactación</a>.
        </Alert></div>
      )}

      <div className="ov-metrics">
        <Metric icon="payment" label="Deuda vigente" value={clp(deuda)} detail={`${pendientes.length} tránsitos sin facturar`} />
        <Metric icon="route" label="Tránsitos del mes" value={mes.length} detail={`${clp(mes.reduce((a, t) => a + t.monto, 0))} en octubre`} />
        <Metric icon="car" label="Vehículos" value={VEHICULOS.length} detail={`${VEHICULOS.filter((v) => v.tag === 'Activo').length} con TAG activo`} />
        <Metric icon="status" label="Requerimientos abiertos" value={abiertos} detail="1 requiere antecedentes" />
      </div>

      <div className="ov-chart-row">
        <Card className="ov-chart-card ov-reveal" title="Gasto mensual" right={<span className="xsmall muted">Últimos 6 meses · boletas emitidas</span>}>
          <GastoChart data={GASTO_MENSUAL} />
          <div className="xsmall muted" style={{ marginTop: 6 }}>Pasa el cursor sobre una barra para ver el monto. <a href={href('ov/transitos')}>Ver tabla de tránsitos</a>.</div>
        </Card>

        <Card className="ov-quick-card ov-reveal" title="Accesos rápidos">
          <div className="ov-quick-links">
            <a href={href('ov/pagar')}><ServiceIcon type="payment" /><span>Pagar / autofacturar tránsitos</span><span className="ov-link-arrow" aria-hidden="true">›</span></a>
            <a href={href('ov/transitos')}><ServiceIcon type="route" /><span>Ver mis tránsitos</span><span className="ov-link-arrow" aria-hidden="true">›</span></a>
            <a href={href('ov/repactar')}><ServiceIcon type="calculator" /><span>Simular repactación</span><span className="ov-link-arrow" aria-hidden="true">›</span></a>
            <a href={href('ov/vehiculos')}><ServiceIcon type="car" /><span>Gestionar vehículos y TAG</span><span className="ov-link-arrow" aria-hidden="true">›</span></a>
            <a href={href('ov/interacciones')}><ServiceIcon type="status" /><span>Mis interacciones comerciales</span><span className="ov-link-arrow" aria-hidden="true">›</span></a>
          </div>
        </Card>
      </div>

      <div className="ov-table-row">
        <Card className="ov-data-card ov-reveal" title="Vehículos asociados" right={<a href={href('ov/vehiculos')} className="small">Gestionar</a>} tight>
          <div className="ov-table-scroll" tabIndex="0" role="region" aria-label="Vehículos asociados"><table className="table">
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
          </table></div>
        </Card>

        <Card className="ov-data-card ov-reveal" title="Últimos tránsitos" right={<a href={href('ov/transitos')} className="small">Ver todos</a>} tight>
          <div className="ov-table-scroll" tabIndex="0" role="region" aria-label="Últimos tránsitos"><table className="table">
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
          </table></div>
        </Card>
      </div>

      <div className="ov-note ov-reveal"><MockNote><strong>Demo con sesión.</strong> Datos ficticios del titular María Pérez Soto. Toda la información corresponde solo al convenio seleccionado.</MockNote></div>
    </div>
  )
}
