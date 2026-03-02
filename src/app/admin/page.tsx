"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import BrandIcon from "@/components/BrandIcon";
import { Package, CreditCard, Clock } from "lucide-react";

interface Stats {
    scholarships: number;
    services: number;
    paymentAccounts: number;
    pendingVerifications: number;
}

export default function AdminOverviewPage() {
    const supabase = getSupabase();
    const [stats, setStats] = useState<Stats>({ scholarships: 0, services: 0, paymentAccounts: 0, pendingVerifications: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const [s, svc, pa, pv] = await Promise.all([
                supabase.from("scholarships").select("id", { count: "exact", head: true }),
                supabase.from("services").select("id", { count: "exact", head: true }),
                supabase.from("payment_accounts").select("id", { count: "exact", head: true }),
                supabase.from("payment_verifications").select("id", { count: "exact", head: true }).eq("status", "pending"),
            ]);
            setStats({
                scholarships: s.count ?? 0,
                services: svc.count ?? 0,
                paymentAccounts: pa.count ?? 0,
                pendingVerifications: pv.count ?? 0,
            });
            setLoading(false);
        };
        fetchStats();
    }, []);

    const cards = [
        { label: "المنح الدراسية", value: stats.scholarships, icon: BrandIcon, color: "text-primary bg-primary/10", href: "/admin/scholarships" },
        { label: "الباقات المتاحة", value: stats.services, icon: Package, color: "text-[#af8d84] bg-[#af8d84]/10", href: "/admin/services" },
        { label: "حسابات الدفع", value: stats.paymentAccounts, icon: CreditCard, color: "text-purple-600 bg-purple-100", href: "/admin/payments" },
        { label: "تحقق معلق", value: stats.pendingVerifications, icon: Clock, color: "text-amber-600 bg-amber-100", href: "/admin/payments" },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">نظرة عامة</h1>
                <p className="text-foreground text-sm mt-1">إحصائيات المنصة بشكل لحظي</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {cards.map((card) => (
                        <a key={card.label} href={card.href} className="bg-white rounded-2xl border border-[rgba(24,28,32,0.1)] p-5 shadow-sm hover:shadow-md transition-all group">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.color} transition-all group-hover:scale-110`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                            <p className="text-3xl font-bold text-foreground mb-1">{card.value}</p>
                            <p className="text-sm text-foreground">{card.label}</p>
                        </a>
                    ))}
                </div>
            )}

            {/* Quick links */}
            <div className="mt-8 bg-white rounded-2xl border border-[rgba(24,28,32,0.1)] p-6 shadow-sm">
                <h2 className="font-bold text-foreground mb-4">وصول سريع</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        { href: "/admin/scholarships", label: "إضافة منحة جديدة", icon: BrandIcon },
                        { href: "/admin/services", label: "إدارة الباقات", icon: Package },
                        { href: "/admin/payments", label: "مراجعة التحقق المعلق", icon: Clock },
                    ].map((link) => (
                        <a key={link.href} href={link.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background hover:bg-[#EDE8DE] transition-colors text-sm font-medium text-foreground">
                            <link.icon className="w-4 h-4 text-primary" />
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
