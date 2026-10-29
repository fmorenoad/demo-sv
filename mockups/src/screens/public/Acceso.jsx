import { cloneElement, useEffect, useId, useRef, useState } from 'react'
import { href } from '../../router.jsx'
import { Steps, Alert, MockNote } from '../../components/ui.jsx'
import ServiceIcon from '../../components/ServiceIcon.jsx'
import '../../acceso.css'

const BENEFITS = [
  { icon: 'bill', text: 'Consulta y paga tus tránsitos' },
  { icon: 'car', text: 'Administra tus vehículos y tu TAG' },
  { icon: 'status', text: 'Accede a tu historial y comprobantes' },
]

function Field({ label, hint, children }) {
  const id = useId()
  return <div className="field">
    <label htmlFor={id}>{label}</label>
    {cloneElement(children, { id, ...(hint ? { 'aria-describedby': id + '-hint' } : {}) })}
    {hint && <div id={id + '-hint'} className="xsmall muted access-hint">{hint}</div>}
  </div>
}

function Split({ children, title, intro, variant = 'login' }) {
  const rootRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const root = rootRef.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const targets = [...root.querySelectorAll('.access-observe')]
    let observer
    const activate = () => {
      observer?.disconnect()
      if (motion.matches || typeof IntersectionObserver === 'undefined') {
        root.classList.remove('motion-ready')
        return
      }
      targets.forEach((element) => {
        const rect = element.getBoundingClientRect()
        element.classList.toggle('is-visible', rect.top < innerHeight && rect.bottom > 0)
      })
      root.classList.add('motion-ready')
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting)
        entry.target.classList.toggle('exits-above', entry.boundingClientRect.bottom <= 0)
      }), { threshold: 0.02 })
      targets.forEach((element) => observer.observe(element))
    }
    activate()
    motion.addEventListener?.('change', activate)
    return () => {
      observer?.disconnect()
      motion.removeEventListener?.('change', activate)
    }
  }, [variant])

  return <section ref={rootRef} className={'access-page access-' + variant} aria-labelledby={titleId}>
    <div className="access-scene access-observe" aria-hidden="true">
      <img className="access-photo" src={'/assets/access-' + variant + '.webp'} alt="" width="2048" height="1152" fetchPriority="high" />
    </div>
    <div className="access-container">
      <div className="access-intro access-observe">
        <div className="access-copy">
          <div className="access-eyebrow">Oficina Virtual</div>
          <h1 id={titleId}>{variant === 'login' ? 'Gestiona tus tránsitos en línea' : title}</h1>
          <p className="access-lead">{variant === 'login' ? 'Revisa tus pasadas, paga tus cuentas, administra tus vehículos y mucho más, de forma rápida y segura.' : intro}</p>
          <ul className="access-benefits">{BENEFITS.map((benefit) => <li key={benefit.icon}><ServiceIcon type={benefit.icon} /><span>{benefit.text}</span></li>)}</ul>
        </div>
      </div>
      <div className="access-form-frame access-observe">
        <div className="access-card">
          <div className="access-card-mark" aria-hidden="true"><ServiceIcon type={variant === 'register' ? 'account' : 'shield'} /></div>
          <h2>{title}</h2>
          {intro && <p className="access-form-intro">{intro}</p>}
          <div className="access-fields">{children}</div>
        </div>
      </div>
    </div>
  </section>
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
    <Split variant="register" title="Regístrate" intro="Crea tu cuenta para arrendar un TAG o administrar tu convenio.">
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
    <Split variant="recover" title="Recuperar contraseña" intro="Te enviaremos un enlace seguro, válido por 30 minutos.">
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
