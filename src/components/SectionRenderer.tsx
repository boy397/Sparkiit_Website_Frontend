"use client";

import React from "react";
import dynamic from "next/dynamic";
import HeroSection from "./HeroSection";
import Marquee from "./Marquee";

// Dynamically import components below the fold for optimized initial bundle loading
const HorizontalScroll = dynamic(() => import("./HorizontalScroll"));
const ServicesOverview = dynamic(() => import("./ServicesOverview"));
const Collaborations = dynamic(() => import("./Collaborations"));
const OurStory = dynamic(() => import("./OurStory"));
const Colleges = dynamic(() => import("./Colleges"));
const ReviewSection = dynamic(() => import("./ReviewSection"));
const WorkingProcess = dynamic(() => import("./WorkingProcess"));
const LatestProjects = dynamic(() => import("./LatestProjects"));
const ParallaxImage = dynamic(() => import("./ParallaxImage"));
const CompanyInsights = dynamic(() => import("./CompanyInsights"));
const RoadmapSection = dynamic(() => import("./RoadmapSection"));
const FeaturedIn = dynamic(() => import("./FeaturedIn"));
const MentorsSection = dynamic(() => import("./MentorsSection"));
const AmbassadorEngagement = dynamic(() => import("./Testimonials"));
const RichTextSection = dynamic(() => import("./RichTextSection"));
const FaqSection = dynamic(() => import("./FaqSection"));
const ContactSection = dynamic(() => import("./ContactSection"));
const VerifySection = dynamic(() => import("./VerifySection"));
const CourseCatalogSection = dynamic(() => import("./CourseCatalogSection"));
const JobPortalSection = dynamic(() => import("./JobPortalSection"));
const VideoSection = dynamic(() => import("./VideoSection"));

interface Section {
    name: string;
    enabled: boolean;
    order: number;
    content: any;
}

interface SectionRendererProps {
    sections: Section[];
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
    const sectionMap: Record<string, (content: any) => React.ReactNode> = {
        HeroSection: (content) => <HeroSection {...content} />,
        Marquee: (content) => <Marquee {...content} />,
        HorizontalScroll: (content) => <HorizontalScroll {...content} />,
        ServicesOverview: (content) => <ServicesOverview {...content} />,
        Collaborations: (content) => <Collaborations {...content} />,
        OurStory: (content) => <OurStory {...content} />,
        Colleges: (content) => <Colleges {...content} />,
        ReviewSection: (content) => <ReviewSection {...content} />,
        WorkingProcess: (content) => <WorkingProcess {...content} />,
        LatestProjects: (content) => <LatestProjects {...content} />,
        ParallaxImage: (content) => (
            <section className="h-[80vh] w-full p-6 md:p-10 bg-[#050505] flex items-center justify-center">
                <div className="w-full max-w-6xl h-[80vh] rounded-3xl overflow-hidden relative">
                    <ParallaxImage
                        src={content.src || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3271&auto=format&fit=crop"}
                        alt={content.alt || "Students collaborating"}
                        className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter mix-blend-overlay">
                            {content.title || "Learn Together"}
                        </h2>
                    </div>
                </div>
            </section>
        ),
        CompanyInsights: (content) => <CompanyInsights {...content} />,
        RoadmapSection: (content) => <RoadmapSection {...content} />,
        FeaturedIn: (content) => <FeaturedIn {...content} />,
        Testimonials: (content) => <AmbassadorEngagement {...content} />,
        MentorsSection: (content) => <MentorsSection {...content} />,
        FaqSection: (content) => <FaqSection {...content} />,
        CustomRichText: (content) => <RichTextSection html={content.html} />,
        ContactSection: (content) => <ContactSection {...content} />,
        VerifySection: (content) => <VerifySection {...content} />,
        CourseCatalogSection: (content) => <CourseCatalogSection {...content} />,
        JobPortalSection: (content) => <JobPortalSection {...content} />,
        VideoSection: (content) => <VideoSection {...content} />,
    };

    const sectionsArray = Array.isArray(sections) ? sections : [];
    const sortedSections = [...sectionsArray]
        .filter(s => s.enabled)
        .sort((a, b) => a.order - b.order);

    return (
        <>
            {sortedSections.map((section, index) => {
                // Case-insensitive lookup
                const sectionName = section.name;
                const renderFn = sectionMap[sectionName] || 
                                 sectionMap[Object.keys(sectionMap).find(k => k.toLowerCase() === sectionName.toLowerCase()) || ""];
                
                if (!renderFn) {
                    console.warn(`[SectionRenderer] No component found for section: "${sectionName}"`);
                    return null;
                }
                
                return (
                    <React.Fragment key={`${sectionName}-${index}`}>
                        {renderFn(section.content || {})}
                    </React.Fragment>
                );
            })}
        </>
    );
}
