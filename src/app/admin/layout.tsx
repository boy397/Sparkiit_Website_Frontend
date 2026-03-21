"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
    LayoutDashboard, GraduationCap, Award, Badge, FileText, 
    ShoppingBag, Ticket, HandCoins, Users, MapPin, 
    Blocks, Copyright, Settings, LayoutGrid, FilePlus, 
    Hash, HelpCircle, ChevronDown, ChevronRight, Settings2,
    Briefcase,
    Workflow,
    PanelBottom,
    LogOut,
    Calendar
} from "lucide-react";

// Nav Data Structure
type NavItem = {
    label: string;
    href?: string;
    icon: React.ReactNode;
    role?: string;
    onClick?: () => void;
    subItems?: { label: string; href: string; icon: React.ReactNode }[];
};

type NavGroup = {
    title: string;
    items: NavItem[];
};

const navGroups: NavGroup[] = [
    {
        title: "DASHBOARD",
        items: [
            { label: "DASHBOARD", href: "/admin", icon: <LayoutDashboard size={20} strokeWidth={1.8} /> },
        ]
    },
    {
        title: "STUDENT DASHBOARD MANAGEMENT",
        items: [
            { label: "USERS MANAGEMENT", href: "/admin/candidates", icon: <Users size={20} strokeWidth={1.8} /> },
            { label: "MANAGE PROJECTS", href: "/admin/projects", icon: <Briefcase size={20} strokeWidth={1.8} /> },
            { label: "CERTIFICATE BUILDER", 
                icon: <Settings2 size={20} strokeWidth={1.8} />,
                subItems: [
                    { label: "INTERNSHIP BUILDER", href: "/admin/certificate-builder/internship", icon: <Award size={18} strokeWidth={1.8} /> },
                    { label: "PROJECT BUILDER", href: "/admin/certificate-builder/project", icon: <Award size={18} strokeWidth={1.8} /> },
                ]
            },
            { label: "CERTIFICATE MANAGEMENT", href: "/admin/certificates", icon: <Award size={20} strokeWidth={1.8} /> },
            { label: "BADGES", href: "/admin/badges", icon: <Badge size={20} strokeWidth={1.8} /> },
            { label: "MANAGE ORDERS", href: "/admin/orders", icon: <ShoppingBag size={20} strokeWidth={1.8} /> },
            { label: "MANAGE COUPONS", href: "/admin/coupons", icon: <Ticket size={20} strokeWidth={1.8} /> },
            { label: "WITHDRAW PAYMENTS", href: "/admin/withdrawals", icon: <HandCoins size={20} strokeWidth={1.8} /> },
            { label: "LOCATIONS", href: "/admin/locations", icon: <MapPin size={20} strokeWidth={1.8} /> },
        ]
    },
    {
        title: "CMS DASHBOARD MANAGEMENT",
        items: [
            { label: "CMS USER", href: "/admin/users", icon: <Settings size={20} strokeWidth={1.8} /> },
        ]
    },
    {
        title: "WEBSITE & CONFIGURATION",
        items: [
            { label: "MANAGE COURSES", href: "/admin/courses", icon: <GraduationCap size={20} strokeWidth={1.8} /> },
            { label: "MANAGE BLOGS", href: "/admin/blogs", icon: <FileText size={20} strokeWidth={1.8} /> },
            { label: "MANAGE SERVICES", href: "/admin/services", icon: <Workflow size={20} strokeWidth={1.8} /> },
            { label: "SECTIONS", href: "/admin/sections", icon: <Blocks size={20} strokeWidth={1.8} /> },
            { label: "BRANDS", href: "/admin/brands", icon: <Copyright size={20} strokeWidth={1.8} /> },
            { label: "MANAGE MENTORS", href: "/admin/mentors", icon: <Users size={20} strokeWidth={1.8} /> },
            { label: "MANAGE EVENTS", href: "/admin/events", icon: <Calendar size={20} strokeWidth={1.8} /> },
            { label: "FOOTER SETTINGS", href: "/admin/footer-settings", icon: <PanelBottom size={20} strokeWidth={1.8} /> },
            { label: "MENU BUILDER", href: "/admin/menu-builder", icon: <LayoutGrid size={20} strokeWidth={1.8} /> },
            { label: "PAGE BUILDER", href: "/admin/page-builder", icon: <FilePlus size={20} strokeWidth={1.8} /> },
            { label: "SOCIAL LINKS", href: "/admin/social-links", icon: <Hash size={20} strokeWidth={1.8} /> },
            { label: "FAQS", href: "/admin/faqs", icon: <HelpCircle size={20} strokeWidth={1.8} /> },
        ]
    },
    {
        title: "SETTINGS",
        items: [
            { label: "SETTINGS", href: "/admin/settings", icon: <Settings size={20} strokeWidth={1.8} /> },
            { label: "LOGOUT", href: "#", icon: <LogOut size={20} strokeWidth={1.8} />, onClick: () => {} },
        ]
    }
];

function NavItemComponent({ item, sidebarOpen, pathname, userRole, onClick }: { item: any, sidebarOpen: boolean, pathname: string, userRole: string | undefined, onClick?: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    
    // Role check
    if (item.role && item.role !== userRole) return null;

    const isActive = item.href ? (pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))) : false;
    const isSubActive = item.subItems?.some((sub: any) => pathname.startsWith(sub.href));

    useEffect(() => {
        if (isSubActive) setIsOpen(true);
    }, [isSubActive]);

    if (item.subItems) {
        return (
            <div style={{ marginBottom: 4 }}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        gap: 12,
                        padding: sidebarOpen ? "11px 14px" : "11px 16px",
                        borderRadius: 10,
                        border: "none",
                        fontSize: 14,
                        fontWeight: isSubActive ? 600 : 450,
                        color: isSubActive ? "#a8e03e" : "rgba(255,255,255,0.55)",
                        background: isSubActive ? "rgba(168, 224, 62, 0.08)" : "transparent",
                        transition: "all 0.2s ease",
                        justifyContent: sidebarOpen ? "flex-start" : "center",
                        cursor: "pointer",
                    }}
                >
                    <span style={{ flexShrink: 0, opacity: isSubActive ? 1 : 0.6 }}>{item.icon}</span>
                    {sidebarOpen && (
                        <>
                            <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
                            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </>
                    )}
                </button>
                {isOpen && sidebarOpen && (
                    <div style={{ paddingLeft: 34, marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                        {item.subItems.map((sub: any) => {
                            const isSubItemActive = pathname === sub.href;
                            return (
                                <Link
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={onClick}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        padding: "8px 12px",
                                        borderRadius: 8,
                                        textDecoration: "none",
                                        fontSize: 13,
                                        fontWeight: isSubItemActive ? 600 : 450,
                                        color: isSubItemActive ? "#a8e03e" : "rgba(255,255,255,0.55)",
                                        background: isSubItemActive ? "rgba(168, 224, 62, 0.08)" : "transparent",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <span style={{ flexShrink: 0, opacity: isSubItemActive ? 1 : 0.6 }}>{sub.icon}</span>
                                    <span>{sub.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        )
    }

    return (
        <Link
            href={item.href}
            onClick={item.onClick || onClick}
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
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) setSidebarOpen(false);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        setIsMounted(true);
        const checkSession = async () => {
            setIsLoading(true);
            try {
                let apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                // Remove trailing slash if exists
                if (apiBase.endsWith('/')) apiBase = apiBase.slice(0, -1);
                
                const fetchUrl = `${apiBase}/api/admin/me`;
                console.log("Fetching session from:", fetchUrl);

                const res = await fetch(fetchUrl, {
                    credentials: "include"
                });
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                if (data.success) {
                    setUser(data.data);
                } else {
                    setUser(null);
                    if (pathname !== "/admin/login") {
                        router.push("/admin/login");
                    }
                }
            } catch (err) {
                console.error("Session check failed", err);
                setUser(null);
                if (pathname !== "/admin/login") {
                    router.push("/admin/login");
                }
            } finally {
                setIsLoading(false);
            }
        };
        checkSession();
    }, [pathname, router]);

    if (!isMounted) return null;
    
    if (pathname === "/admin/login") return <>{children}</>;

    if (isLoading) {
        return (
            <div style={{ 
                height: "100vh", 
                width: "100%", 
                background: "#0a0a0a", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "#a8e03e",
                fontFamily: "Inter, sans-serif"
            }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                    <div style={{ 
                        width: 40, 
                        height: 40, 
                        border: "3px solid rgba(168, 224, 62, 0.1)", 
                        borderTopColor: "#a8e03e", 
                        borderRadius: "50%", 
                        animation: "spin 1s linear infinite" 
                    }} />
                    <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.05em" }}>VERIFYING SESSION...</span>
                </div>
                <style>{`
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    if (!user) return null;

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/logout`, {
                credentials: "include"
            });
            setUser(null);
            router.push("/admin/login");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    // Helper to find current page name for header
    let currentPageName = "Dashboard";
    for (const group of navGroups) {
        for (const item of group.items) {
            if (item.href && (pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href)))) {
                currentPageName = item.label;
            } else if (item.subItems) {
                for (const sub of item.subItems) {
                    if (pathname === sub.href) {
                        currentPageName = sub.label;
                    }
                }
            }
        }
    }

    // Update logout item in navGroups
    navGroups[4].items[1].onClick = handleLogout;

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", color: "#e5e5e5", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Sidebar Overlay for Mobile */}
            {isMobile && sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 45, backdropFilter: "blur(4px)" }}
                />
            )}

            {/* Sidebar */}
            <aside
                style={{
                    width: sidebarOpen ? 260 : (isMobile ? 0 : 72),
                    minHeight: "100vh",
                    background: "linear-gradient(180deg, #111111 0%, #0d0d0d 100%)",
                    borderRight: "1px solid rgba(168, 224, 62, 0.08)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                    position: isMobile ? "fixed" : "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 50,
                    overflow: "hidden",
                    visibility: isMobile && !sidebarOpen ? "hidden" : "visible",
                    opacity: isMobile && !sidebarOpen ? 0 : 1,
                    transform: isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)",
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
                <nav style={{ padding: "16px 12px", flex: 1, overflowY: "auto", overflowX: "hidden" }}>
                    {navGroups.map((group, idx) => {
                        const visibleItems = group.items.filter(item => !item.role || item.role === user?.role);
                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={idx} style={{ marginBottom: 16 }}>
                                {group.title !== "DASHBOARD" && (
                                    <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", padding: (sidebarOpen || isMobile) ? "8px 12px" : "8px 4px", marginBottom: 4, whiteSpace: "nowrap" }}>
                                        {(sidebarOpen || (isMobile && sidebarOpen)) ? group.title : <span style={{display: 'block', width: "20px", height: "1px", background: "rgba(255,255,255,0.2)", margin: "0 auto"}}></span>}
                                    </div>
                                )}
                                {visibleItems.map((item, itemIdx) => (
                                    <NavItemComponent
                                        key={itemIdx}
                                        item={item}
                                        sidebarOpen={sidebarOpen}
                                        pathname={pathname}
                                        userRole={user?.role as string}
                                        onClick={() => isMobile && setSidebarOpen(false)}
                                    />
                                ))}
                            </div>
                        )
                    })}
                </nav>

                {/* Toggle Sidebar (Only Desktop) */}
                {!isMobile && (
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
                )}
            </aside>

            {/* Main Content */}
            <main
                style={{
                    flex: 1,
                    marginLeft: isMobile ? 0 : (sidebarOpen ? 260 : 72),
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
                        padding: isMobile ? "0 16px" : "0 32px",
                        background: "rgba(10,10,10,0.8)",
                        backdropFilter: "blur(20px)",
                        position: "sticky",
                        top: 0,
                        zIndex: 40,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {isMobile && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 8 }}
                            >
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                        )}
                        <h1 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>{currentPageName}</h1>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <button
                            onClick={handleLogout}
                            title="Log Out"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                background: "none",
                                border: "none",
                                color: "rgba(255,255,255,0.5)",
                                cursor: "pointer",
                                fontSize: 13,
                                fontWeight: 500,
                                padding: "6px 12px",
                                borderRadius: 8,
                                transition: "all 0.2s"
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.color = "#ff4d4d";
                                e.currentTarget.style.background = "rgba(255, 77, 77, 0.05)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                                e.currentTarget.style.background = "none";
                            }}
                        >
                            <LogOut size={18} />
                            {!isMobile && <span>Log Out</span>}
                        </button>

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
                            {user?.username?.charAt(0).toUpperCase() || 'A'}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ padding: isMobile ? "20px 16px" : "28px 32px" }}>{children}</div>
            </main>
        </div>
    );
}
