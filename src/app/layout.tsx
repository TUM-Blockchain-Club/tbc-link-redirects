import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TBC Link Redirects",
  description: "QR redirect and click tracking service for TUM Blockchain Club.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
