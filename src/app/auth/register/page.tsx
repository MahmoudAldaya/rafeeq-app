"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import BrandIcon from "@/components/BrandIcon";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
        setLoading(true);
        setError("");
        const supabase = getSupabase();
        const { error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } },
        });
        if (authError) {
            setError(authError.message === "User already registered" ? "هذا البريد الإلكتروني مسجل مسبقاً" : "حدث خطأ، حاول مجدداً");
            setLoading(false);
            return;
        }
        setSuccess(true);
        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-24">
                <div className="bg-white rounded-3xl shadow-xl border border-[rgba(24,28,32,0.1)] p-8 max-w-sm w-full text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center mx-auto shadow-lg mb-4">
                        <BrandIcon className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">تحقق من بريدك الإلكتروني!</h2>
                    <p className="text-foreground text-sm mb-6">أرسلنا رابط التأكيد إلى <strong className="text-foreground">{email}</strong>. افتح بريدك وانقر على الرابط لتفعيل حسابك.</p>
                    <Link href="/auth/login" className="btn-primary text-sm py-2.5 px-6">تسجيل الدخول</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-24">
            <div className="relative w-full max-w-sm">
                <div className="bg-white rounded-3xl shadow-xl border border-[rgba(24,28,32,0.1)] p-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4d94cf] to-[#6aabdb] flex items-center justify-center shadow-lg mb-4">
                            <BrandIcon className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-foreground">إنشاء حساب جديد</h1>
                        <p className="text-sm text-foreground mt-1">انضم إلى رفيق مجاناً</p>
                    </div>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5 text-right">الاسم الكامل</label>
                            <div className="relative">
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required dir="rtl"
                                    placeholder="محمد أحمد"
                                    className="w-full px-4 py-3 bg-background border border-[rgba(24,28,32,0.1)] rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4d94cf]/20 transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5 text-right">البريد الإلكتروني</label>
                            <div className="relative">
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr"
                                    placeholder="you@example.com"
                                    className="w-full pr-4 pl-10 py-3 bg-background border border-[rgba(24,28,32,0.1)] rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4d94cf]/20 transition-all" />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5 text-right">كلمة المرور</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr"
                                    placeholder="6 أحرف على الأقل"
                                    className="w-full pr-4 pl-20 py-3 bg-background border border-[rgba(24,28,32,0.1)] rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4d94cf]/20 transition-all" />
                                <Lock className="absolute left-10 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground hover:text-foreground transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 text-center">{error}</div>}
                        <button type="submit" disabled={loading}
                            className="w-full py-3 bg-gradient-to-l from-[#4d94cf] to-[#6aabdb] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60 mt-2">
                            {loading ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
                        </button>
                    </form>
                    <p className="text-center text-sm text-foreground mt-6">
                        لديك حساب بالفعل؟{" "}
                        <Link href="/auth/login" className="text-primary font-semibold hover:underline">تسجيل الدخول</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
