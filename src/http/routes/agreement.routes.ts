import { Hono } from "hono";
import { agreementService } from "@/http/services/agreement.service";
import { createAgreementSchema, updateAgreementSchema } from "@/http/dto/agreement.dto";
import { authMiddleware } from "@/http/middlewares/auth-middleware";

const agreementRoutes = new Hono();

// Protect all routes? Requirements say "protected routes must use Better Auth".
// Agreements seem to be admin managed.
// I'll apply authMiddleware.

agreementRoutes.use("*", authMiddleware);

agreementRoutes.get("/", async (c) => {
	const page = Number(c.req.query("page") || 1);
	const limit = Number(c.req.query("limit") || 20);
	const q = c.req.query("q");
	const result = await agreementService.getAll({ page, limit, q });
	return c.json(result);
});

agreementRoutes.get("/:id", async (c) => {
	const id = c.req.param("id");
	const result = await agreementService.getById(id);
	return c.json(result);
});

agreementRoutes.post("/", async (c) => {
	const body = await c.req.json();
	const validated = createAgreementSchema.parse(body);
	const result = await agreementService.create(validated);
	return c.json(result, 201);
});

agreementRoutes.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const body = await c.req.json();
	const validated = updateAgreementSchema.parse(body);
	const result = await agreementService.update(id, validated);
	return c.json(result);
});

agreementRoutes.delete("/:id", async (c) => {
	const id = c.req.param("id");
	await agreementService.delete(id);
	return c.body(null, 204);
});

export default agreementRoutes;
