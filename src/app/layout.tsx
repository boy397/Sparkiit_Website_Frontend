import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { CartProvider } from "@/context/CartContext";
import { HomepageDataProvider } from "@/context/HomepageDataProvider";
import CartSidebar from "@/components/CartSidebar";
import { Toaster } from "react-hot-toast";
import BrandingLoader from "@/components/BrandingLoader";
import CustomCursor from "@/components/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SPARKIIT - Premium Digital Solutions",
  description: "Not Basic Training. A High Impact Career Engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: '#050505' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: '#050505' }}
      >
        <BrandingLoader />
        <HomepageDataProvider>
          <SmoothScrollProvider>
            <CartProvider>
              <CustomCursor />
              <CartSidebar />
              {children}
              <Toaster position="bottom-right" toastOptions={{
                style: {
                  background: '#0a0a0a',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                },
              }} />
            </CartProvider>
          </SmoothScrollProvider>
        </HomepageDataProvider>
      </body>
    </html>
  );
}
