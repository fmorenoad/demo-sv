import { useEffect, useState } from 'react'

// Piezas de interfaz reutilizadas por todas las pantallas.

export function Page({ title, subtitle, actions, children }) {
  return (
    <div className="wrap">
      <div className="section page-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="muted small" style={{ marginTop: 4 }}>{subtitle}</p>}
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </div>
      {children}
    </div>
  )
}

export function Card({ title, right, children, tight, style, className = '' }) {
  return (
    <div className={'card ' + className} style={style}>
      {(title || right) && (
        <div className="card-head">
          {title && <h3>{title}</h3>}
          {right}
        </div>
      )}
      <div className={'card-body' + (tight ? ' tight' : '')}>{children}</div>
    </div>
  )
}

export function Tile({ k, v, sub, tone }) {
  return (
    <div className={'tile' + (tone ? ' ' + tone : '')}>
      <div className="k">{k}</div>
      <div className="v">{v}</div>
      {sub && <div className="xsmall muted" style={{ marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

export function Badge({ tone = 'info', children, dot }) {
  return (
    <span className={'badge ' + tone}>
      {dot && <span className={'dot ' + tone} />}
      {children}
    </span>
  )
}

export function Field({ label, hint, children }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
      {hint && <div className="xsmall muted" style={{ marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

export function Steps({ steps, current }) {
  return (
    <div className="steps">
      {steps.map((s, i) => {
        const n = i + 1
        const cls = n < current ? 'done' : n === current ? 'active' : ''
        return (
          <span key={s} style={{ display: 'contents' }}>
            <div className={'step ' + cls}><span className="n">{n < current ? '✓' : n}</span> {s}</div>
            {i < steps.length - 1 && <span className="sep" />}
          </span>
        )
      })}
    </div>
  )
}

export function Alert({ tone = 'info', title, children, action }) {
  return (
    <div className={'alert ' + tone}>
      <div style={{ flex: 1 }}>
        {title && <strong style={{ display: 'block', marginBottom: 2 }}>{title}</strong>}
        <div className="small">{children}</div>
      </div>
      {action}
    </div>
  )
}

export function Toggle({ checked, onChange, label, hint }) {
  return (
    <label className="toggle-row">
      <span>
        <span className="toggle-label">{label}</span>
        {hint && <span className="xsmall muted" style={{ display: 'block' }}>{hint}</span>}
      </span>
      <button type="button" role="switch" aria-checked={checked} className={'switch' + (checked ? ' on' : '')} onClick={() => onChange(!checked)}>
        <span className="knob" />
      </button>
    </label>
  )
}

export function Toast({ msg, onDone }) {
  useEffect(() => {
    if (!msg) return
    const t = setTimeout(onDone, 3200)
    return () => clearTimeout(t)
  }, [msg, onDone])
  if (!msg) return null
  return <div className="toast" role="status">{msg}</div>
}

// Modal de verificación con código: simula la autenticación reforzada para cambios sensibles.
export function VerifyModal({ open, title = 'Confirma con tu código', channel = 'correo registrado', onCancel, onConfirm }) {
  const [code, setCode] = useState('')
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p className="small muted" style={{ margin: '6px 0 14px' }}>
          Enviamos un código de 6 dígitos a tu {channel}. Vence en 5 minutos.
        </p>
        <Field label="Código de verificación">
          <input className="input code" inputMode="numeric" maxLength={6} placeholder="••••••" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} />
        </Field>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn ghost" onClick={onCancel}>Cancelar</button>
          <button className="btn primary" disabled={code.length < 6} onClick={() => { setCode(''); onConfirm() }}>Confirmar</button>
        </div>
        <p className="xsmall muted" style={{ marginTop: 10 }}>Demo: cualquier código de 6 dígitos es válido.</p>
      </div>
    </div>
  )
}

export function MockNote({ children }) {
  return <div className="mock-note">{children}</div>
}

export function Empty({ children }) {
  return <div className="empty">{children}</div>
}
