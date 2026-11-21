import { useEffect, useRef, useState } from 'react'
import { useHashRoute, go } from './router.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import Footer from './components/Footer.jsx'
import Chatbot from './components/Chatbot.jsx'
import OvLayout from './components/OvLayout.jsx'
import ServiceIcon from './components/ServiceIcon.jsx'
import TabBar from './components/TabBar.jsx'

import Inicio from './screens/public/Inicio.jsx'
import Tarifas from './screens/public/Tarifas.jsx'
import EstadoRuta from './screens/public/EstadoRuta.jsx'
import Tag from './screens/public/Tag.jsx'
import SinTag from './screens/public/SinTag.jsx'
import Ayuda from './screens/public/Ayuda.jsx'
import { Registro, Recuperar } from './screens/public/Acceso.jsx'
import LoginScreen from './screens/public/LoginVariants.jsx'

import Resumen from './screens/ov/Resumen.jsx'
import Convenio from './screens/ov/Convenio.jsx'
import Transitos from './screens/ov/Transitos.jsx'
import Pagos from './screens/ov/Pagos.jsx'
import Pagar from './screens/ov/Pagar.jsx'
import Repactar from './screens/ov/Repactar.jsx'
import Interacciones from './screens/ov/Interacciones.jsx'
import Suscripciones from './screens/ov/Suscripciones.jsx'
import Vehiculos from './screens/ov/Vehiculos.jsx'
import MiCuenta from './screens/ov/MiCuenta.jsx'

const PUBLIC = { inicio: Inicio, tarifas: Tarifas, ruta: EstadoRuta, tag: Tag, 'sin-tag': SinTag, ayuda: Ayuda, registro: Registro, recuperar: Recuperar }
const OV = { 'ov/resumen': Resumen, 'ov/convenio': Convenio, 'ov/transitos': Transitos, 'ov/pagos': Pagos, 'ov/pagar': Pagar, 'ov/repactar': Repactar, 'ov/interacciones': Interacciones, 'ov/suscripciones': Suscripciones, 'ov/vehiculos': Vehiculos, 'ov/cuenta': MiCuenta }

const PUBLIC_LIST = [['inicio', 'Inicio', 'roadworks'], ['tarifas', 'Tarifas', 'calculator'], ['ruta', 'Estado de ruta', 'route'], ['tag', 'TAG', 'tag'], ['sin-tag', 'Pasé sin TAG', 'car'], ['ayuda', 'Ayuda', 'status'], ['login', 'Login', 'shield'], ['registro', 'Registro', 'account'], ['recuperar', 'Recuperar clave', 'shield']]
const OV_LIST = [['ov/resumen', 'Resumen', 'status'], ['ov/convenio', 'Convenio', 'bill'], ['ov/transitos', 'Tránsitos', 'route'], ['ov/pagos', 'Pagos y documentos', 'bill'], ['ov/pagar', 'Pagar', 'payment'], ['ov/repactar', 'Repactar', 'calendar'], ['ov/vehiculos', 'Vehículos y TAG', 'car'], ['ov/interacciones', 'Interacciones', 'account'], ['ov/suscripciones', 'Suscripciones', 'calendar'], ['ov/cuenta', 'Mi cuenta', 'account']]

export default function App() {
  const route = useHashRoute('inicio')
  const [session, setSession] = useState(() => route.startsWith('ov/'))
  const [showMap, setShowMap] = useState(false)
  // Propuesta UX v2: se puede comparar con la versión actual desde la barra de la demo.
  const [ux2, setUx2] = useState(() => {
    try { return window.localStorage.getItem('survias-ux') !== 'v1' } catch { return true }
  })
  useEffect(() => {
    document.documentElement.classList.toggle('ux2', ux2)
    try { window.localStorage.setItem('survias-ux', ux2 ? 'v2' : 'v1') } catch { /* sin almacenamiento: solo en memoria */ }
  }, [ux2])

  // Propuesta v2: el asistente se retira al bajar por la página y vuelve al subir.
  useEffect(() => {
    let last = window.scrollY
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const y = window.scrollY
        if (Math.abs(y - last) < 12) return
        document.documentElement.dataset.scroll = y > last && y > 120 ? 'down' : 'up'
        last = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); delete document.documentElement.dataset.scroll }
  }, [])
  useEffect(() => { document.documentElement.dataset.scroll = 'up' }, [route])

  const isOv = route.startsWith('ov/')
  useEffect(() => { if (isOv && !session) setSession(false) }, [isOv, session])

  const login = () => { setSession(true); go('ov/resumen') }
  const logout = () => { setSession(false); go('inicio') }
  const demoPublic = () => { setSession(false); go('inicio') }
  const demoOv = () => { setSession(true); go('ov/resumen') }

  let body
  const isLogin = route === 'login' || route.startsWith('login/')
  // Pantallas de acceso: sin menú, con un botón para volver a la última página pública visitada.
  const isAccess = isLogin || route === 'registro' || route === 'recuperar' || (isOv && !session)
  const lastPublic = useRef('inicio')
  useEffect(() => { if (!isAccess && !isOv) lastPublic.current = route }, [route, isAccess, isOv])
  const goBack = () => go(isLogin || (isOv && !session) ? lastPublic.current : 'login')
  if (isLogin) {
    body = <LoginScreen route={route} onLogin={login} />
  } else if (isOv) {
    if (!session) {
      body = <LoginScreen route={route} onLogin={login} notice="Inicia sesión para entrar a la Oficina Virtual." />
    } else {
      const Screen = OV[route] || Resumen
      body = <OvLayout route={route}><Screen /></OvLayout>
    }
  } else {
    const Screen = PUBLIC[route] || Inicio
    body = <Screen />
  }

  return (
    <div className={'demo-app' + (route === 'inicio' ? ' home-demo' : '')} data-route={route} data-area={session && isOv ? 'ov' : 'public'}>
      <div className="switcher" role="region" aria-label="Navegación de la propuesta">
        <span className="brand-tag"><ServiceIcon type="route" />Propuesta digital</span>
        <button type="button" className={!session ? 'active' : ''} onClick={demoPublic} aria-pressed={!session}><ServiceIcon type="map" /><span>Sitio público</span></button>
        <button type="button" className={session ? 'active' : ''} onClick={demoOv} aria-pressed={session}><ServiceIcon type="shield" /><span>Oficina Virtual</span></button>
        <button type="button" className="map-btn" onClick={() => setShowMap((s) => !s)} aria-expanded={showMap} aria-controls="proposal-screen-map"><ServiceIcon type="map" /><span>{showMap ? 'Ocultar mapa' : 'Mapa de pantallas'}</span></button>
        <button type="button" className={'ux-toggle' + (ux2 ? ' on' : '')} onClick={() => setUx2((v) => !v)} aria-pressed={ux2} title="Compara la propuesta de mejora con la versión actual">
          <span className="ux-toggle-track" aria-hidden="true"><i /></span><span className="ux-toggle-long">{ux2 ? 'Propuesta v2' : 'Versión actual'}</span><span className="ux-toggle-short" aria-hidden="true">{ux2 ? 'v2' : 'v1'}</span>
        </button>
        <span className="hint"><ServiceIcon type="status" />Demo Survías · datos de ejemplo</span>
      </div>
      <div id="proposal-screen-map" className="sitemap" hidden={!showMap}>
        <nav aria-labelledby="proposal-public-heading">
          <h2 id="proposal-public-heading" className="eyebrow"><ServiceIcon type="account" />Sin sesión</h2>
          <div className="sitemap-links">{PUBLIC_LIST.map(([r, label, icon]) => <a key={r} href={'#/' + r} className={route === r ? 'on' : ''} aria-current={route === r ? 'page' : undefined} onClick={() => setSession(false)}><ServiceIcon type={icon} /><span>{label}</span></a>)}</div>
        </nav>
        <nav aria-labelledby="proposal-private-heading">
          <h2 id="proposal-private-heading" className="eyebrow"><ServiceIcon type="shield" />Con sesión</h2>
          <div className="sitemap-links">{OV_LIST.map(([r, label, icon]) => <a key={r} href={'#/' + r} className={route === r ? 'on' : ''} aria-current={route === r ? 'page' : undefined} onClick={() => setSession(true)}><ServiceIcon type={icon} /><span>{label}</span></a>)}</div>
        </nav>
      </div>
      <div className={'screen' + (route === 'inicio' ? ' home-shell' : '')}>
        <SiteHeader session={session && isOv} route={route} onLogout={logout} minimal={isAccess} onBack={goBack} />
        {body}
        <Footer />
      </div>
      {ux2 && !isAccess && <TabBar area={session && isOv ? 'ov' : 'public'} route={route} onLogout={logout} />}
      {route !== 'ayuda' && <Chatbot session={session && isOv} />}
    </div>
  )
}

