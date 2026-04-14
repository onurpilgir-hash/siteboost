import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(
  _req: NextRequest,
  { params }: { params: { leadId: string } }
) {
  try {
    const supabase = createAdminSupabase()

    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', params.leadId)
      .single()

    if (!lead) {
      return NextResponse.json({ error: 'Lead bulunamadı' }, { status: 404 })
    }

    // Mevcut demo var mı?
    const { data: existing } = await supabase
      .from('reports')
      .select('demo_url, demo_expires_at')
      .eq('lead_id', params.leadId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existing?.demo_url) {
      return NextResponse.json({ demo_url: existing.demo_url, already_exists: true })
    }

    // Token üret
    const token = crypto.randomBytes(16).toString('hex')
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siteboost-chi.vercel.app'
    const demoUrl = `${appUrl}/demo/${token}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 gün

    await supabase.from('reports').insert({
      lead_id: params.leadId,
      demo_url: demoUrl,
      demo_token: token,
      demo_expires_at: expiresAt,
      pdf_url: null,
    })

    // Pipeline güncelle
    await supabase
      .from('leads')
      .update({ pipeline_stage: 'demo_hazir' })
      .eq('id', params.leadId)

    return NextResponse.json({ demo_url: demoUrl })
  } catch (error) {
    console.error('create-demo-scratch error:', error)
    return NextResponse.json({ error: 'Demo oluşturulamadı' }, { status: 500 })
  }
}
