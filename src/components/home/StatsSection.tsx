import BrandIcon from "@/components/BrandIcon";
import { Globe, Users, BookOpen } from "lucide-react";

const stats = [
    {
        icon: BookOpen,
        number: "+200",
        label: "منحة دراسية",
    },
    {
        icon: Globe,
        number: "+30",
        label: "دولة حول العالم",
    },
    {
        icon: Users,
        number: "+1,000",
        label: "طالب مسجل",
    },
    {
        icon: BrandIcon,
        number: "+50",
        label: "طالب حصل على منحة",
    },
];

export default function StatsSection() {
    return (
        <section className="relative py-24 bg-background">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <stat.icon className="w-8 h-8 text-primary mx-auto mb-3 opacity-60" />
                            <div className="stat-number">{stat.number}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
