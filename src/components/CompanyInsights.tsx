"use client";

import { motion } from "framer-motion";

const stats = [
    { label: "YEARS EXP", val: "5+" },
    { label: "PROJECTS", val: "120+" },
    { label: "HAPPY CLIENTS", val: "85+" },
    { label: "TEAM", val: "24+" }
];

export default function CompanyInsights() {
    return (
        <section className="py-24 px-6 md:px-20 bg-[#050505]">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white/5 p-10 rounded-3xl border border-white/5 text-center group hover:border-[#a8e03e]/30 transition-all"
                        >
                            <h4 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-4 group-hover:text-[#a8e03e] transition-colors">{stat.label}</h4>
                            <p className="text-5xl font-black text-white tracking-tighter">{stat.val}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-t border-white/5 pt-20">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-6">
                            LATEST INSIGHTS & <br /> ARTICLES.
                        </h2>
                        <p className="text-gray-400 leading-relaxed font-medium">
                            Stay up to date with the latest trends in Blockchain, DeFi, and digital design through our curated blog posts.
                        </p>
                    </div>
                    <button className="bg-[#a8e03e] text-black px-10 py-5 rounded-full font-bold uppercase text-sm hover:scale-105 active:scale-95 transition-all">
                        Browse Full Blog
                    </button>
                </div>
            </div>
        </section>
    );
}
