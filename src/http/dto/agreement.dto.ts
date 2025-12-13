import { z } from "zod";

export const createAgreementSchema = z.object({
	name: z.string().min(1, "Name is required"),
	discount: z.number().default(0),
});

export const updateAgreementSchema = createAgreementSchema.partial();

export type CreateAgreementDTO = z.infer<typeof createAgreementSchema>;
export type UpdateAgreementDTO = z.infer<typeof updateAgreementSchema>;
