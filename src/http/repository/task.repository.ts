import type { task } from "@/db/schema";
import type { CreateTaskDTO, UpdateTaskDTO } from "@/http/dto/task.dto";
import type { PaginatedResult, PaginationParams } from "@/http/types";

export type Task = typeof task.$inferSelect;

export interface ITaskRepository {
	findAll(params: PaginationParams & { status?: string; assignedToUserId?: string; dueDateUpTo?: string }): Promise<PaginatedResult<Task>>;
	findById(id: string): Promise<Task | null>;
	create(data: CreateTaskDTO): Promise<Task>;
	update(id: string, data: UpdateTaskDTO): Promise<Task | null>;
	delete(id: string): Promise<void>;
}
