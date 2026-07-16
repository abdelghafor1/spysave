import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpySave - Meta Ads Research",
  description:
    "Save, organize, and analyze competitor Meta ads for dropshippers and small e-commerce teams.",
  icons: {
    icon: "/spysave-mark.svg",
    shortcut: "/spysave-mark.svg",
    apple: "/spysave-extension-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
