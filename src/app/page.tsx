"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserPanel } from "../components/user-panel";
import { MotionConfig } from "framer-motion";
import { useState } from "react";

export type User = { name: string; id: string };
const user1: User = { id: "1", name: "user1" };
const user2: User = { id: "2", name: "user2" };

export default function Home() {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        mutations: {
          onSuccess: () => {
            client.invalidateQueries();
          },
        },
      },
    })
  );

  return (
    <QueryClientProvider client={client}>
      <MotionConfig transition={{ duration: 0.1 }}>
        <main className="h-[100dvh] bg-neutral-50 p-5 grid place-items-center text-neutral-700">
          <div className="grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr] gap-4">
            <UserPanel user={user1} targetUserId={user2.id} />
            <div className="grid place-items-center place-content-center text-teal-500">
              <div>{"->"}</div>
              <div>{"<-"}</div>
            </div>
            <UserPanel user={user2} targetUserId={user1.id} />
          </div>
        </main>
      </MotionConfig>
    </QueryClientProvider>
  );
}
