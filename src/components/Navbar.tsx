"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import {
    Menu,
    X,
    Search,
    User as UserIcon,
    Shield,
    LogOut,
} from "lucide-react";

const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/scholarships", label: "المنح الدراسية" },
    { href: "/services", label: "خدماتنا" },
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "تواصل معنا" },
];

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // Homepage has a dark hero — start transparent there.
    // All other pages use light backgrounds — always show the solid bar.
    const isHome = pathname === "/";
    const solid = !isHome || scrolled;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        const supabase = getSupabase();
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        const supabase = getSupabase();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <nav
            className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${solid
                ? "bg-white/90 backdrop-blur-md shadow-sm py-3 border-b border-border"
                : "bg-transparent py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl overflow-hidden transition-transform group-hover:scale-110 shadow-md border-2 border-primary/30">
                            <Image src="/icon.png" alt="رفيق" width={40} height={40} className="w-full h-full object-cover" priority />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-xl font-bold transition-colors ${solid ? "text-foreground" : "text-white"}`}>
                                رفيق
                            </span>
                            <span className={`text-xs transition-colors ${solid ? "text-muted" : "text-white/60"}`}>
                                للمنح الدراسية
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${solid
                                    ? "text-foreground hover:text-foreground hover:bg-surface-hover"
                                    : "text-white/80 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden lg:flex items-center gap-3">
                        {user ? (
                            <>
                                <Link
                                    href="/profile"
                                    className={solid ? "btn-secondary text-sm py-2 px-4" : "btn-light text-sm py-2 px-4"}
                                >
                                    <UserIcon className="w-4 h-4" />
                                    الملف الشخصي
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl transition-colors ${solid ? "text-foreground hover:text-red-500 hover:bg-red-50" : "text-white/80 hover:text-white hover:bg-white/10"}`}
                                >
                                    <LogOut className="w-4 h-4" />
                                    خروج
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className={solid ? "btn-secondary text-sm py-2 px-4" : "btn-light text-sm py-2 px-4"}
                                >
                                    <UserIcon className="w-4 h-4" />
                                    تسجيل الدخول
                                </Link>
                                <Link
                                    href="/scholarships"
                                    className="btn-primary text-sm py-2 px-4"
                                >
                                    <Search className="w-4 h-4" />
                                    ابحث عن منحة
                                </Link>
                            </>
                        )}
                        {/* Hidden admin access */}
                        <Link
                            href="/admin"
                            className={`p-2 rounded-xl transition-colors opacity-20 hover:opacity-80 ${solid ? "text-foreground hover:text-foreground hover:bg-surface-hover" : "text-white hover:bg-white/10"}`}
                            aria-label="Admin"
                            title="لوحة الإدارة"
                        >
                            <Shield className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex items-center gap-2 lg:hidden">
                        {/* Hidden admin access */}
                        <Link
                            href="/admin"
                            className={`p-2 rounded-xl transition-colors opacity-20 hover:opacity-80 ${solid ? "text-foreground hover:bg-surface-hover" : "text-white hover:bg-white/10"}`}
                            aria-label="Admin"
                            title="لوحة الإدارة"
                        >
                            <Shield className="w-5 h-5" />
                        </Link>

                        {/* Mobile Hamburger */}
                        <button
                            className={`p-2 rounded-xl transition-colors ${solid ? "hover:bg-surface-hover text-foreground" : "hover:bg-white/10 text-white"}`}
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="mt-4 pb-4 rounded-2xl p-4 space-y-1 bg-white border border-border shadow-lg">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:text-foreground hover:bg-surface-hover transition-all"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-3 mt-3 border-t border-border flex flex-col gap-2">
                            {user ? (
                                <>
                                    <Link href="/profile" className="btn-secondary text-sm py-2 px-4 justify-center" onClick={() => setIsOpen(false)}>
                                        <UserIcon className="w-4 h-4" />
                                        الملف الشخصي
                                    </Link>
                                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center justify-center gap-2 py-2 px-4 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                                        <LogOut className="w-4 h-4" />
                                        تسجيل الخروج
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" className="btn-secondary text-sm py-2 px-4 justify-center" onClick={() => setIsOpen(false)}>
                                        <UserIcon className="w-4 h-4" />
                                        تسجيل الدخول
                                    </Link>
                                    <Link href="/auth/register" className="btn-primary text-sm py-2 px-4 justify-center" onClick={() => setIsOpen(false)}>
                                        <Search className="w-4 h-4" />
                                        إنشاء حساب
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
