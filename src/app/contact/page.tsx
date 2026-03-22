"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <section className="pt-40 pb-24 px-6 md:px-20">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
                    <div className="lg:w-1/2">
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[#00875a] font-bold uppercase tracking-[0.3em] text-xs mb-6"
                        >
                            Contact Us
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-12"
                        >
                            LET&apos;S WORK <br /> <span className="text-white/20">TOGETHER.</span>
                        </motion.h1>

                        <div className="space-y-10">
                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#00875a] group-hover:text-white transition-all">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-1">Email Us</p>
                                    <p className="text-xl font-bold">hello@sparkiit.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#00875a] group-hover:text-white transition-all">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-1">Call Us</p>
                                    <p className="text-xl font-bold">+1 (234) 567-890</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#00875a] group-hover:text-white transition-all">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-1">Visit Us</p>
                                    <p className="text-xl font-bold">123 Design St, Creative City</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:w-1/2 bg-white/5 p-10 md:p-12 rounded-[40px] border border-white/10 backdrop-blur-xl"
                    >
                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Full Name</label>
                                    <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-[#00875a]/50 focus:ring-0 transition-all text-white placeholder:text-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Email Address</label>
                                    <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-[#00875a]/50 focus:ring-0 transition-all text-white placeholder:text-white/10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Budget Range</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-[#00875a]/50 focus:ring-0 transition-all text-white/50">
                                    <option>$5k - $10k</option>
                                    <option>$10k - $25k</option>
                                    <option>$25k+</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Your Message</label>
                                <textarea rows={4} placeholder="Tell us about your project..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-[#00875a]/50 focus:ring-0 transition-all text-white placeholder:text-white/10 resize-none"></textarea>
                            </div>
                            <button className="w-full bg-[#00875a] text-white font-black uppercase tracking-[0.2em] py-6 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#00875a]/10">
                                Send Inquiry
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
