import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'
import { sendTelegram } from '@/lib/telegram'
import crypto from 'crypto'

// POST /api/bilgi-formu — form submit (müşteri veya admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, sector, city, district, phone, email, about, referenceUrl, mode } = body

    if (!name || !sector || !city || !phone) {
      return NextResponse.json({ error: 'Firma adı, sektör, şehir ve telefon zorunludur' }, { status: 400 })
    }

    const supabase = createAdminSupabase()

    // Lead oluştur
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        name,
        sector,
        city,
        district: district || null,
        phone,
        email: email || null,
        website: referenceUrl || null,
        pipeline_stage: 'new_lead',
      })
      .select('id, name')
      .single()

    if (leadError || !lead) throw leadError || new Error('Lead oluşturulamadı')

    // site_analyses — başarısız olsa bile devam et

    try {
      await supabase.from('site_analyses').insert({
        lead_id: lead.id,
        score_genel: 0,
        score_hiz: 0, score_mobil: 0, score_seo: 0, score_ux: 0,
        score_icerik: 0, score_erisilebilirlik: 0, score_guvenlik: 0,
        score_donusum: 0, score_ab_test: 0,
        seo_analysis: 'Sıfırdan site talebi',
        content_analysis: about || 'Müşteri form bilgileriyle oluşturulacak',
        improvement_doc: '',
        action_plan: '',
        package_recommendation: 'baslangic',
        estimated_monthly_loss: 0,
        has_ssl: false,
        has_mobile_menu: false,
        has_contact_form: false,
        has_whatsapp: false,
        has_google_analytics: false,
      })
    } catch (e) {
      console.warn('site_analyses insert skipped:', e)
    }

    // Demo oluştur
    const token = crypto.randomBytes(16).toString('hex')
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siteboost-chi.vercel.app'
    const demoUrl = `${appUrl}/demo/${token}`
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()

    const { error: reportError } = await supabase.from('reports').insert({
      lead_id: lead.id,
      demo_url: demoUrl,
      demo_token: token,
      demo_expires_at: expiresAt,
    })
    if (reportError) throw reportError

    // Telegram bildirimi
    const msg = mode === 'customer'
      ? `📋 Yeni bilgi formu: *${name}* (${sector}, ${city})\nTel: ${phone}`
      : `➕ Yeni müşteri eklendi: *${name}* (${sector}, ${city})`
    await sendTelegram(msg)

    return NextResponse.json({ leadId: lead.id, demoUrl })
  } catch (error) {
    const msg = error instanceof Error ? error.message : JSON.stringify(error)
    console.error('bilgi-formu error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// GET /api/bilgi-formu?token=xxx — token doğrulama (müşteri modu için)
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Token gerekli' }, { status: 400 })

  const supabase = createAdminSupabase()
  const { data } = await supabase
    .from('form_tokens')
    .select('sector, city, expires_at, used')
    .eq('token', token)
    .single()

  if (!data) return NextResponse.json({ error: 'Geçersiz link' }, { status: 404 })
  if (data.used) return NextResponse.json({ error: 'Bu link daha önce kullanıldı' }, { status: 410 })
  if (new Date(data.expires_at) < new Date()) return NextResponse.json({ error: 'Link süresi dolmuş' }, { status: 410 })

  return NextResponse.json({ valid: true, sector: data.sector, city: data.city })
}
