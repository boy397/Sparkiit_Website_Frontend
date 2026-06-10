"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import AnimatedHeading from "./AnimatedHeading";

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

export interface HorizontalScrollContent {
    title?: string;
    subtitle?: string;
    items?: { id: number; num: string; title: string; category: string; description: string; image: string; link?: string }[];
}

export default function HorizontalScrollSection(props: HorizontalScrollContent) {
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();

    const handleCardClick = (index: number, category: string, link?: string) => {
        if (index === activeIndex) {
            if (link) {
                if (link.startsWith('http')) {
                    window.open(link, '_blank');
                } else {
                    router.push(link);
                }
            } else {
                router.push(`/domains?category=${encodeURIComponent(category)}`);
            }
        } else {
            setActiveIndex(index);
        }
    };

    const title = props.title || "Domains We Serve";
    const subtitle = props.subtitle || "";
    const initialItems = props.items || [];
    
    // Map backend data to frontend format if necessary
    const mappedItems = initialItems.map((item: any, index: number) => ({
        id: item._id || item.id || index,
        num: item.num || (index + 1).toString().padStart(2, '0'),
        title: item.title,
        category: item.category || "GENERAL",
        description: item.description,
        image: item.image || item.thumbnailUrl || "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2874&auto=format&fit=crop",
        link: item.link || ""
    }));

    const items = mappedItems.length > 0 ? mappedItems : services;

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % items.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    return (
        <section id="domains" className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden py-12 px-6 md:px-20">
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
                    {subtitle}
                </motion.span>
                <AnimatedHeading 
                    text={title}
                    highlightWords={title.split(' ').slice(-2)}
                    className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter"
                />
            </div>

            <div className="relative w-full max-w-5xl h-[450px] md:h-[600px] flex items-center justify-center perspective-[2000px]">
                {/* Navigation Arrows */}
                <button 
                    onClick={handlePrev}
                    className="absolute left-2 md:-left-12 z-[100] w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#00875a] text-white border border-[#00875a]/20 flex items-center justify-center hover:bg-white hover:border-white transition-all shadow-[0_0_30px_rgba(0,135,90,0.3)] group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <button 
                    onClick={handleNext}
                    className="absolute right-2 md:-right-12 z-[100] w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#00875a] text-white border border-[#00875a]/20 flex items-center justify-center hover:bg-white hover:border-white transition-all shadow-[0_0_30px_rgba(0,135,90,0.3)] group"
                >
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="relative w-full h-full flex items-center justify-center preserve-3d transition-all duration-700">
                    {items.map((service, index) => {
                        const offset = index - activeIndex;
                        
                        // Handle circular offset for continuous loop appearance
                        let displayOffset = offset;
                        if (offset > 2) displayOffset = offset - items.length;
                        if (offset < -2) displayOffset = offset + items.length;
                        
                        const isCenter = index === activeIndex;
                        
                        return (
                            <motion.div
                                key={service.id || index}
                                initial={false}
                                animate={{
                                    x: displayOffset * (isMobile ? 180 : 350),
                                    scale: isCenter ? 1 : (isMobile ? 0.8 : 0.75),
                                    rotateY: displayOffset * (isMobile ? -15 : -25),
                                    z: isCenter ? 0 : -300,
                                    opacity: Math.abs(displayOffset) > 1 ? 0 : (isCenter ? 1 : 0.4),
                                    filter: isCenter ? "blur(0px)" : "blur(4px)",
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 30
                                }}
                                onClick={() => handleCardClick(index, service.category, (service as any).link)}
                                className="absolute w-[260px] xs:w-[300px] md:w-[450px] aspect-[4/5] md:aspect-[3/4] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group cursor-pointer"
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
                                <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end">
                                    <div className="transform translate-y-6 md:translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
                                            <span className="w-6 md:w-10 h-px bg-[#00875a]/40" />
                                            <span className="text-[#00875a] font-mono text-[10px] md:text-xs tracking-widest">{service.num} — {service.category}</span>
                                        </div>
                                        <h3 className="text-xl md:text-3xl font-black text-white uppercase leading-none mb-2 md:mb-4 group-hover:text-[#00875a] transition-colors">{service.title}</h3>
                                        <p className="text-gray-400 text-xs md:text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 max-w-xs">
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
            <div className="flex gap-2 md:gap-3 mt-8 md:mt-12 relative z-10">
                {items.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`h-1 md:h-1.5 transition-all duration-500 rounded-full ${i === activeIndex ? "w-8 md:w-12 bg-[#00875a]" : "w-2 md:w-3 bg-white/10 hover:bg-white/20"}`}
                    />
                ))}
            </div>
        </section>
    );
}
