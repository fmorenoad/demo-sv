import { useState } from 'react'
import { Card, Field, Badge, Toggle, VerifyModal, Toast, MockNote } from '../../components/ui.jsx'
import ServiceIcon from '../../components/ServiceIcon.jsx'
import '../../cuenta.css'
import { USER } from '../../data/mock.js'

const SESIONES = [
  { d: 'Chrome · Windows', lugar: 'Talca, Chile', cuando: 'Ahora (esta sesión)', actual: true },
  { d: 'Safari · iPhone', lugar: 'Talca, Chile', cuando: 'Ayer 21:14', actual: false },
  { d: 'Chrome · Android', lugar: 'Santiago, Chile', cuando: '12-10-2026', actual: false },
]

export default function MiCuenta() {
  const [email, setEmail] = useState(USER.email)
  const [tel, setTel] = useState(USER.telefono)
  const [dirty, setDirty] = useState(false)
  const [mfa, setMfa] = useState(true)
  const [verify, setVerify] = useState(null)
  const [toast, setToast] = useState('')
  const [pw, setPw] = useState('')
  const strength = pw.length >= 12 && /\d/.test(pw) && /[A-Za-z]/.test(pw) ? 'Fuerte' : pw.length >= 10 ? 'Media' : pw ? 'Débil' : ''

  const confirm = () => {
    const v = verify; setVerify(null)
    if (v === 'contacto') { setDirty(false); setToast('Datos de contacto actualizados.') }
    if (v === 'pw') { setPw(''); setToast('Contraseña actualizada. Cerramos las otras sesiones.') }
    if (v === 'cerrar') setToast('Sesiones cerradas en los otros dispositivos.')
  }

  return (
    <div className="ov-account">
      <header className="account-heading">
        <span className="account-heading-icon"><ServiceIcon type="account" /></span>
        <div><h1>Mi cuenta</h1><p>Datos de contacto, acceso y seguridad.</p></div>
      </header>
      <div className="account-columns">
        <div className="account-stack">
          <Card className="account-contact" title={<span className="account-card-title"><ServiceIcon type="account" />Datos de contacto</span>} right={dirty && <span className="badge warn">Cambios sin guardar</span>}>
            <div className="account-fields">
              <Field label="RUT"><input aria-label="RUT" className="input" value={USER.rut} disabled /></Field>
              <Field label="Nombre"><input aria-label="Nombre" className="input" value={USER.nombreCompleto} disabled /></Field>
              <Field label="Correo" hint="Aquí llegan boletas, comprobantes y códigos."><input aria-label="Correo" className="input" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setDirty(true) }} /></Field>
              <Field label="Celular" hint="Para SMS de verificación y avisos."><input aria-label="Celular" className="input" value={tel} onChange={(e) => { setTel(e.target.value); setDirty(true) }} /></Field>
            </div>
            <div className="account-actions">
              <button className="btn ghost" disabled={!dirty} onClick={() => { setEmail(USER.email); setTel(USER.telefono); setDirty(false) }}>Descartar</button>
              <button className="btn primary" disabled={!dirty} onClick={() => setVerify('contacto')}>Guardar</button>
            </div>
          </Card>

          <Card title={<span className="account-card-title"><ServiceIcon type="shield" />Contraseña</span>}>
            <div className="account-fields">
              <Field label="Contraseña actual"><input aria-label="Contraseña actual" className="input" type="password" /></Field>
              <Field label="Contraseña nueva" hint={strength ? `Seguridad: ${strength}` : 'Mínimo 10 caracteres, con letras y números.'}><input aria-label="Contraseña nueva" className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
              <Field label="Repite la contraseña nueva"><input aria-label="Repite la contraseña nueva" className="input" type="password" /></Field>
            </div>
            <div className="account-actions">
              <button className="btn primary" disabled={strength === '' || strength === 'Débil'} onClick={() => setVerify('pw')}>Actualizar contraseña</button>
            </div>
          </Card>

          <Card className="account-sessions" title={<span className="account-card-title"><ServiceIcon type="account" />Sesiones activas</span>} right={<button className="link" onClick={() => setVerify('cerrar')}>Cerrar las demás</button>} tight>
            <ul className="account-session-list">
                {SESIONES.map((s) => (
                  <li key={s.d}>
                    <ServiceIcon type="account" />
                    <div className="account-session-device"><strong>{s.d}</strong><span>{s.lugar}</span></div>
                    <span className="account-session-time">{s.cuando}</span>
                    <div className="account-session-action">{s.actual ? <Badge tone="ok" dot>Actual</Badge> : <button className="link" onClick={() => setToast('Sesión cerrada.')}>Cerrar</button>}</div>
                  </li>
                ))}
            </ul>
          </Card>
        </div>

        <div className="account-stack">
          <Card title={<span className="account-card-title"><ServiceIcon type="shield" />Acceso seguro</span>}>
            <Toggle checked={mfa} onChange={setMfa} label="Verificación en dos pasos" hint="Código por SMS al ingresar desde un dispositivo nuevo." />
            <div className="kv account-factor"><span>Método del segundo factor</span><span className="xsmall muted">SMS al celular terminado en ••78</span></div>
            <button className="btn ghost block sm" onClick={() => setToast('Demo: aquí se vincularía una aplicación autenticadora.')}><ServiceIcon type="shield" />Usar aplicación autenticadora</button>
            <div className="account-divider" />
            <div className="kv"><span>Clave Única</span><Badge tone="ok" dot>Vinculada</Badge></div>
            <p className="xsmall muted" style={{ marginTop: 8 }}>Los cambios sensibles piden siempre un código de verificación, aunque la sesión esté abierta.</p>
          </Card>
          <Card className="account-privacy" title={<span className="account-card-title"><ServiceIcon type="bill" />Privacidad y datos</span>}>
            <button className="btn ghost block sm" onClick={() => setToast('Preparando tu archivo. Te avisaremos por correo cuando esté listo.')}><ServiceIcon type="bill" /><span>Descargar mis datos</span><span className="account-arrow" aria-hidden="true">›</span></button>
            <button className="btn ghost block sm" onClick={() => setToast('Solicitud registrada. Se eliminan las conversaciones con el asistente en 72 horas.')}><ServiceIcon type="status" /><span>Eliminar historial del asistente</span><span className="account-arrow" aria-hidden="true">›</span></button>
            <p className="xsmall muted" style={{ marginTop: 10 }}>Derechos de acceso, rectificación y supresión según la Ley 21.719.</p>
          </Card>
          <div className="account-security-note"><ServiceIcon type="shield" /><p>Cada cambio sensible pide un código de verificación y se registra con fecha, hora y dispositivo.</p></div>
        </div>
      </div>

      <VerifyModal open={!!verify} channel={verify === 'contacto' ? 'correo y celular actuales' : 'correo registrado'} onCancel={() => setVerify(null)} onConfirm={confirm} />
      <Toast msg={toast} onDone={() => setToast('')} />
      <MockNote><strong>Mockup de Mi cuenta.</strong> En el portal actual solo se puede cambiar la contraseña; aquí se agregan contacto editable, segundo factor (2FA), sesiones y derechos ARCO.</MockNote>
    </div>
  )
}
