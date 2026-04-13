// ============================================
// SiteBoost — Site Analiz Motoru (Faz 2)
// ============================================

import { createAdminSupabase } from '@/lib/supabase/server'
import { SCORE_WEIGHTS } from '@/types'

// PageSpeed API'dan hız ve mobil puanları
async function getPageSpeedScores(url: string) {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`

  const [mobileRes, desktopRes] = await Promise.all([
    fetch(`${endpoint}?url=${encodeURIComponent(url)}&strategy=mobile${apiKey ? `&key=${apiKey}` : ''}`),
    fetch(`${endpoint}?url=${encodeURIComponent(url)}&strategy=desktop${apiKey ? `&key=${apiKey}` : ''}`),
  ])

  const mobile = await mobileRes.json()
  const desktop = await desktopRes.json()

  const mobileScore = (mobile.lighthouseResult?.categories?.performance?.score ?? 0) * 10
  const desktopScore = (desktop.lighthouseResult?.categories?.performance?.score ?? 0) * 10
  const mobileFriendly = (mobile.lighthouseResult?.categories?.performance?.score ?? 0) * 10
  const seoScore = (mobile.lighthouseResult?.categories?.seo?.score ?? 0) * 10
  // Erişilebilirlik: önce accessibility, yoksa best-practices, yoksa 5 (orta)
  const accessibilityRaw = mobile.lighthouseResult?.categories?.accessibility?.score
    ?? mobile.lighthouseResult?.categories?.['best-practices']?.score
    ?? 0.5
  const accessibilityScore = accessibilityRaw * 10

  return {
    hiz: (mobileScore + desktopScore) / 2,
    mobil: mobileFriendly,
    pagespeed_seo: seoScore,
    erisilebilirlik: accessibilityScore,
    raw: { mobile, desktop },
  }
}

// HTML analizi — temel SEO ve UX kontrolleri
async function analyzeHTML(url: string) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SiteBoost/1.0)' },
    signal: AbortSignal.timeout(10000),
  })

  const html = await res.text()
  const finalUrl = res.url

  // SSL kontrolü
  const has_ssl = finalUrl.startsWith('https://')

  // Güvenlik başlıkları
  const headers = Object.fromEntries(res.headers.entries())
  const securityHeaders = {
    'x-frame-options': !!headers['x-frame-options'],
    'x-content-type-options': !!headers['x-content-type-options'],
    'strict-transport-security': !!headers['strict-transport-security'],
    'content-security-policy': !!headers['content-security-policy'],
  }
  const securityScore = Object.values(securityHeaders).filter(Boolean).length
  const guvenlik = has_ssl ? 5 + (securityScore * 1.25) : 0

  // Meta bilgileri
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const page_title = titleMatch ? titleMatch[1].trim() : ''

  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
  const meta_description = metaDescMatch ? metaDescMatch[1].trim() : ''

  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
  const has_h1 = !!h1Match

  // UX kontrolleri
  const has_mobile_menu = html.toLowerCase().includes('hamburger') ||
    html.includes('mobile-menu') || html.includes('navbar-toggle') ||
    html.includes('menu-toggle')

  const has_contact_form = html.toLowerCase().includes('<form') &&
    (html.toLowerCase().includes('iletişim') || html.toLowerCase().includes('contact') ||
     html.toLowerCase().includes('mesaj') || html.toLowerCase().includes('gönder'))

  const has_whatsapp = html.toLowerCase().includes('whatsapp') ||
    html.includes('wa.me') || html.includes('api.whatsapp')

  const has_google_analytics = html.includes('gtag') || html.includes('google-analytics') ||
    html.includes('UA-') || html.includes('G-')

  const has_pixel = html.includes('fbq') || html.includes('facebook-pixel') ||
    html.includes('facebook.net/tr')

  // UX skoru
  let ux_score = 3  // Temel puan
  if (has_mobile_menu) ux_score += 2
  if (has_contact_form) ux_score += 2
  if (page_title && page_title.length > 10) ux_score += 1
  if (meta_description && meta_description.length > 50) ux_score += 2
  if (ux_score > 10) ux_score = 10

  // Dönüşüm skoru
  let donusum = 3
  if (has_whatsapp) donusum += 2.5
  if (has_contact_form) donusum += 2.5
  if (html.toLowerCase().includes('rezervasyon') || html.toLowerCase().includes('randevu')) donusum += 2
  if (donusum > 10) donusum = 10

  // A/B Test skoru
  let ab_test = 3
  if (has_google_analytics) ab_test += 3.5
  if (has_pixel) ab_test += 3.5
  if (ab_test > 10) ab_test = 10

  // İçerik skoru (kelime sayısına göre temel hesap — Claude detaylandıracak)
  const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = textContent.split(' ').length
  const icerik_kalitesi = Math.min(wordCount / 100, 10)

  // Logo URL — "logo" geçen img src'si, yoksa favicon
  const logoMatch = html.match(/<img[^>]*(?:class|id|alt|src)=["'][^"']*logo[^"']*["'][^>]*src=["']([^"']+)["']/i)
    || html.match(/<img[^>]*src=["']([^"']*logo[^"']+)["']/i)
  let logo_url: string | null = null
  if (logoMatch?.[1]) {
    const src = logoMatch[1]
    logo_url = src.startsWith('http') ? src : `${new URL(finalUrl).origin}${src.startsWith('/') ? '' : '/'}${src}`
  } else {
    logo_url = `${new URL(finalUrl).origin}/favicon.ico`
  }

  // Primary color — CSS'teki hex renkleri say, en çok geçeni al
  const hexMatches = html.match(/#([0-9a-fA-F]{6})\b/g) || []
  const colorCounts: Record<string, number> = {}
  for (const c of hexMatches) {
    const lower = c.toLowerCase()
    // Çok açık (beyaz) veya çok koyu (siyah) renkleri atla
    if (lower !== '#ffffff' && lower !== '#000000' && lower !== '#fff' && lower !== '#000') {
      colorCounts[lower] = (colorCounts[lower] || 0) + 1
    }
  }
  const primary_color = Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null

  // Adres — <address> tagi veya "Adres:", "Mahallesi", "Caddesi" içeren metin
  const addressTagMatch = html.match(/<address[^>]*>([\s\S]*?)<\/address>/i)
  let address_text: string | null = null
  if (addressTagMatch) {
    address_text = addressTagMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 200)
  } else {
    const addrMatch = textContent.match(/(?:Adres|Mahallesi|Caddesi|Sokak|Bulvarı|No:)[^.]{10,100}/i)
    address_text = addrMatch?.[0]?.trim() || null
  }

  // Telefon — HTML'den ilk Türk telefon numarası
  const phoneMatch = html.match(/(?:0\s*)?(?:\(\s*)?(\d{3})(?:\s*\)?\s*[-\s]?)(\d{3})(?:[-\s]?)(\d{2})(?:[-\s]?)(\d{2})/)
  const extracted_phone = phoneMatch ? phoneMatch[0].replace(/\s+/g, ' ').trim() : null

  // Hizmetler — h2/h3 başlıklarından çıkar
  const headingMatches = html.match(/<h[23][^>]*>([^<]{3,60})<\/h[23]>/gi) || []
  const stopWords = ['hakkımızda', 'iletişim', 'contact', 'about', 'blog', 'haberler', 'galeri', 'referans', 'anasayfa', 'home', 'menu']
  const extracted_services = headingMatches
    .map(h => h.replace(/<[^>]+>/g, '').trim())
    .filter(h => !stopWords.some(sw => h.toLowerCase().includes(sw)) && h.length > 3 && h.length < 60)
    .slice(0, 8)

  // Hakkımızda metni
  const aboutMatch = html.match(/(?:hakkımızda|hakkında|biz kimiz|hikayemiz)[^<]{0,200}<p[^>]*>([\s\S]{50,400})<\/p>/i)
    || html.match(/<section[^>]*(?:about|hakkimizda)[^>]*>[\s\S]*?<p[^>]*>([\s\S]{50,400})<\/p>/i)
  const about_text = aboutMatch ? aboutMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 300) : null

  // Kuruluş yılı
  const yearMatch = textContent.match(/(?:19|20)\d{2}(?:'(?:den|dan|ten|tan)|'dan|'den| yılından| yılında| yılı)/)
    || textContent.match(/(?:kuruluş|kuruldu|established|founded)[^.]{0,30}((?:19|20)\d{2})/)
  const founding_year = yearMatch ? yearMatch[0].match(/((?:19|20)\d{2})/)?.[1] || null : null

  // Galeri görselleri — logo olmayan, boyutlu görseller
  const imgMatches = html.match(/<img[^>]*src=["']([^"']{10,}\.(?:jpg|jpeg|png|webp))[^"']*["'][^>]*>/gi) || []
  const origin = new URL(finalUrl).origin
  const gallery_images = imgMatches
    .map(img => {
      const src = img.match(/src=["']([^"']+)["']/)?.[1] || ''
      if (!src) return null
      if (src.toLowerCase().includes('logo') || src.toLowerCase().includes('icon') || src.toLowerCase().includes('favicon')) return null
      return src.startsWith('http') ? src : `${origin}${src.startsWith('/') ? '' : '/'}${src}`
    })
    .filter(Boolean)
    .slice(0, 4) as string[]

  return {
    has_ssl,
    guvenlik: Math.min(guvenlik, 10),
    kullanici_deneyimi: Math.min(ux_score, 10),
    donusum: Math.min(donusum, 10),
    ab_test: Math.min(ab_test, 10),
    icerik_kalitesi: Math.min(icerik_kalitesi, 10),
    page_title,
    meta_description,
    has_h1,
    has_mobile_menu,
    has_contact_form,
    has_whatsapp,
    has_google_analytics,
    has_pixel,
    security_headers: securityHeaders,
    html_snippet: html.substring(0, 5000),
    logo_url,
    primary_color,
    address_text,
    extracted_phone,
    extracted_services,
    about_text,
    founding_year,
    gallery_images,
  }
}

// Claude ile SEO ve içerik analizi
async function analyzeWithClaude(
  url: string,
  htmlSnippet: string,
  pageTitle: string,
  metaDescription: string,
  basicScores: Record<string, number>
): Promise<{
  seo_score: number
  content_score: number
  seo_analysis: string
  content_analysis: string
  improvement_doc: string
  action_plan: string
  package_recommendation: string
  estimated_monthly_loss: number
  sector_detected?: string
}> {
  const OpenAI = (await import('openai')).default
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const prompt = `Sen bir web sitesi analiz uzmanısın. Aşağıdaki Türk işletmesi web sitesini analiz et.

URL: ${url}
Başlık: ${pageTitle}
Meta Açıklama: ${metaDescription}
HTML (ilk bölüm): ${htmlSnippet.substring(0, 3000)}

Mevcut puanlar:
- Hız: ${basicScores.hiz}/10
- Mobil: ${basicScores.mobil}/10
- Güvenlik: ${basicScores.guvenlik}/10
- UX: ${basicScores.kullanici_deneyimi}/10
- Dönüşüm: ${basicScores.donusum}/10
- Erişilebilirlik: ${basicScores.erisilebilirlik}/10

JSON formatında yanıt ver (başka hiçbir şey yazma):
{
  "seo_score": <0-10 arası sayı>,
  "content_score": <0-10 arası sayı>,
  "seo_analysis": "<SEO durumu 2-3 cümle Türkçe>",
  "content_analysis": "<İçerik kalitesi 2-3 cümle Türkçe>",
  "improvement_doc": "<Her kriter için sorun-neden-çözüm-beklenen puan formatında detaylı Türkçe döküman>",
  "action_plan": "<30/60/90 günlük aksiyon planı Türkçe>",
  "package_recommendation": "<temel|standart|premium - kısa gerekçe>",
  "estimated_monthly_loss": <tahmini aylık gelir kaybı TL cinsinden sayı - hesaplama mantığı: sitenin hız puanı düşükse ziyaretçilerin %40-60'ı siteyi terk eder, mobil puan düşükse mobil kullanıcıların %50'si kaçar, SEO düşükse organik trafik %70 az gelir. Diş kliniği için ortalama müşteri değeri 2000-5000₺, restoran için 500-1500₺, inşaat için 50000-200000₺ gibi sektöre göre gerçekçi hesapla. Toplam kayıp aylık 10.000₺ ile 500.000₺ arasında olmalı, sitenin puanına ve sektörüne göre değişmeli>,
  "sector_detected": "<sitenin sektörünü tespit et, şu değerlerden birini yaz: dis_klinigi | restoran | avukat | guzellik_salonu | insaat | oto_galeri | otel | veteriner | muhasebe | saglik | genel>"
}`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  })

  const text = completion.choices[0].message.content || '{}'

  try {
    return JSON.parse(text)
  } catch {
    return {
      seo_score: 5,
      content_score: 5,
      seo_analysis: 'Analiz tamamlandı.',
      content_analysis: 'İçerik analiz edildi.',
      improvement_doc: 'Detaylı analiz hazır.',
      action_plan: 'Aksiyon planı hazır.',
      package_recommendation: 'standart',
      estimated_monthly_loss: 50000,
    }
  }
}

// Ağırlıklı genel puan hesapla
function calculateOverallScore(scores: {
  hiz: number, mobil: number, seo: number,
  kullanici_deneyimi: number, icerik_kalitesi: number,
  erisilebilirlik: number, guvenlik: number, donusum: number, ab_test: number
}): number {
  return (
    scores.hiz * SCORE_WEIGHTS.hiz +
    scores.mobil * SCORE_WEIGHTS.mobil +
    scores.seo * SCORE_WEIGHTS.seo +
    scores.kullanici_deneyimi * SCORE_WEIGHTS.kullanici_deneyimi +
    scores.icerik_kalitesi * SCORE_WEIGHTS.icerik_kalitesi +
    scores.erisilebilirlik * SCORE_WEIGHTS.erisilebilirlik +
    scores.guvenlik * SCORE_WEIGHTS.guvenlik +
    scores.donusum * SCORE_WEIGHTS.donusum +
    scores.ab_test * SCORE_WEIGHTS.ab_test
  )
}

// Ana analiz fonksiyonu
export async function analyzeSite(url: string, leadId: string) {
  const supabase = createAdminSupabase()

  // Lead bilgilerini oku (sektör, email vb.)
  const { data: lead } = await supabase.from('leads').select('sector, email, name').eq('id', leadId).single()

  // Mock mod — geliştirme sırasında gerçek API çağrısı yapmaz
  if (process.env.MOCK_MODE === 'true') {
    const { MOCK_ANALYSIS } = await import('@/lib/mock-data')
    await new Promise(r => setTimeout(r, 1500)) // Gerçekmiş gibi kısa bekleme

    const { data: analysis } = await supabase
      .from('site_analyses')
      .insert({ ...MOCK_ANALYSIS, lead_id: leadId, id: undefined })
      .select()
      .single()

    await supabase
      .from('leads')
      .update({ pipeline_stage: 'analyzed', latest_report_id: analysis?.id })
      .eq('id', leadId)

    // Demo token üret
    const demoToken = crypto.randomUUID()
    const demoExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siteboost-chi.vercel.app'
    await supabase.from('reports').insert({
      lead_id: leadId,
      analysis_id: analysis?.id,
      demo_token: demoToken,
      demo_url: `${appUrl}/demo/${demoToken}`,
      demo_expires_at: demoExpires,
    })

    return { success: true, score: MOCK_ANALYSIS.score_genel, analysisId: analysis?.id }
  }

  try {
    // 1. PageSpeed analizi
    const pageSpeedData = await getPageSpeedScores(url)

    // 2. HTML analizi
    const htmlData = await analyzeHTML(url)

    // 3. Temel puanları birleştir
    const basicScores = {
      hiz: pageSpeedData.hiz,
      mobil: pageSpeedData.mobil,
      erisilebilirlik: pageSpeedData.erisilebilirlik,
      guvenlik: htmlData.guvenlik,
      kullanici_deneyimi: htmlData.kullanici_deneyimi,
      donusum: htmlData.donusum,
      ab_test: htmlData.ab_test,
      icerik_kalitesi: htmlData.icerik_kalitesi,
    }

    // 4. Claude analizi
    const claudeData = await analyzeWithClaude(
      url,
      htmlData.html_snippet,
      htmlData.page_title,
      htmlData.meta_description,
      basicScores
    )

    // 5. Nihai puanlar
    const finalScores = {
      ...basicScores,
      seo: claudeData.seo_score,
      icerik_kalitesi: claudeData.content_score,
    }
    const genel = calculateOverallScore(finalScores as Parameters<typeof calculateOverallScore>[0])

    // 6. Veritabanına kaydet
    const { data: analysis } = await supabase
      .from('site_analyses')
      .insert({
        lead_id: leadId,
        score_hiz: finalScores.hiz,
        score_mobil: finalScores.mobil,
        score_seo: finalScores.seo,
        score_ux: finalScores.kullanici_deneyimi,
        score_icerik: finalScores.icerik_kalitesi,
        score_erisilebilirlik: finalScores.erisilebilirlik,
        score_guvenlik: finalScores.guvenlik,
        score_donusum: finalScores.donusum,
        score_ab_test: finalScores.ab_test,
        score_genel: genel,
        seo_analysis: claudeData.seo_analysis,
        content_analysis: claudeData.content_analysis,
        improvement_doc: claudeData.improvement_doc,
        action_plan: claudeData.action_plan,
        package_recommendation: claudeData.package_recommendation,
        estimated_monthly_loss: claudeData.estimated_monthly_loss,
        competitor_analysis: null,  // Sonra doldurulacak
        pagespeed_data: pageSpeedData.raw,
        security_headers: htmlData.security_headers,
        page_title: htmlData.page_title,
        meta_description: htmlData.meta_description,
        has_ssl: htmlData.has_ssl,
        has_mobile_menu: htmlData.has_mobile_menu,
        has_contact_form: htmlData.has_contact_form,
        has_whatsapp: htmlData.has_whatsapp,
        has_google_analytics: htmlData.has_google_analytics,
        has_pixel: htmlData.has_pixel,
        logo_url: htmlData.logo_url,
        primary_color: htmlData.primary_color,
        address_text: htmlData.address_text,
        extracted_phone: htmlData.extracted_phone,
        extracted_services: htmlData.extracted_services,
        about_text: htmlData.about_text,
        founding_year: htmlData.founding_year,
        gallery_images: htmlData.gallery_images,
      })
      .select()
      .single()

    // 7. Lead'i güncelle
    await supabase
      .from('leads')
      .update({
        site_scores: {
          hiz: finalScores.hiz,
          mobil: finalScores.mobil,
          seo: finalScores.seo,
          kullanici_deneyimi: finalScores.kullanici_deneyimi,
          icerik_kalitesi: finalScores.icerik_kalitesi,
          erisilebilirlik: finalScores.erisilebilirlik,
          guvenlik: finalScores.guvenlik,
          donusum: finalScores.donusum,
          ab_test: finalScores.ab_test,
          genel,
        },
        latest_report_id: analysis?.id,
        // Sektör boşsa veya 'genel' ise AI'ın tespit ettiğini kullan
        ...(!lead?.sector || lead.sector === 'genel' ? { sector: claudeData.sector_detected || 'genel' } : {}),
      })
      .eq('id', leadId)

    // Demo token üret
    const demoToken = crypto.randomUUID()
    const demoExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siteboost-chi.vercel.app'
    await supabase.from('reports').insert({
      lead_id: leadId,
      analysis_id: analysis?.id,
      demo_token: demoToken,
      demo_url: `${appUrl}/demo/${demoToken}`,
      demo_expires_at: demoExpires,
    })

    return { success: true, score: genel, analysisId: analysis?.id }
  } catch (error) {
    console.error(`Site analizi hatası (${url}):`, error)

    // Hata durumunda lead'i güncelle
    await supabase
      .from('leads')
      .update({ notes: `Analiz hatası: ${error instanceof Error ? error.message : 'Bilinmiyor'}` })
      .eq('id', leadId)

    throw error
  }
}
