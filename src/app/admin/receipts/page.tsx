"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import {
    Clock, CheckCircle2, XCircle, Eye, ExternalLink,
    Loader2, Search, Filter, RefreshCw, ImageIcon
} from "lucide-react";

interface Verification {
    id: string;
    student_name: string;
    student_email: string;
    amount: number;
    method: string;
    screenshot_url: string;
    notes: string;
    status: "pending" | "approved" | "rejected";
    submitted_at: string;
    reviewed_at: string | null;
}

const statusConfig = {
    pending: { label: "قيد المراجعة", color: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
    approved: { label: "مقبول", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2 },
    rejected: { label: "مرفوض", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
};

export default function AdminReceiptsPage() {
    const [items, setItems] = useState<Verification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
    const [search, setSearch] = useState("");
    const [preview, setPreview] = useState<Verification | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);

    const supabase = getSupabase();

    const fetchData = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("payment_verifications")
            .select("*")
            .order("submitted_at", { ascending: false });
        setItems(data ?? []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const updateStatus = async (id: string, status: "approved" | "rejected") => {
        setUpdating(id);
        await supabase
            .from("payment_verifications")
            .update({ status, reviewed_at: new Date().toISOString() })
            .eq("id", id);
        setItems(prev => prev.map(v => v.id === id ? { ...v, status, reviewed_at: new Date().toISOString() } : v));
        if (preview?.id === id) setPreview(prev => prev ? { ...prev, status } : null);
        setUpdating(null);
    };

    const filtered = items.filter(v => {
        const matchStatus = filter === "all" || v.status === filter;
        const matchSearch = !search ||
            v.student_name?.toLowerCase().includes(search.toLowerCase()) ||
            v.student_email?.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const counts = {
        all: items.length,
        pending: items.filter(v => v.status === "pending").length,
        approved: items.filter(v => v.status === "approved").length,
        rejected: items.filter(v => v.status === "rejected").length,
    };

    const formatDate = (d: string) =>
        new Date(d).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" });

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">إشعارات الدفع</h1>
                    <p className="text-foreground text-sm mt-1">مراجعة وتأكيد طلبات الدفع المُرسلة من الطلاب</p>
                </div>
                <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[rgba(24,28,32,0.1)] text-sm hover:bg-background transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    تحديث
                </button>
            </div>

            {/* Status tabs */}
            <div className="flex gap-2 mb-5 flex-wrap">
                {(["all", "pending", "approved", "rejected"] as const).map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${filter === s ? "bg-primary text-white border-primary" : "bg-white text-foreground border-[rgba(24,28,32,0.1)] hover:border-primary/50"}`}
                    >
                        {s === "all" && `الكل (${counts.all})`}
                        {s === "pending" && `قيد المراجعة (${counts.pending})`}
                        {s === "approved" && `مقبول (${counts.approved})`}
                        {s === "rejected" && `مرفوض (${counts.rejected})`}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative mb-5">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
                <input
                    className="input pr-9"
                    placeholder="بحث باسم أو بريد الطالب..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-[rgba(24,28,32,0.1)]">
                    <Filter className="w-10 h-10 text-[rgba(24,28,32,0.1)] mx-auto mb-3" />
                    <p className="text-foreground">لا توجد نتائج</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(item => {
                        const st = statusConfig[item.status];
                        const Icon = st.icon;
                        return (
                            <div key={item.id} className="bg-white rounded-2xl border border-[rgba(24,28,32,0.1)] p-5 hover:border-primary/30 transition-all">
                                <div className="flex items-start gap-4">
                                    {/* Receipt thumbnail */}
                                    <button
                                        onClick={() => setPreview(item)}
                                        className="w-16 h-16 rounded-xl border-2 border-[rgba(24,28,32,0.1)] overflow-hidden flex-shrink-0 hover:border-primary transition-colors bg-background flex items-center justify-center group"
                                    >
                                        {item.screenshot_url && item.screenshot_url.startsWith("http") ? (
                                            <img src={item.screenshot_url} alt="إشعار" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                                        )}
                                    </button>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 flex-wrap">
                                            <div>
                                                <p className="font-bold text-foreground">{item.student_name || "—"}</p>
                                                <p className="text-sm text-foreground" dir="ltr">{item.student_email}</p>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${st.color}`}>
                                                <Icon className="w-3.5 h-3.5" />
                                                {st.label}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-foreground">
                                            <span>💰 <strong>{item.amount}₪</strong></span>
                                            <span>🏦 {item.method}</span>
                                            <span>📅 {formatDate(item.submitted_at)}</span>
                                        </div>
                                        {item.notes && (
                                            <p className="text-xs text-foreground mt-1.5 bg-background rounded-lg px-3 py-1.5">{item.notes}</p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => setPreview(item)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(24,28,32,0.1)] text-xs hover:bg-background transition-colors"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            عرض
                                        </button>
                                        {item.status === "pending" && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(item.id, "approved")}
                                                    disabled={updating === item.id}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-foreground text-xs hover:bg-green-700 transition-colors disabled:opacity-60"
                                                >
                                                    {updating === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                                    قبول
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(item.id, "rejected")}
                                                    disabled={updating === item.id}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-foreground text-xs hover:bg-red-600 transition-colors disabled:opacity-60"
                                                >
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    رفض
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Receipt Preview Modal */}
            {preview && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setPreview(null)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-5 border-b border-[rgba(24,28,32,0.1)]">
                            <div>
                                <p className="font-bold text-foreground">{preview.student_name}</p>
                                <p className="text-sm text-foreground">{preview.student_email}</p>
                            </div>
                            <button onClick={() => setPreview(null)} className="p-2 rounded-xl hover:bg-background transition-colors">
                                <XCircle className="w-5 h-5 text-foreground" />
                            </button>
                        </div>

                        {/* Receipt image */}
                        <div className="p-5">
                            {preview.screenshot_url && preview.screenshot_url.startsWith("http") ? (
                                <div className="relative">
                                    <img
                                        src={preview.screenshot_url}
                                        alt="إشعار الدفع"
                                        className="w-full max-h-80 object-contain rounded-2xl border border-[rgba(24,28,32,0.1)] bg-background"
                                    />
                                    <a
                                        href={preview.screenshot_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute top-2 left-2 p-2 bg-white/90 rounded-lg hover:bg-white transition-colors shadow"
                                    >
                                        <ExternalLink className="w-4 h-4 text-primary" />
                                    </a>
                                </div>
                            ) : (
                                <div className="w-full h-40 bg-background rounded-2xl flex flex-col items-center justify-center">
                                    <ImageIcon className="w-10 h-10 text-primary mb-2" />
                                    <p className="text-sm text-foreground">{preview.screenshot_url || "لا توجد صورة"}</p>
                                </div>
                            )}

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                                <div className="bg-background rounded-xl p-3">
                                    <p className="text-foreground text-xs mb-1">المبلغ</p>
                                    <p className="font-bold text-primary">{preview.amount}₪</p>
                                </div>
                                <div className="bg-background rounded-xl p-3">
                                    <p className="text-foreground text-xs mb-1">طريقة الدفع</p>
                                    <p className="font-bold text-foreground text-xs">{preview.method}</p>
                                </div>
                            </div>
                            {preview.notes && (
                                <div className="bg-background rounded-xl p-3 mt-3 text-sm">
                                    <p className="text-foreground text-xs mb-1">الملاحظات</p>
                                    <p className="text-foreground">{preview.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Modal actions */}
                        {preview.status === "pending" && (
                            <div className="flex gap-3 p-5 pt-0">
                                <button
                                    onClick={() => updateStatus(preview.id, "rejected")}
                                    disabled={updating === preview.id}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
                                >
                                    <XCircle className="w-4 h-4" /> رفض
                                </button>
                                <button
                                    onClick={() => updateStatus(preview.id, "approved")}
                                    disabled={updating === preview.id}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
                                >
                                    {updating === preview.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    قبول
                                </button>
                            </div>
                        )}
                        {preview.status !== "pending" && (
                            <div className={`mx-5 mb-5 p-3 rounded-xl text-center text-sm font-semibold border ${statusConfig[preview.status].color}`}>
                                {statusConfig[preview.status].label}
                                {preview.reviewed_at && <span className="font-normal text-xs block mt-0.5">{formatDate(preview.reviewed_at)}</span>}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
