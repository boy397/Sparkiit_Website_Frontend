"use client";

import Link from "next/link";
import { Plus, Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { useHomepageData } from "@/hooks/useHomepageData";
import { API_BASE_URL } from "@/lib/api-config";

export interface FooterContent {
    logoText?: string;
    footerDesc?: string;
    copyright?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
}

export default function Footer(props: FooterContent) {
    const { data } = useHomepageData();
    
    const rawLogoUrl = data?.settings?.footerLogoUrl as string || "";
    const logoUrl = rawLogoUrl.startsWith("/uploads") 
        ? `${API_BASE_URL}${rawLogoUrl}` 
        : (rawLogoUrl || "/images.jpg");

    const site = {
        logoText: props.logoText || data?.content?.site?.logoText || "SPARKIIT",
        footerDesc: props.footerDesc || (data?.settings?.footerTagline as string) || data?.content?.site?.footerDesc || "A structured pathway designed for driven students to explore opportunities, develop in-demand skills, and turn career goals into real achievements.",
        copyright: props.copyright || (data?.settings?.footerCopyright as string) || data?.content?.site?.copyright || "© 2026 SPARKIIT AGENCY. ALL RIGHTS RESERVED.",
        github: props.github || data?.content?.site?.github || "#",
        twitter: props.twitter || data?.content?.site?.twitter || "#",
        linkedin: props.linkedin || data?.content?.site?.linkedin || "#",
        instagram: props.instagram || data?.content?.site?.instagram || "#"
    };

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (window.location.pathname === "/") {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    };

    return (
        <footer className="bg-[#050505] border-t border-white/5 pt-12 pb-[calc(env(safe-area-inset-bottom)+3rem)] px-6 md:px-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-12">
                <div className="lg:col-span-2">
                    <Link 
                        href="/" 
                        onClick={handleLogoClick}
                        className="flex items-center gap-2 mb-8 group shrink-0"
                    >
                        <img 
                            src={logoUrl} 
                            alt="Sparkiit" 
                            className="h-8 md:h-10 w-auto group-hover:scale-105 transition-transform" 
                        />
                    </Link>
                    <p className="text-gray-500 leading-relaxed mb-8">
                        {site.footerDesc}
                    </p>
                    <div className="flex gap-4">
                        <Link href={site.github || "#"}><Github className="text-white/40 hover:text-[#00875a] cursor-pointer transition-colors" size={20} /></Link>
                        <Link href={site.twitter || "#"}><Twitter className="text-white/40 hover:text-[#00875a] cursor-pointer transition-colors" size={20} /></Link>
                        <Link href={site.linkedin || "#"}><Linkedin className="text-white/40 hover:text-[#00875a] cursor-pointer transition-colors" size={20} /></Link>
                        <Link href={site.instagram || "#"}><Instagram className="text-white/40 hover:text-[#00875a] cursor-pointer transition-colors" size={20} /></Link>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-8">Navigation</h4>
                    <ul className="space-y-4 text-gray-500">
                        <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                        <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><Link href="/domains" className="hover:text-white transition-colors">Domains</Link></li>
                        <li><Link href="/blog" className="hover:text-white transition-colors">Blogs</Link></li>
                        <li><Link href="/verify" className="hover:text-white transition-colors">Verify Certificate</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-8">Stay Connected</h4>
                    <p className="text-gray-500 mb-6">Join our newsletter to receive the latest updates and insights.</p>
                    <div className="flex border-b border-white/20 pb-2">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="bg-transparent border-none outline-none focus:ring-0 text-white w-full placeholder:text-white/20 min-w-0"
                        />
                        <button className="text-[#00875a] font-bold uppercase text-xs tracking-widest shrink-0 ml-2">SUBMIT</button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/30 uppercase tracking-[0.2em]">
                <p>{site.copyright}</p>
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                    <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
                </div>
            </div>
        </footer>
    );
}
