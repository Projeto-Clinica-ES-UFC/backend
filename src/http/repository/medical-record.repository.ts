import type { medicalRecord } from "@/db/schema";
import type { CreateMedicalRecordDTO, UpdateMedicalRecordDTO } from "@/http/dto/medical-record.dto";
import type { PaginatedResult, PaginationParams } from "@/http/types";

export type MedicalRecord = typeof medicalRecord.$inferSelect;

export interface IMedicalRecordRepository {
	findByPatientId(patientId: string, params: PaginationParams): Promise<PaginatedResult<MedicalRecord>>;
	findById(id: string): Promise<MedicalRecord | null>;
	create(data: CreateMedicalRecordDTO & { patientId: string; createdById?: string }): Promise<MedicalRecord>;
	update(id: string, data: UpdateMedicalRecordDTO): Promise<MedicalRecord | null>;
	delete(id: string): Promise<void>;
}
