import type { JWTPayload as HonoJWTPayload } from "hono/utils/jwt/types";

import { RequestIdVariables } from "hono/request-id";

// Check if this is secure to use.
// export type Bindings = z.infer<typeof envSchema>;
export type Variables = RequestIdVariables & {};

export type JWTPayload = HonoJWTPayload & {
  /**
   *  Ensure token is not issued in the future (Issued At: now)
   */
  iss: string;
  /**
   * Subject (user or entity the token refers to)
   */
  sub: unknown;
  /**
   * Audience (intended recipients of the token, e.g. client URL)
   */
  aud?: string;
  /**
   * Unique identifier for the token (prevents token reuse)
   */
  jti?: string;
  [key: string]: unknown;
};
