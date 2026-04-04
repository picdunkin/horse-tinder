import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/_components/Navbar";

export const metadata: Metadata = {
  title: "Horse Tinder",
  description: "Find your next stablemate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        <div className="min-h-full flex flex-col">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
