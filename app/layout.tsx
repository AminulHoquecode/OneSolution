import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AdScript from "./components/AdScript";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OneSolution - PDF and Image Processing Tools",
  description: "All-in-one solution for PDF and image processing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={inter.className}>
        {children}
        <AdScript />
      </body>
    </html>
  );
}
