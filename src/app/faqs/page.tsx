"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqSection from "@/components/FaqSection";
import { motion } from "framer-motion";

export default function FAQStandalonePage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-[#00875a] selection:text-black pt-20">
            <Navbar />
            
            <div className="py-20">
                <div className="container mx-auto px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center mb-16"
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-6">
                            Help <span className="text-[#00875a]">Center</span>
                        </h1>
                        <p className="text-white/40 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                            Everything you need to know about our platform, admissions, and careers.
                        </p>
                    </motion.div>
                </div>
                
                <FaqSection />
            </div>

            <Footer />
        </main>
    );
}
