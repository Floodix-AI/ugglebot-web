import type { Metadata } from "next";
import { Nunito, Inter } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Uggly — AI-kompis för barn",
  description:
    "En smart uggla som pratar med ditt barn. Hantera din Uggly här.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`${nunito.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-night-50 text-night-900 antialiased">
        {children}
      </body>
    </html>
  );
}
