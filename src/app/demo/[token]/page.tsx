'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Clock, Phone, MapPin, Star, ExternalLink } from 'lucide-react'

interface DemoData {
  lead: {
    name: string
    website: string
    city: string
    district?: string
    sector?: string
    phone?: string
  }
  report: {
    demo_url: string
    demo_expires_at: string
  }
  analysis: {
    score_genel: number
    package_recommendation?: string
  }
  expired: boolean
  brand_name: string
  app_url: string
}

const SECTOR_ICONS: Record<string, string> = {
  'Diş Kliniği': '🦷',
  'Restoran': '🍽️',
  'Avukat': '⚖️',
  'Güzellik Salonu': '💅',
  'İnşaat': '🏗️',
  'Oto Galeri': '🚗',
  'Otel': '🏨',
  'Veteriner': '🐾',
  'Muhasebe': '📊',
  'Sağlık': '🏥',
}

export default function DemoPage() {
  const { token } = useParams()
  const [data, setData] = useState<DemoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [priceSent, setPriceSent] = useState(false)

  useEffect(() => {
    fetch(`/api/demo/${token}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token])

  const requestPrice = async () => {
    await fetch(`/api/demo/${token}/price-request`, { method: 'POST' })
    setPriceSent(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center text-white">
          <p className="text-xl font-bold mb-2">Demo bulunamadı</p>
          <p className="text-gray-400">Link geçersiz veya süresi dolmuş.</p>
        </div>
      </div>
    )
  }

  if (data.expired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-8">
        <div className="max-w-md text-center">
          <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Demo Süresi Doldu</h2>
          <p className="text-gray-400 mb-6">
            {data.lead.name} için hazırladığımız demo 7 günlük sürenin sonunda kaldırıldı.
          </p>
          <div className="card">
            <p className="text-gray-400 mb-4">Yeni bir demo için bizimle iletişime geçin:</p>
            <a
              href={`mailto:info@${data.app_url}?subject=Demo Talebi - ${data.lead.name}`}
              className="btn-primary inline-block"
            >
              Yeni Demo İste
            </a>
          </div>
        </div>
      </div>
    )
  }

  const { lead } = data
  const sectorIcon = SECTOR_ICONS[lead.sector || ''] || '🏢'
  const expiresAt = new Date(data.report.demo_expires_at)
  const daysLeft = Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / 86400000))

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Demo Banner */}
      <div className="bg-blue-900/50 border-b border-blue-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded font-bold">DEMO</span>
          <span className="text-blue-300">{data.brand_name} tarafından hazırlandı</span>
          <span className="text-gray-500">•</span>
          <Clock className="w-3 h-3 text-yellow-400" />
          <span className="text-yellow-300">{daysLeft} gün kaldı</span>
        </div>
        <button
          onClick={requestPrice}
          disabled={priceSent}
          className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-all ${
            priceSent
              ? 'bg-green-900 text-green-300 cursor-default'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {priceSent ? '✓ Talebiniz Alındı' : '💡 Fiyat İstiyorum'}
        </button>
      </div>

      {/* Demo Site İçeriği */}
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">{sectorIcon}</div>
          <h1 className="text-4xl font-bold text-white mb-3">{lead.name}</h1>
          <p className="text-xl text-gray-400">
            {lead.city}{lead.district ? ` / ${lead.district}` : ''} • {lead.sector || 'İşletme'}
          </p>
          {lead.phone && (
            <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-2 mt-4 text-blue-400 hover:text-blue-300">
              <Phone className="w-4 h-4" /> {lead.phone}
            </a>
          )}
        </div>

        {/* Hizmetler */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Hizmetlerimiz</h2>
          <div className="grid grid-cols-3 gap-4">
            {getSectorServices(lead.sector || '').map((service, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-blue-800 transition-all">
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="font-semibold text-white mb-2">{service.name}</h3>
                <p className="text-sm text-gray-500">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Neden Biz */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Neden Bizi Seçmelisiniz?</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: '⭐', title: 'Uzman Ekip', desc: '10+ yıl deneyimli profesyoneller' },
              { icon: '🏆', title: 'Kalite Güvencesi', desc: 'Müşteri memnuniyeti önceliğimiz' },
              { icon: '📞', title: '7/24 Destek', desc: 'Her zaman yanınızdayız' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Yorumlar */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Müşteri Yorumları</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Ayşe K.', stars: 5, text: 'Çok memnun kaldım, herkese tavsiye ederim.' },
              { name: 'Mehmet T.', stars: 5, text: 'Profesyonel ve güler yüzlü hizmet.' },
            ].map((review, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: review.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm mb-3">&ldquo;{review.text}&rdquo;</p>
                <p className="text-gray-500 text-xs font-medium">{review.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* İletişim */}
        <div className="bg-blue-900/30 border border-blue-800 rounded-2xl p-8 text-center">
          <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">{lead.city}{lead.district ? `, ${lead.district}` : ''}</h2>
          {lead.phone && (
            <a href={`tel:${lead.phone}`} className="text-blue-400 text-lg font-semibold block mb-4">{lead.phone}</a>
          )}
          <a href={lead.website} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            {lead.website} <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">Bu sitenin gerçeği olsun mu?</p>
          <p className="text-xs text-gray-400">{data.brand_name} ile profesyonel web sitesi</p>
        </div>
        <button
          onClick={requestPrice}
          disabled={priceSent}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            priceSent
              ? 'bg-green-900 text-green-300 cursor-default'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {priceSent ? '✓ Talebiniz Alındı' : '💡 Fiyat Almak İstiyorum'}
        </button>
      </div>
      <div className="h-20" /> {/* Sticky için boşluk */}
    </div>
  )
}

function getSectorServices(sector: string) {
  const map: Record<string, { icon: string; name: string; desc: string }[]> = {
    'Diş Kliniği': [
      { icon: '🦷', name: 'İmplant', desc: 'Kalıcı diş implant tedavisi' },
      { icon: '😁', name: 'Ortodonti', desc: 'Braces ve şeffaf plak' },
      { icon: '✨', name: 'Estetik Diş', desc: 'Beyazlatma ve veneer' },
    ],
    'Restoran': [
      { icon: '🍽️', name: 'Ana Yemekler', desc: 'Geleneksel Türk mutfağı' },
      { icon: '🥗', name: 'Salatalar', desc: 'Taze ve sağlıklı seçenekler' },
      { icon: '🎂', name: 'Tatlılar', desc: 'El yapımı tatlılar' },
    ],
    'Avukat': [
      { icon: '⚖️', name: 'Ceza Hukuku', desc: 'Profesyonel savunma' },
      { icon: '🏠', name: 'Gayrimenkul', desc: 'Tapu ve kira uyuşmazlıkları' },
      { icon: '💼', name: 'Şirket Hukuku', desc: 'Kurumsal hukuki danışmanlık' },
    ],
  }
  return map[sector] || [
    { icon: '✅', name: 'Hizmet 1', desc: 'Profesyonel çözümler' },
    { icon: '🎯', name: 'Hizmet 2', desc: 'Müşteri odaklı yaklaşım' },
    { icon: '💎', name: 'Hizmet 3', desc: 'Kaliteli ve güvenilir' },
  ]
}
