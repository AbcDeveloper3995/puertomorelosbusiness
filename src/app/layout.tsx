import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Puerto Morelos Business Intelligence",
  description: "Identify and qualify local businesses for digital transformation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
