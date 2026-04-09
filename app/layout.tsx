import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Vijay Prabhakar & Nivetha - Wedding Invitation",
  description: "Join us on June 6th & 7th, 2026 as we celebrate our wedding and step into our new life together.",
  openGraph: {
    title: "Vijay & Nivetha | Wedding Invitation",
    description: "Join us on June 6th & 7th, 2026 to celebrate our new beginning!",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth no-scrollbar">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased no-scrollbar`}>
        {children}
      </body>
    </html>
  );
}