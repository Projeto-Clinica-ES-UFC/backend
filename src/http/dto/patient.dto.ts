import { z } from "zod";

export const createPatientSchema = z.object({
	name: z.string().min(1, "Name is required"),
	cpf: z.string().min(11, "CPF must be at least 11 characters").optional(),
	dateOfBirth: z.string().optional(), // YYYY-MM-DD
	responsibleName: z.string().optional(),
	responsiblePhone: z.string().optional(),
	status: z.enum(["Agendado", "Em Atendimento", "Finalizado", "Cancelado"]).optional(),
});

export const updatePatientSchema = createPatientSchema.partial();

export type CreatePatientDTO = z.infer<typeof createPatientSchema>;
export type UpdatePatientDTO = z.infer<typeof updatePatientSchema>;
