import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: { leadId: string } }
) {
  const supabase = createAdminSupabase()

  const { data: lead } = await supabase
    .from('leads')
    .select('id, name, website, sector, city, phone, email')
    .eq('id', params.leadId)
    .single()

  if (!lead) {
    return NextResponse.json({ error: 'Lead bulunamadı' }, { status: 404 })
  }

  const { data: report } = await supabase
    .from('reports')
    .select('demo_url, demo_expires_at')
    .eq('lead_id', params.leadId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const { data: analysis } = await supabase
    .from('site_analyses')
    .select('score_genel, has_whatsapp, has_contact_form, has_mobile_menu, address_text, extracted_phone, extracted_services, about_text, founding_year')
    .eq('lead_id', params.leadId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return NextResponse.json({ lead, report, analysis })
}
