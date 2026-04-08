import { createAdminSupabase } from '@/lib/supabase/server'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

const STAGES = [
  { key: 'new_lead', label: 'Yeni Lead', color: 'border-gray-700', badge: 'badge-blue' },
  { key: 'email_sent', label: 'Mail Gönderildi', color: 'border-purple-900', badge: 'badge-blue' },
  { key: 'email_opened', label: 'Mail Açıldı', color: 'border-yellow-900', badge: 'badge-yellow' },
  { key: 'demo_viewed', label: 'Demo Görüldü', color: 'border-orange-900', badge: 'badge-yellow' },
  { key: 'price_requested', label: 'Fiyat İstedi', color: 'border-red-900', badge: 'badge-red' },
  { key: 'meeting', label: 'Görüşme', color: 'border-blue-900', badge: 'badge-blue' },
  { key: 'payment_received', label: 'Ödeme Alındı', color: 'border-green-900', badge: 'badge-green' },
  { key: 'active_customer', label: 'Aktif Müşteri', color: 'border-green-800', badge: 'badge-green' },
]

async function getPipelineData() {
  const supabase = createAdminSupabase()

  const { data: leads } = await supabase
    .from('leads')
    .select('id, name, website, city, sector, pipeline_stage, updated_at, site_scores')
    .eq('is_archived', false)
    .order('updated_at', { ascending: false })

  return leads || []
}

export default async function PipelinePage() {
  let leads: Awaited<ReturnType<typeof getPipelineData>> = []
  try {
    leads = await getPipelineData()
  } catch {
    // Supabase bağlantısı yoksa boş göster
  }

  const byStage: Record<string, typeof leads> = {}
  for (const stage of STAGES) {
    byStage[stage.key] = leads.filter(l => l.pipeline_stage === stage.key)
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pipeline</h1>
          <p className="text-gray-500 text-sm mt-1">{leads.length} aktif lead</p>
        </div>
        <Link href="/scan" className="btn-primary">+ Yeni Tarama</Link>
      </div>

      {/* Yatay kaydırmalı pipeline */}
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '60vh' }}>
        {STAGES.map(stage => (
          <div key={stage.key} className="flex-shrink-0 w-64">
            {/* Sütun başlığı */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">{stage.label}</h3>
              <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
                {byStage[stage.key].length}
              </span>
            </div>

            {/* Kartlar */}
            <div className="space-y-3">
              {byStage[stage.key].length === 0 ? (
                <div className="border border-dashed border-gray-800 rounded-lg p-4 text-center text-gray-600 text-xs">
                  Boş
                </div>
              ) : (
                byStage[stage.key].map(lead => {
                  const score = (lead.site_scores as { genel?: number } | null)?.genel
                  const scoreColor = !score ? '#94a3b8'
                    : score < 4 ? '#ef4444'
                    : score < 6 ? '#eab308'
                    : '#22c55e'

                  return (
                    <Link
                      key={lead.id}
                      href={`/scan/result/${lead.id}`}
                      className={`block bg-gray-900 border ${stage.color} rounded-lg p-4 hover:border-blue-700 transition-all group`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors leading-tight">
                          {lead.name}
                        </h4>
                        {score !== undefined && (
                          <span className="text-xs font-bold ml-2 flex-shrink-0" style={{ color: scoreColor }}>
                            {score.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{lead.city}</p>
                      {lead.sector && (
                        <p className="text-xs text-gray-600">{lead.sector}</p>
                      )}
                      {lead.website && (
                        <div className="flex items-center gap-1 mt-2">
                          <ExternalLink className="w-3 h-3 text-gray-600" />
                          <span className="text-xs text-gray-600 truncate">{lead.website.replace(/^https?:\/\//, '')}</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-700 mt-2">
                        {new Date(lead.updated_at).toLocaleDateString('tr-TR')}
                      </p>
                    </Link>
                  )
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
