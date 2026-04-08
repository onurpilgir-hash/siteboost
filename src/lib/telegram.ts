// Telegram bot bildirimleri

export async function sendTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || token === 'buraya_telegram_bot_token_yaz') return
  if (!chatId || chatId === 'buraya_telegram_chat_id_yaz') return

  if (process.env.MOCK_MODE === 'true') {
    console.log('\n📱 [MOCK] Telegram:', message, '\n')
    return
  }

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
  })
}

// Hazır bildirim şablonları
export const notify = {
  analysisComplete: (name: string, score: number) =>
    `📊 <b>Analiz Tamamlandı</b>\n${name}\nPuan: ${score.toFixed(1)}/10`,

  emailSent: (name: string) =>
    `📧 <b>Mail Gönderildi</b>\n${name}`,

  emailOpened: (name: string) =>
    `⚡ <b>Mail Açıldı!</b>\n${name}\nSıcak lead — takip et`,

  priceRequested: (name: string) =>
    `🔥 <b>FİYAT İSTEDİ!</b>\n${name}\nHemen yanıt ver`,

  paymentReceived: (name: string, amount: string) =>
    `✅ <b>Ödeme Alındı!</b>\n${name}\nTutar: ${amount}`,

  siteDown: (name: string, url: string) =>
    `🚨 <b>SİTE ÇÖKTÜ!</b>\n${name}\n${url}`,
}
