"use client";
import { API_BASE_URL } from "@/lib/api-config";
import React, { useState, useEffect } from "react";
import { 
    Plus, Search, Edit2, Trash2, Save, X, 
    HelpCircle, Loader2, CheckCircle2, AlertCircle 
} from "lucide-react";

const API_BASE = API_BASE_URL + "/api/admin";

interface FAQ {
    _id: string;
    question: string;
    answer: string;
}

export default function FAQPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);
    
    // Modal/Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentFaq, setCurrentFaq] = useState({ question: "", answer: "" });

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/faqs`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setFaqs(data.data);
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
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `${API_BASE}/faqs/${editingId}` : `${API_BASE}/faqs`;
            
            const res = await fetch(url, {
                method,
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(currentFaq)
            });
            
            const data = await res.json();
            if (data.success) {
                setStatus({ type: 'success', msg: `FAQ ${editingId ? 'updated' : 'created'} successfully` });
                fetchFaqs();
                setTimeout(() => {
                    setIsFormOpen(false);
                    setEditingId(null);
                    setCurrentFaq({ question: "", answer: "" });
                    setStatus(null);
                }, 1500);
            } else {
                throw new Error(data.message);
            }
        } catch (err: any) {
            setStatus({ type: 'error', msg: err.message || "Something went wrong" });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this FAQ?")) return;
        
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/faqs/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setFaqs(faqs.filter(f => f._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const startEdit = (faq: FAQ) => {
        setEditingId(faq._id);
        setCurrentFaq({ question: faq.question, answer: faq.answer });
        setIsFormOpen(true);
    };

    const filteredFaqs = faqs.filter(f => 
        f.question.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <Loader2 className="animate-spin" size={32} color="#00875a" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 0" }}>
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-end", 
                marginBottom: 32,
                gap: 20,
                flexWrap: "wrap"
            }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 8 }}>CMS <span style={{ color: "#00875a" }}>FAQs</span></h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Manage frequently asked questions for your users.</p>
                </div>
                
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 10, 
                        background: "rgba(255,255,255,0.03)", 
                        border: "1px solid rgba(255,255,255,0.06)",
                        padding: "8px 16px",
                        borderRadius: 12,
                        minWidth: 260
                    }}>
                        <Search size={18} color="rgba(255,255,255,0.3)" />
                        <input 
                            type="text" 
                            placeholder="Search questions..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                background: "none", 
                                border: "none", 
                                color: "#fff", 
                                fontSize: 14, 
                                outline: "none",
                                width: "100%" 
                            }} 
                        />
                    </div>
                    
                    <button 
                        onClick={() => {
                            setEditingId(null);
                            setCurrentFaq({ question: "", answer: "" });
                            setIsFormOpen(true);
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 20px",
                            borderRadius: 12,
                            background: "#00875a",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 700,
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }}
                    >
                        <Plus size={18} />
                        Add New FAQ
                    </button>
                </div>
            </div>

            {/* List View */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {filteredFaqs.length === 0 ? (
                    <div style={{ 
                        textAlign: "center", 
                        padding: "80px 20px", 
                        borderRadius: 24, 
                        background: "rgba(255,255,255,0.02)",
                        border: "1px dashed rgba(255,255,255,0.1)"
                    }}>
                        <HelpCircle size={48} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 16px" }} />
                        <p style={{ color: "rgba(255,255,255,0.3)" }}>No FAQs found. Try a different search or add one!</p>
                    </div>
                ) : (
                    filteredFaqs.map(faq => (
                        <div key={faq._id} style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 16,
                            padding: 24,
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 20,
                            transition: "all 0.2s ease"
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                    <div style={{ 
                                        width: 24, height: 24, borderRadius: 6, 
                                        background: "rgba(0,135,90,0.1)", color: "#00875a",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 12, fontWeight: 800
                                    }}>Q</div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{faq.question}</h3>
                                </div>
                                <div style={{ display: "flex", gap: 12 }}>
                                    <div style={{ 
                                        width: 24, height: 24, flexShrink: 0,
                                        marginTop: 4, visibility: "hidden"
                                    }}>A</div>
                                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{faq.answer}</p>
                                </div>
                            </div>
                            
                            <div style={{ display: "flex", gap: 8, height: "fit-content" }}>
                                <button 
                                    onClick={() => startEdit(faq)}
                                    style={{
                                        padding: 8, borderRadius: 8, border: "none",
                                        background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)",
                                        cursor: "pointer", transition: "all 0.2s"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = "#00875a"}
                                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(faq._id)}
                                    style={{
                                        padding: 8, borderRadius: 8, border: "none",
                                        background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)",
                                        cursor: "pointer", transition: "all 0.2s"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Form Overlay */}
            {isFormOpen && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 1000, padding: 20
                }}>
                    <form 
                        onSubmit={handleSave}
                        style={{
                            width: "100%", maxWidth: 600,
                            background: "#111", border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 24, padding: 40, position: "relative",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
                        }}
                    >
                        <button 
                            type="button" 
                            onClick={() => setIsFormOpen(false)}
                            style={{ 
                                position: "absolute", top: 24, right: 24, 
                                background: "none", border: "none", color: "rgba(255,255,255,0.3)", 
                                cursor: "pointer" 
                            }}
                        >
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 32 }}>
                            {editingId ? "Edit" : "Add New"} <span style={{ color: "#00875a" }}>FAQ</span>
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>The Question</label>
                                <input 
                                    type="text"
                                    required
                                    value={currentFaq.question}
                                    onChange={(e) => setCurrentFaq({...currentFaq, question: e.target.value})}
                                    placeholder="Enter the question..."
                                    style={{
                                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none"
                                    }}
                                />
                            </div>
                            
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>The Answer</label>
                                <textarea 
                                    required
                                    rows={5}
                                    value={currentFaq.answer}
                                    onChange={(e) => setCurrentFaq({...currentFaq, answer: e.target.value})}
                                    placeholder="Provide a detailed answer..."
                                    style={{
                                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none",
                                        resize: "none"
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: 40, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            {status && (
                                <div style={{ 
                                    display: "flex", alignItems: "center", gap: 8, 
                                    color: status.type === 'success' ? '#10b981' : '#ef4444',
                                    fontSize: 14, fontWeight: 500
                                }}>
                                    {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    {status.msg}
                                </div>
                            )}
                            <div style={{ flex: 1 }} />
                            <div style={{ display: "flex", gap: 12 }}>
                                <button 
                                    type="button" 
                                    onClick={() => setIsFormOpen(false)}
                                    style={{
                                        padding: "12px 24px", borderRadius: 12,
                                        background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)",
                                        fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer"
                                    }}
                                >Cancel</button>
                                <button 
                                    type="submit"
                                    disabled={saving}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 10,
                                        padding: "12px 28px", borderRadius: 12,
                                        background: "#00875a", color: "#fff",
                                        fontSize: 14, fontWeight: 700, border: "none",
                                        cursor: saving ? "not-allowed" : "pointer",
                                        opacity: saving ? 0.7 : 1,
                                        boxShadow: "0 10px 20px rgba(0,135,90,0.3)"
                                    }}
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {editingId ? "Update FAQ" : "Save FAQ"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <style jsx global>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
}