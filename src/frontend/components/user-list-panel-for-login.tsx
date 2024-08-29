"use client";

import { IconLogin2, IconTrash } from "@tabler/icons-react";
import { IconButton } from "./button";
import { UserEntity } from "./user-entity";
import { useUsers } from "../hooks/use-users";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { Tooltip } from "./tooltip";

export const UserListPanelForLogin: React.FC = () => {
  const { data: users } = useUsers();

  return (
    <div className="bg-neutral-50 shadow border border-neutral-200 rounded-lg h-[500px] overflow-hidden">
      <div className="overflow-auto py-1 flex flex-col h-full">
        {users &&
          users.map((user) => {
            const actions = (
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
            );

            return <UserEntity user={user} key={user.id} actions={actions} />;
          })}
      </div>
    </div>
  );
};

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
