import { loadEnvConfig } from '@next/env';
import fetch from 'node-fetch';

// Load Next.js environment variables natively
loadEnvConfig(process.cwd());

const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;
const resendApiKey = process.env.RESEND_API_KEY;
const adminEmail = process.env.ADMIN_EMAIL;

console.log("=== Environment Check ===");
console.log("Telegram Token:", telegramToken ? "Found ✅" : "Missing ❌");
console.log("Telegram Chat ID:", telegramChatId ? "Found ✅" : "Missing ❌");
console.log("Resend API Key:", resendApiKey ? "Found ✅" : "Missing ❌");
console.log("Admin Email:", adminEmail ? "Found ✅" : "Missing ❌");
console.log("========================");

async function testPush() {
    if (telegramToken && telegramChatId) {
        console.log("Attempting Telegram Push...");
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
            const data = await res.json();
            console.log("Telegram Response:", data);
        } catch (e) {
            console.error("Telegram Error:", e);
        }
    }

    if (resendApiKey && adminEmail) {
        console.log("\nAttempting Resend Email Push...");
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
            const data = await res.json();
            console.log("Resend Response:", data);
        } catch (e) {
            console.error("Resend Error:", e);
        }
    }
}

testPush();
