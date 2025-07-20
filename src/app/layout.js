import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Optimize font loading with subset and display options
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Better loading performance
  fallback: ["system-ui", "arial"], // Fallback fonts
  preload: true, // Preload for faster loading
  adjustFontFallback: true, // Reduce layout shift
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["monospace", "courier"],
  preload: false, // Only preload if needed
  adjustFontFallback: true,
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata = {
  title: "OG Codex App - Next.js Performance Optimized",
  description: "A performance-optimized Next.js application with bundle optimization, font loading improvements, and caching strategies.",
  keywords: "Next.js, Performance, Optimization, React",
  authors: [{ name: "Codex Team" }],
  robots: "index, follow",
  // Open Graph and Twitter meta tags for better SEO
  openGraph: {
    title: "OG Codex App",
    description: "Performance-optimized Next.js application",
    type: "website",
    locale: "ar_SA",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Optimize rendering */}
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
