"use client";
import { API_BASE_URL } from "@/lib/api-config";
import React, { useState, useEffect } from "react";
import { 
    Save, 
    Loader2, 
    CheckCircle2, 
    AlertCircle, 
    Palette, 
    Globe, 
    Mail, 
    Phone, 
    Info,
    ShieldAlert,
    Image as ImageIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { invalidateHomepageCache } from "@/hooks/useHomepageData";

const API_BASE = API_BASE_URL + "/api/admin";

export default function GeneralSettings() {
    const [formData, setFormData] = useState({
        siteName: "",
        contactEmail: "",
        contactPhone: "",
        siteLogo: "",
        siteFavicon: "",
        maintenanceMode: "off",
        siteColor: "#00875a"
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
            const res = await fetch(`${API_BASE}/settings?group=general`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                const updated = { ...formData };
                data.data.forEach((s: any) => {
                    if (s.key in updated) {
                        (updated as any)[s.key] = s.value;
                    }
                });
                setFormData(updated);
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
            
            const payload: any = {};
            Object.entries(formData).forEach(([key, value]) => {
                payload[key] = { value, group: "general" };
            });

            const res = await fetch(`${API_BASE}/settings/bulk`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ settings: payload })
            });
            const data = await res.json();
            
            if (data.success) {
                setStatus({ type: 'success', msg: 'System Branding & General settings deployed!' });
                invalidateHomepageCache();
                setTimeout(() => setStatus(null), 3000);
            } else {
                throw new Error("Failed to save");
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'Deployment error occurred' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="animate-spin text-[#00875a]" size={48} />
            <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Accessing Core Config...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto py-6">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                        Branding <span className="text-[#00875a]">& General</span>
                    </h1>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-black mt-1">Foundational Site Identity & Logic</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 bg-[#00875a] text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#00875a]/20 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? "Deploying..." : "Publish Changes"}
                </button>
            </header>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Visual Branding */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 bg-white rounded-bl-3xl"><Palette size={64} /></div>
                        <h3 className="text-xs font-black text-[#00875a] uppercase tracking-widest mb-6 border-b border-[#00875a]/20 pb-2">Visual Assets</h3>
                        
                        <div className="space-y-8">
                            <AssetField 
                                label="Primary Logo URL" 
                                value={formData.siteLogo} 
                                onChange={(val: string) => setFormData({...formData, siteLogo: val})} 
                                icon={<ImageIcon size={14} />}
                            />
                            <AssetField 
                                label="Favicon URL" 
                                value={formData.siteFavicon} 
                                onChange={(val: string) => setFormData({...formData, siteFavicon: val})}
                                icon={<Info size={14} />}
                            />
                            
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                                    <Palette size={14} /> Theme Accent Color
                                </label>
                                <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-xl">
                                    <input 
                                        type="color" 
                                        value={formData.siteColor} 
                                        onChange={(e) => setFormData({...formData, siteColor: e.target.value})}
                                        className="w-12 h-10 bg-transparent rounded-lg cursor-pointer"
                                    />
                                    <input 
                                        type="text" 
                                        value={formData.siteColor} 
                                        onChange={(e) => setFormData({...formData, siteColor: e.target.value})}
                                        className="bg-transparent text-sm font-black text-white uppercase outline-none flex-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldAlert className="text-amber-500" size={20} />
                            <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest">Maintenance Control</h3>
                        </div>
                        <p className="text-[10px] text-white/40 mb-6 font-medium italic">"Enable this to lock the frontend and display a maintenance notice."</p>
                        <select 
                            value={formData.maintenanceMode}
                            onChange={(e: any) => setFormData({...formData, maintenanceMode: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-black uppercase tracking-widest outline-none focus:border-amber-500 transition-all"
                        >
                            <option value="off">Operational (Live)</option>
                            <option value="on">Under Maintenance</option>
                        </select>
                    </div>
                </div>

                {/* Right Column: General Info */}
                <div className="lg:col-span-8 bg-white/[0.03] border border-white/5 rounded-3xl p-10">
                    <h3 className="text-xs font-black text-[#00875a] uppercase tracking-widest mb-10 border-b border-[#00875a]/20 pb-2">Operational Data</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="md:col-span-2">
                            <InputField 
                                label="Platform Name" 
                                value={formData.siteName} 
                                onChange={(val: string) => setFormData({...formData, siteName: val})} 
                                placeholder="SPARKIIT Academic Platform" 
                                icon={<Globe size={16} />}
                            />
                        </div>
                        <InputField 
                            label="Support Email Address" 
                            value={formData.contactEmail} 
                            onChange={(val: string) => setFormData({...formData, contactEmail: val})} 
                            placeholder="support@sparkiit.com" 
                            icon={<Mail size={16} />}
                        />
                        <InputField 
                            label="Public Contact Phone" 
                            value={formData.contactPhone} 
                            onChange={(val: string) => setFormData({...formData, contactPhone: val})} 
                            placeholder="+91 88000 00000" 
                            icon={<Phone size={16} />}
                        />
                    </div>

                    <div className="mt-20 p-8 border border-white/5 rounded-2xl bg-white/[0.01]">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2 italic">Pro-Tip for Administrators</p>
                        <p className="text-[11px] text-white/40 font-medium">Use absolute URLs for logo and assets (e.g. https://cdn.sparkiit.com/logo.png) to ensure they render correctly across all pages and email templates.</p>
                    </div>

                    {status && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-8 p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <p className="text-[10px] font-black uppercase tracking-widest">{status.msg}</p>
                        </motion.div>
                    )}
                </div>
            </form>
        </div>
    );
}

function InputField({ label, value, onChange, placeholder, icon }: any) {
    return (
        <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                {icon} {label}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e: any) => onChange(e.target.value)}
                placeholder={placeholder}
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-[#00875a]/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
            />
        </div>
    );
}

function AssetField({ label, value, onChange, icon }: any) {
    const resolvedPreview = value && value.startsWith("/uploads") ? `${API_BASE_URL}${value}` : value;
    return (
        <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                {icon} {label}
            </label>
            <div className="flex flex-col gap-3">
                <input 
                    type="text" 
                    value={value} 
                    onChange={(e: any) => onChange(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[11px] text-white/60 outline-none focus:border-[#00875a]/30 transition-all font-medium"
                    placeholder="https://..."
                />
                <div className="h-16 w-full rounded-xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden">
                    {value ? <img src={resolvedPreview} className="max-h-full max-w-full object-contain p-2" alt="Preview" /> : <p className="text-[8px] font-black text-white/10 uppercase tracking-widest">No Asset Preview</p>}
                </div>
            </div>
        </div>
    );
}

