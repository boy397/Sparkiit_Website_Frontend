"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxImage({
    src,
    alt,
    className = "",
    speed = 0.5,
}: {
    src: string;
    alt: string;
    className?: string;
    speed?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <motion.img
                src={src}
                alt={alt}
                style={{ y }}
                className="absolute top-0 left-0 w-full h-[120%] object-cover object-center"
            />
        </div>
    );
}
