"use client";

import { useParams } from "next/navigation";
import { UserPanel } from "../../../components/user-panel";
import { ToastProvider } from "../../../components/toast";

const UserPage: React.FC = () => {
  const userId = useParams<{ id: string }>().id;

  return (
    <main className="h-[100dvh] bg-neutral-100 p-5 grid place-items-center text-neutral-700">
      <div className="grid gap-4 relative">
        <ToastProvider>
          <UserPanel userId={userId} />
        </ToastProvider>
      </div>
    </main>
  );
};

export default UserPage;
