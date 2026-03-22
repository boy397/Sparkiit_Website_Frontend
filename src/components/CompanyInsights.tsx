"use client";

import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
    { label: "YEARS EXP", val: 5 },
    { label: "PROJECTS", val: 120 },
    { label: "HAPPY CLIENTS", val: 85 },
    { label: "TEAM", val: 24 }
];

function Counter({ value }: { value: number }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (inView) {
            animate(count, value, {
                duration: 2,
                ease: "easeOut",
            });
        }
    }, [inView, value, count]);

    return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function CompanyInsights() {
    return (
        <section className="py-12 px-6 md:px-20 bg-[#050505]">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white/5 p-6 md:p-10 rounded-3xl border border-white/5 text-center group hover:border-[#00875a]/30 transition-all"
                        >
                            <h4 className="text-gray-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-4 group-hover:text-[#00875a] transition-colors">{stat.label}</h4>
                            <p className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                                <Counter value={stat.val} />+
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-t border-white/5 pt-10">
                    <div className="max-w-xl">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-6">
                            LATEST INSIGHTS & <br /> ARTICLES.
                        </h2>
                        <p className="text-gray-400 leading-relaxed font-medium">
                            Stay up to date with the latest trends in Blockchain, DeFi, and digital design through our curated blog posts.
                        </p>
                    </div>
                    <button className="bg-[#00875a] text-white px-10 py-5 rounded-full font-bold uppercase text-sm hover:scale-105 active:scale-95 transition-all">
                        Browse Full Blog
                    </button>
                </div>
            </div>
        </section>
    );
}
