import {
    Target,
    Eye,
    Heart,
    Globe,
    Shield,
    Lightbulb,
    Users,
    Award,
} from "lucide-react";
import BrandIcon from "@/components/BrandIcon";

const values = [
    {
        icon: Heart,
        title: "التمكين",
        description:
            "نؤمن بقدرة كل طالب على تحقيق حلمه الأكاديمي ونعمل على تذليل العقبات التي تقف أمامه.",
    },
    {
        icon: Globe,
        title: "الشمولية",
        description:
            "منصتنا مصممة لتكون في متناول الجميع بغض النظر عن قدرتهم المالية أو جودة اتصالهم بالإنترنت.",
    },
    {
        icon: Shield,
        title: "الجودة",
        description:
            "نجمع بين خبرة المتخصصين الأكاديميين والمراجعة الدقيقة لضمان أعلى جودة في خدماتنا.",
    },
    {
        icon: Lightbulb,
        title: "الابتكار",
        description:
            "نستخدم أحدث التقنيات مع الحفاظ على الحساسية الثقافية واللمسة الإنسانية في كل ما نقدمه.",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background pt-24">

            {/* Header */}
            <section className="relative py-16">
                <div className="glow-orb glow-orb-primary w-80 h-80 top-0 right-1/4 opacity-10" />
                <div className="section pb-8">
                    <div className="text-center">
                        <span className="badge badge-primary mb-4">
                            <Users className="w-3 h-3 ml-1" />
                            من نحن
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6">
                            <span className="gradient-text">رفيق</span> في رحلتك الأكاديمية
                        </h1>
                        <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
                            منصة متخصصة صُممت من القلب لمساعدة طلاب غزة في الوصول إلى الفرص
                            التعليمية الدولية وتحقيق أحلامهم الأكاديمية
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="section py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="card p-8">
                        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6">
                            <Target className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-foreground font-bold text-2xl mb-4">رسالتنا</h2>
                        <p className="text-muted leading-relaxed">
                            تمكين الطلاب في غزة من الوصول إلى التعليم الدولي من خلال توفير
                            معلومات شاملة عن المنح الدراسية، ودعم مخصص، وخدمات تقديم احترافية
                            تتغلب على الحواجز الجغرافية واللوجستية.
                        </p>
                    </div>

                    <div className="card p-8">
                        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6">
                            <Eye className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-foreground font-bold text-2xl mb-4">رؤيتنا</h2>
                        <p className="text-muted leading-relaxed">
                            أن نكون المرجع الأول والأشمل لطلاب غزة الباحثين عن المنح الدراسية
                            الدولية، ومنصة مستدامة تساهم في بناء رأس المال البشري لغزة من خلال
                            التعليم.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section py-16">
                <div className="text-center mb-12">
                    <h2 className="section-title">
                        قيمنا <span className="gradient-text">الأساسية</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value, index) => (
                        <div key={index} className="card card-shine text-center">
                            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
                                <value.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-foreground font-bold text-lg mb-2">
                                {value.title}
                            </h3>
                            <p className="text-muted text-sm leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Rafeeq */}
            <section className="section py-16 pb-24">
                <div className="card p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h2 className="section-title">
                            لماذا <span className="gradient-text">رفيق؟</span>
                        </h2>
                        <p className="section-subtitle mx-auto">
                            ما يميزنا عن المنصات الأخرى
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: BrandIcon,
                                title: "تركيز على غزة",
                                desc: "منصتنا مصممة خصيصاً لاحتياجات وتحديات الطلاب في غزة",
                            },
                            {
                                icon: Globe,
                                title: "عربي أولاً",
                                desc: "واجهة عربية أصيلة وليست ترجمة من الإنجليزية",
                            },
                            {
                                icon: Award,
                                title: "أسعار محلية",
                                desc: "خدمات تبدأ من 35₪ فقط مقارنة بـ $200+ للمستشارين الدوليين",
                            },
                            {
                                icon: Shield,
                                title: "ذكاء اصطناعي + خبير",
                                desc: "جودة عالية بتكلفة منخفضة من خلال دمج AI مع المراجعة البشرية",
                            },
                            {
                                icon: Lightbulb,
                                title: "باندويث منخفض",
                                desc: "منصة محسّنة للعمل مع اتصالات الإنترنت غير المستقرة",
                            },
                            {
                                icon: Heart,
                                title: "دعم شامل",
                                desc: "من البحث عن المنحة حتى السفر، نرافقك في كل خطوة",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-4 p-4 rounded-xl bg-surface-hover"
                            >
                                <item.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="text-foreground font-bold mb-1">{item.title}</h4>
                                    <p className="text-muted text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
