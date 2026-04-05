import { Inter } from "next/font/google";

export const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-app-sans",
});

export const displayFont = Inter({
  subsets: ["latin"],
  variable: "--font-app-heading",
  weight: "400",
});
