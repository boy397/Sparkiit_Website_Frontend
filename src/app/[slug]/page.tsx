"use client";

import React, { use, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionRenderer from "@/components/SectionRenderer";
import { usePageData } from "@/hooks/usePageData";
import Preloader from "@/components/Preloader";
import { AnimatePresence } from "framer-motion";

export default function DynamicPage({ params }: { params: any }) {
    // Robustly handle params whether it's a Promise or a plain object
    const resolvedParams = params instanceof Promise ? React.use(params) : params;
    const { slug } = resolvedParams;
    const { data, loading, error } = usePageData(slug);
    
    useEffect(() => {
        if (data) {
            console.log(`[DynamicPage] Data for slug "${slug}":`, data);
        }
        if (error) {
            console.error(`[DynamicPage] Error fetching slug "${slug}":`, error);
        }
    }, [data, error, slug]);

    const [introComplete, setIntroComplete] = React.useState(false);

    useEffect(() => {
        const hasShown = sessionStorage.getItem("preloaderShown");
        if (hasShown) {
            setIntroComplete(true);
        }
    }, []);

    const handleComplete = () => {
        setIntroComplete(true);
        sessionStorage.setItem("preloaderShown", "true");
    };

    if (error) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-4 uppercase tracking-tighter">404 - Not Found</h1>
                    <p className="text-gray-500 mb-8 max-w-md">The page you are looking for might have been removed or is temporarily unavailable.</p>
                    <a href="/" className="bg-[#00875a] text-white px-8 py-3 rounded-full font-bold uppercase text-sm tracking-widest hover:scale-105 transition-all">Back to Home</a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#050505] min-h-screen">
            <AnimatePresence mode="wait">
                {!introComplete && <Preloader key="preloader" onComplete={handleComplete} loading={loading} />}
            </AnimatePresence>
            
            <Navbar />
            
            <main className={`transition-opacity duration-1000 ${!loading || (introComplete && data) ? 'opacity-100' : 'opacity-0'}`}>
                {data?.sections && <SectionRenderer sections={data.sections} />}
            </main>

            <Footer />
        </div>
    );
}
