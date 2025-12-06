import { z } from "zod";

export const upsertAnamnesisSchema = z.object({
	data: z.record(z.any()), // JSON object with form fields
});

export type UpsertAnamnesisDTO = z.infer<typeof upsertAnamnesisSchema>;
