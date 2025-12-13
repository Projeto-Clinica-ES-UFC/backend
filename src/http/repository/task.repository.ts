import type { task } from "@/db/schema";
import type { CreateTaskDTO, UpdateTaskDTO } from "@/http/dto/task.dto";
import type { PaginatedResult, PaginationParams } from "@/http/types";

export type Task = typeof task.$inferSelect;

export interface ITaskRepository {
	findAll(params: PaginationParams & { assignedToId?: number; dueDateUpTo?: string }): Promise<PaginatedResult<Task>>;
	findById(id: number): Promise<Task | null>;
	create(data: CreateTaskDTO): Promise<Task>;
	update(id: number, data: UpdateTaskDTO): Promise<Task | null>;
	delete(id: number): Promise<void>;
}
