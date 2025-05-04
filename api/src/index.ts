import { Hono } from "hono";
import { cors } from "hono/cors";
import posts from "./posts";
import { rateLimitMiddleware } from './middlewares/rateLimit'

const app = new Hono();
const ipRateLimit = new Map<string, { lastPostTime: number, postCount: number }>()

app.use('*', rateLimitMiddleware)
app.use('*', cors({
    origin: '*',
}))
app.route("/posts", posts);

export default app;
