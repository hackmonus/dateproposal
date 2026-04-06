import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Date Proposal",
  description: "A cute K-Drama inspired date proposal builder.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
