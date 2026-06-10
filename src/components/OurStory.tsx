"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useHomepageData } from "@/hooks/useHomepageData";
import TextReveal from "./TextReveal";

export interface OurStoryContent {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
}

export default function OurStory(props: OurStoryContent) {
    const { data } = useHomepageData();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const opacityFade = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    const story = {
        title: props.title || data?.content?.story?.title || "The journey of SPARKIIT",
        subtitle: props.subtitle || data?.content?.story?.subtitle || "SPARKIIT EDTECH LLP was created to solve a real problem—students often finish courses with theory, but lack the practical exposure companies expect. To change that, SPARKIIT set out to build a learning ecosystem focused on real skills, real projects, and real industry experience.",
        description: props.description || data?.content?.story?.description || "From live training and guided mentorship to hands-on projects and structured internships, SPARKIIT designs programs that help learners move beyond classrooms and step confidently toward their careers. The focus has always been simple: make learning practical, relevant, and aligned with what today’s industries actually need.",
        extraText: "Today, SPARKIIT EDTECH LLP continues to grow as a career-focused learning platform dedicated to helping students explore domains, build confidence, and become industry-ready.",
        image: props.image || ""
    };

    return (
        <section ref={containerRef} className="py-20 md:py-24 px-4 sm:px-6 md:px-20 bg-[#050505] overflow-hidden">
            <motion.div 
                style={{ opacity: opacityFade }}
                className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start"
            >
                <div className="lg:sticky lg:top-32 w-full lg:w-1/3">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <span className="text-[#00875a] font-bold uppercase tracking-[0.2em] text-xs border border-[#00875a]/20 px-6 py-2.5 rounded-full inline-block backdrop-blur-sm">
                            Our Story
                        </span>
                    </motion.div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-tighter leading-tight">
                        <TextReveal text={(story.title || "").replace(' <br /> ', ' ')} />
                    </h2>
                </div>

                <div className="w-full lg:w-2/3 space-y-10">
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-lg sm:text-xl md:text-3xl text-gray-300 leading-tight font-medium"
                    >
                        {story.subtitle}
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg text-gray-500 leading-relaxed font-medium"
                    >
                        {story.description}
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-lg text-gray-500 leading-relaxed font-medium"
                    >
                        {story.extraText}
                    </motion.p>
                </div>
            </motion.div>
        </section>
    );
}
