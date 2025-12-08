import { db } from "@/db";
import { task } from "@/db/schema";
import type { ITaskRepository, Task } from "../task.repository";
import type { CreateTaskDTO, UpdateTaskDTO } from "@/http/dto/task.dto";
import type { PaginatedResult, PaginationParams } from "@/http/types";
import { eq, like, count, desc, and, lte } from "drizzle-orm";

export class DrizzleTaskRepository implements ITaskRepository {
	async findAll(params: PaginationParams & { status?: string; assignedToUserId?: string; dueDateUpTo?: string }): Promise<PaginatedResult<Task>> {
		const { page, limit, q, status, assignedToUserId, dueDateUpTo } = params;
		const offset = (page - 1) * limit;

		const conditions = [];
		if (q) conditions.push(like(task.title, `%${q}%`));
		if (status) conditions.push(eq(task.status, status as "Pending" | "Completed" | "Canceled"));
		if (assignedToUserId) conditions.push(eq(task.assignedToUserId, assignedToUserId));
		if (dueDateUpTo) conditions.push(lte(task.dueDate, new Date(dueDateUpTo)));

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

		const [totalResult] = await db.select({ count: count() }).from(task).where(whereClause);
		const total = totalResult?.count ?? 0;

		const data = await db
			.select()
			.from(task)
			.where(whereClause)
			.limit(limit)
			.offset(offset)
			.orderBy(desc(task.createdAt));

		return {
			data,
			meta: { page, limit, total },
		};
	}

	async findById(id: string): Promise<Task | null> {
		const [result] = await db.select().from(task).where(eq(task.id, id));
		return result || null;
	}

	async create(data: CreateTaskDTO): Promise<Task> {
		const id = crypto.randomUUID();
        const { dueDate, ...rest } = data;
		const values: typeof task.$inferInsert = { ...rest, id };
		if (dueDate) values.dueDate = new Date(dueDate);

		const [result] = await db
			.insert(task)
			.values(values)
			.returning();
        
        if (!result) throw new Error("Failed to create task");
		return result;
	}

	async update(id: string, data: UpdateTaskDTO): Promise<Task | null> {
        const { dueDate, ...rest } = data;
		const values: Partial<typeof task.$inferInsert> = { ...rest };
		if (dueDate) values.dueDate = new Date(dueDate);

		const [result] = await db
			.update(task)
			.set(values)
			.where(eq(task.id, id))
			.returning();
		return result || null;
	}

	async delete(id: string): Promise<void> {
		await db.delete(task).where(eq(task.id, id));
	}
}
