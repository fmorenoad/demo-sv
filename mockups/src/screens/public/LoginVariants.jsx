import { useId, useRef, useState } from 'react'
import { href } from '../../router.jsx'
import ServiceIcon from '../../components/ServiceIcon.jsx'
import { Login as LoginActual } from './Acceso.jsx'
import '../../login-variants.css'

// Ingreso a la Oficina Virtual. El diseño vigente es el "actual" (Acceso.jsx).
// Las alternativas A, B y C se conservan como referencia y solo se abren por URL: #/login/a, #/login/b, #/login/c.

const KEYS = ['a', 'b', 'c', 'actual']

// ---------- RUT: formato y dígito verificador ----------
const cleanRut = (v) => v.replace(/[^0-9kK]/g, '').toUpperCase().slice(0, 9)
const formatRut = (v) => {
  const c = cleanRut(v)
  if (c.length < 2) return c
  return c.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + c.slice(-1)
}
const validRut = (v) => {
  const c = cleanRut(v)
  if (c.length < 8 || !/^\d+$/.test(c.slice(0, -1))) return false
  let sum = 0
  let m = 2
  for (let i = c.length - 2; i >= 0; i--) { sum += Number(c[i]) * m; m = m === 7 ? 2 : m + 1 }
  const r = 11 - (sum % 11)
  return (r === 11 ? '0' : r === 10 ? 'K' : String(r)) === c.slice(-1)
}

// ---------- Piezas compartidas ----------
const Svg = ({ children, size = 20 }) => <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
const IconCheck = () => <Svg size={18}><path d="m5 12.5 4.5 4.5L19 7.5" /></Svg>
const IconArrow = () => <Svg size={18}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>
const IconBack = () => <Svg size={18}><path d="M19 12H5M11 6l-6 6 6 6" /></Svg>
const IconLock = () => <Svg size={18}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>
const IconPhone = () => <Svg><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M11 17.5h2" /></Svg>
const IconKey = () => <Svg><circle cx="8" cy="15" r="4" /><path d="m11 12 8-8M16 7l2.5 2.5M14 9l1.5 1.5" /></Svg>
const IconId = () => <Svg><rect x="3" y="5" width="18" height="14" rx="2.5" /><circle cx="9" cy="11" r="2" /><path d="M6 16c.6-1.4 1.7-2 3-2s2.4.6 3 2M15 10h3M15 14h3" /></Svg>

function RutField({ value, onChange, autoFocus, big }) {
  const id = useId()
  const touched = cleanRut(value).length >= 8
  const ok = validRut(value)
  return (
    <div className={'lg-field' + (big ? ' lg-field-big' : '')}>
      <label htmlFor={id}>RUT</label>
      <div className={'lg-input-wrap' + (ok ? ' is-ok' : touched ? ' is-warn' : '')}>
        <input id={id} className="lg-input" inputMode="text" autoComplete="username" placeholder="12.345.678-5" value={value} autoFocus={autoFocus}
          aria-describedby={id + '-hint'} onChange={(e) => onChange(formatRut(e.target.value))} />
        {ok && <span className="lg-input-state" title="RUT válido"><IconCheck /></span>}
      </div>
      <p id={id + '-hint'} className="lg-hint" role={touched && !ok ? 'alert' : undefined}>
        {ok ? 'RUT válido.' : touched ? 'Revisa el dígito verificador.' : 'Escríbelo como quieras: le damos formato por ti.'}
      </p>
    </div>
  )
}

function PasswordField({ value, onChange, autoFocus }) {
  const id = useId()
  const [show, setShow] = useState(false)
  return (
    <div className="lg-field">
      <div className="lg-label-row"><label htmlFor={id}>Contraseña</label><a href={href('recuperar')}>¿La olvidaste?</a></div>
      <div className="lg-input-wrap">
        <input id={id} className="lg-input" type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="Tu contraseña" value={value} autoFocus={autoFocus} onChange={(e) => onChange(e.target.value)} />
        <button type="button" className="lg-input-action" onClick={() => setShow((s) => !s)} aria-pressed={show}>{show ? 'Ocultar' : 'Mostrar'}</button>
      </div>
    </div>
  )
}

// Código de verificación en seis casillas: avanza solo, acepta pegar y retrocede con Borrar.
function Otp({ onComplete }) {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const refs = useRef([])
  const set = (next) => { setDigits(next); onComplete(next.every(Boolean)) }
  const change = (i, raw) => {
    const chars = raw.replace(/\D/g, '')
    if (!chars) { const n = [...digits]; n[i] = ''; return set(n) }
    const n = [...digits]
    chars.slice(0, 6 - i).split('').forEach((ch, k) => { n[i + k] = ch })
    set(n)
    refs.current[Math.min(i + chars.length, 5)]?.focus()
  }
  const key = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus()
    if (e.key === 'ArrowRight' && i < 5) refs.current[i + 1]?.focus()
  }
  return (
    <div className="lg-otp" role="group" aria-label="Código de verificación de 6 dígitos">
      {digits.map((d, i) => (
        <input key={i} ref={(el) => { refs.current[i] = el }} className="lg-otp-box" inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={6} value={d} autoFocus={i === 0} aria-label={'Dígito ' + (i + 1)} onChange={(e) => change(i, e.target.value)} onKeyDown={(e) => key(i, e)} onFocus={(e) => e.target.select()} />
      ))}
    </div>
  )
}

function OtpStep({ onLogin, onBack, title = 'Revisa tu celular' }) {
  const [ready, setReady] = useState(false)
  return (
    <form className="lg-form" onSubmit={(e) => { e.preventDefault(); onLogin() }}>
      <button type="button" className="lg-back" onClick={onBack}><IconBack /> Volver</button>
      <h2 className="lg-step-title">{title}</h2>
      <p className="lg-step-lead">Enviamos un código de 6 dígitos al número terminado en <strong>••78</strong>. Vence en 5 minutos.</p>
      <Otp onComplete={setReady} />
      <label className="lg-check"><input type="checkbox" defaultChecked /> <span>Confiar en este dispositivo por 30 días</span></label>
      <button type="submit" className="lg-btn lg-btn-primary">{ready ? 'Confirmar e ingresar' : 'Ingresar'} <IconArrow /></button>
      <p className="lg-resend">¿No llegó? <button type="button" className="lg-link">Reenviar código</button> · <button type="button" className="lg-link">Recibirlo por correo</button></p>
    </form>
  )
}

const ClaveUnicaButton = ({ onLogin }) => (
  <button type="button" className="lg-btn lg-btn-cu" onClick={onLogin}><IconId /> Entrar con Clave Única</button>
)
const DemoNote = () => <p className="lg-demo">Demo: cualquier dato ingresa a la Oficina Virtual con datos ficticios.</p>
const Notice = ({ children }) => children ? <p className="lg-notice" role="status"><IconLock /> {children}</p> : null

// =====================================================================
// A · Enfocado: una tarjeta centrada, sin distracciones
// =====================================================================
function LoginA({ onLogin, notice }) {
  const [rut, setRut] = useState('')
  const [pw, setPw] = useState('')
  const [stage, setStage] = useState('cred')
  return (
    <section className="lg lg-a" aria-labelledby="lg-a-title">
      <div className="lg-a-deco" aria-hidden="true"><i /><i /><i /></div>
      <div className="lg-a-card">
        <img className="lg-logo" src="/assets/survias-logo.png" alt="Survías Maule Ñuble" width="287" height="176" />
        {stage === 'cred' ? (
          <form className="lg-form" onSubmit={(e) => { e.preventDefault(); setStage('otp') }}>
            <h1 id="lg-a-title" className="lg-title">Ingresa a tu Oficina Virtual</h1>
            <p className="lg-lead">Consulta tus tránsitos, paga y gestiona tu TAG en un solo lugar.</p>
            <Notice>{notice}</Notice>
            <RutField value={rut} onChange={setRut} autoFocus />
            <PasswordField value={pw} onChange={setPw} />
            <button type="submit" className="lg-btn lg-btn-primary">Ingresar <IconArrow /></button>
            <div className="lg-or"><span>o</span></div>
            <ClaveUnicaButton onLogin={onLogin} />
            <p className="lg-alt">¿Primera vez? <a href={href('registro')}>Crea tu cuenta</a></p>
          </form>
        ) : <><span id="lg-a-title" className="sr-only">Verificación</span><OtpStep onLogin={onLogin} onBack={() => setStage('cred')} /></>}
        <DemoNote />
      </div>
      <ul className="lg-a-trust">
        <li><IconLock /> Conexión cifrada</li>
        <li><IconPhone /> Verificación en dos pasos</li>
        <li><IconCheck /> Nunca pedimos tu clave por teléfono</li>
      </ul>
    </section>
  )
}

// =====================================================================
// B · Paso a paso: una pregunta por pantalla, sin contraseña por defecto
// =====================================================================
function LoginB({ onLogin, notice }) {
  const [rut, setRut] = useState('')
  const [pw, setPw] = useState('')
  const [stage, setStage] = useState('rut') // rut → method → otp | password
  const step = stage === 'rut' ? 1 : stage === 'method' ? 2 : 3
  return (
    <section className="lg lg-b" aria-labelledby="lg-b-title">
      <div className="lg-b-main">
        <div className="lg-b-inner">
          <div className="lg-b-progress" role="img" aria-label={'Paso ' + step + ' de 3'}>{[1, 2, 3].map((n) => <i key={n} className={n <= step ? 'on' : ''} />)}<span>Paso {step} de 3</span></div>

          {stage === 'rut' && (
            <form className="lg-form" onSubmit={(e) => { e.preventDefault(); setStage('method') }}>
              <h1 id="lg-b-title" className="lg-title lg-title-xl">¿Cuál es tu RUT?</h1>
              <p className="lg-lead">Con él encontramos tu convenio. No necesitas recordar nada más por ahora.</p>
              <Notice>{notice}</Notice>
              <RutField value={rut} onChange={setRut} autoFocus big />
              <button type="submit" className="lg-btn lg-btn-primary">Continuar <IconArrow /></button>
              <p className="lg-alt">¿Primera vez? <a href={href('registro')}>Crea tu cuenta</a></p>
            </form>
          )}

          {stage === 'method' && (
            <div className="lg-form">
              <button type="button" className="lg-back" onClick={() => setStage('rut')}><IconBack /> {rut || 'Cambiar RUT'}</button>
              <h1 id="lg-b-title" className="lg-title lg-title-xl">Hola de nuevo.<br />¿Cómo quieres entrar?</h1>
              <div className="lg-methods">
                <button type="button" className="lg-method is-recommended" onClick={() => setStage('otp')}>
                  <span className="lg-method-icon"><IconPhone /></span>
                  <span className="lg-method-copy"><strong>Código por SMS</strong><small>Al celular terminado en ••78. Sin contraseña.</small></span>
                  <span className="lg-method-tag">Recomendado</span>
                </button>
                <button type="button" className="lg-method" onClick={onLogin}>
                  <span className="lg-method-icon"><IconId /></span>
                  <span className="lg-method-copy"><strong>Clave Única</strong><small>Te llevamos al sitio del Estado y vuelves con la sesión iniciada.</small></span>
                  <IconArrow />
                </button>
                <button type="button" className="lg-method" onClick={() => setStage('password')}>
                  <span className="lg-method-icon"><IconKey /></span>
                  <span className="lg-method-copy"><strong>Contraseña</strong><small>La que creaste al registrarte.</small></span>
                  <IconArrow />
                </button>
              </div>
            </div>
          )}

          {stage === 'otp' && <><span id="lg-b-title" className="sr-only">Verificación</span><OtpStep onLogin={onLogin} onBack={() => setStage('method')} /></>}

          {stage === 'password' && (
            <form className="lg-form" onSubmit={(e) => { e.preventDefault(); setStage('otp') }}>
              <button type="button" className="lg-back" onClick={() => setStage('method')}><IconBack /> Volver</button>
              <h1 id="lg-b-title" className="lg-title lg-title-xl">Escribe tu contraseña</h1>
              <p className="lg-lead">Después te pediremos un código solo si entras desde un dispositivo nuevo.</p>
              <PasswordField value={pw} onChange={setPw} autoFocus />
              <button type="submit" className="lg-btn lg-btn-primary">Ingresar <IconArrow /></button>
            </form>
          )}
          <DemoNote />
        </div>
      </div>
      <aside className="lg-b-side" aria-label="Qué encontrarás al ingresar">
        <p className="lg-b-eyebrow">Tu cuenta, de un vistazo</p>
        <h2>Todo lo de tu convenio en una sola pantalla.</h2>
        <div className="lg-b-preview" aria-hidden="true">
          <div className="lg-b-tile lg-b-tile-main"><span>Deuda vigente</span><strong>$9.900</strong><em>3 tránsitos sin facturar</em><b>Pagar ahora</b></div>
          <div className="lg-b-tile"><span>Tránsitos del mes</span><strong>7</strong></div>
          <div className="lg-b-tile"><span>TAG</span><strong className="ok">Activo</strong></div>
        </div>
        <ul className="lg-b-list">
          <li><ServiceIcon type="payment" /> Paga y factura tus tránsitos</li>
          <li><ServiceIcon type="car" /> Administra vehículos y TAG</li>
          <li><ServiceIcon type="bill" /> Descarga boletas y comprobantes</li>
        </ul>
        <p className="lg-b-foot">Ejemplo con datos ficticios.</p>
      </aside>
    </section>
  )
}

// =====================================================================
// C · Inmersivo: la ruta a pantalla completa y un panel translúcido
// =====================================================================
function LoginC({ onLogin, notice }) {
  const [rut, setRut] = useState('')
  const [pw, setPw] = useState('')
  const [tab, setTab] = useState('clave')
  const [stage, setStage] = useState('cred')
  return (
    <section className="lg lg-c" aria-labelledby="lg-c-title">
      <img className="lg-c-photo" src="/assets/access-login.webp" alt="" width="2048" height="1152" />
      <div className="lg-c-shade" aria-hidden="true" />
      <div className="lg-c-stage">
        <div className="lg-c-glass">
          {stage === 'cred' ? (
            <>
              <p className="lg-c-eyebrow">Oficina Virtual Survías</p>
              <h1 id="lg-c-title" className="lg-title">Bienvenido de vuelta</h1>
              <Notice>{notice}</Notice>
              <div className="lg-tabs" role="tablist" aria-label="Forma de ingreso">
                <button type="button" role="tab" aria-selected={tab === 'clave'} className={tab === 'clave' ? 'on' : ''} onClick={() => setTab('clave')}>RUT y contraseña</button>
                <button type="button" role="tab" aria-selected={tab === 'cu'} className={tab === 'cu' ? 'on' : ''} onClick={() => setTab('cu')}>Clave Única</button>
              </div>
              {tab === 'clave' ? (
                <form className="lg-form" onSubmit={(e) => { e.preventDefault(); setStage('otp') }}>
                  <RutField value={rut} onChange={setRut} autoFocus />
                  <PasswordField value={pw} onChange={setPw} />
                  <button type="submit" className="lg-btn lg-btn-primary">Ingresar <IconArrow /></button>
                </form>
              ) : (
                <div className="lg-form">
                  <p className="lg-lead">Usa la clave del Estado. Te llevamos a su sitio y vuelves con la sesión iniciada, sin crear otra contraseña.</p>
                  <ClaveUnicaButton onLogin={onLogin} />
                </div>
              )}
              <p className="lg-alt">¿Primera vez? <a href={href('registro')}>Crea tu cuenta</a></p>
            </>
          ) : <><span id="lg-c-title" className="sr-only">Verificación</span><OtpStep onLogin={onLogin} onBack={() => setStage('cred')} /></>}
          <DemoNote />
        </div>
        <nav className="lg-c-quick" aria-label="Gestiones sin iniciar sesión">
          <span>¿Solo necesitas resolver algo rápido?</span>
          <a href={href('sin-tag')}><ServiceIcon type="car" /> Pasé sin TAG</a>
          <a href={href('tarifas')}><ServiceIcon type="calculator" /> Calcular tarifa</a>
          <a href={href('ruta')}><ServiceIcon type="route" /> Estado de ruta</a>
        </nav>
      </div>
    </section>
  )
}

// =====================================================================
// Pantalla de ingreso
// =====================================================================
export default function LoginScreen({ route, onLogin, notice }) {
  const fromRoute = route.startsWith('login/') ? route.slice(6) : null
  const variant = KEYS.includes(fromRoute) ? fromRoute : 'actual'
  const View = variant === 'a' ? LoginA : variant === 'b' ? LoginB : variant === 'c' ? LoginC : LoginActual
  return <View key={variant} onLogin={onLogin} notice={notice} />
}
