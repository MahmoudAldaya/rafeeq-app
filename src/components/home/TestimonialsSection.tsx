"use client";

import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
    {
        name: "أحمد الشريف",
        university: "جامعة مانشستر - منحة تشيفنينغ",
        text: "بفضل رفيق، استطعت كتابة بيان شخصي قوي ومقنع. الفريق ساعدني في كل خطوة من التقديم وحتى الحصول على القبول. أنصح كل طالب بالمنصة!",
        stars: 5,
    },
    {
        name: "سارة أبو هاشم",
        university: "جامعة برلين الحرة - منحة DAAD",
        text: "خدمة الترجمة كانت ممتازة والأسعار معقولة جداً. تمكنت من ترجمة جميع وثائقي بسرعة وبجودة عالية. شكراً رفيق!",
        stars: 5,
    },
    {
        name: "محمد عبد الله",
        university: "جامعة أنقرة - المنحة التركية",
        text: "المنصة سهلة الاستخدام جداً والإشعارات ساعدتني بعدم تفويت أي موعد نهائي. الدعم عبر واتساب كان سريعاً ومفيداً.",
        stars: 5,
    },
];

export default function TestimonialsSection() {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
    const prev = () =>
        setCurrent(
            (prev) => (prev - 1 + testimonials.length) % testimonials.length
        );

    return (
        <section className="relative py-24 bg-white/60">
            <div className="section">
                <div className="text-center mb-16">
                    <span className="badge badge-primary mb-4">قصص نجاح</span>
                    <h2 className="section-title">
                        ماذا يقول <span className="gradient-text">طلابنا</span>
                    </h2>
                    <p className="section-subtitle mx-auto">
                        طلاب حقيقيون حققوا أحلامهم الأكاديمية بمساعدة رفيق
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="glass rounded-3xl p-8 md:p-12 relative">
                        <Quote className="w-12 h-12 text-primary/20 absolute top-6 right-6" />

                        <div className="text-center">
                            {/* Stars */}
                            <div className="flex items-center justify-center gap-1 mb-6">
                                {Array.from({ length: testimonials[current].stars }).map(
                                    (_, i) => (
                                        <Star
                                            key={i}
                                            className="w-5 h-5 text-amber-400 fill-amber-400"
                                        />
                                    )
                                )}
                            </div>

                            {/* Quote */}
                            <p className="text-lg text-foreground leading-relaxed mb-8">
                                &quot;{testimonials[current].text}&quot;
                            </p>

                            {/* Author */}
                            <div className="mb-2">
                                <h4 className="text-foreground font-bold text-lg">
                                    {testimonials[current].name}
                                </h4>
                                <p className="text-primary text-sm">
                                    {testimonials[current].university}
                                </p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button
                                onClick={prev}
                                className="p-2 rounded-xl bg-surface border border-border hover:border-primary/30 transition-colors"
                                aria-label="السابق"
                            >
                                <ChevronRight className="w-5 h-5 text-foreground" />
                            </button>
                            <div className="flex gap-2">
                                {testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrent(i)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${i === current
                                            ? "bg-primary w-8"
                                            : "bg-border hover:bg-muted"
                                            }`}
                                        aria-label={`Testimonial ${i + 1}`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={next}
                                className="p-2 rounded-xl bg-surface border border-border hover:border-primary/30 transition-colors"
                                aria-label="التالي"
                            >
                                <ChevronLeft className="w-5 h-5 text-foreground" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
