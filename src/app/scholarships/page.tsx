"use client";

import { useState, useMemo } from "react";
import {
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";
import BrandIcon from "@/components/BrandIcon";
import { scholarships, levels, countries, fundingTypes } from "@/data/scholarships";
import ScholarshipCard from "@/components/ScholarshipCard";

export default function ScholarshipsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedFunding, setSelectedFunding] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const filtered = useMemo(() => {
        return scholarships.filter((s) => {
            const matchesSearch =
                !searchQuery ||
                s.titleAr.includes(searchQuery) ||
                s.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.university.includes(searchQuery) ||
                s.country.includes(searchQuery);

            const matchesLevel = !selectedLevel || s.level === selectedLevel;
            const matchesCountry = !selectedCountry || s.country === selectedCountry;
            const matchesFunding =
                !selectedFunding || s.fundingType === selectedFunding;

            return matchesSearch && matchesLevel && matchesCountry && matchesFunding;
        });
    }, [searchQuery, selectedLevel, selectedCountry, selectedFunding]);

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedLevel("");
        setSelectedCountry("");
        setSelectedFunding("");
    };

    const hasFilters = searchQuery || selectedLevel || selectedCountry || selectedFunding;

    return (
        <div className="min-h-screen pt-24">
            {/* Header */}
            <section className="relative py-16 bg-grid-pattern">
                <div className="glow-orb glow-orb-primary w-80 h-80 top-0 right-1/4 opacity-10" />
                <div className="section pb-8">
                    <div className="text-center">
                        <span className="badge badge-primary mb-4">
                            <BrandIcon className="w-3 h-3 ml-1" />
                            قاعدة بيانات المنح
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
                            المنح <span className="gradient-text">الدراسية</span>
                        </h1>
                        <p className="text-foreground text-lg max-w-xl mx-auto">
                            ابحث عن المنحة المناسبة من بين أكثر من 200 منحة دراسية دولية
                        </p>
                    </div>
                </div>
            </section>

            {/* Search & Filters */}
            <section className="section pt-0">
                <div className="glass rounded-2xl p-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
                            <input
                                type="text"
                                placeholder="ابحث عن منحة بالاسم أو الجامعة أو الدولة..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-3 pr-12 pl-4 bg-transparent text-white placeholder:text-foreground focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`btn-secondary py-3 px-4 ${showFilters ? "border-primary text-primary" : ""}`}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            فلترة
                        </button>
                    </div>

                    {/* Filter dropdowns */}
                    {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="input"
                            >
                                <option value="">المستوى الدراسي</option>
                                {levels.map((level) => (
                                    <option key={level.value} value={level.value}>
                                        {level.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                className="input"
                            >
                                <option value="">الدولة</option>
                                {countries.map((country) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedFunding}
                                onChange={(e) => setSelectedFunding(e.target.value)}
                                className="input"
                            >
                                <option value="">نوع التمويل</option>
                                {fundingTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Active filters */}
                {hasFilters && (
                    <div className="flex items-center gap-2 mb-6 flex-wrap">
                        <span className="text-sm text-foreground">الفلاتر النشطة:</span>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="badge badge-primary flex items-center gap-1"
                            >
                                {searchQuery}
                                <X className="w-3 h-3" />
                            </button>
                        )}
                        {selectedLevel && (
                            <button
                                onClick={() => setSelectedLevel("")}
                                className="badge badge-primary flex items-center gap-1"
                            >
                                {levels.find((l) => l.value === selectedLevel)?.label}
                                <X className="w-3 h-3" />
                            </button>
                        )}
                        {selectedCountry && (
                            <button
                                onClick={() => setSelectedCountry("")}
                                className="badge badge-primary flex items-center gap-1"
                            >
                                {selectedCountry}
                                <X className="w-3 h-3" />
                            </button>
                        )}
                        {selectedFunding && (
                            <button
                                onClick={() => setSelectedFunding("")}
                                className="badge badge-primary flex items-center gap-1"
                            >
                                {fundingTypes.find((f) => f.value === selectedFunding)?.label}
                                <X className="w-3 h-3" />
                            </button>
                        )}
                        <button
                            onClick={clearFilters}
                            className="text-sm text-danger hover:underline"
                        >
                            مسح الكل
                        </button>
                    </div>
                )}

                {/* Results */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-foreground text-sm">
                        عرض {filtered.length} من {scholarships.length} منحة
                    </p>
                </div>

                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((scholarship) => (
                            <ScholarshipCard
                                key={scholarship.id}
                                scholarship={scholarship}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <BrandIcon className="w-16 h-16 text-foreground mx-auto mb-4 opacity-30" />
                        <h3 className="text-foreground font-bold text-xl mb-2">
                            لم يتم العثور على نتائج
                        </h3>
                        <p className="text-foreground mb-6">
                            حاول تعديل معايير البحث أو الفلترة
                        </p>
                        <button onClick={clearFilters} className="btn-secondary">
                            مسح الفلاتر
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
