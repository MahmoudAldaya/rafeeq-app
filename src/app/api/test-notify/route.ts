import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const logPath = path.join(process.cwd(), 'notify_debug.json');
        const results: any = { time: new Date().toISOString(), env: {}, fetch: {} };

        // --- PHASE 2: TELEGRAM INTEGRATION ---
        const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = process.env.TELEGRAM_CHAT_ID;
        results.env.telegram = !!(telegramToken && telegramChatId);

        if (telegramToken && telegramChatId) {
            try {
                const res = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: telegramChatId,
                        text: '🛠️ *Test Alert*\n\nThis is a manual debugging test from the server.',
                        parse_mode: 'Markdown'
                    })
                });
                results.fetch.telegram = await res.json();
            } catch (err: any) {
                results.fetch.telegramError = err.toString();
            }
        }

        // --- PHASE 3: EMAIL INTEGRATION ---
        const resendApiKey = process.env.RESEND_API_KEY;
        const adminEmail = process.env.ADMIN_EMAIL;
        results.env.resend = !!(resendApiKey && adminEmail);

        if (resendApiKey && adminEmail) {
            try {
                const res = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${resendApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'Rafeeq Notifications <onboarding@resend.dev>',
                        to: adminEmail,
                        subject: `🛠️ Test Alert`,
                        html: `<p>This is a manual debugging test from the server.</p>`
                    })
                });
                results.fetch.resend = await res.json();
            } catch (err: any) {
                results.fetch.resendError = err.toString();
            }
        }

        fs.writeFileSync(logPath, JSON.stringify(results, null, 2));

        return NextResponse.json(results);
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.toString() });
    }
}
