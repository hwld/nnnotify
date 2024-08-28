import { hc } from "hono/client";
import { AppType } from "../app/api/[[...route]]/route";

export const apiClient = hc<AppType>("http://localhost:3000").api;
