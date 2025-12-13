import { db } from "@/db";
import { anamnesis } from "@/db/schema";
import type { IAnamnesisRepository, Anamnesis } from "../anamnesis.repository";
import type { UpsertAnamnesisDTO } from "@/http/dto/anamnesis.dto";
import { eq, desc } from "drizzle-orm";

export class DrizzleAnamnesisRepository implements IAnamnesisRepository {
	async findLatestByPatientId(patientId: number): Promise<Anamnesis | null> {
		const [result] = await db
			.select()
			.from(anamnesis)
			.where(eq(anamnesis.patientId, patientId))
			.orderBy(desc(anamnesis.createdAt))
			.limit(1);
		return result || null;
	}

	async create(patientId: number, data: UpsertAnamnesisDTO): Promise<Anamnesis> {
		const [result] = await db
			.insert(anamnesis)
			.values({
				patientId,
				data: data.data,
			})
			.returning();
        
        if (!result) throw new Error("Failed to create anamnesis");
		return result;
	}

	async findHistory(patientId: number): Promise<Anamnesis[]> {
		return db
			.select()
			.from(anamnesis)
			.where(eq(anamnesis.patientId, patientId))
			.orderBy(desc(anamnesis.createdAt));
	}
}