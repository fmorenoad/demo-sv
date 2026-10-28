import SocialFeed from '../../components/SocialFeed.jsx'
import { useState } from 'react'
import { Page, Card, Badge, Field, Alert, MockNote } from '../../components/ui.jsx'
import { INCIDENTES, TRABAJOS, TRAMOS, PORTICOS } from '../../data/mock.js'

function RouteMap() {
  // Esquema lineal de la ruta: ciudades, pórticos y zona de trabajos.
  const pts = [
    { x: 40, label: 'Talca' }, { x: 220, label: 'San Javier' }, { x: 400, label: 'Linares' }, { x: 580, label: 'Parral' }, { x: 760, label: 'Chillán' },
  ]
  return (
    <svg viewBox="0 0 800 120" className="route-map" role="img" aria-label="Esquema de la ruta Talca a Chillán con pórticos Rio Claro y Retiro y trabajos entre Talca y San Javier">
      <line x1="40" y1="60" x2="760" y2="60" stroke="var(--line)" strokeWidth="8" strokeLinecap="round" />
      <line x1="40" y1="60" x2="760" y2="60" stroke="var(--ok)" strokeWidth="8" strokeLinecap="round" />
      <line x1="150" y1="60" x2="200" y2="60" stroke="var(--warn)" strokeWidth="8" strokeLinecap="round" />
      {pts.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy="60" r="7" fill="var(--surface)" stroke="var(--navy)" strokeWidth="2" />
          <text x={p.x} y="95" textAnchor="middle" fontSize="12" fill="var(--ink)">{p.label}</text>
        </g>
      ))}
      <g>
        <rect x="118" y="20" width="64" height="20" rx="4" fill="var(--navy)" />
        <text x="150" y="34" textAnchor="middle" fontSize="11" fill="#fff">Rio Claro</text>
        <line x1="150" y1="40" x2="150" y2="52" stroke="var(--navy)" strokeWidth="2" />
      </g>
      <g>
        <rect x="648" y="20" width="56" height="20" rx="4" fill="var(--navy)" />
        <text x="676" y="34" textAnchor="middle" fontSize="11" fill="#fff">Retiro</text>
        <line x1="676" y1="40" x2="676" y2="52" stroke="var(--navy)" strokeWidth="2" />
      </g>
      <text x="175" y="112" textAnchor="middle" fontSize="11" fill="var(--warn)">Trabajos km 182–188</text>
    </svg>
  )
}

export default function EstadoRuta() {
  const [tramo, setTramo] = useState(TRAMOS[0])
  const [canal, setCanal] = useState('SMS')
  const [ok, setOk] = useState(false)
  const [acepta, setAcepta] = useState(false)

  return (
    <Page title="Estado de la ruta" subtitle="Estado y trabajos con datos de demostración. Consulta también las publicaciones del canal oficial de X.">
      <Card tight>
        <div className="card-body"><RouteMap /></div>
      </Card>

      <div className="section grid cols-3">
        {INCIDENTES.map((i) => (
          <Card key={i.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 15 }}>{i.tramo}</h3>
              <Badge tone={i.nivel} dot>{i.tipo}</Badge>
            </div>
            <p className="small muted" style={{ marginTop: 8 }}>{i.texto}</p>
            <div className="xsmall muted" style={{ marginTop: 8 }}>Actualizado {i.hora} · Survías</div>
          </Card>
        ))}
      </div>

      <div className="section grid sidebar">
        <Card title="Calendario de trabajos programados" right={<span className="xsmall muted">Act. 25-10-2026</span>} tight>
          <table className="table">
            <thead><tr><th>Fecha</th><th>Trabajo</th><th>Tramo</th><th>Efecto esperado</th></tr></thead>
            <tbody>
              {TRABAJOS.map((w) => (
                <tr key={w.id}>
                  <td><strong>{w.cuando}</strong></td>
                  <td>{w.titulo}<div className="xsmall muted">{w.detalle}</div></td>
                  <td>{w.tramo}</td>
                  <td>{w.efecto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Recibe avisos en tu celular">
          {ok ? (
            <Alert tone="ok" title="Avisos activados">
              Te avisaremos por {canal} sobre trabajos e incidentes en {tramo}. Puedes darte de baja desde el mismo mensaje.
              <div style={{ marginTop: 10 }}><button className="btn ghost sm" onClick={() => setOk(false)}>Cambiar preferencias</button></div>
            </Alert>
          ) : (
            <>
              <p className="small muted" style={{ marginBottom: 12 }}>Elige un tramo y un canal. No pedimos tu ubicación.</p>
              <Field label="Tramo">
                <select className="input" value={tramo} onChange={(e) => setTramo(e.target.value)}>
                  {TRAMOS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Canal">
                <div className="seg">
                  {['SMS', 'WhatsApp', 'Email'].map((c) => (
                    <button key={c} type="button" className={canal === c ? 'on' : ''} onClick={() => setCanal(c)}>{c}</button>
                  ))}
                </div>
              </Field>
              <Field label={canal === 'Email' ? 'Correo' : 'Celular'}>
                <input className="input" placeholder={canal === 'Email' ? 'nombre@correo.cl' : '+56 9 ____ ____'} />
              </Field>
              <label className="small" style={{ display: 'flex', gap: 8, alignItems: 'flex-start', margin: '4px 0 14px' }}>
                <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} style={{ marginTop: 3 }} />
                <span>Acepto recibir avisos sobre este tramo. Máximo 3 mensajes por semana; baja inmediata respondiendo BAJA.</span>
              </label>
              <button className="btn primary block" disabled={!acepta} onClick={() => setOk(true)}>Activar avisos</button>
            </>
          )}
        </Card>
      </div>

      <div className="section">
        <Alert tone="info" title="Fuentes de información">
          El estado de la ruta proviene del centro de control de Survías. Los datos de tráfico de terceros (por ejemplo Waze) se mostrarán identificados como tales cuando la integración esté disponible; si una fuente no responde, esta página lo indica y mantiene los canales oficiales: 600 252 6000.
        </Alert>
      </div>

      <div className="section"><SocialFeed /></div>
      <MockNote><strong>Mockup de Estado de ruta.</strong> Incidentes y trabajos son de ejemplo. Pórticos: {PORTICOS.map((p) => p.nombre).join(' y ')}.</MockNote>
    </Page>
  )
}

