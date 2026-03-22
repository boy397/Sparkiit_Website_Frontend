"use client";

import React, { useState, useEffect } from "react";
import { Star, Save, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/admin";


export default function SectionsManager() {
    const [rating, setRating] = useState("5.0");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetchRating();
    }, []);

    const fetchRating = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/content`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                const reviewContent = data.data.find((c: any) => c.section === "review" && c.key === "rating");
                if (reviewContent) {
                    setRating(reviewContent.value);
                }
            }
        } catch (error) {
            console.error("Error fetching rating:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/content`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    section: "review",
                    key: "rating",
                    value: rating
                })
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: "success", text: "Rating updated successfully!" });
            } else {
                setMessage({ type: "error", text: data.message || "Failed to update rating" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Server error occurred" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="animate-spin text-[#00875a]" size={32} />
            </div>
        );
    }

    const numericRating = parseFloat(rating);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                    Website <span className="text-[#00875a]">Sections</span>
                </h1>
                <p className="text-white/40 text-sm uppercase tracking-widest font-medium">
                    Manage dynamic content across the homepage
                </p>
            </header>

            <div className="grid gap-8">
                {/* Review Section Config */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Star size={120} fill="currentColor" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-[#00875a]/10 rounded-xl flex items-center justify-center text-[#00875a]">
                                <Star size={24} fill="#00875a" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Review Section</h2>
                                <p className="text-white/40 text-xs uppercase tracking-widest">Adjust the platform rating stars</p>
                            </div>
                        </div>

                        <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                            <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-4">
                                Platform Rating: <span className="text-[#00875a] text-lg ml-2 font-black">{numericRating.toFixed(1)}</span> / 5.0
                            </label>
                            
                            <input 
                                type="range" 
                                min="0" 
                                max="5" 
                                step="0.1" 
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00875a] mb-8"
                            />

                            <div className="flex gap-2 justify-center mb-8">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i}
                                        size={32}
                                        fill={i < Math.floor(numericRating) ? "#00875a" : "transparent"}
                                        color={i < Math.floor(numericRating) ? "#00875a" : "rgba(255,255,255,0.1)"}
                                        className={i < Math.floor(numericRating) ? "drop-shadow-[0_0_10px_rgba(0,135,90,0.3)]" : ""}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full bg-[#00875a] hover:bg-[#00c978] disabled:opacity-50 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-sm"
                            >
                                {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                                {saving ? "Saving Changes..." : "Save Rating Configuration"}
                            </button>
                        </div>
                    </div>
                </div>

                {message && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl flex items-center gap-3 ${
                            message.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"
                        }`}
                    >
                        {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <p className="text-sm font-bold uppercase tracking-widest">{message.text}</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}