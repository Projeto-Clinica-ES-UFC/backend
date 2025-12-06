import { z } from "zod";

export const updateProfessionalSchema = z.object({
	name: z.string().optional(),
	phone: z.string().optional(),
	professionalRegistration: z.string().optional(),
	scheduleConfig: z.object({
		standardHours: z.object({
			start: z.string(), // "08:00"
			end: z.string(), // "18:00"
		}).optional(),
		slotDuration: z.number().optional(), // minutes
		daysOfWeek: z.array(z.number()).optional(), // [0-6]
	}).optional(),
});

export type UpdateProfessionalDTO = z.infer<typeof updateProfessionalSchema>;
