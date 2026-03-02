import { createAdminSupabaseClient } from "./supabaseServer";

export interface NotificationPayload {
    title: string;
    message: string;
    type: 'service_request' | 'new_user' | 'system';
    link?: string;
    order_id?: string;
}

export async function dispatchAdminNotification(payload: NotificationPayload) {
    const supabase = await createAdminSupabaseClient();

    // 1. In-App Notification (Database Insert)
    try {
        const { error } = await supabase
            .from('notifications')
            .insert({
                title: payload.title,
                message: payload.message,
                type: payload.type,
                link: payload.link,
                order_id: payload.order_id
            });

        if (error) {
            console.error("Failed to insert notification into DB:", error);
        }
    } catch (err) {
        console.error("Error inserting notification:", err);
    }

    // --- PHASE 2: TELEGRAM INTEGRATION ---
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramToken && telegramChatId) {
        try {
            console.log(`[Telegram] Dispatching to Chat ID: ${telegramChatId}`);
            let text = `🔔 *${payload.title}*\n\n${payload.message}`;
            if (payload.order_id) text += `\n\n\`ID: ${payload.order_id}\``;

            const res = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: telegramChatId,
                    text: text,
                    parse_mode: 'Markdown'
                })
            });
            const data = await res.json();
            console.log(`[Telegram] Response:`, data);
        } catch (err) {
            console.error("[Telegram] Fatal Notification Error:", err);
        }
    } else {
        console.warn("[Telegram] Skipped: Missing Credentials");
    }

    // --- PHASE 3: EMAIL INTEGRATION ---
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (resendApiKey && adminEmail) {
        try {
            console.log(`[Resend] Dispatching email to: ${adminEmail}`);
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'Rafeeq Notifications <onboarding@resend.dev>',
                    to: adminEmail,
                    subject: `🔔 ${payload.title}`,
                    html: `
                        <div dir="rtl" style="font-family: sans-serif; text-align: right; color: #1a1c20;">
                            <h2 style="color: #4d94cf;">${payload.title}</h2>
                            <p style="font-size: 16px; line-height: 1.5;">${payload.message}</p>
                            ${payload.order_id ? `<p><strong>رقم الطلب:</strong> ${payload.order_id}</p>` : ''}
                            ${payload.link ? `<br/><a href="https://rafeeq.vercel.app${payload.link}" style="background-color: #4d94cf; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block;">عرض في لوحة التحكم</a>` : ''}
                        </div>
                    `
                })
            });
            const data = await res.json();
            console.log(`[Resend] Response:`, data);
        } catch (err) {
            console.error("[Resend] Fatal Notification Error:", err);
        }
    } else {
        console.warn("[Resend] Skipped: Missing Credentials");
    }
}
