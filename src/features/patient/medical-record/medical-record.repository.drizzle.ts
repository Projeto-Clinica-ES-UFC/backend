import { db } from "@/db";
import { medicalRecord } from "@/db/schema";
import type { IMedicalRecordRepository, MedicalRecord } from "./medical-record.repository";
import type { CreateMedicalRecordDTO, UpdateMedicalRecordDTO } from "./medical-record.dto";
import type { PaginatedResult, PaginationParams } from "@/shared/types";
import { eq, like, count, desc, and } from "drizzle-orm";

export class DrizzleMedicalRecordRepository implements IMedicalRecordRepository {
	async findByPatientId(patientId: number, { page, limit, q }: PaginationParams): Promise<PaginatedResult<MedicalRecord>> {
		const offset = (page - 1) * limit;
		const whereClause = and(
			eq(medicalRecord.patientId, patientId),
			q ? like(medicalRecord.title, `%${q}%`) : undefined
		);

		const [totalResult] = await db.select({ count: count() }).from(medicalRecord).where(whereClause);
		const total = totalResult?.count ?? 0;

		const data = await db
			.select()
			.from(medicalRecord)
			.where(whereClause)
			.limit(limit)
			.offset(offset)
			.orderBy(desc(medicalRecord.date));

		return {
			data,
			meta: { page, limit, total },
		};
	}

	async findById(id: number): Promise<MedicalRecord | null> {
		const [result] = await db.select().from(medicalRecord).where(eq(medicalRecord.id, id));
		return result || null;
	}

	async create(data: CreateMedicalRecordDTO & { patientId: number; createdById?: string }): Promise<MedicalRecord> {
		const [result] = await db
			.insert(medicalRecord)
			.values({
				...data,
				date: new Date(data.date),
			})
			.returning();

		if (!result) throw new Error("Failed to create medical record");
		return result;
	}

	async update(id: number, data: UpdateMedicalRecordDTO): Promise<MedicalRecord | null> {
		const { date, ...rest } = data;
		const updateData: Partial<typeof medicalRecord.$inferInsert> = { ...rest };
		if (date) updateData.date = new Date(date);

		const [result] = await db
			.update(medicalRecord)
			.set(updateData)
			.where(eq(medicalRecord.id, id))
			.returning();
		return result || null;
	}

	async delete(id: number): Promise<void> {
		await db.delete(medicalRecord).where(eq(medicalRecord.id, id));
	}
}