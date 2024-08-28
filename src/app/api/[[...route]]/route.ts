import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { handle } from "hono/vercel";
import { Redis } from "ioredis";
import { delay } from "../../../lib/delay";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

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
        await stream.writeSSE({ data: "ping" });
        await stream.sleep(10000);
      }
    });
  })
  .post(
    "/notify",
    zValidator("json", z.object({ targetUserId: z.string() })),
    async (c) => {
      await delay();
      const { targetUserId } = c.req.valid("json");
      console.log(`notify to user:${targetUserId}`);

      const redis = new Redis();
      redis.publish(NOTIFY_EVENT(targetUserId), "");

      return c.json({});
    }
  );

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
