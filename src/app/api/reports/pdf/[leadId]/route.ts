import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { SiteBoostPDF } from '@/lib/pdf-generator'
import React from 'react'

export async function GET(
  req: NextRequest,
  { params }: { params: { leadId: string } }
) {
  try {
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

    const { data: report } = await supabase
      .from('reports')
      .select('*')
      .eq('lead_id', params.leadId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!lead || !analysis) {
      return NextResponse.json({ error: 'Analiz bulunamadı' }, { status: 404 })
    }

    const pdfData = {
      lead,
      analysis,
      demoUrl: report?.demo_url,
      demoExpiresAt: report?.demo_expires_at,
      brandName: process.env.NEXT_PUBLIC_BRAND_NAME || 'SiteBoost',
      appUrl: process.env.NEXT_PUBLIC_BRAND_DOMAIN || 'siteboost.app',
    }

    const element = React.createElement(SiteBoostPDF, { data: pdfData })
    // @ts-expect-error react-pdf type mismatch
    const pdfBuffer = await renderToBuffer(element)

    const filename = `${lead.name.replace(/[^a-zA-Z0-9]/g, '_')}_analiz.pdf`

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('PDF hatası:', error)
    return NextResponse.json({ error: 'PDF oluşturulamadı' }, { status: 500 })
  }
}
