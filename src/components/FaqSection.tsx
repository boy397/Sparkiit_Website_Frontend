"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Plus, Minus, HelpCircle } from "lucide-react";
import { API_PUBLIC_URL } from "@/lib/api-config";
import { motion, AnimatePresence } from "framer-motion";

interface FAQ {
    _id: string;
    question: string;
    answer: string;
}

export default function FaqSection() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [openId, setOpenId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const res = await fetch(`${API_PUBLIC_URL}/faqs`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                if (data.success) {
                    setFaqs(data.data || []);
                    if (data.data?.length > 0) setOpenId(data.data[0]._id);
                }
            } catch (err) {
                console.error("FAQ: Fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    const toggleFaq = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    if (loading) return null;
    if (faqs.length === 0) return null;

    return (
        <section id="faq" className="py-24 md:py-32 bg-[#050505] relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00875a]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00875a]/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16 md:mb-24">
                        <motion.span 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-[#00875a] font-black tracking-[0.3em] uppercase text-xs md:text-sm mb-4 block"
                        >
                            Common Questions
                        </motion.span>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-white leading-tight uppercase"
                        >
                            Frequently Asked <span className="text-[#00875a]">Questions</span>
                        </motion.h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div 
                                key={faq._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`border rounded-2xl transition-all duration-300 ${
                                    openId === faq._id 
                                    ? "bg-white/[0.03] border-[#00875a]/30 shadow-[0_10px_40px_rgba(0,135,90,0.05)]" 
                                    : "bg-white/[0.01] border-white/5 hover:border-white/10"
                                }`}
                            >
                                <button 
                                    onClick={() => toggleFaq(faq._id)}
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                                >
                                    <span className={`text-lg md:text-xl font-bold uppercase tracking-tight transition-colors duration-300 ${
                                        openId === faq._id ? "text-[#00875a]" : "text-white/80"
                                    }`}>
                                        {faq.question}
                                    </span>
                                    <div className={`shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        openId === faq._id ? "bg-[#00875a] text-white rotate-180" : "bg-white/5 text-white/30"
                                    }`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {openId === faq._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 md:px-8 pb-8 pt-0">
                                                <div className="h-px bg-[#00875a]/10 mb-6" />
                                                <p className="text-white/50 text-base md:text-lg leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="mt-20 text-center"
                    >
                        <p className="text-white/30 text-sm font-medium">
                            Still have questions? <a href="/contact" className="text-[#00875a] hover:underline font-bold">Contact our support team</a>
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
