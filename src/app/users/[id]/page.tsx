"use client";

import { useParams } from "next/navigation";
import { UserPanel } from "../../../components/user-panel";

export type User = { name: string; id: string };

const UserPage: React.FC = () => {
  const userId = useParams<{ id: string }>().id;

  return (
    <main className="h-[100dvh] bg-neutral-50 p-5 grid place-items-center text-neutral-700">
      <div className="grid gap-4">
        <UserPanel userId={userId} />
      </div>
    </main>
  );
};

export default UserPage;
