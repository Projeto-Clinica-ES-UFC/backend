import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { patientService } from "@/http/services/patient.service";
import { createPatientSchema, updatePatientSchema } from "@/http/dto/patient.dto";
import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { medicalRecordService } from "@/http/services/medical-record.service";
import { anamnesisService } from "@/http/services/anamnesis.service";
import { createMedicalRecordSchema, updateMedicalRecordSchema } from "@/http/dto/medical-record.dto";
import { upsertAnamnesisSchema } from "@/http/dto/anamnesis.dto";
import type { Variables } from "@/http/types";

const patientRoutes = new Hono<{ Variables: Variables }>();

patientRoutes.use("*", authMiddleware);

patientRoutes.get("/", describeRoute({
	description: "List all patients",
}), async (c) => {
	const page = Number(c.req.query("page") || 1);
	const limit = Number(c.req.query("limit") || 20);
	const q = c.req.query("q");
	const result = await patientService.getAll({ page, limit, q });
	return c.json(result);
});

patientRoutes.get("/:id", describeRoute({
	description: "Get patient by ID",
}), async (c) => {
	const id = c.req.param("id");
	const result = await patientService.getById(id);
	return c.json(result);
});

patientRoutes.post("/", describeRoute({
	description: "Create a new patient",
}), async (c) => {
	const body = await c.req.json();
	const validated = createPatientSchema.parse(body);
	const result = await patientService.create(validated);
	return c.json(result, 201);
});

patientRoutes.patch("/:id", describeRoute({
	description: "Update a patient",
}), async (c) => {
	const id = c.req.param("id");
	const body = await c.req.json();
	const validated = updatePatientSchema.parse(body);
	const result = await patientService.update(id, validated);
	return c.json(result);
});

patientRoutes.delete("/:id", describeRoute({
	description: "Delete a patient",
}), async (c) => {
	const id = c.req.param("id");
	await patientService.delete(id);
	return c.body(null, 204);
});

// Medical Record Routes
patientRoutes.get("/:id/medical-record", describeRoute({
	description: "Get medical records for a patient",
}), async (c) => {
	const id = c.req.param("id");
	const page = Number(c.req.query("page") || 1);
	const limit = Number(c.req.query("limit") || 20);
	const q = c.req.query("q");
	const result = await medicalRecordService.getByPatientId(id, { page, limit, q });
	return c.json(result);
});

patientRoutes.post("/:id/medical-record", describeRoute({
	description: "Create a medical record for a patient",
}), async (c) => {
	const id = c.req.param("id");
	const user = c.get("user");
	const body = await c.req.json();
	const validated = createMedicalRecordSchema.parse(body);
	const result = await medicalRecordService.create(validated, id, user?.id);
	return c.json(result, 201);
});

patientRoutes.patch("/:id/medical-record/:eventId", describeRoute({
	description: "Update a medical record",
}), async (c) => {
	const eventId = c.req.param("eventId");
	const body = await c.req.json();
	const validated = updateMedicalRecordSchema.parse(body);
	const result = await medicalRecordService.update(eventId, validated);
	return c.json(result);
});

patientRoutes.delete("/:id/medical-record/:eventId", describeRoute({
	description: "Delete a medical record",
}), async (c) => {
	const eventId = c.req.param("eventId");
	await medicalRecordService.delete(eventId);
	return c.body(null, 204);
});

// Anamnesis Routes
patientRoutes.get("/:id/anamnesis", describeRoute({
	description: "Get latest anamnesis for a patient",
}), async (c) => {
	const id = c.req.param("id");
	const result = await anamnesisService.getLatest(id);
	return c.json(result);
});

patientRoutes.put("/:id/anamnesis", describeRoute({
	description: "Upsert anamnesis for a patient",
}), async (c) => {
	const id = c.req.param("id");
	const body = await c.req.json();
	const validated = upsertAnamnesisSchema.parse(body);
	const result = await anamnesisService.create(id, validated);
	return c.json(result);
});

patientRoutes.get("/:id/anamnesis/history", describeRoute({
	description: "Get anamnesis history for a patient",
}), async (c) => {
	const id = c.req.param("id");
	const result = await anamnesisService.getHistory(id);
	return c.json(result);
});

export default patientRoutes;