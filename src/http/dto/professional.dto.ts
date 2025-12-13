import { z } from "zod";

export const createProfessionalSchema = z.object({
	name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    specialty: z.string().optional(),
});

export const updateProfessionalSchema = z.object({
	name: z.string().optional(),
	email: z.string().email("Invalid email").optional(),
	specialty: z.string().optional(),
});

export type UpdateProfessionalDTO = z.infer<typeof updateProfessionalSchema>;
export type CreateProfessionalDTO = z.infer<typeof createProfessionalSchema>;
