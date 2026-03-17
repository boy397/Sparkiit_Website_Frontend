import React from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// Replace these placeholders with actual paths to ornate icons or use an ornate icon library
const ornateIcons = {
  lightbulb: '/ornate-lightbulb.png',
  communicate: '/ornate-communicate.png',
  publicise: '/ornate-publicise.png',
  lead: '/ornate-lead.png',
};

const engagementCardsData = [
  {
    iconPath: ornateIcons.lightbulb, // Or use a decorative icon from a library
    header: 'Ideate & Execute',
    description: 'Planning & organising entrepreneurship related events in your college with the support of the E-Cell, IIT Bombay.',
    colorClass: 'ideate-card',
  },
  {
    iconPath: ornateIcons.communicate, // Or use a decorative icon from a library
    header: 'Communicate',
    description: 'Act as a bridge between E-Cell, IIT Bombay and your college by sharing information, updates, and opportunities through emails, notices, and social media platforms.',
    colorClass: 'communicate-card',
  },
  {
    iconPath: ornateIcons.publicise, // Or use a decorative icon from a library
    header: 'Publicise',
    description: "Act as a channel to share E-Cell, IIT Bombay's initiatives that could impact students' careers and interests, helping the information reach those who can benefit from it.",
    colorClass: 'publicise-card',
  },
  {
    iconPath: ornateIcons.lead, // Or use a decorative icon from a library
    header: 'Lead',
    description: 'Lead and coordinate with the startup ecosystem in and around your college.',
    colorClass: 'lead-card',
  },
];

interface EngagementCardProps {
  iconPath: string;
  header: string;
  description: string;
  colorClass: string;
}

// Function to handle specific word highlights
const formatDescription = (text: string) => {
  const parts = text.split(/(E-Cell, IIT Bombay)/g);
  return parts.map((part, index) =>
    part === 'E-Cell, IIT Bombay' ? (
      <span key={index} className="text-[#f1c40f] font-medium">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const EngagementCard: React.FC<EngagementCardProps> = ({ iconPath, header, description, colorClass }) => {
  return (
    <div
      className={`relative group rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 ease-in-out border border-transparent shadow-2xl ${colorClass}-hover w-full max-w-sm`}
    >
      {/* Texture Overlay (placeholder logic for texture) */}
      <div className="absolute inset-0 rounded-3xl opacity-5 mix-blend-overlay">
        {/* Placeholder: Use a real cloud texture pattern as a background-image here in CSS */}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Ornate Golden Icon */}
        <div className="w-20 h-20 mb-10 flex items-center justify-center filter drop-shadow-[0_2px_4px_rgba(255,191,0,0.5)]">
          <Image
            src={iconPath} // Placeholder path
            alt={header}
            width={80}
            height={80}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Header - Styled to be golden and distinct */}
        <h3 className="text-3xl font-bold text-[#ffbf00] mb-6 leading-tight ornate-title drop-shadow-[0_1px_2px_rgba(255,191,0,0.3)]">
          {header}
        </h3>

        {/* Description */}
        <p className={`text-xl font-normal text-[#e0e0e0] leading-relaxed ${inter.className}`}>
          {formatDescription(description)}
        </p>
      </div>
    </div>
  );
};

const AmbassadorEngagement: React.FC = () => {
  return (
    <section className="bg-[#050505] min-h-screen py-24 px-8 relative overflow-hidden">
      {/* Background Texture (subtle texture overlay example) */}
      <div className="absolute inset-0 opacity-10 mix-blend-multiply texture-pattern">
        {/* Placeholder: Replace with a subtle dark cloud texture pattern */}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Title - Styled for golden and ornate look */}
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-7xl font-bold text-[#ffbf00] leading-tight ornate-title drop-shadow-[0_2px_4px_rgba(255,191,0,0.5)] uppercase">
            How DO AMBASSADORS ENGAGE?
          </h2>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 justify-center items-start">
          {engagementCardsData.map((card, index) => (
            <EngagementCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmbassadorEngagement;