'use client'

import { useState } from 'react'
import { Search, Link2, ArrowRight, Loader2, Globe } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SECTORS } from '@/types'

type ScanType = 'auto' | 'manual' | 'websitesiz'

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

export default function ScanForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [scanType, setScanType] = useState<ScanType>(
    searchParams.get('type') === 'manual' ? 'manual' : 'auto'
  )

  const [city, setCity] = useState('İstanbul')
  const [district, setDistrict] = useState('')
  const [sector, setSector] = useState('')
  const [allDistricts, setAllDistricts] = useState(false)

  const [url, setUrl] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [manualCity, setManualCity] = useState('İstanbul')
  const [manualSector, setManualSector] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function startAutoScan() {
    if (!sector) { setError('Sektör seçmelisin'); return }
    if (!allDistricts && !district) { setError('İlçe seçmelisin'); return }

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/scan/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, district: allDistricts ? 'TUMU' : district, sector }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Tarama başlatılamadı')
      router.push(`/scan/progress/${data.jobId}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Bir hata oluştu')
      setLoading(false)
    }
  }

  async function startManualScan() {
    if (!url) { setError('URL girmelisin'); return }
    if (!url.startsWith('http')) { setError('Geçerli bir URL gir (http:// ile başlamalı)'); return }

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/scan/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, companyName, email, phone, city: manualCity, sector: manualSector }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analiz başlatılamadı')
      router.push(`/scan/result/${data.leadId}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Bir hata oluştu')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Tarama Başlat</h1>
          <p className="text-gray-500 mt-1">Otomatik veya manuel analiz seç</p>
        </div>

        <div className="flex gap-2 mb-6 bg-gray-900 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => setScanType('auto')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              scanType === 'auto' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-100'
            }`}
          >
            <Search className="w-4 h-4" />
            Otomatik Tarama
          </button>
          <button
            onClick={() => setScanType('manual')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              scanType === 'manual' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-100'
            }`}
          >
            <Link2 className="w-4 h-4" />
            Manuel URL
          </button>
          <button
            onClick={() => router.push('/scan/websitesiz')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all text-gray-400 hover:text-gray-100 hover:bg-gray-800"
          >
            <Globe className="w-4 h-4" />
            Websitesiz
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {scanType === 'auto' && (
          <div className="card space-y-5">
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800 rounded-lg p-3">
              <Search className="w-4 h-4 text-blue-400 flex-shrink-0" />
              Google Maps&apos;ten tüm firmalar bulunur, otomatik analiz edilir ve mail atılır
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Şehir</label>
              <select value={city} onChange={e => setCity(e.target.value)} className="input">
                <option value="İstanbul">İstanbul</option>
                <option value="Ankara">Ankara</option>
                <option value="İzmir">İzmir</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">İlçe</label>
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allDistricts}
                    onChange={e => setAllDistricts(e.target.checked)}
                    className="rounded"
                  />
                  Tüm ilçeler (paralel tarama)
                </label>
              </div>
              {!allDistricts ? (
                <select value={district} onChange={e => setDistrict(e.target.value)} className="input">
                  <option value="">İlçe seç...</option>
                  {ISTANBUL_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-blue-900/20 border border-blue-800 rounded-lg text-blue-300 text-sm">
                  Tüm ilçeler aynı anda paralel olarak taranır
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sektör</label>
              <div className="grid grid-cols-2 gap-2">
                {SECTORS.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setSector(s.key)}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-all ${
                      sector === s.key
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <span>{s.emoji}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startAutoScan}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Başlatılıyor...</>
              ) : (
                <><Search className="w-4 h-4" /> Taramayı Başlat <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}

        {scanType === 'manual' && (
          <div className="card space-y-5">
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800 rounded-lg p-3">
              <Link2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
              Herhangi bir sitenin URL&apos;sini gir, tüm analiz Senaryo 1 ile aynı
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Web Sitesi URL&apos;si *
              </label>
              <input
                type="url"
                placeholder="https://ornekfirma.com"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="input"
                onKeyDown={e => e.key === 'Enter' && startManualScan()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Firma Adı <span className="text-gray-500">(opsiyonel)</span>
              </label>
              <input
                type="text"
                placeholder="Beşiktaş Diş Kliniği"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  E-posta <span className="text-gray-500">(mail için)</span>
                </label>
                <input
                  type="email"
                  placeholder="info@firma.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telefon <span className="text-gray-500">(opsiyonel)</span>
                </label>
                <input
                  type="text"
                  placeholder="0212 000 00 00"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Şehir</label>
                <select value={manualCity} onChange={e => setManualCity(e.target.value)} className="input">
                  <option value="İstanbul">İstanbul</option>
                  <option value="Ankara">Ankara</option>
                  <option value="İzmir">İzmir</option>
                  <option value="Bursa">Bursa</option>
                  <option value="Antalya">Antalya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sektör <span className="text-gray-500">(opsiyonel)</span>
                </label>
                <select value={manualSector} onChange={e => setManualSector(e.target.value)} className="input">
                  <option value="">Seç...</option>
                  {SECTORS.map(s => (
                    <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={startManualScan}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analiz Başlatılıyor...</>
              ) : (
                <><Search className="w-4 h-4" /> Analiz Et <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
