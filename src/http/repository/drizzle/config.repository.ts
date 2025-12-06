import { db } from "@/db";
import { configuration } from "@/db/schema";
import type { IConfigRepository } from "../config.repository";

export class DrizzleConfigRepository implements IConfigRepository {
	async getAll(): Promise<Record<string, any>> {
		const rows = await db.select().from(configuration);
		const result: Record<string, any> = {};
		rows.forEach((row) => {
			try {
				result[row.key] = JSON.parse(row.value);
			} catch {
				result[row.key] = row.value;
			}
		});
		return result;
	}

	async update(data: Record<string, any>): Promise<void> {
		for (const [key, value] of Object.entries(data)) {
			const strVal = JSON.stringify(value);
			await db
				.insert(configuration)
				.values({ key, value: strVal })
				.onConflictDoUpdate({ target: configuration.key, set: { value: strVal } });
		}
	}
}
