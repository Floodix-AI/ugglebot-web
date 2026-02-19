import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uggly — AI-kompis for barn",
  description: "En smart uggla som pratar med ditt barn. Hantera din Uggly har.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="min-h-screen bg-amber-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
