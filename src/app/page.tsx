"use client";

import { IconLogin2, IconTrash, IconUsers } from "@tabler/icons-react";
import { Input } from "react-aria-components";
import { Button, IconButton } from "../components/button";
import { Tooltip } from "../components/tooltip";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { useUsers } from "../hooks/use-users";
import { UserCard } from "../components/user-card";

export default function Home() {
  const [userName, setUserName] = useState("");
  const createUser = useMutation({
    mutationFn: (userName: string) => {
      return apiClient.users.$post({ json: { name: userName } });
    },
  });

  const { data: users } = useUsers();

  return (
    <div className="h-[100dvh] bg-neutral-100 grid place-items-center px-6 py-12 text-neutral-700">
      <div className="max-w-[600px] w-full h-fit grid gap-6">
        <form
          className="bg-neutral-50 border border-neutral-300 h-min p-4 flex flex-col items-end gap-4 rounded-lg"
          onSubmit={(e) => {
            e.preventDefault();
            createUser.mutate(userName, { onSuccess: () => setUserName("") });
          }}
        >
          <Input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="border bg-transparent border-neutral-300 w-full h-8 rounded px-2 text-sm outline-teal-500"
            placeholder="ユーザー名"
          />
          <Button isDisabled={createUser.isPending}>作成</Button>
        </form>
        <div className="space-y-2">
          <div className="text-xs text-neutral-500 flex gap-1 items-center">
            <IconUsers className="size-4" />
            ユーザー
          </div>
          <div className="bg-neutral-50 border border-neutral-300 rounded-lg h-[500px] overflow-hidden">
            <div className="overflow-auto p-4 flex gap-2 flex-col h-full">
              {users &&
                users.map((user) => {
                  return (
                    <UserCard
                      user={user}
                      key={user.id}
                      actions={
                        <>
                          <UserDeleteButton userId={user.id} />
                          <Tooltip label="ログインする">
                            <IconButton
                              icon={IconLogin2}
                              onPress={() => {
                                window.open(
                                  `/users/${user.id}`,
                                  "_blank",
                                  "width=450,height=700"
                                );
                              }}
                            />
                          </Tooltip>
                        </>
                      }
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const UserDeleteButton: React.FC<{ userId: string }> = ({ userId }) => {
  const deleteUser = useMutation({
    mutationFn: (id: string) => {
      return apiClient.users[":id"].$delete({ param: { id } });
    },
  });

  return (
    <Tooltip label="削除する">
      <IconButton
        icon={IconTrash}
        onPress={() => deleteUser.mutate(userId)}
        isDisabled={deleteUser.isPending}
      />
    </Tooltip>
  );
};
