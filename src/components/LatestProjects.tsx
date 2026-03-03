"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const projects = [
    {
        num: "01",
        title: "DEX PROTOCOL",
        category: "BLOCKCHAIN",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
    },
    {
        num: "02",
        title: "NFT MARKETPLACE",
        category: "WEB3",
        image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop"
    },
    {
        num: "03",
        title: "DAO GOVERNANCE",
        category: "CRYPTO",
        image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop"
    },
    {
        num: "04",
        title: "WALLET APPS",
        category: "FINTECH",
        image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2787&auto=format&fit=crop"
    }
];

export default function LatestProjects() {
    return (
        <section className="py-24 px-6 md:px-20 bg-[#050505]">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-16 px-4 border-l-4 border-[#a8e03e] pl-6">
                    <div>
                        <p className="text-[#a8e03e] font-bold uppercase tracking-widest text-sm mb-2">Our Work</p>
                        <h2 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter">
                            LATEST <br /> PROJECTS.
                        </h2>
                    </div>
                    <button className="hidden md:block text-white/50 hover:text-white transition-colors uppercase font-bold text-sm tracking-widest pb-2">
                        View All Projects →
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group relative cursor-pointer"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold">
                                    {project.category}
                                </div>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#a8e03e] transition-colors">{project.title}</h3>
                                    <p className="text-gray-500 text-sm font-medium tracking-widest underline decoration-[#a8e03e]/30 underline-offset-4">EXPLORE PROJECT</p>
                                </div>
                                <span className="text-3xl font-black text-white/10 group-hover:text-[#a8e03e] transition-colors">{project.num}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
