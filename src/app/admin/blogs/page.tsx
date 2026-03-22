"use client";

import React, { useState, useEffect, useCallback } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/admin";


interface Blog {
    _id: string;
    title: string;
    content: string;
    author: string;
    category: string;
    imageUrl: string;
    createdAt: string;
}

interface BlogForm {
    title: string;
    content: string;
    author: string;
    category: string;
    imageUrl: string;
}

const emptyBlog: BlogForm = { title: "", content: "", author: "", category: "", imageUrl: "" };

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Blog | null>(null);
    const [form, setForm] = useState(emptyBlog);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const fetchBlogs = useCallback(() => {
        const token = localStorage.getItem("adminToken");
        fetch(`${API_BASE}/blogs`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((r) => r.json())
            .then((d) => { setBlogs(d.data || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

    const openCreate = () => { setEditing(null); setForm(emptyBlog); setModalOpen(true); };
    const openEdit = (b: Blog) => { setEditing(b); setForm({ title: b.title, content: b.content, author: b.author, category: b.category, imageUrl: b.imageUrl }); setModalOpen(true); };

    const handleSave = async () => {
        setSaving(true);
        const url = editing ? `${API_BASE}/blogs/${editing._id}` : `${API_BASE}/blogs`;
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
            fetchBlogs();
        } catch { /* noop */ }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem("adminToken");
        await fetch(`${API_BASE}/blogs/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        setDeleteConfirm(null);
        fetchBlogs();
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
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Manage Blogs</h1>
                <button
                    onClick={openCreate}
                    style={{
                        padding: "10px 24px",
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #00875a 0%, #006644 100%)",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: 14,
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    Add Blog
                </button>
            </div>

            {/* Table */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
                {loading ? (
                    <div style={{ padding: 60, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading blogs...</div>
                ) : !blogs.length ? (
                    <div style={{ padding: 60, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No blogs found</div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                {["Title", "Author", "Category", "Date", "Actions"].map((h) => (
                                    <th key={h} style={{ padding: "14px 20px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", textAlign: "left" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog) => (
                                <tr key={blog._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                    <td style={{ padding: "14px 20px", fontWeight: 500, color: "#fff" }}>{blog.title}</td>
                                    <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.6)" }}>{blog.author}</td>
                                    <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.6)" }}>{blog.category}</td>
                                    <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{new Date(blog.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <button onClick={() => openEdit(blog)} style={{ marginRight: 10, color: "#00875a", background: "none", border: "none", cursor: "pointer" }}>Edit</button>
                                        <button onClick={() => setDeleteConfirm(blog._id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
                    <div style={{ background: "#141414", borderRadius: 20, padding: 32, width: 600, maxHeight: "90vh", overflowY: "auto" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 24 }}>{editing ? "Edit Blog" : "Add Blog"}</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label style={labelStyle}>Title</label>
                                <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Content</label>
                                <textarea style={{ ...inputStyle, minHeight: 150 }} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={labelStyle}>Author</label>
                                    <input style={inputStyle} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Category</label>
                                    <input style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Image URL</label>
                                <input style={inputStyle} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "flex-end" }}>
                            <button onClick={() => setModalOpen(false)} style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "none", color: "#fff", cursor: "pointer" }}>Cancel</button>
                            <button onClick={handleSave} style={{ padding: "10px 24px", borderRadius: 10, background: "#00875a", color: "#000", fontWeight: 700, border: "none", cursor: "pointer" }}>{saving ? "Saving..." : "Save"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteConfirm && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
                    <div style={{ background: "#141414", borderRadius: 20, padding: 32, width: 400, textAlign: "center" }}>
                        <h3 style={{ color: "#fff", marginBottom: 16 }}>Are you sure?</h3>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                            <button onClick={() => setDeleteConfirm(null)} style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "none", color: "#fff", cursor: "pointer" }}>Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)} style={{ padding: "10px 24px", borderRadius: 10, background: "#ef4444", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}