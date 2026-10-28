import { href } from '../../router.jsx'
import { Page, Card, Badge, MockNote } from '../../components/ui.jsx'
import Chatbot from '../../components/Chatbot.jsx'
import { FAQ } from '../../data/mock.js'

const PUBLICAS = [
  'Simulador de costo de viaje por categoría y tramo',
  'TAG: cómo arrendarlo y qué hacer si pasaste sin él',
  'Gratuidad lateral: quiénes aplican y cómo acreditarla',
  'Estado de ruta y trabajos programados, con hora de actualización',
]
const PRIVADAS = [
  'Explicación de cobros y tránsitos en lenguaje simple',
  'Pago y repactación guiados (cierre en pantalla segura)',
  'Autofacturación de tránsitos no facturados',
  'Seguimiento de requerimientos por folio',
  'Resumen proactivo al ingresar y accesos rápidos',
  'Suscripción a avisos por tramo',
]

export default function Ayuda() {
  return (
    <Page title="Ayuda" subtitle="Preguntas frecuentes, canales de atención y asistente virtual.">
      <div className="grid sidebar">
        <div className="grid" style={{ gap: 16 }}>
          <Card title="Preguntas frecuentes">
            {FAQ.map((f) => (
              <details key={f.q} className="faq"><summary>{f.q}</summary><p className="small muted">{f.a}</p></details>
            ))}
          </Card>

          <Card title="Canales de atención">
            <div className="grid cols-3" style={{ gap: 12 }}>
              <div className="channel"><div className="ico">📞</div><strong>600 006 2030</strong><span className="xsmall muted">Asistencia comercial</span></div>
              <div className="channel"><div className="ico">🚨</div><strong>600 252 6000</strong><span className="xsmall muted">Emergencias 24/7</span></div>
              <div className="channel"><div className="ico">📝</div><strong>Reclamos y sugerencias</strong><span className="xsmall muted">Con sesión, en <a href={href('login')}>Mis interacciones</a></span></div>
            </div>
            <p className="xsmall muted" style={{ marginTop: 12 }}>Los reclamos se responden en un plazo máximo de 5 días hábiles según el Reglamento de Servicio de la Obra.</p>
          </Card>

          <Card title="Qué puede hacer el asistente">
            <div className="grid cols-2" style={{ gap: 16 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><strong className="small">Sin iniciar sesión</strong><Badge tone="info">Público</Badge></div>
                {PUBLICAS.map((c) => <div className="cap" key={c}><span className="lock">🌐</span><span>{c}</span></div>)}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><strong className="small">Con sesión iniciada</strong><Badge tone="warn">Autenticado</Badge></div>
                {PRIVADAS.map((c) => <div className="cap" key={c}><span className="lock">🔒</span><span>{c}</span></div>)}
              </div>
            </div>
            <p className="xsmall muted" style={{ marginTop: 12 }}>
              Handoff seguro: el asistente orienta y prepara, pero no confirma pagos ni pide claves o datos de tarjeta.
              Continuidad: puede generar un folio y derivar a un ejecutivo con el contexto cargado.
            </p>
          </Card>
        </div>

        <div>
          <Chatbot embedded defaultOpen />
        </div>
      </div>
      <MockNote><strong>Mockup de Ayuda.</strong> El asistente es un servicio contratado que responde solo sobre contenidos aprobados por Survías.</MockNote>
    </Page>
  )
}
