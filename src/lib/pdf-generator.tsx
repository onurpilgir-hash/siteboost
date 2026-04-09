import React from 'react'
import {
  Document, Page, Text, View, StyleSheet, Font,
} from '@react-pdf/renderer'

import path from 'path'

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: path.join(process.cwd(), 'public/fonts/Arial.ttf'),
      fontWeight: 'normal',
    },
    {
      src: path.join(process.cwd(), 'public/fonts/Arial-Bold.ttf'),
      fontWeight: 'bold',
    },
  ],
})

// Renkler
const COLORS = {
  bg: '#0f172a',
  card: '#1e293b',
  border: '#334155',
  white: '#f8fafc',
  gray: '#94a3b8',
  grayLight: '#64748b',
  blue: '#3b82f6',
  red: '#ef4444',
  yellow: '#eab308',
  green: '#22c55e',
  orange: '#f97316',
}

function scoreColor(score: number) {
  if (score < 4) return COLORS.red
  if (score < 6) return COLORS.yellow
  if (score < 8) return COLORS.green
  return COLORS.blue
}

function scoreLabel(score: number) {
  if (score < 4) return 'Kritik'
  if (score < 6) return 'Geliştirilmeli'
  if (score < 8) return 'İyi'
  return 'Çok İyi'
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.bg,
    color: COLORS.white,
    fontFamily: 'Roboto',
    padding: 40,
  },
  // Kapak
  coverPage: {
    backgroundColor: COLORS.bg,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  coverHeader: {
    backgroundColor: COLORS.blue,
    padding: 40,
    marginBottom: 0,
  },
  coverBrand: { fontSize: 14, color: '#bfdbfe', marginBottom: 8 },
  coverTitle: { fontSize: 28, color: COLORS.white, fontFamily: 'Roboto', fontWeight: 'bold', marginBottom: 4 },
  coverSubtitle: { fontSize: 14, color: '#bfdbfe' },
  coverBody: { padding: 40 },
  coverScore: { fontSize: 72, fontFamily: 'Roboto', fontWeight: 'bold', marginBottom: 4 },
  coverScoreLabel: { fontSize: 16, color: COLORS.gray, marginBottom: 24 },
  coverInfo: { flexDirection: 'row', gap: 20, marginBottom: 16 },
  coverInfoItem: { flex: 1, backgroundColor: COLORS.card, padding: 16, borderRadius: 8 },
  coverInfoLabel: { fontSize: 10, color: COLORS.gray, marginBottom: 4 },
  coverInfoValue: { fontSize: 13, color: COLORS.white, fontFamily: 'Roboto', fontWeight: 'bold' },
  coverWarning: {
    backgroundColor: '#450a0a',
    borderWidth: 1,
    borderColor: '#991b1b',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  coverWarningText: { fontSize: 13, color: '#fca5a5', fontFamily: 'Roboto', fontWeight: 'bold' },

  // Genel
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Roboto', fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },

  // Puan tablosu
  scoreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  scoreItem: {
    width: '30%',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  scoreItemLabel: { fontSize: 10, color: COLORS.gray, marginBottom: 6 },
  scoreItemValue: { fontSize: 22, fontFamily: 'Roboto', fontWeight: 'bold', marginBottom: 4 },
  scoreBar: { height: 4, backgroundColor: COLORS.border, borderRadius: 2 },
  scoreBarFill: { height: 4, borderRadius: 2 },

  // Genel puan
  overallScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  overallNumber: { fontSize: 56, fontFamily: 'Roboto', fontWeight: 'bold' },
  overallLabel: { fontSize: 12, color: COLORS.gray },

  // Badges
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, borderWidth: 1 },
  badgeText: { fontSize: 9 },

  // AI Analiz
  analysisText: {
    fontSize: 11,
    color: '#cbd5e1',
    lineHeight: 1.6,
    marginBottom: 8,
  },

  // Kayıp kutusu
  lossBox: {
    backgroundColor: '#450a0a',
    borderWidth: 1,
    borderColor: '#991b1b',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  lossTitle: { fontSize: 11, color: '#fca5a5', marginBottom: 4 },
  lossAmount: { fontSize: 24, color: '#f87171', fontFamily: 'Roboto', fontWeight: 'bold' },

  // CTA butonu
  ctaBox: {
    backgroundColor: COLORS.blue,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  ctaTitle: { fontSize: 16, color: COLORS.white, fontFamily: 'Roboto', fontWeight: 'bold', marginBottom: 4 },
  ctaSubtitle: { fontSize: 11, color: '#bfdbfe' },

  // Demo link
  demoBox: {
    backgroundColor: '#1e3a5f',
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  demoLabel: { fontSize: 10, color: '#93c5fd', marginBottom: 4 },
  demoUrl: { fontSize: 12, color: COLORS.white, fontFamily: 'Roboto', fontWeight: 'bold' },
  demoExpiry: { fontSize: 9, color: '#60a5fa', marginTop: 4 },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  footerText: { fontSize: 9, color: COLORS.grayLight },

  // İyileştirme dökümanı
  improvementItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  improvementTitle: { fontSize: 12, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.white, marginBottom: 6 },
  improvementText: { fontSize: 10, color: '#cbd5e1', lineHeight: 1.5 },

  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
})

const SCORE_ITEMS = [
  { key: 'score_hiz', label: 'Hız' },
  { key: 'score_mobil', label: 'Mobil Uyumluluk' },
  { key: 'score_seo', label: 'SEO' },
  { key: 'score_ux', label: 'Kullanıcı Deneyimi' },
  { key: 'score_icerik', label: 'İçerik Kalitesi' },
  { key: 'score_erisilebilirlik', label: 'Erişilebilirlik' },
  { key: 'score_guvenlik', label: 'Güvenlik' },
  { key: 'score_donusum', label: 'Dönüşüm' },
  { key: 'score_ab_test', label: 'A/B Test Hazırlığı' },
]

export interface PDFData {
  lead: {
    name: string
    website: string
    city: string
    district?: string
    sector?: string
  }
  analysis: {
    score_hiz: number
    score_mobil: number
    score_seo: number
    score_ux: number
    score_icerik: number
    score_erisilebilirlik: number
    score_guvenlik: number
    score_donusum: number
    score_ab_test: number
    score_genel: number
    seo_analysis?: string
    content_analysis?: string
    package_recommendation?: string
    estimated_monthly_loss?: number
    has_ssl?: boolean
    has_whatsapp?: boolean
    has_contact_form?: boolean
    has_mobile_menu?: boolean
    has_google_analytics?: boolean
  }
  demoUrl?: string
  demoExpiresAt?: string
  brandName?: string
  appUrl?: string
}

export function SiteBoostPDF({ data }: { data: PDFData }) {
  const { lead, analysis } = data
  const brandName = data.brandName || 'SiteBoost'
  const genel = analysis.score_genel
  const today = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <Document>
      {/* SAYFA 1 — KAPAK */}
      <Page size="A4" style={styles.page}>
        {/* Başlık */}
        <View style={styles.coverHeader}>
          <Text style={styles.coverBrand}>{brandName} — Ücretsiz Site Analizi</Text>
          <Text style={styles.coverTitle}>{lead.name}</Text>
          <Text style={styles.coverSubtitle}>{lead.website}</Text>
        </View>

        <View style={styles.coverBody}>
          {/* Genel Puan */}
          <View style={styles.overallScore}>
            <View>
              <Text style={[styles.overallNumber, { color: scoreColor(genel) }]}>
                {genel.toFixed(1)}
              </Text>
              <Text style={styles.overallLabel}>Genel Puan / 10</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontFamily: 'Roboto', fontWeight: 'bold', color: scoreColor(genel), marginBottom: 8 }}>
                {scoreLabel(genel)}
              </Text>
              <Text style={{ fontSize: 11, color: COLORS.gray, lineHeight: 1.5 }}>
                {lead.city}{lead.district ? ` / ${lead.district}` : ''} • {lead.sector || 'İşletme'} • {today}
              </Text>
              {/* Badges */}
              <View style={styles.badgeRow}>
                {analysis.has_ssl && (
                  <View style={[styles.badge, { backgroundColor: '#14532d', borderColor: '#166534' }]}>
                    <Text style={[styles.badgeText, { color: '#86efac' }]}>SSL ✓</Text>
                  </View>
                )}
                {analysis.has_whatsapp && (
                  <View style={[styles.badge, { backgroundColor: '#14532d', borderColor: '#166534' }]}>
                    <Text style={[styles.badgeText, { color: '#86efac' }]}>WhatsApp ✓</Text>
                  </View>
                )}
                {analysis.has_mobile_menu && (
                  <View style={[styles.badge, { backgroundColor: '#14532d', borderColor: '#166534' }]}>
                    <Text style={[styles.badgeText, { color: '#86efac' }]}>Mobil Menü ✓</Text>
                  </View>
                )}
                {!analysis.has_ssl && (
                  <View style={[styles.badge, { backgroundColor: '#450a0a', borderColor: '#991b1b' }]}>
                    <Text style={[styles.badgeText, { color: '#fca5a5' }]}>SSL YOK ✗</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Gelir Kaybı */}
          {(analysis.estimated_monthly_loss || 0) > 0 && (
            <View style={styles.lossBox}>
              <Text style={styles.lossTitle}>Tahmini Aylık Gelir Kaybı</Text>
              <Text style={styles.lossAmount}>
                ~{(analysis.estimated_monthly_loss || 0).toLocaleString('tr-TR')}₺
              </Text>
              <Text style={{ fontSize: 10, color: '#fca5a5', marginTop: 4 }}>
                Düşük site performansı nedeniyle kaçırılan müşteri geliri tahmini
              </Text>
            </View>
          )}

          {/* Demo Link */}
          {data.demoUrl && (
            <View style={styles.demoBox}>
              <Text style={styles.demoLabel}>Ücretsiz Demo Siteniz Hazır</Text>
              <Text style={styles.demoUrl}>{data.demoUrl}</Text>
              {data.demoExpiresAt && (
                <Text style={styles.demoExpiry}>
                  ⏰ {new Date(data.demoExpiresAt).toLocaleDateString('tr-TR')} tarihine kadar aktif
                </Text>
              )}
            </View>
          )}

          {/* CTA */}
          <View style={styles.ctaBox}>
            <Text style={styles.ctaTitle}>Fiyat Almak İstiyorum</Text>
            <Text style={styles.ctaSubtitle}>
              Bu raporu aldıktan sonra bize ulaşın, size özel teklif hazırlayalım
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{brandName} — Profesyonel Web Çözümleri</Text>
          <Text style={styles.footerText}>1 / 3</Text>
        </View>
      </Page>

      {/* SAYFA 2 — PUAN TABLOSU */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detaylı Puan Analizi</Text>

          <View style={[styles.scoreGrid, { flexDirection: 'row', flexWrap: 'wrap' }]}>
            {SCORE_ITEMS.map(({ key, label }) => {
              const score = (analysis[key as keyof typeof analysis] as number) || 0
              const color = scoreColor(score)
              return (
                <View key={key} style={[styles.scoreItem, { width: '31%' }]}>
                  <Text style={styles.scoreItemLabel}>{label}</Text>
                  <Text style={[styles.scoreItemValue, { color }]}>{score.toFixed(1)}</Text>
                  <View style={styles.scoreBar}>
                    <View style={[styles.scoreBarFill, { width: `${score * 10}%`, backgroundColor: color }]} />
                  </View>
                  <Text style={{ fontSize: 9, color, marginTop: 3 }}>{scoreLabel(score)}</Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* AI Analizleri */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uzman Değerlendirmesi</Text>
          <View style={styles.row}>
            <View style={[styles.card, styles.col]}>
              <Text style={{ fontSize: 11, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.white, marginBottom: 6 }}>
                SEO Durumu
              </Text>
              <Text style={styles.analysisText}>{analysis.seo_analysis || 'Analiz bekleniyor...'}</Text>
            </View>
            <View style={[styles.card, styles.col]}>
              <Text style={{ fontSize: 11, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.white, marginBottom: 6 }}>
                İçerik Kalitesi
              </Text>
              <Text style={styles.analysisText}>{analysis.content_analysis || 'Analiz bekleniyor...'}</Text>
            </View>
          </View>
        </View>

        {/* Önerilen Paket */}
        {analysis.package_recommendation && (
          <View style={[styles.card, { backgroundColor: '#1e3a5f', borderColor: '#1d4ed8' }]}>
            <Text style={{ fontSize: 11, color: '#93c5fd', marginBottom: 4 }}>Önerilen Paket</Text>
            <Text style={{ fontSize: 16, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.white, textTransform: 'capitalize' }}>
              {analysis.package_recommendation.split(' ')[0]}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>{brandName} — {lead.name}</Text>
          <Text style={styles.footerText}>2 / 3</Text>
        </View>
      </Page>

      {/* SAYFA 3 — ÖNCE/SONRA + CTA */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Önce / Sonra Karşılaştırması</Text>
          <Text style={{ fontSize: 10, color: COLORS.gray, marginBottom: 12 }}>
            Profesyonel optimizasyon sonrası beklenen puanlar
          </Text>

          {SCORE_ITEMS.map(({ key, label }) => {
            const current = (analysis[key as keyof typeof analysis] as number) || 0
            // Tahmini iyileştirilmiş puan
            const improved = Math.min(current + (10 - current) * 0.6, 9.5)
            return (
              <View key={key} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 10, color: COLORS.gray }}>{label}</Text>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Text style={{ fontSize: 10, color: scoreColor(current) }}>
                      Şu an: {current.toFixed(1)}
                    </Text>
                    <Text style={{ fontSize: 10, color: COLORS.green }}>
                      Sonra: {improved.toFixed(1)} ↑
                    </Text>
                  </View>
                </View>
                {/* Şu an bar */}
                <View style={{ height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginBottom: 3 }}>
                  <View style={{
                    height: 6, borderRadius: 3,
                    width: `${current * 10}%`,
                    backgroundColor: scoreColor(current)
                  }} />
                </View>
                {/* Sonra bar */}
                <View style={{ height: 6, backgroundColor: COLORS.border, borderRadius: 3 }}>
                  <View style={{
                    height: 6, borderRadius: 3,
                    width: `${improved * 10}%`,
                    backgroundColor: COLORS.green,
                    opacity: 0.6
                  }} />
                </View>
              </View>
            )
          })}
        </View>

        {/* Final CTA */}
        <View style={[styles.ctaBox, { marginTop: 24 }]}>
          <Text style={styles.ctaTitle}>Ücretsiz Demo Sitenizi Görün</Text>
          <Text style={[styles.ctaSubtitle, { marginBottom: 8 }]}>
            Sitenizin nasıl görünebileceğini hemen inceleyin
          </Text>
          {data.demoUrl && (
            <Text style={{ fontSize: 12, color: '#bfdbfe', textDecoration: 'underline' }}>
              {data.demoUrl}
            </Text>
          )}
          <Text style={[styles.ctaSubtitle, { marginTop: 8 }]}>
            Fiyat için: bize yanıt gönderin veya Fiyat Istiyorum butonuna tiklayin
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{brandName} — {today}</Text>
          <Text style={styles.footerText}>3 / 3</Text>
        </View>
      </Page>
    </Document>
  )
}
