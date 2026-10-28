import { useEffect, useState } from 'react'

// Router mínimo por hash: #/inicio, #/ov/resumen, etc.
const read = (fallback) => {
  const r = decodeURIComponent(window.location.hash.replace(/^#\/?/, ''))
  return r || fallback
}

export function useHashRoute(fallback = 'inicio') {
  const [route, setRoute] = useState(() => read(fallback))
  useEffect(() => {
    const onChange = () => {
      setRoute(read(fallback))
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [fallback])
  return route
}

export const go = (r) => { window.location.hash = '/' + r }
export const href = (r) => '#/' + r
