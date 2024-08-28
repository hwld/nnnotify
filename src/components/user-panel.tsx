"use client";

import { IconMail, IconUserFilled } from "@tabler/icons-react";
import { apiClient } from "../lib/apiClient";
import { NotificationsTrigger } from "./notifications-trigger";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IconButton } from "./button";
import { useUsers } from "../hooks/use-users";
import { UserCard } from "./user-card";
import { Tooltip } from "./tooltip";

type Props = { userId: string };

export const UserPanel: React.FC<Props> = ({ userId }) => {
  const { data: users } = useUsers();

  const notify = useMutation({
    mutationFn: (userId: string) =>
      apiClient.notify.$post({ json: { targetUserId: userId } }),
  });

  const handleNotify = async (userId: string) => {
    notify.mutate(userId);
  };

  return (
    <div className="w-[350px] h-[600px] rounded-lg p-3 border bg-neutral-100 border-neutral-200 grid grid-rows-[40px_1fr]">
      <UserPanelHeader userId={userId} />
      <div className="p-3 flex flex-col gap-2">
        {users &&
          users.map((user) => {
            return (
              <UserCard
                user={user}
                key={user.id}
                actions={
                  <Tooltip label="通知を送る">
                    <IconButton
                      icon={IconMail}
                      onPress={() => handleNotify(user.id)}
                    />
                  </Tooltip>
                }
              />
            );
          })}
      </div>
    </div>
  );
};

const UserPanelHeader: React.FC<{ userId: string }> = ({ userId }) => {
  // TODO: useSuspenseQueryを使ってみたい
  const { data: user, status } = useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      const res = await apiClient.users[":id"].$get({ param: { id: userId } });
      const json = await res.json();
      return json;
    },
  });

  if (status === "pending") {
    return <div></div>;
  }

  if (status === "error") {
    return <div>error</div>;
  }

  return (
    <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
      <div className="size-8 rounded-full bg-neutral-50 border border-neutral-300 grid place-items-center text-teal-500">
        <IconUserFilled />
      </div>
      <p className="text-sm font-bold">{user.name}</p>
      <NotificationsTrigger userId={user.id} />
    </div>
  );
};
