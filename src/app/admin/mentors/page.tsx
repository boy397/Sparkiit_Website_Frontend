"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, User } from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/admin";


interface Mentor {
    _id: string;
    name: string;
    description: string;
    photo: string;
    order: number;
    createdAt: string;
}

interface MentorForm {
    name: string;
    description: string;
    photo: string;
    order: number;
}

const emptyMentor: MentorForm = { name: "", description: "", photo: "", order: 0 };

export default function MentorsPage() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Mentor | null>(null);
    const [form, setForm] = useState(emptyMentor);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const fetchMentors = useCallback(() => {
        const token = localStorage.getItem("adminToken");
        fetch(`${API_BASE}/mentors`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((r) => r.json())
            .then((d) => { setMentors(d.data || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => { fetchMentors(); }, [fetchMentors]);

    const openCreate = () => { setEditing(null); setForm(emptyMentor); setModalOpen(true); };
    const openEdit = (m: Mentor) => { 
        setEditing(m); 
        setForm({ name: m.name, description: m.description, photo: m.photo, order: m.order }); 
        setModalOpen(true); 
    };

    const handleSave = async () => {
        if (!form.name || !form.description || !form.photo) return;
        setSaving(true);
        const url = editing ? `${API_BASE}/mentors/${editing._id}` : `${API_BASE}/mentors`;
        const method = editing ? "PUT" : "POST";
        const token = localStorage.getItem("adminToken");
        try {
            await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            setModalOpen(false);
            fetchMentors();
        } catch { /* noop */ }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem("adminToken");
        await fetch(`${API_BASE}/mentors/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        setDeleteConfirm(null);
        fetchMentors();
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "12px 16px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
        color: "#fff",
        fontSize: 14,
        outline: "none",
        transition: "all 0.2s ease",
    };

    const labelStyle: React.CSSProperties = { 
        fontSize: 11, 
        fontWeight: 700, 
        color: "rgba(255,255,255,0.4)", 
        marginBottom: 8, 
        display: "block", 
        textTransform: "uppercase", 
        letterSpacing: "0.1em" 
    };

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 4 }}>MANAGE MENTORS</h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Add or edit mentors for the homepage horizontal slider.</p>
                </div>
                <button
                    onClick={openCreate}
                    style={{
                        padding: "12px 24px",
                        borderRadius: 12,
                        background: "#a8e03e",
                        color: "#000",
                        fontWeight: 700,
                        fontSize: 14,
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        boxShadow: "0 4px 20px rgba(168,224,62,0.25)",
                    }}
                >
                    <Plus size={18} />
                    ADD MENTOR
                </button>
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ padding: 100, textAlign: "center", color: "rgba(255,255,255,0.2)" }}>Loading mentors interface...</div>
            ) : !mentors.length ? (
                <div style={{ 
                    padding: 80, 
                    textAlign: "center", 
                    background: "rgba(255,255,255,0.02)", 
                    border: "2px dashed rgba(255,255,255,0.05)", 
                    borderRadius: 24,
                    color: "rgba(255,255,255,0.3)" 
                }}>
                    No mentors added yet. Click &quot;ADD MENTOR&quot; to begin.
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
                    {mentors.map((m) => (
                        <div 
                            key={m._id} 
                            style={{ 
                                background: "rgba(255,255,255,0.03)", 
                                border: "1px solid rgba(255,255,255,0.06)", 
                                borderRadius: 20, 
                                overflow: "hidden",
                                transition: "all 0.2s ease"
                            }}
                        >
                            <div style={{ height: 200, width: "100%", overflow: "hidden", position: "relative", background: "rgba(255,255,255,0.02)" }}>
                                <img 
                                    src={m.photo} 
                                    alt={m.name} 
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                    onError={(e) => { (e.target as any).src = "https://via.placeholder.com/400x300?text=No+Photo"; }}
                                />
                                <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", padding: "4px 10px", borderRadius: 20, fontSize: 10, color: "#fff", fontWeight: 700 }}>
                                    ORDER: {m.order}
                                </div>
                            </div>
                            <div style={{ padding: 20 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{m.name}</h3>
                                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 20, height: 40, overflow: "hidden" }}>{m.description}</p>
                                <div style={{ display: "flex", gap: 10 }}>
                                    <button 
                                        onClick={() => openEdit(m)} 
                                        style={{ flex: 1, padding: "10px", borderRadius: 10, background: "rgba(168,224,62,0.1)", border: "1px solid rgba(168,224,62,0.2)", color: "#a8e03e", cursor: "pointer", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                                    >
                                        <Edit2 size={14} /> EDIT
                                    </button>
                                    <button 
                                        onClick={() => setDeleteConfirm(m._id)} 
                                        style={{ padding: "10px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", cursor: "pointer" }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {modalOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
                    <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 32, width: 500, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{editing ? "EDIT MENTOR" : "ADD NEW MENTOR"}</h2>
                            <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}><X size={24} /></button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div>
                                <label style={labelStyle}><User size={12} style={{ display: "inline", marginRight: 6 }} /> Full Name</label>
                                <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Dr. John Doe" />
                            </div>
                            <div>
                                <label style={labelStyle}>Description / Role</label>
                                <textarea style={{ ...inputStyle, minHeight: 100, resize: "none" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tell us about this mentor..." />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 12 }}>
                                <div>
                                    <label style={labelStyle}><ImageIcon size={12} style={{ display: "inline", marginRight: 6 }} /> Photo URL</label>
                                    <input style={inputStyle} value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} placeholder="https://..." />
                                </div>
                                <div>
                                    <label style={labelStyle}>Order</label>
                                    <input type="number" style={inputStyle} value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                            <button 
                                onClick={() => setModalOpen(false)} 
                                style={{ flex: 1, padding: "14px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", cursor: "pointer", fontWeight: 600 }}
                            >
                                CANCEL
                            </button>
                            <button 
                                onClick={handleSave} 
                                disabled={saving}
                                style={{ 
                                    flex: 2, 
                                    padding: "14px", 
                                    borderRadius: 12, 
                                    background: "#a8e03e", 
                                    color: "#000", 
                                    fontWeight: 800, 
                                    border: "none", 
                                    cursor: "pointer", 
                                    opacity: saving ? 0.6 : 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8
                                }}
                            >
                                {saving ? "SAVING..." : <><Save size={18} /> SAVE MENTOR</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteConfirm && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                    <div style={{ background: "#111", borderRadius: 24, padding: 32, width: 400, textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(239,68,68,0.1)", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                            <Trash2 size={30} />
                        </div>
                        <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Delete Mentor?</h3>
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 28 }}>This action cannot be undone and will remove the mentor from the homepage.</p>
                        <div style={{ display: "flex", gap: 12 }}>
                            <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", cursor: "pointer", fontWeight: 600 }}>CANCEL</button>
                            <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: "12px", borderRadius: 12, background: "#ef4444", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}>DELETE</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
