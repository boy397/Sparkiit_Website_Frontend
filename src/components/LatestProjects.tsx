"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
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
                        className="absolute inset-0 text-[#00875a] inline-block"
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
            
            <div className="absolute inset-0 flex text-[#00875a]">
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

function RecognitionCard({ item, index, onClick }: { item: any; index: number; onClick?: () => void }) {
    const src = item.image || item.logoUrl;
    const alt = item.title || item.name || item.category || "Recognition Image";

    if (!src) return null;

    return (
        <motion.div 
            initial="initial"
            whileHover="hovered"
            className="group relative cursor-pointer flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[35vw]"
            onClick={onClick}
        >
            <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-2xl mb-6 bg-white/5 border border-white/10 group-hover:border-[#00875a]/40 transition-all duration-500 shadow-lg group-hover:shadow-[0_10px_30px_-10px_rgba(0,135,90,0.2)]">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-contain p-4 sm:p-8 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
                
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
                    {item.category || "RECOGNITION"}
                </div>
            </div>
            
            <div className="flex justify-between items-start mt-2 px-2">
                <h3 className="text-xl font-bold text-white group-hover:text-[#00875a] uppercase tracking-wide transition-colors">
                    <HoverText text={item.name || item.title || "Recognition Document"} />
                </h3>
            </div>
        </motion.div>
    );
}

export interface RecognisedByContent {
    title?: string;
    items?: { title?: string; category?: string; image?: string; logoUrl?: string; link?: string }[];
}

export default function RecognisedBy(props: RecognisedByContent) {
    const { data } = useHomepageData();
    const title = props.title || "Recognised By";
    const rawItems = props.items || (data?.recognitions && data.recognitions.length > 0 ? data.recognitions : fallbackRecognitions);
    const items = (rawItems || []).filter((item: any) => item && (item.image || item.logoUrl));

    const [selectedPdf, setSelectedPdf] = useState<{ url: string; name: string } | null>(null);
    const [iframeSrc, setIframeSrc] = useState("");

    useEffect(() => {
        if (selectedPdf) {
            document.documentElement.classList.add("modal-open");
        } else {
            document.documentElement.classList.remove("modal-open");
        }
        return () => {
            document.documentElement.classList.remove("modal-open");
        };
    }, [selectedPdf]);

    useEffect(() => {
        if (!selectedPdf || !selectedPdf.url) {
            setIframeSrc("");
            return;
        }

        let revoke: string | null = null;

        if (selectedPdf.url.startsWith("data:")) {
            // Base64 data URI → convert to blob
            try {
                const parts = selectedPdf.url.split(';base64,');
                const contentType = parts[0].split(':')[1];
                const raw = window.atob(parts[1]);
                const rawLength = raw.length;
                const uInt8Array = new Uint8Array(rawLength);
                for (let i = 0; i < rawLength; ++i) {
                    uInt8Array[i] = raw.charCodeAt(i);
                }
                const blob = new Blob([uInt8Array], { type: contentType });
                const blobUrl = URL.createObjectURL(blob);
                revoke = blobUrl;
                setIframeSrc(blobUrl);
            } catch (e) {
                console.error("Failed to convert base64 to Blob URL:", e);
                setIframeSrc("");
            }
        } else {
            // Remote URL → fetch as blob to avoid cross-origin iframe issues
            fetch(selectedPdf.url)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.blob();
                })
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    revoke = blobUrl;
                    setIframeSrc(blobUrl);
                })
                .catch(err => {
                    console.error("Failed to fetch PDF:", err);
                    // Fallback: try direct URL
                    setIframeSrc(selectedPdf.url);
                });
        }

        return () => {
            if (revoke) URL.revokeObjectURL(revoke);
        };
    }, [selectedPdf]);

    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

    return (
        <section ref={targetRef} className="h-[300vh] bg-[#050505] relative">
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
                
                <div className="px-4 sm:px-6 md:px-20 w-full mb-12">
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter leading-none">
                        {/* Swapped TextReveal for the new Word-by-Word Hover effect */}
                        <HoverWordTitle text={title} />
                    </h2>
                </div>

                <motion.div style={{ x }} className="flex gap-6 md:gap-8 px-4 sm:px-6 md:px-20 w-max">
                    {items.map((item: any, index: number) => (
                        <RecognitionCard 
                            key={index} 
                            item={item} 
                            index={index} 
                            onClick={() => {
                                if (item.link) {
                                    setSelectedPdf({ url: item.link, name: item.name || item.title || "Recognition Document" });
                                }
                            }}
                        />
                    ))}
                    <div className="w-[10vw] md:w-[20vw] flex-shrink-0" />
                </motion.div>
            </div>

            {/* Premium PDF Viewer Modal */}
            <AnimatePresence>
                {selectedPdf && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10"
                    >
                        <div 
                            onClick={() => setSelectedPdf(null)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-md" 
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            className="relative w-full max-w-5xl h-[90vh] md:h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-[30px] overflow-hidden shadow-2xl flex flex-col z-10"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/2 flex-shrink-0">
                                <div>
                                    <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-wider">{selectedPdf.name}</h3>
                                    <p className="text-xs text-[#00875a] font-mono tracking-widest uppercase">Secured Verification Document</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedPdf(null)}
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer font-bold text-lg"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 bg-black relative" onContextMenu={(e) => e.preventDefault()}>
                                {iframeSrc ? (
                                    <iframe 
                                        src={iframeSrc.startsWith("blob:") ? iframeSrc : `${iframeSrc}#toolbar=0&navpanes=0&scrollbar=1`}
                                        title={selectedPdf.name}
                                        className="w-full h-full border-none"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white/2">
                                        <div className="w-16 h-16 rounded-3xl bg-[#00875a]/10 border border-[#00875a]/20 flex items-center justify-center text-[#00875a] mb-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-white font-bold text-xl uppercase tracking-tight mb-2">Document Under Review</h4>
                                        <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                                            The secured PDF verification document is currently being compiled and will be uploaded shortly by the Administrator.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}