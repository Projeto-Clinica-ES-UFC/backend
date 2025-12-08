import { Hono } from "hono";
import { appointmentService } from "@/http/services/appointment.service";
import { createAppointmentSchema, updateAppointmentSchema } from "@/http/dto/appointment.dto";
import { authMiddleware } from "@/http/middlewares/auth-middleware";
import type { Variables } from "@/http/types";

const appointmentRoutes = new Hono<{ Variables: Variables }>();

appointmentRoutes.use("*", authMiddleware);

appointmentRoutes.get("/", async (c) => {
	const page = Number(c.req.query("page") || 1);
	const limit = Number(c.req.query("limit") || 20);
	const q = c.req.query("q");
	const professionalId = c.req.query("professionalId");
	const patientId = c.req.query("patientId");
	const startDate = c.req.query("startDate");
	const endDate = c.req.query("endDate");
	const status = c.req.queries("status"); // queries returns array for ?status=A&status=B

	const result = await appointmentService.getAll({ 
		page, 
		limit, 
		q,
		professionalId,
		patientId,
		startDate,
		endDate,
		status
	});
	return c.json(result);
});

appointmentRoutes.get("/:id", async (c) => {
	const id = c.req.param("id");
	const result = await appointmentService.getById(id);
	return c.json(result);
});

appointmentRoutes.post("/", async (c) => {
	const user = c.get("user");
	const body = await c.req.json();
	const validated = createAppointmentSchema.parse(body);
	const result = await appointmentService.create(validated, user?.id);
	return c.json(result, 201);
});

appointmentRoutes.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const body = await c.req.json();
	const validated = updateAppointmentSchema.parse(body);
	const result = await appointmentService.update(id, validated);
	return c.json(result);
});

appointmentRoutes.delete("/:id", async (c) => {
	const id = c.req.param("id");
	await appointmentService.delete(id);
	return c.body(null, 204);
});

export default appointmentRoutes;
