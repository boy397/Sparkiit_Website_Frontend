"use client";

import Link from "next/link";
import { Search, ShoppingBasket, User, ChevronDown, LayoutGrid, Plus, LogOut, UserCircle, Menu, X, MoreVertical } from "lucide-react";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useHomepageData } from "@/hooks/useHomepageData";
import { useRouter, useSearchParams } from "next/navigation";

function SearchParamsLoader({ onChange }: { onChange: (params: URLSearchParams) => void }) {
    const searchParams = useSearchParams();
    useEffect(() => {
        onChange(new URLSearchParams(searchParams.toString()));
    }, [searchParams, onChange]);
    return null;
}
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { API_BASE_URL } from "@/lib/api-config";

export default function Navbar() {
    const { cartItems, setIsCartOpen } = useCart();
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
    const [pages, setPages] = useState<any[]>([]);
    const { data } = useHomepageData();
    const router = useRouter();
    const site = data?.content?.site || { logoText: "SPARKIIT" };

    const rawLogoUrl = data?.settings?.siteLogo as string || "";
    const logoUrl = rawLogoUrl.startsWith("/uploads") 
        ? `${API_BASE_URL}${rawLogoUrl}` 
        : (rawLogoUrl || "/images.jpg");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const query = searchQuery.trim();
        if (query) {
            router.push(`/courses?search=${encodeURIComponent(query)}`);
        } else {
            router.push(`/courses`);
        }
    };

    const handleSearchParamsChange = useCallback((params: URLSearchParams) => {
        const search = params.get("search");
        if (search) {
            setSearchQuery(search);
        } else {
            setSearchQuery("");
        }
    }, []);

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
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Fetch CMS pages
        fetch(`${API_BASE_URL}/api/public/pages`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP status: ${res.status}`);
                return res.json();
            })
            .then(json => {
                if (json.success) {
                    setPages(json.data);
                }
            })
            .catch(err => console.warn("Error fetching pages (using fallback):", err.message));
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

    const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
        if (window.location.pathname === "/") {
            e.preventDefault();
            const element = document.getElementById(hash.replace("#", ""));
            if (element) {
                const offset = 80; // Navbar height
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = element.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
            setIsMobileMenuOpen(false);
        }
    };

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (window.location.pathname === "/") {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <motion.nav 
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 md:px-20 py-3 md:py-4 backdrop-blur-md border-b border-white/5 bg-[#050505]/50 pt-[calc(env(safe-area-inset-top)+0.75rem)] md:pt-[calc(env(safe-area-inset-top)+1rem)]"
        >
            <Suspense fallback={null}>
                <SearchParamsLoader onChange={handleSearchParamsChange} />
            </Suspense>
            {/* Left Side: Logo and Links */}
            <div className="flex items-center gap-4 md:gap-10">
                <Link 
                    href="/" 
                    onClick={handleLogoClick}
                    className="flex items-center gap-2 shrink-0 group"
                >
                    <img 
                        src={logoUrl} 
                        alt="Sparkiit" 
                        className="h-8 md:h-10 w-auto group-hover:scale-105 transition-transform" 
                    />
                </Link>

                <div className="hidden xl:flex items-center gap-5">
                    <Link href="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors whitespace-nowrap">
                        Home
                    </Link>
                    <Link href="/domains" className="text-sm font-medium text-white/70 hover:text-white transition-colors whitespace-nowrap">
                        Domains
                    </Link>
                    <div className="group relative flex items-center gap-1 cursor-pointer">
                        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors whitespace-nowrap">
                            Enroll Now
                        </span>
                        <ChevronDown size={14} className="text-white/30 group-hover:text-white transition-colors" />

                        {/* Enroll Now Dropdown - Single Line */}
                        <div className="absolute top-full left-0 mt-2 flex items-center gap-4 bg-[#050505] border border-white/10 rounded-full px-6 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 backdrop-blur-xl shadow-2xl whitespace-nowrap">
                            <Link href="https://pages.razorpay.com/pl_SHADRLSUxgr1qJ/view" className="text-[10px] text-white/60 hover:text-[#00875a] transition-colors uppercase tracking-widest font-black">Slot Booking</Link>
                            <div className="w-px h-3 bg-white/10" />
                            <Link href="https://pages.razorpay.com/pl_SHADRLSUxgr1qJ/view" className="text-[10px] text-white/60 hover:text-[#00875a] transition-colors uppercase tracking-widest font-black">Full Registration</Link>
                        </div>
                    </div>
                    <Link href="/about" className="text-sm font-medium text-white/70 hover:text-white transition-colors whitespace-nowrap">
                        About Us
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-white/70 hover:text-white transition-colors whitespace-nowrap">
                        Contact Us
                    </Link>
                    <Link href="/verify" className="text-sm font-medium text-white/70 hover:text-white transition-colors whitespace-nowrap">
                        Verification
                    </Link>
                    <div className="group relative flex items-center gap-2 cursor-pointer">
                        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors whitespace-nowrap">
                            More
                        </span>
                        <ChevronDown size={14} className="text-white/30 group-hover:text-white transition-colors" />

                        {/* More Dropdown */}
                        <div className="absolute top-full left-0 mt-2 w-48 bg-[#050505] border border-white/10 rounded-xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 backdrop-blur-xl shadow-2xl">
                            {/* Standard Pages */}
                            <Link href="/job-portal" className="block px-6 py-2 text-sm text-white/60 hover:text-[#00875a] transition-colors uppercase tracking-widest font-bold">Job Portal</Link>
                            <Link href="/blog" className="block px-6 py-2 text-sm text-white/60 hover:text-[#00875a] transition-colors uppercase tracking-widest font-bold">Blogs</Link>
                            <Link href="/faqs" className="block px-6 py-2 text-sm text-white/60 hover:text-[#00875a] transition-colors uppercase tracking-widest font-bold">FAQ</Link>
                            
                            {/* Dynamic CMS Pages (Excluding ones already in main navbar) */}
                            {pages.filter(p => !['Home', 'Domains', 'About Us', 'Contact Us', 'Verification', 'Job Portal', 'Blogs', 'FAQ', 'Events'].includes(p.name)).map((p, idx) => (
                                <Link key={idx} href={`/${p.slug}`} className="block px-6 py-2 text-sm text-white/60 hover:text-[#00875a] transition-colors uppercase tracking-widest font-bold">{p.name}</Link>
                            ))}

                            <div className="h-px bg-white/5 my-2" />
                            <Link href="/events" className="block px-6 py-2 text-sm text-[#00875a] hover:text-[#00c978] transition-colors uppercase tracking-widest font-black">Events</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Search and User Actions */}
            <div className="flex items-center gap-2 md:gap-6">
                {/* Search Bar Container */}
                <form 
                    onSubmit={handleSearch}
                    className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full h-11 pl-4 pr-1 focus-within:border-[#00875a]/40 transition-all duration-300"
                >
                    <div 
                        className="relative flex items-center gap-2 cursor-pointer group pr-3 border-r border-white/5"
                        onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
                        onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
                    >
                        <LayoutGrid size={16} className="text-[#00875a]" />
                        <span className="text-xs font-semibold text-white/60 whitespace-nowrap">Categories</span>
                        <ChevronDown size={12} className="text-white/20" />

                        {/* Categories Dropdown */}
                        <AnimatePresence>
                            {isCategoriesDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-[-1rem] mt-2 w-64 bg-[#050505] border border-white/10 rounded-2xl py-4 backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
                                >
                                    <div className="px-6 pb-2 mb-2 border-b border-white/5">
                                        <p className="text-[10px] font-black text-[#00875a] uppercase tracking-[0.2em]">Explore Domains</p>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {(data?.services || []).map((service, idx) => (
                                            <Link 
                                                key={idx}
                                                href={`/courses?category=${encodeURIComponent(service.title)}`}
                                                className="block px-6 py-3 text-xs font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest"
                                                onClick={() => setIsCategoriesDropdownOpen(false)}
                                            >
                                                {service.title}
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="mt-2 px-6 pt-2 border-t border-white/5">
                                        <Link 
                                            href="/domains" 
                                            className="text-[10px] font-black text-[#00875a] hover:text-[#00c978] transition-colors uppercase tracking-[0.2em]"
                                            onClick={() => setIsCategoriesDropdownOpen(false)}
                                        >
                                            View All Domains →
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <input
                        type="text"
                        placeholder="Search For Course ..."
                        className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-white/20 px-4 w-[180px] xl:w-[240px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <button 
                        type="submit"
                        className="bg-[#00875a] hover:bg-[#00a86b] text-white w-9 h-9 rounded-full transition-transform hover:scale-105 active:scale-95 flex items-center justify-center shrink-0"
                    >
                        <Search size={16} />
                    </button>
                </form>

                {/* Icons */}
                <div className="flex items-center gap-1 md:gap-2">
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 rounded-full hover:bg-white/5 cursor-pointer transition-colors group"
                    >
                        <ShoppingBasket size={20} className="text-white/60 group-hover:text-white md:w-[22px] md:h-[22px]" />
                        {cartItems.length > 0 && (
                            <span className="absolute top-1 right-1 bg-[#00875a] text-white text-[9px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                                {cartItems.length}
                            </span>
                        )}
                    </button>
                    
                    {/* User Menu */}
                    <div className="relative group hidden md:block">
                        <div 
                            className="p-2 rounded-full hover:bg-white/5 cursor-pointer transition-colors"
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        >
                            <User size={22} className="text-white/60 group-hover:text-white" />
                        </div>

                        <div className="absolute right-0 mt-2 w-56 bg-[#0a0a0a] border border-white/10 rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 backdrop-blur-xl shadow-2xl">
                            {user ? (
                                <>
                                    <div className="px-6 py-2 border-b border-white/5 mb-2">
                                        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">Logged in as</p>
                                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                    </div>
                                    <Link href="/dashboard" className="flex items-center gap-3 px-6 py-2.5 text-sm text-white/60 hover:text-[#00875a] hover:bg-white/5 transition-all">
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
                                    <Link href="/login" className="block w-full text-center bg-[#00875a] text-white font-bold py-2.5 rounded-xl hover:bg-[#00a86b] transition-all">
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
                            {isMobileMenuOpen ? <X size={24} /> : <MoreVertical size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence mode="wait">
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 h-[100dvh] bg-[#050505] z-[100] overflow-y-auto px-6 py-20 pt-[calc(env(safe-area-inset-top)+5rem)] xl:hidden"
                    >
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between mb-8">
                                <Link 
                                    href="/" 
                                    onClick={handleLogoClick}
                                    className="flex items-center gap-2"
                                >
                                    <img 
                                        src={logoUrl} 
                                        alt="Sparkiit" 
                                        className="h-8 w-auto" 
                                    />
                                </Link>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/50 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <Link 
                                href="/" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-3xl font-black uppercase tracking-widest text-[#00875a]"
                            >
                                Home
                            </Link>
                            <Link 
                                href="/domains" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-3xl font-black uppercase tracking-widest text-white/70"
                            >
                                Domains
                            </Link>
                            <Link 
                                href="/about" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-3xl font-black uppercase tracking-widest text-white/70"
                            >
                                About Us
                            </Link>
                            <Link 
                                href="/contact" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-3xl font-black uppercase tracking-widest text-white/70"
                            >
                                Contact Us
                            </Link>
                            <Link 
                                href="/verify" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-3xl font-black uppercase tracking-widest text-white/70"
                            >
                                Verification
                            </Link>

                            <div className="flex flex-col gap-4">
                                <span className="text-xs font-bold text-[#00875a] uppercase tracking-widest">Enroll Now</span>
                                <Link href="https://pages.razorpay.com/pl_SHADRLSUxgr1qJ/view" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-widest text-white/70 pl-4">Slot Booking</Link>
                                <Link href="https://pages.razorpay.com/pl_SHADRLSUxgr1qJ/view" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-widest text-white/70 pl-4">Full Registration</Link>
                            </div>
                            
                            <div className="h-px bg-white/5 my-4" />
                            
                            <Link href="/domains" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-widest text-[#00875a]">Categories</Link>
                            <Link href="/job-portal" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-widest text-white/70">Job Portal</Link>
                            <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-widest text-white/70">Blogs</Link>
                            <Link href="/faqs" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-widest text-white/70">FAQ</Link>
                            
                            {/* Dynamic CMS Pages for Mobile */}
                            {pages.filter(p => !['Home', 'Domains', 'About Us', 'Contact Us', 'Verification', 'Job Portal', 'Blogs', 'FAQ', 'Events'].includes(p.name)).map((p, idx) => (
                                <Link key={idx} href={`/${p.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-widest text-white/70">{p.name}</Link>
                            ))}

                            <Link href="/events" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-widest text-[#00875a]">Events</Link>
                            
                            <div className="h-px bg-white/5 my-4" />

                            {user ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#00875a]/10 rounded-full flex items-center justify-center">
                                            <User size={20} className="text-[#00875a]" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{user.name}</p>
                                            <p className="text-white/40 text-xs">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link 
                                        href="/dashboard" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 text-white/70 hover:text-[#00875a]"
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
                                <div className="grid grid-cols-2 gap-4 pt-4 pb-12">
                                    <Link 
                                        href="/login" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="bg-[#00875a] text-white font-black py-4 rounded-2xl text-center"
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
