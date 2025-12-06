import type { RequestIdVariables } from "hono/request-id";
import { auth } from "@/better-auth";

// Check if this is secure to use.
// export type Bindings = z.infer<typeof envSchema>;
export type Variables = RequestIdVariables & {
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
};

export type FirebaseConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
};
