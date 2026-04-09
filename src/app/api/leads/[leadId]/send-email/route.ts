import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'
import { sendEmail, buildAnalysisEmail } from '@/lib/email'
import { sendTelegram, notify } from '@/lib/telegram'

export async function POST(
  req: NextRequest,
  { params }: { params: { leadId: string } }
) {
  try {
    const supabase = createAdminSupabase()

    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', params.leadId)
      .single()

    const { data: analysis } = await supabase
      .from('site_analyses')
      .select('*')
      .eq('lead_id', params.leadId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const { data: report } = await supabase
      .from('reports')
      .select('*')
      .eq('lead_id', params.leadId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!lead || !analysis) {
      return NextResponse.json({ error: 'Lead veya analiz bulunamadı' }, { status: 404 })
    }

    if (!lead.email) {
      return NextResponse.json({ error: 'Firma mail adresi yok' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const pdfUrl = `${appUrl}/api/reports/pdf/${lead.id}`
    const demoUrl = report?.demo_url || undefined

    const { subject, html } = buildAnalysisEmail({
      leadId: lead.id,
      leadName: lead.name,
      website: lead.website,
      score: analysis.score_genel,
      estimatedLoss: analysis.estimated_monthly_loss || 0,
      pdfUrl,
      demoUrl,
      brandName: process.env.NEXT_PUBLIC_BRAND_NAME || 'SiteBoost',
      appUrl: process.env.NEXT_PUBLIC_BRAND_DOMAIN || 'siteboost-chi.vercel.app',
    })

    await sendEmail({ to: lead.email, subject, html })

    // Mail log'a kaydet
    await supabase.from('email_log').insert({
      lead_id: lead.id,
      email_to: lead.email,
      subject,
      status: 'sent',
    })

    // Pipeline aşamasını güncelle
    await supabase
      .from('leads')
      .update({ pipeline_stage: 'email_sent' })
      .eq('id', lead.id)

    await sendTelegram(notify.emailSent(lead.name))

    return NextResponse.json({ success: true, mock: process.env.MOCK_MODE === 'true' })
  } catch (error) {
    console.error('Mail hatası:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Mail gönderilemedi' },
      { status: 500 }
    )
  }
}
