import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Vijay Prabhakar & Nivetha - Wedding Invitation",
  description: "Join us in celebrating our wedding!",
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