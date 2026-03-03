import { Metadata } from "next";
import Link from "next/link";
import {
    FileText,
    Languages,
    MessageSquare,
    Bot,
    Check,
    ArrowLeft,
    Zap,
    Award,
    Clock,
    Users,
    Shield,
} from "lucide-react";

export const metadata: Metadata = {
    title: "خدماتنا | رفيق - منصة المنح الدراسية",
    description:
        "خدمات احترافية لمساعدتك في التقديم على المنح الدراسية: كتابة البيان الشخصي، ترجمة الوثائق، خطابات التوصية والمزيد.",
};

const services = [
    {
        icon: FileText,
        title: "كتابة البيان الشخصي",
        description:
            "صياغة بيان شخصي مقنع ومخصص لمتطلبات المنحة المحددة من قِبل خبراء متخصصين في المنح الدولية.",
        features: [
            "استبيان شامل لفهم قصتك وأهدافك",
            "صياغة أولية دقيقة مع مراعاة سياق غزة",
            "مراجعة وتحسين من خبير ذو خبرة أكاديمية دولية",
            "عدة جولات تعديل حتى الرضا التام",
            "تخصيص لكل منحة على حدة",
        ],
        price: "35-50₪",
    },
    {
        icon: Languages,
        title: "ترجمة الوثائق",
        description:
            "ترجمة معتمدة لجميع وثائقك الأكاديمية من العربية إلى الإنجليزية بمعايير دولية.",
        features: [
            "الكشوف الأكاديمية والشهادات",
            "الهوية الوطنية وجواز السفر",
            "شهادات الميلاد",
            "خطابات التوصية",
            "تنسيق حسب المتطلبات الدولية",
        ],
        price: "15-25₪ للوثيقة",
    },
    {
        icon: MessageSquare,
        title: "خطابات التوصية",
        description:
            "مساعدة شاملة في إعداد خطابات التوصية من اختيار المرجعيين المناسبين حتى المتابعة والتقديم.",
        features: [
            "قوالب جاهزة للمرجعيين",
            "إرشاد حول اختيار المرجعيين المناسبين",
            "مراجعة وتحرير مسودات الخطابات",
            "تنسيق التقديم والمتابعة",
        ],
        price: "20₪",
    },
    {
        icon: Bot,
        title: "المراجعة والاستشارة",
        description:
            "مراجعة شاملة لملف التقديم وجلسات استشارة فردية لتحسين فرصك في القبول.",
        features: [
            "مراجعة كاملة لملف التقديم",
            "تحسين السيرة الذاتية الأكاديمية",
            "إرشاد لاختيار المنح المناسبة",
            "نصائح للمقابلات والاختبارات",
        ],
        price: "35-45₪",
    },
];

const workflow = [
    {
        step: 1,
        title: "جمع المعلومات",
        description: "تعبئة استبيان شامل عن خلفيتك الأكاديمية وأهدافك",
        icon: Users,
    },
    {
        step: 2,
        title: "الصياغة الاحترافية",
        description: "إعداد مسودة أولية من قِبل خبراء متخصصين بلغة أكاديمية احترافية",
        icon: Bot,
    },
    {
        step: 3,
        title: "مراجعة الخبير",
        description: "مراجعة ومراجعة من خبير ذو خبرة في المنح الدولية",
        icon: Shield,
    },
    {
        step: 4,
        title: "التسليم النهائي",
        description: "تسليم النسخة النهائية مع إمكانية طلب تعديلات إضافية",
        icon: Award,
    },
];

export default function ServicesPage() {
    return (
        <div className="min-h-screen pt-24">
            {/* Header */}
            <section className="relative py-16 bg-grid-pattern">
                <div className="glow-orb glow-orb-primary w-80 h-80 top-0 left-1/4 opacity-10" />
                <div className="section pb-8">
                    <div className="text-center">
                        <span className="badge badge-primary mb-4">
                            <Zap className="w-3 h-3 ml-1" />
                            خدمات احترافية
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
                            خدمات{" "}
                            <span className="gradient-text">بأسعار محلية</span>
                        </h1>
                        <p className="text-foreground text-lg max-w-xl mx-auto">
                            خدمات احترافية بمعايير دولية وأسعار مصممة لتناسب القدرة الشرائية
                            المحلية في غزة
                        </p>
                    </div>
                </div>
            </section>

            {/* Workflow */}
            <section className="section py-16">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-2">كيف نعمل؟</h2>
                    <p className="text-foreground">
                        نعتمد على خبراء متخصصين في المنح الدولية لتقديم أفضل النتائج
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {workflow.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="card text-center">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                                    <step.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div className="badge badge-primary mb-3 mx-auto">
                                    الخطوة {step.step}
                                </div>
                                <h3 className="text-foreground font-bold mb-2">{step.title}</h3>
                                <p className="text-foreground text-sm">{step.description}</p>
                            </div>
                            {index < workflow.length - 1 && (
                                <div className="hidden lg:flex absolute top-1/2 -left-3 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background items-center justify-center z-10">
                                    <ArrowLeft className="w-5 h-5 text-muted" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <div className="section-divider" />

            {/* Services */}
            <section className="section py-16">
                <div className="space-y-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="card p-8 hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div
                                            className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center"
                                        >
                                            <service.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-foreground font-bold text-xl">
                                                {service.title}
                                            </h3>
                                            <span className="text-primary font-bold text-lg">
                                                {service.price}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-foreground mb-6 leading-relaxed">
                                        {service.description}
                                    </p>
                                    <ul className="space-y-2">
                                        {service.features.map((feature, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-3 text-sm text-muted"
                                            >
                                                <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex items-center">
                                    <div className="w-full text-center lg:text-start">
                                        <div className="text-3xl font-extrabold text-foreground mb-2">
                                            {service.price}
                                        </div>
                                        <p className="text-foreground text-sm mb-4">
                                            أسعار بالشيكل الإسرائيلي
                                        </p>
                                        <Link
                                            href={`/order?service=${index}`}
                                            className="btn-primary w-full justify-center"
                                        >
                                            اطلب الخدمة الآن
                                            <ArrowLeft className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="section-divider" />

            {/* Payment info */}
            <section className="section py-16">
                <div className="card p-8 text-center max-w-4xl mx-auto">
                    <h3 className="text-foreground font-bold text-xl mb-4">طرق الدفع</h3>
                    <p className="text-foreground mb-6 max-w-2xl mx-auto">
                        نوفر طرق دفع متعددة لتناسب احتياجاتك. يمكنك الدفع عبر PalPay أو
                        تحويل بنكي عبر بنك فلسطين.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {["PalPay", "بنك فلسطين"].map(
                            (method, i) => (
                                <span key={i} className="badge badge-success text-sm">
                                    <Check className="w-3 h-3 ml-1" />
                                    {method}
                                </span>
                            )
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
