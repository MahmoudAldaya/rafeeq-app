"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight, CreditCard, Users, Clock } from "lucide-react";

interface PaymentAccount { id: string; type: string; label: string; account_number: string; holder_name: string; is_active: boolean; }
interface CashPartner { id: string; name: string; district: string; phone: string; is_active: boolean; }
interface Verification { id: string; student_name: string; student_email: string; amount: number; method: string; status: string; submitted_at: string; }

type Tab = "accounts" | "partners" | "verifications";

export default function AdminPaymentsPage() {
    const supabase = getSupabase();
    const [tab, setTab] = useState<Tab>("accounts");
    const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
    const [partners, setPartners] = useState<CashPartner[]>([]);
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [accountModal, setAccountModal] = useState(false);
    const [partnerModal, setPartnerModal] = useState(false);
    const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
    const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
    const [accountForm, setAccountForm] = useState<Partial<PaymentAccount>>({ type: "palpay", label: "", account_number: "", holder_name: "", is_active: true });
    const [partnerForm, setPartnerForm] = useState<Partial<CashPartner>>({ name: "", district: "", phone: "", is_active: true });
    const [saving, setSaving] = useState(false);

    const fetchAll = async () => {
        setLoading(true);
        const [a, p, v] = await Promise.all([
            supabase.from("payment_accounts").select("*").order("type"),
            supabase.from("cash_partners").select("*").order("district"),
            supabase.from("payment_verifications").select("*").order("submitted_at", { ascending: false }),
        ]);
        setAccounts(a.data ?? []);
        setPartners(p.data ?? []);
        setVerifications(v.data ?? []);
        setLoading(false);
    };

    useEffect(() => { fetchAll(); }, []);

    // Accounts
    const openAddAccount = () => { setAccountForm({ type: "palpay", label: "", account_number: "", holder_name: "", is_active: true }); setEditingAccountId(null); setAccountModal(true); };
    const openEditAccount = (a: PaymentAccount) => { setAccountForm({ ...a }); setEditingAccountId(a.id); setAccountModal(true); };
    const saveAccount = async () => {
        setSaving(true);
        if (editingAccountId) { await supabase.from("payment_accounts").update(accountForm).eq("id", editingAccountId); }
        else { await supabase.from("payment_accounts").insert([accountForm]); }
        await fetchAll(); setAccountModal(false); setSaving(false);
    };
    const deleteAccount = async (id: string) => {
        if (!confirm("حذف؟")) return;
        await supabase.from("payment_accounts").delete().eq("id", id);
        setAccounts((prev) => prev.filter((a) => a.id !== id));
    };
    const toggleAccount = async (id: string, curr: boolean) => {
        await supabase.from("payment_accounts").update({ is_active: !curr }).eq("id", id);
        setAccounts((prev) => prev.map((a) => a.id === id ? { ...a, is_active: !curr } : a));
    };

    // Partners
    const openAddPartner = () => { setPartnerForm({ name: "", district: "", phone: "", is_active: true }); setEditingPartnerId(null); setPartnerModal(true); };
    const openEditPartner = (p: CashPartner) => { setPartnerForm({ ...p }); setEditingPartnerId(p.id); setPartnerModal(true); };
    const savePartner = async () => {
        setSaving(true);
        if (editingPartnerId) { await supabase.from("cash_partners").update(partnerForm).eq("id", editingPartnerId); }
        else { await supabase.from("cash_partners").insert([partnerForm]); }
        await fetchAll(); setPartnerModal(false); setSaving(false);
    };
    const deletePartner = async (id: string) => {
        if (!confirm("حذف؟")) return;
        await supabase.from("cash_partners").delete().eq("id", id);
        setPartners((prev) => prev.filter((p) => p.id !== id));
    };

    // Verifications
    const updateVerification = async (id: string, status: string) => {
        await supabase.from("payment_verifications").update({ status, reviewed_at: new Date().toISOString() }).eq("id", id);
        setVerifications((prev) => prev.map((v) => v.id === id ? { ...v, status } : v));
    };

    const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
        { id: "accounts", label: "حسابات الدفع", icon: <CreditCard className="w-4 h-4" />, count: accounts.length },
        { id: "partners", label: "شركاء الكاش", icon: <Users className="w-4 h-4" />, count: partners.length },
        { id: "verifications", label: "التحقق", icon: <Clock className="w-4 h-4" />, count: verifications.filter(v => v.status === "pending").length },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">إدارة طرق الدفع</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 border border-[rgba(24,28,32,0.1)] shadow-sm w-fit">
                {tabs.map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.id ? "bg-primary text-white shadow-md" : "text-[#5A5248] hover:bg-background"}`}>
                        {t.icon} {t.label}
                        {t.count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? "bg-white/25 text-white" : "bg-background text-foreground"}`}>{t.count}</span>}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* ACCOUNTS TAB */}
                    {tab === "accounts" && (
                        <div>
                            <div className="flex justify-end mb-4">
                                <button onClick={openAddAccount} className="btn-primary text-sm py-2 px-4"><Plus className="w-4 h-4" /> إضافة حساب</button>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                {accounts.map((a) => (
                                    <div key={a.id} className="bg-white rounded-2xl border border-[rgba(24,28,32,0.1)] p-5 shadow-sm">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.type === "palpay" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                                                    {a.type === "palpay" ? "PalPay" : "بنك"}
                                                </span>
                                                <h3 className="font-bold text-foreground mt-2">{a.label}</h3>
                                            </div>
                                            <button onClick={() => toggleAccount(a.id, a.is_active)} className={`${a.is_active ? "text-green-500" : "text-foreground"}`}>
                                                {a.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                                            </button>
                                        </div>
                                        <p className="text-sm text-[#5A5248]" dir="ltr">{a.account_number}</p>
                                        <p className="text-xs text-foreground">{a.holder_name}</p>
                                        <div className="flex gap-2 mt-3 pt-3 border-t border-[#F0EAE0]">
                                            <button onClick={() => openEditAccount(a)} className="p-1.5 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                                            <button onClick={() => deleteAccount(a.id)} className="p-1.5 text-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PARTNERS TAB */}
                    {tab === "partners" && (
                        <div>
                            <div className="flex justify-end mb-4">
                                <button onClick={openAddPartner} className="btn-primary text-sm py-2 px-4"><Plus className="w-4 h-4" /> إضافة شريك</button>
                            </div>
                            <div className="bg-white rounded-2xl border border-[rgba(24,28,32,0.1)] shadow-sm overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-background border-b border-[rgba(24,28,32,0.1)]">
                                        <tr>
                                            <th className="text-right px-4 py-3 font-semibold text-foreground">الاسم</th>
                                            <th className="text-right px-4 py-3 font-semibold text-foreground">المنطقة</th>
                                            <th className="text-right px-4 py-3 font-semibold text-foreground hidden md:table-cell">الهاتف</th>
                                            <th className="text-center px-4 py-3 font-semibold text-foreground">إجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F0EAE0]">
                                        {partners.map((p) => (
                                            <tr key={p.id} className="hover:bg-surface-hover transition-colors">
                                                <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                                                <td className="px-4 py-3 text-[#5A5248]">{p.district}</td>
                                                <td className="px-4 py-3 text-[#5A5248] hidden md:table-cell" dir="ltr">{p.phone}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button onClick={() => openEditPartner(p)} className="p-1.5 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                                                        <button onClick={() => deletePartner(p.id)} className="p-1.5 text-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* VERIFICATIONS TAB */}
                    {tab === "verifications" && (
                        <div className="bg-white rounded-2xl border border-[rgba(24,28,32,0.1)] shadow-sm overflow-hidden">
                            {verifications.length === 0 ? (
                                <div className="text-center py-16 text-foreground">لا توجد طلبات تحقق بعد.</div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-background border-b border-[rgba(24,28,32,0.1)]">
                                        <tr>
                                            <th className="text-right px-4 py-3 font-semibold text-foreground">الطالب</th>
                                            <th className="text-right px-4 py-3 font-semibold text-foreground hidden md:table-cell">المبلغ</th>
                                            <th className="text-right px-4 py-3 font-semibold text-foreground hidden lg:table-cell">الطريقة</th>
                                            <th className="text-center px-4 py-3 font-semibold text-foreground">الحالة</th>
                                            <th className="text-center px-4 py-3 font-semibold text-foreground">إجراء</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F0EAE0]">
                                        {verifications.map((v) => (
                                            <tr key={v.id} className="hover:bg-surface-hover transition-colors">
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-foreground">{v.student_name}</p>
                                                    <p className="text-xs text-foreground">{v.student_email}</p>
                                                </td>
                                                <td className="px-4 py-3 text-[#5A5248] hidden md:table-cell">{v.amount} ₪</td>
                                                <td className="px-4 py-3 text-[#5A5248] hidden lg:table-cell">{v.method}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${v.status === "approved" ? "bg-green-100 text-green-700" :
                                                            v.status === "rejected" ? "bg-red-100 text-red-700" :
                                                                "bg-amber-100 text-amber-700"
                                                        }`}>
                                                        {v.status === "approved" ? "مقبول" : v.status === "rejected" ? "مرفوض" : "قيد الانتظار"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {v.status === "pending" && (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button onClick={() => updateVerification(v.id, "approved")} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Check className="w-4 h-4" /></button>
                                                            <button onClick={() => updateVerification(v.id, "rejected")} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Account Modal */}
            {accountModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[rgba(24,28,32,0.1)]">
                        <div className="flex items-center justify-between p-6 border-b border-[rgba(24,28,32,0.1)]">
                            <h2 className="text-lg font-bold text-foreground">{editingAccountId ? "تعديل الحساب" : "حساب جديد"}</h2>
                            <button onClick={() => setAccountModal(false)} className="p-2 hover:bg-background rounded-xl"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">النوع</label>
                                <select value={accountForm.type || "palpay"} onChange={(e) => setAccountForm((f) => ({ ...f, type: e.target.value }))} className="input">
                                    <option value="palpay">PalPay</option>
                                    <option value="bank">بنك</option>
                                </select>
                            </div>
                            {[{ l: "التسمية", k: "label" }, { l: "رقم الحساب", k: "account_number" }, { l: "اسم صاحب الحساب", k: "holder_name" }].map(({ l, k }) => (
                                <div key={k}>
                                    <label className="block text-sm font-medium text-foreground mb-1">{l}</label>
                                    <input type="text" value={(accountForm as Record<string, unknown>)[k] as string || ""} onChange={(e) => setAccountForm((f) => ({ ...f, [k]: e.target.value }))} className="input" />
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-t border-[rgba(24,28,32,0.1)] flex gap-3 justify-end">
                            <button onClick={() => setAccountModal(false)} className="btn-secondary text-sm py-2 px-4">إلغاء</button>
                            <button onClick={saveAccount} disabled={saving} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                                {saving ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> : <Check className="w-4 h-4" />}
                                حفظ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Partner Modal */}
            {partnerModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[rgba(24,28,32,0.1)]">
                        <div className="flex items-center justify-between p-6 border-b border-[rgba(24,28,32,0.1)]">
                            <h2 className="text-lg font-bold text-foreground">{editingPartnerId ? "تعديل الشريك" : "شريك جديد"}</h2>
                            <button onClick={() => setPartnerModal(false)} className="p-2 hover:bg-background rounded-xl"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            {[{ l: "الاسم", k: "name" }, { l: "المنطقة / المحافظة", k: "district" }, { l: "رقم الهاتف", k: "phone" }].map(({ l, k }) => (
                                <div key={k}>
                                    <label className="block text-sm font-medium text-foreground mb-1">{l}</label>
                                    <input type="text" value={(partnerForm as Record<string, unknown>)[k] as string || ""} onChange={(e) => setPartnerForm((f) => ({ ...f, [k]: e.target.value }))} className="input" />
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-t border-[rgba(24,28,32,0.1)] flex gap-3 justify-end">
                            <button onClick={() => setPartnerModal(false)} className="btn-secondary text-sm py-2 px-4">إلغاء</button>
                            <button onClick={savePartner} disabled={saving} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                                {saving ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> : <Check className="w-4 h-4" />}
                                حفظ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
