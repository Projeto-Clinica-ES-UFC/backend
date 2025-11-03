import { z } from "zod";

const envShape = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  API_BASE_URL: z.string(),
  API_PORT: z.coerce.number().min(1).max(65535),
  AUTH_JWT_SECRET: z.string().min(64),
  JWT_EXPIRATION_TIME_SECONDS: z.coerce.number(),
  DATABASE_URL: z.url(),
});

const safeEnv = envShape.safeParse(process.env);

if (!safeEnv.success) {
  console.error("Invalid environment variables:", safeEnv.error);
  process.exit(1);
}

export const env = safeEnv.data;
