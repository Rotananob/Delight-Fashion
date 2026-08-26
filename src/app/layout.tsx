import type { Metadata } from "next";
import { Geist, Geist_Mono, Suwannaphum } from "next/font/google";
import "./globals.css";
import { generateSeoMetadata } from "@/utils/seo";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { UpdatePrompt } from "@/components/pwa/UpdatePrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const suwannaphum = Suwannaphum({
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-khmer",
  subsets: ["khmer"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${suwannaphum.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ClientProviders>{children}</ClientProviders>
        <UpdatePrompt />
      </body>
    </html>
  );
}
