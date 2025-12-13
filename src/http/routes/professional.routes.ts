import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { professionalService } from "@/http/services/professional.service";
import { updateProfessionalSchema, createProfessionalSchema } from "@/http/dto/professional.dto";
import { authMiddleware } from "@/http/middlewares/auth-middleware";

const professionalRoutes = new Hono();

professionalRoutes.use("*", authMiddleware);

professionalRoutes.get("/", describeRoute({
	description: "List all professionals",
}), async (c) => {
	const page = Number(c.req.query("page") || 1);
	const limit = Number(c.req.query("limit") || 20);
	const q = c.req.query("q");
	const result = await professionalService.getAll({ page, limit, q });
	return c.json(result);
});

professionalRoutes.get("/:id", describeRoute({
	description: "Get professional by ID",
}), async (c) => {
	const id = Number(c.req.param("id"));
	const result = await professionalService.getById(id);
	return c.json(result);
});

professionalRoutes.post("/", describeRoute({
	description: "Create a new professional",
}), async (c) => {
	const body = await c.req.json();
	const validated = createProfessionalSchema.parse(body);
	const result = await professionalService.create(validated);
	return c.json(result, 201);
});

professionalRoutes.patch("/:id", describeRoute({
	description: "Update a professional",
}), async (c) => {
	const id = Number(c.req.param("id"));
	const body = await c.req.json();
	const validated = updateProfessionalSchema.parse(body);
	const result = await professionalService.update(id, validated);
	return c.json(result);
});

professionalRoutes.delete("/:id", describeRoute({
	description: "Delete a professional",
}), async (c) => {
	const id = Number(c.req.param("id"));
	const result = await professionalService.delete(id);
	return c.json(result);
});

export default professionalRoutes;
