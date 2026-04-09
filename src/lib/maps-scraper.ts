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

  const places: PlaceResult[] = []

  for (const place of (data.results || []).slice(0, maxResults)) {
    // Detay bilgisi al (website ve telefon için)
    const detail = await getPlaceDetail(place.place_id, apiKey)

    places.push({
      name: place.name,
      website: detail.website,
      phone: detail.phone,
      address: place.formatted_address,
      city,
      district,
      sector,
      place_id: place.place_id,
    })
  }

  return places
}

async function getPlaceDetail(placeId: string, apiKey: string) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=website,formatted_phone_number&key=${apiKey}&language=tr`
  const res = await fetch(url)
  const data = await res.json()
  return {
    website: data.result?.website,
    phone: data.result?.formatted_phone_number,
  }
}
