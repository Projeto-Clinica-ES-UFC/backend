import { config } from "dotenv";
import { z } from "zod";

config();

const env_shape = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  API_BASE_URL: z.string(),
  API_PORT: z.coerce.number().min(1).max(65535),
  AUTH_JWT_SECRET: z.string().min(64),
  JWT_EXPIRATION_TIME_SECONDS: z.coerce.number(),
  DATABASE_URL: z.url(),
});

const safe_env = env_shape.safeParse(process.env);

if (!safe_env.success) {
  console.error("Invalid environment variables:", safe_env.error);
}

export const env = safe_env.data;
