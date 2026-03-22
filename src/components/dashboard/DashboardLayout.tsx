"use client";

import { motion } from "framer-motion";
import { 
    LayoutDashboard, 
    BookOpen, 
    Award, 
    ClipboardList, 
    FolderKanban, 
    LineChart,
    LogOut,
    Menu,
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const sidebarLinks = [
    { title: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { title: "My Courses", icon: BookOpen, href: "/dashboard/courses" },
    { title: "Certificates", icon: Award, href: "/dashboard/certificates" },
    { title: "Assessments", icon: ClipboardList, href: "/dashboard/tests" },
    { title: "Projects", icon: FolderKanban, href: "/dashboard/projects" },
    { title: "Performance", icon: LineChart, href: "/dashboard/performance" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token') || localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Cookies.remove('token');
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#0a0a0a] sticky top-0 h-screen">
                <div className="p-8">
                    <Link href="/" className="text-2xl font-black tracking-tighter text-[#00875a]">
                        SPARKIIT<span className="text-white">.</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                    isActive 
                                    ? "bg-[#00875a] text-white font-bold" 
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <link.icon size={20} />
                                {link.title}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all w-full"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-6 z-50">
                <Link href="/" className="text-xl font-black tracking-tighter text-[#00875a]">
                    SPARKIIT
                </Link>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:hidden fixed inset-0 z-40 bg-[#0a0a0a] pt-20 px-6"
                >
                    <nav className="space-y-4">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-lg ${
                                        isActive 
                                        ? "bg-[#00875a] text-white font-bold" 
                                        : "text-gray-400"
                                    }`}
                                >
                                    <link.icon size={24} />
                                    {link.title}
                                </Link>
                            );
                        })}
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-4 px-6 py-4 text-red-500 text-lg w-full"
                        >
                            <LogOut size={24} />
                            Logout
                        </button>
                    </nav>
                </motion.div>
            )}

            {/* Main Content */}
            <main className="flex-1 lg:ml-0 pt-20 lg:pt-0">
                <div className="p-6 md:p-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
