import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'
import { searchPlaces } from '@/lib/maps-scraper'
import { analyzeSite } from '@/lib/analyzer'
import { sendTelegram, notify } from '@/lib/telegram'

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

    // Mock mod — Google Maps çağrısı yapma
    if (process.env.MOCK_MODE === 'true') {
      const mockPlaces = [
        { name: `${district} Diş Kliniği`, website: 'https://dinamikdis.com', phone: '0212 000 00 01', city, district, sector, place_id: 'mock1' },
        { name: `${district} Gülen Diş`, website: 'https://citydent.com.tr', phone: '0212 000 00 02', city, district, sector, place_id: 'mock2' },
      ]

      await supabase.from('scan_jobs').update({ total_found: mockPlaces.length, status: 'completed' }).eq('id', job.id)
      return NextResponse.json({ jobId: job.id, found: mockPlaces.length, mock: true })
    }

    // Gerçek Google Maps araması
    const places = await searchPlaces(city, district === 'TUMU' ? '' : district, sector, 10)

    await supabase.from('scan_jobs').update({ total_found: places.length }).eq('id', job.id)

    let scanned = 0
    let qualified = 0
    let skipped = 0

    for (const place of places) {
      // Websitesi olmayan firmaları atla
      if (!place.website) {
        skipped++
        continue
      }

      // Daha önce tarandı mı?
      const { data: existing } = await supabase
        .from('leads')
        .select('id')
        .eq('website', place.website)
        .single()

      if (existing) {
        skipped++
        continue
      }

      // Lead oluştur
      const { data: lead } = await supabase
        .from('leads')
        .insert({
          name: place.name,
          website: place.website,
          phone: place.phone,
          address: place.address,
          city: place.city,
          district: place.district,
          sector: place.sector,
          has_website: true,
          pipeline_stage: 'new_lead',
          scan_job_id: job.id,
        })
        .select()
        .single()

      if (!lead) continue

      // Analiz et
      try {
        await analyzeSite(place.website, lead.id)
        await sendTelegram(notify.analysisComplete(place.name, 0))
        qualified++
      } catch {
        skipped++
      }

      scanned++

      // Job durumunu güncelle
      await supabase
        .from('scan_jobs')
        .update({ total_scanned: scanned, total_qualified: qualified, total_skipped: skipped })
        .eq('id', job.id)
    }

    // Tamamlandı
    await supabase
      .from('scan_jobs')
      .update({ status: 'completed', total_scanned: scanned, total_qualified: qualified, total_skipped: skipped })
      .eq('id', job.id)

    await sendTelegram(`✅ Tarama tamamlandı\n${city} / ${district} / ${sector}\n${scanned} site analiz edildi, ${qualified} uygun`)

    return NextResponse.json({ jobId: job.id, found: places.length, scanned, qualified, skipped })

  } catch (error) {
    console.error('Auto scan error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Tarama başlatılamadı' },
      { status: 500 }
    )
  }
}
