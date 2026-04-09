import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/server'
import { sendTelegram, notify } from '@/lib/telegram'

export async function GET(
  req: NextRequest,
  { params }: { params: { leadId: string } }
) {
  const supabase = createAdminSupabase()

  const { data: lead } = await supabase
    .from('leads')
    .select('name, pipeline_stage')
    .eq('id', params.leadId)
    .single()

  if (!lead) {
    return new NextResponse('Firma bulunamadı', { status: 404 })
  }

  // Pipeline güncelle
  await supabase
    .from('leads')
    .update({ pipeline_stage: 'price_requested' })
    .eq('id', params.leadId)

  // Telegram bildirimi
  await sendTelegram(notify.priceRequested(lead.name))

  // Teşekkür sayfasına yönlendir
  return new NextResponse(`
<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Talebiniz Alındı</title>
<style>
  body { margin:0; background:#0f172a; font-family:Arial,sans-serif; color:#f8fafc; display:flex; align-items:center; justify-content:center; min-height:100vh; }
  .box { text-align:center; padding:40px; max-width:400px; }
  .icon { font-size:64px; margin-bottom:16px; }
  h1 { font-size:24px; margin:0 0 12px; }
  p { color:#94a3b8; font-size:15px; line-height:1.6; }
</style>
</head>
<body>
  <div class="box">
    <div class="icon">✅</div>
    <h1>Talebiniz Alındı!</h1>
    <p>En kısa sürede sizinle iletişime geçeceğiz.<br>Teşekkür ederiz.</p>
  </div>
</body>
</html>
  `, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  })
}
