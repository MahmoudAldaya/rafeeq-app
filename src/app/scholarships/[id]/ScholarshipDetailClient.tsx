"use client";

import Link from "next/link";
import { Scholarship, getDaysUntilDeadline } from "@/data/scholarships";
import BrandIcon from "@/components/BrandIcon";
import {
    ArrowRight,
    Calendar,
    MapPin,
    ExternalLink,
    Bookmark,
    Clock,
    Award,
    Check,
    Share2,
    Globe,
    DollarSign,
    FileText,
    BookOpen,
} from "lucide-react";

interface Props {
    scholarship: Scholarship;
}

export default function ScholarshipDetailClient({ scholarship }: Props) {
    const daysLeft = getDaysUntilDeadline(scholarship.deadline);
    const isUrgent = daysLeft <= 30;
    const isExpired = daysLeft < 0;

    return (
        <div className="min-h-screen pt-24">
            {/* Back button */}
            <div className="section pb-0">
                <Link
                    href="/scholarships"
                    className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors text-sm mb-8"
                >
                    <ArrowRight className="w-4 h-4" />
                    العودة للمنح الدراسية
                </Link>
            </div>

            <div className="section pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header card */}
                        <div className="glass rounded-2xl p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <span className="text-5xl">{scholarship.countryFlag}</span>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
                                        {scholarship.titleAr}
                                    </h1>
                                    <p className="text-primary text-lg">{scholarship.titleEn}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="badge badge-primary text-sm">
                                    {scholarship.levelAr}
                                </span>
                                <span className="badge badge-success text-sm">
                                    {scholarship.fundingTypeAr}
                                </span>
                                <span className="tag">
                                    <MapPin className="w-3 h-3 ml-1" />
                                    {scholarship.country}
                                </span>
                                <span className="tag">
                                    <BrandIcon className="w-3 h-3 ml-1" />
                                    {scholarship.university}
                                </span>
                            </div>

                            <div
                                className={`countdown-chip ${isExpired ? "" : isUrgent ? "" : "safe"} text-sm`}
                            >
                                <Clock className="w-4 h-4" />
                                {isExpired
                                    ? "انتهى الموعد النهائي"
                                    : `${daysLeft} يوم متبقٍ حتى الموعد النهائي`}
                                <span className="mx-1">•</span>
                                {new Date(scholarship.deadline).toLocaleDateString("ar-EG", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="card">
                            <h2 className="text-foreground font-bold text-xl mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                عن المنحة
                            </h2>
                            <p className="text-muted leading-relaxed mb-4">
                                {scholarship.descriptionAr}
                            </p>
                            <div className="glass-light rounded-xl p-4 mt-4">
                                <p className="text-sm text-muted italic" dir="ltr">
                                    {scholarship.descriptionEn}
                                </p>
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className="card">
                            <h2 className="text-foreground font-bold text-xl mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-accent" />
                                شروط التقديم
                            </h2>
                            <ul className="space-y-3">
                                {scholarship.requirementsAr.map((req, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                        <span className="text-muted">{req}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="glass-light rounded-xl p-4 mt-4">
                                <ul className="space-y-1" dir="ltr">
                                    {scholarship.requirements.map((req, i) => (
                                        <li key={i} className="text-sm text-muted italic">
                                            • {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Coverage */}
                        <div className="card">
                            <h2 className="text-foreground font-bold text-xl mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-success" />
                                ما تغطيه المنحة
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {scholarship.coverageAr.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/10"
                                    >
                                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                                        <span className="text-muted text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Action card */}
                        <div className="glass rounded-2xl p-6 sticky top-28">
                            <h3 className="text-foreground font-bold text-lg mb-6">
                                قدّم على هذه المنحة
                            </h3>

                            <a
                                href={scholarship.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary w-full justify-center mb-3"
                            >
                                <Globe className="w-4 h-4" />
                                زيارة الموقع الرسمي
                                <ExternalLink className="w-4 h-4" />
                            </a>

                            <button className="btn-secondary w-full justify-center mb-3">
                                <Bookmark className="w-4 h-4" />
                                حفظ المنحة
                            </button>

                            <button className="btn-secondary w-full justify-center mb-6">
                                <Share2 className="w-4 h-4" />
                                مشاركة
                            </button>

                            <div className="divider-glow mb-6" />

                            <h4 className="text-foreground font-bold mb-3">تحتاج مساعدة؟</h4>
                            <p className="text-muted text-sm mb-4 leading-relaxed">
                                يمكننا مساعدتك في التقديم على هذه المنحة. خدماتنا تبدأ من 35₪
                                فقط!
                            </p>
                            <Link
                                href="/services"
                                className="btn-accent w-full justify-center text-sm"
                            >
                                <Award className="w-4 h-4" />
                                اطلب خدمة التقديم
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
