import { useState } from 'react'
import { href } from '../../router.jsx'
import { Page, Card, MockNote } from '../../components/ui.jsx'

const TAG_URL = 'https://www.survias.cl/tag/'
const DISTRIBUTION_URL = TAG_URL + '#puntos-de-distribucion'
const CHECKLIST = [
  'Revisé los documentos exigidos para mi caso en el sitio oficial.',
  'Tengo mi identificación vigente y la documentación del vehículo.',
  'Revisé la modalidad de entrega y las condiciones del contrato.',
  'Elegí un punto de distribución y confirmé su horario.',
]

export default function Tag() {
  const [checked, setChecked] = useState([])
  const toggle = (item) => setChecked((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])
  return <Page title="Obtén tu TAG" subtitle="Prepara tu documentación y elige un punto de distribución de Survías.">
    <div className="grid sidebar">
      <Card title="Cómo obtener tu TAG">
        <ol className="num-list">
          <li><strong>Revisa los requisitos.</strong> Consulta la documentación correspondiente a personas naturales, empresas o terceros autorizados.</li>
          <li><strong>Elige un punto de distribución.</strong> Revisa las ubicaciones y horarios publicados por Survías antes de acudir.</li>
          <li><strong>Completa el trámite.</strong> Presenta los documentos y revisa las condiciones del contrato con el equipo de atención.</li>
        </ol>
        <div className="tag-actions"><a href={DISTRIBUTION_URL} target="_blank" rel="noopener noreferrer" className="btn primary">Ver puntos de distribución ↗</a><a href={TAG_URL} target="_blank" rel="noopener noreferrer" className="btn ghost">Requisitos oficiales ↗</a></div>
      </Card>
      <Card title="Modalidades de entrega">
        <h3 style={{ fontSize: 16 }}>Comodato</h3><p className="small muted" style={{ marginTop: 8 }}>Dispositivo en préstamo, sujeto a los requisitos y condiciones publicados por Survías.</p>
        <h3 style={{ fontSize: 16, marginTop: 24 }}>Arriendo</h3><p className="small muted" style={{ marginTop: 8 }}>Dispositivo mediante contrato de arriendo. Consulta el monto y las condiciones vigentes antes de contratar.</p>
        <a className="text-link" style={{ marginTop: 24 }} href={TAG_URL} target="_blank" rel="noopener noreferrer">Revisar modalidades y contratos ↗</a>
      </Card>
    </div>
    <div className="section grid cols-2">
      <Card title="Prepara tu visita">
        <p className="small muted">Marca lo que ya tienes listo. Esta lista es una ayuda personal; no envía una solicitud.</p>
        <div className="tag-checklist">{CHECKLIST.map((item) => <label key={item}><input type="checkbox" checked={checked.includes(item)} onChange={() => toggle(item)} /><span>{item}</span></label>)}</div>
        <p className="small" role="status" style={{ marginTop: 20 }}>{checked.length === CHECKLIST.length ? 'Preparación completa. Ya puedes acudir al punto de distribución elegido.' : `${checked.length} de ${CHECKLIST.length} pasos preparados.`}</p>
      </Card>
      <Card title="¿Ya tienes un TAG?">
        <p className="small muted">Consulta su estado en el servicio oficial o accede a tu cuenta para gestionar tus vehículos.</p>
        <div className="tag-actions"><a className="btn ghost" href="https://oficina-virtual.survias.cl/consulta-transitos" target="_blank" rel="noopener noreferrer">Estado de tu TAG ↗</a><a className="btn ghost" href={href('login')}>Mi Oficina Virtual</a></div>
        <div className="tag-actions"><a className="text-link" href={TAG_URL + '#devolver-tag'} target="_blank" rel="noopener noreferrer">Cómo devolver tu dispositivo ↗</a></div>
      </Card>
    </div>
    <MockNote>Demo de orientación. Los enlaces abren los servicios oficiales de Survías; obtener un TAG requiere completar el trámite con la concesionaria.</MockNote>
  </Page>
}
