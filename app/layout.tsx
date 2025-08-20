import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { FavoritesProvider } from "@/components/providers/favorites-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokemon Explorer - Discover & Explore All Pokemon",
  description: "Explore the complete Pokemon database with detailed stats, types, and abilities. Search, filter, and save your favorite Pokemon in this comprehensive Pokemon explorer app.",
  keywords: ["pokemon", "pokedex", "pokemon database", "pokemon stats", "pokemon types", "pokemon explorer", "pokemon search"],
  authors: [{ name: "Pokemon Explorer" }],
  creator: "Pokemon Explorer",
  publisher: "Pokemon Explorer",
  openGraph: {
    title: "Pokemon Explorer - Discover & Explore All Pokemon",
    description: "Explore the complete Pokemon database with detailed stats, types, and abilities. Search, filter, and save your favorite Pokemon.",
    type: "website",
    locale: "en_US",
    siteName: "Pokemon Explorer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokemon Explorer - Discover & Explore All Pokemon",
    description: "Explore the complete Pokemon database with detailed stats, types, and abilities. Search, filter, and save your favorite Pokemon.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <FavoritesProvider>
              {children}
            </FavoritesProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
