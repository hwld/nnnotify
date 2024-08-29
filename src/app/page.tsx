import { IconUsers } from "@tabler/icons-react";
import { UserCreatePanel } from "../frontend/components/user-create-panel";
import { UserListPanelForLogin } from "../frontend/components/user-list-panel-for-login";

export default function Home() {
  return (
    <div className="h-[100dvh] bg-neutral-100 grid place-items-center px-6 py-12 text-neutral-700">
      <div className="max-w-[600px] w-full h-fit grid gap-6">
        <UserCreatePanel />
        <div className="space-y-2">
          <div className="text-xs text-neutral-500 flex gap-1 items-center">
            <IconUsers className="size-4" />
            ユーザー
          </div>
          <UserListPanelForLogin />
        </div>
      </div>
    </div>
  );
}
