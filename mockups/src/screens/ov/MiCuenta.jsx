import { useState } from 'react'
import { Page, Card, Field, Badge, Toggle, Alert, VerifyModal, Toast, MockNote } from '../../components/ui.jsx'
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
    <Page title="Mi cuenta" subtitle="Datos de contacto, acceso y seguridad.">
      <div className="grid sidebar">
        <div className="grid" style={{ gap: 16 }}>
          <Card title="Datos de contacto" right={dirty && <span className="badge warn">Cambios sin guardar</span>}>
            <div className="grid cols-2" style={{ gap: 10 }}>
              <Field label="RUT"><input className="input" value={USER.rut} disabled /></Field>
              <Field label="Nombre"><input className="input" value={USER.nombreCompleto} disabled /></Field>
              <Field label="Correo" hint="Aquí llegan boletas, comprobantes y códigos."><input className="input" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setDirty(true) }} /></Field>
              <Field label="Celular" hint="Para SMS de verificación y avisos."><input className="input" value={tel} onChange={(e) => { setTel(e.target.value); setDirty(true) }} /></Field>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn ghost" disabled={!dirty} onClick={() => { setEmail(USER.email); setTel(USER.telefono); setDirty(false) }}>Descartar</button>
              <button className="btn primary" disabled={!dirty} onClick={() => setVerify('contacto')}>Guardar</button>
            </div>
          </Card>

          <Card title="Contraseña">
            <div className="grid cols-2" style={{ gap: 10 }}>
              <Field label="Contraseña actual"><input className="input" type="password" /></Field>
              <div />
              <Field label="Contraseña nueva" hint={strength ? `Seguridad: ${strength}` : 'Mínimo 10 caracteres, con letras y números.'}><input className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
              <Field label="Repite la contraseña nueva"><input className="input" type="password" /></Field>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn primary" disabled={strength === '' || strength === 'Débil'} onClick={() => setVerify('pw')}>Actualizar contraseña</button>
            </div>
          </Card>

          <Card title="Sesiones activas" right={<button className="link" onClick={() => setVerify('cerrar')}>Cerrar las demás</button>} tight>
            <table className="table">
              <tbody>
                {SESIONES.map((s) => (
                  <tr key={s.d}><td><strong>{s.d}</strong><div className="xsmall muted">{s.lugar}</div></td><td className="small">{s.cuando}</td><td className="center">{s.actual ? <Badge tone="ok" dot>Actual</Badge> : <button className="link" onClick={() => setToast('Sesión cerrada.')}>Cerrar</button>}</td></tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="grid" style={{ gap: 16 }}>
          <Card title="Acceso seguro">
            <Toggle checked={mfa} onChange={setMfa} label="Verificación en dos pasos" hint="Código por SMS al ingresar desde un dispositivo nuevo." />
            <div className="kv" style={{ marginTop: 6 }}><span>Método del segundo factor</span><span className="xsmall muted">SMS al celular terminado en ••78</span></div>
            <button className="btn ghost block sm" style={{ marginTop: 8 }} onClick={() => setToast('Demo: aquí se vincularía una aplicación autenticadora.')}>Usar aplicación autenticadora</button>
            <div style={{ borderTop: '1px solid var(--line)', margin: '12px 0' }} />
            <div className="kv"><span>Clave Única</span><Badge tone="ok" dot>Vinculada</Badge></div>
            <p className="xsmall muted" style={{ marginTop: 8 }}>Los cambios sensibles piden siempre un código de verificación, aunque la sesión esté abierta.</p>
          </Card>
          <Card title="Privacidad y datos">
            <button className="btn ghost block sm" onClick={() => setToast('Preparando tu archivo. Te avisaremos por correo cuando esté listo.')}>Descargar mis datos</button>
            <button className="btn ghost block sm" style={{ marginTop: 8 }} onClick={() => setToast('Solicitud registrada. Se eliminan las conversaciones con el asistente en 72 horas.')}>Eliminar historial del asistente</button>
            <p className="xsmall muted" style={{ marginTop: 10 }}>Derechos de acceso, rectificación y supresión según la Ley 21.719.</p>
          </Card>
          <Alert tone="info">Cada cambio sensible pide un código de verificación y se registra con fecha, hora y dispositivo.</Alert>
        </div>
      </div>

      <VerifyModal open={!!verify} channel={verify === 'contacto' ? 'correo y celular actuales' : 'correo registrado'} onCancel={() => setVerify(null)} onConfirm={confirm} />
      <Toast msg={toast} onDone={() => setToast('')} />
      <MockNote><strong>Mockup de Mi cuenta.</strong> En el portal actual solo se puede cambiar la contraseña; aquí se agregan contacto editable, segundo factor (2FA), sesiones y derechos ARCO.</MockNote>
    </Page>
  )
}
