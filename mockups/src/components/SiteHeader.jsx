import { href } from '../router.jsx'
import { USER } from '../data/mock.js'

const PUBLIC_NAV = [
  ['inicio', 'Inicio'],
  ['tarifas', 'Tarifas'],
  ['ruta', 'Estado de ruta'],
  ['tag', 'TAG'],
  ['sin-tag', 'Pasé sin TAG'],
  ['ayuda', 'Ayuda'],
]

const PRIVATE_NAV = [
  ['ov/resumen', 'Resumen'],
  ['ov/transitos', 'Tránsitos'],
  ['ov/pagos', 'Pagos'],
  ['ov/interacciones', 'Interacciones'],
  ['ov/vehiculos', 'Vehículos'],
]

function Logo() {
  return (
    <a href={href('inicio')} className="logo" aria-label="Survías, inicio">
      <img className="brand-logo" src="/assets/survias-logo.png" alt="Survías Maule Ñuble" width="287" height="176" />
    </a>
  )
}

// Cabecera del sitio. `session` cambia la navegación y las acciones de la derecha.
export default function SiteHeader({ session, route, onLogout }) {
  const nav = session ? PRIVATE_NAV : PUBLIC_NAV
  const isActive = (r) => route === r || (r !== 'inicio' && route.startsWith(r))
  return (
    <header className="site-header">
      <div className="bar">
        <Logo />
        <nav className="nav" aria-label="Principal">
          {nav.map(([r, label]) => (
            <a key={r} href={href(r)} className={isActive(r) ? 'active' : ''}>{label}</a>
          ))}
        </nav>
        <div className="header-cta">
          {session ? (
            <>
              <a href={href('ov/cuenta')} className="user-chip">
                <span className="avatar">{USER.nombre[0]}{USER.apellidos[0]}</span>
                <span className="small"><strong>{USER.nombreCompleto}</strong><br /><span className="xsmall muted">Convenio {USER.convenio}</span></span>
              </a>
              <button className="btn ghost sm" onClick={onLogout}>Salir</button>
            </>
          ) : (
            <>
              <a href="https://oficina-virtual.survias.cl/paga-tu-cuenta" className="btn ghost sm" target="_blank" rel="noopener noreferrer">Pago fácil <span aria-hidden="true">↗</span></a>
              <a href={href('login')} className="btn primary sm">Oficina Virtual</a>
            </>
          )}
        </div>
      </div>
    </header>
  )
}



