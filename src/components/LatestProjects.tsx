"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useHomepageData } from "@/hooks/useHomepageData";
// import TextReveal from "./TextReveal"; // You can likely remove this import now

const fallbackRecognitions = [
    {
        num: "01",
        // title: "AWWWARDS",
        // category: "SITE OF THE DAY",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
    },
    {
        num: "02",
        // title: "FWA",
        // category: "FOTD",
        image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop"
    },
    {
        num: "03",
        // title: "CSS DESIGN AWARDS",
        // category: "INNOVATION",
        image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop"
    },
    {
        num: "04",
        // title: "WEBBY AWARDS",
        // category: "NOMINEE",
        image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2787&auto=format&fit=crop"
    }
];

// Reusable component for the word-by-word staggered hover effect on the title
function HoverWordTitle({ text }: { text: string }) {
    return (
        <motion.div 
            initial="initial" 
            whileHover="hovered" 
            className="flex flex-wrap gap-[0.25em] cursor-crosshair"
        >
            {text.split(" ").map((word, i) => (
                <div key={i} className="relative overflow-hidden inline-flex">
                    {/* Original Word - Slides up and disappears */}
                    <motion.span
                        variants={{
                            initial: { y: 0 },
                            hovered: { y: "-100%" }
                        }}
                        transition={{ duration: 0.4, delay: i * 0.05, ease: [0.33, 1, 0.68, 1] }}
                        className="inline-block"
                    >
                        {word}
                    </motion.span>
                    
                    {/* New Word - Slides up from below */}
                    <motion.span
                        variants={{
                            initial: { y: "100%" },
                            hovered: { y: 0 }
                        }}
                        transition={{ duration: 0.4, delay: i * 0.05, ease: [0.33, 1, 0.68, 1] }}
                        className="absolute inset-0 text-[#a8e03e] inline-block"
                    >
                        {word}
                    </motion.span>
                </div>
            ))}
        </motion.div>
    );
}

// Letter-by-letter hover effect for the cards
function HoverText({ text }: { text: string }) {
    return (
        <div className="relative overflow-hidden inline-flex">
            <div className="flex">
                {text.split("").map((char, i) => (
                    <motion.span
                        key={i}
                        variants={{
                            initial: { y: 0 },
                            hovered: { y: "-100%" }
                        }}
                        transition={{ duration: 0.4, delay: i * 0.02, ease: [0.33, 1, 0.68, 1] }}
                        className="inline-block whitespace-pre"
                    >
                        {char}
                    </motion.span>
                ))}
            </div>
            
            <div className="absolute inset-0 flex text-[#a8e03e]">
                {text.split("").map((char, i) => (
                    <motion.span
                        key={i}
                        variants={{
                            initial: { y: "100%" },
                            hovered: { y: 0 }
                        }}
                        transition={{ duration: 0.4, delay: i * 0.02, ease: [0.33, 1, 0.68, 1] }}
                        className="inline-block whitespace-pre"
                    >
                        {char}
                    </motion.span>
                ))}
            </div>
        </div>
    );
}

function RecognitionCard({ item, index }: { item: any; index: number }) {
    return (
        <motion.div 
            initial="initial"
            whileHover="hovered"
            className="group relative cursor-pointer flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[35vw]"
        >
            <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-2xl mb-6 bg-white/5 border border-white/10">
                <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                
                {/* Lightning / Shimmer Sweep Effect */}
                <motion.div 
                    variants={{
                        initial: { left: "-100%" },
                        hovered: { left: "200%" }
                    }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-30deg] z-20"
                />

                <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest z-30">
                    {item.category}
                </div>
            </div>
            
            <div className="flex justify-between items-start">
                <div>
                    {/* <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tighter uppercase">
                        <HoverText text={item.title} />
                    </h3> */}
                    {/* <p className="text-gray-500 text-xs font-bold tracking-[0.2em] underline decoration-[#a8e03e]/30 underline-offset-8 uppercase">
                        View details
                    </p> */}
                </div>
                {/* <span className="text-4xl font-black text-white/5 group-hover:text-[#a8e03e]/20 transition-colors">
                    {item.num}
                </span> */}
            </div>
        </motion.div>
    );
}

export default function RecognisedBy() {
    const { data } = useHomepageData();
    const items = data?.recognitions && data.recognitions.length > 0 ? data.recognitions : fallbackRecognitions;

    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);

    return (
        <section ref={targetRef} className="h-[300vh] bg-[#050505] relative">
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
                
                <div className="px-6 md:px-20 w-full mb-12">
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter leading-none">
                        {/* Swapped TextReveal for the new Word-by-Word Hover effect */}
                        <HoverWordTitle text="Recognised By" />
                    </h2>
                </div>

                <motion.div style={{ x }} className="flex gap-8 px-6 md:px-20 w-max">
                    {items.map((item, index) => (
                        <RecognitionCard key={index} item={item} index={index} />
                    ))}
                    <div className="w-[10vw] md:w-[20vw] flex-shrink-0" />
                </motion.div>
            </div>
        </section>
    );
}