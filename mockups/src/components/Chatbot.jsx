import { useState } from 'react'
import { href } from '../router.jsx'
import { USER, TRANSITOS, clp } from '../data/mock.js'

// Widget del asistente (servicio contratado). Dos guiones: público y con sesión.
// defaultOpen: abre la ventana; embedded: lo muestra sin posición fija.
export default function Chatbot({ session = false, defaultOpen = false, embedded = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const pendientes = TRANSITOS.filter((t) => t.estado === 'No facturado')
  const deuda = pendientes.reduce((a, t) => a + t.monto, 0)

  const publicScript = (
    <>
      <div className="msg bot">
        Hola. Puedo ayudarte con tarifas, estado de la ruta y el TAG. Para ver tus
        tránsitos o pagar, te pediré iniciar sesión.
      </div>
      <div className="quick">
        <button>¿Cuánto cuesta Talca–Chillán?</button>
        <button>¿Hay trabajos hoy?</button>
        <button>Arrendar TAG</button>
        <button>Pasé sin TAG</button>
      </div>
      <div className="msg user">¿Cuánto cuesta ir de Talca a Chillán en auto?</div>
      <div className="msg bot">
        Para un <strong>auto (categoría 1)</strong> pasas por dos pórticos, Rio Claro y Retiro, a
        <strong> $3.300</strong> cada uno. Total del tramo: <strong>$6.600</strong> en horario normal.
        <span className="src">Fuente: Tarifas Survías · act. 23-10-2026</span>
      </div>
      <div className="msg user">Quiero pagar un tránsito pendiente</div>
      <div className="msg bot">
        Para eso necesito verificar tu identidad. Te llevo a <a href={href('login')}>iniciar sesión</a> y,
        una vez dentro, preparo el detalle. La confirmación del pago ocurre en una pantalla segura.
      </div>
    </>
  )

  const privateScript = (
    <>
      <div className="msg bot">
        Hola {USER.nombre}. Resumen de tu cuenta: tienes <strong>{pendientes.length} tránsitos no facturados</strong> por
        <strong> {clp(deuda)}</strong> y tu TAG de la patente JKLM56 sigue pendiente de instalación.
        <span className="src">Datos del convenio {USER.convenio} · act. hoy 12:40</span>
      </div>
      <div className="quick">
        <button>Explícame el cobro del 21-10</button>
        <button>Pagar lo pendiente</button>
        <button>Estado de mi requerimiento</button>
      </div>
      <div className="msg user">Explícame el cobro del 21-10</div>
      <div className="msg bot">
        El 21-10-2026 la patente <strong>ABCD12</strong> pasó dos veces por el pórtico <strong>Rio Claro</strong>:
        a las 08:12 hacia el sur y a las 19:40 hacia el norte. Cada paso de categoría 1 cuesta $3.300 en horario normal.
        Son <strong>$6.600</strong> en total, aún no facturados.
      </div>
      <div className="msg user">Pagar lo pendiente</div>
      <div className="msg bot">
        Preparé la selección de tus 3 tránsitos pendientes ({clp(deuda)}). Para confirmar, continúa en la
        <a href={href('ov/pagar')}> pantalla de pago segura</a>. Yo no proceso pagos ni pido datos de tarjeta.
      </div>
    </>
  )

  const windowEl = (
    <div className="chat-window" role="dialog" aria-label="Asistente virtual Survías">
      <div className="chat-head">
        <div className="av">S</div>
        <div className="meta">
          <strong>Asistente Survías</strong>
          <small><span className="dot ok" /> En línea · respuestas con fuente{session ? ' · sesión verificada' : ''}</small>
        </div>
      </div>
      <div className="chat-body">{session ? privateScript : publicScript}</div>
      <div className="chat-input">
        <input className="input" placeholder="Escribe tu consulta…" />
        <button className="btn primary sm">Enviar</button>
      </div>
      <div className="chat-note">No pedimos claves, códigos ni datos de tarjeta por el chat.</div>
    </div>
  )

  if (embedded) return windowEl

  return (
    <>
      {open && (
        <div className="chat-float">{windowEl}</div>
      )}
      <button
        className="chat-fab"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Cerrar asistente virtual' : 'Abrir asistente virtual'}
        title={open ? 'Cerrar asistente' : 'Asistente virtual'}
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="7" width="18" height="12" rx="4" />
            <path d="M12 7V4M9 4h6" />
            <circle cx="9" cy="13" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="15" cy="13" r="1.2" fill="currentColor" stroke="none" />
            <path d="M9.5 16.5h5" />
          </svg>
        )}
      </button>
    </>
  )
}

