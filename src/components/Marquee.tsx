"use client";

import { motion } from "framer-motion";

const logos = [
    "LOGOTYPE", "BLOCKCHAIN", "CRYPTO", "WEB3", "DEFI", "NFT", "SPARK", "AGENCY"
];

export default function Marquee() {
    return (
        <section className="py-20 border-y border-white/5 overflow-hidden bg-[#050505]">
            <div className="flex whitespace-nowrap">
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-100%" }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex shrink-0 gap-16 pr-16"
                >
                    {logos.concat(logos).map((logo, index) => (
                        <span
                            key={index}
                            className="text-4xl md:text-6xl font-black text-white/10 uppercase tracking-tighter"
                        >
                            {logo}
                        </span>
                    ))}
                </motion.div>
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-100%" }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex shrink-0 gap-16 pr-16"
                >
                    {logos.concat(logos).map((logo, index) => (
                        <span
                            key={index}
                            className="text-4xl md:text-6xl font-black text-white/10 uppercase tracking-tighter"
                        >
                            {logo}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
