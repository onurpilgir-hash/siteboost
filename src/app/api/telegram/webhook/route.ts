import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'
import { sendTelegram } from '@/lib/telegram'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const message = body?.message
  if (!message) return NextResponse.json({ ok: true })

  const text = (message.text || '').toLowerCase().trim()
  const supabase = createAdminSupabase()

  // Pipeline durumu
  if (text.includes('pipeline') || text.includes('durum')) {
    const { data: leads } = await supabase
      .from('leads')
      .select('pipeline_stage')
      .eq('is_archived', false)

    const counts: Record<string, number> = {}
    for (const lead of leads || []) {
      counts[lead.pipeline_stage] = (counts[lead.pipeline_stage] || 0) + 1
    }

    const lines = [
      '📊 <b>Pipeline Durumu</b>',
      '',
      `🆕 Yeni Lead: ${counts['new_lead'] || 0}`,
      `📧 Mail Gönderildi: ${counts['email_sent'] || 0}`,
      `👁️ Mail Açıldı: ${counts['email_opened'] || 0}`,
      `🔥 Fiyat İstedi: ${counts['price_requested'] || 0}`,
      `🤝 Görüşme: ${counts['meeting'] || 0}`,
      `✅ Aktif Müşteri: ${counts['active_customer'] || 0}`,
    ]
    await sendTelegram(lines.join('\n'))
    return NextResponse.json({ ok: true })
  }

  // Sıcak leadler
  if (text.includes('sıcak') || text.includes('sicak') || text.includes('lead')) {
    const { data: leads } = await supabase
      .from('leads')
      .select('name, pipeline_stage, city, sector')
      .in('pipeline_stage', ['price_requested', 'email_opened', 'demo_viewed'])
      .eq('is_archived', false)
      .limit(5)

    if (!leads || leads.length === 0) {
      await sendTelegram('Şu an sıcak lead yok.')
      return NextResponse.json({ ok: true })
    }

    const stageLabel: Record<string, string> = {
      price_requested: '🔥 Fiyat İstedi',
      email_opened: '⚡ Mail Açtı',
      demo_viewed: '👁️ Demo Gördü',
    }

    const lines = ['🎯 <b>Sıcak Leadler</b>', '']
    for (const lead of leads) {
      lines.push(`${stageLabel[lead.pipeline_stage] || lead.pipeline_stage}: <b>${lead.name}</b>`)
      if (lead.city || lead.sector) lines.push(`   ${[lead.city, lead.sector].filter(Boolean).join(' • ')}`)
    }
    await sendTelegram(lines.join('\n'))
    return NextResponse.json({ ok: true })
  }

  // Yardım
  const help = [
    '🤖 <b>SiteBoost Bot</b>',
    '',
    'Komutlar:',
    '• <b>pipeline</b> — aşama sayıları',
    '• <b>sıcak leadler</b> — fiyat isteyen firmalar',
  ]
  await sendTelegram(help.join('\n'))
  return NextResponse.json({ ok: true })
}
