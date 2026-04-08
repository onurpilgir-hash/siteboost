import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { leadId: string } }
) {
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

  return NextResponse.json({ lead, analysis })
}
