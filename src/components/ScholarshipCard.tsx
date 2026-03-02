"use client";

import Link from "next/link";
import {
    Scholarship,
    getDaysUntilDeadline,
} from "@/data/scholarships";
import BrandIcon from "@/components/BrandIcon";
import {
    Calendar,
    MapPin,
    ExternalLink,
    Bookmark,
    Clock,
    Award,
} from "lucide-react";

interface ScholarshipCardProps {
    scholarship: Scholarship;
}

export default function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
    const daysLeft = getDaysUntilDeadline(scholarship.deadline);
    const isUrgent = daysLeft <= 30;
    const isExpired = daysLeft < 0;

    return (
        <div className="card card-shine group relative">
            {/* Full-card clickable overlay */}
            <Link
                href={`/scholarships/${scholarship.id}`}
                className="absolute inset-0 z-0"
                aria-label={`عرض تفاصيل منحة ${scholarship.titleAr}`}
            />

            {/* Featured badge */}
            {scholarship.featured && (
                <div className="absolute top-4 left-4 badge badge-accent flex items-center gap-1 z-10">
                    <Award className="w-3 h-3" />
                    مميزة
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-4 relative pointer-events-none">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{scholarship.countryFlag}</span>
                    <div>
                        <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                            {scholarship.titleAr}
                        </h3>
                        <p className="text-sm text-foreground">{scholarship.titleEn}</p>
                    </div>
                </div>
            </div>

            {/* University */}
            <p className="text-sm text-foreground/70 mb-4 flex items-center gap-2 relative pointer-events-none">
                <BrandIcon className="w-4 h-4 text-primary" />
                {scholarship.university}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4 relative pointer-events-none">
                <span className="badge badge-primary">{scholarship.levelAr}</span>
                <span className="badge badge-success">{scholarship.fundingTypeAr}</span>
                <span className="tag">
                    <MapPin className="w-3 h-3 ml-1" />
                    {scholarship.country}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm text-foreground mb-4 leading-relaxed line-clamp-2 relative pointer-events-none">
                {scholarship.descriptionAr}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border relative z-10">
                <div
                    className={`countdown-chip ${isExpired ? "" : isUrgent ? "" : "safe"} pointer-events-none`}
                >
                    <Clock className="w-3 h-3" />
                    {isExpired
                        ? "انتهى الموعد"
                        : isUrgent
                            ? `${daysLeft} يوم متبقٍ`
                            : `${daysLeft} يوم متبقٍ`}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-foreground hover:text-primary relative z-10 cursor-pointer"
                        aria-label="حفظ المنحة"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // TODO: Implement save functionality
                            alert("سيتم إضافة ميزة حفظ المنحة قريباً!");
                        }}
                    >
                        <Bookmark className="w-4 h-4 pointer-events-none" />
                    </button>
                    <Link
                        href={`/scholarships/${scholarship.id}`}
                        className="btn-primary text-xs py-2 px-3 relative z-10"
                    >
                        التفاصيل
                        <ExternalLink className="w-3 h-3 pointer-events-none" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
