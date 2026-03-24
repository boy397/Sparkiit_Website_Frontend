"use client";
import { API_BASE_URL } from "@/lib/api-config";
import React, { useState, useEffect } from "react";
import { Search, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const API_BASE = API_BASE_URL + "/api/admin";

export default function SeoSettings() {
    const [formData, setFormData] = useState({
        metaTitle: "",
        metaDescription: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/settings`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                const newFormData = { ...formData };
                data.data.forEach((s: any) => {
                    if (s.key in newFormData) {
                        (newFormData as any)[s.key] = s.value;
                    }
                });
                setFormData(newFormData);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus(null);
        try {
            const token = localStorage.getItem("adminToken");
            const promises = Object.entries(formData).map(([key, value]) => {
                return fetch(`${API_BASE}/settings-upsert`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify({ key, value, group: "seo" })
                }).then(r => r.json());
            });
            await Promise.all(promises);
            setStatus({ type: 'success', msg: 'SEO settings updated' });
            setTimeout(() => setStatus(null), 3000);
        } catch (err) {
            setStatus({ type: 'error', msg: 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin text-[#00875a]" size={32} /></div>;

    return (
        <div className="max-w-4xl mx-auto py-10">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">SEO & <span className="text-[#00875a]">Meta</span></h1>
                <p className="text-white/40 text-sm">Manage site-wide meta information for search engines.</p>
            </div>

            <form onSubmit={handleSave} className="bg-white/[0.03] border border-white/5 rounded-3xl p-10 shadow-2xl">
                <div className="grid grid-cols-1 gap-8">
                    <InputField label="Meta Title" value={formData.metaTitle} onChange={(val: string) => setFormData({...formData, metaTitle: val})} placeholder="SparkIIT - Leading Education Platform" />
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/40">Meta Description</label>
                        <textarea
                            value={formData.metaDescription}
                            onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                            rows={4}
                            placeholder="Enter site description for search engines..."
                            className="bg-white/[0.02] border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:border-[#00875a]/50 transition-all resize-none"
                        />
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-between">
                    {status && (
                        <div className={`flex items-center gap-2 text-sm font-bold ${status.type === 'success' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            {status.msg}
                        </div>
                    )}
                    <div className="flex-1" />
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-[#00875a] text-white px-8 py-3 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function InputField({ label, value, onChange, placeholder }: any) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-white/40">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="bg-white/[0.02] border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:border-[#00875a]/50 transition-all"
            />
        </div>
    );
}
