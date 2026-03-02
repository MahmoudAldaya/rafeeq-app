import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json(
                { error: "الرجاء إضافة مفتاح SUPABASE_SERVICE_ROLE_KEY في ملف .env.local للتمكن من إضافة مدراء جدد." },
                { status: 500 }
            );
        }

        // Initialize Supabase Admin client using Service Role Key to bypass RLS and create auth users
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );

        // 1. Verify caller is authenticated and is a superadmin
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        );

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
            return NextResponse.json({ error: "غير مصرح لك بالقيام بهذه العملية" }, { status: 401 });
        }

        // Check if caller is superadmin in admin_profiles
        const { data: callerProfile, error: callerError } = await supabaseAdmin
            .from("admin_profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

        if (callerError || !callerProfile || callerProfile.role !== "superadmin") {
            return NextResponse.json({ error: "فقط مدير النظام (Superadmin) يمكنه إضافة إداريين جدد" }, { status: 403 });
        }

        // 2. Extract payload
        const body = await req.json();
        const { email, role } = body;

        if (!email || !role) {
            return NextResponse.json({ error: "البريد الإلكتروني والدور الوظيفي مطلوبون" }, { status: 400 });
        }

        // 3. Find the user via Admin API
        const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();

        if (listError) {
            return NextResponse.json({ error: "فشل في البحث عن المستخدمين" }, { status: 500 });
        }

        const existingUser = usersData.users.find(u => u.email === email);

        if (!existingUser) {
            return NextResponse.json({ error: "لا يوجد حساب مسجل بهذا البريد الإلكتروني. يجب على الإداري إنشاء حساب عادي أولاً." }, { status: 404 });
        }

        const userId = existingUser.id;

        // 4. Determine permissions array based on role
        const permissionsMap: Record<string, string[]> = {
            superadmin: ["all"],
            content_manager: ["dashboard", "manage_scholarships", "manage_services"],
            finance_manager: ["dashboard", "manage_finance"],
            support_agent: ["dashboard"],
        };

        const permissions = permissionsMap[role] || ["dashboard"];

        // 5. Check if they are already an admin
        const { data: existingAdmin } = await supabaseAdmin
            .from("admin_profiles")
            .select("id")
            .eq("id", userId)
            .single();

        if (existingAdmin) {
            return NextResponse.json({ error: "هذا المستخدم هو إداري بالفعل" }, { status: 400 });
        }

        // 6. Insert into admin_profiles
        const { error: profileError } = await supabaseAdmin
            .from("admin_profiles")
            .insert({
                id: userId,
                email,
                role,
                permissions,
            });

        if (profileError) {
            return NextResponse.json({ error: "فشل تعيين الصلاحيات للمستخدم: " + profileError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "تمت ترقية المستخدم إلى إداري بنجاح" });

    } catch (err: any) {
        console.error("Admin creation error:", err);
        return NextResponse.json({ error: "حدث خطأ داخلي في الخادم" }, { status: 500 });
    }
}
