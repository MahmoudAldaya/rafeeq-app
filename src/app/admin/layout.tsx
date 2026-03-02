"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import BrandIcon from "@/components/BrandIcon";
import { useAdmin, hasPermission } from "@/hooks/useAdmin";
import {
    LayoutDashboard,
    Package,
    CreditCard,
    LogOut,
    Menu,
    X,
    Shield,
    Receipt,
    Users,
} from "lucide-react";

const navItems = [
    { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard, exact: true, permission: "dashboard" },
    { href: "/admin/scholarships", label: "المنح الدراسية", icon: BrandIcon, permission: "manage_scholarships" },
    { href: "/admin/services", label: "الخدمات", icon: Package, permission: "manage_services" },
    { href: "/admin/payments", label: "طرق الدفع", icon: CreditCard, permission: "manage_finance" },
    { href: "/admin/receipts", label: "إشعارات الدفع", icon: Receipt, permission: "manage_finance" },
    { href: "/admin/users", label: "فريق الإدارة", icon: Users, permission: "manage_admins" },
];

const roleLabels = {
    superadmin: "مدير النظام",
    content_manager: "مدير المحتوى",
    finance_manager: "مدير المالية",
    support_agent: "فريق الدعم",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { admin, loading } = useAdmin();

    const handleLogout = async () => {
        const supabase = getSupabase();
        await supabase.auth.signOut();
        router.replace("/admin/login");
    };

    // Show login page without layout
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (loading || !admin) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4d94cf] to-[#6aabdb] animate-pulse" />
                    <p className="text-foreground text-sm">جارٍ التحقق من الصلاحيات...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex" dir="rtl">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 right-0 bottom-0 w-64 bg-white border-l border-[rgba(24,28,32,0.1)] shadow-xl z-30 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:shadow-none ${sidebarOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-[rgba(24,28,32,0.1)]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4d94cf] to-[#6aabdb] flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-foreground text-sm">{roleLabels[admin.role] || "إداري"}</p>
                            <p className="text-foreground text-xs truncate max-w-[140px]" title={admin.email}>{admin.email}</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        // Skip rendering this nav item if user doesn't have permission
                        if (!hasPermission(admin, item.permission)) return null;

                        const active = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href) && item.href !== "/admin";
                        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-[#5A5248] hover:bg-background hover:text-foreground"
                                    }`}
                            >
                                <item.icon className="w-4 h-4 flex-shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-[rgba(24,28,32,0.1)]">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full"
                    >
                        <LogOut className="w-4 h-4" />
                        تسجيل الخروج
                    </button>
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs text-foreground hover:text-foreground transition-colors mt-1"
                    >
                        ← العودة للموقع
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile topbar */}
                <header className="lg:hidden flex items-center justify-between bg-white border-b border-[rgba(24,28,32,0.1)] px-4 py-3 sticky top-0 z-10">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-xl hover:bg-background transition-colors"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    <span className="font-bold text-foreground text-sm">لوحة الإدارة — رفيق</span>
                    <div className="w-9" />
                </header>

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
