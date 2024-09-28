import {
  BaseMessageSignerWalletAdapter,
  WalletReadyState,
  WalletName,
  WalletNotConnectedError,
  WalletDisconnectionError,
  WalletSendTransactionError,
  WalletSignMessageError,
  WalletSignTransactionError,
} from "@solana/wallet-adapter-base";
import { CustomPhantomAdapter } from "./custom-phantom-adapter";
import {
  PublicKey,
  Transaction,
  VersionedTransaction,
  SendOptions,
  Connection,
} from "@solana/web3.js";

export const CustomPhantomWalletName =
  "Custom Phantom" as WalletName<"Custom Phantom">;

export class CustomPhantomWalletAdapter extends BaseMessageSignerWalletAdapter {
  name = CustomPhantomWalletName;
  url = "https://phantom.app";
  icon =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDgiIGhlaWdodD0iMTA4IiB2aWV3Qm94PSIwIDAgMTA4IDEwOCIgZmlsbD0ibm9uZSI+CjxyZWN0IHdpZHRoPSIxMDgiIGhlaWdodD0iMTA4IiByeD0iMjYiIGZpbGw9IiNBQjlGRjIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00Ni41MjY3IDY5LjkyMjlDNDIuMDA1NCA3Ni44NTA5IDM0LjQyOTIgODUuNjE4MiAyNC4zNDggODUuNjE4MkMxOS41ODI0IDg1LjYxODIgMTUgODMuNjU2MyAxNSA3NS4xMzQyQzE1IDUzLjQzMDUgNDQuNjMyNiAxOS44MzI3IDcyLjEyNjggMTkuODMyN0M4Ny43NjggMTkuODMyNyA5NCAzMC42ODQ2IDk0IDQzLjAwNzlDOTQgNTguODI1OCA4My43MzU1IDc2LjkxMjIgNzMuNTMyMSA3Ni45MTIyQzcwLjI5MzkgNzYuOTEyMiA2OC43MDUzIDc1LjEzNDIgNjguNzA1MyA3Mi4zMTRDNjguNzA1MyA3MS41NzgzIDY4LjgyNzUgNzAuNzgxMiA2OS4wNzE5IDY5LjkyMjlDNjUuNTg5MyA3NS44Njk5IDU4Ljg2ODUgODEuMzg3OCA1Mi41NzU0IDgxLjM4NzhDNDcuOTkzIDgxLjM4NzggNDUuNjcxMyA3OC41MDYzIDQ1LjY3MTMgNzQuNDU5OEM0NS42NzEzIDcyLjk4ODQgNDUuOTc2OCA3MS40NTU2IDQ2LjUyNjcgNjkuOTIyOVpNODMuNjc2MSA0Mi41Nzk0QzgzLjY3NjEgNDYuMTcwNCA4MS41NTc1IDQ3Ljk2NTggNzkuMTg3NSA0Ny45NjU4Qzc2Ljc4MTYgNDcuOTY1OCA3NC42OTg5IDQ2LjE3MDQgNzQuNjk4OSA0Mi41Nzk0Qzc0LjY5ODkgMzguOTg4NSA3Ni43ODE2IDM3LjE5MzEgNzkuMTg3NSAzNy4xOTMxQzgxLjU1NzUgMzcuMTkzMSA4My42NzYxIDM4Ljk4ODUgODMuNjc2MSA0Mi41Nzk0Wk03MC4yMTAzIDQyLjU3OTVDNzAuMjEwMyA0Ni4xNzA0IDY4LjA5MTYgNDcuOTY1OCA2NS43MjE2IDQ3Ljk2NThDNjMuMzE1NyA0Ny45NjU4IDYxLjIzMyA0Ni4xNzA0IDYxLjIzMyA0Mi41Nzk1QzYxLjIzMyAzOC45ODg1IDYzLjMxNTcgMzcuMTkzMSA2NS43MjE2IDM3LjE5MzFDNjguMDkxNiAzNy4xOTMxIDcwLjIxMDMgMzguOTg4NSA3MC4yMTAzIDQyLjU3OTVaIiBmaWxsPSIjRkZGREY4Ii8+Cjwvc3ZnPg==";

  supportedTransactionVersions = new Set(["legacy", 0] as const);

  private _adapter: CustomPhantomAdapter;
  private _connecting: boolean;
  private _wallet: any | null;
  private _publicKey: PublicKey | null;
  private _readyState: WalletReadyState;

  constructor() {
    super();
    this._adapter = new CustomPhantomAdapter();
    this._connecting = false;
    this._wallet = null;
    this._publicKey = null;
    this._readyState = this.isTelegramMiniApp()
      ? WalletReadyState.Loadable
      : WalletReadyState.NotDetected;
  }

  private isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  private isTelegramMiniApp(): boolean {
    return typeof window !== "undefined" && !!(window as any).Telegram?.WebApp;
  }

  get publicKey() {
    return this._publicKey;
  }

  get connecting() {
    return this._connecting;
  }

  get connected() {
    return this._adapter.connected;
  }

  get readyState() {
    return this._readyState;
  }

  // async connect(): Promise<void> {
  //   try {
  //     this._connecting = true;

  //     if (this.isTelegramMiniApp()) {
  //       // Handle Telegram Mini App connection
  //       const phantomUrl = `https://phantom.app/ul/v1/connect?app_url=${encodeURIComponent(
  //         window.location.origin
  //       )}`;
  //       (window as any).Telegram.WebApp.openTelegramLink(phantomUrl);

  //       // You might want to set up a way to receive the connection result
  //       // For now, we'll just simulate a successful connection after a delay
  //       await new Promise((resolve) => setTimeout(resolve, 2000));

  //       // Simulate getting a public key (replace with actual logic when available)
  //       this._publicKey = new PublicKey("11111111111111111111111111111111");
  //     } else {
  //       await this._adapter.connect();
  //       this._publicKey = this._adapter.publicKey;
  //     }

  //     this._wallet = this._adapter;
  //     this._readyState = WalletReadyState.Installed;
  //     this.emit("connect", this._publicKey!);
  //   } catch (error: any) {
  //     this.emit("error", error);
  //     throw error;
  //   } finally {
  //     this._connecting = false;
  //   }
  // }

  async connect(): Promise<void> {
    try {
      this._connecting = true;

      if (this.isMobile()) {
        // Mobile deep link logic
        const encodedUrl = encodeURIComponent(window.location.href);
        const phantomUrl = `https://phantom.app/ul/v1/connect?app_url=${encodedUrl}`;
        const deepLink = `solana-wallet:/v1/connect?app_url=${encodedUrl}`;

        // Try opening the deep link
        window.location.href = deepLink;

        // If deep link fails, redirect to Phantom website after a short delay
        setTimeout(() => {
          window.location.href = phantomUrl;
        }, 500);

        // In a real implementation, you'd need to handle the callback when the user returns to your app
        // For now, we'll just simulate a successful connection after a delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        this._publicKey = new PublicKey("11111111111111111111111111111111"); // Replace with actual logic
      } else if (this.isTelegramMiniApp()) {
        // Telegram Mini App logic
        const phantomUrl = `https://phantom.app/ul/v1/connect?app_url=${encodeURIComponent(window.location.origin)}`;
        (window as any).Telegram?.WebApp?.openTelegramLink(phantomUrl);

        // Simulate connection for now
        await new Promise(resolve => setTimeout(resolve, 2000));
        this._publicKey = new PublicKey("11111111111111111111111111111111"); // Replace with actual logic
      } else {
        // Desktop logic
        await this._adapter.connect();
        this._publicKey = this._adapter.publicKey;
      }

      this._wallet = this._adapter;
      this._readyState = WalletReadyState.Installed;
      this.emit("connect", this._publicKey!);
    } catch (error: any) {
      this.emit("error", error);
      throw error;
    } finally {
      this._connecting = false;
    }
  }

  async disconnect(): Promise<void> {
    const wallet = this._wallet;
    if (wallet) {
      this._wallet = null;
      this._publicKey = null;
      this._readyState = this.isTelegramMiniApp()
        ? WalletReadyState.Loadable
        : WalletReadyState.NotDetected;

      try {
        await this._adapter.disconnect();
      } catch (error: any) {
        this.emit("error", new WalletDisconnectionError(error?.message, error));
      }
    }

    this.emit("disconnect");
  }

  async sendTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T,
    connection: Connection,
    options: SendOptions = {}
  ): Promise<string> {
    try {
      const wallet = this._wallet;
      if (!wallet) throw new WalletNotConnectedError();

      try {
        // This is a simplified implementation. You might need to adjust this
        // based on your CustomPhantomAdapter's capabilities
        // @ts-ignore
        const { signature } = await this._adapter.signAndSendTransaction(
          transaction
        );
        return signature;
      } catch (error: any) {
        throw new WalletSendTransactionError(error?.message, error);
      }
    } catch (error: any) {
      this.emit("error", error);
      throw error;
    }
  }

  async signTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T
  ): Promise<T> {
    try {
      const wallet = this._wallet;
      if (!wallet) throw new WalletNotConnectedError();

      try {
        // This is a simplified implementation. You might need to adjust this
        // based on your CustomPhantomAdapter's capabilities
        return await this._adapter.signTransaction(transaction);
      } catch (error: any) {
        throw new WalletSignTransactionError(error?.message, error);
      }
    } catch (error: any) {
      this.emit("error", error);
      throw error;
    }
  }

  async signAllTransactions<T extends Transaction | VersionedTransaction>(
    transactions: T[]
  ): Promise<T[]> {
    try {
      const wallet = this._wallet;
      if (!wallet) throw new WalletNotConnectedError();

      try {
        // This is a simplified implementation. You might need to adjust this
        // based on your CustomPhantomAdapter's capabilities
        return await this._adapter.signAllTransactions(transactions);
      } catch (error: any) {
        throw new WalletSignTransactionError(error?.message, error);
      }
    } catch (error: any) {
      this.emit("error", error);
      throw error;
    }
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    try {
      const wallet = this._wallet;
      if (!wallet) throw new WalletNotConnectedError();

      try {
        return await this._adapter.signMessage(message);
      } catch (error: any) {
        throw new WalletSignMessageError(error?.message, error);
      }
    } catch (error: any) {
      this.emit("error", error);
      throw error;
    }
  }
}
