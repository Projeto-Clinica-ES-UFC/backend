import { db } from "@/db";
import { professional } from "@/db/schema";
import type { IProfessionalRepository, Professional } from "../professional.repository";
import type { UpdateProfessionalDTO } from "@/http/dto/professional.dto";
import type { PaginatedResult, PaginationParams } from "@/http/types";
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

	async findById(id: string): Promise<Professional | null> {
		const [result] = await db.select().from(professional).where(eq(professional.id, id));
		return result || null;
	}

	async findByUserId(userId: string): Promise<Professional | null> {
		const [result] = await db.select().from(professional).where(eq(professional.userId, userId));
		return result || null;
	}

	async create(data: { userId: string; name: string }): Promise<Professional> {
		const id = crypto.randomUUID();
		const [result] = await db
			.insert(professional)
			.values({ ...data, id })
			.returning();
        
        if (!result) throw new Error("Failed to create professional");
		return result;
	}

	async update(id: string, data: UpdateProfessionalDTO): Promise<Professional | null> {
		const [result] = await db
			.update(professional)
			.set(data)
			.where(eq(professional.id, id))
			.returning();
		return result || null;
	}

	async delete(id: string): Promise<Professional | null> {
		const [result] = await db
			.delete(professional)
			.where(eq(professional.id, id))
			.returning();
		return result || null;
	}
}
