import { db } from "@/db";
import { agreement } from "@/db/schema";
import type { IAgreementRepository, Agreement } from "../agreement.repository";
import type { CreateAgreementDTO, UpdateAgreementDTO } from "@/http/dto/agreement.dto";
import type { PaginatedResult, PaginationParams } from "@/http/types";
import { eq, like, count, desc } from "drizzle-orm";

export class DrizzleAgreementRepository implements IAgreementRepository {
	async findAll({ page, limit, q }: PaginationParams): Promise<PaginatedResult<Agreement>> {
		const offset = (page - 1) * limit;
		let whereClause = undefined;
		if (q) {
			whereClause = like(agreement.name, `%${q}%`);
		}

		const [totalResult] = await db.select({ count: count() }).from(agreement).where(whereClause);
		const total = totalResult.count;

		const data = await db
			.select()
			.from(agreement)
			.where(whereClause)
			.limit(limit)
			.offset(offset)
			.orderBy(desc(agreement.name));

		return {
			data,
			meta: { page, limit, total },
		};
	}

	async findById(id: string): Promise<Agreement | null> {
		const [result] = await db.select().from(agreement).where(eq(agreement.id, id));
		return result || null;
	}

	async create(data: CreateAgreementDTO): Promise<Agreement> {
		const id = crypto.randomUUID();
		const [result] = await db
			.insert(agreement)
			.values({ ...data, id })
			.returning();
		return result;
	}

	async update(id: string, data: UpdateAgreementDTO): Promise<Agreement | null> {
		const [result] = await db
			.update(agreement)
			.set(data)
			.where(eq(agreement.id, id))
			.returning();
		return result || null;
	}

	async delete(id: string): Promise<void> {
		await db.delete(agreement).where(eq(agreement.id, id));
	}
}
