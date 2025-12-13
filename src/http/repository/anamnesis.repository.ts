import type { anamnesis } from "@/db/schema";
import type { UpsertAnamnesisDTO } from "@/http/dto/anamnesis.dto";

export type Anamnesis = typeof anamnesis.$inferSelect;

export interface IAnamnesisRepository {
	findLatestByPatientId(patientId: number): Promise<Anamnesis | null>;
	create(patientId: number, data: UpsertAnamnesisDTO): Promise<Anamnesis>;
	findHistory(patientId: number): Promise<Anamnesis[]>;
}
