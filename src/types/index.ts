import type { RequestIdVariables } from "hono/request-id";

// Check if this is secure to use.
// export type Bindings = z.infer<typeof envSchema>;
export type Variables = RequestIdVariables & {};

export type FirebaseConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
};
