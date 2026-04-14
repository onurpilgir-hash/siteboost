'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Clock, Phone, MapPin, Star, ExternalLink, CheckCircle, ChevronRight,
  Stethoscope, Sparkles, Shield, Calendar, Heart, Award, Zap, Users,
  ChefHat, Leaf, Truck, Scale, Building2, Home, Car, CreditCard,
  Bed, Coffee, PawPrint, Syringe, Scissors, BarChart3, Receipt,
  Activity, Wrench, HardHat, Briefcase, Smile, Camera, Microscope,
  Smartphone, Search, Lock, MessageCircle, FileText, Globe, Laptop,
  type LucideIcon
} from 'lucide-react'
const ICON_MAP: Record<string, LucideIcon> = {
  stethoscope: Stethoscope, sparkles: Sparkles, shield: Shield,
  calendar: Calendar, heart: Heart, award: Award, zap: Zap,
  users: Users, chef: ChefHat, leaf: Leaf, truck: Truck,
  scale: Scale, building: Building2, home: Home, car: Car,
  credit: CreditCard, bed: Bed, coffee: Coffee, paw: PawPrint,
  syringe: Syringe, scissors: Scissors, chart: BarChart3,
  receipt: Receipt, activity: Activity, wrench: Wrench,
  hardhat: HardHat, briefcase: Briefcase, smile: Smile,
  camera: Camera, microscope: Microscope, star: Star,
  phone: Phone, check: CheckCircle, smartphone: Smartphone,
  search: Search, lock: Lock, chat: MessageCircle, doc: FileText,
  globe: Globe, laptop: Laptop, clock: Clock,
}

function SvcIcon({ name, className, style }: { name: string; className?: string; style?: { color?: string; [key: string]: unknown } }) {
  const Icon = ICON_MAP[name] || CheckCircle
  return <Icon className={className} style={style} />
}

interface DemoData {
  lead: {
    name: string
    website: string
    city: string
    district?: string
    sector?: string
    phone?: string
    google_rating?: number
    google_review_count?: number
  }
  report: {
    demo_url: string
    demo_expires_at: string
  }
  analysis: {
    score_genel: number
    package_recommendation?: string
    logo_url?: string
    primary_color?: string
    address_text?: string
    extracted_phone?: string
    extracted_services?: string[]
    about_text?: string
    founding_year?: string
    gallery_images?: string[]
  }
  expired: boolean
  brand_name: string
  app_url: string
}

const SECTOR_THEMES: Record<string, {
  gradient: string
  primary: string
  light: string
  cta: string
  heroTitle: string
  heroSub: string
  whyUs: { icon: string; title: string; desc: string }[]
}> = {
  dis_klinigi: {
    gradient: 'from-sky-500 to-blue-600',
    primary: '#0ea5e9',
    light: '#e0f2fe',
    cta: 'Randevu Al',
    heroTitle: 'Sağlıklı Gülüşler, Mutlu Hayatlar',
    heroSub: 'Modern ekipmanlar ve uzman kadromuzla ağrısız, güvenilir diş tedavisi',
    whyUs: [
      { icon: 'heart', title: 'Ağrısız Tedavi', desc: 'Son teknoloji ekipmanlarla konforlu tedavi' },
      { icon: 'microscope', title: 'Modern Klinik', desc: 'Dijital röntgen ve 3D tarama sistemleri' },
      { icon: 'calendar', title: 'Kolay Randevu', desc: 'Online randevu, beklemeden muayene' },
    ],
  },
  restoran: {
    gradient: 'from-orange-500 to-red-600',
    primary: '#f97316',
    light: '#fff7ed',
    cta: 'Rezervasyon Yap',
    heroTitle: 'Lezzet ve Kalitenin Buluşma Noktası',
    heroSub: 'Geleneksel Türk mutfağını modern dokunuşlarla sunuyoruz',
    whyUs: [
      { icon: 'chef', title: 'Usta Şefler', desc: 'Deneyimli mutfak ekibimizle özgün lezzetler' },
      { icon: 'leaf', title: 'Taze Malzeme', desc: 'Her gün temin edilen taze ve doğal ürünler' },
      { icon: 'sparkles', title: 'Özel Etkinlik', desc: 'Organizasyon ve catering hizmetleri' },
    ],
  },
  avukat: {
    gradient: 'from-indigo-600 to-purple-700',
    primary: '#6366f1',
    light: '#eef2ff',
    cta: 'Ücretsiz Danışma',
    heroTitle: 'Hukuki Sorunlarınızda Güvenilir Çözüm Ortağı',
    heroSub: 'Deneyimli avukat kadromuzla haklarınızı koruyoruz',
    whyUs: [
      { icon: 'scale', title: 'Uzman Kadro', desc: '20+ yıllık hukuki deneyim' },
      { icon: 'shield', title: 'Gizlilik', desc: 'Her müvekkile özel ve gizli hizmet' },
      { icon: 'zap', title: 'Hızlı Çözüm', desc: 'Süreçleri hızlandıran dijital takip sistemi' },
    ],
  },
  guzellik_salonu: {
    gradient: 'from-pink-500 to-rose-600',
    primary: '#ec4899',
    light: '#fdf2f8',
    cta: 'Randevu Al',
    heroTitle: 'Güzelliğinizi Keşfedin',
    heroSub: 'Profesyonel ekibimizle en iyi bakım ve güzellik hizmetleri',
    whyUs: [
      { icon: 'award', title: 'Premium Ürünler', desc: 'Sadece en kaliteli marka ürünler kullanılır' },
      { icon: 'users', title: 'Uzman Ekip', desc: 'Sertifikalı ve deneyimli güzellik uzmanları' },
      { icon: 'sparkles', title: 'Kişisel Bakım', desc: 'Size özel bakım programları' },
    ],
  },
  insaat: {
    gradient: 'from-amber-500 to-orange-600',
    primary: '#f59e0b',
    light: '#fffbeb',
    cta: 'Teklif Al',
    heroTitle: 'Hayalinizdeki Yapıyı İnşa Ediyoruz',
    heroSub: 'Kaliteli malzeme, uzman işçilik ve zamanında teslimat garantisi',
    whyUs: [
      { icon: 'hardhat', title: 'Deneyimli Ekip', desc: '15+ yıllık sektör deneyimi' },
      { icon: 'shield', title: 'Kalite Garantisi', desc: 'ISO standartlarında malzeme ve işçilik' },
      { icon: 'clock', title: 'Zamanında Teslimat', desc: 'Sözleşme garantili teslim tarihleri' },
    ],
  },
  oto_galeri: {
    gradient: 'from-emerald-500 to-teal-600',
    primary: '#10b981',
    light: '#ecfdf5',
    cta: 'Araçları İncele',
    heroTitle: 'Güvenilir Araç Alışverişinin Adresi',
    heroSub: 'Garantili ikinci el ve sıfır araçlar, uygun kredi seçenekleriyle',
    whyUs: [
      { icon: 'search', title: 'Ekspertiz Garantisi', desc: 'Tüm araçlar profesyonel ekspertizden geçer' },
      { icon: 'credit', title: 'Uygun Kredi', desc: 'Tüm bankalarla anlaşmalı kredi imkanı' },
      { icon: 'car', title: 'Takas', desc: 'Aracınızı değerinden takas ediyoruz' },
    ],
  },
  otel: {
    gradient: 'from-violet-600 to-purple-700',
    primary: '#8b5cf6',
    light: '#f5f3ff',
    cta: 'Rezervasyon Yap',
    heroTitle: 'Konforun ve Huzurun Buluştuğu Yer',
    heroSub: 'Unutulmaz konaklama deneyimi için sizi bekliyoruz',
    whyUs: [
      { icon: 'bed', title: 'Konforlu Odalar', desc: 'Özenle tasarlanmış oda konseptleri' },
      { icon: 'coffee', title: 'Lezzetli Kahvaltı', desc: 'Açık büfe zengin Türk kahvaltısı' },
      { icon: 'car', title: 'Transfer Hizmeti', desc: 'Ücretsiz havalimanı transfer' },
    ],
  },
  veteriner: {
    gradient: 'from-teal-500 to-cyan-600',
    primary: '#14b8a6',
    light: '#f0fdfa',
    cta: 'Randevu Al',
    heroTitle: 'Dostlarınız Emin Ellerde',
    heroSub: 'Sevgili evcil hayvanlarınız için uzman veteriner hizmetleri',
    whyUs: [
      { icon: 'heart', title: 'Sevgiyle Bakım', desc: 'Her hayvanı kendi dostumuz gibi severiz' },
      { icon: 'microscope', title: 'Modern Ekipman', desc: 'Dijital röntgen ve lazer tedavi sistemleri' },
      { icon: 'zap', title: 'Acil Servis', desc: '7/24 acil veteriner hizmeti' },
    ],
  },
  muhasebe: {
    gradient: 'from-blue-600 to-indigo-700',
    primary: '#3b82f6',
    light: '#eff6ff',
    cta: 'Ücretsiz Danışma',
    heroTitle: 'İşletmenizin Mali Geleceğini Güvence Altına Alın',
    heroSub: 'Uzman mali müşavirlik ve muhasebe hizmetleriyle yanınızdayız',
    whyUs: [
      { icon: 'chart', title: 'Dijital Muhasebe', desc: 'Bulut tabanlı anlık finansal takip' },
      { icon: 'lock', title: 'Gizlilik', desc: 'Mali bilgileriniz %100 güvende' },
      { icon: 'zap', title: 'Hızlı Beyan', desc: 'Tüm vergi beyanları zamanında' },
    ],
  },
  saglik: {
    gradient: 'from-green-500 to-emerald-600',
    primary: '#22c55e',
    light: '#f0fdf4',
    cta: 'Randevu Al',
    heroTitle: 'Sağlığınız Bizim Önceliğimiz',
    heroSub: 'Uzman doktor kadrosu ve modern tıbbi ekipmanlarla hizmetinizdeyiz',
    whyUs: [
      { icon: 'stethoscope', title: 'Uzman Doktorlar', desc: 'Alanında uzmanlaşmış hekim kadrosu' },
      { icon: 'activity', title: 'Modern Klinik', desc: 'En son tıbbi teknoloji ve ekipmanlar' },
      { icon: 'calendar', title: 'Kolay Randevu', desc: 'Online randevu sistemi, kısa bekleme süresi' },
    ],
  },
}

const DEFAULT_THEME = {
  gradient: 'from-blue-600 to-indigo-700',
  primary: '#3b82f6',
  light: '#eff6ff',
  cta: 'İletişime Geç',
  heroTitle: 'Profesyonel Hizmetin Doğru Adresi',
  heroSub: 'Kaliteli hizmet ve müşteri memnuniyeti önceliğimizdir',
  whyUs: [
    { icon: 'award', title: 'Uzman Ekip', desc: '10+ yıl deneyimli profesyoneller' },
    { icon: 'shield', title: 'Kalite', desc: 'Müşteri memnuniyeti garantisi' },
    { icon: 'phone', title: '7/24 Destek', desc: 'Her zaman yanınızdayız' },
  ],
}

function getSectorServices(sector: string) {
  const map: Record<string, { icon: string; name: string; desc: string }[]> = {
    dis_klinigi: [
      { icon: 'stethoscope', name: 'İmplant', desc: 'Kalıcı diş implant tedavisi' },
      { icon: 'smile', name: 'Ortodonti', desc: 'Braces ve şeffaf plak tedavisi' },
      { icon: 'sparkles', name: 'Estetik Diş', desc: 'Beyazlatma ve porselen veneer' },
      { icon: 'microscope', name: 'Kanal Tedavisi', desc: 'Ağrısız kanal tedavisi' },
      { icon: 'shield', name: 'Diş Protezi', desc: 'Tam ve kısmi protez çözümleri' },
      { icon: 'calendar', name: 'Genel Muayene', desc: 'Periyodik kontrol ve temizlik' },
    ],
    restoran: [
      { icon: 'chef', name: 'Ana Yemekler', desc: 'Geleneksel Türk mutfağı lezzetleri' },
      { icon: 'leaf', name: 'Salatalar', desc: 'Taze ve sağlıklı salata seçenekleri' },
      { icon: 'sparkles', name: 'Tatlılar', desc: 'El yapımı geleneksel tatlılar' },
      { icon: 'coffee', name: 'İçecekler', desc: 'Geniş içecek ve şerbet menüsü' },
      { icon: 'award', name: 'Özel Etkinlik', desc: 'Düğün, nişan ve organizasyon' },
      { icon: 'truck', name: 'Paket Servis', desc: 'Hızlı ve sıcak teslimat' },
    ],
    avukat: [
      { icon: 'scale', name: 'Ceza Hukuku', desc: 'Profesyonel ceza savunması' },
      { icon: 'home', name: 'Gayrimenkul', desc: 'Tapu ve kira uyuşmazlıkları' },
      { icon: 'briefcase', name: 'Şirket Hukuku', desc: 'Kurumsal hukuki danışmanlık' },
      { icon: 'users', name: 'Aile Hukuku', desc: 'Boşanma ve velayet davaları' },
      { icon: 'car', name: 'Trafik Hukuku', desc: 'Kaza tazminat davaları' },
      { icon: 'doc', name: 'Sözleşme', desc: 'Sözleşme hazırlama ve inceleme' },
    ],
    guzellik_salonu: [
      { icon: 'scissors', name: 'Saç Tasarımı', desc: 'Kesim, boyama ve şekillendirme' },
      { icon: 'sparkles', name: 'Manikür & Pedikür', desc: 'El ve ayak bakımı' },
      { icon: 'heart', name: 'Cilt Bakımı', desc: 'Profesyonel cilt tedavileri' },
      { icon: 'camera', name: 'Kaş & Kirpik', desc: 'Kalıcı makyaj uygulamaları' },
      { icon: 'award', name: 'Masaj & SPA', desc: 'Rahatlatıcı masaj seansları' },
      { icon: 'star', name: 'Gelin Paketi', desc: 'Düğün öncesi özel paket' },
    ],
    insaat: [
      { icon: 'home', name: 'Konut İnşaatı', desc: 'Anahtar teslim ev yapımı' },
      { icon: 'building', name: 'Ticari Yapılar', desc: 'Ofis ve mağaza inşaatı' },
      { icon: 'wrench', name: 'Tadilat', desc: 'İç mekan yenileme hizmetleri' },
      { icon: 'hardhat', name: 'Çatı & Cephe', desc: 'Mantolama ve çatı işleri' },
      { icon: 'zap', name: 'Tesisat', desc: 'Su, elektrik, doğalgaz tesisatı' },
      { icon: 'doc', name: 'Mimari Proje', desc: 'Ruhsat ve proje çizimi' },
    ],
    oto_galeri: [
      { icon: 'car', name: '2. El Araçlar', desc: 'Garantili ikinci el satış' },
      { icon: 'sparkles', name: 'Sıfır Araçlar', desc: 'Tüm marka ve modeller' },
      { icon: 'award', name: 'Takas', desc: 'Araç takası yapılır' },
      { icon: 'credit', name: 'Kredi', desc: 'Uygun faizli araç kredisi' },
      { icon: 'wrench', name: 'Servis', desc: 'Periyodik bakım hizmetleri' },
      { icon: 'search', name: 'Ekspertiz', desc: 'Güvenilir ekspertiz raporu' },
    ],
    otel: [
      { icon: 'bed', name: 'Standart Oda', desc: 'Konforlu konaklama seçeneği' },
      { icon: 'star', name: 'Suite Oda', desc: 'Lüks suite odalarımız' },
      { icon: 'coffee', name: 'Kahvaltı', desc: 'Açık büfe Türk kahvaltısı' },
      { icon: 'sparkles', name: 'Havuz & SPA', desc: 'Kapalı ve açık havuz' },
      { icon: 'award', name: 'Organizasyon', desc: 'Düğün ve toplantı salonları' },
      { icon: 'car', name: 'Transfer', desc: 'Havalimanı transfer hizmeti' },
    ],
    veteriner: [
      { icon: 'paw', name: 'Genel Muayene', desc: 'Köpek ve kedi muayenesi' },
      { icon: 'syringe', name: 'Aşılama', desc: 'Rutin aşı programları' },
      { icon: 'microscope', name: 'Laboratuvar', desc: 'Kan ve idrar tahlili' },
      { icon: 'stethoscope', name: 'Diş Bakımı', desc: 'Veteriner diş tedavisi' },
      { icon: 'activity', name: 'Ameliyat', desc: 'Modern cerrahi ekipman' },
      { icon: 'scissors', name: 'Grooming', desc: 'Tıraş ve banyo hizmeti' },
    ],
    muhasebe: [
      { icon: 'chart', name: 'Muhasebe', desc: 'Aylık muhasebe hizmetleri' },
      { icon: 'receipt', name: 'Vergi Beyanı', desc: 'KDV ve gelir vergisi beyanı' },
      { icon: 'briefcase', name: 'Şirket Kuruluşu', desc: 'Hızlı şirket kuruluş hizmeti' },
      { icon: 'doc', name: 'Bordro', desc: 'SGK ve bordro işlemleri' },
      { icon: 'search', name: 'Denetim', desc: 'Mali müşavirlik ve denetim' },
      { icon: 'chart', name: 'Finansal Analiz', desc: 'İşletme karlılık analizi' },
    ],
    saglik: [
      { icon: 'stethoscope', name: 'Genel Muayene', desc: 'Uzman doktor muayenesi' },
      { icon: 'microscope', name: 'Tahlil', desc: 'Kan ve idrar tahlili' },
      { icon: 'activity', name: 'Görüntüleme', desc: 'Röntgen, USG, MR' },
      { icon: 'heart', name: 'Poliklinik', desc: 'Tüm branşlarda uzman' },
      { icon: 'shield', name: 'Check-Up', desc: 'Kapsamlı sağlık taraması' },
      { icon: 'zap', name: 'Acil', desc: '7/24 acil servis hizmeti' },
    ],
  }
  return map[sector] || [
    { icon: 'check', name: 'Hizmetlerimiz', desc: 'Profesyonel çözümler' },
    { icon: 'award', name: 'Kalite', desc: 'Müşteri odaklı yaklaşım' },
    { icon: 'shield', name: 'Güvenilirlik', desc: 'Kaliteli ve güvenilir' },
    { icon: 'zap', name: 'Hız', desc: 'Hızlı ve etkili hizmet' },
    { icon: 'clock', name: '7/24 Destek', desc: 'Her zaman yanınızdayız' },
    { icon: 'users', name: 'Ekibimiz', desc: 'Uzman kadromuzla hizmetinizdeyiz' },
  ]
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-800 mb-2">Demo bulunamadı</p>
          <p className="text-gray-500">Link geçersiz veya süresi dolmuş.</p>
        </div>
      </div>
    )
  }

  if (data.expired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="max-w-md text-center bg-white rounded-2xl shadow-lg p-8">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Demo Süresi Doldu</h2>
          <p className="text-gray-500 mb-6">
            {data.lead.name} için hazırladığımız demo süresi sona erdi.
          </p>
          <p className="text-gray-500 text-sm">Yeni bir demo için {data.brand_name} ile iletişime geçin.</p>
        </div>
      </div>
    )
  }

  const { lead, analysis } = data
  const sector = lead.sector || 'genel'
  const theme = SECTOR_THEMES[sector] || DEFAULT_THEME
  // Gerçek hizmetler varsa kullan, yoksa sektör şablonuna dön
  const realServices = analysis.extracted_services && analysis.extracted_services.length >= 3
    ? analysis.extracted_services.slice(0, 6).map((name, i) => {
        const template = getSectorServices(sector)[i]
        return { icon: template?.icon || '✅', name, desc: template?.desc || 'Profesyonel hizmet' }
      })
    : null
  const services = realServices || getSectorServices(sector)
  const phone = lead.phone || analysis.extracted_phone
  const address = analysis.address_text || (lead.city + (lead.district ? `, ${lead.district}` : ''))
  const expiresAt = new Date(data.report.demo_expires_at)
  const daysLeft = Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / 86400000))

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Demo Bandı — üstte */}
      <div className="bg-gray-950 text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-gray-800">
        <div className="flex items-center gap-3">
          {/* Eski site butonu */}
          <a
            href={lead.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-all font-medium"
            title="Mevcut sitenizi yeni sekmede açar"
          >
            ← Eski siteniz
          </a>
          <span className="text-gray-600 hidden sm:inline">vs</span>
          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded font-bold tracking-wide hidden sm:inline">YENİ DEMO</span>
          <span className="text-gray-600 hidden md:inline">•</span>
          <span className="text-gray-400 hidden md:inline">{data.brand_name} tarafından hazırlandı</span>
          <span className="text-gray-600">•</span>
          <Clock className="w-3 h-3 text-yellow-400" />
          <span className="text-yellow-300">{daysLeft} gün kaldı</span>
        </div>
        <button
          onClick={requestPrice}
          disabled={priceSent}
          className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-all whitespace-nowrap ${
            priceSent
              ? 'bg-green-800 text-green-300 cursor-default'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {priceSent ? '✓ Talebiniz Alındı' : '💡 Fiyat İstiyorum'}
        </button>
      </div>

      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {analysis.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={analysis.logo_url}
                alt={lead.name}
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg ${analysis.logo_url ? 'hidden' : ''}`}
              style={{ background: theme.primary }}>
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">{lead.name}</span>
          </div>

          {/* Nav linkleri */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#hizmetler" className="hover:text-gray-900 transition-colors">Hizmetler</a>
            <a href="#neden-biz" className="hover:text-gray-900 transition-colors">Neden Biz?</a>
            <a href="#iletisim" className="hover:text-gray-900 transition-colors">İletişim</a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            {phone && (
              <a href={`tel:${phone}`} className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                <Phone className="w-4 h-4" />
                {phone}
              </a>
            )}
            <a
              href="#iletisim"
              className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90"
              style={{ background: theme.primary }}
            >
              {theme.cta}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="text-white py-20 px-6 relative overflow-hidden"
        style={
          analysis.gallery_images?.[0]
            ? { backgroundImage: `url(${analysis.gallery_images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: `linear-gradient(135deg, var(--tw-gradient-stops))` }
        }
      >
        {analysis.gallery_images?.[0] && (
          <div className="absolute inset-0 bg-black/60" />
        )}
        {!analysis.gallery_images?.[0] && (
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
        )}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {lead.name}
          </h1>
          <p className="text-xl md:text-2xl font-medium opacity-90 mb-3">
            {theme.heroTitle}
          </p>
          <p className="text-base opacity-75 mb-8 max-w-2xl mx-auto">
            {theme.heroSub} — {lead.city}{lead.district ? ` / ${lead.district}` : ''}
            {analysis.founding_year ? ` • ${analysis.founding_year}\u2019den beri hizmetinizdeyiz` : ''}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#iletisim"
              className="bg-white font-bold px-8 py-3 rounded-xl text-base hover:opacity-90 transition-all shadow-lg"
              style={{ color: theme.primary }}
            >
              {theme.cta} →
            </a>
            <a
              href="#hizmetler"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl text-base hover:bg-white/10 transition-all"
            >
              Hizmetlerimiz
            </a>
          </div>
          {lead.google_rating && (
            <div className="mt-8 flex items-center justify-center gap-2 text-sm opacity-75">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(lead.google_rating!) ? 'fill-yellow-300 text-yellow-300' : 'text-white/30'}`} />
                ))}
              </div>
              <span>{lead.google_rating} / 5 • {lead.google_review_count || 0}+ yorum</span>
            </div>
          )}
        </div>
      </section>

      {/* Hizmetler */}
      <section id="hizmetler" className="py-20 px-6" style={{ background: theme.light }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Hizmetlerimiz</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Uzman ekibimizle sunduğumuz profesyonel hizmetler</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: theme.light }}>
                  <SvcIcon name={service.icon} className="w-6 h-6" style={{ color: theme.primary }} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{service.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all" style={{ color: theme.primary }}>
                  Detaylı bilgi <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hakkımızda — sadece gerçek içerik varsa göster */}
      {analysis.about_text && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: theme.primary }}>Hakkımızda</span>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4">{lead.name}</h2>
              <p className="text-gray-600 leading-relaxed">{analysis.about_text}</p>
              {analysis.founding_year && (
                <p className="mt-4 text-sm font-semibold" style={{ color: theme.primary }}>
                  {analysis.founding_year}&apos;den beri hizmetinizdeyiz
                </p>
              )}
            </div>
            <div className="w-32 h-32 rounded-2xl flex items-center justify-center text-white text-5xl font-extrabold flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}99)` }}>
              {lead.name.charAt(0)}
            </div>
          </div>
        </section>
      )}

      {/* Neden Biz */}
      <section id="neden-biz" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Neden Bizi Seçmelisiniz?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Müşterilerimiz neden bize güveniyor?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {theme.whyUs.map((item, i) => (
              <div key={i} className="text-center p-8 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: theme.light }}>
                  <SvcIcon name={item.icon} className="w-7 h-7" style={{ color: theme.primary }} />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Özellikler listesi */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Uzman Kadro', 'Güvenilir Hizmet', 'Uygun Fiyat', 'Müşteri Memnuniyeti'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: theme.primary }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Yorumları — sadece gerçek veri varsa */}
      {lead.google_rating && lead.google_review_count && (
        <section className="py-16 px-6" style={{ background: theme.light }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Müşteri Memnuniyeti</h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 inline-block">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-6 h-6 ${i < Math.round(lead.google_rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                </div>
                <span className="text-3xl font-extrabold text-gray-900">{lead.google_rating}</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">Google üzerinde <strong className="text-gray-700">{lead.google_review_count}+ müşteri yorumu</strong></p>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(lead.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border transition-all hover:opacity-80"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                <ExternalLink className="w-4 h-4" /> Tüm yorumları Google&apos;da gör
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Fotoğraf Galerisi — sadece gerçek görseller varsa */}
      {analysis.gallery_images && analysis.gallery_images.length >= 2 && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900">
                {sector === 'dis_klinigi' ? 'Kliniğimizden' :
                 sector === 'restoran' ? 'Restoranımızdan' :
                 sector === 'insaat' ? 'Projelerimizden' :
                 sector === 'guzellik_salonu' ? 'Salonumuzdan' :
                 'Galeri'}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {analysis.gallery_images.slice(0, 4).map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt={`${lead.name} - ${i + 1}`}
                  className="w-full h-48 object-cover rounded-2xl shadow-sm"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* İletişim */}
      <section id="iletisim" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Bize Ulaşın</h2>
            <p className="text-gray-500">Size en kısa sürede dönüş yapacağız</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {phone && (
                <a href={`tel:${phone}`} className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: theme.primary }}>
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Telefon</p>
                    <p className="font-semibold text-gray-900">{phone}</p>
                  </div>
                </a>
              )}
              <div className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: theme.primary }}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Adres</p>
                  <p className="font-semibold text-gray-900">{address}</p>
                </div>
              </div>
              <a href={lead.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: theme.primary }}>
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Web Sitesi</p>
                  <p className="font-semibold text-gray-900 text-sm">{lead.website}</p>
                </div>
              </a>
            </div>

            {/* CTA Kartı */}
            <div className={`bg-gradient-to-br ${theme.gradient} text-white rounded-2xl p-8 flex flex-col justify-center`}>
              <h3 className="text-2xl font-extrabold mb-3">{theme.cta} →</h3>
              <p className="opacity-80 mb-6 text-sm leading-relaxed">
                Hemen iletişime geçin, en kısa sürede size dönüş yapalım.
              </p>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="bg-white font-bold px-6 py-3 rounded-xl text-center text-base hover:opacity-90 transition-all"
                  style={{ color: theme.primary }}
                >
                  📞 {phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Yapılan İyileştirmeler */}
      <section className="py-16 px-6 bg-gray-950 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3 block">Bu Demo Sitede Yapılanlar</span>
            <h2 className="text-2xl font-extrabold mb-2">Eski sitenizde eksik olan her şey tamamlandı</h2>
            <p className="text-gray-400 text-sm">Analiz raporunuzda tespit edilen sorunlar bu demo sitede çözülmüş olarak gösterilmektedir</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: 'smartphone', title: 'Mobil Uyumlu Tasarım', desc: 'Her ekran boyutunda mükemmel görünüm' },
              { icon: 'zap', title: 'Hızlı Yükleme', desc: 'Optimize edilmiş kod ve görseller' },
              { icon: 'search', title: 'SEO Optimizasyonu', desc: 'Google\'da üst sıralara çıkacak yapı' },
              { icon: 'chat', title: 'WhatsApp Entegrasyonu', desc: 'Müşteriler tek tuşla ulaşabilir' },
              { icon: 'doc', title: 'İletişim Formu', desc: 'Gelen mesajlar anında size iletilir' },
              { icon: 'lock', title: 'SSL Güvenlik', desc: 'Ziyaretçileriniz güvende hisseder' },
              { icon: 'chart', title: 'Google Analytics', desc: 'Ziyaretçi takibi ve raporlama' },
              { icon: 'globe', title: 'Google Maps Entegrasyonu', desc: 'Adresiniz kolayca bulunur' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <SvcIcon name={item.icon} className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-green-400 text-xs font-bold">✓ TAMAMLANDI</span>
                  </div>
                  <p className="font-semibold text-white text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={requestPrice}
              disabled={priceSent}
              className={`text-base font-bold px-8 py-4 rounded-xl transition-all ${
                priceSent
                  ? 'bg-green-900 text-green-300 cursor-default'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {priceSent ? '✓ Talebiniz Alındı — Sizi Arayacağız' : '💡 Bu Siteyi Gerçek Yapmak İstiyorum →'}
            </button>
            <p className="text-gray-500 text-xs mt-3">Ücretsiz danışma • Fiyat teklifi • Bağlayıcı değil</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-white">{lead.name}</p>
            <p className="text-sm mt-1">{address}</p>
          </div>
          {phone && (
            <a href={`tel:${phone}`} className="text-sm hover:text-white transition-colors">{phone}</a>
          )}
        </div>
      </footer>

      {/* Sticky Alt CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-900">Bu sitenin gerçeği olsun mu?</p>
          <p className="text-xs text-gray-500">{data.brand_name} ile profesyonel web sitesi</p>
        </div>
        <button
          onClick={requestPrice}
          disabled={priceSent}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            priceSent
              ? 'bg-green-100 text-green-700 cursor-default'
              : 'text-white hover:opacity-90'
          }`}
          style={priceSent ? {} : { background: theme.primary }}
        >
          {priceSent ? '✓ Talebiniz Alındı' : '💡 Ücretsiz Teklif Al'}
        </button>
      </div>
      <div className="h-16" />
    </div>
  )
}
