"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompanyInsights from "@/components/CompanyInsights";
import { motion } from "framer-motion";
import Image from "next/image";

export default function BlogPage() {
    const [blogPosts, setBlogPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/public';
        fetch(`${API_BASE}/blogs`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setBlogPosts(data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);
    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <section className="pt-40 pb-20 px-6 md:px-20">
                <div className="max-w-7xl mx-auto">
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[#00875a] font-bold uppercase tracking-[0.3em] text-xs mb-6"
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
                        {blogPosts.map((post: any, index: number) => (
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
                                    <div className="absolute top-6 left-6 bg-[#00875a] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">
                                        {post.category}
                                    </div>
                                </div>
                                <p className="text-white/40 text-xs font-bold tracking-[0.2em] mb-4">{post.date}</p>
                                <h2 className="text-2xl font-bold leading-tight group-hover:text-[#00875a] transition-colors">{post.title}</h2>
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
