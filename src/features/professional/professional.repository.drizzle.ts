import { db } from "@/db";
import { professional } from "@/db/schema";
import type { IProfessionalRepository, Professional } from "./professional.repository";
import type { UpdateProfessionalDTO } from "./professional.dto";
import type { PaginatedResult, PaginationParams } from "@/shared/types";
import { eq, like, count, desc } from "drizzle-orm";

export class DrizzleProfessionalRepository implements IProfessionalRepository {
	async findAll({ page, limit, q }: PaginationParams): Promise<PaginatedResult<Professional>> {
		const offset = (page - 1) * limit;
		let whereClause = undefined;
		if (q) {
			whereClause = like(professional.name, `%${q}%`);
		}

		const [totalResult] = await db.select({ count: count() }).from(professional).where(whereClause);
		const total = totalResult?.count ?? 0;

		const data = await db
			.select()
			.from(professional)
			.where(whereClause)
			.limit(limit)
			.offset(offset)
			.orderBy(desc(professional.name));

		return {
			data,
			meta: { page, limit, total },
		};
	}

	async findById(id: number): Promise<Professional | null> {
		const [result] = await db.select().from(professional).where(eq(professional.id, id));
		return result || null;
	}

	async create(data: { name: string; email: string; specialty?: string }): Promise<Professional> {
		// Check if professional with this email already exists
		const [existingProfessional] = await db
			.select()
			.from(professional)
			.where(eq(professional.email, data.email));

		if (existingProfessional) {
			throw new Error("Um profissional com este email já existe");
		}

		// Create Professional (no user account needed)
		const [newProfessional] = await db
			.insert(professional)
			.values({
				name: data.name,
				email: data.email,
				specialty: data.specialty,
			})
			.returning();

		if (!newProfessional) {
			throw new Error("Failed to create professional");
		}

		return newProfessional;
	}

	async update(id: number, data: UpdateProfessionalDTO): Promise<Professional | null> {
		const [result] = await db
			.update(professional)
			.set(data)
			.where(eq(professional.id, id))
			.returning();
		return result || null;
	}

	async delete(id: number): Promise<Professional | null> {
		const [result] = await db
			.delete(professional)
			.where(eq(professional.id, id))
			.returning();
		return result || null;
	}
}