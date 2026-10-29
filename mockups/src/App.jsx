import { useEffect, useState } from 'react'
import { useHashRoute, go } from './router.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import Footer from './components/Footer.jsx'
import Chatbot from './components/Chatbot.jsx'
import OvLayout from './components/OvLayout.jsx'
import ServiceIcon from './components/ServiceIcon.jsx'

import Inicio from './screens/public/Inicio.jsx'
import Tarifas from './screens/public/Tarifas.jsx'
import EstadoRuta from './screens/public/EstadoRuta.jsx'
import Tag from './screens/public/Tag.jsx'
import SinTag from './screens/public/SinTag.jsx'
import Ayuda from './screens/public/Ayuda.jsx'
import { Login, Registro, Recuperar } from './screens/public/Acceso.jsx'

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

  const isOv = route.startsWith('ov/')
  useEffect(() => { if (isOv && !session) setSession(false) }, [isOv, session])

  const login = () => { setSession(true); go('ov/resumen') }
  const logout = () => { setSession(false); go('inicio') }
  const demoPublic = () => { setSession(false); go('inicio') }
  const demoOv = () => { setSession(true); go('ov/resumen') }

  let body
  if (route === 'login') {
    body = <Login onLogin={login} />
  } else if (isOv) {
    if (!session) {
      body = <Login onLogin={login} notice="Inicia sesión para entrar a la Oficina Virtual." />
    } else {
      const Screen = OV[route] || Resumen
      body = <OvLayout route={route}><Screen /></OvLayout>
    }
  } else {
    const Screen = PUBLIC[route] || Inicio
    body = <Screen />
  }

  return (
    <div className={'demo-app' + (route === 'inicio' ? ' home-demo' : '')}>
      <div className="switcher" role="region" aria-label="Navegación de la propuesta">
        <span className="brand-tag"><ServiceIcon type="route" />Propuesta digital</span>
        <button type="button" className={!session ? 'active' : ''} onClick={demoPublic} aria-pressed={!session}><ServiceIcon type="map" /><span>Sitio público</span></button>
        <button type="button" className={session ? 'active' : ''} onClick={demoOv} aria-pressed={session}><ServiceIcon type="shield" /><span>Oficina Virtual</span></button>
        <button type="button" className="map-btn" onClick={() => setShowMap((s) => !s)} aria-expanded={showMap} aria-controls="proposal-screen-map"><ServiceIcon type="map" /><span>{showMap ? 'Ocultar mapa' : 'Mapa de pantallas'}</span></button>
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
        <SiteHeader session={session && isOv} route={route} onLogout={logout} />
        {body}
        <Footer />
      </div>
      {route !== 'ayuda' && <Chatbot session={session && isOv} />}
    </div>
  )
}

