import { useEffect, useRef, useState } from 'react'

const PROFILE = 'https://x.com/Ruta5Survias'
let widgetLoader
function loadWidget() {
  if (window.twttr?.widgets) return Promise.resolve(window.twttr)
  if (widgetLoader) return widgetLoader
  widgetLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    const timer = setTimeout(() => fail(), 12000)
    function fail() {
      clearTimeout(timer)
      script.remove()
      widgetLoader = undefined
      reject(new Error('X no disponible'))
    }
    script.onerror = fail
    script.onload = () => {
      clearTimeout(timer)
      if (window.twttr?.widgets) resolve(window.twttr)
      else fail()
    }
    document.head.appendChild(script)
  })
  return widgetLoader
}

export default function SocialFeed() {
  const container = useRef(null)
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState('loading')
  useEffect(() => {
    let cancelled = false
    const host = document.createElement('div')
    container.current.replaceChildren(host)
    setStatus('loading')
    const timer = setTimeout(() => {
      if (!cancelled) { setStatus('unavailable'); host.remove() }
    }, 15000)
    loadWidget().then((twitter) => {
      if (cancelled || !host.isConnected) return null
      return twitter.widgets.createTimeline(
        { sourceType: 'profile', screenName: 'Ruta5Survias' }, host,
        { height: 380, chrome: 'noheader nofooter noborders', lang: 'es', dnt: true, theme: 'light' }
      )
    }).then((element) => {
      if (cancelled || !host.isConnected) return
      clearTimeout(timer)
      setStatus(element ? 'ready' : 'unavailable')
    }).catch(() => {
      if (!cancelled) { clearTimeout(timer); setStatus('unavailable'); host.remove() }
    })
    return () => { cancelled = true; clearTimeout(timer); host.remove() }
  }, [attempt])

  return <section className="social-feed" aria-label="Publicaciones oficiales en X">
    <div className="social-heading"><div><p className="eyebrow">Canal oficial / X</p><h2>Survías en la ruta</h2></div><a href={PROFILE} target="_blank" rel="noopener noreferrer" className="text-link">@Ruta5Survias ↗</a></div>
    <p className="small muted">Publicaciones del perfil enlazado desde survias.cl.</p>
    <div className="social-status" role="status" aria-live="polite">
      {status === 'loading' && <p>Consultando publicaciones de X…</p>}
      {status === 'unavailable' && <><p>No fue posible mostrar las publicaciones aquí.</p><p className="small muted">Puedes revisarlas directamente en X. Esto no significa que no haya novedades.</p><button className="btn ghost sm" onClick={() => setAttempt((n) => n + 1)}>Volver a intentar</button></>}
    </div>
    <div ref={container} className="social-timeline" />
    <div className="social-bottom"><a className="text-link" href={PROFILE} target="_blank" rel="noopener noreferrer">Ver publicaciones en X <span aria-hidden="true">↗</span></a><p className="xsmall muted">La disponibilidad y el orden de las publicaciones dependen de X.</p></div>
  </section>
}
