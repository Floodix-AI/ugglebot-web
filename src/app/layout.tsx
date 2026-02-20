import type { Metadata } from "next";
import { Nunito, Inter } from "next/font/google";
import { ToastProvider } from "@/lib/toast-context";
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
  title: {
    default: "Uggly — AI-kompis för barn",
    template: "%s | Uggly",
  },
  description:
    "Uggly är en AI-driven pratande uggla för barn. Åldersanpassade samtal, föräldrakontroll och full kostnadskontroll. 99 kr/mån.",
  keywords: ["AI", "barn", "leksak", "uggla", "Raspberry Pi", "Sverige", "föräldrakontroll"],
  authors: [{ name: "Uggly" }],
  openGraph: {
    title: "Uggly — AI-kompis för barn",
    description:
      "En smart uggla som pratar med ditt barn. Åldersanpassade samtal, föräldrakontroll och full kostnadskontroll.",
    locale: "sv_SE",
    type: "website",
    siteName: "Uggly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uggly — AI-kompis för barn",
    description:
      "En smart uggla som pratar med ditt barn. Åldersanpassade samtal och föräldrakontroll.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`${nunito.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-night-50 text-night-900 antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
