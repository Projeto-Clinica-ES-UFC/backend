import { db } from "@/db";
import { anamnesis } from "@/db/schema";
import type { IAnamnesisRepository, Anamnesis } from "../anamnesis.repository";
import type { UpsertAnamnesisDTO } from "@/http/dto/anamnesis.dto";
import { eq, desc } from "drizzle-orm";

export class DrizzleAnamnesisRepository implements IAnamnesisRepository {
	async findLatestByPatientId(patientId: string): Promise<Anamnesis | null> {
		const [result] = await db
			.select()
			.from(anamnesis)
			.where(eq(anamnesis.patientId, patientId))
			.orderBy(desc(anamnesis.createdAt))
			.limit(1);
		return result || null;
	}

	async create(patientId: string, data: UpsertAnamnesisDTO): Promise<Anamnesis> {
		const id = crypto.randomUUID();
		const [result] = await db
			.insert(anamnesis)
			.values({
				id,
				patientId,
				data: data.data,
			})
			.returning();
		return result;
	}

	async findHistory(patientId: string): Promise<Anamnesis[]> {
		return db
			.select()
			.from(anamnesis)
			.where(eq(anamnesis.patientId, patientId))
			.orderBy(desc(anamnesis.createdAt));
	}
}
