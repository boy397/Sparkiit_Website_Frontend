"use client";

import React from "react";
import { motion } from "framer-motion";
import { useHomepageData } from "@/hooks/useHomepageData";
import AnimatedHeading from "./AnimatedHeading";

const publications: { name: string; logoUrl: string; link?: string }[] = [
    { name: "The Times of India", logoUrl: "" },
    { name: "Hindustan Times", logoUrl: "" },
    { name: "Economic Times", logoUrl: "" },
    { name: "YourStory", logoUrl: "" },
    { name: "Indian Express", logoUrl: "" },
    { name: "Outlook India", logoUrl: "" },
    { name: "Inc42", logoUrl: "" }
];

export interface FeaturedInContent {
    title?: string;
    items?: { name: string; logoUrl: string; link?: string }[];
}

export default function FeaturedIn(props: FeaturedInContent) {
    const { data } = useHomepageData();
    const title = props.title || "Featured In";
    const items = props.items || (data?.brands && data.brands.length > 0 ? data.brands : publications);

    const handleItemClick = (item: any) => {
        if (item.link) {
            window.open(item.link, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <section className="py-20 bg-[#050505] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-16"
                >
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-[#00875a] font-bold uppercase tracking-[0.2em] text-xs border border-[#00875a]/20 px-6 py-2.5 rounded-full backdrop-blur-sm">
                            As Seen On
                        </span>
                        <AnimatedHeading 
                            text={title}
                            highlightWords={["in"]}
                            className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter"
                        />
                    </div>

                    <div className="flex flex-nowrap justify-start md:justify-center items-center gap-4 sm:gap-6 md:gap-8 w-full max-w-7xl overflow-x-auto no-scrollbar py-4 px-6 scroll-smooth">
                        {items.map((pub, index) => {
                            const hasLink = !!pub.link;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`group flex flex-col items-center gap-4 flex-shrink-0 w-32 sm:w-40 md:w-48 ${hasLink ? "cursor-pointer" : "cursor-default"}`}
                                    onClick={() => handleItemClick(pub)}
                                >
                                    <div className="w-full aspect-square rounded-[2rem] overflow-hidden border border-white/10 group-hover:border-[#00875a]/40 bg-white/5 relative transition-all duration-500 shadow-lg group-hover:shadow-[0_10px_30px_-10px_rgba(0,135,90,0.2)]">
                                        {pub.logoUrl ? (
                                            <img 
                                                src={pub.logoUrl} 
                                                alt={pub.name} 
                                                className="w-full h-full object-contain p-5 transition-all duration-500 scale-95 group-hover:scale-105 opacity-80 group-hover:opacity-100 filter group-hover:brightness-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-lg sm:text-2xl font-black text-white/20 group-hover:text-[#00875a] uppercase tracking-tighter">
                                                {pub.name.substring(0, 2)}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 group-hover:text-white uppercase tracking-[0.15em] text-center transition-colors">
                                        {pub.name}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
