import { z } from "zod";

export const createAppointmentSchema = z.object({
	professionalId: z.string().min(1, "Professional ID is required"),
	patientId: z.string().min(1, "Patient ID is required"),
	start: z.string().datetime(),
	end: z.string().datetime(),
	title: z.string().optional(),
	description: z.string().optional(),
	location: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
	start: z.string().datetime().optional(),
	end: z.string().datetime().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	status: z.enum(["Scheduled", "Confirmed", "InService", "Finished", "Canceled", "Missed"]).optional(),
	location: z.string().optional(),
});

export type CreateAppointmentDTO = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentDTO = z.infer<typeof updateAppointmentSchema>;
