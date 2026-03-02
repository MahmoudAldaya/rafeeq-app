"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Pencil, Plus, X, Check, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

interface Service {
    id: string;
    name_ar: string;
    name_en: string;
    price: number;
    currency: string;
    description_ar: string;
    features: string[];
    is_active: boolean;
    is_featured: boolean;
    sort_order: number;
}

const emptyService = (): Partial<Service> => ({
    name_ar: "", name_en: "", price: 0, currency: "ILS",
    description_ar: "", features: [], is_active: true, is_featured: false, sort_order: 0,
});

export default function AdminServicesPage() {
    const supabase = getSupabase();
    const [items, setItems] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<Partial<Service>>(emptyService());
    const [featureInput, setFeatureInput] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await supabase.from("services").select("*").order("sort_order");
        setItems(data ?? []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const openAdd = () => { setForm(emptyService()); setFeatureInput(""); setEditingId(null); setShowModal(true); };
    const openEdit = (s: Service) => { setForm({ ...s }); setFeatureInput(""); setEditingId(s.id); setShowModal(true); };

    const handleSave = async () => {
        if (!form.name_ar) return;
        setSaving(true);
        if (editingId) {
            await supabase.from("services").update(form).eq("id", editingId);
        } else {
            await supabase.from("services").insert([form]);
        }
        await fetchData();
        setShowModal(false);
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد؟")) return;
        await supabase.from("services").delete().eq("id", id);
        setItems((prev) => prev.filter((s) => s.id !== id));
    };

    const toggleActive = async (id: string, current: boolean) => {
        await supabase.from("services").update({ is_active: !current }).eq("id", id);
        setItems((prev) => prev.map((s) => s.id === id ? { ...s, is_active: !current } : s));
    };

    const addFeature = () => {
        if (!featureInput.trim()) return;
        setForm((f) => ({ ...f, features: [...(f.features ?? []), featureInput.trim()] }));
        setFeatureInput("");
    };
    const removeFeature = (i: number) =>
        setForm((f) => ({ ...f, features: f.features?.filter((_, idx) => idx !== i) }));

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">إدارة الخدمات</h1>
                    <p className="text-foreground text-sm mt-1">{items.length} باقة</p>
                </div>
                <button onClick={openAdd} className="btn-primary text-sm py-2.5 px-5 self-start sm:self-auto">
                    <Plus className="w-4 h-4" /> إضافة باقة
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((s) => (
                        <div key={s.id} className="bg-white rounded-2xl border border-[rgba(24,28,32,0.1)] p-5 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-bold text-foreground">{s.name_ar}</h3>
                                    <p className="text-foreground text-xs">{s.name_en}</p>
                                </div>
                                <span className="text-xl font-bold text-primary">{s.price} ₪</span>
                            </div>
                            {s.description_ar && <p className="text-[#5A5248] text-sm mb-3">{s.description_ar}</p>}
                            {s.features?.length > 0 && (
                                <ul className="space-y-1 mb-4">
                                    {s.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-[#5A5248]">
                                            <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className="flex items-center justify-between pt-3 border-t border-[#F0EAE0]">
                                <button onClick={() => toggleActive(s.id, s.is_active)}
                                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${s.is_active ? "text-green-600" : "text-foreground"}`}>
                                    {s.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                    {s.is_active ? "نشطة" : "معطلة"}
                                </button>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(s)}
                                        className="p-1.5 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(s.id)}
                                        className="p-1.5 text-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-[rgba(24,28,32,0.1)]">
                        <div className="flex items-center justify-between p-6 border-b border-[rgba(24,28,32,0.1)]">
                            <h2 className="text-lg font-bold text-foreground">{editingId ? "تعديل الباقة" : "باقة جديدة"}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-background rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">الاسم (عربي)</label>
                                    <input type="text" value={form.name_ar || ""} onChange={(e) => setForm((f) => ({ ...f, name_ar: e.target.value }))} className="input" dir="rtl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">الاسم (إنجليزي)</label>
                                    <input type="text" value={form.name_en || ""} onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))} className="input" dir="ltr" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">السعر</label>
                                    <input type="number" value={form.price || 0} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} className="input" dir="ltr" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">الترتيب</label>
                                    <input type="number" value={form.sort_order || 0} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} className="input" dir="ltr" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">الوصف</label>
                                <textarea value={form.description_ar || ""} onChange={(e) => setForm((f) => ({ ...f, description_ar: e.target.value }))} className="input" dir="rtl" rows={2} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">المميزات</label>
                                <div className="flex gap-2 mb-2">
                                    <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addFeature()}
                                        placeholder="اضغط Enter للإضافة" className="input flex-1 text-sm" dir="rtl" />
                                    <button onClick={addFeature} className="btn-primary text-sm py-2 px-3"><Plus className="w-4 h-4" /></button>
                                </div>
                                <div className="space-y-1">
                                    {form.features?.map((f, i) => (
                                        <div key={i} className="flex items-center justify-between bg-background rounded-lg px-3 py-1.5 text-sm">
                                            <span>{f}</span>
                                            <button onClick={() => removeFeature(i)} className="text-foreground hover:text-red-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.is_active ?? true} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-[#4d94cf]" />
                                    <span className="text-sm text-foreground">نشطة</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.is_featured ?? false} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 accent-[#4d94cf]" />
                                    <span className="text-sm text-foreground">مميزة</span>
                                </label>
                            </div>
                        </div>
                        <div className="p-6 border-t border-[rgba(24,28,32,0.1)] flex gap-3 justify-end">
                            <button onClick={() => setShowModal(false)} className="btn-secondary text-sm py-2 px-4">إلغاء</button>
                            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                                {saving ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> : <Check className="w-4 h-4" />}
                                {saving ? "جارٍ الحفظ..." : "حفظ"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
