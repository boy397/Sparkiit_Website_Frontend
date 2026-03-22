"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
    BookOpen, Users, ShoppingCart, FileText, 
    Award, Briefcase, Monitor, Ticket, 
    Wallet, ChevronRight, LayoutDashboard,
    PlusCircle, Badge, Settings2, Workflow,
    MapPin, Blocks, Copyright, PanelBottom,
    LayoutGrid, FilePlus, Hash, HelpCircle,
    HandCoins, Settings, Calendar
} from "lucide-react";

function ActionSection({ title, actions, cardStyle }: any) {
    return (
        <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 13, fontWeight: 800, color: "rgba(255, 255, 255, 0.3)", marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                {title}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
                {actions.map((action: any, i: number) => (
                    <Link key={i} href={action.link} style={{ textDecoration: "none" }}>
                        <div style={{
                            ...cardStyle,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            position: "relative",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                            e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)";
                        }}
                        >
                            <div style={{ 
                                width: 44, 
                                height: 44, 
                                borderRadius: 12, 
                                background: `${action.color}15`, 
                                color: action.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 4
                            }}>
                                <action.icon size={22} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{action.title}</h3>
                                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>{action.desc}</p>
                            </div>
                            <div style={{ position: "absolute", right: 20, bottom: 20, opacity: 0.2 }}>
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/admin";


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
        const token = localStorage.getItem("adminToken");
        fetch(`${API_BASE}/stats`, {
            headers: { "Authorization": `Bearer ${token}` },
            credentials: "include",
        })
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

    const studentActions = [
        { title: "USERS MANAGEMENT", desc: "Students & Metrics", icon: Users, link: "/admin/candidates", color: "#818cf8" },
        { title: "MANAGE PROJECTS", desc: "Assignments & Submissions", icon: Briefcase, link: "/admin/projects", color: "#c084fc" },
        { title: "CERTIFICATES", desc: "Issue & Track", icon: Award, link: "/admin/certificates", color: "#f472b6" },
        { title: "CERT BUILDER", desc: "Design Templates", icon: Settings2, link: "/admin/certificate-builder/internship", color: "#f87171" },
        { title: "BADGES", desc: "Student Rewards", icon: Badge, link: "/admin/badges", color: "#fbbf24" },
        { title: "MANAGE ORDERS", desc: "Sales & Payments", icon: ShoppingCart, link: "/admin/orders", color: "#fb923c" },
        { title: "COUPONS", desc: "Discounts & Promos", icon: Ticket, link: "/admin/coupons", color: "#f59e0b" },
        { title: "WITHDRAWALS", desc: "Payment Processing", icon: HandCoins, link: "/admin/withdrawals", color: "#10b981" },
        { title: "LOCATIONS", desc: "Branch Management", icon: MapPin, link: "/admin/locations", color: "#6366f1" },
    ];
    
    const cmsActions = [
        { title: "CMS USER", desc: "Admin & Staff Roles", icon: Settings, link: "/admin/users", color: "#00875a" },
    ];

    const websiteActions = [
        { title: "MANAGE COURSES", desc: "Curriculum & Lessons", icon: BookOpen, link: "/admin/courses", color: "#00875a" },
        { title: "MANAGE BLOGS", desc: "Articles & News", icon: FileText, link: "/admin/blogs", color: "#5eead4" },
        { title: "MANAGE SERVICES", desc: "Platform Config", icon: Monitor, link: "/admin/services", color: "#60a5fa" },
        { title: "SECTIONS", desc: "Home Page Layout", icon: Blocks, link: "/admin/sections", color: "#ec4899" },
        { title: "BRANDS", desc: "Partner Logos", icon: Copyright, link: "/admin/brands", color: "#a855f7" },
        { title: "MANAGE MENTORS", desc: "Slider Profiles", icon: Users, link: "/admin/mentors", color: "#10b981" },
        { title: "MANAGE EVENTS", desc: "Ongoing/Upcoming/Past", icon: Calendar, link: "/admin/events", color: "#00875a" },
        { title: "FOOTER", desc: "Bottom Layout", icon: PanelBottom, link: "/admin/footer-settings", color: "#64748b" },
        { title: "MENU BUILDER", desc: "Navigation Links", icon: LayoutGrid, link: "/admin/menu-builder", color: "#06b6d4" },
        { title: "PAGE BUILDER", desc: "Static Pages", icon: FilePlus, link: "/admin/page-builder", color: "#84cc16" },
        { title: "SOCIAL LINKS", desc: "Profiles & Icons", icon: Hash, link: "/admin/social-links", color: "#f43f5e" },
        { title: "FAQs", desc: "Help Center", icon: HelpCircle, link: "/admin/faqs", color: "#3b82f6" },
        { title: "SETTINGS", desc: "Global Config", icon: Settings, link: "/admin/settings", color: "#94a3b8" },
    ];

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400, color: "rgba(255,255,255,0.3)" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ width: 40, height: 40, border: "3px solid rgba(0,135,90,0.2)", borderTop: "3px solid #00875a", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    Loading dashboard...
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 8, textTransform: "uppercase" }}>
                    Admin <span style={{ color: "#00875a" }}>Control Center</span>
                </h1>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Welcome back. What would you like to manage today?</p>
            </div>

            {/* Dashboard Sections */}
            <ActionSection title="STUDENT DASHBOARD MANAGEMENT" actions={studentActions} cardStyle={cardStyle} />
            <ActionSection title="CMS DASHBOARD MANAGEMENT" actions={cmsActions} cardStyle={cardStyle} />
            <ActionSection title="WEBSITE & CONFIGURATION" actions={websiteActions} cardStyle={cardStyle} />

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 24, marginTop: 12, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 10 }}>
                <LayoutDashboard size={20} color="#00875a" /> Overview Analytics
            </h2>

            {/* Stats Cards */}
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 32 }}>
                <div style={cardStyle}>
                    <div style={{ ...statNumber, color: "#00875a" }}>{stats?.totalCourses ?? 0}</div>
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
                                        background: c.status === "active" ? "rgba(0,135,90,0.12)" : c.status === "draft" ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.06)",
                                        color: c.status === "active" ? "#00875a" : c.status === "draft" ? "#fbbf24" : "rgba(255,255,255,0.4)",
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
