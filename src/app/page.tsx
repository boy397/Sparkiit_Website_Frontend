import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HorizontalScroll from "@/components/HorizontalScroll";
import ParallaxImage from "@/components/ParallaxImage";
import Marquee from "@/components/Marquee";
import OurStory from "@/components/OurStory";
import WorkingProcess from "@/components/WorkingProcess";
import LatestProjects from "@/components/LatestProjects";
import ServicesOverview from "@/components/ServicesOverview";
import CompanyInsights from "@/components/CompanyInsights";
import AmbassadorEngagement from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#a8e03e] selection:text-black">
      <Navbar />
      <HeroSection />

      {/* Ticker / Marquee Section */}
      <Marquee />

      {/* Services Horizontal Scroll (Existing) */}
      <HorizontalScroll />

      {/* Our Story Section */}
      <OurStory />

      {/* Working Process Section */}
      <WorkingProcess />

      {/* Latest Projects Section */}
      <LatestProjects />

      {/* Services Overview Section */}
      <ServicesOverview />

      {/* Parallax Image Section (Existing) */}
      <section className="h-screen w-full p-6 md:p-20 bg-[#050505] flex items-center justify-center">
        <div className="w-full max-w-6xl h-[80vh] rounded-3xl overflow-hidden relative">
          <ParallaxImage
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3271&auto=format&fit=crop"
            alt="Students collaborating"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter mix-blend-overlay">
              Learn Together
            </h2>
          </div>
        </div>
      </section>

      {/* Company Insights Section */}
      <CompanyInsights />

      <AmbassadorEngagement />

      {/* Final Call to Action / Footer Area */}
      <section className="min-h-[50vh] flex flex-col items-center justify-center p-10 md:p-20 bg-[#a8e03e] text-black">
        <h2 className="text-5xl sm:text-7xl md:text-9xl font-bold uppercase tracking-tighter text-center">Let&apos;s Build.</h2>
        <p className="mt-6 text-lg md:text-xl font-medium">Ready to transform education?</p>
      </section>

      <Footer />
    </main>
  );
}
