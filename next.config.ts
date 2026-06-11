import type { NextConfig } from "next";

const remotePatterns: any[] = [
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'ui-avatars.com',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'www.image2url.com',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'image2url.com',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'blogger.googleusercontent.com',
    pathname: '/**',
  },
];

// Dynamically extract backend hostname from environment variable to allow next/image optimization for uploaded files
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (apiUrl) {
  try {
    const url = new URL(apiUrl);
    remotePatterns.push({
      protocol: url.protocol.replace(':', ''),
      hostname: url.hostname,
      pathname: '/**',
    });
  } catch (e) {
    // Ignore invalid URL
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  compress: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns,
  },
};

export default nextConfig;
