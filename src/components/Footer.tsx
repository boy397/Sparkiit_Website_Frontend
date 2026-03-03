"use client";

import Link from "next/link";
import { Plus, Github, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#050505] border-t border-white/5 pt-24 pb-12 px-6 md:px-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                <div className="lg:col-span-1">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="bg-[#a8e03e] text-black w-8 h-8 flex items-center justify-center rounded-sm">
                            <Plus size={20} className="font-bold border-2 border-black rounded-sm" />
                        </div>
                        <span className="text-xl font-bold tracking-widest uppercase text-white">Sparkiit</span>
                    </div>
                    <p className="text-gray-500 leading-relaxed mb-8">
                        Transforming the digital landscape through innovation, design, and deep technical expertise.
                    </p>
                    <div className="flex gap-4">
                        <Github className="text-white/40 hover:text-[#a8e03e] cursor-pointer transition-colors" size={20} />
                        <Twitter className="text-white/40 hover:text-[#a8e03e] cursor-pointer transition-colors" size={20} />
                        <Linkedin className="text-white/40 hover:text-[#a8e03e] cursor-pointer transition-colors" size={20} />
                        <Instagram className="text-white/40 hover:text-[#a8e03e] cursor-pointer transition-colors" size={20} />
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-8">Navigation</h4>
                    <ul className="space-y-4 text-gray-500">
                        <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                        <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><Link href="/domains" className="hover:text-white transition-colors">Domains</Link></li>
                        <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
                        <li><Link href="/blog" className="hover:text-white transition-colors">Blogs</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-8">Services</h4>
                    <ul className="space-y-4 text-gray-500">
                        <li><Link href="#" className="hover:text-white transition-colors">UI/UX Design</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Web Development</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Blockchain</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Cloud Solutions</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-8">Stay Connected</h4>
                    <p className="text-gray-500 mb-6">Join our newsletter to receive the latest updates and insights.</p>
                    <div className="flex border-b border-white/20 pb-2">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="bg-transparent border-none focus:ring-0 text-white w-full placeholder:text-white/20"
                        />
                        <button className="text-[#a8e03e] font-bold uppercase text-xs tracking-widest">SUBMIT</button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/30 uppercase tracking-[0.2em]">
                <p>© 2026 SPARKIIT AGENCY. ALL RIGHTS RESERVED.</p>
                <div className="flex gap-8">
                    <Link href="#" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
                    <Link href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</Link>
                </div>
            </div>
        </footer>
    );
}
