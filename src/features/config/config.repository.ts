import type { configuration } from "@/db/schema";

export type Configuration = typeof configuration.$inferSelect;

export interface IConfigRepository {
	getAll(): Promise<Record<string, unknown>>;
	update(data: Record<string, unknown>): Promise<void>;
}
