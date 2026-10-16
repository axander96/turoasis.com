import fs from 'node:fs'
import path from 'node:path'

const sourceDir = path.resolve('Documentos')
const output = path.resolve('tour-import.xml')
const files = fs.readdirSync(sourceDir).filter((file) => file.endsWith('.txt'))
const fieldKeys = {
  resumen: 'field_6ad2469ed42d2', precio: 'field_6ad2471cd42d4', fecha_salida: 'field_6ad24726d42d5', fecha_regreso: 'field_6ad24727d42d6', nivel_actividad: 'field_6ad24728d42d7', itinerario: 'field_6ad2472ad42d9', incluye: 'field_6ad2472bd42da', no_incluye: 'field_6ad2472cd42db', codigo_del_tour: 'field_6ad27af59a727', categoria: 'field_6ad27af69a729', duracion: 'field_6ad27af69a72a', tarifas: 'field_6ad27af79a72b', nota_de_precio: 'field_6ad27af79a72c', fechas_disponibles: 'field_6ad27af89a72e', tour_destacado: 'field_6ad27af99a72f', ocultar_de_la_web: 'field_6ad27af99a730',
}
const xml = (value) => String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
const cdata = (value) => `<![CDATA[${String(value || '').replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
const field = (key, value) => `<wp:postmeta><wp:meta_key>${xml(key)}</wp:meta_key><wp:meta_value>${cdata(value)}</wp:meta_value></wp:postmeta>`
const valueAfter = (text, label) => text.match(new RegExp(`${label}\\s*:\\s*(.+)`, 'i'))?.[1]?.trim() || ''
const section = (text, start, end) => { const from = text.search(new RegExp(start, 'i')); if (from < 0) return ''; const rest = text.slice(from).replace(new RegExp(`^${start}[^\\n]*\\n?`, 'i'), ''); const stop = rest.search(new RegExp(end, 'i')); return (stop < 0 ? rest : rest.slice(0, stop)).trim() }
const dateValue = (value) => { const match = value.match(/(\d{2})\/(\d{2})\/(\d{4})/); return match ? `${match[3]}${match[2]}${match[1]}` : '' }
const tourXml = files.map((file, index) => {
  const text = fs.readFileSync(path.join(sourceDir, file), 'utf8')
  const code = valueAfter(text, 'CODIGO TOUR')
  const title = valueAfter(text, 'NOMBRE TOUR').replace(/\s+/g, ' ').trim()
  const duration = valueAfter(text, 'DURACION TOUR')
  const summary = section(text, 'DESTACADO DEL TOUR', 'FECHA TOUR')
  const dates = [...text.matchAll(/DEL\s+(\d{2}\/\d{2}\/\d{4})\s+HASTA\s+(\d{2}\/\d{2}\/\d{4})/gi)].map((match) => `${match[1]} al ${match[2]}`).join('\n')
  const prices = { solo: valueAfter(text, 'SOLO USD'), double: text.match(/DOBLE USD\s*(\d+)/i)?.[1] || '', triple: text.match(/TRIPLE USD\s*(\d+)/i)?.[1] || '', children: text.match(/Niños 3-10 años USD\s*(\d+)/i)?.[1] || '' }
  const itinerary = section(text, 'ITINERARIO:', 'REVIEWS/RESENAS')
  const included = section(text, 'QUE ESTA INCLUIDO:', 'QUE NO ESTA INCLUIDO')
  const excluded = section(text, 'QUE NO ESTA INCLUIDO:', 'EXCURSIONES / ACTIVIDADES INCLUIDAS')
  const days = [...itinerary.matchAll(/(?:^|\n)DIA\s+(\d+)[^\n]*\n([\s\S]*?)(?=\nDIA\s+\d+|$)/gi)]
  const category = /SAMANA/i.test(title) ? 'Samaná' : /SUR PROFUNDO/i.test(title) ? 'Sur profundo' : /COSTA NORTE/i.test(title) ? 'Costa norte' : /COSTA ESTE/i.test(title) ? 'Costa este' : /MONTAÑAS|MONTANAS/i.test(title) ? 'Montañas y cultura' : /TODOS LOS TESOROS/i.test(title) ? 'República Dominicana' : 'Rodando con Javish'
  const meta = { resumen: summary, precio: prices.double, fecha_salida: dateValue(dates), fecha_regreso: dateValue(dates.split('\n')[0]?.split(' al ')[1] || ''), nivel_actividad: text.match(/NIVEL DE ACTIVIDAD:\s*(\d+)/i)?.[1] || '3', itinerario: itinerary, incluye: included, no_incluye: excluded, codigo_del_tour: code, categoria: category, duracion: duration, tarifas: `Solo US$ ${prices.solo}\\nDoble US$ ${prices.double}\\nTriple US$ ${prices.triple}\\nNiños US$ ${prices.children}`, nota_de_precio: 'por persona en ocupación doble', fechas_disponibles: dates, tour_destacado: /^RJ/i.test(code) ? '1' : '0', ocultar_de_la_web: '0' }
  days.forEach((day) => { meta[`dia_${day[1]}_titulo`] = day[0].split(',').slice(1).join(',').trim(); meta[`dia_${day[1]}_descripcion`] = day[2].trim() })
  const postMeta = Object.entries(meta).flatMap(([key, value]) => [`${field(key, value)}`, field(`_${key}`, fieldKeys[key] || '')]).join('')
  return `<item><title>${xml(title)}</title><dc:creator><![CDATA[admin]]></dc:creator><content:encoded>${cdata(summary)}</content:encoded><wp:post_name>${xml(title.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, ''))}</wp:post_name><wp:status>publish</wp:status><wp:post_type>tourtour</wp:post_type>${postMeta}</item>`
}).join('')
const document = `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0" xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:wp="http://wordpress.org/export/1.2/"><channel><title>Turoasis Tours</title><link>https://turoasis.com</link><description>Importación de tours Turoasis</description><wp:wxr_version>1.2</wp:wxr_version><language>es</language>${tourXml}</channel></rss>`
fs.writeFileSync(output, document)
console.log(`Generated ${files.length} tours in ${output}`)