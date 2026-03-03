"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OurStory from "@/components/OurStory";
import CompanyInsights from "@/components/CompanyInsights";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            {/* About Hero */}
            <section className="pt-40 pb-20 px-6 md:px-20 border-b border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-12">
                    <div className="lg:w-1/2">
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[#a8e03e] font-bold uppercase tracking-[0.3em] text-xs mb-6"
                        >
                            Who We Are
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none"
                        >
                            WE ARE <br /> <span className="text-white/20">SPARKIIT.</span>
                        </motion.h1>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:w-1/3 bg-white/5 p-8 rounded-3xl border border-white/10"
                    >
                        <p className="text-gray-400 leading-relaxed mb-8">
                            A collective of designers, developers, and strategists dedicated to pushing the boundaries of what's possible in the digital realm.
                        </p>
                        <button className="bg-[#a8e03e] text-black px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:scale-105 transition-transform">
                            Get Started
                        </button>
                    </motion.div>
                </div>
            </section>

            <OurStory />

            <section className="py-24 px-6 md:px-20 bg-white/5">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold uppercase tracking-tighter mb-12 border-l-4 border-[#a8e03e] pl-6">Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {["Innovation", "Integrity", "Excellence"].map((val, i) => (
                            <div key={i} className="p-10 rounded-3xl border border-white/10 bg-[#050505]">
                                <h3 className="text-xl font-bold mb-4">{val}</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    We strive for {val.toLowerCase()} in everything we do, ensuring that our clients receive the highest quality of service and results.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CompanyInsights />

            <Footer />
        </main>
    );
}
