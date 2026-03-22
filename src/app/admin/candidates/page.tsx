"use client";

import React, { useState, useEffect, useCallback } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/admin";


interface Course {
    _id: string;
    title: string;
    category: string;
    status: string;
}

interface Candidate {
    _id: string;
    name: string;
    email: string;
    phone: string;
    enrolledCourses: Course[];
    paymentDetails?: {
        paidAmount: number;
        remainingAmount: number;
    };
    performanceMetrics?: {
        overallScore: number;
        attendance: number;
        progress: number;
        averageScore: number;
    };
    batchRank?: string;
    stipendEligible?: boolean;
    skills?: {
        tech: number;
        softSkills: number;
        blockchain: number;
        smartContracts: number;
        frontend: number;
        ai: number;
        systemDesign: number;
    };
    status: "active" | "inactive";
    createdAt: string;
}

interface CandidateForm {
    name: string;
    email: string;
    phone: string;
    paymentDetails: {
        paidAmount: number;
        remainingAmount: number;
    };
    performanceMetrics: {
        overallScore: number;
        attendance: number;
        progress: number;
        averageScore: number;
    };
    batchRank: string;
    stipendEligible: boolean;
    skills: {
        tech: number;
        softSkills: number;
        blockchain: number;
        smartContracts: number;
        frontend: number;
        ai: number;
        systemDesign: number;
    };
    status: "active" | "inactive";
}

const emptyCandidate: CandidateForm = { 
    name: "", 
    email: "", 
    phone: "", 
    paymentDetails: { paidAmount: 0, remainingAmount: 0 }, 
    performanceMetrics: { overallScore: 0, attendance: 0, progress: 0, averageScore: 0 },
    batchRank: "N/A",
    stipendEligible: false,
    skills: { tech: 0, softSkills: 0, blockchain: 0, smartContracts: 0, frontend: 0, ai: 0, systemDesign: 0 },
    status: "active" 
};

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Candidate | null>(null);
    const [form, setForm] = useState(emptyCandidate);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [assignModal, setAssignModal] = useState<Candidate | null>(null);
    const [selectedCourse, setSelectedCourse] = useState("");

    const fetchCandidates = useCallback(() => {
        const token = localStorage.getItem("adminToken");
        const q = search ? `?search=${encodeURIComponent(search)}` : "";
        fetch(`${API_BASE}/candidates${q}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((r) => r.json())
            .then((d) => { setCandidates(d.data || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [search]);

    const fetchCourses = useCallback(() => {
        const token = localStorage.getItem("adminToken");
        fetch(`${API_BASE}/courses`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((r) => r.json())
            .then((d) => setAllCourses(d.data || []))
            .catch(() => { });
    }, []);

    useEffect(() => { fetchCandidates(); fetchCourses(); }, [fetchCandidates, fetchCourses]);

    const openCreate = () => { setEditing(null); setForm(emptyCandidate); setModalOpen(true); };
    const openEdit = (c: Candidate) => { 
        setEditing(c); 
        setForm({ 
            name: c.name, 
            email: c.email, 
            phone: c.phone, 
            paymentDetails: c.paymentDetails || { paidAmount: 0, remainingAmount: 0 }, 
            performanceMetrics: c.performanceMetrics || { overallScore: 0, attendance: 0, progress: 0, averageScore: 0 },
            batchRank: c.batchRank || "N/A",
            stipendEligible: c.stipendEligible || false,
            skills: c.skills || { tech: 0, softSkills: 0, blockchain: 0, smartContracts: 0, frontend: 0, ai: 0, systemDesign: 0 },
            status: c.status 
        }); 
        setModalOpen(true); 
    };

    const handleSave = async () => {
        setSaving(true);
        const url = editing ? `${API_BASE}/candidates/${editing._id}` : `${API_BASE}/candidates`;
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
            fetchCandidates();
        } catch { /* noop */ }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem("adminToken");
        await fetch(`${API_BASE}/candidates/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        setDeleteConfirm(null);
        fetchCandidates();
    };

    const handleAssign = async () => {
        if (!assignModal || !selectedCourse) return;
        const token = localStorage.getItem("adminToken");
        await fetch(`${API_BASE}/candidates/${assignModal._id}/assign-course`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ courseId: selectedCourse }),
        });
        setSelectedCourse("");
        fetchCandidates();
        // Refresh the assignModal data
        const r = await fetch(`${API_BASE}/candidates/${assignModal._id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const d = await r.json();
        if (d.data) setAssignModal(d.data);
    };

    const handleRemoveCourse = async (candidateId: string, courseId: string) => {
        const token = localStorage.getItem("adminToken");
        await fetch(`${API_BASE}/candidates/${candidateId}/remove-course`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ courseId }),
        });
        fetchCandidates();
        // Refresh assign modal
        if (assignModal && assignModal._id === candidateId) {
            const r = await fetch(`${API_BASE}/candidates/${candidateId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const d = await r.json();
            if (d.data) setAssignModal(d.data);
        }
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
                        placeholder="Search candidates..."
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
                        background: "linear-gradient(135deg, #00875a 0%, #006644 100%)",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: 14,
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,135,90,0.3)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Candidate
                </button>
            </div>

            {/* Table */}
            <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
                {loading ? (
                    <div style={{ padding: 60, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                        <div style={{ width: 32, height: 32, border: "3px solid rgba(0,135,90,0.2)", borderTop: "3px solid #00875a", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        Loading candidates...
                    </div>
                ) : !candidates.length ? (
                    <div style={{ padding: 60, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ margin: "0 auto 12px", opacity: 0.3 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p style={{ fontSize: 14, fontWeight: 500 }}>No candidates found</p>
                        <p style={{ fontSize: 12, marginTop: 4 }}>Click &quot;Add Candidate&quot; to add your first candidate</p>
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                {["Name", "Email", "Phone", "Courses", "Paid (₹)", "Remaining (₹)", "Status", "Actions"].map((h) => (
                                    <th key={h} style={{ padding: "14px 20px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map((c) => (
                                <tr key={c._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.15s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
                                    <td style={{ padding: "14px 20px", fontWeight: 500, fontSize: 14, color: "#fff" }}>{c.name}</td>
                                    <td style={{ padding: "14px 20px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{c.email}</td>
                                    <td style={{ padding: "14px 20px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{c.phone || "—"}</td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                            {c.enrolledCourses?.length ? (
                                                c.enrolledCourses.map((course) => (
                                                    <span key={course._id} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: "rgba(0,135,90,0.08)", color: "#00875a", fontWeight: 500 }}>
                                                        {course.title}
                                                    </span>
                                                ))
                                            ) : (
                                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>None</span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#00875a", fontWeight: 600 }}>₹{c.paymentDetails?.paidAmount || 0}</td>
                                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#f87171", fontWeight: 600 }}>₹{c.paymentDetails?.remainingAmount || 0}</td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <span style={{
                                            fontSize: 11, fontWeight: 600, padding: "3px 12px", borderRadius: 20,
                                            background: c.status === "active" ? "rgba(94,234,212,0.12)" : "rgba(255,255,255,0.06)",
                                            color: c.status === "active" ? "#5eead4" : "rgba(255,255,255,0.4)",
                                            textTransform: "uppercase", letterSpacing: "0.04em",
                                        }}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            <button onClick={() => setAssignModal(c)} style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(0,135,90,0.1)", border: "1px solid rgba(0,135,90,0.15)", color: "#00875a", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                                                Courses
                                            </button>
                                            <button onClick={() => openEdit(c)} style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.15)", color: "#818cf8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                                                Edit
                                            </button>
                                            <button onClick={() => setDeleteConfirm(c._id)} style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.15)", color: "#f87171", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
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
                    <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32, width: 480, maxHeight: "85vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 24 }}>{editing ? "Edit Candidate" : "Add New Candidate"}</h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label style={labelStyle}>Name</label>
                                <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
                            </div>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <input style={inputStyle} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={labelStyle}>Phone</label>
                                    <input style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91..." />
                                </div>
                                <div>
                                    <label style={labelStyle}>Status</label>
                                    <select style={{ ...inputStyle, cursor: "pointer" }} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "inactive" })}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={labelStyle}>Paid Amount (₹)</label>
                                    <input style={inputStyle} type="number" value={form.paymentDetails.paidAmount} onChange={(e) => setForm({ ...form, paymentDetails: { ...form.paymentDetails, paidAmount: Number(e.target.value) } })} placeholder="0" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Remaining Amount (₹)</label>
                                    <input style={inputStyle} type="number" value={form.paymentDetails.remainingAmount} onChange={(e) => setForm({ ...form, paymentDetails: { ...form.paymentDetails, remainingAmount: Number(e.target.value) } })} placeholder="0" />
                                </div>
                            </div>

                            {/* New Dashboard Metrics */}
                            <div style={{ padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 8 }}>
                                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#00875a", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Dashboard Metrics</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                                    <div>
                                        <label style={labelStyle}>Batch Rank</label>
                                        <input style={inputStyle} value={form.batchRank} onChange={(e) => setForm({ ...form, batchRank: e.target.value })} placeholder="#..." />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Stipend Eligible</label>
                                        <select style={{ ...inputStyle, cursor: "pointer" }} value={form.stipendEligible ? "true" : "false"} onChange={(e) => setForm({ ...form, stipendEligible: e.target.value === "true" })}>
                                            <option value="false">No</option>
                                            <option value="true">Eligible</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                                    <div>
                                        <label style={labelStyle}>Attendance %</label>
                                        <input style={inputStyle} type="number" value={form.performanceMetrics.attendance} onChange={(e) => setForm({ ...form, performanceMetrics: { ...form.performanceMetrics, attendance: Number(e.target.value) } })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Progress %</label>
                                        <input style={inputStyle} type="number" value={form.performanceMetrics.progress} onChange={(e) => setForm({ ...form, performanceMetrics: { ...form.performanceMetrics, progress: Number(e.target.value) } })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Avg Score %</label>
                                        <input style={inputStyle} type="number" value={form.performanceMetrics.averageScore} onChange={(e) => setForm({ ...form, performanceMetrics: { ...form.performanceMetrics, averageScore: Number(e.target.value) } })} />
                                    </div>
                                </div>
                            </div>

                            {/* Skill Matrix */}
                            <div style={{ padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#00875a", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Skill Matrix (%)</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                    {Object.keys(form.skills).map((skill) => (
                                        <div key={skill}>
                                            <label style={labelStyle}>{skill.replace(/([A-Z])/g, ' $1')}</label>
                                            <input 
                                                style={inputStyle} 
                                                type="number" 
                                                value={(form.skills as any)[skill]} 
                                                onChange={(e) => setForm({ ...form, skills: { ...form.skills, [skill]: Number(e.target.value) } })} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "flex-end" }}>
                            <button onClick={() => setModalOpen(false)} style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving || !form.name || !form.email} style={{ padding: "10px 24px", borderRadius: 10, background: saving || !form.name || !form.email ? "rgba(0,135,90,0.3)" : "linear-gradient(135deg, #00875a, #006644)", color: "#ffffff", fontWeight: 700, fontSize: 14, border: "none", cursor: saving || !form.name || !form.email ? "not-allowed" : "pointer" }}>
                                {saving ? "Saving..." : editing ? "Update" : "Create"}
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
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Delete Candidate?</h3>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>This action cannot be undone.</p>
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

            {/* Assign Courses Modal */}
            {assignModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setAssignModal(null)}>
                    <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32, width: 520, maxHeight: "85vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Manage Courses</h2>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>for <span style={{ color: "#00875a", fontWeight: 600 }}>{assignModal.name}</span></p>

                        {/* Enrolled Courses */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={labelStyle}>Enrolled Courses</label>
                            {!assignModal.enrolledCourses?.length ? (
                                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No courses enrolled</p>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {assignModal.enrolledCourses.map((course) => (
                                        <div key={course._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
                                            <div>
                                                <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>{course.title}</span>
                                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: 8 }}>{course.category}</span>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveCourse(assignModal._id, course._id)}
                                                style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.15)", color: "#f87171", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Assign New Course */}
                        <div>
                            <label style={labelStyle}>Assign New Course</label>
                            <div style={{ display: "flex", gap: 10 }}>
                                <select
                                    style={{ ...inputStyle, flex: 1, cursor: "pointer" }}
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                >
                                    <option value="">Select a course...</option>
                                    {allCourses
                                        .filter((c) => !assignModal.enrolledCourses?.some((ec) => ec._id === c._id))
                                        .map((c) => (
                                            <option key={c._id} value={c._id}>{c.title} ({c.category})</option>
                                        ))}
                                </select>
                                <button
                                    onClick={handleAssign}
                                    disabled={!selectedCourse}
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: 10,
                                        background: !selectedCourse ? "rgba(0,135,90,0.3)" : "linear-gradient(135deg, #00875a, #006644)",
                                        color: "#ffffff",
                                        fontWeight: 700,
                                        fontSize: 13,
                                        border: "none",
                                        cursor: !selectedCourse ? "not-allowed" : "pointer",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Assign
                                </button>
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
                            <button onClick={() => setAssignModal(null)} style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
