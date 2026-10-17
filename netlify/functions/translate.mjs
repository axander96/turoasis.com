const cache = new Map()

const translateChunk = async (text) => {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|en`
  const response = await fetch(url)
  const data = await response.json()
  return data.responseData?.translatedText || text
}

const translateOne = async (text) => {
  if (!text.trim()) return text
  if (cache.has(text)) return cache.get(text)
  try {
    const chunks = text.length > 450 ? text.match(/.{1,430}(?:\s|$)/g) || [text] : [text]
    const translated = (await Promise.all(chunks.map(translateChunk))).join(' ').trim()
    cache.set(text, translated)
    return translated
  } catch {
    return text
  }
}

export default async (request) => {
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Método no permitido' }), { status: 405, headers: { 'content-type': 'application/json' } })
  try {
    const { texts = [] } = await request.json()
    const unique = [...new Set(texts.map((text) => String(text)))]
    const translations = await Promise.all(unique.slice(0, 60).map(translateOne))
    return new Response(JSON.stringify({ translations }), { headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=3600' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'No se pudo traducir' }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
