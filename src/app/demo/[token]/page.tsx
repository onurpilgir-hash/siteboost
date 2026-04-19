'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import {
  Clock, Phone, MapPin, Star, ExternalLink, CheckCircle, ChevronRight,
  Stethoscope, Sparkles, Shield, Calendar, Heart, Award, Zap, Users,
  ChefHat, Leaf, Truck, Scale, Building2, Home, Car, CreditCard,
  Bed, Coffee, PawPrint, Syringe, Scissors, BarChart3, Receipt,
  Activity, Wrench, HardHat, Briefcase, Smile, Camera, Microscope,
  Smartphone, Search, Lock, MessageCircle, FileText, Globe, Laptop,
  type LucideIcon
} from 'lucide-react'

const font = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] })

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

// Sektöre göre Unsplash CDN fotoğrafları — API key gerekmez
const SECTOR_PHOTOS: Record<string, { hero: string; services: string }> = {
  dis_klinigi: {
    hero: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1600&q=85',
    services: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80',
  },
  restoran: {
    hero: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=85',
    services: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
  },
  avukat: {
    hero: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=1600&q=85',
    services: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80',
  },
  guzellik_salonu: {
    hero: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=85',
    services: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80',
  },
  insaat: {
    hero: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=85',
    services: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
  },
  oto_galeri: {
    hero: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1600&q=85',
    services: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80',
  },
  otel: {
    hero: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85',
    services: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80',
  },
  veteriner: {
    hero: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600&q=85',
    services: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1200&q=80',
  },
  muhasebe: {
    hero: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=85',
    services: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
  },
  saglik: {
    hero: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1600&q=85',
    services: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80',
  },
}

const DEFAULT_PHOTO = {
  hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=85',
  services: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80',
}

// Domain URL'ini okunabilir firma adına çevir
function cleanBusinessName(name: string): string {
  if (!name) return name
  if (!name.includes('.') || name.includes(' ')) return name
  return name
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .split('.')[0]
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// Sektöre göre sayısal istatistikler
const SECTOR_STATS: Record<string, { value: string; label: string }[]> = {
  dis_klinigi: [
    { value: '5.000+', label: 'Mutlu Hasta' },
    { value: '10+', label: 'Yıl Deneyim' },
    { value: '15+', label: 'Hizmet Çeşidi' },
    { value: '%100', label: 'Memnuniyet' },
  ],
  restoran: [
    { value: '200+', label: 'Menü Çeşidi' },
    { value: '1.000+', label: 'Mutlu Misafir' },
    { value: '10+', label: 'Yıl Deneyim' },
    { value: '7/24', label: 'Rezervasyon' },
  ],
  avukat: [
    { value: '500+', label: 'Başarılı Dava' },
    { value: '20+', label: 'Yıl Deneyim' },
    { value: '%98', label: 'Müvekkil Memnuniyeti' },
    { value: '7/24', label: 'Ulaşılabilirlik' },
  ],
  guzellik_salonu: [
    { value: '3.000+', label: 'Mutlu Müşteri' },
    { value: '8+', label: 'Yıl Deneyim' },
    { value: '50+', label: 'Hizmet Çeşidi' },
    { value: '%100', label: 'Memnuniyet' },
  ],
  insaat: [
    { value: '200+', label: 'Tamamlanan Proje' },
    { value: '15+', label: 'Yıl Deneyim' },
    { value: '50+', label: 'Uzman Ekip' },
    { value: '%100', label: 'Zamanında Teslimat' },
  ],
  oto_galeri: [
    { value: '1.000+', label: 'Satılan Araç' },
    { value: '12+', label: 'Yıl Deneyim' },
    { value: '500+', label: 'Mevcut Araç' },
    { value: '%100', label: 'Güvenilir Ekspertiz' },
  ],
  otel: [
    { value: '10.000+', label: 'Mutlu Misafir' },
    { value: '15+', label: 'Yıl Deneyim' },
    { value: '50+', label: 'Oda Kapasitesi' },
    { value: '4.8★', label: 'Google Puanı' },
  ],
  veteriner: [
    { value: '8.000+', label: 'Tedavi Edilen Hayvan' },
    { value: '10+', label: 'Yıl Deneyim' },
    { value: '7/24', label: 'Acil Servis' },
    { value: '%100', label: 'Özen ve Sevgi' },
  ],
  muhasebe: [
    { value: '300+', label: 'Aktif Müşteri' },
    { value: '15+', label: 'Yıl Deneyim' },
    { value: '%100', label: 'Zamanında Beyan' },
    { value: '7/24', label: 'Destek' },
  ],
  saglik: [
    { value: '20.000+', label: 'Mutlu Hasta' },
    { value: '15+', label: 'Uzman Doktor' },
    { value: '20+', label: 'Yıl Deneyim' },
    { value: '7/24', label: 'Acil Servis' },
  ],
}

const DEFAULT_STATS = [
  { value: '1.000+', label: 'Mutlu Müşteri' },
  { value: '10+', label: 'Yıl Deneyim' },
  { value: '%100', label: 'Memnuniyet' },
  { value: '7/24', label: 'Destek' },
]

// Sektöre göre SSS
const SECTOR_FAQ: Record<string, { q: string; a: string }[]> = {
  dis_klinigi: [
    { q: 'İmplant tedavisi ağrılı mı?', a: 'Lokal anestezi ile gerçekleştirilen implant tedavisi tamamen ağrısız bir süreçtir. İşlem sonrasında hafif bir rahatsızlık hissedilebilir, ancak bu durum reçete edilen ağrı kesicilerle kolayca kontrol altına alınabilir.' },
    { q: 'Diş beyazlatma kalıcı mı?', a: 'Diş beyazlatma işleminin etkisi kişinin ağız hijyenine ve beslenme alışkanlıklarına bağlı olarak 1-3 yıl arasında sürebilir. Düzenli kontroller ve doğru bakımla bu süre uzatılabilir.' },
    { q: 'Randevu için ne kadar beklerim?', a: 'Online randevu sistemimiz sayesinde genellikle aynı gün veya ertesi gün randevu alabilirsiniz. Acil durumlarda öncelikli muayene imkânı sunuyoruz.' },
    { q: 'Çocuklar için diş tedavisi yapıyor musunuz?', a: 'Evet, çocuk hastalara özel yaklaşımımız ve çocuk diş hekimi kadromuzla tüm yaş gruplarına hizmet veriyoruz.' },
    { q: 'Sigorta kabul ediyor musunuz?', a: 'SGK ve özel sigorta anlaşmalarımız hakkında bilgi almak için kliniğimizi arayabilirsiniz.' },
  ],
  restoran: [
    { q: 'Rezervasyon zorunlu mu?', a: 'Rezervasyon zorunlu değil, ancak özellikle hafta sonları ve özel günlerde önceden rezervasyon yaptırmanızı öneririz.' },
    { q: 'Vejetaryen/vegan seçenek var mı?', a: 'Evet, menümüzde çeşitli vejetaryen ve vegan seçenekler mevcuttur. Özel diyet gereksinimleriniz için mutfağımızı önceden bilgilendirebilirsiniz.' },
    { q: 'Organizasyon düzenliyor musunuz?', a: 'Düğün, nişan, doğum günü ve kurumsal etkinlikler için özel organizasyon hizmetimiz mevcuttur. Detaylı bilgi için iletişime geçin.' },
    { q: 'Paket servis yapıyor musunuz?', a: 'Evet, bölgemize paket servis hizmetimiz bulunmaktadır. Minimum sipariş tutarı için lütfen bizi arayın.' },
    { q: 'Çocuklar için özel menü var mı?', a: 'Küçük misafirlerimiz için özel çocuk menümüz mevcuttur.' },
  ],
  avukat: [
    { q: 'İlk danışma ücretli mi?', a: 'İlk 30 dakikalık danışma ücretsizdir. Davanızın kapsamını değerlendirdikten sonra size net bir ücret teklifi sunarız.' },
    { q: 'Dava süreçleri ne kadar sürer?', a: 'Dava türüne ve mahkeme süreçlerine göre değişmekle birlikte, sizi düzenli olarak bilgilendiriyor ve süreci hızlandırmak için aktif çalışıyoruz.' },
    { q: 'Online danışma yapabiliyor musunuz?', a: 'Evet, video konferans veya telefon aracılığıyla online danışma hizmeti sunuyoruz.' },
    { q: 'Hangi hukuk alanlarında hizmet veriyorsunuz?', a: 'Ceza hukuku, aile hukuku, gayrimenkul, iş hukuku, şirket hukuku ve trafik hukuku başta olmak üzere birçok alanda hizmet veriyoruz.' },
    { q: 'Vekâletname nasıl düzenlenir?', a: 'Vekâletname için notere gitmeniz gerekmektedir. Gerekli belgeler ve süreç hakkında sizi önceden bilgilendiririz.' },
  ],
  guzellik_salonu: [
    { q: 'Randevu almadan gelebilir miyim?', a: 'Randevusuz gelen müşterilerimize de hizmet vermeye çalışıyoruz, ancak bekleme süresi olabilir. Randevu ile öncelikli hizmet alırsınız.' },
    { q: 'Hangi saç boyası markalarını kullanıyorsunuz?', a: 'Uluslararası sertifikalı, saç dostu premium marka boyalar kullanıyoruz. Sağlığınız bizim için önceliklidir.' },
    { q: 'Gelin paketi ne içeriyor?', a: 'Gelin paketimiz; saç tasarımı, makyaj, manikür ve pedikür hizmetlerini kapsamaktadır. Deneme seansı da dahildir.' },
    { q: 'Erkekler için de hizmet veriyor musunuz?', a: 'Evet, erkek saç kesimi ve bakım hizmetlerimiz de mevcuttur.' },
    { q: 'Fiyat listesi var mı?', a: 'Güncel fiyat listemiz için lütfen bizi arayın veya WhatsApp üzerinden ulaşın.' },
  ],
  insaat: [
    { q: 'Proje teslim süreleri nasıl belirlenir?', a: 'Proje büyüklüğü ve kapsamına göre sözleşmede belirlenen teslim tarihleri garanti altına alınmaktadır.' },
    { q: 'Malzeme garantisi veriyor musunuz?', a: 'Evet, kullandığımız tüm malzemeler için tedarikçi garantisi ve işçilik garantisi sunuyoruz.' },
    { q: 'Ruhsat işlemlerini siz mi yapıyorsunuz?', a: 'İnşaat ruhsatı ve gerekli izin süreçlerinde size tam destek sağlıyoruz.' },
    { q: 'Tadilat için minimum bütçe nedir?', a: 'Tadilat projenizin kapsamına göre değişmektedir. Ücretsiz keşif için bizi arayabilirsiniz.' },
    { q: 'İstanbul dışında hizmet veriyor musunuz?', a: 'Türkiye genelinde proje kabul ediyoruz. Detaylar için iletişime geçin.' },
  ],
}

const DEFAULT_FAQ = [
  { q: 'Hizmetleriniz hakkında bilgi alabilir miyim?', a: 'Tüm hizmetlerimiz hakkında detaylı bilgi almak için bizi arayabilir veya WhatsApp üzerinden ulaşabilirsiniz.' },
  { q: 'Çalışma saatleriniz nedir?', a: 'Pazartesi-Cuma 09:00-18:00, Cumartesi 09:00-14:00 saatleri arasında hizmet veriyoruz.' },
  { q: 'Randevu almak gerekiyor mu?', a: 'Randevu almanızı tavsiye ederiz, ancak müsaitlik durumuna göre randevusuz da hizmet alabilirsiniz.' },
  { q: 'Ödeme seçenekleriniz nelerdir?', a: 'Nakit, kredi kartı ve banka kartı ile ödeme kabul ediyoruz.' },
]

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
    score_genel?: number
    package_recommendation?: string
    logo_url?: string
    primary_color?: string
    address_text?: string
    extracted_phone?: string
    extracted_services?: string[]
    about_text?: string
    founding_year?: string
    gallery_images?: string[]
  } | null
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
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
      <div className={`${font.className} min-h-screen flex items-center justify-center bg-white`}>
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className={`${font.className} min-h-screen flex items-center justify-center bg-white`}>
        <div className="text-center">
          <p className="text-xl font-bold text-gray-800 mb-2">Demo bulunamadı</p>
          <p className="text-gray-500">Link geçersiz veya süresi dolmuş.</p>
        </div>
      </div>
    )
  }

  if (data.expired) {
    return (
      <div className={`${font.className} min-h-screen flex items-center justify-center bg-gray-50 p-8`}>
        <div className="max-w-md text-center bg-white rounded-2xl shadow-lg p-8">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Demo Süresi Doldu</h2>
          <p className="text-gray-500 mb-6">{data.lead.name} için hazırladığımız demo süresi sona erdi.</p>
          <p className="text-gray-500 text-sm">Yeni bir demo için {data.brand_name} ile iletişime geçin.</p>
        </div>
      </div>
    )
  }

  const { lead } = data
  const analysis = data.analysis || {}
  const sector = lead.sector || 'genel'
  const theme = SECTOR_THEMES[sector] || DEFAULT_THEME
  const photos = SECTOR_PHOTOS[sector] || DEFAULT_PHOTO
  const displayName = cleanBusinessName(lead.name)
  const stats = SECTOR_STATS[sector] || DEFAULT_STATS
  const faq = SECTOR_FAQ[sector] || DEFAULT_FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Gerçek fotoğraf varsa (gallery_images) onu kullan, yoksa Unsplash
  const heroBg = analysis.gallery_images?.[0] || photos.hero

  const realServices = analysis.extracted_services && analysis.extracted_services.length >= 3
    ? analysis.extracted_services.slice(0, 6).map((name: string, i: number) => {
        const template = getSectorServices(sector)[i]
        return { icon: template?.icon || 'check', name, desc: template?.desc || 'Profesyonel hizmet' }
      })
    : null
  const services = realServices || getSectorServices(sector)
  const phone = lead.phone || analysis.extracted_phone
  const address = analysis.address_text || (lead.city + (lead.district ? `, ${lead.district}` : ''))
  const expiresAt = new Date(data.report.demo_expires_at)
  const daysLeft = Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / 86400000))

  return (
    <div className={`${font.className} min-h-screen bg-white text-gray-900`}>

      {/* Demo Bandı */}
      <div className="bg-gray-950 text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-gray-800">
        <div className="flex items-center gap-3">
          <a
            href={lead.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-all font-medium"
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
            priceSent ? 'bg-green-800 text-green-300 cursor-default' : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {priceSent ? '✓ Talebiniz Alındı' : '💡 Fiyat İstiyorum'}
        </button>
      </div>

      {/* Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {analysis.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={analysis.logo_url}
                alt={lead.name}
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  const t = e.target as HTMLImageElement
                  t.style.display = 'none'
                  t.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg ${analysis.logo_url ? 'hidden' : ''}`}
              style={{ background: theme.primary }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">{displayName}</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#hizmetler" className="hover:text-gray-900 transition-colors">Hizmetler</a>
            <a href="#neden-biz" className="hover:text-gray-900 transition-colors">Neden Biz?</a>
            <a href="#iletisim" className="hover:text-gray-900 transition-colors">İletişim</a>
          </nav>

          <div className="flex items-center gap-3">
            {phone && (
              <a href={`tel:${phone}`} className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                <Phone className="w-4 h-4" />
                {phone}
              </a>
            )}
            <a
              href="#iletisim"
              className="text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90 shadow-sm"
              style={{ background: theme.primary }}
            >
              {theme.cta}
            </a>
          </div>
        </div>
      </header>

      {/* Hero — tam ekran fotoğraflı */}
      <section
        className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Koyu overlay */}
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest mb-4 opacity-80"
               style={{ color: 'rgba(255,255,255,0.7)' }}>
              {lead.city}{lead.district ? ` / ${lead.district}` : ''}
              {analysis.founding_year ? ` • ${analysis.founding_year}'den beri` : ''}
            </p>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-5 leading-tight tracking-tight">
              {displayName}
            </h1>
            <p className="text-xl md:text-2xl font-semibold opacity-90 mb-3">
              {theme.heroTitle}
            </p>
            <p className="text-base md:text-lg opacity-70 mb-10 max-w-2xl mx-auto leading-relaxed">
              {theme.heroSub}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#iletisim"
                className="bg-white font-bold px-9 py-4 rounded-2xl text-base hover:opacity-90 transition-all shadow-xl"
                style={{ color: theme.primary }}
              >
                {theme.cta} →
              </a>
              <a
                href="#hizmetler"
                className="border-2 border-white/70 text-white font-semibold px-9 py-4 rounded-2xl text-base hover:bg-white/10 transition-all"
              >
                Hizmetlerimiz
              </a>
            </div>

            {lead.google_rating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-10 flex items-center justify-center gap-2 text-sm opacity-80"
              >
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(lead.google_rating!) ? 'fill-yellow-300 text-yellow-300' : 'text-white/30'}`} />
                  ))}
                </div>
                <span className="font-semibold">{lead.google_rating} / 5</span>
                <span className="opacity-60">• {lead.google_review_count || 0}+ Google yorumu</span>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Aşağı kaydır göstergesi */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {stats.map((s, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="text-4xl font-extrabold mb-1" style={{ color: theme.primary }}>{s.value}</div>
                <div className="text-sm text-gray-500 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Hizmetler */}
      <section id="hizmetler" className="py-24 px-6" style={{ background: theme.light }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: theme.primary }}>
              Ne Yapıyoruz?
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Hizmetlerimiz</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">Uzman ekibimizle sunduğumuz profesyonel hizmetler</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {services.map((service, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-default"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: theme.light }}
                >
                  <SvcIcon name={service.icon} className="w-7 h-7" style={{ color: theme.primary }} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{service.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
                <div className="mt-5 flex items-center gap-1 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all" style={{ color: theme.primary }}>
                  Detaylı bilgi <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Hakkımızda — sadece gerçek içerik varsa */}
      {analysis.about_text && (
        <section className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="flex flex-col md:flex-row gap-12 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-widest mb-4 block" style={{ color: theme.primary }}>
                  Hakkımızda
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-5 tracking-tight">{displayName}</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{analysis.about_text}</p>
                {analysis.founding_year && (
                  <p className="mt-5 text-sm font-bold" style={{ color: theme.primary }}>
                    {analysis.founding_year}&apos;den beri hizmetinizdeyiz
                  </p>
                )}
              </div>
              <div
                className="w-40 h-40 rounded-3xl flex items-center justify-center text-white text-6xl font-extrabold flex-shrink-0 shadow-xl"
                style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}99)` }}
              >
                {displayName.charAt(0)}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Neden Biz — fotoğraf arka planıyla */}
      <section
        id="neden-biz"
        className="py-24 px-6 relative overflow-hidden"
        style={{ backgroundImage: `url(${photos.services})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: theme.primary }}>
              Fark Yaratan Özellikler
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Neden Bizi Seçmelisiniz?</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">Müşterilerimiz neden bize güveniyor?</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {theme.whyUs.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="text-center p-10 rounded-3xl bg-white shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm"
                  style={{ background: theme.light }}
                >
                  <SvcIcon name={item.icon} className="w-8 h-8" style={{ color: theme.primary }} />
                </div>
                <h3 className="font-extrabold text-gray-900 text-xl mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {['Uzman Kadro', 'Güvenilir Hizmet', 'Uygun Fiyat', 'Müşteri Memnuniyeti'].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: theme.primary }} />
                <span>{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Google Yorumları */}
      {lead.google_rating && lead.google_review_count && (
        <section className="py-20 px-6 bg-white">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: theme.primary }}>
              Müşteri Memnuniyeti
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Google Yorumları</h2>
            <div className="bg-gray-50 rounded-3xl p-10 shadow-sm border border-gray-100 inline-block w-full">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-7 h-7 ${i < Math.round(lead.google_rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                </div>
                <span className="text-4xl font-extrabold text-gray-900">{lead.google_rating}</span>
              </div>
              <p className="text-gray-500 mb-6">Google üzerinde <strong className="text-gray-700">{lead.google_review_count}+ müşteri yorumu</strong></p>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(lead.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold px-5 py-3 rounded-xl border-2 transition-all hover:opacity-80"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                <ExternalLink className="w-4 h-4" /> Tüm yorumları Google&apos;da gör
              </a>
            </div>
          </motion.div>
        </section>
      )}

      {/* Fotoğraf Galerisi */}
      {analysis.gallery_images && analysis.gallery_images.length >= 2 && (
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {sector === 'dis_klinigi' ? 'Kliniğimizden' :
                 sector === 'restoran' ? 'Restoranımızdan' :
                 sector === 'insaat' ? 'Projelerimizden' :
                 sector === 'guzellik_salonu' ? 'Salonumuzdan' : 'Galeri'}
              </h2>
            </motion.div>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              {analysis.gallery_images.slice(0, 4).map((url, i) => (
                <motion.div key={i} variants={fadeUp}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${lead.name} - ${i + 1}`}
                    className="w-full h-52 object-cover rounded-2xl shadow-sm hover:shadow-md transition-all"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* SSS */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: theme.primary }}>Merak Edilenler</span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sıkça Sorulan Sorular</h2>
          </motion.div>
          <motion.div className="space-y-3" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {faq.map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <span>{item.q}</span>
                  <span className="ml-4 flex-shrink-0 text-xl" style={{ color: theme.primary }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">{item.a}</div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* İletişim */}
      <section id="iletisim" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: theme.primary }}>
              Bize Ulaşın
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Hemen İletişime Geçin</h2>
            <p className="text-gray-500 text-lg">Size en kısa sürede dönüş yapacağız</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="space-y-5">
              {phone && (
                <a href={`tel:${phone}`} className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all group">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-sm" style={{ background: theme.primary }}>
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5 font-medium">Telefon</p>
                    <p className="font-bold text-gray-900 text-lg">{phone}</p>
                  </div>
                </a>
              )}
              <div className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-sm" style={{ background: theme.primary }}>
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5 font-medium">Adres</p>
                  <p className="font-bold text-gray-900">{address}</p>
                </div>
              </div>
              {lead.website && (
                <a href={lead.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-sm" style={{ background: theme.primary }}>
                    <ExternalLink className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5 font-medium">Web Sitesi</p>
                    <p className="font-semibold text-gray-900 text-sm">{lead.website}</p>
                  </div>
                </a>
              )}
            </motion.div>

            <motion.div
              variants={fadeUp}
              className={`bg-gradient-to-br ${theme.gradient} text-white rounded-3xl p-10 flex flex-col justify-center shadow-xl`}
            >
              <h3 className="text-2xl font-extrabold mb-3">{theme.cta} →</h3>
              <p className="opacity-80 mb-8 leading-relaxed">
                Hemen iletişime geçin, en kısa sürede size dönüş yapalım.
              </p>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="bg-white font-bold px-6 py-4 rounded-2xl text-center text-base hover:opacity-90 transition-all shadow-md"
                  style={{ color: theme.primary }}
                >
                  📞 {phone}
                </a>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Yapılan İyileştirmeler */}
      <section className="py-24 px-6 bg-gray-950 text-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3 block">Bu Demo Sitede Yapılanlar</span>
            <h2 className="text-3xl font-extrabold mb-3 tracking-tight">Eski sitenizde eksik olan her şey tamamlandı</h2>
            <p className="text-gray-400">Analiz raporunuzda tespit edilen sorunlar bu demo sitede çözülmüş olarak gösterilmektedir</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              { icon: 'smartphone', title: 'Mobil Uyumlu Tasarım', desc: 'Her ekran boyutunda mükemmel görünüm' },
              { icon: 'zap', title: 'Hızlı Yükleme', desc: 'Optimize edilmiş kod ve görseller' },
              { icon: 'search', title: 'SEO Optimizasyonu', desc: "Google'da üst sıralara çıkacak yapı" },
              { icon: 'chat', title: 'WhatsApp Entegrasyonu', desc: 'Müşteriler tek tuşla ulaşabilir' },
              { icon: 'doc', title: 'İletişim Formu', desc: 'Gelen mesajlar anında size iletilir' },
              { icon: 'lock', title: 'SSL Güvenlik', desc: 'Ziyaretçileriniz güvende hisseder' },
              { icon: 'smartphone', title: 'Mobil Uyumlu Tasarım', desc: 'Her cihazda mükemmel görünüm' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <SvcIcon name={item.icon} className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <span className="text-green-400 text-xs font-bold mb-1 block">✓ TAMAMLANDI</span>
                  <p className="font-bold text-white">{item.title}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-10 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <button
              onClick={requestPrice}
              disabled={priceSent}
              className={`text-base font-bold px-10 py-5 rounded-2xl transition-all shadow-xl ${
                priceSent ? 'bg-green-900 text-green-300 cursor-default' : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {priceSent ? '✓ Talebiniz Alındı — Sizi Arayacağız' : '💡 Bu Siteyi Gerçek Yapmak İstiyorum →'}
            </button>
            <p className="text-gray-500 text-sm mt-4">Ücretsiz danışma • Fiyat teklifi • Bağlayıcı değil</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white">{displayName}</p>
            <p className="text-sm mt-1">{address}</p>
          </div>
          {phone && (
            <a href={`tel:${phone}`} className="text-sm hover:text-white transition-colors">{phone}</a>
          )}
        </div>
      </footer>

      {/* Sticky Alt CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-lg px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-900">Bu sitenin gerçeği olsun mu?</p>
          <p className="text-xs text-gray-500">{data.brand_name} ile profesyonel web sitesi</p>
        </div>
        <button
          onClick={requestPrice}
          disabled={priceSent}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
            priceSent ? 'bg-green-100 text-green-700 cursor-default' : 'text-white hover:opacity-90'
          }`}
          style={priceSent ? {} : { background: theme.primary }}
        >
          {priceSent ? '✓ Talebiniz Alındı' : '💡 Ücretsiz Teklif Al'}
        </button>
      </div>
      {/* WhatsApp Floating Button */}
      {phone && (
        <a
          href={`https://wa.me/90${phone.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 right-4 z-50 bg-green-500 hover:bg-green-400 text-white p-4 rounded-full shadow-xl transition-all hover:scale-110"
          title="WhatsApp ile ulaşın"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      )}

      <div className="h-16" />
    </div>
  )
}
