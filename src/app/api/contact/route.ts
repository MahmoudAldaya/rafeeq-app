import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const resendApiKey = process.env.RESEND_API_KEY;
        const adminEmail = process.env.ADMIN_EMAIL;

        if (!resendApiKey || !adminEmail) {
            console.error("Missing Resend credentials in environment");
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const subjectTranslation: Record<string, string> = {
            'scholarship': 'استفسار عن منحة',
            'service': 'طلب خدمة',
            'payment': 'استفسار عن الدفع',
            'technical': 'مشكلة تقنية',
            'other': 'أخرى'
        };

        const translatedSubject = subjectTranslation[subject] || subject;

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Rafeeq Contact <onboarding@resend.dev>', // Keep the Resend verified email
                to: adminEmail,
                reply_to: email, // Set reply-to so the admin can easily reply directly to the user
                subject: `رسالة جديدة من تواصل معنا: ${translatedSubject}`,
                html: `
                    <div dir="rtl" style="font-family: sans-serif; text-align: right; color: #1a1c20;">
                        <h2 style="color: #4d94cf;">رسالة جديدة من صفحة اتصل بنا</h2>
                        <div style="background-color: #f8f8fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
                            <p><strong>الاسم:</strong> ${name}</p>
                            <p><strong>البريد الإلكتروني:</strong> <a href="mailto:${email}">${email}</a></p>
                            <p><strong>الموضوع:</strong> ${translatedSubject}</p>
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
                            <p style="white-space: pre-wrap;">${message}</p>
                        </div>
                    </div>
                `
            })
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Resend API failed:", errorText);
            throw new Error('Failed to send email');
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("Contact API Error:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
