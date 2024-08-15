"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { clusterApiUrl } from "@solana/web3.js";
import React, { useMemo } from "react";
// import { TipLinkWalletAdapter } from "@tiplink/wallet-adapter";
import dynamic from "next/dynamic";

const ReactWalletModalProvider = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletModalProvider
    ),
  { ssr: false }
);

export default function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      // new TipLinkWalletAdapter({
      //     title: "13ai.dev",
      //     clientId: envTiplinkAPIKey,
      //     theme: "system",
      //     installedOnAndroid: true,
      //     installedOnIOS: true,
      //     installedOnDesktop: true,
      //     debug: true,
      //   }),
      ],
        [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <ReactWalletModalProvider>{children}</ReactWalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
