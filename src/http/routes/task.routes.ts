import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { taskService } from "@/http/services/task.service";
import { createTaskSchema, updateTaskSchema } from "@/http/dto/task.dto";
import { authMiddleware } from "@/http/middlewares/auth-middleware";

const taskRoutes = new Hono();

taskRoutes.use("*", authMiddleware);

taskRoutes.get("/", describeRoute({
	description: "List all tasks",
}), async (c) => {
	const page = Number(c.req.query("page") || 1);
	const limit = Number(c.req.query("limit") || 20);
	const q = c.req.query("q");
	const status = c.req.query("status");
	const assignedToUserId = c.req.query("assignedToUserId");
	const dueDateUpTo = c.req.query("dueDateUpTo");

	const result = await taskService.getAll({ page, limit, q, status, assignedToUserId, dueDateUpTo });
	return c.json(result);
});

taskRoutes.post("/", describeRoute({
	description: "Create a new task",
}), async (c) => {
	const body = await c.req.json();
	const validated = createTaskSchema.parse(body);
	const result = await taskService.create(validated);
	return c.json(result, 201);
});

taskRoutes.patch("/:id", describeRoute({
	description: "Update a task",
}), async (c) => {
	const id = c.req.param("id");
	const body = await c.req.json();
	const validated = updateTaskSchema.parse(body);
	const result = await taskService.update(id, validated);
	return c.json(result);
});

taskRoutes.delete("/:id", describeRoute({
	description: "Delete a task",
}), async (c) => {
	const id = c.req.param("id");
	await taskService.delete(id);
	return c.body(null, 204);
});

export default taskRoutes;
