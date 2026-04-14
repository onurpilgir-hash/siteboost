'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2, Check, AlertCircle } from 'lucide-react'
import { SECTORS } from '@/types'

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Kayseri', 'Eskişehir']

export default function BilgiFormuPage() {
  const { token } = useParams()
  const [, setTokenData] = useState<{ sector?: string; city?: string } | null>(null)
  const [tokenError, setTokenError] = useState('')
  const [checkingToken, setCheckingToken] = useState(true)

  const [name, setName] = useState('')
  const [sector, setSector] = useState('')
  const [city, setCity] = useState('İstanbul')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [services, setServices] = useState('')
  const [about, setAbout] = useState('')
  const [referenceUrl, setReferenceUrl] = useState('')

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/bilgi-formu?token=${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.valid) {
          setTokenData(d)
          if (d.sector) setSector(d.sector)
          if (d.city) setCity(d.city)
        } else {
          setTokenError(d.error || 'Geçersiz link')
        }
      })
      .catch(() => setTokenError('Bağlantı hatası'))
      .finally(() => setCheckingToken(false))
  }, [token])

  async function submit() {
    if (!name || !phone) { setError('Firma adı ve telefon zorunludur'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/bilgi-formu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, sector, city, phone, email, services, about, referenceUrl, mode: 'customer' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSubmitted(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (checkingToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (tokenError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Link Geçersiz</h2>
          <p className="text-gray-500">{tokenError}</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm bg-white rounded-2xl shadow-lg p-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Teşekkürler!</h2>
          <p className="text-gray-500">Bilgileriniz alındı. En kısa sürede demo sitenizi hazırlayıp sizinle paylaşacağız.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Bilgi Formu</h1>
          <p className="text-gray-500 mt-2">Demo sitenizi hazırlayabilmemiz için birkaç bilgiye ihtiyacımız var.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Firma / İşletme Adı *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Örn: Dent Bahçeşehir Diş Kliniği" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-400 transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sektör</label>
              <select value={sector} onChange={e => setSector(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-400">
                <option value="">Seç...</option>
                {SECTORS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Şehir</label>
              <select value={city} onChange={e => setCity(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-400">
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon *</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0212 000 00 00" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">E-posta</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="info@firma.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sunduğunuz Hizmetler <span className="font-normal text-gray-400">(virgülle ayırın)</span></label>
            <input type="text" value={services} onChange={e => setServices(e.target.value)} placeholder="İmplant, Ortodonti, Zirkonyum, Kanal Tedavisi" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-400" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Kendinizi Kısaca Tanıtın <span className="font-normal text-gray-400">(opsiyonel)</span></label>
            <textarea value={about} onChange={e => setAbout(e.target.value)} rows={3} placeholder="Kaç yıldır hizmet veriyorsunuz, nerede bulunuyorsunuz, sizi özel kılan nedir?" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-400 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Beğendiğiniz Bir Site <span className="font-normal text-gray-400">(opsiyonel)</span></label>
            <input type="url" value={referenceUrl} onChange={e => setReferenceUrl(e.target.value)} placeholder="https://begenilen-site.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-400" />
          </div>

          <button onClick={submit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Gönderiliyor...</> : 'Formu Gönder'}
          </button>
        </div>
      </div>
    </div>
  )
}
