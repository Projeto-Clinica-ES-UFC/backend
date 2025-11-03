import { env } from "@/env";
import type { JWTPayload } from "@/types/index.js";

import { generateId } from "./generate-id";

type GenerateJWTPayloadOptions = Partial<Pick<JWTPayload, "exp" | "aud">>;

/**
 * Generates a JWT payload with standard claims.
 *
 * @param data - The subject of the token, representing the user or entity the token refers to.
 * @returns An object containing the JWT payload with the following claims:
 * - `iss` (Issuer): The entity that generated the token (e.g., server URL).
 * - `sub` (Subject): The user or entity the token refers to.
 * - `aud` (Audience): The intended recipients of the token (e.g., client URL).
 * - `exp` (Expiration Time): The time after which the token expires (7 days from now).
 * - `nbf` (Not Before): The time before which the token must not be accepted (current time).
 * - `iat` (Issued At): The time at which the token was issued (current time).
 * - `jti` (JWT ID): A unique identifier for the token to prevent reuse.
 */
export const generateJWTPayload = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  options?: GenerateJWTPayloadOptions
): JWTPayload => {
  // Ensure token has not expired (Expiration Time: 7 days by default)
  const expirationTime =
    options?.exp || Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

  // Ensure token is not issued in the future (Issued At: now)
  const issuedAt = Math.floor(Date.now() / 1000);

  // Ensure token is not used before a specified time (Not Before: now)
  const notBefore = Math.floor(Date.now() / 1000);

  // Issuer (entity that generated the token, e.g. server URL)
  const issuer = env.API_BASE_URL;

  // Subject (user or entity the token refers to)
  const subject = data;

  // Audience (intended recipients of the token, e.g. client URL)
  const audience = options?.aud || "https://example.com/audience";

  // Unique identifier for the token (prevents token reuse)
  const jwtId = generateId("jwt");

  return {
    iss: issuer,
    sub: subject,
    aud: audience,
    exp: expirationTime,
    nbf: notBefore,
    iat: issuedAt,
    jti: jwtId,
  };
};
