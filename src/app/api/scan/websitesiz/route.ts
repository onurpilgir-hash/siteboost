import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'
import { searchPlaces } from '@/lib/maps-scraper'

export async function POST(req: NextRequest) {
  try {
    const { city, district, sector } = await req.json()

    if (!sector || !city) {
      return NextResponse.json({ error: 'Şehir ve sektör gerekli' }, { status: 400 })
    }

    const places = await searchPlaces(city, district || city, sector, 20)

    // Sadece websitesiz olanları filtrele
    const websiteless = places.filter(p => !p.website || p.website.trim() === '')

    if (websiteless.length === 0) {
      return NextResponse.json({ leads: [], message: 'Bu kriterlerde websitesiz firma bulunamadı' })
    }

    const supabase = createAdminSupabase()
    const insertedLeads = []

    for (const place of websiteless) {
      // Zaten kayıtlı mı kontrol et
      const { data: existing } = await supabase
        .from('leads')
        .select('id')
        .eq('name', place.name)
        .eq('city', city)
        .maybeSingle()

      if (existing) {
        insertedLeads.push({ id: existing.id, name: place.name, phone: place.phone, already_exists: true })
        continue
      }

      const { data: lead } = await supabase
        .from('leads')
        .insert({
          name: place.name,
          website: null,
          phone: place.phone || null,
          city: place.city,
          district: place.district || null,
          sector: place.sector,
          pipeline_stage: 'new_lead',
        })
        .select('id, name, phone, city, sector')
        .single()

      if (lead) insertedLeads.push(lead)
    }

    return NextResponse.json({ leads: insertedLeads, total: insertedLeads.length })
  } catch (error) {
    console.error('Websitesiz scan error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Tarama başarısız' },
      { status: 500 }
    )
  }
}
