import type { Metadata } from "next";
import { Geist, Geist_Mono, Dangrek } from "next/font/google";
import "./globals.css";
import { generateSeoMetadata } from "@/utils/seo";
import { ClientProviders } from "@/components/providers/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dangrek = Dangrek({
  weight: "400",
  variable: "--font-dangrek",
  subsets: ["khmer", "latin"],
});

export const metadata: Metadata = generateSeoMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dangrek.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0E0E0E] text-white">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
