'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Circle, Send, ExternalLink, AlertTriangle } from 'lucide-react'

interface ReviewData {
  lead: {
    id: string
    name: string
    website: string
    sector: string
    city: string
    phone?: string
  }
  report: {
    demo_url: string
    demo_expires_at: string
  } | null
  analysis: {
    score_genel: number
    has_whatsapp: boolean
    has_contact_form: boolean
    has_mobile_menu: boolean
    address_text?: string
    extracted_phone?: string
    extracted_services?: string[]
  } | null
}

const SECTOR_QA: Record<string, { label: string; autoCheck?: (data: ReviewData) => boolean }[]> = {
  dis_klinigi: [
    { label: 'Firma adı demo sitede doğru görünüyor' },
    { label: 'Telefon numarası görünüyor', autoCheck: d => !!(d.lead.phone || d.analysis?.extracted_phone) },
    { label: 'Adres/konum bilgisi var', autoCheck: d => !!d.analysis?.address_text },
    { label: 'En az 4 diş hizmeti listeleniyor', autoCheck: d => (d.analysis?.extracted_services?.length ?? 0) >= 4 || true },
    { label: 'Randevu/iletişim CTA butonu var' },
    { label: 'WhatsApp butonu demo\'da görünüyor' },
    { label: 'Sektör rengi uygun (mavi/gök mavisi)' },
    { label: 'Mobil görünüm düzgün (telefonda baktım)' },
  ],
  restoran: [
    { label: 'Firma adı demo sitede doğru görünüyor' },
    { label: 'Telefon numarası görünüyor', autoCheck: d => !!(d.lead.phone || d.analysis?.extracted_phone) },
    { label: 'Menü/yemek listesi var' },
    { label: 'Rezervasyon butonu var' },
    { label: 'Sektör rengi uygun (turuncu/kırmızı)' },
    { label: 'Mobil görünüm düzgün' },
  ],
  avukat: [
    { label: 'Firma adı demo sitede doğru görünüyor' },
    { label: 'Telefon numarası görünüyor', autoCheck: d => !!(d.lead.phone || d.analysis?.extracted_phone) },
    { label: 'Hukuk alanları listeleniyor' },
    { label: 'Danışma CTA butonu var' },
    { label: 'Sektör rengi uygun (lacivert/mor)' },
    { label: 'Mobil görünüm düzgün' },
  ],
  insaat: [
    { label: 'Firma adı demo sitede doğru görünüyor' },
    { label: 'Telefon numarası görünüyor', autoCheck: d => !!(d.lead.phone || d.analysis?.extracted_phone) },
    { label: 'Hizmetler/projeler listeleniyor' },
    { label: 'Teklif alma butonu var' },
    { label: 'Sektör rengi uygun (amber/turuncu)' },
    { label: 'Mobil görünüm düzgün' },
  ],
}

const DEFAULT_QA = [
  { label: 'Firma adı demo sitede doğru görünüyor' },
  { label: 'Telefon numarası görünüyor', autoCheck: (d: ReviewData) => !!(d.lead.phone || d.analysis?.extracted_phone) },
  { label: 'Adres/konum bilgisi var', autoCheck: (d: ReviewData) => !!d.analysis?.address_text },
  { label: 'Hizmetler bölümü dolu' },
  { label: 'İletişim CTA butonu var' },
  { label: 'Sektör rengi ve teması uygun' },
  { label: 'Mobil görünüm düzgün (telefonda baktım)' },
  { label: '"Yapılan iyileştirmeler" bölümü doğru' },
]

export default function ReviewPage() {
  const { leadId } = useParams()
  const router = useRouter()
  const [data, setData] = useState<ReviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [checks, setChecks] = useState<boolean[]>([])
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetch(`/api/leads/${leadId}/review-data`)
      .then(r => r.json())
      .then(d => {
        setData(d)
        const qa = SECTOR_QA[d.lead?.sector] || DEFAULT_QA
        // Auto-check edilebilenleri işaretle
        setChecks(qa.map(item => item.autoCheck ? item.autoCheck(d) : false))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [leadId])

  const qaItems = data ? (SECTOR_QA[data.lead?.sector] || DEFAULT_QA) : DEFAULT_QA
  const allChecked = checks.length > 0 && checks.every(Boolean)
  const checkedCount = checks.filter(Boolean).length

  const handleSend = async () => {
    if (!allChecked) return
    setSending(true)
    try {
      await fetch(`/api/leads/${leadId}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qa_approved: true, qa_notes: notes }),
      })
      setSent(true)
      setTimeout(() => router.push(`/scan/result/${leadId}`), 2000)
    } catch {
      setSending(false)
    }
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
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <p>Lead bulunamadı</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/scan/result/${leadId}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Sonuca Dön
          </button>
          <div className="h-5 w-px bg-gray-700" />
          <div>
            <h1 className="font-bold text-white">{data.lead.name} — Demo İnceleme</h1>
            <p className="text-xs text-gray-500">Kalite kontrolünü tamamlayıp onayladıktan sonra mail gönderilecek</p>
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={!allChecked || sending || sent}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            sent
              ? 'bg-green-900 text-green-300 cursor-default'
              : allChecked
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          {sent ? (
            <><CheckCircle className="w-4 h-4" /> Mail Gönderildi!</>
          ) : sending ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Gönderiliyor...</>
          ) : (
            <><Send className="w-4 h-4" /> {allChecked ? 'Onayla & Gönder' : `${checkedCount}/${qaItems.length} tamamlandı`}</>
          )}
        </button>
      </div>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Sol: Eski Site */}
        <div className="flex-1 flex flex-col border-r border-gray-800">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Eski Site</span>
            </div>
            <a
              href={data.lead.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              {data.lead.website.replace(/^https?:\/\//, '')} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <iframe
            src={data.lead.website}
            className="flex-1 w-full bg-white"
            title="Eski Site"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>

        {/* Sağ: Yeni Demo + QA */}
        <div className="w-[420px] flex flex-col">
          {/* Demo iframe */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Yeni Demo</span>
            </div>
            {data.report?.demo_url && (
              <a
                href={data.report.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Tam ekran <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          {data.report?.demo_url ? (
            <iframe
              src={data.report.demo_url}
              className="h-[350px] w-full bg-white border-b border-gray-800"
              title="Demo Site"
            />
          ) : (
            <div className="h-[350px] flex items-center justify-center bg-gray-900 border-b border-gray-800">
              <div className="text-center text-gray-500">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Demo henüz oluşturulmadı</p>
              </div>
            </div>
          )}

          {/* QA Checklist */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white">Kalite Kontrol Listesi</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                allChecked ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-400'
              }`}>
                {checkedCount}/{qaItems.length}
              </span>
            </div>

            {qaItems.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  const newChecks = [...checks]
                  newChecks[i] = !newChecks[i]
                  setChecks(newChecks)
                }}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                  checks[i]
                    ? 'bg-green-950 border-green-800 text-green-300'
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'
                }`}
              >
                {checks[i]
                  ? <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-400 mt-0.5" />
                  : <Circle className="w-5 h-5 flex-shrink-0 text-gray-600 mt-0.5" />
                }
                <span className="text-sm leading-relaxed">{item.label}</span>
              </button>
            ))}

            {/* Notlar */}
            <div className="mt-4">
              <label className="text-xs text-gray-500 mb-1.5 block">Not ekle (opsiyonel)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Düzeltilmesi gereken bir şey var mı?"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-gray-600"
                rows={3}
              />
            </div>

            {!allChecked && (
              <div className="flex items-center gap-2 p-3 bg-yellow-950 border border-yellow-800 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <p className="text-xs text-yellow-300">Tüm kontroller tamamlanmadan mail gönderilemez</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
