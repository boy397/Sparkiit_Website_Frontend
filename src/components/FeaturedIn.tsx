"use client";

import React from "react";
import { motion } from "framer-motion";

const publications = [
    "The Times of India", "Hindustan Times", "Economic Times", "YourStory", "Indian Express", "Outlook India", "Inc42"
];

export default function FeaturedIn() {
    return (
        <section className="py-10 bg-[#050505]">
            <div className="max-w-7xl mx-auto px-6 md:px-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-12"
                >
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-[#00875a] font-bold uppercase tracking-[0.3em] text-[10px] border border-[#00875a]/20 px-4 py-2 rounded-full backdrop-blur-sm">
                            As Seen On
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
                            Featured <span className="text-[#00875a]">In</span>
                        </h2>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-20 opacity-40">
                        {publications.map((pub, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-xl md:text-3xl font-black text-white hover:text-[#00875a] hover:opacity-100 transition-all duration-300 cursor-default uppercase tracking-tighter"
                            >
                                {pub}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
