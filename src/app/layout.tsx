import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SolanaWalletProvider from "@/providers/SolanaWalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
        {" "}
        <SolanaWalletProvider>{children}</SolanaWalletProvider>
      </body>
    </html>
  );
}
