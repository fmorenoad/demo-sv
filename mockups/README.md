# Mockups · Survías — demos navegables

Prototipo React + Vite con **dos demos completas** del sitio propuesto en
*Propuesta de evolución digital segura para Survías*:

| Demo | Qué muestra | Pantallas |
|---|---|---|
| **Sin sesión** (sitio público) | Lo que ve cualquier persona sin cuenta | Inicio, Tarifas y simulador, Estado de ruta y avisos, TAG, Pasé sin TAG (flujo de pago público), Ayuda y asistente, Login (con 2FA y Clave Única), Registro, Recuperar contraseña |
| **Con sesión** (Oficina Virtual) | La cuenta de una titular ficticia con 3 vehículos y deuda pendiente | Resumen con gráfico, Convenio editable, Tránsitos con totales y exportación, Pagos y documentos, Pagar y facturar (4 pasos), Repactar (simulador), Vehículos y TAG, Mis interacciones comerciales (requerimientos y chats), Suscripciones y avisos, Mi cuenta (2FA, sesiones, datos personales) |

Los pagos y gestiones son simulados: no hay backend, pasarela ni envíos reales. La sección de X intenta cargar publicaciones reales mediante el widget oficial. Los flujos sí son
interactivos (pasos, formularios, verificación por código, toasts) para poder
demostrar la experiencia completa.

## Cómo navegar

- La **barra superior** cambia entre "Sitio público" y "Oficina Virtual",
  y el botón **Mapa de pantallas** lista todas las rutas.
- Dentro de cada demo la navegación es la del sitio: cabecera, menú lateral de la
  Oficina Virtual, botones y enlaces. "Ingresar" en el login abre la demo con sesión;
  "Salir" vuelve a la pública.
- Cada pantalla tiene su URL (`#/tarifas`, `#/ov/pagar`, …), así que se puede
  enlazar directamente a una pantalla en una presentación.
- El asistente flotante muestra un guion distinto según haya sesión o no.

## Landing editorial (demo aparte)

Segunda entrada del proyecto en `landing/index.html` → publicada en
**https://survias.iwan.cl/landing/**. Es una página única de estilo editorial
(bloques a sangre, tipografía display Bricolage Grotesque + IBM Plex Sans, listas
numeradas, tiles con flecha, ticker, testimonios sobre foto) con la paleta
corporativa Survías. Enlaza a las pantallas de la demo navegable. Código en
`src/landing/` (`Landing.jsx`, `landing.css`).

## Landing "de servicio" (segunda variante)

Tercera entrada en `landing2/index.html` → **https://survias.iwan.cl/landing2/**.
Inspirada en el template "TailWag Pet Boarding" de Lovable: cabecera blanca con
navegación en píldoras, hero a pantalla completa con foto y título centrado, tarjeta
de cifras superpuesta, galería en grilla, testimonios con miniatura de video,
tarjetas de servicio con precio, bloque de cierre y pie oscuro. Tipografía Plus
Jakarta Sans; paleta Survías. Código en `src/landing2/`.

## Correr el proyecto

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto http://localhost:5173).

Para una build de producción:

```bash
npm run build
npm run preview
```

## Estructura

```
src/
  main.jsx                 punto de entrada
  App.jsx                  barra de demos, router por hash, estado de sesión
  router.jsx               useHashRoute / go / href
  styles.css               design tokens (paleta Survías) + estilos
  data/mock.js             datos ficticios compartidos (titular, vehículos, tránsitos, documentos, tarifas, trabajos, requerimientos)
  components/
    SiteHeader.jsx         cabecera pública / privada
    Footer.jsx             pie con teléfonos de atención
    OvLayout.jsx           barra lateral de la Oficina Virtual (convenio + menú)
    Chatbot.jsx            widget del asistente (guion público / con sesión)
    ui.jsx                 Page, Card, Tile, Badge, Field, Steps, Alert, Toggle, Toast, VerifyModal
  screens/
    public/                Inicio, Tarifas, EstadoRuta, Tag, SinTag, Ayuda, Acceso (Login, Registro, Recuperar)
    ov/                    Resumen, Convenio, Transitos, Pagos, Pagar, Repactar, Interacciones, Suscripciones, Vehiculos, MiCuenta
```

## Datos

Todos los datos son ficticios (titular María Pérez Soto, RUT 12.345.678-9,
patentes ABCD12 / EFGH34 / JKLM56). Los pórticos Rio Claro y Retiro y la tarifa de
categoría 1 ($3.300) coinciden con lo observado en el portal real en 2026; el resto
de tarifas, tasas y plazos son valores de ejemplo y están marcados como tales en
cada pantalla.

## Personalización rápida

Los colores de marca están en `:root` dentro de `src/styles.css`
(`--brand`, `--accent`, `--navy` para el charcoal estructural, `--muted` para el
gris pizarra). Cambiarlos reajusta toda la identidad visual.

## Despliegue en survias.iwan.cl

El prototipo está publicado en **https://survias.iwan.cl** (servidor `imobility`,
64.176.20.254, nginx + Let's Encrypt, tras el proxy de Cloudflare de iwan.cl).
Sirve `dist/` desde `/var/www/survias.iwan.cl` con fallback a `index.html` y
cabecera `X-Robots-Tag: noindex` (no se indexa).

Para publicar una nueva versión:

```bash
npm run build && tar -C dist -czf - . | ssh imobility 'D=/var/www/survias.iwan.cl; mkdir -p $D.new && tar -C $D.new -xzf - && rm -rf $D.old; mv $D $D.old; mv $D.new $D && chown -R www-data:www-data $D && rm -rf $D.old'
```

Virtual host: `/etc/nginx/sites-available/survias.iwan.cl`. El certificado se renueva
solo con certbot.

