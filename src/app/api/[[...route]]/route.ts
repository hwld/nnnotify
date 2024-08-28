import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { handle } from "hono/vercel";
import { Redis } from "ioredis";
import { delay } from "../../../lib/delay";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../../../lib/db";

const NOTIFY_EVENT = (userId: string) => `notify-${userId}` as const;

const app = new Hono().basePath("/api");

const routes = app
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
  })
  .get(
    "/notifications",
    zValidator("query", z.object({ userId: z.string() })),
    async (c) => {
      const userId = c.req.valid("query").userId;
      const notifications = await db.notifications.findMany({
        where: { userId },
      });

      return c.json(notifications);
    }
  )
  .patch(
    "notifications/:notifId",
    zValidator("json", z.object({ isRead: z.boolean() })),
    async (c) => {
      const notifId = c.req.param().notifId;
      const newIsRead = c.req.valid("json").isRead;

      await db.notifications.update({
        where: { id: notifId },
        data: { isRead: newIsRead },
      });

      return c.json({});
    }
  )
  .delete("/notifications/:notifId", async (c) => {
    const notifId = c.req.param().notifId;

    await db.notifications.delete({ where: { id: notifId } });

    return c.json({});
  })
  .post(
    "/notify",
    zValidator("json", z.object({ targetUserId: z.string() })),
    async (c) => {
      await delay();
      const { targetUserId } = c.req.valid("json");
      console.log(`notify to user:${targetUserId}`);

      await db.notifications.create({
        data: { userId: targetUserId, text: "通知テスト", isRead: false },
      });

      const redis = new Redis();
      redis.publish(NOTIFY_EVENT(targetUserId), "");

      return c.json({});
    }
  );

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
