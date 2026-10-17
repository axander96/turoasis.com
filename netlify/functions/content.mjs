import { getStore } from '@netlify/blobs'

const store = () => getStore({ name: 'turoasis-content', consistency: 'strong' })
const jsonResponse = (body, options = {}) => new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json', ...(options.headers || {}) }, ...options })

const defaultHomepage = {
  catalog: { image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=85', eyebrow: 'EXCURSIONES', title: 'Viajes diseñados para descubrir el mundo.', text: 'Circuitos guiados por destinos auténticos, experiencias memorables y el acompañamiento de Turoasis.' },
  hero: [
    { image: '/bienvenidos-republica-dominicana.png', eyebrow: 'BIENVENIDOS A REPÚBLICA DOMINICANA', title: 'Bienvenidos a República Dominicana', text: 'Rodeada por el Océano Atlántico hacia el Norte y el Mar Caribe hacia el Sur, República Dominicana se enorgullece de contar con más de 1,600 Km. de costa y 400 Km. de las mejores playas del mundo, magníficos hoteles y resorts, e infinidad de opciones en deportes, entretenimiento y recreación.' },
    { image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=85', eyebrow: 'CARIBE SIN PRISA', title: 'El mar que te estaba esperando.', text: 'Playas de arena blanca, aguas transparentes y experiencias para descansar, descubrir y volver a conectar contigo.' },
    { image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2200&q=85', eyebrow: 'NATURALEZA DOMINICANA', title: 'Aventuras que se sienten.', text: 'Montañas, ríos y parques naturales para vivir el lado más auténtico y emocionante de la isla.' },
  ],
  featured: { label: 'El viaje que lo cambia todo', title: 'Rodando con Javish Samaná', code: 'RJ-009-SAMRD', text: 'Un Proyecto Turístico en colaboración con el Programa televisivo “Mi Pueblo Por Dentro” y el carismático Artista Javish Victoria (Conjunto Quisqueya).' },
  activity: {
    title: 'Viaja como te gusta viajar.', text: 'Cada experiencia tiene su propio ritmo. Selecciona un nivel para conocer qué puedes esperar de tu próximo tour.',
    levels: [
      { name: 'Relax', image: '/activity-relax.png', text: 'Ideal para descansar y disfrutar del destino a tu ritmo. Caminatas cortas y tiempo libre.' },
      { name: 'Suave', image: '/activity-suave.png', text: 'Incluye paseos tranquilos, algunas caminatas y actividades sencillas durante el día.' },
      { name: 'Activo', image: '/activity-activo.png', text: 'Para viajeros que disfrutan explorar. Caminatas largas, naturaleza y días con más movimiento.' },
      { name: 'Intenso', image: '/activity-intenso.png', text: 'Aventura para mantenerte en movimiento con rutas exigentes y experiencias al aire libre.' },
    ],
  },
  experiences: {
    title: 'Tu viaje, acompañado de principio a fin.', text: 'Somos una familia de viajeros apasionados. Te acompañamos desde la reserva hasta tu regreso a casa.',
    cards: [
      { title: 'Personal Tour Manager', text: 'Una persona contigo antes, durante y después de cada viaje.', image: '/experience-ptm.png' },
      { title: 'Rutas y conexiones', text: 'Encuentros locales, secretos de la naturaleza y momentos que no aparecen en una guía.', image: '/experience-routes.png' },
      { title: 'Mejores guías', text: 'Expertos que comparten la cultura dominicana en español e inglés.', image: '/experience-guides.png' },
      { title: 'Seguridad y confianza', text: 'Seguro de viaje y soporte integrado para disfrutar sin preocupaciones.', image: '/experience-safety.png' },
    ],
  },
  hotels: { eyebrow: 'HOTELES & RESORTS', title: 'Descansa donde comienza la experiencia.', text: 'Paquetes todo incluido, escapadas de fin de semana y soluciones para grupos en los principales destinos del país.', image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=85' },
  contact: { title: 'Hablemos de tu próximo viaje', text: 'Escríbenos y comencemos a diseñar esa experiencia que tienes pendiente.', whatsapp: 'https://wa.me/18098708595' },
  footer: { tagline: '¡Despierta donde la naturaleza te abraza!', address: 'Calle Don Pedro Diaz #10, Santiago, Dominican Republic, 51000', phone: '(809) 870-8595', email: 'info@turoasis.com', map: 'https://maps.app.goo.gl/bgxbcwT78AtiDq4J9' },
}

const defaultTours = [
  {
    id: 'rodando-con-javish-samana', code: 'RJ-009-SAMRD', category: 'Rodando con Javish', location: 'Samaná',
    title: 'Rodando con Javish Samaná', detail: '5 días / 4 noches', price: 'US$ 1,399', priceNote: 'por persona en ocupación doble',
    rateValues: { double: 'US$ 1,399', triple: 'US$ 1,299', children: 'US$ 1,050' }, dates: ['2027-03-07 al 2027-03-11'], activity: 3, featured: true,
    description: 'Una aventura por la península de Samaná con catamarán, Cayo Levantado, ballenas jorobadas, cultura local y una noche de gala con Javish Victoria y su grupo.',
    images: ['https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85'],
    included: ['Alojamiento seleccionado', 'Traslados y asistencia local', 'Experiencias destacadas del recorrido'], excluded: ['Boletos aéreos internacionales', 'Gastos personales'],
    itineraryDays: [{ title: 'Llegada y bienvenida', description: 'Recepción y comienzo de la experiencia en Samaná.' }, { title: 'Descubriendo el destino', description: 'Naturaleza, cultura y gastronomía local.' }],
  },
  {
    id: 'la-brillante-costa-norte', code: 'TO-006-CNRD', category: 'Costa norte', location: 'Puerto Plata',
    title: 'La brillante Costa Norte', detail: '6 días / 5 noches', price: 'US$ 1,499', priceNote: 'por persona en ocupación doble',
    rateValues: { double: 'US$ 1,499', triple: 'US$ 1,299', children: 'US$ 1,125' }, dates: ['2027-01-10 al 2027-01-15'], activity: 3,
    description: 'Puerto Plata, Cayo Arena, ámbar y playas del norte con el descanso final en un resort todo incluido.',
    images: ['https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&w=1200&q=85'],
    included: ['Alojamiento seleccionado', 'Traslados y asistencia local'], excluded: ['Boletos aéreos internacionales', 'Gastos personales'],
    itineraryDays: [{ title: 'Llegada a Puerto Plata', description: 'Instalación y bienvenida en el resort.' }, { title: 'Costa norte', description: 'Playas, ámbar y experiencias locales.' }],
  },
]

const read = async (key, fallback) => {
  const value = await store().get(key, { type: 'json' })
  return value ?? fallback
}

const authorized = (request) => {
  const expected = process.env.ADMIN_PASSWORD
  return expected && request.headers.get('x-admin-password') === expected
}

export default async (request) => {
  try {
    const mediaKey = new URL(request.url).searchParams.get('media')
    if (request.method === 'GET' && mediaKey) {
      const media = await store().get(mediaKey, { type: 'blob' })
      if (!media) return new Response('Not found', { status: 404 })
      return new Response(media, { headers: { 'cache-control': 'public, max-age=31536000, immutable' } })
    }
    if (request.method === 'GET') {
      const [homepage, tours] = await Promise.all([
        read('homepage', defaultHomepage),
        read('tours', defaultTours),
      ])
      return jsonResponse({ homepage, tours })
    }

    if (request.method !== 'POST' || !authorized(request)) {
      return jsonResponse({ error: 'No autorizado' }, { status: 401 })
    }

    if (request.headers.get('content-type')?.startsWith('multipart/form-data')) {
      const form = await request.formData()
      const file = form.get('file')
      if (!file || typeof file.arrayBuffer !== 'function') return jsonResponse({ error: 'Archivo no válido' }, { status: 400 })
      const safeName = String(file.name || 'image').replace(/[^a-z0-9._-]/gi, '-').toLowerCase()
      const key = `media/${crypto.randomUUID()}-${safeName}`
      await store().set(key, await file.arrayBuffer(), { metadata: { contentType: file.type || 'application/octet-stream' } })
      return jsonResponse({ url: `/api/content?media=${encodeURIComponent(key)}` })
    }

    const body = await request.json()
    if (body.ping) return jsonResponse({ ok: true })
    if (body.homepage) await store().setJSON('homepage', body.homepage)
    if (Array.isArray(body.tours)) await store().setJSON('tours', body.tours)
    return jsonResponse({ ok: true, ...(body.homepage ? { homepage: body.homepage } : {}), ...(body.tours ? { tours: body.tours } : {}) })
  } catch (error) {
    return jsonResponse({ error: error.message || 'Error interno' }, { status: 500 })
  }
}