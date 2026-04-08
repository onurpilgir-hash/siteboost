'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2, Clock } from 'lucide-react'
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
  } | null>(null)

  useEffect(() => {
    if (!jobId) return
    const poll = async () => {
      const res = await fetch(`/api/scan/jobs/${jobId}`)
      if (res.ok) setJob(await res.json())
    }
    poll()
    const interval = setInterval(poll, 3000)
    return () => clearInterval(interval)
  }, [jobId])

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full card text-center space-y-6">
        <div>
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">Tarama Başlatıldı</h2>
          <p className="text-gray-400 text-sm mt-2">
            {job ? `${job.city} / ${job.district || 'Tüm ilçeler'} — ${job.sector}` : 'Yükleniyor...'}
          </p>
        </div>

        {job && (
          <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Durum</span>
              <span className="text-white capitalize">{job.status === 'pending' ? 'Kuyrukta' : job.status === 'running' ? 'Çalışıyor' : job.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Bulunan</span>
              <span className="text-white">{job.total_found} firma</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Taranan</span>
              <span className="text-white">{job.total_scanned} firma</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Nitelikli</span>
              <span className="text-green-400">{job.total_qualified} firma</span>
            </div>
          </div>
        )}

        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 text-sm text-blue-300">
          <Clock className="w-4 h-4 inline mr-2" />
          Google Maps API key eklenince tarama otomatik başlayacak.
          Şimdilik manuel analizi deneyebilirsin.
        </div>

        <div className="flex gap-3">
          <Link href="/scan?type=manual" className="btn-primary flex-1 text-center">
            Manuel Analiz Dene
          </Link>
          <Link href="/dashboard" className="btn-secondary flex-1 text-center">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
