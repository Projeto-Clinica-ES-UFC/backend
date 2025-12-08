import { db } from "@/db";
import { specialty } from "@/db/schema";
import type { ISpecialtyRepository, Specialty } from "../specialty.repository";
import { eq } from "drizzle-orm";

export class DrizzleSpecialtyRepository implements ISpecialtyRepository {
	async findAll(): Promise<Specialty[]> {
		return db.select().from(specialty);
	}

	async create(name: string): Promise<Specialty> {
		const id = crypto.randomUUID();
		const [result] = await db.insert(specialty).values({ id, name }).returning();
        
        if (!result) throw new Error("Failed to create specialty");
		return result;
	}

	async delete(id: string): Promise<void> {
		await db.delete(specialty).where(eq(specialty.id, id));
	}
}
