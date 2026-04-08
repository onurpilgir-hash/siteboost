import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const supabase = createAdminSupabase()
  const { data, error } = await supabase
    .from('scan_jobs')
    .select('*')
    .eq('id', params.jobId)
    .single()

  if (error) return NextResponse.json({ error: 'Job bulunamadı' }, { status: 404 })
  return NextResponse.json(data)
}
