"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const nodes: { x: number; y: number; step: number; title: string; labelSide: "top" | "bottom" }[] = [
    { x: 60,   y: 340, step: 1,  title: "Choose your Programs",                                                        labelSide: "bottom" },
    { x: 180,  y: 430, step: 2,  title: "Learn from field experts.",                                                    labelSide: "bottom" },
    { x: 300,  y: 140, step: 3,  title: "Complete Capstone Projects.",                                                  labelSide: "top"    },
    { x: 440,  y: 80,  step: 4,  title: "Ask Questions in Doubt Sessions.",                                             labelSide: "top"    },
    { x: 540,  y: 400, step: 5,  title: "Get good at Aptitude, Reasoning, Quants, and English to do well in interviews.", labelSide: "bottom" },
    { x: 660,  y: 380, step: 6,  title: "Join Group Sessions.",                                                         labelSide: "bottom" },
    { x: 780,  y: 60,  step: 7,  title: "Receive Your Certificates.",                                                   labelSide: "top"    },
    { x: 880,  y: 280, step: 8,  title: "Enhance Your LinkedIn Profile.",                                               labelSide: "bottom" },
    { x: 1000, y: 120, step: 9,  title: "Practice Mock Interviews with our AI Tool.",                                   labelSide: "top"    },
    { x: 1140, y: 100, step: 10, title: "Apply for Jobs on our Job Site.",                                              labelSide: "top"    },
];

function buildPath(pts: { x: number; y: number }[]): string {
    if (pts.length < 2) return "";
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const curr = pts[i];
        const next = pts[i + 1];
        const midX = (curr.x + next.x) / 2;
        d += ` C${midX},${curr.y} ${midX},${next.y} ${next.x},${next.y}`;
    }
    return d;
}

const pathD = buildPath(nodes);

export default function RoadmapSection() {
    const [activeStep, setActiveStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    // Auto-cycle through steps
    useEffect(() => {
        if (!isVisible) return;
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % nodes.length);
        }, 1800);
        return () => clearInterval(interval);
    }, [isVisible]);

    // Intersection observer to start animation when section is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.2 }
        );
        const el = document.getElementById("roadmap-section");
        if (el) observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="roadmap-section" className="py-10 md:py-14 bg-[#050505] relative overflow-hidden">
            {/* Title */}
            <div className="max-w-7xl mx-auto px-6 md:px-16 mb-10 relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <span className="text-[#00875a] text-[11px] font-black uppercase tracking-[0.4em] block mb-3"></span>
                    <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                        Victory <span className="text-[#00875a]">Blue Print</span>
                    </h2>
                </motion.div>
            </div>

            {/* ——— DESKTOP ROADMAP ——— */}
            <div className="hidden lg:block relative w-full max-w-7xl mx-auto px-8" style={{ aspectRatio: "1200 / 520" }}>
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 1200 520"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="dotGlow">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>

                    {/* Full background path (dim) */}
                    <path d={pathD} stroke="rgba(0,135,90,0.08)" strokeWidth="6" strokeLinecap="round" fill="none" />

                    {/* Main visible path */}
                    <path d={pathD} stroke="#00875a" strokeWidth="4" strokeLinecap="round" fill="none" filter="url(#glow)" opacity="0.7" />

                    {/* Flowing particle that travels along the path continuously */}
                    <motion.circle
                        r="5"
                        fill="#fff"
                        style={{ offsetPath: `path('${pathD}')` }}
                        animate={{ offsetDistance: ["0%", "100%"] }}
                        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Step Dots */}
                    {nodes.map((n, i) => {
                        const isActive = i === activeStep;
                        const isPast = i <= activeStep;
                        return (
                            <g key={n.step}>
                                {/* Pulse ring (active only) */}
                                {isActive && (
                                    <>
                                        <motion.circle
                                            cx={n.x} cy={n.y} r="22"
                                            fill="none" stroke="#00875a"
                                            initial={{ r: 14, opacity: 1 }}
                                            animate={{ r: 28, opacity: 0 }}
                                            transition={{ duration: 1.2, repeat: Infinity }}
                                        />
                                        <motion.circle
                                            cx={n.x} cy={n.y} r="22"
                                            fill="none" stroke="#00875a"
                                            initial={{ r: 14, opacity: 0.8 }}
                                            animate={{ r: 34, opacity: 0 }}
                                            transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                                        />
                                    </>
                                )}

                                {/* Outer glow */}
                                <motion.circle
                                    cx={n.x} cy={n.y}
                                    r={isActive ? 18 : 14}
                                    fill={isActive ? "rgba(0,135,90,0.25)" : isPast ? "rgba(0,135,90,0.1)" : "rgba(0,135,90,0.05)"}
                                    animate={{ r: isActive ? 18 : 14 }}
                                    transition={{ duration: 0.3 }}
                                />

                                {/* Main dot */}
                                <motion.circle
                                    cx={n.x} cy={n.y}
                                    r={isActive ? 12 : 9}
                                    fill={isActive ? "#fff" : isPast ? "#00875a" : "rgba(0,135,90,0.4)"}
                                    filter={isActive ? "url(#dotGlow)" : undefined}
                                    animate={{
                                        r: isActive ? 12 : 9,
                                        fill: isActive ? "#fff" : isPast ? "#00875a" : "rgba(0,135,90,0.4)",
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* Text labels */}
                {nodes.map((n, i) => {
                    const leftPct = (n.x / 1200) * 100;
                    const topPct = (n.y / 520) * 100;
                    const above = n.labelSide === "top";
                    const isActive = i === activeStep;

                    return (
                        <div
                            key={n.step}
                            className="absolute w-[155px] text-center pointer-events-none transition-all duration-500"
                            style={{
                                left: `${leftPct}%`,
                                top: above ? `calc(${topPct}% - 55px)` : `calc(${topPct}% + 30px)`,
                                transform: "translateX(-50%)",
                                opacity: isActive ? 1 : 0.4,
                                filter: isActive ? "none" : "blur(0px)",
                            }}
                        >
                            <h4
                                className="text-[12px] font-extrabold mb-0.5 transition-colors duration-300"
                                style={{ color: isActive ? "#00875a" : "#fff" }}
                            >
                                Step {n.step}:
                            </h4>
                            <p className="text-[10px] leading-tight font-semibold transition-colors duration-300"
                                style={{ color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)" }}
                            >
                                {n.title}
                            </p>
                        </div>
                    );
                })}

                {/* Active step indicator bar */}
                <div className="absolute bottom-0 left-0 w-full flex justify-center gap-1.5 pb-2">
                    {nodes.map((n, i) => (
                        <button
                            key={n.step}
                            onClick={() => setActiveStep(i)}
                            className="w-8 h-1 rounded-full transition-all duration-300 cursor-pointer"
                            style={{
                                background: i === activeStep ? "#00875a" : "rgba(255,255,255,0.1)",
                                transform: i === activeStep ? "scaleY(1.5)" : "scaleY(1)",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* ——— MOBILE ROADMAP ——— */}
            <div className="lg:hidden px-6 relative mt-8">
                <div className="absolute left-[30px] top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-[#00875a]/10 via-[#00875a]/60 to-[#00875a]/10" />
                <div className="space-y-10 pl-14">
                    {nodes.map((n, i) => {
                        const isActive = i === activeStep;
                        return (
                            <div key={n.step} className="relative">
                                <motion.div
                                    className="absolute -left-[46px] top-0 w-6 h-6 rounded-full border-4 border-[#050505] transition-all duration-300"
                                    style={{ background: isActive ? "#fff" : "#00875a", boxShadow: isActive ? "0 0 20px #00875a" : "none" }}
                                    animate={{ scale: isActive ? 1.3 : 1 }}
                                />
                                <h4 className="text-[11px] font-extrabold uppercase tracking-wider mb-1 transition-colors duration-300"
                                    style={{ color: isActive ? "#00875a" : "rgba(0,135,90,0.5)" }}>
                                    Step {n.step}:
                                </h4>
                                <p className="text-xs font-semibold leading-snug transition-colors duration-300"
                                    style={{ color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)" }}>
                                    {n.title}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* BG decorative */}
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00875a]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00875a]/5 rounded-full blur-[100px] pointer-events-none" />
        </section>
    );
}
