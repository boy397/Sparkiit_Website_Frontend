"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface Mentor {
    _id: string;
    name: string;
    description: string;
    photo: string;
    order: number;
}

const fallbackMentors: Mentor[] = [
    {
        _id: "f1",
        name: "ALEX RIVERA",
        description: "Senior Full Stack Dev & AI Architect",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop",
        order: 1
    },
    {
        _id: "f2",
        name: "SARAH CHENG",
        description: "Blockchain Lead & Smart Contract Auditor",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
        order: 2
    },
    {
        _id: "f3",
        name: "MARCUS THORNE",
        description: "Cybersecurity Expert & Ethic Hacker",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop",
        order: 3
    },
    {
        _id: "f4",
        name: "ELENA VOSS",
        description: "UI/UX Director & Digital Product Designer",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop",
        order: 4
    }
];

function MentorsContent({ mentors }: { mentors: Mentor[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
    const springX = useSpring(x, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const extendedMentors = [...mentors, ...mentors, ...mentors];

    return (
        <section 
            ref={containerRef}
            className="relative h-[320px] w-full bg-[#a8e03e] overflow-hidden flex flex-col items-center justify-center"
        >
            {/* Horizontal Sliding Mentors */}
            <div className="absolute inset-0 flex items-center overflow-hidden opacity-40">
                <motion.div 
                    style={{ x: springX }}
                    className="flex gap-8 px-10 whitespace-nowrap"
                >
                    {extendedMentors.map((mentor, index) => (
                        <div 
                            key={`${mentor._id}-${index}`}
                            className="flex-shrink-0 w-[240px] h-[320px] rounded-none overflow-hidden relative group grayscale hover:grayscale-0 transition-all duration-500"
                        >
                            <img 
                                src={mentor.photo} 
                                alt={mentor.name} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                <h3 className="text-white font-bold text-xl">{mentor.name}</h3>
                                <p className="text-white/60 text-sm mt-1">{mentor.description}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Transparent Text Overlay */}
            <div className="relative z-10 pointer-events-none text-center text-black">
                <h2 className="text-[10vw] md:text-[8vw] font-black leading-[0.8] uppercase tracking-tighter mix-blend-overlay opacity-60">
                    LET&apos;S <br /> BUILD.
                </h2>
                <p className="font-bold text-sm md:text-base mt-2 uppercase tracking-widest opacity-80">
                    Ready to transform education?
                </p>
            </div>

            {/* Custom Background Noise/Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply"></div>
        </section>
    );
}

export default function MentorsSection() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/public/mentors`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setMentors(data.data);
                }
            })
            .catch(err => console.error("Error fetching mentors:", err));
    }, []);

    if (!mounted) {
        return (
            <section className="h-[320px] flex flex-col items-center justify-center bg-[#a8e03e] text-black text-center">
                <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold uppercase tracking-tighter">Let&apos;s Build.</h2>
                <p className="mt-2 text-sm font-medium uppercase tracking-widest opacity-80">Ready to transform education?</p>
            </section>
        );
    }

    const displayMentors = mentors.length > 0 ? mentors : fallbackMentors;

    return <MentorsContent mentors={displayMentors} />;
}
