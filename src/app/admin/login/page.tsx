"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import BrandIcon from "@/components/BrandIcon";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
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
        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
            setLoading(false);
            return;
        }

        router.push("/admin");
        router.refresh();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#f6c8cc]/15 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-sm">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-[rgba(24,28,32,0.1)] p-8">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4d94cf] to-[#6aabdb] flex items-center justify-center shadow-lg mb-4">
                            <BrandIcon className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-foreground">لوحة إدارة رفيق</h1>
                        <p className="text-sm text-foreground mt-1">تسجيل دخول المشرف</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5 text-right">
                                البريد الإلكتروني
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                    dir="ltr"
                                    className="w-full pr-4 pl-10 py-3 bg-background border border-[rgba(24,28,32,0.1)] rounded-xl text-sm text-foreground placeholder-[#111111] focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4d94cf]/20 transition-all"
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5 text-right">
                                كلمة المرور
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    dir="ltr"
                                    className="w-full pr-4 pl-20 py-3 bg-background border border-[rgba(24,28,32,0.1)] rounded-xl text-sm text-foreground placeholder-[#111111] focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4d94cf]/20 transition-all"
                                />
                                <Lock className="absolute left-10 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 text-center">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-l from-[#4d94cf] to-[#6aabdb] text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-[#3378b0] hover:to-[#4d94cf] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    جارٍ التحقق...
                                </span>
                            ) : (
                                "تسجيل الدخول"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
