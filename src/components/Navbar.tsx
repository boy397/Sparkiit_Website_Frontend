"use client";

import Link from "next/link";
import { Search, ShoppingBasket, User, ChevronDown, LayoutGrid, Plus, LogOut, UserCircle, Menu, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useHomepageData } from "@/hooks/useHomepageData";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState<any>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data } = useHomepageData();
    const router = useRouter();
    const site = data?.content?.site || { logoText: "Sparkiit" };

    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
        router.push("/");
        router.refresh();
    }, [router]);

    return (
        <motion.nav 
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 w-full z-50 flex items-center justify-between px-6 md:px-20 py-4 backdrop-blur-md border-b border-white/5 bg-[#050505]/50"
        >
            {/* Left Side: Logo and Links */}
            <div className="flex items-center gap-10">
                <div className="flex items-center gap-2">
                    <div className="bg-[#a8e03e] text-black w-8 h-8 flex items-center justify-center rounded-sm">
                        <Plus size={20} className="font-bold border-2 border-black rounded-sm" />
                    </div>
                    <Link href="/" className="text-xl font-bold tracking-widest uppercase text-white">
                        {site.logoText}
                    </Link>
                </div>

                <div className="hidden xl:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-[#a8e03e] transition-colors">
                        Home
                    </Link>
                    <Link href="/domains" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        Domains
                    </Link>
                    <div className="group relative flex items-center gap-1 cursor-pointer">
                        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                            Enroll Now
                        </span>
                        <ChevronDown size={14} className="text-white/30 group-hover:text-white transition-colors" />
                    </div>
                    <Link href="/about" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        About Us
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        Contact Us
                    </Link>
                    <div className="group relative flex items-center gap-2 cursor-pointer">
                        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                            More
                        </span>
                        <ChevronDown size={14} className="text-white/30 group-hover:text-white transition-colors" />

                        {/* More Dropdown */}
                        <div className="absolute top-full left-0 mt-2 w-48 bg-[#050505] border border-white/10 rounded-xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 backdrop-blur-xl shadow-2xl">
                            <Link href="/projects" className="block px-6 py-2 text-sm text-white/60 hover:text-[#a8e03e] transition-colors uppercase tracking-widest font-bold">Projects</Link>
                            <Link href="/blog" className="block px-6 py-2 text-sm text-white/60 hover:text-[#a8e03e] transition-colors uppercase tracking-widest font-bold">Blogs</Link>
                            <Link href="/verify" className="block px-6 py-2 text-sm text-white/60 hover:text-[#a8e03e] transition-colors uppercase tracking-widest font-bold">Verify Certificate</Link>
                            <div className="h-px bg-white/5 my-2" />
                            <Link href="/admin/login" className="block px-6 py-2 text-sm text-[#a8e03e]/70 hover:text-[#a8e03e] transition-colors uppercase tracking-widest font-bold">Admin Login</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Search and User Actions */}
            <div className="flex items-center gap-4 md:gap-6">
                {/* Search Bar Container */}
                <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full h-11 pl-4 pr-1 focus-within:border-[#a8e03e]/40 transition-all duration-300">
                    <div className="flex items-center gap-2 cursor-pointer group pr-3 border-r border-white/5">
                        <LayoutGrid size={16} className="text-[#a8e03e]" />
                        <span className="text-xs font-semibold text-white/60 whitespace-nowrap">Categories</span>
                        <ChevronDown size={12} className="text-white/20" />
                    </div>

                    <input
                        type="text"
                        placeholder="Search For Course ..."
                        className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-white/20 px-4 w-[180px] xl:w-[240px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <button className="bg-[#a8e03e] hover:bg-[#96c937] text-black w-9 h-9 rounded-full transition-transform hover:scale-105 active:scale-95 flex items-center justify-center shrink-0">
                        <Search size={16} />
                    </button>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-2">
                    <div className="relative p-2 rounded-full hover:bg-white/5 cursor-pointer transition-colors group">
                        <ShoppingBasket size={22} className="text-white/60 group-hover:text-white transition-colors" />
                        <span className="absolute top-1 right-1 bg-[#a8e03e] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                            0
                        </span>
                    </div>
                    
                    {/* User Menu */}
                    <div className="relative group hidden md:block">
                        <div 
                            className="p-2 rounded-full hover:bg-white/5 cursor-pointer transition-colors"
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        >
                            <User size={22} className="text-white/60 group-hover:text-white transition-colors" />
                        </div>

                        <div className="absolute right-0 mt-2 w-56 bg-[#0a0a0a] border border-white/10 rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 backdrop-blur-xl shadow-2xl">
                            {user ? (
                                <>
                                    <div className="px-6 py-2 border-b border-white/5 mb-2">
                                        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">Logged in as</p>
                                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                    </div>
                                    <Link href="/dashboard" className="flex items-center gap-3 px-6 py-2.5 text-sm text-white/60 hover:text-[#a8e03e] hover:bg-white/5 transition-all">
                                        <LayoutGrid size={18} />
                                        <span>Student Dashboard</span>
                                    </Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-6 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all text-left"
                                    >
                                        <LogOut size={18} />
                                        <span>Log Out</span>
                                    </button>
                                </>
                            ) : (
                                <div className="px-4 py-2 space-y-2">
                                    <Link href="/login" className="block w-full text-center bg-[#a8e03e] text-black font-bold py-2.5 rounded-xl hover:bg-[#96c937] transition-all">
                                        Login
                                    </Link>
                                    <Link href="/signup" className="block w-full text-center bg-white/5 text-white/60 font-medium py-2.5 rounded-xl border border-white/10 hover:text-white hover:border-white/20 transition-all">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="xl:hidden">
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-full hover:bg-white/5 transition-colors text-white/70 hover:text-white"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 top-[72px] bg-[#050505] z-40 overflow-y-auto px-6 py-10 xl:hidden"
                    >
                        <div className="flex flex-col gap-6">
                            <Link 
                                href="/" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-black uppercase tracking-widest text-[#a8e03e]"
                            >
                                Home
                            </Link>
                            <Link 
                                href="/domains" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-black uppercase tracking-widest text-white/70"
                            >
                                Domains
                            </Link>
                            <Link 
                                href="/about" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-black uppercase tracking-widest text-white/70"
                            >
                                About Us
                            </Link>
                            <Link 
                                href="/contact" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-black uppercase tracking-widest text-white/70"
                            >
                                Contact Us
                            </Link>
                            
                            <div className="h-px bg-white/5 my-4" />
                            
                            <Link href="/projects" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-white/40 hover:text-[#a8e03e] uppercase">Projects</Link>
                            <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-white/40 hover:text-[#a8e03e] uppercase">Blogs</Link>
                            <Link href="/verify" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-white/40 hover:text-[#a8e03e] uppercase">Verify Certificate</Link>
                            
                            <div className="h-px bg-white/5 my-4" />

                            {user ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#a8e03e]/10 rounded-full flex items-center justify-center">
                                            <User size={20} className="text-[#a8e03e]" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{user.name}</p>
                                            <p className="text-white/40 text-xs">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link 
                                        href="/dashboard" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 text-white/70 hover:text-[#a8e03e]"
                                    >
                                        <LayoutGrid size={20} />
                                        <span>Student Dashboard</span>
                                    </Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 text-red-400"
                                    >
                                        <LogOut size={20} />
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <Link 
                                        href="/login" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="bg-[#a8e03e] text-black font-black py-4 rounded-2xl text-center"
                                    >
                                        LOGIN
                                    </Link>
                                    <Link 
                                        href="/signup" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="bg-white/5 border border-white/10 text-white font-black py-4 rounded-2xl text-center"
                                    >
                                        SIGN UP
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
