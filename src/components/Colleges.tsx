"use client";

import React from "react";
import { motion } from "framer-motion";

const collegeStats = [
    { label: "Colleges Joined", value: "500+" },
    { label: "Students Placed", value: "10K+" },
    { label: "Career Growth", value: "85%" },
    { label: "Global Reach", value: "15+" },
];

export default function Colleges() {
    return (
        <section className="py-12 bg-[#050505] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00875a]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[#00875a] font-bold uppercase tracking-[0.3em] text-[10px] border border-[#00875a]/20 px-4 py-2 rounded-full backdrop-blur-sm">
                            Our Impact
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mt-8 leading-[0.9]">
                            Trusted & Chosen by <br />
                            <span className="text-[#00875a]">500+ Colleges</span> Across the Nation
                        </h2>
                        <p className="text-white/50 mt-8 text-lg md:text-xl max-w-xl font-medium leading-relaxed">
                            We bridge the gap between academia and industry, empowering institutions with cutting-edge resources and practical expertise.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4 md:gap-8">
                        {collegeStats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-[#00875a]/30 transition-all duration-300 group"
                            >
                                <div className="text-4xl md:text-5xl font-black text-[#00875a] mb-2 group-hover:scale-110 transition-transform duration-300 origin-left">
                                    {stat.value}
                                </div>
                                <div className="text-white/40 font-bold uppercase tracking-wider text-xs md:text-sm">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
