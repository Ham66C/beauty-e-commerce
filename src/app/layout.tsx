import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AIChatAssistant } from "@/components/AIChatAssistant";
import { Providers } from "./providers";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "BEAUTÉ | Curated Skincare & Beauty",
  description: "Discover your unique glow with our expert-curated beauty solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex flex-col min-h-screen bg-pastel-bg">
        <Providers>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <AIChatAssistant />
            </WishlistProvider>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
