"use client";

import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import React, { useEffect, useRef } from "react";
import PremiumButton from "./PremiumButton";
import AnimatedHeading from "./AnimatedHeading";

const stats = [
    { label: "YEARS EXP", val: 5 },
    { label: "PROJECTS", val: 120 },
    { label: "HAPPY LEARNERS", val: 1500 },
    { label: "EXPERT MENTORS", val: 50 }
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

export interface CompanyInsightsContent {
    title?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
    stats?: { label: string; val: number }[];
}

export default function CompanyInsights(props: CompanyInsightsContent) {
    const title = props.title || "LATEST INSIGHTS & ARTICLES.";
    const description = props.description || "Explore fresh insights, industry trends, and expert perspectives through our regularly updated articles and blogs.";
    const statsItems = props.stats || stats;
    const ctaText = props.ctaText || "Browse Full Blog";
    const ctaLink = props.ctaLink || "/blog";

    return (
        <section className="py-12 px-4 sm:px-6 md:px-20 bg-[#050505]">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {statsItems.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white/5 p-4 sm:p-6 md:p-10 rounded-[1.5rem] md:rounded-3xl border border-white/5 text-center group hover:border-[#00875a]/30 transition-all flex flex-col justify-center"
                        >
                            <h4 className="text-gray-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-4 group-hover:text-[#00875a] transition-colors">{stat.label}</h4>
                            <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter mt-auto">
                                <Counter value={stat.val} />+
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-t border-white/5 pt-10">
                    <div className="max-w-xl">
                        <AnimatedHeading
                            text={title.replace(' & ', ' & <br /> ')}
                            highlightWords={["insights", "articles"]}
                            className="text-2xl sm:text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-6"
                        />
                        <p className="text-gray-400 leading-relaxed font-medium">
                            {description}
                        </p>
                    </div>
                    <PremiumButton text={ctaText} variant="primary" href={ctaLink} />
                </div>
            </div>
        </section>
    );
}
