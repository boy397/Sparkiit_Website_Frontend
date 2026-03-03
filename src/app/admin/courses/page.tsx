"use client";

import React, { useState, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:5000/api/admin";

interface Course {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    duration: string;
    status: "active" | "draft" | "archived";
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

interface CourseForm {
    title: string;
    description: string;
    category: string;
    price: number;
    duration: string;
    status: "active" | "draft" | "archived";
    imageUrl: string;
}

const emptyCourse: CourseForm = { title: "", description: "", category: "", price: 0, duration: "", status: "draft", imageUrl: "" };

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Course | null>(null);
    const [form, setForm] = useState(emptyCourse);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const fetchCourses = useCallback(() => {
        setLoading(true);
        const q = search ? `?search=${encodeURIComponent(search)}` : "";
        fetch(`${API_BASE}/courses${q}`)
            .then((r) => r.json())
            .then((d) => { setCourses(d.data || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [search]);

    useEffect(() => { fetchCourses(); }, [fetchCourses]);

    const openCreate = () => { setEditing(null); setForm(emptyCourse); setModalOpen(true); };
    const openEdit = (c: Course) => { setEditing(c); setForm({ title: c.title, description: c.description, category: c.category, price: c.price, duration: c.duration, status: c.status, imageUrl: c.imageUrl }); setModalOpen(true); };

    const handleSave = async () => {
        setSaving(true);
        const url = editing ? `${API_BASE}/courses/${editing._id}` : `${API_BASE}/courses`;
        const method = editing ? "PUT" : "POST";
        try {
            await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            setModalOpen(false);
            fetchCourses();
        } catch { /* noop */ }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        await fetch(`${API_BASE}/courses/${id}`, { method: "DELETE" });
        setDeleteConfirm(null);
        fetchCourses();
    };

    const statusBadge = (s: string) => {
        const colors: Record<string, { bg: string; color: string }> = {
            active: { bg: "rgba(168,224,62,0.12)", color: "#a8e03e" },
            draft: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24" },
            archived: { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" },
        };
        const c = colors[s] || colors.draft;
        return (
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 12px", borderRadius: 20, background: c.bg, color: c.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {s}
            </span>
        );
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.04)",
        color: "#fff",
        fontSize: 14,
        outline: "none",
        fontFamily: "inherit",
    };

    const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div style={{ position: "relative", flex: "0 0 360px" }}>
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ ...inputStyle, paddingLeft: 40 }}
                    />
                    <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.3 }} width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <button
                    onClick={openCreate}
                    style={{
                        padding: "10px 24px",
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #a8e03e 0%, #7cb518 100%)",
                        color: "#050505",
                        fontWeight: 700,
                        fontSize: 14,
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(168,224,62,0.3)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Course
                </button>
            </div>

            {/* Table */}
            <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
                {loading ? (
                    <div style={{ padding: 60, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                        <div style={{ width: 32, height: 32, border: "3px solid rgba(168,224,62,0.2)", borderTop: "3px solid #a8e03e", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        Loading courses...
                    </div>
                ) : !courses.length ? (
                    <div style={{ padding: 60, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ margin: "0 auto 12px", opacity: 0.3 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p style={{ fontSize: 14, fontWeight: 500 }}>No courses found</p>
                        <p style={{ fontSize: 12, marginTop: 4 }}>Click &quot;Add Course&quot; to create your first course</p>
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                {["Title", "Category", "Price", "Duration", "Status", "Actions"].map((h) => (
                                    <th key={h} style={{ padding: "14px 20px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((c) => (
                                <tr key={c._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.15s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ fontWeight: 500, fontSize: 14, color: "#fff" }}>{c.title}</div>
                                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.description}</div>
                                    </td>
                                    <td style={{ padding: "14px 20px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{c.category}</td>
                                    <td style={{ padding: "14px 20px", fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>₹{c.price}</td>
                                    <td style={{ padding: "14px 20px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{c.duration}</td>
                                    <td style={{ padding: "14px 20px" }}>{statusBadge(c.status)}</td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <button onClick={() => openEdit(c)} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.15)", color: "#818cf8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                                                Edit
                                            </button>
                                            <button onClick={() => setDeleteConfirm(c._id)} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.15)", color: "#f87171", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create/Edit Modal */}
            {modalOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setModalOpen(false)}>
                    <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32, width: 520, maxHeight: "85vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 24 }}>{editing ? "Edit Course" : "Create New Course"}</h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label style={labelStyle}>Title</label>
                                <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Advanced Mathematics" />
                            </div>
                            <div>
                                <label style={labelStyle}>Description</label>
                                <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Course description..." />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={labelStyle}>Category</label>
                                    <input style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. JEE Prep" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Price (₹)</label>
                                    <input style={inputStyle} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={labelStyle}>Duration</label>
                                    <input style={inputStyle} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 3 months" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Status</label>
                                    <select style={{ ...inputStyle, cursor: "pointer" }} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "draft" | "archived" })}>
                                        <option value="draft">Draft</option>
                                        <option value="active">Active</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Image URL (optional)</label>
                                <input style={inputStyle} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "flex-end" }}>
                            <button onClick={() => setModalOpen(false)} style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving || !form.title} style={{ padding: "10px 24px", borderRadius: 10, background: saving || !form.title ? "rgba(168,224,62,0.3)" : "linear-gradient(135deg, #a8e03e, #7cb518)", color: "#050505", fontWeight: 700, fontSize: 14, border: "none", cursor: saving || !form.title ? "not-allowed" : "pointer" }}>
                                {saving ? "Saving..." : editing ? "Update Course" : "Create Course"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteConfirm && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setDeleteConfirm(null)}>
                    <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32, width: 400, textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(248,113,113,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Delete Course?</h3>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>This action cannot be undone. The course will be permanently removed.</p>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                            <button onClick={() => setDeleteConfirm(null)} style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteConfirm)} style={{ padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
