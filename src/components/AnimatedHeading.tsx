"use client";

import { motion } from "framer-motion";
import React from "react";

interface AnimatedHeadingProps {
    text: string;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
    className?: string;
    delay?: number;
    highlightWords?: string[];
}

export default function AnimatedHeading({
    text,
    as = "h2",
    className = "",
    delay = 0,
    highlightWords = [],
}: AnimatedHeadingProps) {
    // If the text is empty, render nothing
    if (!text) return null;

    // Standardize all line break tags and split by space
    const cleanText = text
        .replace(/<br\s*\/?>/gi, " <br> ")
        .replace(/\s+/g, " ")
        .trim();
    const words = cleanText.split(" ");
    
    // Container animation variants for stagger effect
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.04,
                delayChildren: delay,
            },
        },
    };

    // Staggered child slide-up variant
    const wordVariants: any = {
        hidden: { y: "110%" },
        visible: {
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.215, 0.61, 0.355, 1], // premium easeOutCubic curve
            },
        },
    };

    const Tag = as;

    return (
        <Tag className={className}>
            <motion.span
                className="inline-flex flex-wrap items-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
            >
                {words.map((word, index) => {
                    // Check for manual line breaks
                    if (word === "<br />" || word === "<br>") {
                        return <br key={index} className="w-full" />;
                    }

                    // Clean the word for comparison (remove common punctuation and lowercase)
                    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
                    
                    // Match highlights against clean words or substrings
                    const isHighlighted = highlightWords.some(
                        (hw) => {
                            const cleanHw = hw.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
                            return cleanWord === cleanHw || cleanWord.includes(cleanHw) || cleanHw.includes(cleanWord);
                        }
                    );

                    return (
                        <span 
                            key={index} 
                            className="inline-block overflow-hidden pb-1 mr-[0.22em] last:mr-0"
                            style={{ verticalAlign: "bottom" }}
                        >
                            <motion.span
                                variants={wordVariants}
                                className={`inline-block ${
                                    isHighlighted ? "text-[#00875a]" : ""
                                }`}
                            >
                                {word}
                            </motion.span>
                        </span>
                    );
                })}
            </motion.span>
        </Tag>
    );
}
