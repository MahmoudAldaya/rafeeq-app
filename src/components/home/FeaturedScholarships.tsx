import Link from "next/link";
import { scholarships } from "@/data/scholarships";
import ScholarshipCard from "@/components/ScholarshipCard";
import { ArrowLeft, Award } from "lucide-react";

export default function FeaturedScholarships() {
    const featured = scholarships.filter((s) => s.featured);

    return (
        <section className="relative py-24 bg-surface/40" id="scholarships">
            <div className="section">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
                    <div>
                        <span className="badge badge-primary mb-4 flex items-center gap-1 w-fit">
                            <Award className="w-3 h-3" />
                            منح مميزة
                        </span>
                        <h2 className="section-title">
                            أبرز المنح <span className="gradient-text">المتاحة الآن</span>
                        </h2>
                        <p className="section-subtitle">
                            اطلع على أفضل المنح الدراسية الممولة بالكامل والمتاحة حالياً للتقديم
                        </p>
                    </div>
                    <Link
                        href="/scholarships"
                        className="btn-secondary text-sm"
                    >
                        عرض جميع المنح
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.map((scholarship) => (
                        <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                    ))}
                </div>
            </div>
        </section>
    );
}
