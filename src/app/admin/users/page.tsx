"use client";

import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { useAdmin, hasPermission, AdminProfile } from "@/hooks/useAdmin";
import { Users, Shield, ShieldAlert, Plus, Mail, Trash2, CheckCircle2, X } from "lucide-react";

const roleLabels = {
    superadmin: "مدير النظام (كامل الصلاحيات)",
    content_manager: "مدير المحتوى (الخدمات والمنح)",
    finance_manager: "مدير المالية (الحسابات والدفع)",
    support_agent: "فريق الدعم (عرض فقط)",
};

const rolePermissions = {
    superadmin: ["all"],
    content_manager: ["dashboard", "manage_scholarships", "manage_services"],
    finance_manager: ["dashboard", "manage_finance"],
    support_agent: ["dashboard"],
};

export default function AdminUsersPage() {
    const { admin, loading: adminLoading } = useAdmin();
    const [users, setUsers] = useState<AdminProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form state
    const [isAdding, setIsAdding] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRole, setNewRole] = useState<keyof typeof roleLabels>("support_agent");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!adminLoading && admin) {
            if (!hasPermission(admin, "manage_admins") && admin.role !== "superadmin") {
                setError("عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة.");
                setLoading(false);
                return;
            }
            fetchUsers();
        }
    }, [admin, adminLoading]);

    const fetchUsers = async () => {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from("admin_profiles")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setUsers(data as AdminProfile[]);
        } catch (err: any) {
            setError(err.message || "حدث خطأ أثناء جلب المستخدمين");
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!newEmail) {
            setError("يرجى إدخال البريد الإلكتروني");
            return;
        }

        setIsSubmitting(true);
        try {
            // Call the secure backend API to create the user
            const response = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: newEmail,
                    role: newRole,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "فشل ترقية الحساب");
            }

            setSuccess("تم ترقية المستخدم إلى إداري بنجاح.");
            setIsAdding(false);
            setNewEmail("");
            fetchUsers();

        } catch (err: any) {
            setError(err.message || "فشلت العملية");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, email: string) => {
        if (id === admin?.id) {
            alert("لا يمكنك حذف حسابك الخاص!");
            return;
        }
        if (!confirm(`هل أنت متأكد من حذف الإداري (${email})؟ لا يمكن التراجع عن هذا الإجراء.`)) return;

        setError("");
        setSuccess("");
        try {
            const supabase = getSupabase();
            const { error } = await supabase
                .from("admin_profiles")
                .delete()
                .eq("id", id);

            if (error) throw error;
            setSuccess("تم حذف المستخدم بنجاح");
            fetchUsers();
        } catch (err: any) {
            setError(err.message || "فشل الحذف");
        }
    };

    if (adminLoading || loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error && !users.length) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <h2 className="text-lg font-bold text-red-700 mb-2">وصول مرفوض</h2>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">فريق الإدارة</h1>
                    <p className="text-foreground text-sm mt-1">إدارة الصلاحيات وحسابات المشرفين على المنصة.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-primary"
                >
                    {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {isAdding ? "إلغاء" : "إضافة إداري"}
                </button>
            </div>

            {error && !isAdding && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm border border-green-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {success}
                </div>
            )}

            {isAdding && (
                <div className="bg-white rounded-2xl border border-[rgba(24,28,32,0.1)] p-6 shadow-sm">
                    <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        إضافة إداري جديد
                    </h2>
                    <form onSubmit={handleAddAdmin} className="space-y-4 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                                <input
                                    type="email"
                                    dir="ltr"
                                    className="input text-left pl-10"
                                    placeholder="admin@rafeeq.ps"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                />
                            </div>
                            <p className="text-xs text-foreground/60 mt-2">يجب أن يمتلك الإداري حساباً عادياً بهذا البريد أولاً.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">الدور الوظيفي</label>
                            <select
                                className="input py-2.5"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value as any)}
                            >
                                {Object.entries(roleLabels).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                            <p className="text-xs text-foreground/60 mt-2">
                                المسميات تحدد الصفحات التي يمكن لهذا المستخدم رؤيتها وإدارتها.
                            </p>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary w-full justify-center"
                            >
                                {isSubmitting ? "جاري الإضافة..." : "حفظ الصلاحيات"}
                            </button>
                        </div>

                        {error && isAdding && (
                            <p className="text-amber-600 bg-amber-50 p-3 rounded-lg text-sm border border-amber-200 mt-4 leading-relaxed">
                                {error}
                            </p>
                        )}
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-[rgba(24,28,32,0.1)] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-[#f8f8fa] text-foreground border-b border-[rgba(24,28,32,0.1)]">
                            <tr>
                                <th className="px-6 py-4 font-semibold w-12"></th>
                                <th className="px-6 py-4 font-semibold">المستخدم</th>
                                <th className="px-6 py-4 font-semibold">الدور والصلاحيات</th>
                                <th className="px-6 py-4 font-semibold text-left">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[rgba(24,28,32,0.1)]">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-[#f8f8fa]/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${user.role === 'superadmin' ? 'bg-purple-500' :
                                            user.role === 'content_manager' ? 'bg-blue-500' :
                                                user.role === 'finance_manager' ? 'bg-green-500' :
                                                    'bg-slate-400'
                                            }`}>
                                            {user.email.charAt(0).toUpperCase()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-foreground" dir="ltr">{user.email}</div>
                                        {user.id === admin?.id && (
                                            <span className="inline-block mt-1 text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">أنت</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.role === 'superadmin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                            user.role === 'content_manager' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                user.role === 'finance_manager' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    'bg-slate-50 text-slate-700 border-slate-200'
                                            }`}>
                                            {user.role === 'superadmin' && <Shield className="w-3 h-3" />}
                                            {roleLabels[user.role]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-left">
                                        <button
                                            onClick={() => handleDelete(user.id, user.email)}
                                            disabled={user.id === admin?.id}
                                            className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground/40"
                                            title="إزالة الصلاحيات"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <div className="p-8 text-center text-foreground font-medium">
                            لا يوجد مدراء آخرين.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
