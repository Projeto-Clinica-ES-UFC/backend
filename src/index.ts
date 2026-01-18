import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";

import { prettyJSON } from "hono/pretty-json";

import { feature_routes } from "@/features";
import { type Variables } from "@/shared/types";

import { env } from "./env";
import { auth } from "@/better-auth";

const app = new Hono<{ Variables: Variables }>({
  strict: false,
});

/**
 * Pretty JSON middleware enables "JSON pretty print" for JSON response body.
 * Adding `?pretty` to url query param, the JSON strings are prettified.
 *
 * Read more about the Pretty JSON Middleware here:
 * https://hono.dev/docs/middleware/builtin/pretty-json
 */
app.use(prettyJSON());
/**
 * Logger Middleware logs the request and response.
 *
 * Read more about the Logger Middleware here:
 * https://hono.dev/docs/middleware/builtin/logger
 */
app.use(logger());

/**
 * CORS Middleware
 *
 * Read more about the CORS Middleware here:
 * https://hono.dev/docs/middleware/builtin/cors
 */
app.use(
  cors({
    origin: (origin) => origin, // Allow any origin (including ngrok)
    credentials: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

/**
 * CSRF Protection Middleware prevents CSRF attacks by checking request headers.
 *
 * Read more about the CSRF Protection Middleware here:
 * https://hono.dev/docs/middleware/builtin/csrf
 */
app.use(csrf({ origin: "*" }));

/**
 * This middleware compresses the response body, according to `Accept-Encoding` request header.
 *
 * Read more about the Compression Middleware here:
 * https://hono.dev/docs/middleware/builtin/compress
 */
// app.use(compress());

app.all("/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/", feature_routes);

export default {
  port: env?.API_PORT,
  fetch: app.fetch,
};
