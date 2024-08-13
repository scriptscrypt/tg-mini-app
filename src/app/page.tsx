"use client";

import "@dialectlabs/blinks/index.css";
import { useState, useEffect } from "react";
import {
  Action,
  Blink,
  ActionsRegistry,
  ActionAdapter,
} from "@dialectlabs/blinks";
import { useAction } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";
import { envHeliusRpcUrl } from "@/services/config/envConfig";

// export default function Home() {
//   const [tg, setTg] = useState<TelegramWebApp | null>(null);

//   useEffect(() => {
//     if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
//       const tgApp = window.Telegram.WebApp;
//       setTg(tgApp);
//       tgApp.expand();

//       tgApp.MainButton.setText("CLOSE");
//       tgApp.MainButton.show();
//       tgApp.MainButton.onClick(() => tgApp.close());
//     }
//   }, []);

//   const handleClick = () => {
//     if (tg) {
//       tg.showAlert("You clicked the button!");
//     }
//   };

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <h1>Welcome to Sample Web App</h1>
//       <button onClick={handleClick}>Click Me</button>

//     </main>
//   );
// }

const Home = () => {
  const [action, setAction] = useState<Action | null>(null);
  const actionApiUrl =
    "https://blinktochat.fun/api/actions/start/-1002232395603/3Coor2Baqhi8GUZqFF3uRvd4xiCKX6XU2KbgsSVqkcbW";
  const { adapter } = useActionSolanaWalletAdapter(envHeliusRpcUrl as string);
  // useAction initiates registry, adapter and fetches the action.
  const { action: actionUrl } = useAction({
    url: actionApiUrl,
    adapter,
  });

  return action ? (
    <Blink
      action={actionUrl as Action}
      websiteText={new URL(actionApiUrl).hostname}
    />
  ) : null;
};

export default Home;
