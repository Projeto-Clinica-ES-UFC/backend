import {createMiddleware} from "hono/factory";
import type {Variables} from "@/http/types";
import {auth} from "@/http/utils/better-auth";

type Env = {
  Variables: Variables;
};

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({error: "Unauthorized"}, 401);
  }

  c.set("user", session.user);
  c.set("session", session.session);

  await next();
});
