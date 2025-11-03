import { createMiddleware } from "hono/factory";
import { jwt as honoJwt } from "hono/jwt";

import { env } from "@/env";

/**
 * The JWT Auth Middleware provides authentication by verifying the token with JWT.
 *
 * Read more about the JWT Auth Middleware here:
 * https://hono.dev/docs/middleware/builtin/jwt
 */
export const jwt = createMiddleware(async (c, next) => {
  console.log("Route path => ", c.req.path);
  const jwtMiddleware = honoJwt({
    secret: env.AUTH_JWT_SECRET,
    alg: "HS256",
    cookie: {
      secret: env.AUTH_JWT_SECRET,
      prefixOptions: "secure",
      key: "access-token",
    },
  });

  return jwtMiddleware(c, next);
});
