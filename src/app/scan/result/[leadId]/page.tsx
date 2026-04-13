'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Loader2, CheckCircle, XCircle, AlertCircle,
  Download, Mail, ExternalLink, ChevronDown, ChevronUp
} from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts'
import { cn, scoreColor } from '@/lib/utils'

interface Analysis {
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
  seo_analysis: string
  content_analysis: string
  improvement_doc: string
  action_plan: string
  package_recommendation: string
  estimated_monthly_loss: number
  page_title: string
  has_ssl: boolean
  has_mobile_menu: boolean
  has_contact_form: boolean
  has_whatsapp: boolean
  has_google_analytics: boolean
}

interface Lead {
  id: string
  name: string
  website: string
  city: string
  district: string
  sector: string
  pipeline_stage: string
}

const SCORE_LABELS: { key: string; label: string }[] = [
  { key: 'score_hiz', label: 'Hız' },
  { key: 'score_mobil', label: 'Mobil' },
  { key: 'score_seo', label: 'SEO' },
  { key: 'score_ux', label: 'UX' },
  { key: 'score_icerik', label: 'İçerik' },
  { key: 'score_erisilebilirlik', label: 'Erişilebilirlik' },
  { key: 'score_guvenlik', label: 'Güvenlik' },
  { key: 'score_donusum', label: 'Dönüşüm' },
  { key: 'score_ab_test', label: 'A/B Test' },
]

function ScoreBadge({ score }: { score: number }) {
  const color = score < 4 ? 'badge-red' : score < 6 ? 'badge-yellow' : score < 8 ? 'badge-green' : 'badge-blue'
  const label = score < 4 ? 'Kritik' : score < 6 ? 'Geliştirilmeli' : score < 8 ? 'İyi' : 'Çok İyi'
  return <span className={`badge ${color}`}>{label}</span>
}

export default function ScanResultPage() {
  const { leadId } = useParams()
  const [lead, setLead] = useState<Lead | null>(null)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [polling, setPolling] = useState(true)
  const [showImprovement, setShowImprovement] = useState(false)
  const [showActionPlan, setShowActionPlan] = useState(false)
  const [emailSending, setEmailSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState('')

  const sendEmail = async () => {
    setEmailSending(true)
    setEmailError('')
    try {
      const res = await fetch(`/api/leads/${leadId}/send-email`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setEmailSent(true)
      } else {
        setEmailError(data.error || 'Mail gönderilemedi')
      }
    } catch {
      setEmailError('Bağlantı hatası')
    } finally {
      setEmailSending(false)
    }
  }

  useEffect(() => {
    if (!leadId) return
    let attempts = 0

    const poll = async () => {
      attempts++
      const res = await fetch(`/api/leads/${leadId}/analysis`)
      const data = await res.json()
      setLead(data.lead)

      if (data.analysis) {
        setAnalysis(data.analysis)
        setPolling(false)
        setLoading(false)
      } else if (attempts >= 20) {
        // 20 denemeden sonra dur (60 saniye)
        setPolling(false)
        setLoading(false)
      }
    }

    poll()
    const interval = setInterval(() => {
      if (polling) poll()
    }, 3000)

    // Max 1 dakika bekle
    const timeout = setTimeout(() => {
      setPolling(false)
      setLoading(false)
    }, 60000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [leadId, polling])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Site Analiz Ediliyor...</h2>
          <p className="text-gray-400">9 kriter kontrol ediliyor, AI analizi yapılıyor</p>
        </div>
        <div className="w-64 space-y-2">
          {['PageSpeed analizi', 'SSL ve güvenlik', 'SEO kontrol', 'AI değerlendirmesi'].map((step) => (
            <div key={step} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <span className="text-sm text-gray-400">{step}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!analysis || !lead) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white">Analiz Bulunamadı</h2>
          <p className="text-gray-400 mt-2">Site analizi tamamlanamadı veya bulunamadı</p>
        </div>
      </div>
    )
  }

  const radarData = SCORE_LABELS.map(({ key, label }) => ({
    subject: label,
    value: (analysis[key as keyof Analysis] as number) || 0,
  }))

  const barData = SCORE_LABELS.map(({ key, label }) => ({
    name: label,
    value: (analysis[key as keyof Analysis] as number) || 0,
  }))

  const genel = analysis.score_genel

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Firma Başlığı */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 mt-1"
            >
              {lead.website} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="flex gap-3">
            <a
              href={`/api/reports/pdf/${leadId}`}
              target="_blank"
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> PDF İndir
            </a>
            <a
              href={`/scan/result/${leadId}/review`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium btn-primary"
            >
              <Mail className="w-4 h-4" /> Demo İncele & Gönder
            </a>
          </div>
        </div>

        {/* Genel Puan */}
        <div className="card flex items-center gap-6">
          <div className="text-center">
            <div className={cn(
              'text-6xl font-bold',
              scoreColor(genel)
            )}>
              {genel.toFixed(1)}
            </div>
            <div className="text-gray-500 text-sm mt-1">Genel Puan /10</div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <ScoreBadge score={genel} />
              {analysis.has_ssl ? (
                <span className="badge badge-green">SSL ✓</span>
              ) : (
                <span className="badge badge-red">SSL Yok ✗</span>
              )}
              {analysis.has_mobile_menu && <span className="badge badge-green">Mobil Menü ✓</span>}
              {analysis.has_whatsapp && <span className="badge badge-green">WhatsApp ✓</span>}
            </div>
            <p className="text-gray-400 text-sm">{lead.city} • {lead.sector}</p>
            {analysis.estimated_monthly_loss > 0 && (
              <div className="mt-3 p-3 bg-red-900/20 border border-red-800 rounded-lg">
                <p className="text-red-300 text-sm font-medium">
                  Tahmini aylık gelir kaybı:
                  <span className="text-red-200 font-bold ml-1">
                    ~{analysis.estimated_monthly_loss.toLocaleString('tr-TR')}₺
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Puan Tablosu */}
        <div className="grid grid-cols-3 gap-4">
          {SCORE_LABELS.map(({ key, label }) => {
            const score = (analysis[key as keyof Analysis] as number) || 0
            const color = score < 4 ? '#ef4444' : score < 6 ? '#eab308' : score < 8 ? '#22c55e' : '#3b82f6'
            return (
              <div key={key} className="card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{label}</span>
                  <span className="font-bold text-white">{score.toFixed(1)}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${score * 10}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Grafikler */}
        <div className="grid grid-cols-2 gap-6">
          {/* Radar Grafik */}
          <div className="card">
            <h3 className="font-medium text-white mb-4">Radar Analizi</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Radar
                  name="Puan"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Grafik */}
          <div className="card">
            <h3 className="font-medium text-white mb-4">Kriter Puanları</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" domain={[0, 10]} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{ background: '#1f2937', border: '1px solid #374151', color: '#f9fafb' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {barData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.value < 4 ? '#ef4444' : entry.value < 6 ? '#eab308' : entry.value < 8 ? '#22c55e' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Analizi */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <h3 className="font-medium text-white mb-3">SEO Değerlendirmesi</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{analysis.seo_analysis}</p>
          </div>
          <div className="card">
            <h3 className="font-medium text-white mb-3">İçerik Kalitesi</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{analysis.content_analysis}</p>
          </div>
        </div>

        {/* Paket Önerisi */}
        <div className="card bg-blue-900/20 border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <h3 className="font-medium text-white">Önerilen Paket</h3>
          </div>
          <p className="text-blue-300 font-semibold capitalize">{analysis.package_recommendation}</p>
        </div>

        {/* İyileştirme Dökümanı (Admin Only) */}
        <div className="card border-orange-900/50 bg-orange-900/10">
          <button
            onClick={() => setShowImprovement(!showImprovement)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-400" />
              <h3 className="font-medium text-white">İyileştirme Dökümanı</h3>
              <span className="badge badge-yellow">Sadece Sen Görürsün</span>
            </div>
            {showImprovement ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {showImprovement && (
            <div className="mt-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {analysis.improvement_doc}
            </div>
          )}
        </div>

        {/* Aksiyon Planı (Admin Only) */}
        <div className="card border-purple-900/50 bg-purple-900/10">
          <button
            onClick={() => setShowActionPlan(!showActionPlan)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-purple-400" />
              <h3 className="font-medium text-white">30/60/90 Günlük Aksiyon Planı</h3>
              <span className="badge badge-blue">Sadece Sen Görürsün</span>
            </div>
            {showActionPlan ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {showActionPlan && (
            <div className="mt-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {analysis.action_plan}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
