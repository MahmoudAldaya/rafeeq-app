"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useAdmin } from "@/hooks/useAdmin";
import { Bell, Check, Loader2, Info, UserPlus, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface AppNotification {
    id: string;
    created_at: string;
    title: string;
    message: string;
    type: 'service_request' | 'new_user' | 'system';
    is_read: boolean;
    link?: string;
}

export default function NotificationsPage() {
    const { admin } = useAdmin();
    const router = useRouter();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!admin) return;

        const fetchNotifications = async () => {
            const supabase = getSupabase();
            const { data } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setNotifications(data);
            setLoading(false);
        };

        fetchNotifications();
    }, [admin]);

    const markAsRead = async (id: string) => {
        const supabase = getSupabase();

        // Optimistic UI update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));

        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    };

    const markAllAsRead = async () => {
        const supabase = getSupabase();
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length === 0) return;

        // Optimistic UI update
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
    };

    const handleNotificationClick = async (n: AppNotification) => {
        if (!n.is_read) {
            await markAsRead(n.id);
        }
        if (n.link) {
            router.push(n.link);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">الإشعارات</h1>
                    <p className="text-muted text-sm mt-1">تابع أحدث الطلبات والأنشطة على المنصة</p>
                </div>

                {notifications.some(n => !n.is_read) && (
                    <button
                        onClick={markAllAsRead}
                        className="btn-secondary text-xs py-2 px-4"
                    >
                        <Check className="w-4 h-4" />
                        تحديد الكل كمقروء
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[rgba(24,28,32,0.1)] p-12 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-foreground font-bold text-lg mb-1">لا توجد إشعارات</h3>
                    <p className="text-muted text-sm">كل شيء هادئ هنا حالياً.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((n) => {
                        const Icon = n.type === 'service_request' ? FileText : n.type === 'new_user' ? UserPlus : Info;
                        const bgColor = n.type === 'service_request' ? 'bg-[#4d94cf]/10 text-primary' : 'bg-gray-100 text-gray-600';

                        return (
                            <div
                                key={n.id}
                                onClick={() => handleNotificationClick(n)}
                                className={`flex items-start gap-4 p-4 lg:p-5 rounded-2xl border transition-all cursor-pointer ${n.is_read
                                        ? 'bg-white border-[rgba(24,28,32,0.1)] hover:border-primary/30'
                                        : 'bg-[#4d94cf]/5 border-[#4d94cf]/30 hover:border-[#4d94cf]/60 shadow-sm'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${bgColor}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-1">
                                        <h4 className={`text-sm md:text-base font-bold truncate ${n.is_read ? 'text-foreground' : 'text-primary'}`}>
                                            {n.title}
                                        </h4>
                                        <span className="text-xs text-muted whitespace-nowrap" dir="ltr">
                                            {new Date(n.created_at).toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className={`text-sm ${n.is_read ? 'text-muted' : 'text-foreground font-medium'}`}>
                                        {n.message}
                                    </p>
                                </div>
                                {!n.is_read && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 flex-shrink-0 shadow-sm animate-pulse" />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
