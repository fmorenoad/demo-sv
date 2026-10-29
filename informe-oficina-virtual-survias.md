# Informe técnico: Oficina Virtual SURVÍAS (oficina-virtual.survias.cl)

Fecha de revisión: 23 de octubre de 2026 (versiones de librerías verificadas el 26 de octubre de 2026)
Alcance: recorrido con una cuenta de prueba (convenio RNUT, 3 vehículos, sin deuda). No se ejecutaron descargas ni pagos, y no se revisó el portal SAU (sau.survias.cl), que es un sistema aparte.

---

## 1. Resumen ejecutivo

El portal es una aplicación Laravel clásica (PHP 7.4, Blade, jQuery, Bootstrap 5) con seis módulos de consulta orientados al titular de un convenio de TAG. Funciona y es estable, pero es esencialmente de **consulta**: el usuario puede ver tránsitos, descargar boletas, pagar su deuda mediante el flujo aparte "Pago fácil" y cambiar su contraseña. No puede facturar tránsitos, repactar, editar sus datos ni administrar vehículos desde el portal. El flujo de pago no se pudo recorrer porque la cuenta de prueba no tenía deuda.

Los hallazgos más relevantes:

- **PHP 7.4.33 sin soporte de seguridad** desde noviembre de 2022, expuesto en la cabecera `X-Powered-By`.
- **Ninguna cabecera de seguridad HTTP** (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
- **Bugs funcionales visibles**: monto "$ 0" en todas las boletas, filtro de tránsitos que no permite ver todos los vehículos, formulario de convenio deshabilitado sin botón de guardar, error JS en la página de registro, hoja de estilos de Select2 que responde 503.
- **Deuda de frontend**: unas 30 librerías JS cargadas en todas las páginas (incluido el login), Chart.js cargado y nunca usado, funciones de prueba y `console.log` en el bundle de producción.

---

## 2. Módulos detectados

| Módulo | Ruta | Qué hace | Estado |
|---|---|---|---|
| Login | `/` → POST `/login` | RUT + contraseña, reCAPTCHA v3 invisible | OK |
| Registro | `/registrate` | RUT, patente, celular, teléfono, email | Error JS (`fbq` no definido) |
| Recuperar contraseña | `/recuperar-contrasena` | RUT + email | OK |
| Resumen | `/oficina-virtual/inicio` | Carrusel, estado de deuda, tabla de vehículos | OK |
| Convenio | `/oficina-virtual/informacion-convenio` | Datos personales y dirección del convenio | Formulario 100 % deshabilitado, sin botón guardar |
| Tránsitos | `/oficina-virtual/detalle-transitos` | Filtro por tipo (todos / facturado / no facturado), rango de fechas, patente; descarga de detalle | Solo muestra un vehículo a la vez |
| Pagos y documentos | `/oficina-virtual/documentos/historico` y `/pago-de-documentos/ver-todos-los-documentos` | Estado de deuda, últimas boletas (BE), descarga PDF | Columna Monto siempre "$ 0" |
| Suscripciones | `/oficina-virtual/suscripciones/boleta-electronica` | Muestra si el convenio está suscrito a boleta por email | Solo informativo, no permite cambiar |
| Mi cuenta | `/oficina-virtual/mi-cuenta` | Datos de contacto (solo lectura) y cambio de contraseña | Teléfono y email no editables |
| Contacto | Enlace externo a `https://sau.survias.cl/login` | Portal de atención (SAU) | Requiere segundo login |
| Cambio de convenio | POST `/oficina-virtual/cambio-de-convenio` | Selector en la barra lateral | OK (cuenta con un solo convenio) |
| Salir | GET `/logout` | Cierra sesión | Funciona, pero por GET |

Capacidades presentes en el código pero no visibles en la interfaz (funciones en `public/js/scripts.js`): `simula_repactacion`, `valida_frm_repacta`, `set_total_pagar_abono`, `cardNumberMaxLength`, referencias a Webpay. Es probable que exista un flujo de pago y repactación que solo aparece cuando hay deuda. No se pudo verificar con esta cuenta.

---

## 3. Tecnologías

**Backend**
- Laravel (token `_token`, rutas en español, Laravel Mix con `scripts.js?id=hash`), sobre **PHP 7.4.33**.
- Sesión basada en cookies; sin API JSON expuesta al navegador, todo es server-side rendering con formularios POST.

**Frontend**
- jQuery, Bootstrap 5.1.3 (JS desde jsDelivr, CSS compilado dentro de `custom.css`, 519 KB).
- DataTables (paginación en cliente), Select2, Moment.js, daterangepicker, bootstrap-datepicker, FormValidation (es_CL), jquery.mask, jquery-rut, numeral.js, printThis, jquery.fileDownload, js.cookie, validate.js, Chart.js.
- Font Awesome 6 Pro (fuentes locales) y además el kit CDN `kit.fontawesome.com`, que respondió 503.

Versiones en uso, leídas de los propios archivos servidos por el portal (verificado el 26 de octubre de 2026):

| Librería | Versión | Año | Observación |
|---|---|---|---|
| jQuery | 1.12.4 | 2016 | 4 CVE de XSS conocidas (CVE-2015-9251, 2019-11358, 2020-11022, 2020-11023) |
| Moment.js | 2.14.1 | 2016 | CVE-2017-18214, 2022-24785, 2022-31129 |
| DataTables | 1.10.12 | 2016 | Anterior a parches de XSS |
| Select2 | 4.0.3 | 2016 | Depende de jQuery antiguo |
| Chart.js | 2.7.3 | 2018 | Cargado y sin uso |
| FormValidation | 0.8.1 | 2017 | Proyecto renombrado; sin soporte en esa versión |
| daterangepicker | 2.1.23 | 2017 | |
| Bootstrap CSS | 5.2.0 | 2022 | Embebido en `custom.css` |
| Bootstrap JS | 5.1.3 | 2021 | Desde CDN, sin SRI |

Actualizar jQuery a 3.7.x es la prioridad: es la base de casi todos los plugins y concentra las vulnerabilidades conocidas.
- Google Fonts (Roboto), Google Analytics 4 (G-SRRT11LH03), reCAPTCHA v3, snippet de Meta Pixel incompleto en registro.

**Rendimiento medido (página Convenio, conexión local)**
- TTFB ~400 ms, DOMContentLoaded ~665 ms, load ~725 ms. El servidor responde rápido; el peso está en el frontend.

---

## 4. Problemas detectados

### 4.1 Seguridad (prioridad alta)

1. **PHP 7.4 fin de vida.** Sin parches de seguridad desde 2022. Migrar a PHP 8.2+ y a una versión de Laravel con soporte (10 LTS o 11/12).
2. **Librerías frontend de 2016 con CVE conocidas.** jQuery 1.12.4, Moment 2.14.1, DataTables 1.10.12 y Select2 4.0.3 (ver tabla de versiones en la sección 3). La explotabilidad depende del uso que haga el portal de cada una, lo que no se verificó.
3. **Sin cabeceras de seguridad.** Faltan `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options` y `Referrer-Policy`. Se agregan con un middleware o en la configuración de Nginx/Apache.
4. **`X-Powered-By: PHP/7.4.33` expuesto.** Desactivar `expose_php`.
5. **Logout por GET.** Permite cerrar la sesión del usuario desde un sitio externo (CSRF de logout). Debe ser POST con token.
6. **Scripts de CDN sin Subresource Integrity.** Bootstrap desde jsDelivr y el kit de Font Awesome se cargan sin `integrity`.
7. **Descarga de boletas por `doc_tipo` + `doc_nro`.** Hay que confirmar en el backend que se valida que el documento pertenezca al convenio en sesión (riesgo de IDOR). No se probó con documentos de terceros.
8. **Sin segundo factor ni Clave Única.** El acceso depende solo de RUT + contraseña, y el RUT es un dato público.
9. **Analítica sin consentimiento.** GA4 y Meta Pixel se cargan antes de cualquier aviso. Con la Ley 21.719 de protección de datos personales (vigencia diciembre 2026) conviene revisar el banner de consentimiento y la política de privacidad.

### 4.2 Bugs funcionales (prioridad media)

1. **"Todos los documentos" muestra Monto "$ 0" en todas las boletas.** Error de mapeo de datos o campo no poblado desde el ERP.
2. **Filtro de tránsitos no permite ver todos los vehículos.** La opción "Seleccione" en patente devuelve exactamente lo mismo que la patente seleccionada por defecto. Un cliente con 3 vehículos tiene que hacer 3 consultas y no tiene totales.
3. **Formulario Convenio deshabilitado y sin botón.** Todos los campos están `disabled` y no hay submit, pero el formulario tiene `action` POST a la misma ruta y el JS tiene un endpoint `/generales/comunas/` para cargar comunas por región. Es código de edición muerto o incompleto.
4. **Listado de regiones ordenado alfabéticamente** ("Región I, II, III, IV, IX, Metropolitana, V, VI…"). Debe ordenarse por número o geográficamente.
5. **`ReferenceError: fbq is not defined`** en `/registrate`: el snippet del Meta Pixel llama a `fbq` sin haber cargado la librería.
6. **`/public/assets/css/select2.css` responde 503** en todas las páginas.
7. **Tabla de tránsitos con scroll horizontal en escritorio** (1568 px de ancho) por el wrapper de DataTables.
8. **Columna "Pagado" solo con ícono**, sin texto ni `aria-label`; la fecha de pago y el medio no se muestran.
9. **Tipo de documento "BE"** sin leyenda (Boleta Electrónica). Poco claro para el usuario final.

### 4.3 Experiencia de usuario y accesibilidad

1. **Móvil:** el menú lateral completo se apila sobre el contenido. En un teléfono el usuario debe desplazarse una pantalla entera para ver el resumen de cuenta en cada página. Conviene un off-canvas o menú colapsable.
2. **`user-scalable=no`** en el viewport impide hacer zoom (incumple WCAG 1.4.4).
3. **`<html>` sin atributo `lang`**, afecta lectores de pantalla y SEO.
4. **"Contacto" lleva a otro sistema con otro login** (SAU). Debería haber SSO o al menos un formulario de contacto embebido.
5. **Mi cuenta no permite editar teléfono ni email**, que son los datos que más cambian y los que se usan para recuperar la contraseña.
6. **Sin indicador de requisitos de contraseña** en el formulario de cambio.
7. **Rango de fechas por defecto de 4 años** en tránsitos; lo habitual es "último mes" con accesos rápidos.

### 4.4 Deuda técnica de frontend

1. **~30 archivos JS y 7 CSS cargados en cada página**, incluido el login, cuando la mayoría solo se usa en uno o dos módulos. Chart.js se carga y nunca se usa.
2. **`console.log` (9) y funciones de prueba** (`pruebavn`, `pruebava`) en el bundle de producción.
3. **Duplicidad de Font Awesome** (kit CDN + fuentes Pro locales).
4. **`custom.css` de 519 KB** con Bootstrap completo embebido; purgar CSS reduciría a una fracción.
5. **Sin bundler moderno** (Laravel Mix sin tree-shaking). Migrar a Vite, que es el estándar actual de Laravel.

---

## 5. Funcionalidades propuestas

Ordenadas por impacto para el cliente y esfuerzo estimado.

### Rápidas (días)
- **Totales en tránsitos**: suma por período, por vehículo y por pórtico, con la opción "Todas las patentes".
- **Exportar a CSV/Excel** además del PDF existente (el JS ya referencia CSV).
- **Edición de datos de contacto** (teléfono, email) con verificación por código.
- **Leyendas y textos**: "BE = Boleta electrónica", texto en columna Pagado, fecha y medio de pago.
- **Accesos rápidos de fechas**: último mes, últimos 3 meses, año en curso.

### Medianas (semanas)
- **Dashboard con gráficos**: gasto mensual, tránsitos por pórtico y por vehículo. Chart.js ya está cargado.
- **Gestión de vehículos**: solicitar alta/baja de patente, ver estado del TAG, reemplazo por pérdida o robo.
- **Pago en línea integrado a la Oficina Virtual** (hoy existe como flujo aparte, "Pago fácil"), siempre visible, con historial de pagos y comprobante descargable.
- **Suscripciones reales**: activar/desactivar boleta por email, alertas de deuda, alertas de tránsito por SMS/WhatsApp/email.
- **Pago automático (PAC/PAT)** con tarjeta o cuenta inscrita.
- **Notificaciones push / PWA** para instalar la oficina virtual como app en el teléfono.
- **Clave Única** como método de acceso alternativo, y 2FA opcional.

### Estratégicas (meses)
- **Integración con SAU**: SSO entre oficina virtual y portal de atención, estado de reclamos dentro del mismo portal.
- **Repactación en línea**: el código ya tiene `simula_repactacion`; exponerlo como simulador con cuotas e intereses.
- **Multi-convenio real**: resumen consolidado de deuda y tránsitos cuando el RUT tiene más de un convenio.
- **Asistente conversacional** (chat/WhatsApp) para consultas frecuentes: "¿cuánto debo?", "¿cuándo vence?", "manda mi última boleta".
- **Mapa de pórticos y tarifas** con cálculo de costo de un viaje.
- **API pública / Open Banking** para que apps de finanzas personales puedan leer los gastos en peajes.

---

## 6. Qué no se verificó

- Flujo de pago y repactación (la cuenta no tiene deuda).
- Descarga de PDF y detalle de tránsitos (no se ejecutaron descargas).
- Validación de autorización en `/descargar-boleta` (requiere pruebas con otro usuario).
- Comportamiento con varios convenios en un mismo RUT.
- Portal SAU.
