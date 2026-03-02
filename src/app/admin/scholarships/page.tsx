"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Search, Plus, Pencil, Trash2, Star, X, Check } from "lucide-react";

interface Scholarship {
    id: string;
    title_ar: string;
    title_en: string;
    university: string;
    country: string;
    country_flag: string;
    level: string;
    level_ar: string;
    field_ar: string;
    funding_type: string;
    funding_type_ar: string;
    deadline: string;
    description_ar: string;
    description_en: string;
    url: string;
    featured: boolean;
}

const emptyForm = (): Partial<Scholarship> => ({
    title_ar: "", title_en: "", university: "", country: "",
    country_flag: "🌍", level: "master", level_ar: "ماجستير",
    field_ar: "جميع التخصصات", funding_type: "fully-funded",
    funding_type_ar: "ممولة بالكامل", deadline: "", description_ar: "",
    description_en: "", url: "", featured: false,
});

export default function AdminScholarshipsPage() {
    const supabase = getSupabase();
    const [items, setItems] = useState<Scholarship[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<Partial<Scholarship>>(emptyForm());
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("scholarships")
            .select("*")
            .order("created_at", { ascending: false });
        setItems(data ?? []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const openAdd = () => { setForm(emptyForm()); setEditingId(null); setShowModal(true); };
    const openEdit = (s: Scholarship) => { setForm({ ...s }); setEditingId(s.id); setShowModal(true); };

    const handleSave = async () => {
        if (!form.title_ar || !form.title_en) return;
        setSaving(true);
        if (editingId) {
            await supabase.from("scholarships").update(form).eq("id", editingId);
        } else {
            await supabase.from("scholarships").insert([form]);
        }
        await fetchData();
        setShowModal(false);
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذه المنحة؟")) return;
        await supabase.from("scholarships").delete().eq("id", id);
        setItems((prev) => prev.filter((s) => s.id !== id));
    };

    const toggleFeatured = async (id: string, current: boolean) => {
        await supabase.from("scholarships").update({ featured: !current }).eq("id", id);
        setItems((prev) => prev.map((s) => s.id === id ? { ...s, featured: !current } : s));
    };

    const filtered = items.filter((s) =>
        s.title_ar.includes(search) || s.title_en.toLowerCase().includes(search.toLowerCase()) || s.university?.includes(search)
    );

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">إدارة المنح الدراسية</h1>
                    <p className="text-foreground text-sm mt-1">{items.length} منحة مسجلة</p>
                </div>
                <button onClick={openAdd} className="btn-primary text-sm py-2.5 px-5 self-start sm:self-auto">
                    <Plus className="w-4 h-4" /> إضافة منحة
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="ابحث عن منحة..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-[rgba(24,28,32,0.1)] overflow-hidden shadow-sm">
                    {filtered.length === 0 ? (
                        <div className="text-center py-16 text-foreground">
                            <p>لا توجد منح مطابقة.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-background border-b border-[rgba(24,28,32,0.1)]">
                                    <tr>
                                        <th className="text-right px-4 py-3 font-semibold text-foreground">المنحة</th>
                                        <th className="text-right px-4 py-3 font-semibold text-foreground hidden md:table-cell">الدولة</th>
                                        <th className="text-right px-4 py-3 font-semibold text-foreground hidden lg:table-cell">الموعد النهائي</th>
                                        <th className="text-center px-4 py-3 font-semibold text-foreground">مميزة</th>
                                        <th className="text-center px-4 py-3 font-semibold text-foreground">إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F0EAE0]">
                                    {filtered.map((s) => (
                                        <tr key={s.id} className="hover:bg-surface-hover transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-foreground">{s.title_ar}</p>
                                                <p className="text-foreground text-xs">{s.university}</p>
                                            </td>
                                            <td className="px-4 py-3 text-[#5A5248] hidden md:table-cell">
                                                {s.country_flag} {s.country}
                                            </td>
                                            <td className="px-4 py-3 text-[#5A5248] hidden lg:table-cell">
                                                {s.deadline ?? "—"}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button onClick={() => toggleFeatured(s.id, s.featured)}
                                                    className={`p-1.5 rounded-lg transition-colors ${s.featured ? "text-primary bg-primary/10" : "text-[#C9B89A] hover:text-primary"}`}>
                                                    <Star className="w-4 h-4" fill={s.featured ? "currentColor" : "none"} />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => openEdit(s)}
                                                        className="p-1.5 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(s.id)}
                                                        className="p-1.5 text-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-[rgba(24,28,32,0.1)]">
                        <div className="flex items-center justify-between p-6 border-b border-[rgba(24,28,32,0.1)]">
                            <h2 className="text-lg font-bold text-foreground">{editingId ? "تعديل المنحة" : "إضافة منحة جديدة"}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-background rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 space-y-4">
                            {[
                                { label: "عنوان المنحة (عربي)", key: "title_ar", dir: "rtl" },
                                { label: "عنوان المنحة (إنجليزي)", key: "title_en", dir: "ltr" },
                                { label: "الجامعة / المنظمة", key: "university", dir: "rtl" },
                                { label: "الدولة", key: "country", dir: "rtl" },
                                { label: "العلم (إيموجي)", key: "country_flag", dir: "ltr" },
                                { label: "الموعد النهائي (مثال: 2026-11-01)", key: "deadline", dir: "ltr" },
                                { label: "رابط التقديم", key: "url", dir: "ltr" },
                            ].map(({ label, key, dir }) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
                                    <input
                                        type="text"
                                        dir={dir}
                                        value={(form as Record<string, unknown>)[key] as string || ""}
                                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                                        className="input"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">وصف عربي</label>
                                <textarea
                                    dir="rtl"
                                    value={form.description_ar || ""}
                                    onChange={(e) => setForm((f) => ({ ...f, description_ar: e.target.value }))}
                                    className="input"
                                    rows={3}
                                />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={form.featured ?? false}
                                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                                    className="w-4 h-4 accent-[#4d94cf]"
                                />
                                <span className="text-sm font-medium text-foreground">منحة مميزة (تظهر في الصفحة الرئيسية)</span>
                            </label>
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
