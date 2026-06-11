"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RefreshCw, Clock, LayoutGrid, Workflow, X, CheckCircle2, BookOpen } from "lucide-react";
import { useState, useEffect, useCallback, Suspense } from "react";
import { API_BASE_URL } from "@/lib/api-config";
import { useCart } from "@/context/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useHomepageData } from "@/hooks/useHomepageData";

function SearchParamsLoader({ onChange }: { onChange: (params: URLSearchParams) => void }) {
    const searchParams = useSearchParams();
    useEffect(() => {
        onChange(new URLSearchParams(searchParams.toString()));
    }, [searchParams, onChange]);
    return null;
}

interface CourseCatalogProps {
    initialCategory?: string;
    showTitle?: boolean;
}

export default function CourseCatalog({ initialCategory, showTitle = true }: CourseCatalogProps) {
    const { addToCart, isInCart, removeFromCart } = useCart();
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
    const { data: homeData } = useHomepageData();
    const domains = homeData?.services || [];

    useEffect(() => {
        try {
            const cached = localStorage.getItem('courses_data');
            if (cached) {
                setCourses(JSON.parse(cached));
                setLoading(false);
            }
        } catch (e) {
            // ignore cache parse error
        }

        const fetchAllCourses = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/public/courses`);
                const data = await res.json();
                if (data.success) {
                    setCourses(data.data);
                    try {
                        localStorage.setItem('courses_data', JSON.stringify(data.data));
                        localStorage.setItem('courses_data_ts', Date.now().toString());
                    } catch (e) {}
                }
            } catch (err) {
                console.error("Failed to fetch courses", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllCourses();
    }, []);

    useEffect(() => {
        if (initialCategory) {
            setActiveTab(initialCategory);
        }
    }, [initialCategory]);

    const handleSearchParamsChange = useCallback((params: URLSearchParams) => {
        const category = params.get("category");
        const search = params.get("search");
        
        if (category) {
            setActiveTab(category);
        } else if (!initialCategory) {
            setActiveTab("all");
        }
        setSearchQuery(search || "");
    }, [initialCategory]);

    const filteredCourses = courses.filter(course => {
        const matchesCategory = activeTab === "all" || course.category === activeTab;
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = !query || 
            course.title?.toLowerCase().includes(query) ||
            course.description?.toLowerCase().includes(query) ||
            course.category?.toLowerCase().includes(query) ||
            (course.tags && course.tags.some((tag: string) => tag.toLowerCase().includes(query)));
            
        return matchesCategory && matchesSearch;
    });

    const handleBuyNow = (course: any) => {
        if (course.paymentLink) {
            window.open(course.paymentLink, "_blank");
            return;
        }
        router.push("/signin");
    };

    return (
        <div className="max-w-7xl mx-auto">
            <Suspense fallback={null}>
                <SearchParamsLoader onChange={handleSearchParamsChange} />
            </Suspense>
            {showTitle && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <p className="text-[#00875a] font-bold uppercase tracking-[0.4em] text-xs mb-6">Expertise Hub</p>
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
                        Domains <span className="text-white/20">We Serve.</span>
                    </h1>
                </motion.div>
            )}

            {/* Tabs Section */}
            <div className="flex flex-wrap gap-4 md:gap-6 py-8 mb-12 border-y border-white/5">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all ${
                        activeTab === "all" 
                        ? "bg-[#00875a] text-white shadow-[0_0_20px_rgba(0,135,90,0.3)]" 
                        : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                    }`}
                >
                    <LayoutGrid size={16} />
                    All Courses
                </button>
                
                {domains.map((domain: any) => {
                    const domainTitle = typeof domain === 'string' ? domain : domain.title;
                    return (
                        <button
                            key={domainTitle}
                            onClick={() => setActiveTab(domainTitle)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all ${
                                activeTab === domainTitle 
                                ? "bg-[#00875a] text-white shadow-[0_0_20px_rgba(0,135,90,0.3)]" 
                                : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            <Workflow size={16} />
                            {domainTitle}
                        </button>
                    );
                })}
            </div>

            {searchQuery && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-6 py-4"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-[#00875a] text-xs font-black uppercase tracking-[0.2em]">Search Results</span>
                        <span className="text-white/60 text-sm">Showing courses for &ldquo;<strong className="text-white">{searchQuery}</strong>&rdquo;</span>
                    </div>
                    <button 
                        onClick={() => {
                            const params = new URLSearchParams(window.location.search);
                            params.delete("search");
                            router.push(`${window.location.pathname}?${params.toString()}`);
                        }}
                        className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest"
                    >
                        Clear Search
                        <X size={14} />
                    </button>
                </motion.div>
            )}

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#00875a] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredCourses.length > 0 ? filteredCourses.map((course, index) => (
                            <motion.div
                                key={course._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                onClick={() => setSelectedCourse(course)}
                                className="bg-white/5 p-6 md:p-10 rounded-[40px] border border-white/10 hover:border-[#00875a]/30 transition-all flex flex-col group relative overflow-hidden cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 p-8 z-10">
                                    <span className="text-[#00875a] font-black text-2xl">₹{course.price}</span>
                                </div>

                                {course.imageUrl && (
                                    <div className="w-full h-48 mb-8 rounded-3xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                        <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <h2 className="text-3xl font-bold mb-4 pr-24 group-hover:text-[#00875a] transition-colors relative z-10">{course.title}</h2>
                                <p className="text-gray-400 leading-relaxed mb-8 text-lg line-clamp-2 relative z-10">{course.description}</p>
                                
                                <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="bg-white/5 px-4 py-2 rounded-full text-xs font-medium text-white/50 border border-white/5 uppercase tracking-wider">
                                            {course.category}
                                        </span>
                                        <span className="bg-white/5 px-4 py-2 rounded-full text-xs font-medium text-white/50 border border-white/5 uppercase tracking-wider">
                                            {course.batchStatus}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => isInCart(course._id) ? removeFromCart(course._id) : addToCart(course)}
                                            className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                                                isInCart(course._id) 
                                                ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white" 
                                                : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                                            }`}
                                        >
                                            {isInCart(course._id) ? "Remove" : "Add to Cart"}
                                        </button>
                                        <button 
                                            onClick={() => handleBuyNow(course)}
                                            className="bg-[#00875a] text-white font-black px-8 py-4 rounded-2xl hover:bg-white hover:text-[#00875a] transition-all active:scale-95 whitespace-nowrap text-xs uppercase tracking-widest"
                                        >
                                            {course.paymentLink ? "ENROLL NOW" : "BUY NOW"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-2 text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10"
                            >
                                <p className="text-white/40 uppercase tracking-widest font-bold">No {activeTab !== 'all' ? activeTab : ''} courses available</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Course Detail Modal */}
            <AnimatePresence>
                {selectedCourse && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[999] flex items-center justify-center px-4 md:px-6 py-10"
                    >
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCourse(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            data-lenis-prevent
                            className="relative w-full max-w-5xl max-h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
                        >
                            <button 
                                onClick={() => setSelectedCourse(null)}
                                className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                            >
                                <X size={24} />
                            </button>

                            {/* Left Side: Content */}
                            <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar">
                                <div className="flex flex-wrap gap-3 mb-8">
                                    <span className="bg-[#00875a]/10 text-[#00875a] border border-[#00875a]/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {selectedCourse.category}
                                    </span>
                                    <span className="bg-white/5 text-white/50 border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {selectedCourse.level}
                                    </span>
                                    <span className="bg-white/5 text-white/50 border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {selectedCourse.batchStatus}
                                    </span>
                                </div>

                                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-tight">
                                    {selectedCourse.title}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                    <div className="flex items-center gap-4 text-white/40">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00875a]">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest">Duration</p>
                                            <p className="text-white font-bold">{selectedCourse.duration}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-white/40">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00875a]">
                                            <BookOpen size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest">Modules</p>
                                            <p className="text-white font-bold">Comprehensive Curriculum</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#00875a] mb-4">Course Overview</h3>
                                        <div className="text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">
                                            {selectedCourse.description}
                                        </div>
                                    </div>

                                    {selectedCourse.tags && selectedCourse.tags.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#00875a] mb-4">Key Takeaways</h3>
                                            <div className="flex flex-wrap gap-3">
                                                {selectedCourse.tags.map((tag: string) => (
                                                    <div key={tag} className="flex items-center gap-2 text-sm text-white/70">
                                                        <CheckCircle2 size={16} className="text-[#00875a]" />
                                                        {tag}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Side: Image & Sticky Action */}
                            <div className="w-full md:w-2/5 bg-white/5 border-l border-white/10 flex flex-col relative">
                                <div className="h-48 md:h-[400px] relative overflow-hidden">
                                    <img src={selectedCourse.imageUrl} alt={selectedCourse.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#00875a] mb-2">Price</p>
                                        <p className="text-5xl font-black">₹{selectedCourse.price}</p>
                                    </div>
                                </div>

                                <div className="p-8 md:p-12 mt-auto space-y-4">
                                    <button 
                                        onClick={() => handleBuyNow(selectedCourse)}
                                        className="w-full bg-[#00875a] text-white font-black py-6 rounded-3xl hover:bg-white hover:text-black transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3"
                                    >
                                        {selectedCourse.paymentLink ? "Enroll Now" : "Buy Now"}
                                        <ArrowRight size={20} />
                                    </button>
                                    <button 
                                        onClick={() => isInCart(selectedCourse._id) ? removeFromCart(selectedCourse._id) : addToCart(selectedCourse)}
                                        className={`w-full font-black py-6 rounded-3xl transition-all text-sm uppercase tracking-widest border border-white/10 ${
                                            isInCart(selectedCourse._id)
                                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                                            : "bg-white/5 text-white hover:bg-white/10"
                                        }`}
                                    >
                                        {isInCart(selectedCourse._id) ? "Remove from Cart" : "Add to Cart"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
