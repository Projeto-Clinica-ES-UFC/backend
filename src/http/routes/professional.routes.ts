import { Hono } from "hono";
import { professionalService } from "@/http/services/professional.service";
import { updateProfessionalSchema } from "@/http/dto/professional.dto";
import { authMiddleware } from "@/http/middlewares/auth-middleware";

const professionalRoutes = new Hono();

professionalRoutes.use("*", authMiddleware);

professionalRoutes.get("/", async (c) => {
	const page = Number(c.req.query("page") || 1);
	const limit = Number(c.req.query("limit") || 20);
	const q = c.req.query("q");
	const result = await professionalService.getAll({ page, limit, q });
	return c.json(result);
});

professionalRoutes.get("/:id", async (c) => {
	const id = c.req.param("id");
	const result = await professionalService.getById(id);
	return c.json(result);
});

professionalRoutes.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const body = await c.req.json();
	const validated = updateProfessionalSchema.parse(body);
	const result = await professionalService.update(id, validated);
	return c.json(result);
});

export default professionalRoutes;
