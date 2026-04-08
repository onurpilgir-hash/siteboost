// Mock data — geliştirme modunda gerçek API çağrısı yapmadan kullanılır
// .env.local'da MOCK_MODE=true ise bu veri kullanılır

export const MOCK_LEAD = {
  id: 'mock-lead-001',
  name: 'Beşiktaş Gülen Diş Kliniği',
  website: 'https://besiktasdis.com',
  city: 'İstanbul',
  district: 'Beşiktaş',
  sector: 'Diş Kliniği',
  pipeline_stage: 'new_lead',
  notes: null,
  created_at: new Date().toISOString(),
}

export const MOCK_ANALYSIS = {
  id: 'mock-analysis-001',
  lead_id: 'mock-lead-001',
  score_hiz: 3.2,
  score_mobil: 4.1,
  score_seo: 5.5,
  score_ux: 4.8,
  score_icerik: 5.0,
  score_erisilebilirlik: 6.2,
  score_guvenlik: 7.5,
  score_donusum: 3.5,
  score_ab_test: 3.0,
  score_genel: 4.7,
  seo_analysis:
    'Site başlığı mevcut ancak meta açıklama eksik, bu Google arama sonuçlarında ciddi dezavantaj oluşturuyor. H1 etiketi kullanılmamış, anahtar kelime yoğunluğu yetersiz. "Beşiktaş diş kliniği" ve "implant istanbul" gibi yerel aramalarda sıralamaya girmek için teknik SEO düzenlemesi şart.',
  content_analysis:
    'Site içeriği oldukça sınırlı, hizmet açıklamaları tek cümlede geçiştirilmiş. Doktor kadrosu ve uzmanlık alanları hakkında bilgi yok. Hasta referansı veya önce/sonra görseli bulunmuyor. Bu eksiklikler potansiyel hastaların güven duymasını engelliyor.',
  improvement_doc: `HIZ (3.2/10)
Sorun: Sayfa yükleme süresi 6.8 saniye (ideal: altında 2 saniye).
Neden: Optimize edilmemiş görseller, render-blocking JavaScript, sunucu yanıt süresi yüksek.
Çözüm: Görselleri WebP formatına dönüştür, lazy loading ekle, CDN kullan, gereksiz JS/CSS kaldır.
Beklenen puan: 7.5-8.0

MOBİL (4.1/10)
Sorun: Mobil menü çalışmıyor, yazı boyutları küçük, butonlar parmak dokunuşuna göre ayarlanmamış.
Neden: Responsive tasarım uygulanmamış veya eksik uygulanmış.
Çözüm: Bootstrap/Tailwind ile tam responsive tasarım, hamburger menü, dokunmatik optimizasyon.
Beklenen puan: 8.5-9.0

SEO (5.5/10)
Sorun: Meta açıklama yok, H1 eksik, schema markup yok, local SEO iyileştirilmemiş.
Neden: SEO bilgisi olmadan hazırlanmış site.
Çözüm: Her sayfaya unique meta açıklama, doğru H1-H6 hiyerarşisi, LocalBusiness schema, Google Business Profile optimizasyonu.
Beklenen puan: 8.0-8.5

DÖNÜŞÜM (3.5/10)
Sorun: WhatsApp butonu yok, randevu formu bulunamıyor, CTA butonları zayıf.
Neden: Ziyaretçiyi müşteriye dönüştürecek araçlar eksik.
Çözüm: Sabit WhatsApp butonu, online randevu formu, "Ücretsiz Muayene" CTA, acil diş hattı.
Beklenen puan: 8.0-9.0`,
  action_plan: `30 GÜN — Hızlı Kazanımlar:
• Görselleri optimize et (hız +3 puan)
• Meta açıklama ve H1 ekle (SEO +2 puan)
• WhatsApp butonu ekle (dönüşüm +2 puan)
• Mobil menüyü düzelt
• Google Business Profile'ı güncelle

60 GÜN — Orta Vadeli:
• Online randevu sistemi entegre et
• Hizmet sayfalarını genişlet (implant, ortodonti, çocuk diş)
• Doktor kadrosu sayfası ekle
• 5-10 hasta yorumu ekle
• Google Analytics ve Search Console kur

90 GÜN — Stratejik:
• "Beşiktaş diş kliniği" için içerik stratejisi
• Aylık blog yazısı (diş sağlığı ipuçları)
• Rakip analizi ve fark yaratma
• Google Ads kampanyası başlat
• Aylık performans raporu sistemi`,
  package_recommendation: 'standart — Mobil yeniden tasarım + SEO + WhatsApp botu gerekiyor',
  estimated_monthly_loss: 45000,
  page_title: 'Beşiktaş Diş Kliniği',
  meta_description: null,
  has_ssl: true,
  has_mobile_menu: false,
  has_contact_form: false,
  has_whatsapp: false,
  has_google_analytics: false,
  has_pixel: false,
  created_at: new Date().toISOString(),
}
