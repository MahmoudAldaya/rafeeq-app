"use client";

import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { Save, Facebook, Instagram, Linkedin, Send, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [settings, setSettings] = useState({
        facebook_url: "",
        instagram_url: "",
        linkedin_url: "",
        telegram_url: "",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from("site_settings")
                .select("*")
                .eq("id", 1)
                .single();

            if (error) {
                // Ignore if rows don't exist yet (migration might not be run)
                console.error("Settings fetch error:", error);
            } else if (data) {
                setSettings({
                    facebook_url: data.facebook_url || "",
                    instagram_url: data.instagram_url || "",
                    linkedin_url: data.linkedin_url || "",
                    telegram_url: data.telegram_url || "",
                });
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const supabase = getSupabase();

            // Update the existing data (id 1)
            const { error } = await supabase
                .from("site_settings")
                .update({
                    facebook_url: settings.facebook_url,
                    instagram_url: settings.instagram_url,
                    linkedin_url: settings.linkedin_url,
                    telegram_url: settings.telegram_url,
                    updated_at: new Date().toISOString()
                })
                .eq("id", 1);

            if (error) throw error;

            setMessage({ type: "success", text: "تم حفظ الإعدادات بنجاح!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error: any) {
            console.error("Save settings error:", error);
            setMessage({ type: "error", text: "حدث خطأ أثناء الحفظ. تأكد من تشغيل ملف التهيئة (SQL Migration)." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl" dir="rtl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">إعدادات الموقع</h1>
                    <p className="text-muted text-sm mt-1">تعديل الروابط ومعلومات التواصل الخاصة بالموقع.</p>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                <div className="card p-6 border border-[rgba(24,28,32,0.08)] bg-white">
                    <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                        <span>روابط وسائل التواصل الاجتماعي</span>
                    </h2>

                    <div className="space-y-5">
                        {/* Facebook */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
                                <Facebook className="w-4 h-4 text-primary" />
                                رابط فيسبوك (Facebook)
                            </label>
                            <input
                                type="url"
                                dir="ltr"
                                placeholder="https://facebook.com/..."
                                className="input"
                                value={settings.facebook_url}
                                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                            />
                        </div>

                        {/* Instagram */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
                                <Instagram className="w-4 h-4 text-pink-600" />
                                رابط انستغرام (Instagram)
                            </label>
                            <input
                                type="url"
                                dir="ltr"
                                placeholder="https://instagram.com/..."
                                className="input"
                                value={settings.instagram_url}
                                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                            />
                        </div>

                        {/* LinkedIn */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
                                <Linkedin className="w-4 h-4 text-blue-700" />
                                رابط لينكد إن (LinkedIn)
                            </label>
                            <input
                                type="url"
                                dir="ltr"
                                placeholder="https://linkedin.com/..."
                                className="input"
                                value={settings.linkedin_url}
                                onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                            />
                        </div>

                        {/* Telegram */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
                                <Send className="w-4 h-4 text-sky-500" />
                                رابط تيليجرام (Telegram)
                            </label>
                            <input
                                type="url"
                                dir="ltr"
                                placeholder="https://t.me/..."
                                className="input"
                                value={settings.telegram_url}
                                onChange={(e) => setSettings({ ...settings, telegram_url: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary"
                    >
                        {saving ? (
                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> جاري الحفظ...</>
                        ) : (
                            <><Save className="w-4 h-4" /> حفظ التغييرات</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
