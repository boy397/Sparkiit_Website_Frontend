"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompanyInsights from "@/components/CompanyInsights";
import { motion } from "framer-motion";
import Image from "next/image";

const blogPosts = [
    {
        title: "The Future of Web3 in 2026",
        date: "MARCH 02, 2026",
        category: "INSIGHTS",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
    },
    {
        title: "Creating Immersive User Experiences",
        date: "FEBRUARY 15, 2026",
        category: "DESIGN",
        image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop"
    },
    {
        title: "Scaling Blockchain Solutions for DeFi",
        date: "JANUARY 28, 2026",
        category: "TECH",
        image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop"
    }
];

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <section className="pt-40 pb-20 px-6 md:px-20">
                <div className="max-w-7xl mx-auto">
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[#a8e03e] font-bold uppercase tracking-[0.3em] text-xs mb-6"
                    >
                        Our Blog
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-12"
                    >
                        COMPANY <br /> <span className="text-white/20">INSIGHTS.</span>
                    </motion.h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl mb-8">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6 bg-[#a8e03e] text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">
                                        {post.category}
                                    </div>
                                </div>
                                <p className="text-white/40 text-xs font-bold tracking-[0.2em] mb-4">{post.date}</p>
                                <h2 className="text-2xl font-bold leading-tight group-hover:text-[#a8e03e] transition-colors">{post.title}</h2>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <CompanyInsights />

            <Footer />
        </main>
    );
}
