import { Check, Star, Zap, Crown } from "lucide-react";

const packages = [
    {
        name: "المستوى المجاني",
        nameEn: "FREE",
        price: "مجاني",
        priceNote: "للأبد",
        icon: Star,
        color: "from-slate-400 to-slate-500",
        featured: false,
        features: [
            "الوصول لقاعدة بيانات المنح الدراسية",
            "حساب مستخدم شخصي",
            "إشعارات بالبريد الإلكتروني",
            "نشرة إخبارية شهرية",
            "حفظ وتتبع الطلبات",
        ],
    },
    {
        name: "المستوى الأساسي",
        nameEn: "BASIC",
        price: "35-50₪",
        priceNote: "≈ $9-13",
        icon: Zap,
        color: "from-primary to-primary-dark",
        featured: false,
        features: [
            "بيان شخصي بالذكاء الاصطناعي لمنحة واحدة",
            "ترجمة 3 وثائق",
            "مراجعة خبير واحدة",
            "دعم عبر البريد الإلكتروني",
            "جميع مميزات المستوى المجاني",
        ],
    },
    {
        name: "المستوى الذهبي",
        nameEn: "GOLD",
        price: "110-150₪",
        priceNote: "≈ $28-38",
        icon: Crown,
        color: "from-primary to-primary-dark",
        featured: true,
        features: [
            "دعم كامل بالذكاء الاصطناعي لـ 3 منح",
            "حزمة ترجمة معتمدة كاملة",
            "إرشادات خطابات التوصية",
            "إدارة الجدول الزمني للتقديم",
            "دعم واتساب ذو أولوية",
            "عدة جولات مراجعة مع خبير",
        ],
    },
];

export default function PricingSection() {
    return (
        <section className="relative py-24 bg-white/60" id="pricing">
            <div className="glow-orb glow-orb-primary w-72 h-72 top-20 left-1/3 opacity-10" />

            <div className="section">
                <div className="text-center mb-16">
                    <span className="badge badge-primary mb-4">الأسعار</span>
                    <h2 className="section-title">
                        خدمات احترافية{" "}
                        <span className="gradient-text">بأسعار محلية</span>
                    </h2>
                    <p className="section-subtitle mx-auto">
                        أسعارنا مصممة خصيصاً لتناسب القدرة الشرائية المحلية. ادفع بالشيكل
                        عبر PalPay، بنك فلسطين، أو عبر عملة USDT
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {packages.map((pkg, index) => (
                        <div
                            key={index}
                            className={`pricing-card ${pkg.featured ? "featured" : ""
                                }`}
                        >
                            {pkg.featured && (
                                <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-2xl" />
                            )}

                            <div className="text-center mb-6">
                                <div
                                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mx-auto mb-4`}
                                >
                                    <pkg.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-foreground font-bold text-xl mb-1">
                                    {pkg.name}
                                </h3>
                                <p className="text-xs text-foreground">{pkg.nameEn}</p>
                            </div>

                            <div className="text-center mb-6">
                                <span className="text-3xl font-extrabold text-foreground">
                                    {pkg.price}
                                </span>
                                <p className="text-xs text-foreground mt-1">{pkg.priceNote}</p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {pkg.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm">
                                        <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                                        <span className="text-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={
                                    pkg.featured
                                        ? "btn-primary w-full justify-center"
                                        : "btn-secondary w-full justify-center"
                                }
                            >
                                {pkg.price === "مجاني" ? "ابدأ مجاناً" : "اختر هذه الباقة"}
                            </button>
                        </div>
                    ))}
                </div>

                {/* À la carte */}
                <div className="mt-16 text-center">
                    <p className="text-foreground text-sm mb-4">
                        تحتاج خدمة واحدة فقط؟ اطلع على خدماتنا المفردة
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        {[
                            { service: "ترجمة وثيقة واحدة", price: "15-25₪" },
                            { service: "صياغة خطاب توصية", price: "20₪" },
                            { service: "جلسة استشارة (ساعة)", price: "45₪" },
                            { service: "مراجعة الطلب", price: "35₪" },
                            { service: "تحسين السيرة الذاتية", price: "25₪" },
                        ].map((item, i) => (
                            <span key={i} className="tag">
                                {item.service}: <span className="text-primary mr-1">{item.price}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
