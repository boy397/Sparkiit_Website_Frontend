import Link from "next/link";
import { Plus } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/5">
            <div className="flex items-center gap-2">
                <div className="bg-[#a8e03e] text-black w-8 h-8 flex items-center justify-center rounded-sm">
                    <Plus size={20} className="font-bold border-2 border-black rounded-sm" />
                </div>
                <Link href="/" className="text-xl font-bold tracking-widest uppercase">
                    Sparkiit
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm">
                <Link href="/" className="text-[#a8e03e]">
                    Home
                </Link>
                <Link href="#services" className="hover:text-white/80 transition-colors">
                    Service
                </Link>
                <Link href="#projects" className="hover:text-white/80 transition-colors">
                    Projects
                </Link>
                <Link href="#blogs" className="hover:text-white/80 transition-colors">
                    Blogs
                </Link>
                <button className="flex items-center gap-1 hover:text-white/80 transition-colors">
                    All Pages
                    <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </button>
            </div>

            <div>
                <Link
                    href="#contact"
                    className="group relative flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm transition-all hover:bg-white/10"
                >
                    Contact
                    <span className="h-2 w-2 rounded-full bg-[#a8e03e]" />
                </Link>
            </div>
        </nav>
    );
}
