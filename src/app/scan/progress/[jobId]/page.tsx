'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ScanProgressPage() {
  const { jobId } = useParams()
  const [job, setJob] = useState<{
    status: string
    city: string
    district: string
    sector: string
    total_found: number
    total_scanned: number
    total_qualified: number
    total_skipped: number
  } | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const analyzing_ref = useRef(false)

  // Job durumunu çek
  useEffect(() => {
    if (!jobId) return
    const poll = async () => {
      const res = await fetch(`/api/scan/jobs/${jobId}`)
      if (res.ok) {
        const data = await res.json()
        setJob(data)

        // Firmalar bulunduysa analizi başlat
        if (data.status === 'pending_analysis' && !analyzing_ref.current) {
          analyzing_ref.current = true
          setAnalyzing(true)
          runAnalysis()
        }
      }
    }
    poll()
    const interval = setInterval(poll, 3000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId])

  const runAnalysis = async () => {
    let done = false
    while (!done) {
      try {
        const res = await fetch('/api/scan/analyze-job', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId }),
        })
        const data = await res.json()
        if (data.analyzed) {
          setLog(prev => [...prev, `✓ ${data.analyzed}`])
        }
        if (data.done || !res.ok) {
          done = true
          setAnalyzing(false)
          setJob(prev => prev ? { ...prev, status: 'completed' } : prev)
        }
      } catch {
        done = true
        setAnalyzing(false)
      }
    }
  }

  const isDone = job?.status === 'completed'

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full card text-center space-y-6">
        <div>
          {isDone ? (
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          ) : (
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          )}
          <h2 className="text-xl font-bold text-white">
            {isDone ? 'Tarama Tamamlandı!' : analyzing ? 'Analiz Ediliyor...' : 'Firmalar Aranıyor...'}
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            {job ? `${job.city} / ${job.district || 'Tüm ilçeler'} — ${job.sector}` : 'Yükleniyor...'}
          </p>
        </div>

        {job && (
          <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Bulunan</span>
              <span className="text-white">{job.total_found} firma</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Analiz Edildi</span>
              <span className="text-white">{log.length} firma</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Atlandı</span>
              <span className="text-gray-500">{job.total_skipped} firma (website yok / tekrar)</span>
            </div>
          </div>
        )}

        {log.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-3 text-left max-h-32 overflow-y-auto">
            {log.map((l, i) => (
              <p key={i} className="text-xs text-green-400">{l}</p>
            ))}
          </div>
        )}

        {isDone ? (
          <div className="flex gap-3">
            <Link href="/dashboard/pipeline" className="btn-primary flex-1 text-center">
              Pipeline Görünümü
            </Link>
            <Link href="/dashboard" className="btn-secondary flex-1 text-center">
              Dashboard
            </Link>
          </div>
        ) : (
          <p className="text-xs text-gray-600">Sayfayı kapatabilirsin, tarama arka planda devam eder</p>
        )}
      </div>
    </div>
  )
}
