import {Hono} from "hono";
import {cors} from "hono/cors";
import {csrf} from "hono/csrf";
import {logger} from "hono/logger";
import {getConnInfo} from "hono/vercel";

import {rateLimiter} from "hono-rate-limiter";
import {prettyJSON} from "hono/pretty-json";
import {i18n} from "@/http/middlewares/i18n";

import {httpRoutes} from "@/http/routes";
import {type Variables} from "@/types";

import {env} from "./env";

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
 * Rate limiting middleware for Hono. Use to limit repeated requests to public APIs and/or endpoints such as password reset
 *
 * Read more about the Rate Limiting Middleware here:
 * https://github.com/rhinobase/hono-rate-limiter/blob/main/README.md
 */
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    /**
     * Limit each IP to 100 requests per `window` (here, per 15 minutes).
     */

    limit: 100,
    /**
     * draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
     */
    standardHeaders: "draft-6",
    /**
     * Method to generate custom identifiers for clients.
     */
    keyGenerator: c => {
      const info = getConnInfo(c);
      return info.remote.address as string;
    },
    message: {message: "Too many requests, please try again later."},
  })
);
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
    origin: "*",
    credentials: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

/**
 * CSRF Protection Middleware prevents CSRF attacks by checking request headers.
 *
 * Read more about the CSRF Protection Middleware here:
 * https://hono.dev/docs/middleware/builtin/csrf
 */
app.use(csrf());

/**
 * This middleware compresses the response body, according to `Accept-Encoding` request header.
 *
 * Read more about the Compression Middleware here:
 * https://hono.dev/docs/middleware/builtin/compress
 */
// app.use(compress());
app.use(i18n)

app.route("/", httpRoutes);

export default {
  port: env.API_PORT,
  fetch: app.fetch,
};
