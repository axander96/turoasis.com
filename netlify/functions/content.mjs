import { getStore } from '@netlify/blobs'

const store = () => getStore({ name: 'turoasis-content', consistency: 'strong' })
const jsonResponse = (body, options = {}) => new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json', ...(options.headers || {}) }, ...options })

const defaultHomepage = {
  hero: [{}, {}, {}],
  featured: {},
  activity: { title: '', text: '', levels: [{}, {}, {}, {}] },
  experiences: { title: '', text: '', cards: [{}, {}, {}, {}] },
  hotels: {},
  contact: {},
  footer: {},
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

    const body = await request.json()
    if (body.ping) return jsonResponse({ ok: true })
    if (body.homepage) await store().setJSON('homepage', body.homepage)
    if (Array.isArray(body.tours)) await store().setJSON('tours', body.tours)
    return jsonResponse({ ok: true, ...(body.homepage ? { homepage: body.homepage } : {}), ...(body.tours ? { tours: body.tours } : {}) })
  } catch (error) {
    return jsonResponse({ error: error.message || 'Error interno' }, { status: 500 })
  }
}