import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { streamSSE } from "hono/streaming";
import Redis from "ioredis";
import { z } from "zod";
import { db } from "./db";
import { delay } from "../lib/delay";

const NOTIFY_EVENT = (userId: string) => `notify-${userId}` as const;

const usersRoute = new Hono()
  .get("/users", async (c) => {
    const users = await db.user.findMany({});
    return c.json(users);
  })
  .get("/users/:id", async (c) => {
    const userId = c.req.param().id;
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new HTTPException(404);
    }

    return c.json(user);
  })
  .post(
    "/users",
    zValidator("json", z.object({ name: z.string() })),
    async (c) => {
      const userName = c.req.valid("json").name;
      const user = await db.user.create({ data: { name: userName } });

      return c.json({ userId: user.id });
    }
  )
  .delete("/users/:id", async (c) => {
    const userId = c.req.param().id;
    await db.user.delete({ where: { id: userId } });

    return c.json({});
  })
  .get("/users/:id/stream", async (c) => {
    const userId = c.req.param().id;
    console.log(`listen stream (userId: ${userId})`);

    return streamSSE(c, async (stream) => {
      const redis = new Redis();

      await redis.subscribe(NOTIFY_EVENT(userId));

      redis.on("message", (c) => {
        if (c === NOTIFY_EVENT(userId)) {
          console.log("on notify");
          stream.writeSSE({ data: "", event: "notify" });
        }
      });

      while (true) {
        await stream.sleep(1000 * 30);
      }
    });
  });

const notificationsRoutes = new Hono()
  .get(
    "/notifications",
    zValidator("query", z.object({ userId: z.string() })),
    async (c) => {
      const userId = c.req.valid("query").userId;
      const notifications = await db.notification.findMany({
        where: { userId },
      });

      return c.json(notifications);
    }
  )
  .patch(
    "/notifications/:notifId",
    zValidator("json", z.object({ isRead: z.boolean() })),
    async (c) => {
      const notifId = c.req.param().notifId;
      const newIsRead = c.req.valid("json").isRead;

      await db.notification.update({
        where: { id: notifId },
        data: { isRead: newIsRead },
      });

      return c.json({});
    }
  )
  .delete("/notifications/:notifId", async (c) => {
    const notifId = c.req.param().notifId;

    await db.notification.delete({ where: { id: notifId } });

    return c.json({});
  })
  .post(
    "/notify",
    zValidator(
      "json",
      z.object({ fromUserId: z.string(), targetUserId: z.string() })
    ),
    async (c) => {
      await delay();
      const { fromUserId, targetUserId } = c.req.valid("json");
      console.log(`notify to user:${targetUserId}`);

      const fromUser = await db.user.findUnique({ where: { id: fromUserId } });
      if (!fromUser) {
        throw new HTTPException(400);
      }

      await db.notification.create({
        data: {
          userId: targetUserId,
          text: `\`${fromUser.name}\`からの通知`,
          isRead: false,
        },
      });

      const redis = new Redis();
      redis.publish(NOTIFY_EVENT(targetUserId), "");

      return c.json({});
    }
  );

export const app = new Hono().basePath("/api");
const routes = app.route("/", usersRoute).route("/", notificationsRoutes);

export type AppType = typeof routes;
