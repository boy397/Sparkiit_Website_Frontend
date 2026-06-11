"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionRenderer from "@/components/SectionRenderer";
import { useHomepageData } from "@/hooks/useHomepageData";
import Preloader from "@/components/Preloader";
import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const { data, loading, error } = useHomepageData();
  const [introComplete, setIntroComplete] = useState(false);

  React.useEffect(() => {
    try {
      const hasShown = sessionStorage.getItem("preloaderShown");
      if (hasShown) {
        setIntroComplete(true);
      }
    } catch (e) {}
  }, []);

  const handleComplete = () => {
    setIntroComplete(true);
    try {
      sessionStorage.setItem("preloaderShown", "true");
    } catch (e) {}
  };

  // Build enriched sections that pass all relevant homepage data to each section component
  const enrichedSections = useMemo(() => {
    if (!data?.pageStructure) return [];

    return data.pageStructure.map(s => {
      const baseContent = s.content || {};

      // Enrich each section type with the relevant data from the homepage response
      switch (s.name) {
        case 'HeroSection':
          return {
            name: s.name,
            enabled: s.enabled,
            order: s.order,
            content: {
              ...baseContent,
              ...(data.content?.hero || {}),
            }
          };
        case 'HorizontalScroll':
          return {
            name: s.name,
            enabled: s.enabled,
            order: s.order,
            content: {
              ...baseContent,
              items: data.horizontalScrollItems,
            }
          };
        case 'WorkingProcess':
          return {
            name: s.name,
            enabled: s.enabled,
            order: s.order,
            content: {
              ...baseContent,
              ...(data.content?.process || {}),
            }
          };
        case 'OurStory':
          return {
            name: s.name,
            enabled: s.enabled,
            order: s.order,
            content: {
              ...baseContent,
              ...(data.content?.story || {}),
            }
          };
        case 'FeaturedIn':
          return {
            name: s.name,
            enabled: s.enabled,
            order: s.order,
            content: {
              ...baseContent,
              items: data.brands && data.brands.length > 0 ? data.brands : undefined,
            }
          };
        case 'LatestProjects':
          return {
            name: s.name,
            enabled: s.enabled,
            order: s.order,
            content: {
              ...baseContent,
              items: data.recognitions && data.recognitions.length > 0 ? data.recognitions : undefined,
            }
          };
        case 'MentorsSection':
          return {
            name: s.name,
            enabled: s.enabled,
            order: s.order,
            content: {
              ...baseContent,
              ...(data.content?.mentors || {}),
              mentors: data.mentors && data.mentors.length > 0 ? data.mentors : undefined,
            }
          };
        case 'Testimonials':
          return {
            name: s.name,
            enabled: s.enabled,
            order: s.order,
            content: {
              ...baseContent,
              ...(data.content?.testimonials || {}),
              testimonials: data.testimonials && data.testimonials.length > 0 ? data.testimonials : undefined,
            }
          };
        case 'FaqSection':
          return {
            name: s.name,
            enabled: s.enabled,
            order: s.order,
            content: {
              ...baseContent,
              faqs: data.faqs && data.faqs.length > 0 ? data.faqs : undefined,
            }
          };
        case 'ContactSection':
          return {
            name: s.name,
            enabled: s.enabled,
            order: s.order,
            content: {
              ...baseContent,
              email: data.settings?.contact_email as string || baseContent.email,
              phone: data.settings?.contact_phone as string || baseContent.phone,
              address: data.settings?.contact_address as string || baseContent.address,
            }
          };
        case 'CompanyInsights':
          return {
            name: s.name,
            enabled: s.enabled,
            order: s.order,
            content: {
              ...baseContent,
              ...(data.content?.insights || {}),
            }
          };
        case 'Marquee':
          return {
            name: s.name,
            enabled: s.enabled,
            order: s.order,
            content: {
              ...baseContent,
              items: data.collaborators && data.collaborators.length > 0
                ? data.collaborators.map((c: any) => c.name)
                : baseContent.items,
            }
          };
        case 'ServicesOverview':
          return {
            name: s.name,
            enabled: s.enabled,
            order: s.order,
            content: {
              ...baseContent,
              ...(data.content?.expertise || {}),
              services: data.services && data.services.length > 0 ? data.services : undefined,
            }
          };
        default:
          return {
            name: s.name,
            enabled: s.enabled,
            order: s.order,
            content: baseContent
          };
      }
    });
  }, [data]);

  // Show content as ready: if data is loaded or if we already completed the intro and have data
  const contentReady = !loading || (introComplete && data !== null);

  return (
    <>
      {/* Preloader sits on top with z-[9999] and its own bg-[#050505] */}
      <AnimatePresence>
        {!introComplete && (
          <Preloader onComplete={handleComplete} loading={loading} />
        )}
      </AnimatePresence>

      {/* Main always has dark bg to prevent any white flash */}
      <main className="min-h-screen bg-[#050505] text-white selection:bg-[#00875a] selection:text-black">
        {contentReady ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Navbar />
            
            {error ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
                <h2 className="text-2xl font-bold text-[#00875a] mb-4 uppercase tracking-widest">Unable to load sections</h2>
                <p className="text-white/40 text-sm max-w-md mx-auto mb-8">We encountered an issue fetching the homepage content. Please try again later or contact support if the issue persists.</p>
                <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#00875a] hover:text-black transition-all">Reload Page</button>
              </div>
            ) : (
              <SectionRenderer sections={enrichedSections} />
            )}

            <Footer />
          </motion.div>
        ) : null}
      </main>
    </>
  );
}
