import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SolanaWalletProvider from "@/providers/SolanaWalletProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "BlinkMini",
  description: "BlinkMini - A Telegram Mini App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="/telegram-web-app.js" defer />
      </head>
      <body className={inter.className}>
        <SolanaWalletProvider>{children}</SolanaWalletProvider>
      </body>
    </html>
  );
}
