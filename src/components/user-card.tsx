import { User } from "@prisma/client";
import { ReactNode } from "react";

type Props = { user: User; actions?: ReactNode };

export const UserCard: React.FC<Props> = ({ user, actions }) => {
  return (
    <div className="border border-neutral-300 px-3 py-2 rounded text-sm grid grid-cols-[1fr_auto] gap-1 items-center">
      <p>{user.name}</p>
      <div className="flex gap-2">{actions}</div>
    </div>
  );
};
