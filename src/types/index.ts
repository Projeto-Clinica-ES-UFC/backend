import { RequestIdVariables } from "hono/request-id";

// Check if this is secure to use.
// export type Bindings = z.infer<typeof envSchema>;
export type Variables = RequestIdVariables & {};

