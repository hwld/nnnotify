import {
  Icon,
  IconBell,
  IconCheckbox,
  IconProps,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Popover,
  Tooltip,
  TooltipTrigger,
} from "react-aria-components";
import { apiClient } from "../lib/apiClient";

type NotificationData = { id: string; text: string; isRead: boolean };

type Props = { userId: string };

export const NotificationsTrigger: React.FC<Props> = ({ userId }) => {
  const { data: notifications, refetch } = useQuery({
    queryKey: ["users", userId, "notifications"],
    queryFn: async () => {
      return (await apiClient.notifications.$get({ query: { userId } })).json();
    },
  });

  const [isOpen, setOpen] = useState(false);
  const hasUnreadNotifications =
    notifications && notifications.some((n) => !n.isRead);

  useEffect(() => {
    const source = new EventSource(
      apiClient.users[":id"].stream.$url({ param: { id: userId } })
    );

    source.addEventListener("open", (e) => {
      console.log("open: ", e);
    });

    source.addEventListener("notify", () => {
      console.log("notify");
      refetch();
    });

    source.addEventListener("error", (e) => {
      console.log("error: ", e);
    });

    return () => {
      source.close();
    };
  }, [refetch, userId]);

  return (
    <DialogTrigger>
      <Button
        className={clsx(
          "outline-none data-[focus-visible]:ring-1 text-neutral-500 size-8 grid place-items-center rounded-full ring-offset-1 ring-teal-500 data-[hovered]:bg-black/5 transition-colors relative",
          isOpen && "bg-black/5"
        )}
        onPress={() => setOpen(true)}
      >
        {hasUnreadNotifications && (
          <div className="absolute left-0 top-1">
            <NotificationBadge />
          </div>
        )}
        <IconBell size={20} />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <MotionPopover
            placement="bottom end"
            isOpen={isOpen}
            onOpenChange={setOpen}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 100, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <Dialog className=" grid grid-rows-[auto_auto_1fr] w-[300px] h-[400px] bg-neutral-50 shadow-sm border border-neutral-300 rounded-lg outline-none text-neutral-700 overflow-hidden">
              <div className="p-3 font-bold">Notifications</div>
              <hr className="h-[1px] bg-neutral-300" />
              <div className="overflow-auto">
                {notifications &&
                  notifications.toReversed().map((n) => {
                    return <Notification key={n.id} notification={n} />;
                  })}
              </div>
            </Dialog>
          </MotionPopover>
        )}
      </AnimatePresence>
    </DialogTrigger>
  );
};

type NotificationProps = { notification: NotificationData };
const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const readNotification = useMutation({
    mutationFn: () => {
      return apiClient.notifications[":notifId"].$patch({
        param: { notifId: notification.id },
        json: { isRead: true },
      });
    },
  });

  const deleteNotification = useMutation({
    mutationFn: () => {
      return apiClient.notifications[":notifId"].$delete({
        param: { notifId: notification.id },
      });
    },
  });

  return (
    <div className="text-sm border-b border p-2 break-all grid grid-cols-[8px_1fr_auto] gap-1 items-start relative group h-min">
      {notification.isRead ? (
        <div />
      ) : (
        <div className="mt-1">
          <NotificationBadge />
        </div>
      )}
      <p>{notification.text}</p>
      <div className="grid grid-cols-2 gap-1 right-2 top-2">
        <IconButton
          icon={IconCheckbox}
          label="既読にする"
          onPress={readNotification.mutate}
          disabled={readNotification.isPending}
        />
        <IconButton
          icon={IconTrash}
          label="削除する"
          onPress={deleteNotification.mutate}
          disabled={deleteNotification.isPending}
        />
      </div>
    </div>
  );
};

const NotificationBadge: React.FC = () => {
  return <div className="bg-teal-500 size-2 rounded-full animate-pulse" />;
};

const IconButton: React.FC<{
  icon: Icon;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}> = ({ icon: Icon, label, onPress, disabled = false }) => {
  return (
    <TooltipTrigger delay={1000}>
      <Button
        className="outline-none data-[focus-visible]:ring-2 rounded-full size-5 grid place-items-center data-[hovered]:text-teal-500 text-neutral-500 data-[disabled]:opacity-50"
        onPress={onPress}
        isDisabled={disabled}
      >
        <Icon size={18} className="transition-colors" />
      </Button>
      <Tooltip
        offset={4}
        className="bg-neutral-900 rounded py-1 px-[6px] text-neutral-100 text-xs"
      >
        {label}
      </Tooltip>
    </TooltipTrigger>
  );
};

const MotionPopover = motion(Popover);
