import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
