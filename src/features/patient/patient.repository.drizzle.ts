import { db } from "@/db";
import { patient } from "@/db/schema";
import type { IPatientRepository, Patient } from "./patient.repository";
import type { CreatePatientDTO, UpdatePatientDTO } from "./patient.dto";
import type { PaginatedResult, PaginationParams } from "@/shared/types";
import { eq, like, count, desc, or } from "drizzle-orm";

export class DrizzlePatientRepository implements IPatientRepository {
	async findAll({ page, limit, q }: PaginationParams): Promise<PaginatedResult<Patient>> {
		const offset = (page - 1) * limit;
		let whereClause = undefined;
		if (q) {
			whereClause = or(like(patient.name, `%${q}%`), like(patient.cpf, `%${q}%`));
		}

		const [totalResult] = await db.select({ count: count() }).from(patient).where(whereClause);
		const total = totalResult?.count ?? 0;

		const data = await db
			.select()
			.from(patient)
			.where(whereClause)
			.limit(limit)
			.offset(offset)
			.orderBy(desc(patient.createdAt));

		return {
			data,
			meta: { page, limit, total },
		};
	}

	async findById(id: number): Promise<Patient | null> {
		const [result] = await db.select().from(patient).where(eq(patient.id, id));
		return result || null;
	}

	async create(data: CreatePatientDTO): Promise<Patient> {
		const [result] = await db
			.insert(patient)
			.values({ ...data })
			.returning();

		if (!result) throw new Error("Failed to create patient");
		return result;
	}

	async update(id: number, data: UpdatePatientDTO): Promise<Patient | null> {
		const [result] = await db
			.update(patient)
			.set(data)
			.where(eq(patient.id, id))
			.returning();
		return result || null;
	}

	async delete(id: number): Promise<void> {
		await db.delete(patient).where(eq(patient.id, id));
	}
}
