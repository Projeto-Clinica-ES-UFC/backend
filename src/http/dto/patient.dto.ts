import { z } from "zod";

export const createPatientSchema = z.object({
	name: z.string().min(1, "Name is required"),
	cpf: z.string().min(11, "CPF must be at least 11 characters").optional(), // Optional per schema unique constraint but usually required. Logic might enforce it.
	dateOfBirth: z.string().optional(), // YYYY-MM-DD
	gender: z.string().optional(),
	phone: z.string().optional(),
	agreementId: z.string().optional().nullable(),
	address: z.string().optional(),
	city: z.string().optional(),
	responsibleName: z.string().optional(),
	responsiblePhone: z.string().optional(),
});

export const updatePatientSchema = createPatientSchema.partial();

export type CreatePatientDTO = z.infer<typeof createPatientSchema>;
export type UpdatePatientDTO = z.infer<typeof updatePatientSchema>;
