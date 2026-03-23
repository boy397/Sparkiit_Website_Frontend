"use client";

import React, { useState, useEffect, useCallback } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/admin";


interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    allowedSections: string[];
    createdAt: string;
}

const AVAILABLE_SECTIONS = [
    { key: "DASHBOARD", label: "Dashboard" },
    { key: "STUDENT_USERS_MANAGEMENT", label: "Student Users Management" },
    { key: "MANAGE_PROJECTS", label: "Manage Projects" },
    { key: "CERTIFICATE_BUILDER", label: "Certificate Builder" },
    { key: "CERTIFICATE_MANAGEMENT", label: "Certificate Management" },
    { key: "BADGES", label: "Badges" },
    { key: "MANAGE_ORDERS", label: "Manage Orders" },
    { key: "MANAGE_COUPONS", label: "Manage Coupons" },
    { key: "WITHDRAW_PAYMENTS", label: "Withdraw Payments" },
    { key: "LOCATIONS", label: "Locations" },
    { key: "CMS_USER", label: "CMS User (Admin Management)" },
    { key: "ATTENDANCE_LOGS", label: "Attendance Logs" },
    { key: "MANAGE_COURSES", label: "Manage Courses" },
    { key: "MANAGE_BLOGS", label: "Manage Blogs" },
    { key: "MANAGE_SERVICES", label: "Manage Services" },
    { key: "SECTIONS", label: "Sections" },
    { key: "BRANDS", label: "Brands" },
    { key: "MANAGE_MENTORS", label: "Manage Mentors" },
    { key: "MANAGE_EVENTS", label: "Manage Events" },
    { key: "FOOTER_SETTINGS", label: "Footer Settings" },
    { key: "MENU_BUILDER", label: "Menu Builder" },
    { key: "PAGE_BUILDER", label: "Page Builder" },
    { key: "SOCIAL_LINKS", label: "Social Links" },
    { key: "FAQS", label: "FAQs" },
    { key: "SETTINGS", label: "Settings" }
];

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'HR', 'TEAM_LEADER', 'MANAGER', 'BDE', 'BDA', 'USER'];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [form, setForm] = useState({ 
        username: "", 
        email: "", 
        password: "", 
        role: "ADMIN",
        allowedSections: [] as string[]
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchUsers = useCallback(() => {
        const token = localStorage.getItem("adminToken");
        fetch(`${API_BASE}/users`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((r) => r.json())
            .then((d) => { if (d.data) setUsers(d.data); })
            .catch(() => { });
            
        // Fetch current user details to know permissions
        fetch(`${API_BASE}/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((r) => r.json())
            .then((d) => { if (d.data) setCurrentUser(d.data); })
            .catch(() => { });
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleSave = async () => {
        setSaving(true);
        setError("");
        const token = localStorage.getItem("adminToken");
        try {
            const url = editingUserId 
                ? `${API_BASE}/users/${editingUserId}/role` 
                : `${API_BASE}/register`;
            
            const method = editingUserId ? "PUT" : "POST";
            
            const payload: any = { ...form };
            if (editingUserId) {
                // Remove password and username/email if editing (since backend only updates role/sections currently)
                delete payload.password;
                delete payload.username;
                delete payload.email;
            }

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                setModalOpen(false);
                setForm({ username: "", email: "", password: "", role: "ADMIN", allowedSections: [] });
                setEditingUserId(null);
                fetchUsers();
            } else {
                setError(data.message || "Failed to save user");
            }
        } catch { setError("Server error"); }
        setSaving(false);
    };

    const handleEdit = (user: User) => {
        setForm({
            username: user.username,
            email: user.email,
            password: "",
            role: user.role,
            allowedSections: user.allowedSections || []
        });
        setEditingUserId(user._id);
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this admin?")) return;
        const token = localStorage.getItem("adminToken");
        await fetch(`${API_BASE}/users/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        fetchUsers();
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
        marginBottom: 16
    };

    return (
        <div className="pb-20">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>User Management</h2>
                {currentUser && (
                    <button
                        onClick={() => {
                            setEditingUserId(null);
                            setForm({ 
                                username: "", email: "", password: "", 
                                role: currentUser.role === 'SUPER_ADMIN' ? 'ADMIN' : currentUser.role, 
                                allowedSections: [] 
                            });
                            setModalOpen(true);
                        }}
                        style={{
                            padding: "10px 24px",
                            borderRadius: 10,
                            background: "#00875a",
                            color: "#ffffff",
                            fontWeight: 700,
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        Create User
                    </button>
                )}
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            {["Username", "Email", "Role", "Created", "Actions"].map((h) => (
                                <th key={h} style={{ padding: "16px 20px", fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", textAlign: "left" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                <td style={{ padding: "16px 20px", color: "#fff", fontWeight: 500 }}>{u.username}</td>
                                <td style={{ padding: "16px 20px", color: "rgba(255,255,255,0.6)" }}>{u.email}</td>
                                <td style={{ padding: "16px 20px" }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: u.role === "SUPER_ADMIN" ? "rgba(0,135,90,0.1)" : "rgba(129,140,248,0.1)", color: u.role === "SUPER_ADMIN" ? "#00875a" : "#818cf8" }}>
                                        {u.role}
                                    </span>
                                </td>
                                <td style={{ padding: "16px 20px", color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: "16px 20px" }}>
                                    {currentUser && u.role !== "SUPER_ADMIN" && (currentUser.role === "SUPER_ADMIN" || ROLES.indexOf(currentUser.role) <= ROLES.indexOf(u.role)) && (
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <button onClick={() => handleEdit(u)} style={{ color: "#00875a", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Edit</button>
                                            <button onClick={() => handleDelete(u._id)} style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Delete</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setModalOpen(false)}>
                    <div style={{ background: "#141414", borderRadius: 24, padding: 32, width: 450, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontSize: 20, color: "#fff", marginBottom: 24 }}>{editingUserId ? "Edit User Permissions" : "Create New User"}</h2>
                        {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 16 }}>{error}</p>}
                        
                        {!editingUserId && (
                            <>
                                <input style={inputStyle} placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                                <input style={inputStyle} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                <input style={inputStyle} type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                            </>
                        )}
                        {editingUserId && (
                            <div style={{ marginBottom: 16 }}>
                                <p style={{ color: "#00875a", fontSize: 14, fontWeight: 600 }}>Editing: {form.username} ({form.email})</p>
                            </div>
                        )}

                        <select style={inputStyle} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                            {ROLES.filter(r => currentUser?.role === "SUPER_ADMIN" || (ROLES.indexOf(currentUser?.role || "USER") <= ROLES.indexOf(r) && r !== "SUPER_ADMIN")).map(role => (
                                <option key={role} value={role} style={{ background: "#141414", color: "#fff" }}>{role.replace('_', ' ')}</option>
                            ))}
                        </select>

                        <div style={{ marginTop: 20 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <h3 style={{ color: "#fff", fontSize: 16, margin: 0 }}>Section Permissions</h3>
                                {currentUser?.role === "SUPER_ADMIN" && (
                                    <button 
                                        onClick={() => {
                                            if (form.allowedSections.length === AVAILABLE_SECTIONS.length) {
                                                setForm({ ...form, allowedSections: [] });
                                            } else {
                                                setForm({ ...form, allowedSections: AVAILABLE_SECTIONS.map(s => s.key) });
                                            }
                                        }}
                                        style={{ background: "none", border: "none", color: "#00875a", fontSize: 12, cursor: "pointer", fontWeight: 600 }}
                                    >
                                        {form.allowedSections.length === AVAILABLE_SECTIONS.length ? "Deselect All" : "Select All"}
                                    </button>
                                )}
                            </div>
                            
                            {!currentUser && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Loading permissions...</p>}
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                {AVAILABLE_SECTIONS.map((section) => {
                                    // A user can only grant permissions they themselves have, unless they are SUPER_ADMIN
                                    if (currentUser?.role !== "SUPER_ADMIN" && !currentUser?.allowedSections?.includes(section.key)) {
                                        return null;
                                    }
                                    const isChecked = form.allowedSections.includes(section.key);
                                    return (
                                        <label key={section.key} style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer" }}>
                                            <input 
                                                type="checkbox" 
                                                checked={isChecked}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setForm({ ...form, allowedSections: [...form.allowedSections, section.key] });
                                                    } else {
                                                        setForm({ ...form, allowedSections: form.allowedSections.filter(k => k !== section.key) });
                                                    }
                                                }}
                                                style={{ accentColor: "#00875a" }}
                                            />
                                            {section.label}
                                        </label>
                                    )
                                })}
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12, marginTop: 32, justifyContent: "flex-end" }}>
                            <button onClick={handleSave} disabled={saving} style={{ padding: "12px 24px", borderRadius: 12, background: "#00875a", color: "#ffffff", fontWeight: 700, border: "none", cursor: "pointer" }}>{saving ? "Saving..." : "Save User"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
