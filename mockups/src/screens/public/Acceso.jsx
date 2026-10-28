import { useState } from 'react'
import { href } from '../../router.jsx'
import { Card, Field, Steps, Alert, MockNote } from '../../components/ui.jsx'

function Split({ children, title, intro }) {
  return (
    <div className="wrap">
      <div className="section card" style={{ maxWidth: 960, margin: '28px auto 0' }}>
        <div className="login-split">
          <div className="login-form">
            <div className="eyebrow">Oficina Virtual</div>
            <h2 style={{ margin: '8px 0 4px' }}>{title}</h2>
            {intro && <p className="small muted" style={{ marginBottom: 20 }}>{intro}</p>}
            {children}
          </div>
          <div className="login-photo" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

export function Login({ onLogin, notice }) {
  const [rut, setRut] = useState('')
  const [pw, setPw] = useState('')
  const [mfa, setMfa] = useState(false)
  return (
    <Split title="Bienvenido" intro="Ingresa con tu RUT y clave. Te pediremos un código de verificación al entrar desde un dispositivo nuevo.">
      {notice && <Alert tone="warn">{notice}</Alert>}
      {!mfa ? (
        <>
          <Field label="RUT" hint="Con o sin puntos y guion; lo formateamos por ti.">
            <input className="input" placeholder="12.345.678-9" value={rut} onChange={(e) => setRut(e.target.value)} autoComplete="username" />
          </Field>
          <Field label="Contraseña">
            <input className="input" type="password" placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
          </Field>
          <button className="btn primary block" onClick={() => setMfa(true)}>Ingresar</button>
          <button className="btn ghost block" style={{ marginTop: 8 }} onClick={onLogin}>Entrar con Clave Única</button>
          <div className="small" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
            <a href={href('recuperar')}>¿Olvidaste tu contraseña?</a>
            <a href={href('registro')}>Regístrate</a>
          </div>
        </>
      ) : (
        <>
          <Alert tone="info" title="Verificación en dos pasos">Enviamos un código a tu celular terminado en ••78.</Alert>
          <Field label="Código de 6 dígitos">
            <input className="input code" inputMode="numeric" maxLength={6} placeholder="••••••" autoFocus />
          </Field>
          <label className="small" style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
            <input type="checkbox" /> Confiar en este dispositivo por 30 días
          </label>
          <button className="btn primary block" onClick={onLogin}>Confirmar e ingresar</button>
          <button className="btn ghost block" style={{ marginTop: 8 }} onClick={() => setMfa(false)}>Volver</button>
        </>
      )}
      <p className="xsmall muted" style={{ marginTop: 16 }}>Demo: cualquier dato ingresa a la Oficina Virtual con datos ficticios.</p>
    </Split>
  )
}

export function Registro() {
  const [step, setStep] = useState(1)
  return (
    <Split title="Regístrate" intro="Crea tu cuenta para arrendar un TAG o administrar tu convenio.">
      <Steps steps={['Tus datos', 'Verificación', 'Clave']} current={step} />
      {step === 1 && (
        <>
          <Field label="RUT"><input className="input" placeholder="12.345.678-9" /></Field>
          <Field label="Patente"><input className="input plate" placeholder="ABCD12" maxLength={6} /></Field>
          <div className="grid cols-2" style={{ gap: 10 }}>
            <Field label="Celular"><input className="input" placeholder="+56 9 ____ ____" /></Field>
            <Field label="Correo"><input className="input" type="email" placeholder="nombre@correo.cl" /></Field>
          </div>
          <label className="small" style={{ display: 'flex', gap: 8, alignItems: 'flex-start', margin: '4px 0 14px' }}>
            <input type="checkbox" style={{ marginTop: 3 }} /> <span>Acepto los términos del servicio y la política de privacidad (Ley 21.719).</span>
          </label>
          <button className="btn primary block" onClick={() => setStep(2)}>Continuar</button>
        </>
      )}
      {step === 2 && (
        <>
          <Alert tone="info">Enviamos un código al celular y otro al correo. Ingresa el del celular para continuar.</Alert>
          <Field label="Código SMS"><input className="input code" inputMode="numeric" maxLength={6} placeholder="••••••" /></Field>
          <button className="btn primary block" onClick={() => setStep(3)}>Verificar</button>
          <button className="btn ghost block" style={{ marginTop: 8 }} onClick={() => setStep(1)}>Volver</button>
        </>
      )}
      {step === 3 && (
        <>
          <Field label="Crea una contraseña" hint="Mínimo 10 caracteres, con letras y números."><input className="input" type="password" /></Field>
          <Field label="Repite la contraseña"><input className="input" type="password" /></Field>
          <a href={href('login')} className="btn primary block">Crear cuenta e ingresar</a>
        </>
      )}
      <p className="small" style={{ marginTop: 14 }}>¿Ya tienes cuenta? <a href={href('login')}>Ingresa aquí</a></p>
    </Split>
  )
}

export function Recuperar() {
  const [sent, setSent] = useState(false)
  return (
    <Split title="Recuperar contraseña" intro="Te enviaremos un enlace seguro, válido por 30 minutos.">
      {sent ? (
        <Alert tone="ok" title="Revisa tu correo">Si el RUT está registrado, enviamos un enlace a ma•••@ejemplo.cl y un aviso a tu celular. No revelamos si la cuenta existe.</Alert>
      ) : (
        <>
          <Field label="RUT"><input className="input" placeholder="12.345.678-9" /></Field>
          <Field label="Correo registrado"><input className="input" type="email" placeholder="nombre@correo.cl" /></Field>
          <button className="btn primary block" onClick={() => setSent(true)}>Enviar enlace</button>
        </>
      )}
      <p className="small" style={{ marginTop: 14 }}><a href={href('login')}>Volver al ingreso</a></p>
      <MockNote>Demo. Ningún correo real se envía.</MockNote>
    </Split>
  )
}
