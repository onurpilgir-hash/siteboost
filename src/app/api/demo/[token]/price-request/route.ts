import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'
import { sendTelegram, notify } from '@/lib/telegram'

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
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

  await supabase
    .from('leads')
    .update({ pipeline_stage: 'price_requested' })
    .eq('id', report.lead_id)

  if (lead) await sendTelegram(notify.priceRequested(lead.name))

  return NextResponse.json({ success: true })
}
