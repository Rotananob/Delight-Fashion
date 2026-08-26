import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userAgent, referrer, pathname } = await request.json();

    // 1. Get the IP Address
    // Next.js exposes IP via headers in production (Vercel uses x-real-ip or x-forwarded-for)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = realIp || (forwardedFor ? forwardedFor.split(',')[0] : 'Unknown IP');

    // 2. Fetch Location Data from Free GeoIP API (ip-api.com)
    let locationData = { city: "Unknown", country: "Unknown", lat: "", lon: "", isp: "" };
    if (ip !== 'Unknown IP' && ip !== '::1' && ip !== '127.0.0.1') {
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
        if (geoResponse.ok) {
          const geo = await geoResponse.json();
          if (geo.status === 'success') {
            locationData = {
              city: geo.city,
              country: geo.country,
              lat: geo.lat,
              lon: geo.lon,
              isp: geo.isp
            };
          }
        }
      } catch (e) {
        console.error("GeoIP Fetch Failed:", e);
      }
    } else {
      locationData.city = "Localhost";
    }

    // 3. Format the Telegram Message
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_SHOP_OWNER_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json({ error: "Telegram credentials missing" }, { status: 500 });
    }

    const mapLink = locationData.lat ? `https://www.google.com/maps?q=${locationData.lat},${locationData.lon}` : "N/A";
    
    const message = `
🚨 <b>New Visitor Alert!</b> 🚨

📍 <b>Location:</b> ${locationData.city}, ${locationData.country}
🌐 <b>IP Address:</b> ${ip}
🏢 <b>ISP:</b> ${locationData.isp || 'N/A'}
🗺 <b>Map:</b> ${mapLink !== "N/A" ? `<a href="${mapLink}">View on Google Maps</a>` : "N/A"}

📱 <b>Device/Browser:</b>
<code>${userAgent || 'Unknown'}</code>

🔗 <b>Visited Page:</b> ${pathname}
🔙 <b>From (Referrer):</b> ${referrer || 'Direct / None'}
    `.trim();

    // 4. Send to Telegram
    const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const tgResponse = await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    if (!tgResponse.ok) {
      const err = await tgResponse.text();
      console.error("Telegram API Error:", err);
      return NextResponse.json({ error: "Failed to send telegram message" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Visitor Tracking Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
