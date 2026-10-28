import { useEffect, useState } from 'react'
import { useHashRoute, go } from './router.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import Footer from './components/Footer.jsx'
import Chatbot from './components/Chatbot.jsx'
import OvLayout from './components/OvLayout.jsx'

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

const PUBLIC_LIST = [['inicio', 'Inicio'], ['tarifas', 'Tarifas'], ['ruta', 'Estado de ruta'], ['tag', 'TAG'], ['sin-tag', 'Pasé sin TAG'], ['ayuda', 'Ayuda'], ['login', 'Login'], ['registro', 'Registro'], ['recuperar', 'Recuperar clave']]
const OV_LIST = [['ov/resumen', 'Resumen'], ['ov/convenio', 'Convenio'], ['ov/transitos', 'Tránsitos'], ['ov/pagos', 'Pagos y documentos'], ['ov/pagar', 'Pagar'], ['ov/repactar', 'Repactar'], ['ov/vehiculos', 'Vehículos y TAG'], ['ov/interacciones', 'Interacciones'], ['ov/suscripciones', 'Suscripciones'], ['ov/cuenta', 'Mi cuenta']]

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
    <>
      <div className="switcher">
        <span className="brand-tag">Propuesta digital</span>
        <button className={!session ? 'active' : ''} onClick={demoPublic}>Sitio público</button>
        <button className={session ? 'active' : ''} onClick={demoOv}>Oficina Virtual</button>
        <button className="map-btn" onClick={() => setShowMap((s) => !s)} aria-expanded={showMap}>{showMap ? 'Ocultar mapa' : 'Mapa de pantallas'}</button>
        <span className="hint">Demo Survías · datos de ejemplo</span>
      </div>
      {showMap && (
        <div className="sitemap">
          <div><div className="eyebrow">Sin sesión</div>{PUBLIC_LIST.map(([r, l]) => <a key={r} href={'#/' + r} className={route === r ? 'on' : ''} onClick={() => setSession(false)}>{l}</a>)}</div>
          <div><div className="eyebrow">Con sesión</div>{OV_LIST.map(([r, l]) => <a key={r} href={'#/' + r} className={route === r ? 'on' : ''} onClick={() => setSession(true)}>{l}</a>)}</div>
        </div>
      )}
      <div className="screen">
        <SiteHeader session={session && isOv} route={route} onLogout={logout} />
        {body}
        <Footer />
      </div>
      {route !== 'ayuda' && <Chatbot session={session && isOv} />}
    </>
  )
}

