"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const services = [
    {
        id: 1,
        num: "01",
        title: "Educational Platform 1",
        category: "E-LEARNING",
        description: "Comprehensive e-learning solutions built with modern microservice architectures.",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2874&auto=format&fit=crop"
    },
    {
        id: 2,
        num: "02",
        title: "Educational Platform 2",
        category: "LMS SYSTEM",
        description: "State-of-the-art Learning Management Systems for modern educational institutions.",
        image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=2940&auto=format&fit=crop"
    },
    {
        id: 3,
        num: "03",
        title: "Educational Platform 3",
        category: "AI TUTOR",
        description: "Personalized AI-driven tutoring systems that adapt to student needs.",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=3032&auto=format&fit=crop"
    },
    {
        id: 4,
        num: "04",
        title: "Educational Platform 4",
        category: "EDTECH",
        description: "Innovative edtech tools designed to maximize student engagement.",
        image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2942&auto=format&fit=crop"
    }
];

export default function HorizontalScrollSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % services.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
    };

    return (
        <section className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden py-12 px-6 md:px-20">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00875a]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto w-full text-center mb-10 relative z-10">
                <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-[#00875a] font-bold uppercase tracking-[0.4em] text-[10px] border border-[#00875a]/20 px-6 py-2 rounded-full backdrop-blur-md mb-8 inline-block"
                >
                    {/* Premium Solutions */}
                </motion.span>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                    Domains <span className="text-[#00875a]">We Serve</span>
                </h2>
            </div>

            <div className="relative w-full max-w-5xl h-[500px] md:h-[600px] flex items-center justify-center perspective-[2000px]">
                {/* Navigation Arrows */}
                <button 
                    onClick={handlePrev}
                    className="absolute left-4 md:-left-12 z-[100] w-14 h-14 rounded-full bg-[#00875a] text-white border border-[#00875a]/20 flex items-center justify-center hover:bg-white hover:border-white transition-all shadow-[0_0_30px_rgba(0,135,90,0.3)] group"
                >
                    <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <button 
                    onClick={handleNext}
                    className="absolute right-4 md:-right-12 z-[100] w-14 h-14 rounded-full bg-[#00875a] text-white border border-[#00875a]/20 flex items-center justify-center hover:bg-white hover:border-white transition-all shadow-[0_0_30px_rgba(0,135,90,0.3)] group"
                >
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="relative w-full h-full flex items-center justify-center preserve-3d transition-all duration-700">
                    {services.map((service, index) => {
                        const offset = index - activeIndex;
                        const absOffset = Math.abs(offset);
                        
                        // Handle circular offset for continuous loop appearance (simple version)
                        let displayOffset = offset;
                        if (offset > 2) displayOffset = offset - services.length;
                        if (offset < -2) displayOffset = offset + services.length;
                        
                        const isCenter = index === activeIndex;
                        
                        return (
                            <motion.div
                                key={service.id}
                                initial={false}
                                animate={{
                                    x: displayOffset * (typeof window !== 'undefined' && window.innerWidth < 768 ? 200 : 350),
                                    scale: isCenter ? 1 : 0.75,
                                    rotateY: displayOffset * -25,
                                    z: isCenter ? 0 : -300,
                                    opacity: Math.abs(displayOffset) > 1 ? 0 : (isCenter ? 1 : 0.4),
                                    filter: isCenter ? "blur(0px)" : "blur(4px)",
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 30
                                }}
                                className="absolute w-[300px] md:w-[450px] aspect-[4/5] md:aspect-[3/4] rounded-[2rem] overflow-hidden group cursor-pointer"
                                style={{
                                    zIndex: 50 - Math.abs(displayOffset),
                                    boxShadow: isCenter ? "0 40px 100px -20px rgba(0,0,0,0.8), 0 0 50px rgba(0,135,90,0.1)" : "none",
                                    border: isCenter ? "1px solid rgba(0,135,90,0.3)" : "1px solid rgba(255,255,255,0.05)",
                                }}
                            >
                                {/* Card Background */}
                                <div className="absolute inset-0 bg-[#0d0f14]">
                                    <img 
                                        src={service.image} 
                                        alt={service.title}
                                        className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                </div>

                                {/* Card Content */}
                                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                                    <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="w-10 h-px bg-[#00875a]/40" />
                                            <span className="text-[#00875a] font-mono text-xs tracking-widest">{service.num} — {service.category}</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase leading-none mb-4 group-hover:text-[#00875a] transition-colors">{service.title}</h3>
                                        <p className="text-gray-400 text-sm md:text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 max-w-xs">
                                            {service.description}
                                        </p>
                                    </div>

                                    {/* Glass reflection */}
                                    <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-1000" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex gap-3 mt-12 relative z-10">
                {services.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`h-1.5 transition-all duration-500 rounded-full ${i === activeIndex ? "w-12 bg-[#00875a]" : "w-3 bg-white/10 hover:bg-white/20"}`}
                    />
                ))}
            </div>
        </section>
    );
}
