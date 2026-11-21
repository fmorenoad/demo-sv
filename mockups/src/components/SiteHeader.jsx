import { useEffect, useRef, useState } from 'react'
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
export default function SiteHeader({ session, route, onLogout, minimal = false, onBack }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef(null)
  const nav = session ? PRIVATE_NAV : PUBLIC_NAV
  const isActive = (r) => route === r || (r !== 'inicio' && route.startsWith(r))

  useEffect(() => { setMenuOpen(false) }, [route])
  useEffect(() => {
    if (!menuOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      menuButton.current?.focus()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const navEl = <nav className="nav" aria-label="Principal">{nav.map(([r, label]) => (
    <a key={r} href={href(r)} className={isActive(r) ? 'active' : ''} aria-current={isActive(r) ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{label}</a>
  ))}</nav>

  const actionsEl = <div className="header-cta">
    {session ? <>
      <a href={href('ov/cuenta')} className="user-chip">
        <span className="avatar">{USER.nombre[0]}{USER.apellidos[0]}</span>
        <span className="small"><strong>{USER.nombreCompleto}</strong><br /><span className="xsmall muted">Convenio {USER.convenio}</span></span>
      </a>
      <button className="btn ghost sm" onClick={onLogout}>Salir</button>
    </> : <>
      <a href="https://oficina-virtual.survias.cl/paga-tu-cuenta" className="btn ghost sm" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Pago fácil <span aria-hidden="true">↗</span></a>
      <a href={href('login')} className="btn primary sm" onClick={() => setMenuOpen(false)}>Oficina Virtual</a>
    </>}
  </div>

  // En el ingreso, registro y recuperación no hay menú: solo volver y el logo.
  if (minimal) {
    return (
      <header className="site-header site-header-minimal">
        <div className="bar">
          <button type="button" className="header-back" onClick={onBack}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
            <span>Volver</span>
          </button>
          <Logo />
          <span aria-hidden="true" />
        </div>
      </header>
    )
  }

  return (
    <header className="site-header">
      <div className="bar">
        <Logo />
        <button
          ref={menuButton}
          type="button"
          className="site-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          aria-label={menuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" className="site-menu-icon"><i /><i /><i /></span>
        </button>
        <div id="site-navigation" className={'site-menu-panel' + (menuOpen ? ' open' : '')}>
          {navEl}
          {actionsEl}
        </div>
      </div>
    </header>
  )
}



