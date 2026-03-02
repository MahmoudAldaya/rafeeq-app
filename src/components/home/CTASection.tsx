import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";

export default function CTASection() {
    return (
        <section className="relative py-24 overflow-hidden">
            <div className="glow-orb glow-orb-primary w-96 h-96 bottom-0 right-1/4" />

            <div className="section">
                <div className="relative bg-[#173955] rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-2xl">
                    {/* Top border */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-3xl" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                            <Heart className="w-4 h-4" />
                            رفيق معك في كل خطوة
                        </div>

                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                            حلمك في الدراسة
                            <br />
                            <span className="gradient-text">يستحق المحاولة</span>
                        </h2>

                        <p className="text-lg text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
                            ابحث في مئات المنح الدراسية الدولية، واعثر على الفرصة التي تناسبك.
                            رفيق هنا لمساعدتك، مجاناً وبدون تعقيد.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/scholarships"
                                className="btn-primary text-lg py-4 px-8"
                            >
                                ابدأ البحث الآن
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <Link href="/about" className="btn-light text-lg py-4 px-8">
                                تعرف علينا
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
