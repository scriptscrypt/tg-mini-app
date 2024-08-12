"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tgApp = window.Telegram.WebApp;
      setTg(tgApp);
      tgApp.expand();

      tgApp.MainButton.setText("CLOSE");
      tgApp.MainButton.show();
      tgApp.MainButton.onClick(() => tgApp.close());
    }
  }, []);

  const handleClick = () => {
    if (tg) {
      tg.showAlert("You clicked the button!");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to Sample Web App</h1>
      <button onClick={handleClick}>Click Me</button>
    </main>
  );
}