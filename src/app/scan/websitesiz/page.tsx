'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Phone, Star, Loader2, ArrowLeft, MessageCircle, Globe, ChevronRight } from 'lucide-react'
import { SECTORS } from '@/types'

const ISTANBUL_DISTRICTS = [
  'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar',
  'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş',
  'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Çatalca',
  'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih',
  'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal',
  'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer',
  'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli',
  'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu',
]

interface Lead {
  id: string
  name: string
  phone?: string
  city: string
  sector: string
  already_exists?: boolean
}

interface DemoState {
  loading: boolean
  url?: string
}

export default function WebsitesizPage() {
  const router = useRouter()
  const [city, setCity] = useState('İstanbul')
  const [district, setDistrict] = useState('')
  const [sector, setSector] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [leads, setLeads] = useState<Lead[]>([])
  const [searched, setSearched] = useState(false)
  const [demos, setDemos] = useState<Record<string, DemoState>>({})

  async function search() {
    if (!sector) { setError('Sektör seçmelisin'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/scan/websitesiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, district, sector }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setLeads(data.leads || [])
      setSearched(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  async function createDemo(leadId: string) {
    setDemos(prev => ({ ...prev, [leadId]: { loading: true } }))
    try {
      const res = await fetch(`/api/leads/${leadId}/create-demo-scratch`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDemos(prev => ({ ...prev, [leadId]: { loading: false, url: data.demo_url } }))
    } catch {
      setDemos(prev => ({ ...prev, [leadId]: { loading: false } }))
    }
  }

  function whatsappMessage(lead: Lead, demoUrl: string) {
    const msg = `Merhaba, ${lead.name} olarak Google'da görünüyorsunuz ama web siteniz yok. Sizin için ücretsiz bir demo hazırladım: ${demoUrl} — Beğenirseniz konuşalım.`
    const phone = lead.phone?.replace(/\D/g, '').replace(/^0/, '90')
    if (phone) {
      return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
    }
    return `https://wa.me/?text=${encodeURIComponent(msg)}`
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push('/scan')} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Websitesiz Firma Taraması</h1>
            <p className="text-gray-500 mt-1">Google&apos;da var ama sitesi olmayan firmaları bul, demo oluştur, ara</p>
          </div>
        </div>

        {/* Arama Formu */}
        <div className="card space-y-5 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800 rounded-lg p-3">
            <Globe className="w-4 h-4 text-orange-400 flex-shrink-0" />
            Google Maps&apos;ten websitesi olmayan firmalar bulunur — telefon numarasıyla WhatsApp&apos;tan ulaşırsın
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Şehir</label>
              <select value={city} onChange={e => setCity(e.target.value)} className="input">
                <option value="İstanbul">İstanbul</option>
                <option value="Ankara">Ankara</option>
                <option value="İzmir">İzmir</option>
                <option value="Bursa">Bursa</option>
                <option value="Antalya">Antalya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">İlçe</label>
              <select value={district} onChange={e => setDistrict(e.target.value)} className="input">
                <option value="">Tüm şehir</option>
                {ISTANBUL_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sektör</label>
              <select value={sector} onChange={e => setSector(e.target.value)} className="input">
                <option value="">Sektör seç...</option>
                {SECTORS.map(s => (
                  <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">{error}</div>
          )}

          <button
            onClick={search}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Aranıyor...</>
              : <><Search className="w-4 h-4" /> Websitesiz Firmaları Bul</>
            }
          </button>
        </div>

        {/* Sonuçlar */}
        {searched && (
          <div>
            <p className="text-sm text-gray-400 mb-4">
              {leads.length > 0
                ? <><span className="text-white font-semibold">{leads.length} firma</span> bulundu — websiteleri yok</>
                : 'Bu kriterlerde websitesiz firma bulunamadı.'
              }
            </p>

            <div className="space-y-3">
              {leads.map(lead => {
                const demo = demos[lead.id]
                return (
                  <div key={lead.id} className="card flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-900/40 flex items-center justify-center text-orange-400 font-bold flex-shrink-0">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate">{lead.name}</div>
                      <div className="flex items-center gap-3 mt-0.5">
                        {lead.phone && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Phone className="w-3 h-3" /> {lead.phone}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">{lead.city} • {SECTORS.find(s => s.key === lead.sector)?.label || lead.sector}</span>
                        {lead.already_exists && <span className="text-xs text-yellow-500">Zaten kayıtlı</span>}
                      </div>
                      {demo?.url && (
                        <a href={demo.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1">
                          Demo hazır <ChevronRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {demo?.url ? (
                        <a
                          href={whatsappMessage(lead, demo.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white text-sm font-medium transition-all"
                        >
                          <MessageCircle className="w-4 h-4" /> WhatsApp Gönder
                        </a>
                      ) : (
                        <button
                          onClick={() => createDemo(lead.id)}
                          disabled={demo?.loading}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all disabled:opacity-50"
                        >
                          {demo?.loading
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Oluşturuluyor...</>
                            : <><Star className="w-4 h-4" /> Demo Oluştur</>
                          }
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
