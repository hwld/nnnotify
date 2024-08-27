"use client";

import { Button } from "react-aria-components";
import { apiClient } from "./apiClient";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const source = new EventSource(apiClient.notifications.stream.$url());

    source.addEventListener("open", (e) => {
      console.log("open: ", e);
    });

    source.addEventListener("notify", (message) => {
      console.log("notify");
    });

    source.addEventListener("error", (e) => {
      console.log("error: ", e);
    });

    return () => {
      source.close();
    };
  }, []);

  const handleNotify = async () => {
    await apiClient.notify.$post();
  };

  return (
    <main className="grid place-items-center h-[100dvh] bg-neutral-50">
      <Button
        className="text-sm h-8 bg-teal-500 rounded px-3 text-neutral-100 data-[focus-visible]:ring-1 outline-none"
        onPress={handleNotify}
      >
        通知を送る
      </Button>
    </main>
  );
}
