/**
 * SiteBoost Deploy Testi
 * Kullanım: node scripts/test-deploy.js [url]
 * Örnek: node scripts/test-deploy.js https://siteboost-chi.vercel.app
 */

const BASE_URL = process.argv[2] || 'http://localhost:4000'
const results = []

async function check(name, fn) {
  process.stdout.write(`  ${name}... `)
  try {
    const result = await fn()
    console.log(`✅ ${result || 'OK'}`)
    results.push({ name, ok: true })
  } catch (e) {
    console.log(`❌ ${e.message}`)
    results.push({ name, ok: false, error: e.message })
  }
}

async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res
}

async function run() {
  console.log(`\n🔍 SiteBoost Deploy Testi`)
  console.log(`📍 URL: ${BASE_URL}\n`)

  // 1. Sayfa erişimi
  console.log('📄 Sayfalar:')
  await check('Ana sayfa (/)', async () => { await get('/'); return '200' })
  await check('Dashboard (/dashboard)', async () => { await get('/dashboard'); return '200' })
  await check('Tarama (/scan)', async () => { await get('/scan'); return '200' })
  await check('Pipeline (/dashboard/pipeline)', async () => { await get('/dashboard/pipeline'); return '200' })

  // 2. API endpoint'leri
  console.log('\n🔌 API:')
  await check('Health check (/api/health)', async () => {
    const res = await fetch(`${BASE_URL}/api/health`)
    // 404 normal, 500 değil
    if (res.status === 500) throw new Error(`HTTP 500`)
    return `HTTP ${res.status}`
  })

  await check('PDF endpoint erişilebilir', async () => {
    const res = await fetch(`${BASE_URL}/api/reports/pdf/test-id`)
    if (res.status === 500) throw new Error('HTTP 500 — sunucu hatası')
    return `HTTP ${res.status} (beklenen)`
  })

  await check('Demo endpoint erişilebilir', async () => {
    const res = await fetch(`${BASE_URL}/api/demo/test-token`)
    if (res.status === 500) throw new Error('HTTP 500 — sunucu hatası')
    return `HTTP ${res.status} (beklenen)`
  })

  // 3. Environment variable kontrolü (hata mesajlarından anlıyoruz)
  console.log('\n⚙️  Konfigürasyon:')
  await check('Scan API yanıt veriyor', async () => {
    const res = await fetch(`${BASE_URL}/api/scan/manual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://example.com' })
    })
    const data = await res.json()
    if (data.error?.includes('SUPABASE') || data.error?.includes('API key')) {
      throw new Error(`Env eksik: ${data.error}`)
    }
    return `Yanıt: ${res.status}`
  })

  // Özet
  const passed = results.filter(r => r.ok).length
  const failed = results.filter(r => !r.ok).length
  console.log(`\n${'─'.repeat(40)}`)
  console.log(`✅ Geçti: ${passed}  ❌ Başarısız: ${failed}  📊 Toplam: ${results.length}`)

  if (failed > 0) {
    console.log('\n❌ Başarısız testler:')
    results.filter(r => !r.ok).forEach(r => console.log(`  • ${r.name}: ${r.error}`))
    process.exit(1)
  } else {
    console.log('\n🎉 Tüm testler geçti!\n')
  }
}

run().catch(e => { console.error(e); process.exit(1) })
