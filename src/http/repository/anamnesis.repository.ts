import type { anamnesis } from "@/db/schema";
import type { UpsertAnamnesisDTO } from "@/http/dto/anamnesis.dto";

export type Anamnesis = typeof anamnesis.$inferSelect;

export interface IAnamnesisRepository {
	findLatestByPatientId(patientId: string): Promise<Anamnesis | null>;
	create(patientId: string, data: UpsertAnamnesisDTO): Promise<Anamnesis>;
	findHistory(patientId: string): Promise<Anamnesis[]>;
}
