"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { useState } from "react";
import { Input } from "react-aria-components";
import { Button } from "./button";

type Props = {};

export const UserCreatePanel: React.FC<Props> = () => {
  const [userName, setUserName] = useState("");
  const createUser = useMutation({
    mutationFn: (userName: string) => {
      return apiClient.users.$post({ json: { name: userName } });
    },
  });

  return (
    <form
      className="bg-neutral-50 shadow border border-neutral-200 h-min p-4 flex flex-col items-end gap-4 rounded-lg"
      onSubmit={(e) => {
        e.preventDefault();
        createUser.mutate(userName, { onSuccess: () => setUserName("") });
      }}
    >
      <Input
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="border bg-transparent border-neutral-200 w-full h-8 rounded px-2 text-sm outline-teal-500"
        placeholder="ユーザー名"
      />
      <Button isDisabled={createUser.isPending}>作成</Button>
    </form>
  );
};
