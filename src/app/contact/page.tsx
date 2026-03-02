"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Check } from "lucide-react";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

    return (
        <div className="min-h-screen pt-24 bg-background">
            <section className="relative py-16">
                <div className="glow-orb glow-orb-primary w-80 h-80 top-0 left-1/3 opacity-10" />
                <div className="section pb-8">
                    <div className="text-center">
                        <span className="badge badge-primary mb-4"><Mail className="w-3 h-3 ml-1" />تواصل معنا</span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">نحن هنا <span className="gradient-text">لمساعدتك</span></h1>
                        <p className="text-muted text-lg max-w-xl mx-auto">لديك سؤال أو تحتاج مساعدة؟ لا تتردد في التواصل معنا</p>
                    </div>
                </div>
            </section>

            <section className="section pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <div className="card"><Mail className="w-7 h-7 text-primary mb-3" /><h3 className="text-foreground font-bold mb-1">البريد الإلكتروني</h3><p className="text-muted text-sm">info@rafeeq.ps</p></div>
                        <div className="card"><Phone className="w-7 h-7 text-primary mb-3" /><h3 className="text-foreground font-bold mb-1">الهاتف</h3><p className="text-muted text-sm" dir="ltr">+970 59 XXX XXXX</p></div>
                        <div className="card"><MessageCircle className="w-7 h-7 text-success mb-3" /><h3 className="text-foreground font-bold mb-1">واتساب</h3><p className="text-muted text-sm mb-3">الطريقة الأسرع للتواصل</p><a href="https://wa.me/970590000000" className="btn-primary text-sm py-2 px-4" target="_blank"><MessageCircle className="w-4 h-4" />أرسل واتساب</a></div>
                        <div className="card"><Clock className="w-7 h-7 text-primary mb-3" /><h3 className="text-foreground font-bold mb-1">ساعات العمل</h3><p className="text-muted text-sm">السبت - الخميس: 9:00 ص - 5:00 م<br />الجمعة: مغلق</p></div>
                        <div className="card"><MapPin className="w-7 h-7 text-primary mb-3" /><h3 className="text-foreground font-bold mb-1">الموقع</h3><p className="text-muted text-sm">غزة، فلسطين</p></div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="card p-8">
                            {submitted ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-6"><Check className="w-10 h-10 text-success" /></div>
                                    <h3 className="text-foreground font-bold text-2xl mb-2">تم إرسال رسالتك بنجاح!</h3>
                                    <p className="text-muted mb-6">سنتواصل معك في أقرب وقت ممكن. شكراً لتواصلك مع رفيق!</p>
                                    <button onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }} className="btn-secondary">إرسال رسالة أخرى</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <h2 className="text-foreground font-bold text-xl mb-6">أرسل لنا رسالة</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <div><label className="text-sm text-foreground font-medium mb-1 block">الاسم الكامل</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="أدخل اسمك" className="input" /></div>
                                        <div><label className="text-sm text-foreground font-medium mb-1 block">البريد الإلكتروني</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="example@email.com" className="input" dir="ltr" /></div>
                                    </div>
                                    <div className="mb-4"><label className="text-sm text-foreground font-medium mb-1 block">الموضوع</label><select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="input" required><option value="">اختر الموضوع</option><option value="scholarship">استفسار عن منحة</option><option value="service">طلب خدمة</option><option value="payment">استفسار عن الدفع</option><option value="technical">مشكلة تقنية</option><option value="other">أخرى</option></select></div>
                                    <div className="mb-6"><label className="text-sm text-foreground font-medium mb-1 block">الرسالة</label><textarea required rows={6} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="اكتب رسالتك هنا..." className="input resize-none" /></div>
                                    <button type="submit" className="btn-primary w-full justify-center"><Send className="w-4 h-4" />إرسال الرسالة</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
