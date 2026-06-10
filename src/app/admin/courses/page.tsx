"use client";
import { API_BASE_URL } from "@/lib/api-config";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";

const API_BASE = API_BASE_URL + "/api/admin";


interface Course {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    duration: string;
    status: "active" | "draft" | "archived";
    batchStatus: "ongoing" | "upcoming" | "past" | "self-paced";
    imageUrl: string;
    paymentLink: string;
    links: string[];
    level: "beginner" | "intermediate" | "advanced" | "all";
    tags: string[];
    isPopular: boolean;
    showHomepage: boolean;
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
    batchStatus: "ongoing" | "upcoming" | "past" | "self-paced";
    imageUrl: string;
    paymentLink: string;
    links: string[];
    level: "beginner" | "intermediate" | "advanced" | "all";
    tags: string[];
    isPopular: boolean;
    showHomepage: boolean;
}

const emptyCourse: CourseForm = { 
    title: "", 
    description: "", 
    category: "", 
    price: 0, 
    duration: "", 
    status: "draft", 
    batchStatus: "ongoing",
    imageUrl: "", 
    paymentLink: "",
    links: [],
    level: "all",
    tags: [],
    isPopular: false,
    showHomepage: true
};

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Course | null>(null);
    const [form, setForm] = useState(emptyCourse);
    const [domains, setDomains] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [newLink, setNewLink] = useState("");
    const [newTag, setNewTag] = useState("");

    const fetchCourses = useCallback(() => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (statusFilter) params.append("status", statusFilter);
        if (sortBy) params.append("sortBy", sortBy);

        const token = localStorage.getItem("adminToken");
        fetch(`${API_BASE}/courses?${params.toString()}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((r) => r.json())
            .then((d) => { setCourses(d.data || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [search, statusFilter, sortBy]);

    const fetchDomains = useCallback(() => {
        const token = localStorage.getItem("adminToken");
        fetch(`${API_BASE_URL}/api/admin/services`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(json => {
                if (json.success) setDomains(json.data || []);
            })
            .catch(err => console.error("Error fetching domains:", err));
    }, []);

    useEffect(() => { 
        fetchCourses(); 
        fetchDomains();
    }, [fetchCourses, fetchDomains]);

    const openCreate = () => { setEditing(null); setForm(emptyCourse); setModalOpen(true); };
    const openEdit = (c: Course) => {
        setEditing(c);
        setForm({
            title: c.title,
            description: c.description,
            category: c.category,
            price: c.price,
            duration: c.duration,
            status: c.status,
            batchStatus: c.batchStatus || "ongoing",
            imageUrl: c.imageUrl,
            paymentLink: c.paymentLink || "",
            links: c.links || [],
            level: c.level || "all",
            tags: c.tags || [],
            isPopular: c.isPopular || false,
            showHomepage: c.showHomepage !== undefined ? c.showHomepage : true
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.title.trim()) {
            alert("Title is required");
            return;
        }
        if (!form.description.trim()) {
            alert("Description is required");
            return;
        }
        if (!form.category) {
            alert("Domain/Category is required");
            return;
        }
        if (!form.duration.trim()) {
            alert("Duration is required");
            return;
        }

        setSaving(true);
        const url = editing ? `${API_BASE}/courses/${editing._id}` : `${API_BASE}/courses`;
        const method = editing ? "PUT" : "POST";
        const token = localStorage.getItem("adminToken");
        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setModalOpen(false);
                fetchCourses();
            } else {
                alert(data.message || "Failed to save course");
            }
        } catch (err: any) {
            alert(err.message || "An error occurred while saving the course");
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem("adminToken");
        await fetch(`${API_BASE}/courses/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        setDeleteConfirm(null);
        fetchCourses();
    };

    const addLink = () => {
        if (newLink.trim()) {
            setForm({ ...form, links: [...form.links, newLink.trim()] });
            setNewLink("");
        }
    };

    const removeLink = (index: number) => {
        const updatedLinks = [...form.links];
        updatedLinks.splice(index, 1);
        setForm({ ...form, links: updatedLinks });
    };

    const addTag = () => {
        if (newTag.trim() && !form.tags.includes(newTag.trim())) {
            setForm({ ...form, tags: [...form.tags, newTag.trim()] });
            setNewTag("");
        }
    };

    const removeTag = (tag: string) => {
        setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
    };

    const statusBadge = (s: string) => {
        const colors: Record<string, { bg: string; color: string }> = {
            active: { bg: "rgba(0,135,90,0.12)", color: "#00875a" },
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

    const selectStyle: React.CSSProperties = {
        ...inputStyle,
        background: "#1a1a1a",
    };

    const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };

    return (
        <div>
            {/* Header / Filters */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>Courses</h2>
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
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Course
                    </button>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ position: "relative", flex: "1 1 300px" }}>
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
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
                        <option value="" style={{ background: "#1a1a1a" }}>All Status</option>
                        <option value="active" style={{ background: "#1a1a1a" }}>Active</option>
                        <option value="draft" style={{ background: "#1a1a1a" }}>Draft</option>
                        <option value="archived" style={{ background: "#1a1a1a" }}>Archived</option>
                    </select>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
                        <option value="newest" style={{ background: "#1a1a1a" }}>Newest First</option>
                        <option value="oldest" style={{ background: "#1a1a1a" }}>Oldest First</option>
                        <option value="price_asc" style={{ background: "#1a1a1a" }}>Price: Low to High</option>
                        <option value="price_desc" style={{ background: "#1a1a1a" }}>Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Grouped Table */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {loading ? (
                    <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 60, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                        <div style={{ width: 32, height: 32, border: "3px solid rgba(0,135,90,0.2)", borderTop: "3px solid #00875a", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        Loading courses...
                    </div>
                ) : !courses.length ? (
                    <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 60, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                        <p style={{ fontSize: 14, fontWeight: 500 }}>No courses found</p>
                    </div>
                ) : (
                    // Group courses by category
                    Object.entries(
                        courses.reduce((acc, c) => {
                            const cat = c.category || "Uncategorized";
                            if (!acc[cat]) acc[cat] = [];
                            acc[cat].push(c);
                            return acc;
                        }, {} as Record<string, Course[]>)
                    ).map(([domainName, domainCourses]) => (
                        <div key={domainName} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
                            <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 4, height: 20, background: "#00875a", borderRadius: 4 }} />
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{domainName}</h3>
                                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>({domainCourses.length} Courses)</span>
                            </div>
                            <div style={{ overflowX: "auto", width: "100%" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                                    <thead>
                                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                            {["Title", "Level", "Batch", "Status", "Actions"].map((h) => (
                                                <th key={h} style={{ padding: "14px 20px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left" }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {domainCourses.map((c) => (
                                            <tr key={c._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.15s" }}>
                                                <td style={{ padding: "14px 20px", minWidth: 200 }}>
                                                    <div style={{ fontWeight: 500, fontSize: 14, color: "#fff" }}>{c.title}</div>
                                                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.description}</div>
                                                </td>
                                                <td style={{ padding: "14px 20px", fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700, whiteSpace: "nowrap" }}>{c.level || "all"}</td>
                                                <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
                                                    <div style={{ 
                                                        fontSize: 10, 
                                                        fontWeight: 800, 
                                                        padding: "4px 10px", 
                                                        borderRadius: 6, 
                                                        background: c.batchStatus === 'ongoing' ? 'rgba(0,135,90,0.1)' : c.batchStatus === 'upcoming' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.05)',
                                                        color: c.batchStatus === 'ongoing' ? '#00875a' : c.batchStatus === 'upcoming' ? '#3b82f6' : 'rgba(255,255,255,0.4)',
                                                        display: "inline-block",
                                                        textTransform: "uppercase"
                                                    }}>
                                                        {c.batchStatus}
                                                    </div>
                                                </td>
                                                <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>{statusBadge(c.status)}</td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <div style={{ display: "flex", gap: 8 }}>
                                                        <button onClick={() => openEdit(c)} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.15)", color: "#818cf8", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Edit</button>
                                                        <button onClick={() => setDeleteConfirm(c._id)} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.15)", color: "#f87171", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setModalOpen(false)}>
                    <div data-lenis-prevent style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 32, width: 700, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 24 }}>{editing ? "Edit Course" : "Create New Course"}</h2>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={labelStyle}>Title</label>
                                <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={labelStyle}>Description</label>
                                <textarea style={{ ...inputStyle, minHeight: 80 }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Domain</label>
                                <select 
                                    style={selectStyle} 
                                    value={form.category} 
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                >
                                    <option value="" style={{ background: "#1a1a1a" }}>Select Domain</option>
                                    {domains.map(d => (
                                        <option key={d._id} value={d.title} style={{ background: "#1a1a1a" }}>{d.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Price (₹)</label>
                                <input 
                                    style={inputStyle} 
                                    type="text" 
                                    value={form.price || ""} 
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === "" || /^\d+$/.test(val)) {
                                            setForm({ ...form, price: val === "" ? 0 : Number(val) });
                                        }
                                    }} 
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Duration</label>
                                <input style={inputStyle} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Status</label>
                                <select style={selectStyle} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "active" | "archived" })}>
                                    <option value="draft" style={{ background: "#1a1a1a" }}>Draft</option>
                                    <option value="active" style={{ background: "#1a1a1a" }}>Active</option>
                                    <option value="archived" style={{ background: "#1a1a1a" }}>Archived</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Batch Status</label>
                                <select style={selectStyle} value={form.batchStatus} onChange={(e) => setForm({ ...form, batchStatus: e.target.value as any })}>
                                    <option value="ongoing" style={{ background: "#1a1a1a" }}>Ongoing</option>
                                    <option value="upcoming" style={{ background: "#1a1a1a" }}>Upcoming</option>
                                    <option value="past" style={{ background: "#1a1a1a" }}>Past</option>
                                    <option value="self-paced" style={{ background: "#1a1a1a" }}>Self-Paced</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Level</label>
                                <select style={selectStyle} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as any })}>
                                    <option value="beginner" style={{ background: "#1a1a1a" }}>Beginner</option>
                                    <option value="intermediate" style={{ background: "#1a1a1a" }}>Intermediate</option>
                                    <option value="advanced" style={{ background: "#1a1a1a" }}>Advanced</option>
                                    <option value="all" style={{ background: "#1a1a1a" }}>All Levels</option>
                                </select>
                            </div>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={labelStyle}>Thumbnail URL</label>
                                <input style={inputStyle} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
                            </div>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={labelStyle}>Payment Link (External - Optional)</label>
                                <input style={inputStyle} value={form.paymentLink} onChange={(e) => setForm({ ...form, paymentLink: e.target.value })} placeholder="https://razorpay.me/..." />
                            </div>
                            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Popular Course?</label>
                                    <button 
                                        type="button"
                                        onClick={() => setForm({...form, isPopular: !form.isPopular})}
                                        style={{ ...inputStyle, background: form.isPopular ? "rgba(0,135,90,0.1)" : "rgba(255,255,255,0.04)", borderColor: form.isPopular ? "#00875a" : "rgba(255,255,255,0.1)", color: form.isPopular ? "#00875a" : "rgba(255,255,255,0.4)", fontWeight: 700 }}
                                    >
                                        {form.isPopular ? "YES" : "NO"}
                                    </button>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Show on Home?</label>
                                    <button 
                                        type="button"
                                        onClick={() => setForm({...form, showHomepage: !form.showHomepage})}
                                        style={{ ...inputStyle, background: form.showHomepage ? "rgba(0,135,90,0.1)" : "rgba(255,255,255,0.04)", borderColor: form.showHomepage ? "#00875a" : "rgba(255,255,255,0.1)", color: form.showHomepage ? "#00875a" : "rgba(255,255,255,0.4)", fontWeight: 700 }}
                                    >
                                        {form.showHomepage ? "YES" : "NO"}
                                    </button>
                                </div>
                            </div>

                            {/* Tags Section */}
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={labelStyle}>Tags</label>
                                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                                    <input style={inputStyle} value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add a tag..." onKeyPress={(e) => e.key === 'Enter' && addTag()} />
                                    <button type="button" onClick={addTag} style={{ padding: "0 20px", borderRadius: 10, background: "rgba(0,135,90,0.1)", border: "1px solid #00875a", color: "#00875a", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Add</button>
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {form.tags.map((tag) => (
                                        <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 20, fontSize: 11, fontWeight: 600, color: "#fff" }}>
                                            {tag}
                                            <button type="button" onClick={() => removeTag(tag)} style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>&times;</button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Links Section */}
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={labelStyle}>Resources Links</label>
                                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                                    <input style={inputStyle} value={newLink} onChange={(e) => setNewLink(e.target.value)} placeholder="Add a link..." onKeyPress={(e) => e.key === 'Enter' && addLink()} />
                                    <button type="button" onClick={addLink} style={{ padding: "0 20px", borderRadius: 10, background: "rgba(0,135,90,0.1)", border: "1px solid #00875a", color: "#00875a", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Add</button>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {form.links.map((link, idx) => (
                                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.04)" }}>
                                            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", overflow: "hidden", textOverflow: "ellipsis" }}>{link}</span>
                                            <button type="button" onClick={() => removeLink(idx)} style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer", fontSize: 12 }}>Remove</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12, marginTop: 32, justifyContent: "flex-end" }}>
                            <button type="button" onClick={() => setModalOpen(false)} style={{ padding: "12px 24px", color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer" }}>Cancel</button>
                            <button type="button" onClick={handleSave} disabled={saving} style={{ padding: "12px 32px", borderRadius: 12, background: "#00875a", color: "#ffffff", fontWeight: 700, border: "none", cursor: "pointer" }}>{saving ? "Saving..." : "Save Changes"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setDeleteConfirm(null)}>
                    <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 32, width: 400, textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(248,113,113,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                         <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Delete Course?</h3>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>This action cannot be undone. All data for this course will be permanently removed.</p>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                            <button onClick={() => setDeleteConfirm(null)} style={{ padding: "12px 24px", color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer" }}>Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)} style={{ padding: "12px 24px", borderRadius: 12, background: "#ef4444", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
