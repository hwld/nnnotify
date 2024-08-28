import { Button } from "react-aria-components";
import { IconUserFilled } from "@tabler/icons-react";
import { apiClient } from "../lib/apiClient";
import { useEffect } from "react";
import { NotificationsTrigger } from "./notifications-trigger";

type Props = { user: { name: string; id: string } };

export const UserPanel: React.FC<Props> = ({ user }) => {
  useEffect(() => {
    const source = new EventSource(apiClient.notifications.stream.$url());

    source.addEventListener("open", (e) => {
      console.log("open: ", e);
    });

    source.addEventListener("notify", () => {
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
    <div className="w-[350px] h-[600px] rounded-lg p-3 border bg-neutral-100 border-neutral-200 grid grid-rows-[40px_1fr]">
      <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
        <div className="size-8 rounded-full bg-neutral-50 border border-neutral-300 grid place-items-center text-teal-500">
          <IconUserFilled />
        </div>
        <p className="text-sm font-bold">{user.name}</p>
        <NotificationsTrigger userId={user.id} />
      </div>
      <div className="p-3 grid place-items-center">
        <Button
          className="text-sm h-8 bg-teal-500 rounded px-3 text-neutral-100 focus-visible:ring-1 ring-offset-1 ring-teal-500 outline-none text-nowrap data-[hovered]:bg-teal-600 data-[pressed]:bg-teal-700 transition-colors"
          onPress={handleNotify}
        >
          相手に通知を送る
        </Button>
      </div>
    </div>
  );
};
