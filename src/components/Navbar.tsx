"use client";

import Link from "next/link";
import { Search, ShoppingBasket, User, ChevronDown, LayoutGrid, Plus } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b border-white/5 bg-[#050505]/50">
            {/* Left Side: Logo and Links */}
            <div className="flex items-center gap-10">
                <div className="flex items-center gap-2">
                    <div className="bg-[#a8e03e] text-black w-8 h-8 flex items-center justify-center rounded-sm">
                        <Plus size={20} className="font-bold border-2 border-black rounded-sm" />
                    </div>
                    <Link href="/" className="text-xl font-bold tracking-widest uppercase text-white">
                        Sparkiit
                    </Link>
                </div>

                <div className="hidden xl:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-[#a8e03e] transition-colors">
                        Home
                    </Link>
                    <Link href="/domains" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        Domains
                    </Link>
                    <div className="group relative flex items-center gap-1 cursor-pointer">
                        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                            Enroll Now
                        </span>
                        <ChevronDown size={14} className="text-white/30 group-hover:text-white transition-colors" />
                    </div>
                    <Link href="/about" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        About Us
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        Contact Us
                    </Link>
                    <div className="group relative flex items-center gap-1 cursor-pointer">
                        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                            More
                        </span>
                        <ChevronDown size={14} className="text-white/30 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>

            {/* Right Side: Search and User Actions */}
            <div className="flex items-center gap-6">
                {/* Search Bar Container */}
                <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full h-11 pl-4 pr-1 focus-within:border-[#a8e03e]/40 transition-all duration-300">
                    <div className="flex items-center gap-2 cursor-pointer group pr-3 border-r border-white/5">
                        <LayoutGrid size={16} className="text-[#a8e03e]" />
                        <span className="text-xs font-semibold text-white/60 whitespace-nowrap">Categories</span>
                        <ChevronDown size={12} className="text-white/20" />
                    </div>

                    <input
                        type="text"
                        placeholder="Search For Course ..."
                        className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-white/20 px-4 w-[180px] xl:w-[240px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <button className="bg-[#a8e03e] hover:bg-[#96c937] text-black w-9 h-9 rounded-full transition-transform hover:scale-105 active:scale-95 flex items-center justify-center shrink-0">
                        <Search size={16} />
                    </button>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-2">
                    <div className="relative p-2 rounded-full hover:bg-white/5 cursor-pointer transition-colors group">
                        <ShoppingBasket size={22} className="text-white/60 group-hover:text-white transition-colors" />
                        <span className="absolute top-1 right-1 bg-[#a8e03e] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                            0
                        </span>
                    </div>
                    <div className="p-2 rounded-full hover:bg-white/5 cursor-pointer transition-colors group">
                        <User size={22} className="text-white/60 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </nav>
    );
}
