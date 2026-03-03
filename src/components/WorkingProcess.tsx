"use client";

import { motion } from "framer-motion";

const steps = [
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
    return (
        <section className="py-24 px-6 md:px-20 bg-[#050505]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <h2 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter">
                        WORKING <br /> PROCESS.
                    </h2>
                    <p className="max-w-sm text-gray-500 font-medium">
                        A systematic approach to turning complex ideas into seamless digital experiences.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group relative"
                        >
                            <span className="text-8xl font-black text-white/5 absolute -top-10 -left-6 group-hover:text-[#a8e03e]/10 transition-colors">
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
