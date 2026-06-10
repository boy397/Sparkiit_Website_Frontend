"use client";
import { API_BASE_URL } from "@/lib/api-config";
import React, { useState, useEffect } from "react";
import { Layout, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { invalidateHomepageCache } from "@/hooks/useHomepageData";

const API_BASE = API_BASE_URL + "/api/admin";

export default function FooterSettings() {
    const [formData, setFormData] = useState({
        footerCopyright: "",
        footerTagline: "",
        footerLogoUrl: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("uploadType", "footer");
        formData.append("image", file);

        const token = localStorage.getItem("adminToken");

        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/upload-image`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
            const json = await res.json();
            if (json.success) {
                setFormData(prev => ({ ...prev, footerLogoUrl: json.data.url }));
            } else {
                throw new Error(json.message || "Upload failed");
            }
        } catch (err) {
            console.warn("Logo server upload failed, falling back to Base64:", err);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({ ...prev, footerLogoUrl: base64String }));
            };
            reader.readAsDataURL(file);
        } finally {
            setUploading(false);
        }
    };

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
                    body: JSON.stringify({ key, value, group: "footer" })
                }).then(r => r.json());
            });
            await Promise.all(promises);
            setStatus({ type: 'success', msg: 'Footer settings updated' });
            invalidateHomepageCache();
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
                <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Footer <span className="text-[#00875a]">Settings</span></h1>
                <p className="text-white/40 text-sm">Manage your site copyright and footer branding.</p>
            </div>

            <form onSubmit={handleSave} className="bg-white/[0.03] border border-white/5 rounded-3xl p-10 shadow-2xl">
                <div className="grid grid-cols-1 gap-8">
                    <InputField label="Copyright Text" value={formData.footerCopyright} onChange={(val: string) => setFormData({...formData, footerCopyright: val})} placeholder="© 2026 SPARKIIT. All Rights Reserved." />
                    <InputField label="Footer Tagline" value={formData.footerTagline} onChange={(val: string) => setFormData({...formData, footerTagline: val})} placeholder="Building the next generation of innovators." />
                    <InputField label="Footer Logo URL" value={formData.footerLogoUrl} onChange={(val: string) => setFormData({...formData, footerLogoUrl: val})} placeholder="/assets/footer-logo.png" />
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/40">Upload Logo</label>
                        <div className="flex items-center gap-4">
                            <label className="flex-1 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all rounded-xl p-4 text-center text-sm text-white/80 hover:text-white font-medium flex items-center justify-center gap-2">
                                {uploading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 text-white/60 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        Upload Logo File
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleLogoUpload}
                                    disabled={uploading}
                                />
                            </label>
                            {formData.footerLogoUrl && (
                                <div className="w-16 h-16 rounded-xl bg-white/10 p-2 flex items-center justify-center border border-white/10 shrink-0">
                                    <img 
                                        src={formData.footerLogoUrl.startsWith("/uploads") ? `${API_BASE_URL}${formData.footerLogoUrl}` : formData.footerLogoUrl} 
                                        alt="Preview" 
                                        className="w-full h-full object-contain" 
                                    />
                                </div>
                            )}
                        </div>
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
