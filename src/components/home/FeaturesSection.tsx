import {
    Search,
    Bell,
    FileText,
    Bot,
    Shield,
    Send,
} from "lucide-react";

const features = [
    {
        icon: Search,
        title: "قاعدة بيانات شاملة",
        description:
            "أكثر من 200 منحة دراسية مصنفة حسب المستوى والتخصص والدولة ونوع التمويل",
    },
    {
        icon: Bell,
        title: "إشعارات ذكية",
        description:
            "تنبيهات مخصصة بناءً على ملفك الشخصي وتذكير بالمواعيد النهائية",
    },
    {
        icon: Bot,
        title: "مساعدة احترافية",
        description:
            "صياغة البيانات الشخصية والسير الذاتية من قِبل خبراء متخصصين بالمنح الدولية",
    },
    {
        icon: FileText,
        title: "ترجمة الوثائق",
        description:
            "ترجمة معتمدة للوثائق الأكاديمية من العربية للإنجليزية بأسعار محلية",
    },
    {
        icon: Shield,
        title: "دفع آمن ومرن",
        description:
            "طرق دفع متعددة: PalPay، بنك فلسطين، أو عبر عملة USDT",
    },
    {
        icon: Send,
        title: "بوت تيليجرام",
        description:
            "احصل على إشعارات المنح وتحديثات الطلبات مباشرة عبر تيليجرام",
    },
];

export default function FeaturesSection() {
    return (
        <section className="relative py-24 bg-white/60" id="features">
            <div className="glow-orb glow-orb-primary w-64 h-64 top-10 left-10 opacity-10" />

            <div className="section">
                <div className="text-center mb-16">
                    <span className="badge badge-primary mb-4">المميزات</span>
                    <h2 className="section-title">
                        كل ما تحتاجه في <span className="gradient-text">منصة واحدة</span>
                    </h2>
                    <p className="section-subtitle mx-auto">
                        صممنا رفيق خصيصاً لتلبية احتياجات الطلاب في غزة مع مراعاة التحديات
                        الفريدة التي يواجهونها
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="card card-shine group text-center"
                        >
                            <div
                                className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                            >
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-foreground font-bold text-lg mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-foreground text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
