import { Hono } from "hono";
import { patientService } from "@/http/services/patient.service";
import { createPatientSchema, updatePatientSchema } from "@/http/dto/patient.dto";
import { authMiddleware } from "@/http/middlewares/auth-middleware";

const patientRoutes = new Hono();

patientRoutes.use("*", authMiddleware);

patientRoutes.get("/", async (c) => {
	const page = Number(c.req.query("page") || 1);
	const limit = Number(c.req.query("limit") || 20);
	const q = c.req.query("q");
	const result = await patientService.getAll({ page, limit, q });
	return c.json(result);
});

patientRoutes.get("/:id", async (c) => {
	const id = c.req.param("id");
	const result = await patientService.getById(id);
	return c.json(result);
});

patientRoutes.post("/", async (c) => {
	const body = await c.req.json();
	const validated = createPatientSchema.parse(body);
	const result = await patientService.create(validated);
	return c.json(result, 201);
});

patientRoutes.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const body = await c.req.json();
	const validated = updatePatientSchema.parse(body);
	const result = await patientService.update(id, validated);
	return c.json(result);
});

patientRoutes.delete("/:id", async (c) => {
	const id = c.req.param("id");
	await patientService.delete(id);
	return c.body(null, 204);
});

export default patientRoutes;
