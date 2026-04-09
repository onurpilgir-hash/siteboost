// Mail gönderme sistemi — Resend entegrasyonu
// MOCK_MODE=true iken gerçek mail gitmez, konsola yazar

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailOptions) {
  const fromAddress = from || process.env.EMAIL_FROM || 'SiteBoost <onboarding@resend.dev>'

  // Mock mod — gerçek mail gitmez
  if (process.env.MOCK_MODE === 'true') {
    console.log('\n📧 [MOCK] Mail gönderildi:')
    console.log(`  Kime: ${to}`)
    console.log(`  Konu: ${subject}`)
    console.log('  (Gerçek mail gitmedi — MOCK_MODE=true)\n')
    return { success: true, mock: true }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey === 'buraya_resend_api_key_yaz') {
    throw new Error('RESEND_API_KEY ayarlanmamış')
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: fromAddress, to, subject, html }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Resend hatası: ${JSON.stringify(err)}`)
  }

  return { success: true, data: await res.json() }
}

// Analiz raporu mail şablonu
export function buildAnalysisEmail(opts: {
  leadId: string
  leadName: string
  website: string
  score: number
  estimatedLoss: number
  pdfUrl: string
  demoUrl?: string
  brandName?: string
  appUrl?: string
}) {
  const brand = opts.brandName || 'SiteBoost'
  const scoreColor = opts.score < 4 ? '#ef4444' : opts.score < 6 ? '#eab308' : '#22c55e'
  const loss = opts.estimatedLoss.toLocaleString('tr-TR')

  return {
    subject: `${opts.leadName} — Ücretsiz Web Sitesi Analiz Raporunuz`,
    html: `
<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${brand} Analiz Raporu</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Arial,sans-serif;color:#f8fafc;">
  <div style="max-width:600px;margin:0 auto;padding:0;">

    <!-- Header -->
    <div style="background:#3b82f6;padding:32px 40px;">
      <p style="margin:0 0 8px;font-size:13px;color:#bfdbfe;">${brand} — Ücretsiz Site Analizi</p>
      <h1 style="margin:0;font-size:24px;color:#ffffff;">${opts.leadName}</h1>
      <p style="margin:4px 0 0;font-size:13px;color:#bfdbfe;">${opts.website}</p>
    </div>

    <!-- Skor -->
    <div style="background:#1e293b;padding:32px 40px;border-bottom:1px solid #334155;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:120px;text-align:center;">
            <div style="font-size:64px;font-weight:bold;color:${scoreColor};line-height:1;">${opts.score.toFixed(1)}</div>
            <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Genel Puan / 10</div>
          </td>
          <td style="padding-left:24px;">
            <p style="margin:0 0 12px;font-size:15px;color:#f8fafc;">
              Web siteniz <strong style="color:${scoreColor};">${opts.score.toFixed(1)}/10</strong> puan aldı.
              Potansiyel müşteriler her ay sitenizi terk ediyor.
            </p>
            ${opts.estimatedLoss > 0 ? `
            <div style="background:#450a0a;border:1px solid #991b1b;border-radius:8px;padding:12px 16px;">
              <p style="margin:0;font-size:12px;color:#fca5a5;">Tahmini aylık gelir kaybı</p>
              <p style="margin:4px 0 0;font-size:22px;font-weight:bold;color:#f87171;">~${loss}₺</p>
            </div>
            ` : ''}
          </td>
        </tr>
      </table>
    </div>

    <!-- Detaylı rapor butonu -->
    <div style="background:#1e293b;padding:24px 40px;text-align:center;">
      <a href="${opts.pdfUrl}"
         style="display:inline-block;background:#3b82f6;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:bold;margin-bottom:12px;">
        📄 Detaylı Raporu İndir (PDF)
      </a>
      ${opts.demoUrl ? `
      <br>
      <a href="${opts.demoUrl}"
         style="display:inline-block;background:#0f3460;border:2px solid #3b82f6;color:#93c5fd;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:bold;margin-top:12px;">
        🖥️ Ücretsiz Demo Sitenizi Görün
      </a>
      <p style="margin:8px 0 0;font-size:11px;color:#64748b;">Demo linki 7 gün geçerlidir</p>
      ` : ''}
    </div>

    <!-- CTA -->
    <div style="background:#1e3a5f;border:1px solid #1d4ed8;margin:0 40px;border-radius:8px;padding:20px;text-align:center;">
      <p style="margin:0 0 12px;font-size:14px;color:#bfdbfe;">
        Sitenizi nasıl iyileştireceğinizi merak mı ediyorsunuz?
      </p>
      <a href="${opts.appUrl ? `https://${opts.appUrl}` : 'https://siteboost-chi.vercel.app'}/api/price-request/${opts.leadId}"
         style="display:inline-block;background:#ffffff;color:#1d4ed8;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:bold;">
        💡 Fiyat Almak İstiyorum
      </a>
    </div>

    <!-- Footer -->
    <div style="padding:24px 40px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#475569;">
        Bu mail ${brand} tarafından gönderilmiştir. Almak istemiyorsanız
        <a href="mailto:${process.env.EMAIL_FROM?.match(/<(.+)>/)?.[1] || 'info@siteboost.app'}?subject=Listeden çıkar - ${opts.leadName}" style="color:#475569;">buraya tıklayın</a>.
      </p>
    </div>

  </div>
</body>
</html>
    `.trim(),
  }
}
