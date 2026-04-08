import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const supabase = createAdminSupabase()

  const { data: customer } = await supabase
    .from('customers')
    .select('*, leads(*)')
    .eq('portal_token', params.token)
    .single()

  if (!customer) {
    return NextResponse.json({ error: 'Portal bulunamadı' }, { status: 404 })
  }

  const lead = customer.leads as { id: string; name: string; website: string; city: string }

  const [analysesRes, reportsRes] = await Promise.all([
    supabase
      .from('site_analyses')
      .select('id, score_genel, score_hiz, score_mobil, score_seo, score_ux, score_icerik, score_erisilebilirlik, score_guvenlik, score_donusum, score_ab_test, package_recommendation, created_at')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: false })
      .limit(12),
    supabase
      .from('reports')
      .select('id, pdf_url, demo_url, created_at')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: false })
      .limit(12),
  ])

  const analyses = analysesRes.data || []
  const reports = reportsRes.data || []

  return NextResponse.json({
    customer: {
      company_name: customer.company_name,
      sector: customer.sector,
      subscription_plan: customer.subscription_plan,
      subscription_active: customer.subscription_active,
    },
    lead,
    analyses,
    reports,
    latestAnalysis: analyses[0] || null,
  })
}
