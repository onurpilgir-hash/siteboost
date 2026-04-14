'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Copy, Check, UserPlus, Send } from 'lucide-react'
import { SECTORS } from '@/types'

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Kayseri', 'Eskişehir']

export default function NewCustomerPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'admin' | 'link'>('admin')

  // Form alanları
  const [name, setName] = useState('')
  const [sector, setSector] = useState('')
  const [city, setCity] = useState('İstanbul')
  const [district] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [services, setServices] = useState('')
  const [about, setAbout] = useState('')
  const [referenceUrl, setReferenceUrl] = useState('')
  const [colorPreference, setColorPreference] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ leadId: string; demoUrl: string } | null>(null)
  const [copied, setCopied] = useState(false)

  // Link modu için token üretimi
  const [linkSector, setLinkSector] = useState('')
  const [linkCity, setLinkCity] = useState('İstanbul')
  const [generatedLink, setGeneratedLink] = useState('')
  const [generatingLink, setGeneratingLink] = useState(false)

  async function generateFormLink() {
    setGeneratingLink(true)
    try {
      const res = await fetch('/api/bilgi-formu/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector: linkSector, city: linkCity }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const appUrl = window.location.origin
      setGeneratedLink(`${appUrl}/bilgi-formu/${data.token}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Link oluşturulamadı')
    } finally {
      setGeneratingLink(false)
    }
  }

  async function submit() {
    if (!name || !sector || !city || !phone) {
      setError('Firma adı, sektör, şehir ve telefon zorunludur')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/bilgi-formu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, sector, city, district, phone, email, services, about, referenceUrl, colorPreference, mode: 'admin' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  function copyLink(link: string) {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (result) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="card max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-900/40 flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Müşteri Eklendi!</h2>
          <p className="text-gray-400 text-sm">Demo hazırlandı ve kayıt oluşturuldu.</p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/scan/result/${result.leadId}`)}
              className="flex-1 btn-primary py-2.5"
            >
              Sonucu Gör
            </button>
            <a
              href={result.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 btn-secondary py-2.5 text-center"
            >
              Demo Aç
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Yeni Müşteri Ekle</h1>
            <p className="text-gray-500 mt-1">Sıfırdan site yapılacak müşteri kaydı</p>
          </div>
        </div>

        {/* Mod seçici */}
        <div className="flex gap-2 mb-6 bg-gray-900 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => setMode('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'admin' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-100'}`}
          >
            <UserPlus className="w-4 h-4" />
            Ben Doldururum
          </button>
          <button
            onClick={() => setMode('link')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'link' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-100'}`}
          >
            <Send className="w-4 h-4" />
            Müşteriye Link Gönder
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">{error}</div>
        )}

        {/* Admin formu */}
        {mode === 'admin' && (
          <div className="card space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Firma Adı *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Örn: Dent Bahçeşehir" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sektör *</label>
                <select value={sector} onChange={e => setSector(e.target.value)} className="input">
                  <option value="">Seç...</option>
                  {SECTORS.map(s => <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Şehir *</label>
                <select value={city} onChange={e => setCity(e.target.value)} className="input">
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Telefon *</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0212 000 00 00" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">E-posta</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="info@firma.com" className="input" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hizmet Listesi <span className="text-gray-500 font-normal">(virgülle ayır)</span>
              </label>
              <input type="text" value={services} onChange={e => setServices(e.target.value)} placeholder="İmplant, Ortodonti, Zirkonyum, Kanal Tedavisi" className="input" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Kısa Tanıtım <span className="text-gray-500 font-normal">(hakkımızda metni)</span>
              </label>
              <textarea value={about} onChange={e => setAbout(e.target.value)} rows={3} placeholder="2-3 cümleyle firmayı anlat..." className="input resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Referans Site <span className="text-gray-500 font-normal">(opsiyonel)</span></label>
                <input type="url" value={referenceUrl} onChange={e => setReferenceUrl(e.target.value)} placeholder="https://begenilen-site.com" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Renk Tercihi <span className="text-gray-500 font-normal">(opsiyonel)</span></label>
                <div className="flex gap-2">
                  <input type="color" value={colorPreference || '#3b82f6'} onChange={e => setColorPreference(e.target.value)} className="h-10 w-16 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer" />
                  <input type="text" value={colorPreference} onChange={e => setColorPreference(e.target.value)} placeholder="#3b82f6" className="input flex-1" />
                </div>
              </div>
            </div>

            <button onClick={submit} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Kaydediliyor...</> : <><UserPlus className="w-4 h-4" /> Müşteriyi Ekle & Demo Oluştur</>}
            </button>
          </div>
        )}

        {/* Link modu */}
        {mode === 'link' && (
          <div className="card space-y-5">
            <p className="text-sm text-gray-400">Müşteriye gönderilecek form linki oluştur. Müşteri doldurunca sana Telegram bildirimi gelir.</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sektör</label>
                <select value={linkSector} onChange={e => setLinkSector(e.target.value)} className="input">
                  <option value="">Seç (opsiyonel)...</option>
                  {SECTORS.map(s => <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Şehir</label>
                <select value={linkCity} onChange={e => setLinkCity(e.target.value)} className="input">
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <button onClick={generateFormLink} disabled={generatingLink} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {generatingLink ? <><Loader2 className="w-4 h-4 animate-spin" /> Oluşturuluyor...</> : <><Send className="w-4 h-4" /> Form Linki Oluştur</>}
            </button>

            {generatedLink && (
              <div className="p-4 bg-green-900/20 border border-green-800 rounded-xl space-y-3">
                <p className="text-xs text-green-400 font-semibold">Link hazır — müşteriye WhatsApp veya mail ile gönder:</p>
                <div className="flex items-center gap-2">
                  <input readOnly value={generatedLink} className="input flex-1 text-xs bg-gray-900" />
                  <button onClick={() => copyLink(generatedLink)} className="flex-shrink-0 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-300" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Link 48 saat geçerli. Müşteri doldurduğunda Telegram bildirimi alırsın.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
