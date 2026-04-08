'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Download, ExternalLink, TrendingUp, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { cn, scoreColor } from '@/lib/utils'

interface CustomerData {
  customer: {
    company_name: string
    sector?: string
    subscription_plan?: string
    subscription_active: boolean
  }
  lead: {
    id: string
    name: string
    website: string
    city: string
  }
  analyses: Array<{
    id: string
    score_genel: number
    created_at: string
  }>
  reports: Array<{
    id: string
    pdf_url?: string
    demo_url?: string
    created_at: string
  }>
  latestAnalysis: {
    score_genel: number
    score_hiz: number
    score_mobil: number
    score_seo: number
    score_ux: number
    score_icerik: number
    score_erisilebilirlik: number
    score_guvenlik: number
    score_donusum: number
    score_ab_test: number
    package_recommendation?: string
  } | null
}

const SCORE_ITEMS = [
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

const PLAN_LABELS: Record<string, string> = {
  temel: 'Temel Paket',
  standart: 'Standart Paket',
  premium: 'Premium Paket',
}

export default function CustomerPortalPage() {
  const { token } = useParams()
  const [data, setData] = useState<CustomerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/musteri/${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error)
        else setData(d)
        setLoading(false)
      })
      .catch(() => { setError('Bağlantı hatası'); setLoading(false) })
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-8">
        <div className="text-center">
          <p className="text-xl font-bold text-white mb-2">Erişim Hatası</p>
          <p className="text-gray-400">{error || 'Portal bulunamadı. Link geçersiz olabilir.'}</p>
        </div>
      </div>
    )
  }

  const { customer, lead, analyses, reports, latestAnalysis } = data
  const chartData = analyses.map(a => ({
    tarih: new Date(a.created_at).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' }),
    puan: Number(a.score_genel.toFixed(1)),
  })).reverse()

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-blue-400 font-medium mb-1">Müşteri Paneli</p>
            <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
            <a href={lead.website} target="_blank" rel="noopener noreferrer"
               className="text-gray-500 hover:text-gray-300 text-sm flex items-center gap-1 mt-1">
              {lead.website} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="text-right">
            <span className={`badge ${customer.subscription_active ? 'badge-green' : 'badge-red'}`}>
              {customer.subscription_active ? 'Aktif Abonelik' : 'Pasif'}
            </span>
            {customer.subscription_plan && (
              <p className="text-xs text-gray-500 mt-1">{PLAN_LABELS[customer.subscription_plan] || customer.subscription_plan}</p>
            )}
          </div>
        </div>

        {/* Güncel Puan */}
        {latestAnalysis && (
          <div className="card">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <div className={cn('text-5xl font-bold', scoreColor(latestAnalysis.score_genel))}>
                  {latestAnalysis.score_genel.toFixed(1)}
                </div>
                <div className="text-gray-500 text-xs mt-1">Güncel Puan</div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Kriter Puanları</h3>
                <div className="grid grid-cols-3 gap-2">
                  {SCORE_ITEMS.map(({ key, label }) => {
                    const score = latestAnalysis[key as keyof typeof latestAnalysis] as number || 0
                    const color = score < 4 ? '#ef4444' : score < 6 ? '#eab308' : '#22c55e'
                    return (
                      <div key={key} className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{label}</span>
                        <span style={{ color }} className="font-bold">{score.toFixed(1)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Puan Grafiği */}
        {chartData.length > 1 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <h3 className="font-medium text-white">Puan Gelişimi</h3>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <XAxis dataKey="tarih" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[0, 10]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1f2937', border: '1px solid #374151', color: '#f9fafb' }}
                />
                <Line type="monotone" dataKey="puan" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Raporlar */}
        <div className="card">
          <h3 className="font-medium text-white mb-4">Aylık Raporlar</h3>
          {reports.length === 0 ? (
            <p className="text-gray-500 text-sm">Henüz rapor hazırlanmamış.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((report, i) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {i === 0 ? 'Güncel Rapor' : `Rapor — ${new Date(report.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(report.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {report.demo_url && (
                      <a href={report.demo_url} target="_blank" rel="noopener noreferrer"
                         className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        Demo <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <a href={`/api/reports/pdf/${lead.id}`} target="_blank"
                       className="flex items-center gap-1 text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg transition-all">
                      <Download className="w-3 h-3" /> PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* İletişim */}
        <div className="card text-center">
          <p className="text-gray-400 text-sm mb-3">Sorunuz mu var? Hemen ulaşın:</p>
          <a
            href={`mailto:info@${process.env.NEXT_PUBLIC_BRAND_DOMAIN || 'siteboost.app'}?subject=Müşteri Destek - ${lead.name}`}
            className="btn-primary inline-block"
          >
            Destek Talebi Oluştur
          </a>
        </div>

      </div>
    </div>
  )
}
