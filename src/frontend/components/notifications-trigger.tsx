import { IconBell, IconCheckbox, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, Popover } from "react-aria-components";
import { IconButton } from "./button";
import { Tooltip } from "./tooltip";
import { useToast } from "./toast";
import { apiClient } from "../apiClient";

type NotificationData = { id: string; text: string; isRead: boolean };

type Props = { userId: string };

export const NotificationsTrigger: React.FC<Props> = ({ userId }) => {
  const { toast } = useToast();

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
      toast("通知を受け取りました");
      refetch();
    });

    source.addEventListener("error", (e) => {
      console.log("error: ", e);
    });

    return () => {
      source.close();
    };
  }, [refetch, toast, userId]);

  return (
    <DialogTrigger>
      <div className="relative">
        {hasUnreadNotifications && (
          <div className="absolute left-0 top-1">
            <NotificationBadge />
          </div>
        )}
        <IconButton
          icon={IconBell}
          variant="subtle"
          onPress={() => setOpen(true)}
        />
      </div>
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
            <Dialog className=" grid grid-rows-[auto_auto_1fr] w-[300px] h-[400px] bg-neutral-50 shadow-sm border border-neutral-200 rounded-lg outline-none text-neutral-700 overflow-hidden">
              <div className="p-3 font-bold border-b border-neutral-200">
                Notifications
              </div>
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
    <div className="text-sm border-b p-2 border-neutral-200 break-all grid grid-cols-[8px_1fr_auto] gap-1 items-start relative group h-min">
      {notification.isRead ? (
        <div />
      ) : (
        <div className="mt-1">
          <NotificationBadge />
        </div>
      )}
      <p>{notification.text}</p>
      <div className="grid grid-cols-2 gap-1 right-2 top-2">
        <Tooltip label="既読にする">
          <IconButton
            size="sm"
            variant="subtle"
            icon={IconCheckbox}
            onPress={() => readNotification.mutate()}
            isDisabled={readNotification.isPending}
          />
        </Tooltip>
        <Tooltip label="削除する">
          <IconButton
            size="sm"
            variant="subtle"
            icon={IconTrash}
            onPress={() => deleteNotification.mutate()}
            isDisabled={deleteNotification.isPending}
          />
        </Tooltip>
      </div>
    </div>
  );
};

const NotificationBadge: React.FC = () => {
  return <div className="bg-teal-500 size-2 rounded-full animate-pulse" />;
};

const MotionPopover = motion(Popover);
