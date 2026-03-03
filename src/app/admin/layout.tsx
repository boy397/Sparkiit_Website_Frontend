"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
            </svg>
        ),
    },
    {
        label: "Courses",
        href: "/admin/courses",
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
    },
    {
        label: "Candidates",
        href: "/admin/candidates",
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", color: "#e5e5e5", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Sidebar */}
            <aside
                style={{
                    width: sidebarOpen ? 260 : 72,
                    minHeight: "100vh",
                    background: "linear-gradient(180deg, #111111 0%, #0d0d0d 100%)",
                    borderRight: "1px solid rgba(168, 224, 62, 0.08)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 50,
                    overflow: "hidden",
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        padding: sidebarOpen ? "28px 24px 20px" : "28px 16px 20px",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    <div
                        style={{
                            width: 38,
                            height: 38,
                            borderRadius: 10,
                            background: "linear-gradient(135deg, #a8e03e 0%, #7cb518 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 16,
                            color: "#050505",
                            flexShrink: 0,
                        }}
                    >
                        S
                    </div>
                    {sidebarOpen && (
                        <div style={{ overflow: "hidden" }}>
                            <div style={{ fontWeight: 700, fontSize: 16, color: "#fff", letterSpacing: "-0.02em" }}>SparkIIT</div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>Admin CRM</div>
                        </div>
                    )}
                </div>

                {/* Nav Items */}
                <nav style={{ padding: "16px 12px", flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", padding: sidebarOpen ? "8px 12px" : "8px 4px", marginBottom: 4 }}>
                        {sidebarOpen ? "Management" : ""}
                    </div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: sidebarOpen ? "11px 14px" : "11px 16px",
                                    marginBottom: 4,
                                    borderRadius: 10,
                                    textDecoration: "none",
                                    fontSize: 14,
                                    fontWeight: isActive ? 600 : 450,
                                    color: isActive ? "#a8e03e" : "rgba(255,255,255,0.55)",
                                    background: isActive ? "rgba(168, 224, 62, 0.08)" : "transparent",
                                    transition: "all 0.2s ease",
                                    justifyContent: sidebarOpen ? "flex-start" : "center",
                                }}
                            >
                                <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Toggle Sidebar */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                        margin: "0 12px 20px",
                        padding: "10px",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.4)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                    }}
                >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ transform: sidebarOpen ? "rotate(0)" : "rotate(180deg)", transition: "transform 0.3s" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
            </aside>

            {/* Main Content */}
            <main
                style={{
                    flex: 1,
                    marginLeft: sidebarOpen ? 260 : 72,
                    transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
                    minHeight: "100vh",
                }}
            >
                {/* Top Bar */}
                <header
                    style={{
                        height: 64,
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 32px",
                        background: "rgba(10,10,10,0.8)",
                        backdropFilter: "blur(20px)",
                        position: "sticky",
                        top: 0,
                        zIndex: 40,
                    }}
                >
                    <h1 style={{ fontSize: 18, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>
                        {navItems.find((n) => pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href)))?.label || "Dashboard"}
                    </h1>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div
                            style={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #a8e03e, #7cb518)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: 13,
                                color: "#050505",
                            }}
                        >
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ padding: "28px 32px" }}>{children}</div>
            </main>
        </div>
    );
}
