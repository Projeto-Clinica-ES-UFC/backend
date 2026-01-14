import { z } from "zod";

export const createAppointmentSchema = z.object({
	professionalId: z.coerce.number().min(1, "Professional ID is required"),
	patientId: z.coerce.number().min(1, "Patient ID is required"),
	start: z.string().datetime(),
	end: z.string().datetime(),
	status: z.enum(["Pendente", "Confirmado", "Realizado", "Cancelado"]).optional(),
	pendenciaUnimed: z.boolean().optional(), // Maps to unimedPending in DB
});

export const updateAppointmentSchema = z.object({
	start: z.string().datetime().optional(),
	end: z.string().datetime().optional(),
	status: z.enum(["Pendente", "Confirmado", "Realizado", "Cancelado"]).optional(),
	pendenciaUnimed: z.boolean().optional(), // Maps to unimedPending in DB
});

export type CreateAppointmentDTO = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentDTO = z.infer<typeof updateAppointmentSchema>;
