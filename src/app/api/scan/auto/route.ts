import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { city, district, sector } = await req.json()

    if (!city || !sector) {
      return NextResponse.json({ error: 'Şehir ve sektör gerekli' }, { status: 400 })
    }

    const supabase = createAdminSupabase()

    // Tarama işi kaydı oluştur
    const { data: job, error } = await supabase
      .from('scan_jobs')
      .insert({
        type: 'auto',
        status: 'pending',
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

    if (error) throw error

    // Arka planda taramayı başlat (Google Maps API hazır olunca aktif olacak)
    // Şimdilik job oluşturup progress sayfasına yönlendiriyoruz

    return NextResponse.json({ jobId: job.id, message: 'Tarama kuyruğa alındı' })
  } catch (error) {
    console.error('Auto scan error:', error)
    return NextResponse.json({ error: 'Tarama başlatılamadı' }, { status: 500 })
  }
}
