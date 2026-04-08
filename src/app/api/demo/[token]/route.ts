import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const supabase = createAdminSupabase()

  const { data: report } = await supabase
    .from('reports')
    .select('*, leads(*), site_analyses(*)')
    .eq('demo_token', params.token)
    .single()

  if (!report) {
    return NextResponse.json({ error: 'Demo bulunamadı' }, { status: 404 })
  }

  const expired = report.demo_expires_at
    ? new Date(report.demo_expires_at) < new Date()
    : false

  return NextResponse.json({
    lead: report.leads,
    report: { demo_url: report.demo_url, demo_expires_at: report.demo_expires_at },
    analysis: report.site_analyses,
    expired,
    brand_name: process.env.NEXT_PUBLIC_BRAND_NAME || 'SiteBoost',
    app_url: process.env.NEXT_PUBLIC_BRAND_DOMAIN || 'siteboost.app',
  })
}
