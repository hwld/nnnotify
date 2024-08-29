import { User } from "@prisma/client";
import { ReactNode } from "react";

type Props = { user: User; actions?: ReactNode };

export const UserEntity: React.FC<Props> = ({ user, actions }) => {
  return (
    <div className="px-6 py-2 text-sm grid grid-cols-[1fr_auto] gap-1 items-center border-b border-neutral-200">
      <p>{user.name}</p>
      <div className="flex gap-2">{actions}</div>
    </div>
  );
};
