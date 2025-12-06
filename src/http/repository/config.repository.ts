import type { configuration } from "@/db/schema";

export type Configuration = typeof configuration.$inferSelect;

export interface IConfigRepository {
	getAll(): Promise<Record<string, any>>;
	update(data: Record<string, any>): Promise<void>;
}
