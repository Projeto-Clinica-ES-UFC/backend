import { DrizzleTaskRepository } from "@/http/repository/drizzle/task.repository";
import type { CreateTaskDTO, UpdateTaskDTO } from "@/http/dto/task.dto";
import type { PaginationParams } from "@/http/types";
import { HTTPException } from "hono/http-exception";

const taskRepository = new DrizzleTaskRepository();

export class TaskService {
	async getAll(params: PaginationParams & { assignedToId?: number; dueDateUpTo?: string }) {
		return taskRepository.findAll(params);
	}

	async getById(id: number) {
		const task = await taskRepository.findById(id);
		if (!task) {
			throw new HTTPException(404, { message: "Task not found" });
		}
		return task;
	}

	async create(data: CreateTaskDTO) {
		return taskRepository.create(data);
	}

	async update(id: number, data: UpdateTaskDTO) {
		const exists = await taskRepository.findById(id);
		if (!exists) {
			throw new HTTPException(404, { message: "Task not found" });
		}
		return taskRepository.update(id, data);
	}

	async delete(id: number) {
		const exists = await taskRepository.findById(id);
		if (!exists) {
			throw new HTTPException(404, { message: "Task not found" });
		}
		return taskRepository.delete(id);
	}
}

export const taskService = new TaskService();