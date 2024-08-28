"use client";

import { UserPanel } from "../components/user-panel";
import { MotionConfig } from "framer-motion";

export default function Home() {
  return (
    <MotionConfig transition={{ duration: 0.1 }}>
      <main className="h-[100dvh] bg-neutral-50 p-5 grid place-items-center text-neutral-700">
        <div className="grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr] gap-4">
          <UserPanel user={{ name: "user1", id: "1" }} />
          <div className="grid place-items-center place-content-center text-teal-500">
            <div>{"->"}</div>
            <div>{"<-"}</div>
          </div>
          <UserPanel user={{ name: "user2", id: "2" }} />
        </div>
      </main>
    </MotionConfig>
  );
}
