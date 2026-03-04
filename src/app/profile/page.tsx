"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import BrandIcon from "@/components/BrandIcon";
import { Search, LogOut, ArrowLeft, Edit2, Save, X, Lock, Camera, Loader2 } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        const supabase = getSupabase();
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.replace("/auth/login");
                return;
            }
            setUser(session.user);
            setFullName(session.user.user_metadata?.full_name || "");
            setAvatarUrl(session.user.user_metadata?.avatar_url || "");
            setLoading(false);
        });
    }, [router]);

    const handleLogout = async () => {
        const supabase = getSupabase();
        await supabase.auth.signOut();
        router.push("/");
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Validate file type and size
        if (!file.type.startsWith("image/")) {
            setMessage({ text: "يرجى اختيار ملف صورة صالح (PNG, JPG, etc.)", type: "error" });
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setMessage({ text: "حجم الصورة كبير جداً. الحد الأقصى هو 5 ميغابايت.", type: "error" });
            return;
        }

        setIsUploadingAvatar(true);
        setMessage({ text: "", type: "" });

        try {
            const supabase = getSupabase();
            const fileExt = file.name.split(".").pop();
            const filePath = `${user.id}/avatar.${fileExt}`;

            // Upload to Supabase Storage (bucket: avatars)
            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            // Add cache-busting param to force reload of image
            const urlWithCache = `${publicUrl}?t=${Date.now()}`;

            // Save URL to user metadata
            const { error: updateError, data } = await supabase.auth.updateUser({
                data: { avatar_url: urlWithCache }
            });

            if (updateError) throw updateError;

            setAvatarUrl(urlWithCache);
            setUser(data.user);
            setMessage({ text: "تم تحديث الصورة الشخصية بنجاح!", type: "success" });
        } catch (err: any) {
            console.error("Avatar upload error:", err);
            setMessage({ text: err.message || "فشل رفع الصورة. تأكد من إنشاء bucket باسم 'avatars' في Supabase Storage.", type: "error" });
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ text: "", type: "" });

        try {
            const supabase = getSupabase();
            const updates: any = {
                data: { full_name: fullName }
            };

            if (newPassword.trim().length >= 6) {
                updates.password = newPassword.trim();
            } else if (newPassword.trim().length > 0 && newPassword.trim().length < 6) {
                throw new Error("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.");
            }

            const { error, data } = await supabase.auth.updateUser(updates);

            if (error) {
                if (error.message.includes("New password should be different")) {
                    throw new Error("كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية.");
                } else if (error.message.includes("Password should be")) {
                    throw new Error("كلمة المرور ضعيفة، يرجى اختيار كلمة مرور أقوى.");
                } else {
                    throw error;
                }
            }

            setUser(data.user);
            setMessage({ text: "تم تحديث الملف الشخصي بنجاح", type: "success" });
            setIsEditing(false);
            setNewPassword(""); // clear password field
        } catch (err: any) {
            setMessage({ text: err.message || "فشل التحديث، يرجى المحاولة مرة أخرى.", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "مستخدم";

    return (
        <div className="min-h-screen bg-background pt-24 pb-16 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-foreground">الملف الشخصي</h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn-secondary text-sm p-2 flex items-center gap-2"
                        >
                            <Edit2 className="w-4 h-4" />
                            تعديل البيانات
                        </button>
                    )}
                </div>

                {message.text && (
                    <div className={`p-4 rounded-xl mb-6 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message.text}
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white rounded-3xl border border-[rgba(24,28,32,0.1)] p-8 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0 group/avatar">
                            <div
                                className="w-24 h-24 rounded-3xl overflow-hidden cursor-pointer shadow-lg"
                                onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
                                title="انقر لتغيير الصورة الشخصية"
                            >
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt="صورة الملف الشخصي"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#4d94cf] to-[#6aabdb] flex items-center justify-center">
                                        <span className="text-3xl font-bold text-white uppercase">{displayName.charAt(0)}</span>
                                    </div>
                                )}
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 rounded-3xl bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                                    {isUploadingAvatar
                                        ? <Loader2 className="w-7 h-7 text-white animate-spin" />
                                        : <Camera className="w-7 h-7 text-white" />
                                    }
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                            {/* Camera badge */}
                            <button
                                onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
                                disabled={isUploadingAvatar}
                                className="absolute -bottom-2 -left-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md border-2 border-white hover:bg-primary/90 transition-colors"
                                title="تغيير الصورة"
                            >
                                {isUploadingAvatar
                                    ? <Loader2 className="w-4 h-4 text-white animate-spin" />
                                    : <Camera className="w-4 h-4 text-white" />
                                }
                            </button>
                        </div>

                        {/* Info / Edit Form */}
                        <div className="flex-1 w-full">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">الاسم الكامل</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="input"
                                            placeholder="أدخل اسمك الكامل"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-muted" />
                                            كلمة المرور الجديدة (اختياري)
                                        </label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="input"
                                            placeholder="اتركه فارغاً إذا لم ترغب بتغييره"
                                            dir="ltr"
                                        />
                                        <p className="text-xs text-muted mt-1">يجب أن تتكون من 6 أحرف على الأقل.</p>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="btn-primary flex-1 justify-center"
                                        >
                                            {isSaving ? "جاري الحفظ..." : <><Save className="w-4 h-4" /> حفظ التعديلات</>}
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="btn-secondary justify-center"
                                        >
                                            <X className="w-4 h-4" />
                                            إلغاء
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-muted text-sm mb-1">الاسم الكامل</p>
                                        <p className="text-lg font-bold text-foreground">{displayName}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted text-sm mb-1">البريد الإلكتروني</p>
                                        <p className="text-foreground" dir="ltr">{user?.email}</p>
                                    </div>
                                    <p className="text-xs text-muted">انقر على الصورة الشخصية لتغييرها.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <Link href="/scholarships" className="bg-white rounded-2xl border border-[rgba(24,28,32,0.1)] p-6 shadow-sm hover:shadow-md transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                            <Search className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-foreground mb-1">استعرض المنح</h3>
                        <p className="text-sm text-foreground">ابحث عن المنح المناسبة لك</p>
                        <div className="flex items-center gap-1 mt-4 text-primary text-sm font-medium">
                            <span>ابدأ البحث</span>
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                    </Link>
                    <Link href="/services" className="bg-white rounded-2xl border border-[rgba(24,28,32,0.1)] p-6 shadow-sm hover:shadow-md transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-[#af8d84]/10 flex items-center justify-center mb-4 group-hover:bg-[#af8d84]/20 transition-colors">
                            <BrandIcon className="w-5 h-5 text-[#af8d84]" />
                        </div>
                        <h3 className="font-bold text-foreground mb-1">خدماتنا</h3>
                        <p className="text-sm text-foreground">استعرض باقات المساعدة في التقديم</p>
                        <div className="flex items-center gap-1 mt-4 text-[#af8d84] text-sm font-medium">
                            <span>تعرف أكثر</span>
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                    </Link>
                </div>

                {/* Logout */}
                <div className="text-center">
                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-foreground hover:text-red-500 transition-colors mx-auto p-2">
                        <LogOut className="w-4 h-4" />
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        </div>
    );
}
