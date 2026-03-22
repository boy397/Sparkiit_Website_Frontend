"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Save, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/admin";


interface ContentItem {
    _id: string;
    section: string;
    key: string;
    value: string;
}

export default function ContentManagement() {
    const [content, setContent] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/content`, {
                headers: { "Authorization": `Bearer ${token}` },
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                setContent(data.data);
            }
        } catch (error) {
            console.error("Error fetching content:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (id: string, value: string) => {
        setContent(prev => prev.map(item => item._id === id ? { ...item, value } : item));
    };

    const saveChanges = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const token = localStorage.getItem("adminToken");
            const updates = content.map(({ section, key, value }) => ({ section, key, value }));
            
            const res = await fetch(`${API_BASE}/content/batch`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ updates })
            });

            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: "Content updated successfully!" });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: data.message || "Failed to update content" });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Server error. Please try again." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-[#00875a]" size={32} />
            </div>
        );
    }

    // Group content by section
    const sections = content.reduce((acc, item) => {
        if (!acc[item.section]) acc[item.section] = [];
        acc[item.section].push(item);
        return acc;
    }, {} as Record<string, ContentItem[]>);

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Home CMS</h2>
                    <p className="text-white/40">Manage your website's static text and sections.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={fetchContent}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all"
                    >
                        <RotateCcw size={18} />
                        Reset
                    </button>
                    <button 
                        onClick={saveChanges}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#00875a] text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>

            {message && (
                <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-[#00875a]/10 border border-[#00875a]/20 text-[#00875a]' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-medium">{message.text}</span>
                </div>
            )}

            <div className="space-y-12 pb-20">
                {Object.entries(sections).map(([sectionName, items]) => (
                    <div key={sectionName} className="bg-white/2 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
                        <div className="bg-white/5 px-8 py-4 border-b border-white/5">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#00875a]">{sectionName} Section</h3>
                        </div>
                        <div className="p-8 space-y-6">
                            {items.map(item => (
                                <div key={item._id} className="space-y-2">
                                    <label className="text-xs font-bold text-white/30 uppercase tracking-widest block">
                                        {item.key.replace(/([A-Z])/g, ' $1')}
                                    </label>
                                    <textarea
                                        value={item.value}
                                        onChange={(e) => handleUpdate(item._id, e.target.value)}
                                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00875a]/40 transition-all resize-none min-h-[44px]"
                                        rows={item.value.length > 100 ? 4 : 1}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
