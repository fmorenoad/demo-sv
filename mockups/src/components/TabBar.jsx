import { useEffect, useRef, useState } from 'react'
import { href } from '../router.jsx'
import ServiceIcon from './ServiceIcon.jsx'

// Propuesta UX v2: barra de navegación inferior para teléfonos.
// Mantiene las gestiones principales al alcance del pulgar, sin volver al inicio de la página.

const PUBLIC_TABS = [
  ['inicio', 'Inicio', 'roadworks'],
  ['tarifas', 'Tarifas', 'calculator'],
  ['ruta', 'Ruta', 'route'],
  ['sin-tag', 'Sin TAG', 'car'],
  ['login', 'Ingresar', 'account'],
]

const OV_TABS = [
  ['ov/resumen', 'Resumen', 'status'],
  ['ov/transitos', 'Tránsitos', 'route'],
  ['ov/pagar', 'Pagar', 'payment'],
  ['ov/pagos', 'Boletas', 'bill'],
]

const OV_MORE = [
  ['ov/convenio', 'Convenio', 'bill'],
  ['ov/vehiculos', 'Vehículos y TAG', 'car'],
  ['ov/interacciones', 'Mis interacciones', 'account'],
  ['ov/suscripciones', 'Suscripciones y avisos', 'calendar'],
  ['ov/repactar', 'Simular repactación', 'calculator'],
  ['ov/cuenta', 'Mi cuenta', 'shield'],
]

export default function TabBar({ area, route, onLogout }) {
  const [more, setMore] = useState(false)
  const moreButton = useRef(null)
  const tabs = area === 'ov' ? OV_TABS : PUBLIC_TABS
  const isActive = (r) => route === r || (r !== 'inicio' && route.startsWith(r + '/'))
  const moreActive = OV_MORE.some(([r]) => isActive(r))

  useEffect(() => { setMore(false) }, [route])
  useEffect(() => {
    if (!more) return undefined
    const close = (event) => { if (event.key === 'Escape') { setMore(false); moreButton.current?.focus() } }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [more])

  return (
    <>
      {area === 'ov' && more && (
        <div className="tabbar-sheet-backdrop" onClick={() => setMore(false)}>
          <div id="tabbar-more" className="tabbar-sheet" role="dialog" aria-modal="true" aria-label="Más opciones de la Oficina Virtual" onClick={(e) => e.stopPropagation()}>
            <div className="tabbar-sheet-grip" aria-hidden="true" />
            <nav aria-label="Más opciones">
              {OV_MORE.map(([r, label, icon]) => (
                <a key={r} href={href(r)} className={isActive(r) ? 'active' : ''} aria-current={isActive(r) ? 'page' : undefined}>
                  <ServiceIcon type={icon} /><span>{label}</span><span className="tabbar-sheet-arrow" aria-hidden="true">›</span>
                </a>
              ))}
            </nav>
            <button type="button" className="tabbar-sheet-logout" onClick={onLogout}>Cerrar sesión</button>
          </div>
        </div>
      )}
      <nav className={'tabbar tabbar-' + area} aria-label={area === 'ov' ? 'Oficina Virtual' : 'Accesos principales'}>
        {tabs.map(([r, label, icon]) => (
          <a key={r} href={href(r)} className={isActive(r) ? 'active' : ''} aria-current={isActive(r) ? 'page' : undefined}>
            <ServiceIcon type={icon} /><span>{label}</span>
          </a>
        ))}
        {area === 'ov' && (
          <button ref={moreButton} type="button" className={moreActive || more ? 'active' : ''} aria-expanded={more} aria-controls="tabbar-more" onClick={() => setMore((m) => !m)}>
            <span className="tabbar-dots" aria-hidden="true"><i /><i /><i /></span><span>Más</span>
          </button>
        )}
      </nav>
    </>
  )
}
