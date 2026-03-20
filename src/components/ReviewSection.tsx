"use client";

import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useHomepageData } from "@/hooks/useHomepageData";

export default function ReviewSection() {
    const { data, loading } = useHomepageData();
    
    // Get rating from data or default to 5
    const ratingStr = data?.content?.review?.rating || "5";
    const rating = parseFloat(ratingStr);

    // Ensure rating is between 0 and 5
    const finalRating = Math.max(0, Math.min(5, rating));
    const fullStars = Math.floor(finalRating);
    const hasHalfStar = finalRating % 1 !== 0;

    return (
        <section className="py-10 bg-[#050505] flex flex-col items-center justify-center border-y border-white/5">
            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
            >
                <div className="flex gap-2 mb-4 justify-center">
                    {[...Array(5)].map((_, i) => (
                        <Star 
                            key={i}
                            size={32}
                            fill={i < fullStars ? "#a8e03e" : "transparent"}
                            color={i < fullStars ? "#a8e03e" : "rgba(255,255,255,0.1)"}
                            className={i < fullStars ? "drop-shadow-[0_0_10px_rgba(168,224,62,0.5)]" : ""}
                        />
                    ))}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-white">
                    Trusted by <span className="text-[#a8e03e]">10,000+</span> Students
                </h3>
                <p className="text-white/40 mt-2 text-sm md:text-base uppercase tracking-widest font-medium">
                    Excellent {finalRating.toFixed(1)}/5.0 Rating based on verified reviews
                </p>
            </motion.div>
        </section>
    );
}
