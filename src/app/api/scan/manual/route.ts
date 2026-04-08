import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'
import { analyzeSite } from '@/lib/analyzer'

export async function POST(req: NextRequest) {
  try {
    const { url, companyName, email, phone, city, sector } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'URL gerekli' }, { status: 400 })
    }

    const supabase = createAdminSupabase()

    // Lead kaydı oluştur
    const domain = new URL(url).hostname.replace('www.', '')
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        name: companyName || domain,
        website: url,
        email: email || null,
        phone: phone || null,
        city: city || 'Bilinmiyor',
        sector: sector || null,
        has_website: true,
        pipeline_stage: 'new_lead',
      })
      .select()
      .single()

    if (leadError) throw leadError

    // Analizi bekle (Vercel'de background işlem kesilir)
    await analyzeSite(url, lead.id)

    return NextResponse.json({ leadId: lead.id, message: 'Analiz tamamlandı' })
  } catch (error) {
    console.error('Manuel scan error:', error)
    return NextResponse.json(
      { error: 'Analiz başlatılamadı' },
      { status: 500 }
    )
  }
}
