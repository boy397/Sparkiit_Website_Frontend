"use client";

import React, { useState, useEffect } from "react";
import { 
    Save, 
    RefreshCw, 
    Eye, 
    EyeOff, 
    ChevronUp, 
    ChevronDown, 
    GripVertical,
    CheckCircle2,
    AlertCircle,
    Layout
} from "lucide-react";
import { motion, Reorder } from "framer-motion";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/admin";

interface Section {
    name: string;
    enabled: boolean;
    order: number;
}

interface PageData {
    _id: string;
    name: string;
    sections: Section[];
}

export default function PageBuilder() {
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetchPageData();
    }, []);

    const fetchPageData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/pages`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                const home = data.data.find((p: any) => p.name === "Home");
                if (home) {
                    // Sort sections by order
                    home.sections.sort((a: Section, b: Section) => a.order - b.order);
                    setPageData(home);
                }
            }
        } catch (error) {
            console.error("Error fetching page data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!pageData) return;
        setSaving(true);
        setMessage(null);
        try {
            const token = localStorage.getItem("adminToken");
            // Update order based on current list position
            const updatedSections = pageData.sections.map((s, idx) => ({
                ...s,
                order: idx + 1
            }));

            const res = await fetch(`${API_BASE}/pages/${pageData._id}`, {
                method: "PUT",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sections: updatedSections
                })
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: "success", text: "Page layout saved successfully!" });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: "error", text: data.message || "Failed to save layout" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Server error occurred" });
        } finally {
            setSaving(false);
        }
    };

    const toggleSection = (index: number) => {
        if (!pageData) return;
        const newSections = [...pageData.sections];
        newSections[index].enabled = !newSections[index].enabled;
        setPageData({ ...pageData, sections: newSections });
    };

    const moveSection = (index: number, direction: "up" | "down") => {
        if (!pageData) return;
        const newSections = [...pageData.sections];
        const newPos = direction === "up" ? index - 1 : index + 1;
        
        if (newPos < 0 || newPos >= newSections.length) return;
        
        [newSections[index], newSections[newPos]] = [newSections[newPos], newSections[index]];
        
        setPageData({ ...pageData, sections: newSections });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="animate-spin text-[#00875a]" size={32} />
            </div>
        );
    }

    if (!pageData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-white/40">
                <AlertCircle size={48} className="mb-4" />
                <p>Home page configuration not found. Please run seed script or create "Home" page.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                        Page <span className="text-[#00875a]">Builder</span>
                    </h1>
                    <p className="text-white/40 text-sm uppercase tracking-widest font-medium">
                        Manage home page section visibility and order
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#00875a] hover:bg-[#00c978] disabled:opacity-50 text-black font-black px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-sm"
                >
                    {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? "Saving..." : "Save Layout"}
                </button>
            </header>

            {message && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${
                        message.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"
                    }`}
                >
                    {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <p className="text-sm font-bold uppercase tracking-widest">{message.text}</p>
                </motion.div>
            )}

            <div className="space-y-3">
                {pageData.sections.map((section, index) => (
                    <motion.div
                        key={section.name}
                        layout
                        className={`group bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-all ${!section.enabled ? "opacity-50 grayscale" : "hover:border-[#00875a]/30 hover:bg-white/[0.07]"}`}
                    >
                        <div className="flex flex-col gap-1">
                            <button 
                                onClick={() => moveSection(index, "up")}
                                disabled={index === 0}
                                className="p-1 hover:text-[#00875a] disabled:opacity-0 transition-colors"
                            >
                                <ChevronUp size={20} />
                            </button>
                            <button 
                                onClick={() => moveSection(index, "down")}
                                disabled={index === pageData.sections.length - 1}
                                className="p-1 hover:text-[#00875a] disabled:opacity-0 transition-colors"
                            >
                                <ChevronDown size={20} />
                            </button>
                        </div>

                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${section.enabled ? "bg-[#00875a]/10 text-[#00875a]" : "bg-white/5 text-white/20"}`}>
                            <Layout size={24} />
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white tracking-tight uppercase">
                                {section.name.replace(/([A-Z])/g, ' $1').trim()}
                            </h3>
                            <p className="text-white/20 text-[10px] uppercase font-bold tracking-[0.2em]">Section ID: {section.name}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => toggleSection(index)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${
                                    section.enabled 
                                    ? "bg-[#00875a]/10 text-[#00875a] border border-[#00875a]/20 hover:bg-[#00875a] hover:text-white" 
                                    : "bg-white/5 text-white/40 border border-white/10 hover:border-white/20 hover:text-white"
                                }`}
                            >
                                {section.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                                {section.enabled ? "Visible" : "Hidden"}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-20 p-8 border-2 border-dashed border-white/5 rounded-3xl text-center opacity-30">
                <p className="text-sm font-bold uppercase tracking-widest text-[#00875a]">More sections coming soon</p>
            </div>
        </div>
    );
}