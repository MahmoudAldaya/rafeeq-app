"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import BrandIcon from "@/components/BrandIcon";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const supabase = getSupabase();
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) {
            setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
            setLoading(false);
            return;
        }
        router.push("/profile");
        router.refresh();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-24">
            <div className="relative w-full max-w-sm">
                <div className="bg-white rounded-3xl shadow-xl border border-[rgba(24,28,32,0.1)] p-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4d94cf] to-[#6aabdb] flex items-center justify-center shadow-lg mb-4">
                            <BrandIcon className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-foreground">تسجيل الدخول</h1>
                        <p className="text-sm text-foreground mt-1">أهلاً بك في رفيق</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
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
                                    placeholder="••••••••"
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
                            {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
                        </button>
                    </form>
                    <p className="text-center text-sm text-foreground mt-6">
                        ليس لديك حساب؟{" "}
                        <Link href="/auth/register" className="text-primary font-semibold hover:underline">إنشاء حساب</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
