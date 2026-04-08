import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Para formatlama (kuruş → TL)
export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount)
}

// Tarih formatlama
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

// Kaç gün önce/sonra
export function relativeDays(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffMs = target.getTime() - now.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'bugün'
  if (diffDays === 1) return 'yarın'
  if (diffDays === -1) return 'dün'
  if (diffDays > 0) return `${diffDays} gün sonra`
  return `${Math.abs(diffDays)} gün önce`
}

// Puan rengi
export function scoreColor(score: number): string {
  if (score < 4) return 'text-red-500'
  if (score < 6) return 'text-yellow-500'
  if (score < 8) return 'text-green-500'
  return 'text-blue-500'
}

// Puan etiketi
export function scoreLabel(score: number): string {
  if (score < 4) return 'Kritik'
  if (score < 6) return 'Geliştirilmeli'
  if (score < 8) return 'İyi'
  return 'Çok İyi'
}

// URL'den domain çıkar
export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

// Türkçe karakter normalize et (URL için)
export function slugify(text: string): string {
  const trMap: Record<string, string> = {
    ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
    Ç: 'C', Ğ: 'G', İ: 'I', Ö: 'O', Ş: 'S', Ü: 'U',
  }
  return text
    .split('')
    .map(char => trMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Rastgele gecikme (spam koruması için)
export function randomDelay(minMs = 3000, maxMs = 8000): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs)) + minMs
  return new Promise(resolve => setTimeout(resolve, delay))
}

// Şu an iş saatleri mi? (09:00-17:00)
export function isBusinessHours(timezone = 'Europe/Istanbul'): boolean {
  const now = new Date()
  const hour = parseInt(
    new Intl.DateTimeFormat('tr-TR', {
      hour: 'numeric',
      hour12: false,
      timeZone: timezone,
    }).format(now)
  )
  return hour >= 9 && hour < 17
}
