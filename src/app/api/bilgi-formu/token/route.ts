import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { sector, city } = await req.json()
    const supabase = createAdminSupabase()
    const token = crypto.randomBytes(12).toString('hex')
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

    await supabase.from('form_tokens').insert({
      token,
      sector: sector || null,
      city: city || 'İstanbul',
      expires_at: expiresAt,
      used: false,
    })

    return NextResponse.json({ token })
  } catch (error) {
    console.error('token error:', error)
    return NextResponse.json({ error: 'Token oluşturulamadı' }, { status: 500 })
  }
}
