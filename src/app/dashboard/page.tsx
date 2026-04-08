import {
  Users, Mail, TrendingUp, DollarSign, ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { createAdminSupabase } from '@/lib/supabase/server'
import { PIPELINE_STAGES } from '@/types'

async function getDashboardData() {
  const supabase = createAdminSupabase()

  const [leadsRes, customersRes, emailsRes, paymentsRes] = await Promise.all([
    supabase.from('leads').select('pipeline_stage, updated_at, name, id').eq('is_archived', false),
    supabase.from('customers').select('id, subscription_active').eq('subscription_active', true),
    supabase.from('email_log').select('id').gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
    supabase.from('payments').select('id').eq('status', 'confirmed').gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
  ])

  const leads = leadsRes.data || []
  const activeCustomers = customersRes.data?.length || 0
  const weekEmails = emailsRes.data?.length || 0
  const weekPayments = paymentsRes.data?.length || 0

  // Pipeline sayıları
  const pipelineCounts: Record<string, number> = {}
  for (const stage of PIPELINE_STAGES) {
    pipelineCounts[stage.key] = leads.filter(l => l.pipeline_stage === stage.key).length
  }

  // Öncelikli firmalar (fiyat isteyen ve demo görülenler)
  const priority = leads
    .filter(l => ['price_requested', 'demo_viewed', 'email_opened'].includes(l.pipeline_stage))
    .slice(0, 3)
    .map(l => ({
      id: l.id,
      name: l.name,
      stage: l.pipeline_stage,
      reason: l.pipeline_stage === 'price_requested' ? 'Fiyat istedi, yanıt bekliyor'
        : l.pipeline_stage === 'demo_viewed' ? 'Demo\'ya baktı, takip et'
        : 'Mail açtı, ilgileniyor',
      urgency: l.pipeline_stage === 'price_requested' ? 'high' : 'medium',
    }))

  return {
    priority,
    weekStats: {
      scanned: leads.filter(l => {
        const d = new Date(l.updated_at)
        return Date.now() - d.getTime() < 7 * 86400000
      }).length,
      emails_sent: weekEmails,
      price_requests: pipelineCounts['price_requested'] || 0,
      payments: weekPayments,
    },
    pipelineCounts,
    activeCustomers,
  }
}

const STAGE_LABELS: Record<string, string> = {
  new_lead: 'Yeni Lead',
  email_sent: 'Mail Gönderildi',
  email_opened: 'Mail Açıldı',
  demo_viewed: 'Demo Görüldü',
  price_requested: 'Fiyat İstedi',
  meeting: 'Görüşme',
  payment_received: 'Ödeme Alındı',
  active_customer: 'Aktif Müşteri',
}

export default async function DashboardPage() {
  let data
  try {
    data = await getDashboardData()
  } catch {
    // Supabase bağlantısı yoksa demo veriler göster
    data = {
      priority: [],
      weekStats: { scanned: 0, emails_sent: 0, price_requests: 0, payments: 0 },
      pipelineCounts: {},
      activeCustomers: 0,
    }
  }

  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">{today}</p>
      </div>

      {/* Öncelikli Firmalar */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <div className="text-orange-400 text-lg">🔥</div>
          <h2 className="font-semibold text-white">Bugün Öncelikli Firmalar</h2>
        </div>
        {data.priority.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Henüz lead yok.</p>
            <Link href="/scan" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
              İlk taramayı başlat →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {data.priority.map((item, i) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-600">{i + 1}</span>
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${item.urgency === 'high' ? 'badge-red' : 'badge-yellow'}`}>
                    {STAGE_LABELS[item.stage] || item.stage}
                  </span>
                  <Link href={`/dashboard/leads/${item.id}`} className="text-gray-500 hover:text-blue-400">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-5 h-5 text-blue-400" />} label="Lead Sayısı" value={data.weekStats.scanned} sub="toplam aktif" />
        <StatCard icon={<Mail className="w-5 h-5 text-purple-400" />} label="Mail Gönderildi" value={data.weekStats.emails_sent} sub="bu hafta" />
        <StatCard icon={<TrendingUp className="w-5 h-5 text-orange-400" />} label="Fiyat Talebi" value={data.weekStats.price_requests} sub="bekliyor" />
        <StatCard icon={<DollarSign className="w-5 h-5 text-green-400" />} label="Aktif Müşteri" value={data.activeCustomers} sub="abonelik" />
      </div>

      {/* Pipeline */}
      <div className="card">
        <h2 className="font-semibold text-white mb-5">Pipeline Durumu</h2>
        <div className="grid grid-cols-4 gap-3">
          {PIPELINE_STAGES.map(stage => (
            <div key={stage.key} className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">{stage.label}</p>
              <p className="text-2xl font-bold text-white">{data.pipelineCounts[stage.key] || 0}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-800">
          <Link href="/dashboard/pipeline" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
            Tam pipeline görünümü <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Hızlı Başlat */}
      <div className="grid grid-cols-3 gap-4">
        <QuickAction href="/scan" icon="🔍" title="Yeni Tarama Başlat" desc="Sektör + ilçe seç, otomatik tara" />
        <QuickAction href="/scan?type=manual" icon="🔗" title="Manuel Site Analizi" desc="URL gir, anında analiz et" />
        <QuickAction href="/dashboard/customers/new" icon="➕" title="Yeni Müşteri Ekle" desc="Sıfırdan site veya mevcut" />
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: number; sub: string }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-3">{icon}<span className="text-sm text-gray-400">{label}</span></div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
    </div>
  )
}

function QuickAction({ href, icon, title, desc }: { href: string; icon: string; title: string; desc: string }) {
  return (
    <Link href={href} className="card hover:border-blue-800 transition-all group">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
    </Link>
  )
}
