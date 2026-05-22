"use client";
import { API_BASE_URL } from "@/lib/api-config";
const SUPER_ADMIN_EMAIL = "sunirmal147@gmail.com";
import React, { useState, useEffect, useCallback } from "react";
import { 
    Users, Target, TrendingUp, Plus, Calendar, DollarSign, 
    Loader2, ChevronRight, CheckCircle2, XCircle, Edit3, Trash2,
    Search, RefreshCw, AlertCircle, Clock, MapPin, ExternalLink,
    UserPlus, Settings, Check, PlusCircle, Filter, Trash, ArrowRight,
    ArrowUpRight, BarChart3, PieChart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = API_BASE_URL + "/api/admin";

const ROLE_BADGE: Record<string, { bg: string; color: string }> = {
    ADMIN: { bg: "rgba(129,140,248,0.1)", color: "#818cf8" },
    TEAM_LEADER: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
    MANAGER: { bg: "rgba(251,146,60,0.1)", color: "#fb923c" },
    HR: { bg: "rgba(232,121,249,0.1)", color: "#e879f9" },
    BDE: { bg: "rgba(34,211,238,0.1)", color: "#22d3ee" },
    BDA: { bg: "rgba(134,239,172,0.1)", color: "#86efac" },
    USER: { bg: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" },
};

const ACCENT = "#00875a";

interface TargetForm {
    title: string;
    startDate: string;
    endDate: string;
    targetRevenue: number;
    targetCount: number;
    manualAdjustmentAmount: number;
    manualAdjustmentCount: number;
}

const defaultForm: TargetForm = {
    title: "",
    startDate: "",
    endDate: "",
    targetRevenue: 0,
    targetCount: 0,
    manualAdjustmentAmount: 0,
    manualAdjustmentCount: 0,
};

export default function ManageTeamPage() {
    const [team, setTeam] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [performanceData, setPerformanceData] = useState<any[]>([]);
    const [perfLoading, setPerfLoading] = useState(false);
    
    // Modals
    const [showTargetModal, setShowTargetModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [editingTarget, setEditingTarget] = useState<any>(null);
    
    const [submitting, setSubmitting] = useState(false);
    const [targetForm, setTargetForm] = useState<TargetForm>(defaultForm);
    const [search, setSearch] = useState("");
    const [assignSearch, setAssignSearch] = useState("");
    
    // Date Filtering
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [view, setView] = useState<"performance" | "attendance">("performance");
    
    const [teamSummary, setTeamSummary] = useState<any>(null);
    const [teamAttendance, setTeamAttendance] = useState<any[]>([]);
    const [summaryLoading, setSummaryLoading] = useState(false);

    // SUPER_ADMIN features
    const [viewingAsLeadId, setViewingAsLeadId] = useState<string | null>(null);
    const [leads, setLeads] = useState<any[]>([]);

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchTeam = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const leadIdQuery = viewingAsLeadId ? `?leadId=${viewingAsLeadId}` : "";
            const res = await fetch(`${API_BASE}/employees/team${leadIdQuery}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setTeam(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [viewingAsLeadId]);

    const fetchAllUsers = useCallback(async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/employees/all-users`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                // Hide superadmin from everyone else in all lists
                const currentAdmin = JSON.parse(localStorage.getItem("adminUser") || "{}");
                const isActuallySuperAdmin = currentAdmin?.role === 'SUPER_ADMIN' && currentAdmin?.email === SUPER_ADMIN_EMAIL;
                
                const filteredData = data.data.filter((u: any) => {
                    if (u.role === 'SUPER_ADMIN') {
                        if (u.email !== SUPER_ADMIN_EMAIL) return false;
                        return isActuallySuperAdmin;
                    }
                    return true;
                });

                setAllUsers(filteredData);
                const potentialLeads = filteredData.filter((u: any) => ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEADER', 'MANAGER'].includes(u.role));
                setLeads(potentialLeads);
            }
        } catch (err) {}
    }, []);

    const fetchTeamSummary = useCallback(async () => {
        setSummaryLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const leadIdQuery = viewingAsLeadId ? `&leadId=${viewingAsLeadId}` : "";
            const dateQuery = (customStart && customEnd) ? `&customStart=${customStart}&customEnd=${customEnd}` : "";
            
            const res = await fetch(`${API_BASE}/employees/team-summary?t=${Date.now()}${leadIdQuery}${dateQuery}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setTeamSummary(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setSummaryLoading(false);
        }
    }, [viewingAsLeadId, customStart, customEnd]);

    const fetchTeamAttendance = useCallback(async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const leadIdQuery = viewingAsLeadId ? `?leadId=${viewingAsLeadId}` : "";
            const res = await fetch(`${API_BASE}/employees/team-attendance${leadIdQuery}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setTeamAttendance(data.data);
        } catch (err) {
            console.error(err);
        }
    }, [viewingAsLeadId]);

    useEffect(() => {
        const stored = localStorage.getItem("adminUser");
        if (stored) {
            const user = JSON.parse(stored);
            setCurrentUser(user);
            const isActuallySuperAdmin = user.role === 'SUPER_ADMIN' && user.email === SUPER_ADMIN_EMAIL;
            if (isActuallySuperAdmin && !viewingAsLeadId) {
                setViewingAsLeadId(user._id);
            }
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchTeam();
            fetchTeamSummary();
            fetchTeamAttendance();
            fetchAllUsers();
        }
    }, [currentUser, fetchTeam, fetchTeamSummary, fetchTeamAttendance, fetchAllUsers]);

    const fetchUserPerformance = useCallback(async (userId: string) => {
        setPerfLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const dateQuery = (customStart && customEnd) ? `?customStart=${customStart}&customEnd=${customEnd}` : "";
            const res = await fetch(`${API_BASE}/employees/performance/${userId}${dateQuery}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setPerformanceData(data.data);
            else setPerformanceData([]);
        } catch (err) {
            console.error(err);
            setPerformanceData([]);
        } finally {
            setPerfLoading(false);
        }
    }, [customStart, customEnd]);

    const handleSetTarget = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/employees/target`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ 
                    ...targetForm, 
                    userId: selectedUser._id,
                    ...(editingTarget ? { _id: editingTarget._id } : {})
                })
            });
            const data = await res.json();
            if (data.success) {
                setShowTargetModal(false);
                setEditingTarget(null);
                setTargetForm(defaultForm);
                fetchUserPerformance(selectedUser._id);
                fetchTeamSummary();
                showToast("Target saved successfully!");
            } else {
                showToast(data.message || "Failed to save target", "error");
            }
        } catch (err) {
            showToast("Server error", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleAssignMembers = async (memberIds: string[]) => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/employees/assign`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ 
                    userIds: memberIds,
                    reportingTo: viewingAsLeadId || currentUser?._id
                })
            });
            const data = await res.json();
            if (data.success) {
                fetchTeam();
                fetchTeamSummary();
                fetchAllUsers();
                showToast(data.message);
            } else {
                showToast(data.message, "error");
            }
        } catch (err) {
            showToast("Server error", "error");
        }
    };

    const handleDeleteTarget = async (targetId: string) => {
        if (!confirm("Delete this target? This cannot be undone.")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/employees/target/${targetId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                fetchUserPerformance(selectedUser._id);
                fetchTeamSummary();
                showToast("Target deleted.");
            } else {
                showToast(data.message || "Delete failed", "error");
            }
        } catch {
            showToast("Server error", "error");
        }
    };

    const openEditTarget = (perf: any) => {
        setEditingTarget(perf);
        setTargetForm({
            title: perf.title,
            startDate: perf.startDate?.slice(0, 10) || "",
            endDate: perf.endDate?.slice(0, 10) || "",
            targetRevenue: perf.targetRevenue || 0,
            targetCount: perf.targetCount || 0,
            manualAdjustmentAmount: perf.manualAdjustmentAmount || 0,
            manualAdjustmentCount: perf.manualAdjustmentCount || 0,
        });
        setShowTargetModal(true);
    };

    const filteredTeam = team.filter(u =>
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.role?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    const filteredAllUsers = allUsers.filter(u =>
        u.username?.toLowerCase().includes(assignSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(assignSearch.toLowerCase())
    );

    const totalTargets = performanceData.length;
    const completedTargets = performanceData.filter(p => p.achievedRevenue >= p.targetRevenue && p.achievedCount >= p.targetCount).length;
    const totalRevenue = performanceData.reduce((s, p) => s + (p.achievedRevenue || 0), 0);
    const totalRevenueTarget = performanceData.reduce((s, p) => s + (p.targetRevenue || 0), 0);

    const isDateFilterActive = !!(customStart && customEnd);

    if (loading && team.length === 0) return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 16 }}>
            <Loader2 style={{ animation: "spin 1s linear infinite", color: ACCENT }} size={40} />
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.3em" }}>Loading Team Data...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div style={{ maxWidth: 1300, margin: "0 auto", paddingBottom: 60 }}>
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{ position: "fixed", top: 80, right: 24, zIndex: 999, padding: "12px 20px", borderRadius: 12, background: toast.type === "success" ? "rgba(0,135,90,0.9)" : "rgba(220,38,38,0.9)", color: "#fff", fontWeight: 700, fontSize: 13, backdropFilter: "blur(10px)", border: `1px solid ${toast.type === "success" ? "rgba(0,200,120,0.3)" : "rgba(255,100,100,0.3)"}`, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
                    >
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sticky Date Filter Bar */}
            <div style={{ position: "sticky", top: 80, zIndex: 50, marginBottom: 24, background: "rgba(10,10,10,0.8)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: isDateFilterActive ? ACCENT : "rgba(255,255,255,0.3)" }}>
                        <Filter size={16} />
                        <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>Custom Period Filter</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <DateInput value={customStart} onChange={(e: any) => setCustomStart(e.target.value)} placeholder="Start Date" />
                        <ArrowRight size={14} style={{ color: "rgba(255,255,255,0.1)" }} />
                        <DateInput value={customEnd} onChange={(e: any) => setCustomEnd(e.target.value)} placeholder="End Date" />
                    </div>
                    {isDateFilterActive && (
                        <button 
                            onClick={() => { setCustomStart(""); setCustomEnd(""); }}
                            style={{ background: "rgba(220,38,38,0.1)", color: "#ef4444", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 10, fontWeight: 800, cursor: "pointer", textTransform: "uppercase" }}
                        >
                            Reset
                        </button>
                    )}
                </div>
                {summaryLoading && <div style={{ display: "flex", alignItems: "center", gap: 8, color: ACCENT, fontSize: 10, fontWeight: 700 }}><Loader2 size={12} className="animate-spin" /> Recalculating...</div>}
            </div>

            {/* Header */}
            <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
                <div>
                    <h1 style={{ fontSize: 34, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "-0.04em", margin: 0 }}>
                        Team <span style={{ color: ACCENT }}>Management</span>
                    </h1>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.3em", fontWeight: 700, margin: 0 }}>
                            { (currentUser?.role === 'SUPER_ADMIN' && currentUser?.email === SUPER_ADMIN_EMAIL) ? "Organization View" : `${currentUser?.username} · ${team.length} Members`}
                        </p>
                        {currentUser?.role === 'SUPER_ADMIN' && currentUser?.email === SUPER_ADMIN_EMAIL && (
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 20, paddingLeft: 20, borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
                                <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", whiteSpace: "nowrap" }}>Managing Lead:</span>
                                <select 
                                    value={viewingAsLeadId || ""} 
                                    onChange={(e) => setViewingAsLeadId(e.target.value)}
                                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", borderRadius: 10, padding: "6px 12px", fontSize: 11, fontWeight: 700, outline: "none", cursor: "pointer" }}
                                >
                                    {leads.map(l => (
                                        <option key={l._id} value={l._id} style={{ background: "#141414" }}>{l.username} ({l.role})</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <button 
                        onClick={() => { setSelectedUser(null); setView("performance"); }}
                        style={{ background: !selectedUser && view === "performance" ? ACCENT : "rgba(255,255,255,0.03)", color: !selectedUser && view === "performance" ? "#000" : "rgba(255,255,255,0.4)", padding: "10px 18px", borderRadius: 10, fontSize: 12, fontWeight: 800, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
                    >
                        <BarChart3 size={16} /> Overview
                    </button>
                    <button 
                        onClick={() => { setSelectedUser(null); setView("attendance"); }}
                        style={{ background: !selectedUser && view === "attendance" ? ACCENT : "rgba(255,255,255,0.03)", color: !selectedUser && view === "attendance" ? "#000" : "rgba(255,255,255,0.4)", padding: "10px 18px", borderRadius: 10, fontSize: 12, fontWeight: 800, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
                    >
                        <Clock size={16} /> Attendance
                    </button>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
                {/* ─── LEFT SIDEBAR: Team List ─── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* Organization Quick Actions */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 24, padding: 20 }}>
                        <h4 style={{ fontSize: 10, fontWeight: 900, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Organization Actions</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <button 
                                onClick={() => setShowAssignModal(true)} 
                                style={{ width: "100%", background: `${ACCENT}15`, border: `1px solid ${ACCENT}30`, color: ACCENT, borderRadius: 12, padding: "12px", fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s" }}
                                onMouseEnter={(e) => e.currentTarget.style.background = `${ACCENT}25`}
                                onMouseLeave={(e) => e.currentTarget.style.background = `${ACCENT}15`}
                            >
                                <UserPlus size={16} /> Manage Members
                            </button>
                        </div>
                    </div>

                    {/* Team List */}
                    <div>
                        <div style={{ position: "relative", marginBottom: 16 }}>
                            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                            <input
                                type="text"
                                placeholder="Search team member..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ width: "100%", padding: "10px 12px 10px 34px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                            />
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                <Users size={12} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />Team ({team.length})
                            </span>
                            <button onClick={fetchTeam} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", padding: 4, borderRadius: 6 }} title="Refresh">
                                <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {filteredTeam.map((user) => {
                                const badge = ROLE_BADGE[user.role] || ROLE_BADGE.USER;
                                const isSelected = selectedUser?._id === user._id;
                                return (
                                    <button
                                        key={user._id}
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setView("performance");
                                            setPerformanceData([]);
                                            fetchUserPerformance(user._id);
                                        }}
                                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, border: `1px solid ${isSelected ? `${ACCENT}44` : "rgba(255,255,255,0.05)"}`, background: isSelected ? `${ACCENT}0d` : "rgba(255,255,255,0.02)", cursor: "pointer", transition: "all 0.2s" }}
                                    >
                                        <div style={{ width: 38, height: 38, borderRadius: 10, background: isSelected ? ACCENT : "rgba(255,255,255,0.08)", color: isSelected ? "#000" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, flexShrink: 0 }}>
                                            {user.username?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div style={{ textAlign: "left", flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                            <h4 style={{ fontSize: 13, fontWeight: 800, color: "#fff", margin: 0, textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.2 }}>{user.username}</h4>
                                            <div style={{ marginTop: 4 }}>
                                                <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: badge.bg, color: badge.color, display: "inline-block", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                                                    {user.role.replace(/_/g, " ")}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight size={14} style={{ color: isSelected ? ACCENT : "rgba(255,255,255,0.1)" }} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ─── RIGHT PANEL ─── */}
                <div style={{ minHeight: 600 }}>
                    <AnimatePresence mode="wait">
                        {selectedUser ? (
                            <motion.div
                                key={selectedUser._id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* User View Header */}
                                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, padding: "32px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 32 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                                        <div style={{ width: 80, height: 80, borderRadius: 24, background: `linear-gradient(135deg, ${ACCENT}, #006644)`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 36, boxShadow: `0 12px 40px ${ACCENT}40` }}>
                                            {selectedUser.username?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                <h2 style={{ fontSize: 32, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "-0.03em", margin: 0 }}>
                                                    {selectedUser.username}
                                                </h2>
                                                <span style={{ padding: "4px 10px", borderRadius: 8, background: (ROLE_BADGE[selectedUser.role] || ROLE_BADGE.USER).bg, color: (ROLE_BADGE[selectedUser.role] || ROLE_BADGE.USER).color, fontSize: 10, fontWeight: 800 }}>{selectedUser.role}</span>
                                            </div>
                                            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: "8px 0 0", fontWeight: 600 }}>
                                                {selectedUser.email} · ID: {selectedUser._id.slice(-6).toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: 8, background: "rgba(255,255,255,0.03)", padding: 6, borderRadius: 14 }}>
                                        <button 
                                            onClick={() => setView("performance")}
                                            style={{ padding: "10px 20px", borderRadius: 10, background: view === "performance" ? "rgba(255,255,255,0.1)" : "transparent", color: view === "performance" ? "#fff" : "rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 800, border: "none", cursor: "pointer", transition: "all 0.2s" }}
                                        >
                                            Stats
                                        </button>
                                        <button 
                                            onClick={() => setView("attendance")}
                                            style={{ padding: "10px 20px", borderRadius: 10, background: view === "attendance" ? "rgba(255,255,255,0.1)" : "transparent", color: view === "attendance" ? "#fff" : "rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 800, border: "none", cursor: "pointer", transition: "all 0.2s" }}
                                        >
                                            Logs
                                        </button>
                                    </div>
                                </div>

                                {view === "performance" ? (
                                    <>
                                        {isDateFilterActive && (
                                            <div style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}20`, borderRadius: 16, padding: "16px 20px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <div>
                                                    <span style={{ fontSize: 10, fontWeight: 900, color: ACCENT, textTransform: "uppercase", letterSpacing: "0.1em" }}>Custom Period Summary</span>
                                                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                                                        Showing performance between <b style={{ color: "#fff" }}>{new Date(customStart).toLocaleDateString()}</b> and <b style={{ color: "#fff" }}>{new Date(customEnd).toLocaleDateString()}</b>
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", gap: 24 }}>
                                                    <div>
                                                        <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", textAlign: "right" }}>Period Revenue</div>
                                                        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", textAlign: "right" }}>₹{totalRevenue.toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                            <h3 style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Target Milestones</h3>
                                            <button 
                                                onClick={() => { setEditingTarget(null); setTargetForm(defaultForm); setShowTargetModal(true); }}
                                                style={{ background: ACCENT, color: "#000", padding: "10px 20px", borderRadius: 12, fontWeight: 800, textTransform: "uppercase", fontSize: 11, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                                            >
                                                <Plus size={14} /> New Target
                                            </button>
                                        </div>

                                        {performanceData.length > 0 && (
                                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
                                                <MiniStat icon={<Target size={16} />} label="Total Targets" value={totalTargets} />
                                                <MiniStat icon={<CheckCircle2 size={16} />} label="Completed" value={completedTargets} accent />
                                                <MiniStat icon={<DollarSign size={16} />} label="Achieved" value={`₹${totalRevenue.toLocaleString()}`} />
                                                <MiniStat icon={<TrendingUp size={16} />} label="Avg. Efficiency" value={totalRevenueTarget > 0 ? `${Math.round((totalRevenue / totalRevenueTarget) * 100)}%` : "N/A"} />
                                            </div>
                                        )}

                                        {perfLoading ? (
                                            <div style={{ padding: 100, textAlign: "center" }}><Loader2 className="animate-spin" style={{ margin: "0 auto", color: ACCENT }} /></div>
                                        ) : performanceData.length === 0 ? (
                                            <EmptyState icon={<Target size={40} />} title="No Active Targets" subtitle={`Define a revenue goal for ${selectedUser.username} to track progress.`} />
                                        ) : (
                                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 16 }}>
                                                {performanceData.map((perf) => (
                                                    <PerformanceCard key={perf._id} perf={perf} onEdit={() => openEditTarget(perf)} onDelete={() => handleDeleteTarget(perf._id)} />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <AttendanceList logs={teamAttendance.filter(l => l.user?._id === selectedUser._id)} />
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key={view === "performance" ? "team-dashboard" : "team-attendance"}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {view === "performance" ? (
                                    <>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                                            <div>
                                                <h2 style={{ fontSize: 24, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "-0.03em", margin: 0 }}>Team Performance Insight</h2>
                                                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Real-time aggregation {isDateFilterActive ? "for selected custom period" : "for all current targets"}.</p>
                                            </div>
                                            <button onClick={fetchTeamSummary} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "rgba(255,255,255,0.3)", borderRadius: 8, padding: 8, cursor: "pointer" }}><RefreshCw size={16} className={summaryLoading ? "animate-spin" : ""} /></button>
                                        </div>

                                        {summaryLoading ? (
                                            <div style={{ padding: 100, textAlign: "center" }}><Loader2 className="animate-spin" style={{ margin: "0 auto", color: ACCENT }} /></div>
                                        ) : teamSummary ? (
                                            <>
                                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
                                                    <StatCard label="Active Members" value={teamSummary.memberCount} icon={<Users />} />
                                                    <StatCard label="Total Revenue" value={`₹${teamSummary.achievedRevenue.toLocaleString()}`} icon={<DollarSign />} accent />
                                                    <StatCard label={isDateFilterActive ? "Period Goal" : "Total Goal"} value={`₹${teamSummary.totalTargetRevenue.toLocaleString()}`} icon={<Target />} />
                                                    <StatCard label="Efficiency Index" value={teamSummary.totalTargetRevenue > 0 ? `${Math.round((teamSummary.achievedRevenue / teamSummary.totalTargetRevenue) * 100)}%` : "0%"} icon={<TrendingUp />} />
                                                </div>

                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                                    {/* Revenue Source Analysis */}
                                                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 24, padding: 24 }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                                                            <PieChart size={18} style={{ color: "rgba(255,255,255,0.3)" }} />
                                                            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0, textTransform: "uppercase" }}>Revenue Composition</h3>
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                                            <div>
                                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                                                                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Razorpay Payments</span>
                                                                    <span style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>₹{teamSummary.systemRevenue.toLocaleString()}</span>
                                                                </div>
                                                                <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(teamSummary.systemRevenue / (teamSummary.achievedRevenue || 1)) * 100}%` }} transition={{ duration: 1 }} style={{ height: "100%", background: ACCENT, borderRadius: 4 }} />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                                                                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>External Adjustments</span>
                                                                    <span style={{ fontSize: 15, fontWeight: 900, color: "#f59e0b" }}>₹{teamSummary.manualRevenue.toLocaleString()}</span>
                                                                </div>
                                                                <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(teamSummary.manualRevenue / (teamSummary.achievedRevenue || 1)) * 100}%` }} transition={{ duration: 1 }} style={{ height: "100%", background: "#f59e0b", borderRadius: 4 }} />
                                                                </div>
                                                            </div>
                                                            <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: 16, marginTop: 4 }}>
                                                                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.3)" }}>
                                                                    <AlertCircle size={14} />
                                                                    <p style={{ fontSize: 11, fontWeight: 500, margin: 0, lineHeight: 1.5 }}>
                                                                        Total revenue represents the sum of all successful course enrollments and manual sales adjustments {isDateFilterActive ? "within the selected period" : "for all current targets"}.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Velocity Meter */}
                                                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 24, padding: 24 }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                                                            <TrendingUp size={18} style={{ color: "rgba(255,255,255,0.3)" }} />
                                                            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0, textTransform: "uppercase" }}>Overall Velocity</h3>
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                                            <div style={{ position: "relative", width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                {/* Simple Circle Progress */}
                                                                <svg width="140" height="140" viewBox="0 0 140 140">
                                                                    <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                                                                    <motion.circle 
                                                                        cx="70" cy="70" r="60" fill="none" stroke={ACCENT} strokeWidth="12" strokeDasharray="377" 
                                                                        initial={{ strokeDashoffset: 377 }} 
                                                                        animate={{ strokeDashoffset: 377 - (377 * Math.min(teamSummary.achievedRevenue / (teamSummary.totalTargetRevenue || 1), 1)) }} 
                                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                                        strokeLinecap="round"
                                                                    />
                                                                </svg>
                                                                <div style={{ position: "absolute", textAlign: "center" }}>
                                                                    <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{teamSummary.totalTargetRevenue > 0 ? Math.round((teamSummary.achievedRevenue / teamSummary.totalTargetRevenue) * 100) : 0}%</div>
                                                                    <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>Fulfilled</div>
                                                                </div>
                                                            </div>
                                                            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 20, lineHeight: 1.6, maxWidth: 200 }}>
                                                                Current team trajectory shows <br/><b style={{ color: teamSummary.achievedRevenue >= teamSummary.totalTargetRevenue ? ACCENT : "#f59e0b" }}>{teamSummary.achievedRevenue >= teamSummary.totalTargetRevenue ? "Optimal Growth" : "Moderate Activity"}</b> output.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <EmptyState icon={<Users size={40} />} title="No Team Data" subtitle="Select a lead or date range to populate team-wide intelligence." />
                                        )}
                                    </>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "-0.03em", margin: 0 }}>Team Attendance Logs</h2>
                                            <button onClick={fetchTeamAttendance} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "rgba(255,255,255,0.3)", borderRadius: 8, padding: 8, cursor: "pointer" }}><RefreshCw size={16} /></button>
                                        </div>
                                        <AttendanceList logs={teamAttendance} />
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Target Modal */}
            <AnimatePresence>
                {showTargetModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}
                        onClick={() => setShowTargetModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 28, width: "100%", maxWidth: 600, padding: 36, position: "relative" }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 style={{ fontSize: 22, fontWeight: 900, color: "#fff", textTransform: "uppercase", marginBottom: 4 }}>{editingTarget ? "Edit" : "Assign"} Target</h3>
                            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 32 }}>For {selectedUser?.username}</p>
                            
                            <form onSubmit={handleSetTarget} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <Label>Target Title</Label>
                                    <Input required value={targetForm.title} onChange={(e: any) => setTargetForm({ ...targetForm, title: e.target.value })} placeholder="e.g. Q4 Growth Sprint" />
                                </div>
                                <div style={{ gridColumn: "1 / 1" }}>
                                    <Label>Start Date</Label>
                                    <Input type="date" required value={targetForm.startDate} onChange={(e: any) => setTargetForm({ ...targetForm, startDate: e.target.value })} />
                                </div>
                                <div style={{ gridColumn: "2 / 2" }}>
                                    <Label>End Date</Label>
                                    <Input type="date" required value={targetForm.endDate} onChange={(e: any) => setTargetForm({ ...targetForm, endDate: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Revenue Target (₹)</Label>
                                    <Input type="number" value={targetForm.targetRevenue} onChange={(e: any) => setTargetForm({ ...targetForm, targetRevenue: parseFloat(e.target.value) || 0 })} />
                                </div>
                                <div>
                                    <Label>Sales Count Target</Label>
                                    <Input type="number" value={targetForm.targetCount} onChange={(e: any) => setTargetForm({ ...targetForm, targetCount: parseInt(e.target.value) || 0 })} />
                                </div>
                                <div style={{ gridColumn: "1 / -1", height: 1, background: "rgba(255,255,255,0.05)", margin: "10px 0" }} />
                                <div>
                                    <Label accent>Manual Revenue Adj.</Label>
                                    <Input type="number" value={targetForm.manualAdjustmentAmount} onChange={(e: any) => setTargetForm({ ...targetForm, manualAdjustmentAmount: parseFloat(e.target.value) || 0 })} style={{ borderColor: "rgba(245,158,11,0.2)" }} />
                                </div>
                                <div>
                                    <Label accent>Manual Sales Adj.</Label>
                                    <Input type="number" value={targetForm.manualAdjustmentCount} onChange={(e: any) => setTargetForm({ ...targetForm, manualAdjustmentCount: parseInt(e.target.value) || 0 })} style={{ borderColor: "rgba(245,158,11,0.2)" }} />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={{ gridColumn: "1 / -1", background: ACCENT, color: "#000", padding: 14, borderRadius: 12, fontWeight: 900, textTransform: "uppercase", fontSize: 13, border: "none", cursor: "pointer", marginTop: 20, opacity: submitting ? 0.6 : 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}
                                >
                                    {submitting && <Loader2 className="animate-spin" size={16} />} 
                                    {editingTarget ? "Update Target" : "Assign Target"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Manage Team Assignment Modal */}
            <AnimatePresence>
                {showAssignModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)" }}
                        onClick={() => setShowAssignModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 32, width: "100%", maxWidth: 800, padding: 0, position: "relative", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div style={{ padding: "32px 32px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <h3 style={{ fontSize: 24, fontWeight: 900, color: "#fff", textTransform: "uppercase", marginBottom: 6 }}>Manage Organization <span style={{ color: ACCENT }}>Assignments</span></h3>
                                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>Assign a user to report to <b style={{ color: "#fff" }}>{leads.find(l => l._id === (viewingAsLeadId || currentUser?._id))?.username}</b>.</p>
                                    </div>
                                    <button onClick={() => setShowAssignModal(false)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "rgba(255,255,255,0.4)", borderRadius: 12, padding: 10, cursor: "pointer" }}><XCircle size={18} /></button>
                                </div>
                                <div style={{ position: "relative", marginTop: 24 }}>
                                    <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.2)" }} />
                                    <input 
                                        type="text" 
                                        placeholder="Search across all organization users..." 
                                        value={assignSearch}
                                        onChange={e => setAssignSearch(e.target.value)}
                                        style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "14px 14px 14px 48px", color: "#fff", outline: "none", fontSize: 14 }}
                                    />
                                </div>
                            </div>

                            {/* Modal Content - Two Column (Assign + Quick Create) */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", flex: 1, overflow: "hidden" }}>
                                {/* User List Column */}
                                <div style={{ overflowY: "auto", padding: 24, paddingRight: 12 }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                        {filteredAllUsers.length > 0 ? filteredAllUsers.map(u => {
                                            const activeLeadId = viewingAsLeadId || currentUser?._id;
                                            const isSubordinate = team.some(t => t._id === u._id);
                                            const roleBadge = ROLE_BADGE[u.role] || ROLE_BADGE.USER;
                                            const reportsToOther = u.reportingTo && u.reportingTo !== activeLeadId;
                                            
                                            return (
                                                <div key={u._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: `1px solid ${isSubordinate ? `${ACCENT}40` : reportsToOther ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.04)"}` }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: isSubordinate ? ACCENT : "rgba(255,255,255,0.05)", color: isSubordinate ? "#000" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900 }}>{u.username?.charAt(0)}</div>
                                                        <div>
                                                            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{u.username}</div>
                                                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                                                <span style={{ fontSize: 9, fontWeight: 800, color: roleBadge.color, textTransform: "uppercase" }}>{u.role}</span>
                                                                {reportsToOther && <span style={{ fontSize: 9, color: "rgba(245,158,11,0.6)", fontWeight: 700 }}>· Reports elsewhere</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => {
                                                            if (isSubordinate) {
                                                                if (confirm(`Remove ${u.username} from this team?`)) handleAssignMembers(team.filter(t => t._id !== u._id).map(t => t._id));
                                                            } else {
                                                                handleAssignMembers([...team.map(t => t._id), u._id]);
                                                            }
                                                        }}
                                                        style={{ 
                                                            padding: "6px 14px", 
                                                            borderRadius: 8, 
                                                            fontSize: 10, 
                                                            fontWeight: 900, 
                                                            background: isSubordinate ? "rgba(239,68,68,0.1)" : `${ACCENT}22`,
                                                            color: isSubordinate ? "#ef4444" : ACCENT,
                                                            border: "none",
                                                            cursor: "pointer",
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.05em"
                                                        }}
                                                    >
                                                        {isSubordinate ? "Remove" : "Assign to Team"}
                                                    </button>
                                                </div>
                                            );
                                        }) : <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.2)" }}>No users found Matching your search.</div>}
                                    </div>
                                </div>

                                {/* Quick Create Column */}
                                <div style={{ background: "rgba(255,255,255,0.01)", borderLeft: "1px solid rgba(255,255,255,0.04)", padding: 24 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                                        <PlusCircle size={16} style={{ color: ACCENT }} />
                                        <span style={{ fontSize: 12, fontWeight: 800, color: "#fff", textTransform: "uppercase" }}>Quick Register</span>
                                    </div>
                                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>Create a new professional account and auto-assign them to this team.</p>
                                    
                                    <QuickRegisterForm leadId={viewingAsLeadId || currentUser?._id} onSuccess={() => { fetchTeam(); fetchAllUsers(); showToast("New professional added!"); }} />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper Components

function DateInput({ value, onChange, placeholder }: any) {
    return (
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Calendar size={14} style={{ position: "absolute", left: 12, color: value ? ACCENT : "rgba(255,255,255,0.2)", pointerEvents: "none" }} />
            <input 
                type="date" 
                value={value} 
                onChange={onChange}
                style={{ 
                    background: "rgba(255,255,255,0.03)", 
                    border: "1px solid rgba(255,255,255,0.08)", 
                    borderRadius: 12, 
                    padding: "10px 12px 10px 36px", 
                    color: "#fff", 
                    fontSize: 12, 
                    fontWeight: 700, 
                    outline: "none", 
                    colorScheme: "dark",
                    width: 150
                }}
            />
        </div>
    );
}

function QuickRegisterForm({ leadId, onSuccess }: { leadId: string; onSuccess: () => void }) {
    const [qForm, setQForm] = useState({ username: "", email: "", password: "", role: "BDE" });
    const [sub, setSub] = useState(false);

    const handleQuickRegister = async (e: any) => {
        e.preventDefault();
        setSub(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ ...qForm, reportingTo: leadId })
            });
            const data = await res.json();
            if (data.success) {
                setQForm({ username: "", email: "", password: "", role: "BDE" });
                onSuccess();
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert("Error creating user");
        } finally {
            setSub(false);
        }
    };

    return (
        <form onSubmit={handleQuickRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Input bs placeholder="Full Name" required value={qForm.username} onChange={(e: any) => setQForm({ ...qForm, username: e.target.value })} />
            <Input bs placeholder="Email ID" required type="email" value={qForm.email} onChange={(e: any) => setQForm({ ...qForm, email: e.target.value })} />
            <Input bs placeholder="Access Password" required type="password" value={qForm.password} onChange={(e: any) => setQForm({ ...qForm, password: e.target.value })} />
            <select 
                value={qForm.role} 
                onChange={(e) => setQForm({ ...qForm, role: e.target.value })}
                style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px", color: "#fff", fontSize: 13, fontWeight: 600, outline: "none" }}
            >
                <option value="BDE" style={{ background: "#111" }}>BDE (Executive)</option>
                <option value="BDA" style={{ background: "#111" }}>BDA (Associate)</option>
                <option value="TEAM_LEADER" style={{ background: "#111" }}>Team Leader</option>
                <option value="MANAGER" style={{ background: "#111" }}>Manager</option>
                <option value="HR" style={{ background: "#111" }}>HR Personnel</option>
            </select>
            <button 
                type="submit" 
                disabled={sub}
                style={{ background: ACCENT, color: "#000", padding: "14px", borderRadius: 12, fontWeight: 900, fontSize: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 8 }}
            >
                {sub ? <Loader2 size={16} className="animate-spin" /> : <>Complete Onboarding <ArrowRight size={14} /></>}
            </button>
        </form>
    );
}

function MiniStat({ icon, label, value, accent }: any) {
    return (
        <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${accent ? `${ACCENT}30` : "rgba(255,255,255,0.05)"}`, borderRadius: 16, padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: accent ? ACCENT : "rgba(255,255,255,0.2)", marginBottom: 8 }}>{icon} <span style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase" }}>{label}</span></div>
            <p style={{ fontSize: 18, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>{value}</p>
        </div>
    );
}

function StatCard({ label, value, icon, accent }: any) {
    return (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 24, padding: 24, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: accent ? `${ACCENT}20` : "rgba(255,255,255,0.05)", color: accent ? ACCENT : "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
            <div>
                <p style={{ fontSize: 10, fontWeight: 900, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.04em" }}>{value}</p>
            </div>
        </div>
    );
}

function AttendanceList({ logs }: { logs: any[] }) {
    if (logs.length === 0) return <EmptyState icon={<Clock size={40} />} title="No Logs Recorded" subtitle="Once team members start logging operations, daily activity will appear here." />;
    return (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 24, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <th style={{ padding: "14px 24px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Member</th>
                        <th style={{ padding: "14px 24px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Mode</th>
                        <th style={{ padding: "14px 24px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Timestamp</th>
                        <th style={{ padding: "14px 24px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Verification</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                            <td style={{ padding: "16px 24px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900 }}>{log.user?.username?.charAt(0)}</div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{log.user?.username}</div>
                                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{log.user?.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td style={{ padding: "16px 24px" }}>
                                <span style={{ padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 800, background: log.type === "LOGIN" ? "rgba(0,135,90,0.1)" : "rgba(245,158,11,0.1)", color: log.type === "LOGIN" ? ACCENT : "#f59e0b" }}>{log.type}</span>
                            </td>
                            <td style={{ padding: "16px 24px" }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>{new Date(log.timestamp).toLocaleDateString()}</div>
                                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{new Date(log.timestamp).toLocaleTimeString()}</div>
                            </td>
                            <td style={{ padding: "16px 24px" }}>
                                {log.photoUrl ? (
                                    <a href={log.photoUrl} target="_blank" style={{ display: "flex", alignItems: "center", gap: 6, color: ACCENT, fontSize: 11, fontWeight: 700, textDecoration: "none" }}>
                                        View Capture <ArrowUpRight size={10} />
                                    </a>
                                ) : <span style={{ opacity: 0.15 }}>—</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function EmptyState({ icon, title, subtitle }: any) {
    return (
        <div style={{ padding: "80px 40px", textAlign: "center", background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 32 }}>
            <div style={{ color: "rgba(255,255,255,0.05)", marginBottom: 16, display: "flex", justifyContent: "center" }}>{icon}</div>
            <h4 style={{ fontSize: 16, fontWeight: 900, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: 8 }}>{title}</h4>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.15)", maxWidth: 280, margin: "0 auto", lineHeight: 1.6 }}>{subtitle}</p>
        </div>
    );
}

function PerformanceCard({ perf, onEdit, onDelete }: any) {
    const revProgress = Math.min((perf.achievedRevenue / (perf.targetRevenue || 1)) * 100, 100);
    const countProgress = Math.min((perf.achievedCount / (perf.targetCount || 1)) * 100, 100);
    return (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 24, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ flex: 1, overflow: "hidden" }}>
                    <h4 style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{perf.title}</h4>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.3 }}>
                        <Calendar size={12} /> <span style={{ fontSize: 11, fontWeight: 700 }}>{new Date(perf.startDate).toLocaleDateString('en-GB')} · {new Date(perf.endDate).toLocaleDateString('en-GB')}</span>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={onEdit} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "rgba(255,255,255,0.5)", borderRadius: 8, padding: 8, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#fff"} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}><Edit3 size={14} /></button>
                    <button onClick={onDelete} style={{ background: "rgba(220,38,38,0.1)", border: "none", color: "#ef4444", borderRadius: 8, padding: 8, cursor: "pointer" }}><Trash2 size={14} /></button>
                </div>
            </div>
            
            <TargetIndicator label="Revenue Progress" current={perf.achievedRevenue} target={perf.targetRevenue} progress={revProgress} suffix="₹" color={ACCENT} />
            <div style={{ height: 20 }} />
            <TargetIndicator label="Enrollment Goal" current={perf.achievedCount} target={perf.targetCount} progress={countProgress} color="#818cf8" />
        </div>
    );
}

function TargetIndicator({ label, current, target, progress, suffix = "", color }: any) {
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 9, fontWeight: 900, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
                <span style={{ fontSize: 11, fontWeight: 900, color: "#fff" }}>{suffix}{current.toLocaleString()} / <span style={{ opacity: 0.3 }}>{suffix}{target.toLocaleString()}</span></span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: "easeOut" }} style={{ height: "100%", background: progress >= 100 ? ACCENT : color, borderRadius: 3 }} />
            </div>
        </div>
    );
}

const Input = (props: any) => <input {...props} style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: props.bs ? 12 : 10, padding: 12, color: "#fff", fontSize: props.bs ? 13 : 14, fontWeight: 500, outline: "none", boxSizing: "border-box", ...props.style }} />;
const Label = ({ children, accent }: any) => <label style={{ display: "block", fontSize: 10, fontWeight: 900, color: accent ? "#f59e0b" : "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 6, letterSpacing: "0.15em" }}>{children}</label>;
