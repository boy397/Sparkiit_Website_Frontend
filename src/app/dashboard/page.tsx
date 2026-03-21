"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
    BookOpen, 
    Award, 
    ClipboardCheck, 
    Trophy,
    ShieldCheck
} from "lucide-react";

export default function DashboardOverview() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/public/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="animate-pulse text-gray-500">Loading your progress...</div>;

    const cards = [
        { title: "ENROLLED COURSES", value: stats?.enrolledCourses?.length || 0, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "CERTIFICATES", value: stats?.certificatesCount || 0, icon: Award, color: "text-[#a8e03e]", bg: "bg-[#a8e03e]/10" },
        { title: "COMPLETED TESTS", value: stats?.tests?.length || 0, icon: ClipboardCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
        { title: "BATCH RANK", value: stats?.batchRank || "#N/A", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { title: "STIPEND ELIGIBILITY", value: stats?.stipendEligible ? "ELIGIBLE" : "NOT ELIGIBLE", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    ];

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold tracking-tight uppercase">Welcome Back, <span className="text-[#a8e03e]">Learner</span></h1>
                <p className="text-gray-400 mt-2">Here's a quick look at your learning progress.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-[#a8e03e]/20 transition-all group"
                    >
                        <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <card.icon size={24} />
                        </div>
                        <h3 className="text-gray-400 font-bold text-xs tracking-widest">{card.title}</h3>
                        <p className="text-3xl font-bold mt-1 uppercase">{card.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Chart Placeholder */}
                <div className="p-8 rounded-3xl bg-white/5 border border-white/5 min-h-[22rem] flex flex-col">
                    <h3 className="text-xl font-bold mb-6 uppercase flex items-center gap-2">
                        <LineChartIcon className="text-[#a8e03e]" /> Performance Tracker
                    </h3>
                    <div className="flex-1 flex items-end gap-2 px-4 pb-4">
                        {[40, 70, 45, 90, 65, 80, 50, 95].map((h, i) => (
                            <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                className="flex-1 bg-gradient-to-t from-[#a8e03e]/20 to-[#a8e03e] rounded-t-lg"
                            />
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="p-8 rounded-3xl bg-white/5 border border-white/5 min-h-[22rem]">
                     <h3 className="text-xl font-bold mb-6 uppercase">Recent Activities</h3>
                     <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-[#a8e03e]" />
                                <div className="flex-1">
                                    <p className="font-medium">Completed module "Introduction to Web3"</p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
}

function LineChartIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m19 20-4-4-3 3-4-4-3 3" /><path d="M5 16V4" /><path d="M5 4h14" />
        </svg>
    );
}
