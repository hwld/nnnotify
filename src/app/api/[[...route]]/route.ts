import { delay } from "@/lib/delay";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { handle } from "hono/vercel";
import { Redis } from "ioredis";

const NOTIFY_EVENT = "notify";

const app = new Hono().basePath("/api");

const routes = app
  .get("/notifications/stream", async (c) => {
    console.log("listen stream");
    return streamSSE(c, async (stream) => {
      const redis = new Redis();

      await redis.subscribe(NOTIFY_EVENT);

      redis.on("message", (c) => {
        if (c === NOTIFY_EVENT) {
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
  .post("/notify", async (c) => {
    await delay();
    console.log("post notify");

    const redis = new Redis();
    redis.publish(NOTIFY_EVENT, "");

    return c.json({});
  });

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
