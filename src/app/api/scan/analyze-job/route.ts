import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'
import { analyzeSite } from '@/lib/analyzer'
import { sendTelegram, notify } from '@/lib/telegram'

// Bir job'daki leadleri sırayla analiz et (her çağrıda 1 lead)
export async function POST(req: NextRequest) {
  try {
    const { jobId } = await req.json()
    const supabase = createAdminSupabase()

    // Analiz edilmemiş lead bul
    const { data: lead } = await supabase
      .from('leads')
      .select('id, name, website')
      .eq('scan_job_id', jobId)
      .eq('pipeline_stage', 'new_lead')
      .limit(1)
      .single()

    if (!lead) {
      await supabase.from('scan_jobs').update({ status: 'completed' }).eq('id', jobId)
      return NextResponse.json({ done: true, remaining: 0 })
    }

    // Analiz et
    const result = await analyzeSite(lead.website, lead.id)

    // İyi siteli firmalar (puan >= 7.5) bizim hedefimiz değil → otomatik arşivle
    if (result.score >= 7.5) {
      await supabase
        .from('leads')
        .update({
          is_archived: true,
          notes: `Otomatik arşivlendi: Kaliteli site (puan: ${result.score.toFixed(1)}/10) — SiteBoost hedef kitlesi değil`,
        })
        .eq('id', lead.id)
    }

    await sendTelegram(notify.analysisComplete(lead.name, result.score))

    // Kaç tane kaldı?
    const { count } = await supabase
      .from('leads')
      .select('id', { count: 'exact' })
      .eq('scan_job_id', jobId)
      .eq('pipeline_stage', 'new_lead')

    return NextResponse.json({ done: false, remaining: count || 0, analyzed: lead.name })

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analiz hatası' },
      { status: 500 }
    )
  }
}
