import { z } from "zod";

export const createTaskSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	done: z.boolean().optional(),
	priority: z.enum(["Baixa", "Média", "Alta"]).default("Baixa"),
	assignedToId: z.coerce.number().optional(),
	dueDate: z.string().datetime().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;
