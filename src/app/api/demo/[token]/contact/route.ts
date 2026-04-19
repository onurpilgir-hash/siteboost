import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'
import { sendTelegram } from '@/lib/telegram'

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const { name, phone, message } = await req.json()

  if (!name || !phone) {
    return NextResponse.json({ error: 'Ad ve telefon gerekli' }, { status: 400 })
  }

  const supabase = createAdminSupabase()

  const { data: report } = await supabase
    .from('reports')
    .select('lead_id')
    .eq('demo_token', params.token)
    .single()

  if (!report) {
    return NextResponse.json({ error: 'Demo bulunamadı' }, { status: 404 })
  }

  const { data: lead } = await supabase
    .from('leads')
    .select('name')
    .eq('id', report.lead_id)
    .single()

  const leadName = lead?.name || 'Bilinmiyor'

  await supabase
    .from('leads')
    .update({ pipeline_stage: 'price_requested' })
    .eq('id', report.lead_id)

  await sendTelegram(
    `📬 <b>Demo İletişim Formu!</b>\n` +
    `Firma: ${leadName}\n` +
    `Ad: ${name}\n` +
    `Telefon: ${phone}` +
    (message ? `\nMesaj: ${message}` : '')
  )

  return NextResponse.json({ success: true })
}
