import { scholarships } from "@/data/scholarships";
import ScholarshipDetailClient from "./ScholarshipDetailClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return scholarships.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const scholarship = scholarships.find((s) => s.id === id);
    if (!scholarship) return { title: "غير موجود" };
    return {
        title: `${scholarship.titleAr} | رفيق`,
        description: scholarship.descriptionAr,
    };
}

export default async function ScholarshipDetailPage({ params }: Props) {
    const { id } = await params;
    const scholarship = scholarships.find((s) => s.id === id);
    if (!scholarship) notFound();

    return <ScholarshipDetailClient scholarship={scholarship} />;
}
