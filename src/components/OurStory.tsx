"use client";

import { motion } from "framer-motion";

export default function OurStory() {
    return (
        <section className="py-24 px-6 md:px-20 bg-[#050505]">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
                <div className="lg:sticky lg:top-32 w-full lg:w-1/3">
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-[#a8e03e] font-bold uppercase tracking-widest text-sm mb-4"
                    >
                        Our Story
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter leading-tight"
                    >
                        The journey of <br /> Sparkiit
                    </motion.h2>
                </div>

                <div className="w-full lg:w-2/3 space-y-8">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-400 leading-relaxed font-light"
                    >
                        Since 2021, we have been at the forefront of digital innovation, helping brands navigate the complex landscape of Web3, Blockchain, and immersive technology.
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-lg text-gray-500 leading-relaxed"
                    >
                        Our mission is to empower visionaries with the tools and strategies needed to transform industries. We believe that technology should be a catalyst for change, not a barrier. By blending creative design with deep technical expertise, we create experiences that are not only beautiful but also functional and secure.
                    </motion.p>
                    <div className="pt-8">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="group flex items-center gap-3 text-white border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all"
                        >
                            Read More
                            <span className="bg-[#a8e03e] text-black rounded-full p-1 group-hover:bg-black group-hover:text-[#a8e03e] transition-colors">→</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </section>
    );
}
