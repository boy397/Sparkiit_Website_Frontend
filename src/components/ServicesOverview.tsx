"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const services = [
    "Application Development",
    "UI/UX Strategy & Design",
    "Blockchain Solutions",
    "Smart Contract Audit",
    "Digital Marketing",
    "Content Strategy"
];

export default function ServicesOverview() {
    return (
        <section className="py-24 px-6 md:px-20 bg-[#050505] border-y border-white/5">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
                <div className="lg:w-1/3">
                    <p className="text-[#a8e03e] font-bold uppercase tracking-widest text-sm mb-4">Our Expertise</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-8 leading-tight">
                        Tailored solutions for <br /> modern brands.
                    </h2>
                    <p className="text-gray-500 leading-relaxed mb-10">
                        We provide end-to-end digital services that help companies scale, innovate, and lead in their respective markets.
                    </p>
                    <button className="bg-white/10 text-white px-8 py-4 rounded-full font-bold uppercase text-sm hover:bg-white hover:text-black transition-all">
                        View All Services
                    </button>
                </div>

                <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 overflow-hidden rounded-3xl">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group bg-[#050505] p-10 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                        >
                            <h3 className="text-xl font-bold text-white/80 group-hover:text-white transition-colors tracking-tight">{service}</h3>
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#a8e03e] group-hover:border-[#a8e03e] group-hover:text-black transition-all">
                                <ArrowRight size={18} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
