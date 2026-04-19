import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'
import { searchPlaces } from '@/lib/maps-scraper'

export async function POST(req: NextRequest) {
  try {
    const { city, district, sector } = await req.json()

    if (!city || !sector) {
      return NextResponse.json({ error: 'Şehir ve sektör gerekli' }, { status: 400 })
    }

    const supabase = createAdminSupabase()

    // Tarama işi oluştur
    const { data: job, error: jobError } = await supabase
      .from('scan_jobs')
      .insert({
        type: 'auto',
        status: 'running',
        city,
        district: district === 'TUMU' ? null : district,
        sector,
        total_found: 0,
        total_scanned: 0,
        total_qualified: 0,
        total_skipped: 0,
      })
      .select()
      .single()

    if (jobError) throw jobError

    // Mock mod
    if (process.env.MOCK_MODE === 'true') {
      const mockLeads = [
        { name: `${district} Diş Kliniği`, website: 'https://dinamikdis.com', phone: '0212 000 00 01' },
        { name: `${district} Gülen Diş`, website: 'https://citydent.com.tr', phone: '0212 000 00 02' },
      ]
      for (const m of mockLeads) {
        await supabase.from('leads').insert({
          name: m.name, website: m.website, phone: m.phone,
          city, district, sector, has_website: true,
          pipeline_stage: 'new_lead', scan_job_id: job.id,
        })
      }
      await supabase.from('scan_jobs').update({ total_found: mockLeads.length, status: 'pending_analysis' }).eq('id', job.id)
      return NextResponse.json({ jobId: job.id, found: mockLeads.length, mock: true })
    }

    // Gerçek: sadece firmaları bul ve kaydet (analiz ayrı)
    const places = await searchPlaces(city, district === 'TUMU' ? '' : district, sector, 5)

    let saved = 0
    let skipped = 0

    for (const place of places) {
      if (!place.name) { skipped++; continue }

      // Daha önce var mı?
      const { data: existing } = await supabase
        .from('leads').select('id').eq('website', place.website).single()
      if (existing) { skipped++; continue }

      await supabase.from('leads').insert({
        name: place.name,
        website: place.website || null,
        phone: place.phone,
        address: place.address,
        city: place.city,
        district: place.district,
        sector: place.sector,
        has_website: !!(place.website && place.website.trim()),
        pipeline_stage: 'new_lead',
        scan_job_id: job.id,
      })
      saved++
    }

    await supabase.from('scan_jobs').update({
      total_found: places.length,
      total_scanned: saved,
      total_skipped: skipped,
      status: 'pending_analysis',
    }).eq('id', job.id)

    return NextResponse.json({ jobId: job.id, found: places.length, saved, skipped })

  } catch (error) {
    console.error('Auto scan error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Tarama başlatılamadı' },
      { status: 500 }
    )
  }
}
