// ============================================
// SiteBoost Manager — TypeScript Tipleri
// ============================================

// --- CRM Pipeline Aşamaları ---
export type PipelineStage =
  | 'new_lead'
  | 'email_sent'
  | 'email_opened'
  | 'demo_viewed'
  | 'price_requested'
  | 'meeting'
  | 'payment_received'
  | 'active_customer'

export const PIPELINE_STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: 'new_lead', label: 'Yeni Lead', color: '#94a3b8' },
  { key: 'email_sent', label: 'Mail Gönderildi', color: '#60a5fa' },
  { key: 'email_opened', label: 'Mail Açıldı', color: '#34d399' },
  { key: 'demo_viewed', label: 'Demo Görüldü', color: '#a78bfa' },
  { key: 'price_requested', label: 'Fiyat İstedi', color: '#fb923c' },
  { key: 'meeting', label: 'Görüşme', color: '#f472b6' },
  { key: 'payment_received', label: 'Ödeme Alındı', color: '#4ade80' },
  { key: 'active_customer', label: 'Aktif Müşteri', color: '#22c55e' },
]

// --- Sektörler ---
export type Sector =
  | 'dis_klinigi'
  | 'restoran'
  | 'avukat'
  | 'guzellik_salonu'
  | 'insaat'
  | 'oto_galeri'
  | 'saglik_klinik'
  | 'otel'
  | 'muhasebe'
  | 'veteriner'
  | 'genel'

export const SECTORS: { key: Sector; label: string; emoji: string }[] = [
  { key: 'dis_klinigi', label: 'Diş Kliniği', emoji: '🦷' },
  { key: 'restoran', label: 'Restoran / Kafe', emoji: '🍽️' },
  { key: 'avukat', label: 'Avukat / Hukuk Bürosu', emoji: '⚖️' },
  { key: 'guzellik_salonu', label: 'Güzellik Salonu / Kuaför', emoji: '💄' },
  { key: 'insaat', label: 'İnşaat / Müteahhit', emoji: '🏗️' },
  { key: 'oto_galeri', label: 'Oto Galeri', emoji: '🚗' },
  { key: 'saglik_klinik', label: 'Sağlık / Klinik', emoji: '🏥' },
  { key: 'otel', label: 'Otel / Pansiyon', emoji: '🏨' },
  { key: 'muhasebe', label: 'Muhasebe / Mali Müşavir', emoji: '📊' },
  { key: 'veteriner', label: 'Veteriner', emoji: '🐾' },
  { key: 'genel', label: 'Genel İşletme', emoji: '🏢' },
]

// --- Puanlama Kriterleri ---
export interface SiteScores {
  hiz: number           // %15 — Google PageSpeed
  mobil: number         // %15 — Google PageSpeed
  seo: number           // %15 — Başlık + meta + Claude
  kullanici_deneyimi: number  // %12 — UX kuralları
  icerik_kalitesi: number    // %10 — Claude
  erisilebilirlik: number    // %10 — axe-core
  guvenlik: number      // %10 — HTTPS + başlıklar
  donusum: number       // %8  — Form, CTA, WhatsApp
  ab_test: number       // %5  — Pixel, analitik
  genel: number         // Ağırlıklı ortalama
}

export const SCORE_WEIGHTS = {
  hiz: 0.15,
  mobil: 0.15,
  seo: 0.15,
  kullanici_deneyimi: 0.12,
  icerik_kalitesi: 0.10,
  erisilebilirlik: 0.10,
  guvenlik: 0.10,
  donusum: 0.08,
  ab_test: 0.05,
}

export function getScoreColor(score: number): string {
  if (score < 4) return '#ef4444'  // Kırmızı - Kritik
  if (score < 6) return '#eab308'  // Sarı - Geliştirilmeli
  if (score < 8) return '#22c55e'  // Yeşil - İyi
  return '#3b82f6'                 // Mavi - Çok İyi
}

export function getScoreLabel(score: number): string {
  if (score < 4) return 'Kritik'
  if (score < 6) return 'Geliştirilmeli'
  if (score < 8) return 'İyi'
  return 'Çok İyi'
}

// --- Lead (Potansiyel Müşteri) ---
export interface Lead {
  id: string
  created_at: string
  updated_at: string

  // Firma Bilgileri
  name: string
  website?: string
  phone?: string
  email?: string
  address?: string
  city: string
  district: string
  sector: Sector

  // Google Maps Verileri
  google_rating?: number
  google_review_count?: number
  google_maps_url?: string
  years_open?: number
  has_website: boolean

  // Puanlama
  site_scores?: SiteScores
  lead_score?: number  // 0-85 satış kolaylığı skoru

  // CRM
  pipeline_stage: PipelineStage

  // İlişkili Kayıtlar
  scan_job_id?: string
  latest_report_id?: string
  latest_demo_url?: string
  demo_expires_at?: string

  // Özel Notlar
  notes?: string
}

// --- Tarama İşi ---
export interface ScanJob {
  id: string
  created_at: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  type: 'auto' | 'manual'  // Senaryo 1 veya 2

  // Senaryo 1 için
  city?: string
  district?: string
  sector?: Sector

  // Senaryo 2 için
  manual_url?: string

  // İstatistikler
  total_found: number
  total_scanned: number
  total_qualified: number  // Puan < 7, mail atılacak
  total_skipped: number    // Puan >= 7, elendi

  error?: string
}

// --- Site Analizi ---
export interface SiteAnalysis {
  id: string
  created_at: string
  lead_id: string

  // Puanlar
  scores: SiteScores

  // Claude Analizi
  seo_analysis?: string
  content_analysis?: string
  improvement_doc?: string  // Sadece admin görür
  action_plan?: string      // Sadece admin görür

  // PageSpeed Ham Veri
  pagespeed_data?: Record<string, unknown>

  // Rakip Analizi (Sadece Admin)
  competitor_analysis?: string

  // Gelir Kaybı Tahmini
  estimated_monthly_loss?: number
}

// --- Rapor ---
export interface Report {
  id: string
  created_at: string
  lead_id: string

  pdf_url?: string
  demo_url?: string
  demo_expires_at?: string
  demo_token: string

  // Durum
  is_active: boolean
  view_count: number
  last_viewed_at?: string
}

// --- Müşteri (Ödeme Yapmış) ---
export interface Customer {
  id: string
  lead_id: string
  created_at: string

  // Paket
  package_type: 'temel' | 'standart' | 'premium'
  scenario: 1 | 2 | 3
  monthly_fee: number
  setup_fee: number

  // Portal Erişimi
  portal_token: string

  // Site Bilgileri
  site_url?: string
  wordpress_admin_url?: string

  // Abonelik
  subscription_active: boolean
  next_payment_date?: string
  cancellation_requested?: boolean
}

// --- Mail Logu ---
export interface EmailLog {
  id: string
  created_at: string
  lead_id: string

  type: 'initial' | 'followup_day3' | 'demo_expiry_day7' | 'package_info' | 'last_chance'
  subject: string
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced'
  opened_at?: string
  clicked_at?: string
  resend_id?: string
}

// --- Dashboard Özet ---
export interface DashboardSummary {
  today_priority: {
    lead_id: string
    name: string
    reason: string
    urgency: 'high' | 'medium'
  }[]
  week_stats: {
    scanned: number
    emails_sent: number
    price_requests: number
    payments: number
  }
  pipeline_counts: Record<PipelineStage, number>
  active_customers: number
  monthly_revenue: number
}
