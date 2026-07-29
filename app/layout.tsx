import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Ślady — moja mapa podróży",
  description:
    "Osobisty atlas odwiedzonych miejsc, lat i wakacyjnych wspomnień.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body className={`${sans.variable} ${serif.variable}`}>{children}</body>
    </html>
  );
}
