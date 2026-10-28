import { href } from '../router.jsx'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap foot-grid">
        <div>
          <div className="logo" style={{ fontSize: 18 }}>
            <img className="brand-logo" src="/assets/survias-logo.png" alt="Survías Maule Ñuble" width="287" height="176" />
          </div>
          <p className="xsmall muted" style={{ marginTop: 8 }}>Concesión Ruta 5, tramo Talca – Chillán. © Survías Maule-Ñuble S.A.</p>
        </div>
        <div>
          <div className="eyebrow">Asistencia comercial</div>
          <div className="foot-phone">600 006 2030</div>
          <div className="xsmall muted">Lunes a viernes, 8:00 a 20:00</div>
        </div>
        <div>
          <div className="eyebrow">Consultas y emergencias</div>
          <div className="foot-phone">600 252 6000</div>
          <div className="xsmall muted">24 horas, 7 días</div>
        </div>
        <div>
          <div className="eyebrow">Enlaces</div>
          <div className="foot-links">
            <a href={href('tarifas')}>Tarifas</a>
            <a href={href('ruta')}>Estado de ruta</a>
            <a href={href('ayuda')}>Ayuda y reclamos</a>
            <a href="#">Política de privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

