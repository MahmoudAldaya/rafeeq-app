"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ArrowLeft } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden hero-dark pb-32">
            {/* Background glow */}
            <div className="absolute top-[15%] left-[5%] w-96 h-96 rounded-full bg-primary opacity-[0.15] blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-8 text-center pt-24">

                {/* Logo */}
                <div className="flex justify-center mb-8 animate-fade-in-up">
                    <div className="relative w-28 h-28 md:w-36 md:h-36">
                        <div className="absolute inset-0 rounded-full bg-white/10 blur-xl scale-125" />
                        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                            <Image
                                src="/icon.png"
                                alt="رفيق"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="animate-fade-in-up stagger-1 text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
                    <span className="text-white">مستقبلك الأكاديمي</span>
                    <br />
                    <span className="text-primary">يبدأ مع رفيق</span>
                </h1>

                {/* Subtitle */}
                <p className="animate-fade-in-up stagger-2 text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
                    منصتك للبحث عن المنح الدراسية الدولية والتقديم عليها.
                    أنشئ حسابك للوصول إلى خدمات الدعم المخصصة لطلاب غزة.
                </p>

                {/* CTA */}
                <div className="animate-fade-in-up stagger-3 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 px-4">
                    <Link href="/scholarships" className="btn-primary w-full sm:w-[220px] py-4 justify-center">
                        <Search className="w-5 h-5" />
                        ابحث عن منحتك
                        <ArrowLeft className="w-4 h-4 ml-[-20px] opacity-0" /> {/* Spacer for visual balance with the search icon */}
                    </Link>
                    <Link
                        href="/auth/register"
                        className="flex items-center justify-center gap-2 py-4 rounded-full border border-white/30 text-white hover:border-white/50 hover:bg-white/10 transition-all font-semibold text-base w-full sm:w-[220px]"
                    >
                        أنشئ حسابك
                    </Link>
                </div>

                {/* Stats */}
                <div className="animate-fade-in-up stagger-4 grid grid-cols-3 gap-6 max-w-lg mx-auto">
                    {[
                        { number: "+200", label: "منحة دراسية" },
                        { number: "+50", label: "دولة حول العالم" },
                        { number: "+1000", label: "طالب استفاد" },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-2xl font-bold text-primary">{stat.number}</p>
                            <p className="text-xs text-white/60 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
