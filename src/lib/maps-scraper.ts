// Google Maps Places API ile firma bulma

export interface PlaceResult {
  name: string
  website?: string
  phone?: string
  address?: string
  city: string
  district?: string
  sector: string
  place_id: string
}

const SECTOR_KEYWORDS: Record<string, string> = {
  dis_klinigi: 'diş kliniği',
  restoran: 'restoran',
  avukat: 'avukat',
  guzellik: 'güzellik salonu',
  insaat: 'inşaat firması',
  oto_galeri: 'oto galeri',
  otel: 'otel',
  veteriner: 'veteriner',
  muhasebe: 'muhasebe bürosu',
  saglik: 'klinik',
}

export async function searchPlaces(
  city: string,
  district: string,
  sector: string,
  maxResults = 10
): Promise<PlaceResult[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey || apiKey === 'buraya_google_maps_api_key_yaz') {
    throw new Error('GOOGLE_MAPS_API_KEY ayarlanmamış')
  }

  const keyword = SECTOR_KEYWORDS[sector] || sector
  const query = `${keyword} ${district} ${city}`

  // Text Search API
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}&language=tr`

  const res = await fetch(searchUrl)
  const text = await res.text()

  let data: { status: string; error_message?: string; results?: unknown[] }
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(`Google Maps JSON hatası: ${text.slice(0, 200)}`)
  }

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Google Maps API hatası: ${data.status} — ${data.error_message || ''}`)
  }

  interface RawPlace { name: string; formatted_address: string; place_id: string; website?: string; formatted_phone_number?: string }
  const results = (data.results as RawPlace[] || []).slice(0, maxResults)

  // Detay çekimi YOK — sadece text search sonuçları (timeout önlemek için)
  const places: PlaceResult[] = results.map(place => ({
    name: place.name,
    website: place.website,
    phone: place.formatted_phone_number,
    address: place.formatted_address,
    city,
    district,
    sector,
    place_id: place.place_id,
  }))

  return places
}
