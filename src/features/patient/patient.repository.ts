import type { patient } from "@/db/schema";
import type { CreatePatientDTO, UpdatePatientDTO } from "@/features/patient/patient.dto";
import type { PaginatedResult, PaginationParams } from "@/shared/types";

export type Patient = typeof patient.$inferSelect;

export interface IPatientRepository {
	findAll(params: PaginationParams): Promise<PaginatedResult<Patient>>;
	findById(id: number): Promise<Patient | null>;
	create(data: CreatePatientDTO): Promise<Patient>;
	update(id: number, data: UpdatePatientDTO): Promise<Patient | null>;
	delete(id: number): Promise<void>;
}
