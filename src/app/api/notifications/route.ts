import { NextResponse } from 'next/server';
import { dispatchAdminNotification, NotificationPayload } from '@/lib/notifications';

export async function POST(request: Request) {
    try {
        const body: NotificationPayload = await request.json();

        // Ensure the type is valid
        if (!['service_request', 'new_user', 'system'].includes(body.type)) {
            return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
        }

        // Dispatch the notification securely using the admin service key
        await dispatchAdminNotification(body);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Notification API Error:", error);
        // Do not expose internal error details to the client
        return NextResponse.json({ error: 'Failed to dispatch notification' }, { status: 500 });
    }
}
