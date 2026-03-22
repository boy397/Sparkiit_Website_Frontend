"use client";

import { motion } from "framer-motion";
import { useHomepageData } from "@/hooks/useHomepageData";

const fallbackSteps = [
    {
        num: "01",
        title: "STRATEGY",
        desc: "We define the vision, goals, and core requirements to ensure a solid foundation for your project."
    },
    {
        num: "02",
        title: "DESIGN",
        desc: "Our creative team builds intuitive and visually stunning interfaces that prioritize user experience."
    },
    {
        num: "03",
        title: "DEVELOP",
        desc: "Scaleable, secure, and high-performance solutions built with modern technology stacks."
    }
];

export default function WorkingProcess() {
    const { data } = useHomepageData();

    const process = data?.content?.process || {
        title: "SPARKIIT CATCHPHRASE",
        description: "A systematic approach to turning complex ideas into seamless digital experiences.",
        step1Title: "IDEA",
        step1Desc: "We define the vision, goals, and core requirements to ensure a solid foundation for your project.",
        step2Title: "INNOVATION",
        step2Desc: "Our creative team builds intuitive and visually stunning interfaces that prioritize user experience.",
        step3Title: "TRANSFORMATION",
        step3Desc: "Scaleable, secure, and high-performance solutions built with modern technology stacks.",
    };

    const steps = [
        { num: "01", title: process.step1Title || fallbackSteps[0].title, desc: process.step1Desc || fallbackSteps[0].desc },
        { num: "02", title: process.step2Title || fallbackSteps[1].title, desc: process.step2Desc || fallbackSteps[1].desc },
        { num: "03", title: process.step3Title || fallbackSteps[2].title, desc: process.step3Desc || fallbackSteps[2].desc },
    ];

    return (
        <section className="py-12 px-6 md:px-20 bg-[#050505] ">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    
                    <h2 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter cursor-default">
                        {/* Split by break first, then by word */}
                        {(process.title || "").split(' <br /> ').map((line: string, i: number) => (
                            <span key={i} className="block">
                                {line.split(' ').map((word: string, j: number) => (
                                    <motion.span
                                        key={j}
                                        whileHover={{ scale: 1.05, color: "#00875a" }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                        // inline-block is required for scale transforms to work on text
                                        className="inline-block mr-3 md:mr-4 last:mr-0 origin-left"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h2>

                    <p className="max-w-sm text-gray-500 font-medium">
                        {process.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 1, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group relative"
                        >
                            <span className="text-8xl font-black absolute -top-10 -left-6 transition-all duration-700 select-none text-transparent group-hover:text-[#00875a]/10" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.15)" }}>
                                {step.num}
                            </span>
                            <div className="relative z-10 pt-10">
                                <h3 className="text-2xl font-bold text-white mb-4 tracking-wider">{step.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}