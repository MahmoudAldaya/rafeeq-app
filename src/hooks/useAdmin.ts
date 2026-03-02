"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export interface AdminProfile {
    id: string;
    email: string;
    role: "superadmin" | "content_manager" | "finance_manager" | "support_agent";
    permissions: string[];
}

export function useAdmin() {
    const router = useRouter();
    const pathname = usePathname();
    const [admin, setAdmin] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            const supabase = getSupabase();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                if (pathname !== "/admin/login") {
                    router.replace("/admin/login");
                }
                setLoading(false);
                return;
            }

            // Check if user is in admin_profiles
            const { data, error } = await supabase
                .from("admin_profiles")
                .select("*")
                .eq("id", session.user.id)
                .single();

            if (error || !data) {
                console.error("Admin Auth Error:", error, "Session ID:", session.user.id);
                alert(`خطأ في صلاحيات الدخول \nرسالة الخطأ: ${error?.message || 'لا يوجد ملف شخصي لهذا الحساب'}\nمعرف المستخدم: ${session.user.id}`);

                // User is authenticated but not an admin -> kick them out
                await supabase.auth.signOut();
                if (pathname !== "/admin/login") {
                    router.replace("/admin/login?error=unauthorized");
                }
            } else {
                setAdmin(data as AdminProfile);
            }
            setLoading(false);
        };

        checkAdmin();

        const { data: { subscription } } = getSupabase().auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT") {
                setAdmin(null);
                router.replace("/admin/login");
            } else if (session) {
                checkAdmin();
            }
        });

        return () => subscription.unsubscribe();
    }, [pathname, router]);

    return { admin, loading };
}

// Utility to check permissions
export function hasPermission(admin: AdminProfile | null, requiredPermission: string): boolean {
    if (!admin) return false;
    if (admin.role === "superadmin") return true;
    if (admin.permissions.includes("all")) return true;
    return admin.permissions.includes(requiredPermission);
}
