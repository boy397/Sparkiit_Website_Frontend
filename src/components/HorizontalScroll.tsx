"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HorizontalScrollSection() {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-65%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-[#050505]">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-10 px-10">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="group relative h-[60vh] w-[400px] md:w-[600px] overflow-hidden rounded-2xl bg-white/5 border border-white/10 shrink-0 flex items-end p-10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                            <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-500" />

                            <div className="relative z-20 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                                <p className="text-[#a8e03e] font-mono mb-2">0{item} — Service</p>
                                <h3 className="text-3xl font-bold uppercase mb-4">Educational Platform {item}</h3>
                                <p className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    Comprehensive e-learning solutions built with modern microservice architectures for seamless student experiences.
                                </p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
