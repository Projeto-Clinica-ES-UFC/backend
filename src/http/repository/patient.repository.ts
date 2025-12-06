import type { patient } from "@/db/schema";
import type { CreatePatientDTO, UpdatePatientDTO } from "@/http/dto/patient.dto";
import type { PaginatedResult, PaginationParams } from "@/http/types";

export type Patient = typeof patient.$inferSelect;

export interface IPatientRepository {
	findAll(params: PaginationParams): Promise<PaginatedResult<Patient>>;
	findById(id: string): Promise<Patient | null>;
	create(data: CreatePatientDTO): Promise<Patient>;
	update(id: string, data: UpdatePatientDTO): Promise<Patient | null>;
	delete(id: string): Promise<void>;
}
