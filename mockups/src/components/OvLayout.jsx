import { useEffect, useId, useRef, useState } from 'react'
import { href } from '../router.jsx'
import ServiceIcon from './ServiceIcon.jsx'
import '../ov.css'
import { CONVENIOS, USER, clp, TRANSITOS } from '../data/mock.js'

const MENU = [
  ['ov/resumen', 'Resumen'],
  ['ov/convenio', 'Convenio'],
  ['ov/transitos', 'Tránsitos'],
  ['ov/pagos', 'Pagos y documentos'],
  ['ov/vehiculos', 'Vehículos y TAG'],
  ['ov/interacciones', 'Mis interacciones'],
  ['ov/suscripciones', 'Suscripciones'],
  ['ov/cuenta', 'Mi cuenta'],
]

// Layout de la Oficina Virtual: barra lateral con selector de convenio + menú, y contenido.
export default function OvLayout({ route, children }) {
  const selectId = useId()
  const menuId = useId()
  const toggleRef = useRef(null)
  const [convenio, setConvenio] = useState(CONVENIOS[0].id)
  const [open, setOpen] = useState(false)
  const deuda = TRANSITOS.filter((t) => t.estado === 'No facturado').reduce((a, t) => a + t.monto, 0)

  useEffect(() => setOpen(false), [route])
  useEffect(() => {
    if (!open) return undefined
    const close = (event) => {
      if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus() }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])

  const icons = ['account', 'bill', 'route', 'payment', 'car', 'status', 'calendar', 'account']

  return (
    <div className="wrap ov-layout">
      <aside className="ov-side">
        <div className="side-card">
          <div className="xsmall" style={{ letterSpacing: '.08em', textTransform: 'uppercase', opacity: .8 }}>Oficina Virtual Survías</div>
          <label htmlFor={selectId} className="xsmall" style={{ display: 'block', margin: '10px 0 6px' }}>Convenio</label>
          <select id={selectId} className="input" value={convenio} onChange={(e) => setConvenio(e.target.value)}>
            {CONVENIOS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <div className="xsmall" style={{ marginTop: 10, opacity: .85 }}>Titular: {USER.nombreCompleto}</div>
        </div>

        <button type="button" ref={toggleRef} aria-controls={menuId} className="btn ghost block side-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? 'Ocultar menú' : 'Menú de la Oficina Virtual'}
        </button>

        <nav id={menuId} className={'side-menu' + (open ? ' open' : '')} aria-label="Oficina Virtual">
          {MENU.map(([r, label], index) => (
            <a key={r} href={href(r)} aria-current={route === r || route.startsWith(r + '/') ? 'page' : undefined} className={route === r || route.startsWith(r + '/') ? 'active' : ''} onClick={() => setOpen(false)}>
              <ServiceIcon type={icons[index]} /><span>{label}</span>
              {r === 'ov/pagos' && deuda > 0 && <span className="badge warn" style={{ marginLeft: 'auto' }}>{clp(deuda)}</span>}
            </a>
          ))}
        </nav>
      </aside>
      <main className="ov-main">{children}</main>
    </div>
  )
}
