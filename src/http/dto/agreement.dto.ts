import { z } from "zod";

export const createAgreementSchema = z.object({
	name: z.string().min(1, "Name is required"),
	cnpj: z.string().optional(),
	ansRegistration: z.string().optional(),
	active: z.boolean().default(true),
});

export const updateAgreementSchema = createAgreementSchema.partial();

export type CreateAgreementDTO = z.infer<typeof createAgreementSchema>;
export type UpdateAgreementDTO = z.infer<typeof updateAgreementSchema>;
