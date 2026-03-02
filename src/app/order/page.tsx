"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import {
    FileText, Languages, MessageSquare, Bot,
    Check, ChevronLeft, Upload, CreditCard,
    Building, Banknote, Loader2, CheckCircle2, X, ArrowLeft
} from "lucide-react";

// Static service definitions (matches services page)
const serviceList = [
    {
        id: 0,
        icon: FileText,
        title: "كتابة البيان الشخصي",
        description: "صياغة بيان شخصي مقنع ومخصص لمتطلبات المنحة المحددة من قِبل خبراء متخصصين في المنح الدولية.",
        features: [
            "استبيان شامل لفهم قصتك وأهدافك",
            "صياغة دقيقة مع مراعاة سياق غزة",
            "مراجعة وتحسين من خبير ذو خبرة أكاديمية دولية",
            "عدة جولات تعديل حتى الرضا التام",
            "تخصيص لكل منحة على حدة",
        ],
        price: "35-50₪",
        minPrice: 35,
        color: "from-blue-500 to-cyan-400",
    },
    {
        id: 1,
        icon: Languages,
        title: "ترجمة الوثائق",
        description: "ترجمة معتمدة لجميع وثائقك الأكاديمية من العربية إلى الإنجليزية بمعايير دولية.",
        features: [
            "الكشوف الأكاديمية والشهادات",
            "الهوية الوطنية وجواز السفر",
            "شهادات الميلاد",
            "خطابات التوصية",
            "تنسيق حسب المتطلبات الدولية",
        ],
        price: "15-25₪ للوثيقة",
        minPrice: 15,
        color: "from-emerald-500 to-teal-400",
    },
    {
        id: 2,
        icon: MessageSquare,
        title: "خطابات التوصية",
        description: "مساعدة شاملة في إعداد خطابات التوصية من اختيار المرجعيين المناسبين حتى المتابعة والتقديم.",
        features: [
            "قوالب جاهزة للمرجعيين",
            "إرشاد حول اختيار المرجعيين المناسبين",
            "مراجعة وتحرير مسودات الخطابات",
            "تنسيق التقديم والمتابعة",
        ],
        price: "20₪",
        minPrice: 20,
        color: "from-amber-500 to-orange-400",
    },
    {
        id: 3,
        icon: Bot,
        title: "المراجعة والاستشارة",
        description: "مراجعة شاملة لملف التقديم وجلسات استشارة فردية لتحسين فرصك في القبول.",
        features: [
            "مراجعة كاملة لملف التقديم",
            "تحسين السيرة الذاتية الأكاديمية",
            "إرشاد لاختيار المنح المناسبة",
            "نصائح للمقابلات والاختبارات",
        ],
        price: "35-45₪",
        minPrice: 35,
        color: "from-purple-500 to-pink-400",
    },
];

interface PaymentAccount {
    id: string;
    type: "palpay" | "bank";
    label: string;
    account_number: string;
    holder_name: string;
    is_active: boolean;
}

type Step = "details" | "payment" | "upload" | "success";

import { Suspense } from "react";

function OrderContent() {
    const params = useSearchParams();
    const router = useRouter();
    const serviceIdx = parseInt(params.get("service") || "0");
    const service = serviceList[serviceIdx] ?? serviceList[0];

    const [step, setStep] = useState<Step>("details");
    const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<PaymentAccount | null>(null);
    const [form, setForm] = useState({ name: "", email: "", amount: String(service.minPrice), notes: "" });
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const fileInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const supabase = getSupabase();
        supabase.from("payment_accounts").select("*").eq("is_active", true).then(({ data }) => {
            if (data) setPaymentAccounts(data);
        });
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setReceiptFile(file);
        setReceiptPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        if (!receiptFile) { setError("يرجى رفع إشعار الدفع"); return; }
        if (!form.name || !form.email) { setError("يرجى استكمال بياناتك"); return; }
        setLoading(true);
        setError("");

        const supabase = getSupabase();
        let screenshotUrl = "";

        // Upload receipt to Supabase Storage (bucket: receipts)
        const filename = `${Date.now()}_${receiptFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("receipts")
            .upload(filename, receiptFile, { upsert: false });

        if (uploadError) {
            // If storage bucket doesn't exist yet, fall back to base64 note
            screenshotUrl = `[ملف: ${receiptFile.name}]`;
        } else {
            const { data: urlData } = supabase.storage.from("receipts").getPublicUrl(uploadData.path);
            screenshotUrl = urlData.publicUrl;
        }

        // Insert verification request
        const { error: insertError } = await supabase.from("payment_verifications").insert({
            student_name: form.name,
            student_email: form.email,
            amount: parseFloat(form.amount),
            method: selectedMethod ? `${selectedMethod.label} (${selectedMethod.account_number})` : "غير محدد",
            screenshot_url: screenshotUrl,
            notes: `الخدمة: ${service.title}${form.notes ? `\nملاحظات: ${form.notes}` : ""}`,
            status: "pending",
        });

        setLoading(false);
        if (insertError) {
            setError("حدث خطأ أثناء الإرسال، يرجى المحاولة مجدداً");
        } else {
            setStep("success");
        }
    };

    if (step === "success") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-28">
                <div className="bg-white rounded-3xl border border-[rgba(24,28,32,0.1)] p-10 max-w-md w-full text-center shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-9 h-9 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-3">تم الإرسال بنجاح!</h1>
                    <p className="text-foreground mb-6 leading-relaxed">
                        استلمنا طلبك وسنراجع إشعار الدفع خلال 24 ساعة. سنتواصل معك على <strong>{form.email}</strong> لتأكيد الطلب وبدء العمل.
                    </p>
                    <div className="bg-background rounded-2xl p-4 mb-6 text-right">
                        <p className="font-bold text-foreground text-sm mb-1">تفاصيل الطلب:</p>
                        <p className="text-sm text-foreground">الخدمة: {service.title}</p>
                        <p className="text-sm text-foreground">المبلغ: {form.amount}₪</p>
                    </div>
                    <Link href="/services" className="btn-primary w-full justify-center">
                        العودة للخدمات
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    const steps = [
        { key: "details", label: "التفاصيل" },
        { key: "payment", label: "الدفع" },
        { key: "upload", label: "رفع الإشعار" },
    ];
    const currentIdx = steps.findIndex(s => s.key === step);

    return (
        <div className="min-h-screen bg-background pt-24 pb-16 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Back */}
                <Link href="/services" className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary mb-6 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    العودة للخدمات
                </Link>

                {/* Progress */}
                <div className="flex items-center gap-3 mb-8">
                    {steps.map((s, i) => (
                        <div key={s.key} className="flex items-center gap-3 flex-1">
                            <div className={`flex items-center gap-2 ${i <= currentIdx ? "text-primary" : "text-foreground/40"}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${i < currentIdx ? "bg-primary border-primary text-white" : i === currentIdx ? "border-primary text-primary" : "border-[rgba(24,28,32,0.1)] text-foreground/40"}`}>
                                    {i < currentIdx ? <Check className="w-3.5 h-3.5" /> : i + 1}
                                </div>
                                <span className="text-xs font-medium hidden sm:block">{s.label}</span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 ${i < currentIdx ? "bg-primary" : "bg-[rgba(24,28,32,0.1)]"}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl border border-[rgba(24,28,32,0.1)] shadow-sm overflow-hidden">

                    {/* Step 1: Details */}
                    {step === "details" && (
                        <div>
                            <div className={`h-2 w-full bg-gradient-to-l ${service.color}`} />
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                                        <service.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-foreground">{service.title}</h1>
                                        <p className="text-primary font-bold text-lg">{service.price}</p>
                                    </div>
                                </div>
                                <p className="text-foreground leading-relaxed mb-6">{service.description}</p>
                                <div className="bg-background rounded-2xl p-5 mb-6">
                                    <p className="font-bold text-foreground mb-3 text-sm">ما يشمله:</p>
                                    <ul className="space-y-2">
                                        {service.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                                                <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Check className="w-3 h-3 text-primary" />
                                                </div>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Name & Email */}
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">اسمك الكامل</label>
                                        <input className="input" placeholder="أدخل اسمك الكامل" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">بريدك الإلكتروني</label>
                                        <input className="input" type="email" dir="ltr" placeholder="example@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">ملاحظات إضافية (اختياري)</label>
                                        <textarea className="input" rows={3} placeholder="أي تفاصيل إضافية عن طلبك..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                                    </div>
                                </div>
                                <button
                                    onClick={() => { if (!form.name || !form.email) { setError("يرجى تعبئة الاسم والبريد الإلكتروني"); return; } setError(""); setStep("payment"); }}
                                    className="btn-primary w-full justify-center"
                                >
                                    التالي: اختر طريقة الدفع
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Payment */}
                    {step === "payment" && (
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-foreground mb-2">اختر طريقة الدفع</h2>
                            <p className="text-foreground text-sm mb-6">ادفع المبلغ عبر إحدى الطرق التالية، ثم ارفع إشعار الدفع في الخطوة التالية.</p>

                            {/* Amount */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-foreground mb-1.5">المبلغ (₪)</label>
                                <input className="input" type="number" dir="ltr" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                                <p className="text-xs text-foreground mt-1">السعر: {service.price}</p>
                            </div>

                            {/* Payment accounts from Supabase */}
                            {paymentAccounts.length > 0 ? (
                                <div className="space-y-3 mb-6">
                                    {paymentAccounts.map(acc => (
                                        <button
                                            key={acc.id}
                                            onClick={() => setSelectedMethod(acc)}
                                            className={`w-full text-right p-4 rounded-2xl border-2 transition-all ${selectedMethod?.id === acc.id ? "border-primary bg-primary/5" : "border-[rgba(24,28,32,0.1)] hover:border-primary/50"}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${acc.type === "palpay" ? "bg-blue-100" : "bg-green-100"}`}>
                                                    {acc.type === "palpay" ? <CreditCard className="w-5 h-5 text-blue-600" /> : <Building className="w-5 h-5 text-green-600" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-foreground text-sm">{acc.label}</p>
                                                    <p className="text-foreground text-xs mt-0.5" dir="ltr">{acc.account_number}</p>
                                                    {acc.holder_name && <p className="text-foreground text-xs">{acc.holder_name}</p>}
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selectedMethod?.id === acc.id ? "border-primary bg-primary" : "border-[rgba(24,28,32,0.1)]"}`}>
                                                    {selectedMethod?.id === acc.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-background rounded-2xl p-5 mb-6 text-center">
                                    <Banknote className="w-8 h-8 text-primary mx-auto mb-2" />
                                    <p className="text-foreground text-sm font-medium">PalPay / تحويل بنكي عبر بنك فلسطين</p>
                                    <p className="text-foreground text-xs mt-1">سيتم إرسال تفاصيل حساب الدفع عبر البريد الإلكتروني بعد تأكيد الطلب</p>
                                </div>
                            )}

                            {selectedMethod && (
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                                    <p className="text-amber-800 text-sm font-medium">📋 خطوات الدفع:</p>
                                    <ol className="text-amber-700 text-sm mt-2 space-y-1 list-decimal list-inside">
                                        <li>افتح تطبيق {selectedMethod.type === "palpay" ? "PalPay" : "تطبيق بنك فلسطين"}</li>
                                        <li>أرسل {form.amount}₪ إلى رقم: <span dir="ltr" className="font-mono font-bold">{selectedMethod.account_number}</span></li>
                                        {selectedMethod.holder_name && <li>اسم المستفيد: {selectedMethod.holder_name}</li>}
                                        <li>احفظ صورة إشعار الدفع</li>
                                    </ol>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button onClick={() => setStep("details")} className="btn-secondary flex-1 justify-center">رجوع</button>
                                <button
                                    onClick={() => { if (paymentAccounts.length > 0 && !selectedMethod) { setError("يرجى اختيار طريقة الدفع"); return; } setError(""); setStep("upload"); }}
                                    className="btn-primary flex-1 justify-center"
                                >
                                    التالي: رفع الإشعار
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                            </div>
                            {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}
                        </div>
                    )}

                    {/* Step 3: Upload receipt */}
                    {step === "upload" && (
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-foreground mb-2">رفع إشعار الدفع</h2>
                            <p className="text-foreground text-sm mb-6">ارفع صورة واضحة لإشعار الدفع (لقطة شاشة أو صورة) لتأكيد طلبك.</p>

                            {/* Summary */}
                            <div className="bg-background rounded-2xl p-4 mb-6 text-sm space-y-1">
                                <div className="flex justify-between"><span className="text-foreground">الخدمة:</span><span className="font-bold text-foreground">{service.title}</span></div>
                                <div className="flex justify-between"><span className="text-foreground">المبلغ:</span><span className="font-bold text-primary">{form.amount}₪</span></div>
                                {selectedMethod && <div className="flex justify-between"><span className="text-foreground">طريقة الدفع:</span><span className="font-bold text-foreground">{selectedMethod.label}</span></div>}
                            </div>

                            {/* Upload area */}
                            <div
                                onClick={() => fileInput.current?.click()}
                                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 ${receiptFile ? "border-primary bg-primary/5" : "border-[rgba(24,28,32,0.1)] hover:border-primary/50 hover:bg-background"}`}
                            >
                                <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                {receiptPreview ? (
                                    <div className="relative">
                                        <img src={receiptPreview} alt="إشعار الدفع" className="max-h-48 mx-auto rounded-xl object-contain" />
                                        <button
                                            onClick={e => { e.stopPropagation(); setReceiptFile(null); setReceiptPreview(null); }}
                                            className="absolute top-2 left-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <p className="text-primary text-sm font-medium mt-3">✓ {receiptFile?.name}</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                            <Upload className="w-7 h-7 text-primary" />
                                        </div>
                                        <p className="font-semibold text-foreground mb-1">اضغط لرفع إشعار الدفع</p>
                                        <p className="text-foreground text-sm">PNG, JPG, JPEG — بحد أقصى 10MB</p>
                                    </>
                                )}
                            </div>

                            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                            <div className="flex gap-3">
                                <button onClick={() => setStep("payment")} className="btn-secondary flex-1 justify-center">رجوع</button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="btn-primary flex-1 justify-center"
                                >
                                    {loading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" />جاري الإرسال...</>
                                    ) : (
                                        <><CheckCircle2 className="w-4 h-4" />إرسال الطلب</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function OrderPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <OrderContent />
        </Suspense>
    );
}
