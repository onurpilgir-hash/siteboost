import { NextRequest, NextResponse } from 'next/server'
import { execSync } from 'child_process'

const WP_URL = process.env.WP_URL || 'http://localhost:8090'
const WP_CONTAINER = process.env.WP_CONTAINER || 'wordpress-test-wordpress-1'
const WP_PATH = '/var/www/html'

// WP-CLI komutu çalıştır (local Docker veya SSH)
function wpcli(command: string): string {
  try {
    return execSync(
      `docker exec ${WP_CONTAINER} wp --allow-root --path=${WP_PATH} ${command}`,
      { encoding: 'utf8', timeout: 15000 }
    ).trim()
  } catch (e) {
    throw new Error(`WP-CLI hatası: ${e instanceof Error ? e.message : String(e)}`)
  }
}

// HTML içeriği container'a yaz, shell script ile WP-CLI çalıştır
function wpcliWithContent(title: string, content: string, postType = 'page'): string {
  const { writeFileSync } = require('fs')
  const { tmpdir } = require('os')
  const path = require('path')
  const ts = Date.now()
  const contentFile = `/tmp/wpcontent-${ts}.html`
  const scriptFile = `/tmp/wpcreate-${ts}.sh`

  // İçerik dosyasını container'a kopyala
  const localContent = path.join(tmpdir(), `wpcontent-${ts}.html`)
  writeFileSync(localContent, content, 'utf8')
  execSync(`docker cp "${localContent}" ${WP_CONTAINER}:${contentFile}`)

  // Shell script oluştur ve container'a kopyala
  const safeTitle = title.replace(/\\/g, '').replace(/"/g, '\\"')
  const script = `#!/bin/bash\nwp --allow-root --path=${WP_PATH} post create --post_type=${postType} --post_title="${safeTitle}" --post_content-file=${contentFile} --post_status=publish --porcelain\n`
  const localScript = path.join(tmpdir(), `wpcreate-${ts}.sh`)
  writeFileSync(localScript, script, 'utf8')
  execSync(`docker cp "${localScript}" ${WP_CONTAINER}:${scriptFile}`)

  return execSync(`docker exec ${WP_CONTAINER} bash ${scriptFile}`, { encoding: 'utf8', timeout: 15000 }).trim()
}

const SECTOR_COLORS: Record<string, string> = {
  dis_klinigi: '#2563eb',
  restoran:    '#dc2626',
  guzellik:    '#db2777',
  oto_servis:  '#d97706',
  avukat:      '#1e3a5f',
  insaat:      '#374151',
  default:     '#6366f1',
}

const SECTOR_SERVICES: Record<string, string[]> = {
  dis_klinigi: ['İmplant', 'Ortodonti', 'Diş Beyazlatma', 'Kanal Tedavisi', 'Protez', 'Çocuk Diş Hekimliği'],
  restoran:    ['Öğle Yemeği', 'Akşam Yemeği', 'Catering', 'Özel Etkinlik', 'Paket Servis', 'Rezervasyon'],
  guzellik:    ['Saç Kesim', 'Makyaj', 'Cilt Bakımı', 'Manikür', 'Kaş Tasarımı', 'Kalıcı Makyaj'],
  oto_servis:  ['Motor Bakımı', 'Fren Sistemi', 'Yağ Değişimi', 'Elektrik', 'Kaporta', 'Lastik'],
  avukat:      ['Ceza Hukuku', 'Boşanma', 'İş Hukuku', 'Miras', 'Gayrimenkul', 'Ticaret Hukuku'],
  insaat:      ['Villa', 'Tadilat', 'İç Mimarlık', 'Çatı', 'Boya', 'Zemin'],
  default:     ['Hizmet 1', 'Hizmet 2', 'Hizmet 3', 'Hizmet 4', 'Hizmet 5', 'Hizmet 6'],
}

export async function POST(req: NextRequest) {
  try {
    const { businessName, sector, city, phone, address } = await req.json()

    if (!businessName) {
      return NextResponse.json({ error: 'İşletme adı gerekli' }, { status: 400 })
    }

    const primary = SECTOR_COLORS[sector] || SECTOR_COLORS.default
    const services = SECTOR_SERVICES[sector] || SECTOR_SERVICES.default
    const safePhone = phone?.replace(/\D/g, '') || ''

    // 1. Site başlığı ve açıklamasını ayarla
    wpcli(`option update blogname "${businessName}"`)
    wpcli(`option update blogdescription "${city || ''} - Profesyonel Hizmet"`)

    // 2. Ana sayfa içeriği oluştur
    const heroHtml = `
<div style="background:${primary};padding:80px 20px;text-align:center;color:white;">
<h1 style="font-size:2.5rem;font-weight:900;margin:0 0 16px;">${businessName}</h1>
<p style="font-size:1.2rem;opacity:0.85;margin:0 0 32px;">${city || ''} — Profesyonel ve Güvenilir Hizmet</p>
${phone ? `<a href="tel:${phone}" style="background:white;color:${primary};padding:14px 32px;border-radius:50px;font-weight:700;text-decoration:none;font-size:1rem;">📞 ${phone}</a>` : ''}
</div>

<div style="padding:60px 20px;background:#f8fafc;text-align:center;">
<h2 style="font-size:1.8rem;font-weight:800;margin-bottom:40px;">Hizmetlerimiz</h2>
<div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;max-width:800px;margin:0 auto;">
${services.map(s => `<div style="background:white;border-radius:12px;padding:20px 24px;box-shadow:0 2px 8px rgba(0,0,0,0.08);font-weight:600;min-width:160px;">${s}</div>`).join('')}
</div>
</div>

<div style="padding:60px 20px;text-align:center;max-width:600px;margin:0 auto;">
<h2 style="font-size:1.8rem;font-weight:800;margin-bottom:24px;">İletişim</h2>
${phone ? `<p style="font-size:1.1rem;margin-bottom:12px;">📞 <a href="tel:${phone}" style="color:${primary};font-weight:600;">${phone}</a></p>` : ''}
${address ? `<p style="color:#666;margin-bottom:24px;">📍 ${address}</p>` : ''}
${safePhone ? `<a href="https://wa.me/90${safePhone}" style="background:#25d366;color:white;padding:14px 32px;border-radius:50px;font-weight:700;text-decoration:none;display:inline-block;margin-top:8px;">💬 WhatsApp ile Yaz</a>` : ''}
</div>
`

    // 3. Sayfa oluştur
    const pageId = wpcliWithContent(businessName, heroHtml)

    // 4. Ana sayfayı statik yap
    wpcli(`option update show_on_front page`)
    wpcli(`option update page_on_front ${pageId}`)

    // 5. Varsayılan "Merhaba dünya" yazısını ve örnek sayfayı sil
    try { wpcli(`post delete 1 --force`) } catch { /* yok olabilir */ }
    try { wpcli(`post delete 2 --force`) } catch { /* yok olabilir */ }

    return NextResponse.json({
      success: true,
      pageId,
      siteUrl: WP_URL,
      adminUrl: `${WP_URL}/wp-admin`,
      message: `✅ ${businessName} için WordPress sitesi hazırlandı`,
    })

  } catch (error) {
    console.error('WordPress provision error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Hata oluştu' },
      { status: 500 }
    )
  }
}
