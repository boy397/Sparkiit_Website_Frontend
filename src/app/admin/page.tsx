"use client";

import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000/api/admin";

interface StatsData {
    totalCourses: number;
    activeCourses: number;
    totalCandidates: number;
    activeCandidates: number;
    recentCourses: { _id: string; title: string; status: string; createdAt: string }[];
    recentCandidates: { _id: string; name: string; email: string; status: string; createdAt: string }[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE}/stats`)
            .then((r) => r.json())
            .then((d) => { setStats(d.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const cardStyle: React.CSSProperties = {
        background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: "24px 28px",
        flex: "1 1 220px",
        minWidth: 220,
    };

    const statNumber: React.CSSProperties = {
        fontSize: 40,
        fontWeight: 800,
        letterSpacing: "-0.03em",
        lineHeight: 1,
        marginBottom: 6,
    };

    const statLabel: React.CSSProperties = {
        fontSize: 13,
        fontWeight: 500,
        color: "rgba(255,255,255,0.45)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
    };

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400, color: "rgba(255,255,255,0.3)" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ width: 40, height: 40, border: "3px solid rgba(168,224,62,0.2)", borderTop: "3px solid #a8e03e", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    Loading dashboard...
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Stats Cards */}
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 32 }}>
                <div style={cardStyle}>
                    <div style={{ ...statNumber, color: "#a8e03e" }}>{stats?.totalCourses ?? 0}</div>
                    <div style={statLabel}>Total Courses</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ ...statNumber, color: "#5eead4" }}>{stats?.activeCourses ?? 0}</div>
                    <div style={statLabel}>Active Courses</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ ...statNumber, color: "#818cf8" }}>{stats?.totalCandidates ?? 0}</div>
                    <div style={statLabel}>Total Candidates</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ ...statNumber, color: "#fb923c" }}>{stats?.activeCandidates ?? 0}</div>
                    <div style={statLabel}>Active Candidates</div>
                </div>
            </div>

            {/* Recent Activity */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Recent Courses */}
                <div style={{ ...cardStyle, flex: "unset" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Recent Courses</h3>
                    {!stats?.recentCourses?.length ? (
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No courses yet. Create your first course!</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {stats.recentCourses.map((c) => (
                                <div key={c._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.04)" }}>
                                    <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>{c.title}</span>
                                    <span style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        padding: "3px 10px",
                                        borderRadius: 20,
                                        background: c.status === "active" ? "rgba(168,224,62,0.12)" : c.status === "draft" ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.06)",
                                        color: c.status === "active" ? "#a8e03e" : c.status === "draft" ? "#fbbf24" : "rgba(255,255,255,0.4)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.04em",
                                    }}>
                                        {c.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Candidates */}
                <div style={{ ...cardStyle, flex: "unset" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Recent Candidates</h3>
                    {!stats?.recentCandidates?.length ? (
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No candidates yet. Add your first candidate!</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {stats.recentCandidates.map((c) => (
                                <div key={c._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.04)" }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>{c.name}</div>
                                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{c.email}</div>
                                    </div>
                                    <span style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        padding: "3px 10px",
                                        borderRadius: 20,
                                        background: c.status === "active" ? "rgba(94,234,212,0.12)" : "rgba(255,255,255,0.06)",
                                        color: c.status === "active" ? "#5eead4" : "rgba(255,255,255,0.4)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.04em",
                                    }}>
                                        {c.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
