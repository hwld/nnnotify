import { hc } from "hono/client";
import { AppType } from "../backend/app";

export const apiClient = hc<AppType>("http://localhost:3000").api;
