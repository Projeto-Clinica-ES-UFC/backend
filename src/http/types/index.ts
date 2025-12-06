import type { RequestIdVariables } from "hono/request-id";
import { auth } from "@/http/utils/better-auth";

// Check if this is secure to use.
// export type Bindings = z.infer<typeof envSchema>;
export type Variables = RequestIdVariables & {
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
};

export type PaginatedResult<T> = {
	data: T[];
	meta: {
		page: number;
		limit: number;
		total: number;
	};
};

export type PaginationParams = {
	page: number;
	limit: number;
	q?: string;
};

