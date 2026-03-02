"use client";

import Link from "next/link";
import BrandIcon from "@/components/BrandIcon";
import {
    Facebook,
    Instagram,
    Linkedin,
    Send,
    Mail,
    Phone,
    MapPin,
    Heart,
    ExternalLink,
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative bg-[#173955] border-t border-[#1e4768] pt-16 pb-8">
            {/* Glow */}
            <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-primary opacity-5 blur-[80px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4d94cf] to-[#6aabdb] flex items-center justify-center shadow-md">
                                <BrandIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-[#e0e5da] block">رفيق</span>
                                <span className="text-xs text-[#e0e5da]/40 italic">Rafeeq</span>
                            </div>
                        </Link>
                        <p className="text-[#e0e5da]/55 text-sm leading-relaxed mb-6">
                            منصتك الشاملة للبحث عن المنح الدراسية الدولية والتقديم عليها.
                            نساعد طلاب غزة في الوصول إلى الفرص التعليمية حول العالم.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: Facebook, href: "#", label: "Facebook" },
                                { icon: Instagram, href: "#", label: "Instagram" },
                                { icon: Linkedin, href: "#", label: "LinkedIn" },
                                { icon: Send, href: "#", label: "Telegram" },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/40 transition-all duration-300"
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-primary font-bold mb-4">روابط سريعة</h3>
                        <ul className="space-y-3">
                            {[
                                { href: "/scholarships", label: "المنح الدراسية" },
                                { href: "/services", label: "خدماتنا" },
                                { href: "/about", label: "من نحن" },
                                { href: "/contact", label: "تواصل معنا" },
                                { href: "/profile", label: "الملف الشخصي" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-[#e0e5da]/55 hover:text-primary text-sm transition-colors duration-300 flex items-center gap-2"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-primary font-bold mb-4">خدماتنا</h3>
                        <ul className="space-y-3">
                            {[
                                "البحث عن المنح",
                                "كتابة البيان الشخصي",
                                "ترجمة الوثائق",
                                "خطابات التوصية",
                                "مراجعة الطلبات",
                            ].map((service) => (
                                <li key={service}>
                                    <span className="text-[#e0e5da]/55 text-sm">{service}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-primary font-bold mb-4">تواصل معنا</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-[#e0e5da]/55 text-sm">
                                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                                info@rafeeq.ps
                            </li>
                            <li className="flex items-center gap-3 text-[#e0e5da]/55 text-sm">
                                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                                <span dir="ltr">+970 59 XXX XXXX</span>
                            </li>
                            <li className="flex items-center gap-3 text-[#e0e5da]/55 text-sm">
                                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                                غزة، فلسطين
                            </li>
                        </ul>

                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-[#1e4768] pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#e0e5da]/40">
                        <p className="flex items-center gap-1">
                            صُنع بـ <Heart className="w-3 h-3 text-red-400 inline" /> لطلاب غزة
                            &copy; {new Date().getFullYear()} رفيق
                        </p>
                        <div className="flex gap-6">
                            <Link href="#" className="hover:text-primary transition-colors">
                                سياسة الخصوصية
                            </Link>
                            <Link href="#" className="hover:text-primary transition-colors">
                                الشروط والأحكام
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
