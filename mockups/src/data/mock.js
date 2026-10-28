// Datos ficticios compartidos por las dos demos.
// Patentes, nombres, RUT y montos son de ejemplo. Los pórticos (Rio Claro, Retiro)
// y la tarifa de categoría 1 ($3.300) coinciden con lo observado en el portal real en 2026.

export const USER = {
  nombre: 'María',
  apellidos: 'Pérez Soto',
  nombreCompleto: 'María Pérez Soto',
  rut: '12.345.678-9',
  email: 'maria.perez@ejemplo.cl',
  telefono: '+56 9 1234 5678',
  convenio: '0040012345678001',
  tipoConvenio: 'RNUT',
  direccion: { calle: 'Avenida San Miguel', numero: '2450', depto: '', region: 'Región del Maule', comuna: 'Talca', detalle: '' },
}

export const CONVENIOS = [
  { id: '0040012345678001', tipo: 'RNUT', label: '0040012345678001 - RNUT' },
  { id: '0040012345678002', tipo: 'TAG', label: '0040012345678002 - TAG' },
]

export const VEHICULOS = [
  { patente: 'ABCD12', tipo: 'Auto', marca: 'Toyota', modelo: 'Corolla', anio: 2021, tag: 'Activo', tagId: 'TAG-00481233', cat: 1 },
  { patente: 'EFGH34', tipo: 'Camioneta', marca: 'Ford', modelo: 'Ranger', anio: 2019, tag: 'Activo', tagId: 'TAG-00481234', cat: 1 },
  { patente: 'JKLM56', tipo: 'Auto', marca: 'Hyundai', modelo: 'Accent', anio: 2023, tag: 'Pendiente de instalación', tagId: '—', cat: 1 },
]

export const PORTICOS = [
  { id: 'rio-claro', nombre: 'Rio Claro', km: 'km 212', sentido: ['NS', 'SN'] },
  { id: 'retiro', nombre: 'Retiro', km: 'km 326', sentido: ['NS', 'SN'] },
]

// Tarifas por categoría (categoría 1 observada en el portal; el resto son valores de ejemplo).
export const TARIFAS = [
  { cat: 1, nombre: 'Autos y camionetas', normal: 3300, punta: 3900 },
  { cat: 2, nombre: 'Autos con remolque / buses 2 ejes', normal: 6600, punta: 7800 },
  { cat: 3, nombre: 'Camiones 2 ejes', normal: 6600, punta: 7800 },
  { cat: 4, nombre: 'Camiones y buses 3 o más ejes', normal: 9900, punta: 11700 },
  { cat: 5, nombre: 'Motocicletas', normal: 1000, punta: 1200 },
]

export const TRANSITOS = [
  { id: 1, patente: 'ABCD12', fecha: '21-10-2026', hora: '08:12', portico: 'Rio Claro NS', cat: 1, monto: 3300, estado: 'No facturado' },
  { id: 2, patente: 'ABCD12', fecha: '21-10-2026', hora: '19:40', portico: 'Rio Claro SN', cat: 1, monto: 3300, estado: 'No facturado' },
  { id: 3, patente: 'EFGH34', fecha: '19-10-2026', hora: '09:05', portico: 'Retiro NS', cat: 1, monto: 3300, estado: 'No facturado' },
  { id: 4, patente: 'ABCD12', fecha: '14-10-2026', hora: '18:23', portico: 'Rio Claro SN', cat: 1, monto: 3300, estado: 'Facturado' },
  { id: 5, patente: 'EFGH34', fecha: '11-10-2026', hora: '16:40', portico: 'Retiro SN', cat: 1, monto: 3300, estado: 'Facturado' },
  { id: 6, patente: 'EFGH34', fecha: '11-10-2026', hora: '07:55', portico: 'Retiro NS', cat: 1, monto: 3300, estado: 'Facturado' },
  { id: 7, patente: 'ABCD12', fecha: '03-10-2026', hora: '17:38', portico: 'Rio Claro NS', cat: 1, monto: 3300, estado: 'Facturado' },
  { id: 8, patente: 'JKLM56', fecha: '28-09-2026', hora: '12:10', portico: 'Rio Claro SN', cat: 1, monto: 3300, estado: 'Facturado' },
  { id: 9, patente: 'ABCD12', fecha: '22-09-2026', hora: '16:56', portico: 'Rio Claro SN', cat: 1, monto: 3300, estado: 'Facturado' },
  { id: 10, patente: 'EFGH34', fecha: '15-09-2026', hora: '21:55', portico: 'Retiro NS', cat: 1, monto: 3300, estado: 'Facturado' },
]

export const DOCUMENTOS = [
  { tipo: 'BE', tipoLabel: 'Boleta electrónica', nro: '10652331', fecha: '23-09-2026', monto: 13200, pagado: true, fechaPago: '25-09-2026', medio: 'Webpay · Débito' },
  { tipo: 'BE', tipoLabel: 'Boleta electrónica', nro: '10302596', fecha: '22-08-2026', monto: 9900, pagado: true, fechaPago: '22-08-2026', medio: 'PAC · Banco' },
  { tipo: 'BE', tipoLabel: 'Boleta electrónica', nro: '8374219', fecha: '28-07-2026', monto: 16500, pagado: true, fechaPago: '30-07-2026', medio: 'Webpay · Crédito' },
  { tipo: 'FE', tipoLabel: 'Factura electrónica', nro: '4471', fecha: '26-06-2026', monto: 6600, pagado: true, fechaPago: '26-06-2026', medio: 'Transferencia' },
  { tipo: 'BE', tipoLabel: 'Boleta electrónica', nro: '2510609', fecha: '23-05-2026', monto: 9900, pagado: true, fechaPago: '28-05-2026', medio: 'Webpay · Débito' },
]

// Gasto mensual (últimos 6 meses) para el gráfico del resumen.
export const GASTO_MENSUAL = [
  { mes: 'May', monto: 9900 },
  { mes: 'Jun', monto: 6600 },
  { mes: 'Jul', monto: 16500 },
  { mes: 'Ago', monto: 9900 },
  { mes: 'Sep', monto: 13200 },
  { mes: 'Oct', monto: 9900 },
]

export const REQUERIMIENTOS = [
  { folio: 'REQ-2026-04512', fecha: '15-10-2026', materia: 'Cobro duplicado pórtico Rio Claro', estado: 'Respondido', actualizado: '20-10-2026', canal: 'Oficina Virtual', respuesta: 'Se verificó el tránsito del 03-10-2026. Corresponde a dos pasos distintos (NS 17:38 y SN 19:02). Se adjunta detalle con fotografías de pórtico.', adjunto: 'Respuesta-REQ-2026-04512.pdf' },
  { folio: 'REQ-2026-04390', fecha: '02-10-2026', materia: 'Solicitud de TAG para patente JKLM56', estado: 'En revisión', actualizado: '18-10-2026', canal: 'Asistente virtual', respuesta: null, adjunto: null, pendiente: 'Falta adjuntar padrón del vehículo.' },
  { folio: 'REQ-2026-03877', fecha: '12-08-2026', materia: 'Cambio de dirección del convenio', estado: 'Cerrado', actualizado: '13-08-2026', canal: 'Call center 600 006 2030', respuesta: 'Dirección actualizada según lo solicitado.', adjunto: null },
]

export const CHATS = [
  { id: 'CH-7781', fecha: '18-10-2026 09:14', tema: 'Explicación de cobro del 14-10', resumen: 'La persona consultó por el cobro de $3.300 del 14-10-2026. El asistente explicó el pórtico (Rio Claro SN), la categoría y el horario. No se generó requerimiento.', derivado: false },
  { id: 'CH-7702', fecha: '02-10-2026 18:40', tema: 'TAG para vehículo nuevo', resumen: 'La persona pidió un TAG para la patente JKLM56. El asistente preparó la solicitud y la derivó a un ejecutivo con folio REQ-2026-04390.', derivado: true, folio: 'REQ-2026-04390' },
]

export const TRABAJOS = [
  { id: 1, cuando: '27–29 oct', titulo: 'Repavimentación km 182–188', detalle: 'Pista derecha cerrada, 22:00–06:00. Desvío señalizado.', tramo: 'Talca – San Javier', efecto: 'Reducción a una pista' },
  { id: 2, cuando: '31 oct', titulo: 'Inspección de puente río Maule', detalle: 'Reducción a una pista, 10:00–14:00.', tramo: 'Talca – San Javier', efecto: 'Demoras de 5 a 10 minutos' },
  { id: 3, cuando: '3–7 nov', titulo: 'Mantención de pórtico Retiro', detalle: 'Trabajos nocturnos en bermas, 23:00–05:00. Sin corte de pista.', tramo: 'Parral – Chillán', efecto: 'Velocidad reducida 60 km/h' },
]

export const INCIDENTES = [
  { id: 1, hora: '12:40', tramo: 'Talca – San Javier', tipo: 'Trabajos', texto: 'Trabajos km 182–188, pista derecha cerrada.', nivel: 'warn' },
  { id: 2, hora: '12:25', tramo: 'San Javier – Parral', tipo: 'Tránsito normal', texto: 'Sin novedades.', nivel: 'ok' },
  { id: 3, hora: '12:10', tramo: 'Parral – Chillán', tipo: 'Tránsito normal', texto: 'Sin novedades. Neblina leve sector Retiro.', nivel: 'ok' },
]

export const TRAMOS = ['Talca – San Javier', 'San Javier – Parral', 'Parral – Chillán']

export const FAQ = [
  { q: '¿Qué pasa si pasé sin TAG?', a: 'Puedes regularizar el paso en la sección "Pasé sin TAG" ingresando tu patente. Si lo haces dentro del plazo, pagas la tarifa normal sin recargo.' },
  { q: '¿Cómo arriendo un TAG?', a: 'Regístrate en la Oficina Virtual con tu RUT y patente, elige el punto de retiro y agenda la instalación. También puedes solicitarlo por el asistente virtual.' },
  { q: '¿Quiénes tienen gratuidad lateral?', a: 'Residentes de comunas aledañas a los pórticos que acrediten domicilio y cumplan las condiciones del reglamento. La acreditación se realiza en la Oficina Virtual o en puntos de atención.' },
  { q: '¿Cuándo llega mi boleta?', a: 'La boleta se emite mensualmente y se envía al correo registrado. Puedes descargarla en Pagos y documentos.' },
  { q: '¿Cómo cambio mi correo o teléfono?', a: 'Entra a Mi cuenta en la Oficina Virtual. Por seguridad, te pediremos un código de verificación al correo o celular actual.' },
]

export const clp = (n) => '$' + Number(n).toLocaleString('es-CL')

export const REGIONES = [
  'Región de Arica y Parinacota', 'Región de Tarapacá', 'Región de Antofagasta', 'Región de Atacama', 'Región de Coquimbo',
  'Región de Valparaíso', 'Región Metropolitana', "Región del Libertador General Bernardo O'Higgins", 'Región del Maule',
  'Región de Ñuble', 'Región del Biobío', 'Región de La Araucanía', 'Región de Los Ríos', 'Región de Los Lagos',
  'Región de Aysén', 'Región de Magallanes',
]

export const COMUNAS = {
  'Región del Maule': ['Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael', 'Cauquenes', 'Chanco', 'Pelluhue', 'Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén', 'Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas'],
  'Región de Ñuble': ['Chillán', 'Bulnes', 'Chillán Viejo', 'El Carmen', 'Pemuco', 'Pinto', 'Quillón', 'San Ignacio', 'Yungay', 'Quirihue', 'Cobquecura', 'Coelemu', 'Ninhue', 'Portezuelo', 'Ranquil', 'Treguaco', 'San Carlos', 'Coihueco', 'Ñiquén', 'San Fabián', 'San Nicolás'],
}
