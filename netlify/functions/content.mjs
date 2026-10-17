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
        read('tours', []),
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