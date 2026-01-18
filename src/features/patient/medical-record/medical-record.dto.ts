import { z } from "zod";

export const createMedicalRecordSchema = z.object({
	type: z.enum(["Consultation", "Evaluation", "Observation"]),
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	date: z.string().datetime(),
});

export const updateMedicalRecordSchema = createMedicalRecordSchema.partial();

export type CreateMedicalRecordDTO = z.infer<typeof createMedicalRecordSchema>;
export type UpdateMedicalRecordDTO = z.infer<typeof updateMedicalRecordSchema>;

