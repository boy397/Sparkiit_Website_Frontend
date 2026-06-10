"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import AnimatedHeading from "./AnimatedHeading";

interface ContactSectionProps {
    title?: string;
    subtitle?: string;
    email?: string;
    phone?: string;
    address?: string;
}

export default function ContactSection(props: ContactSectionProps) {
    const { 
        title = "LET'S Turn Your Goals Into ACTION.", 
        subtitle = "Contact Us",
        email = "hello@sparkiit.com",
        phone = "+1 (234) 567-890",
        address = "123 Design St, Creative City"
    } = props;
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        message: ""
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage("");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus('success');
                setFormData({ fullName: "", email: "", phone: "", message: "" });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                throw new Error(result.error || "Failed to send inquiry");
            }
        } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.message || "Something went wrong.");
        }
    };

    return (
        <section className="py-20 md:py-24 px-4 sm:px-6 md:px-20 bg-[#050505]">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
                <div className="lg:w-1/2">
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-[#00875a] font-bold uppercase tracking-[0.3em] text-xs mb-6"
                    >
                        {subtitle}
                    </motion.p>
                    <AnimatedHeading 
                        as="h1"
                        text={(title || "").includes("Into ACTION.") 
                            ? (title || "").replace("Into ACTION.", "<br /> Into ACTION.") 
                            : (title || "")}
                        highlightWords={["Into", "ACTION"]}
                        className="text-4xl sm:text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-12"
                    />

                    <div className="space-y-10">
                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#00875a] group-hover:text-white transition-all duration-500">
                                <Mail size={24} />
                            </div>
                            <div className="transition-all duration-300 group-hover:translate-x-2">
                                <p className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase mb-1">Email Us</p>
                                <p className="text-xl font-bold">{email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#00875a] group-hover:text-white transition-all duration-500">
                                <Phone size={24} />
                            </div>
                            <div className="transition-all duration-300 group-hover:translate-x-2">
                                <p className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase mb-1">Call Us</p>
                                <p className="text-xl font-bold">{phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#00875a] group-hover:text-white transition-all duration-500">
                                <MapPin size={24} />
                            </div>
                            <div className="transition-all duration-300 group-hover:translate-x-2">
                                <p className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase mb-1">Visit Us</p>
                                <p className="text-xl font-bold">{address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="lg:w-1/2 bg-white/[0.03] p-6 sm:p-10 md:p-12 rounded-[2rem] md:rounded-[40px] border border-white/10 backdrop-blur-xl relative overflow-hidden group/form"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 grayscale group-hover/form:grayscale-0 group-hover/form:opacity-10 transition-all duration-1000">
                        <Send size={150} className="-rotate-12" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-[#00875a]/10 border border-[#00875a]/20 p-8 rounded-3xl text-center flex flex-col items-center gap-4 py-16"
                                >
                                    <div className="w-16 h-16 bg-[#00875a] rounded-full flex items-center justify-center text-white shadow-xl shadow-[#00875a]/20">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">Inquiry Sent!</h3>
                                    <p className="text-white/40 text-sm font-medium">Thank you for reaching out.</p>
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Full Name</label>
                                            <input required type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-[#00875a]/50 focus:bg-white/[0.08] outline-none transition-all text-white placeholder:text-white/10 font-medium" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Email Address</label>
                                            <input required type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-[#00875a]/50 focus:bg-white/[0.08] outline-none transition-all text-white placeholder:text-white/10 font-medium" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                        </div>
                                        <div className="space-y-3 md:col-span-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Phone Number</label>
                                            <input type="tel" placeholder="Your phone number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-[#00875a]/50 focus:bg-white/[0.08] outline-none transition-all text-white placeholder:text-white/10 font-medium" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Your Message</label>
                                        <textarea required rows={5} placeholder="Tell us about your project..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-[#00875a]/50 focus:bg-white/[0.08] outline-none transition-all text-white placeholder:text-white/10 resize-none font-medium" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                                    </div>

                                    {status === 'error' && (
                                        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-xs font-bold uppercase tracking-widest">
                                            <AlertCircle size={18} />
                                            {errorMessage}
                                        </div>
                                    )}

                                    <button disabled={status === 'loading'} className="w-full bg-[#00875a] text-white font-black uppercase tracking-[0.2em] py-6 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#00875a]/10 disabled:opacity-50 flex items-center justify-center gap-4 text-xs">
                                        {status === 'loading' ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : <>Send Inquiry <Send size={18} /></>}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}
