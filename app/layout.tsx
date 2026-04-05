import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/_components/Navbar";
import { displayFont, sansFont } from "@/app/fonts";

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
    <html lang="en" className="dark h-full">
      <body
        className={`${sansFont.className} ${sansFont.variable} ${displayFont.variable} h-full bg-background text-foreground antialiased`}
      >
        <div className="min-h-full flex flex-col">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
