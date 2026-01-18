import type { medicalRecord } from "@/db/schema";
import type { CreateMedicalRecordDTO, UpdateMedicalRecordDTO } from "@/features/patient/medical-record/medical-record.dto";
import type { PaginatedResult, PaginationParams } from "@/shared/types";

export type MedicalRecord = typeof medicalRecord.$inferSelect;

export interface IMedicalRecordRepository {
	findByPatientId(patientId: number, params: PaginationParams): Promise<PaginatedResult<MedicalRecord>>;
	findById(id: number): Promise<MedicalRecord | null>;
	create(data: CreateMedicalRecordDTO & { patientId: number; createdById?: string }): Promise<MedicalRecord>;
	update(id: number, data: UpdateMedicalRecordDTO): Promise<MedicalRecord | null>;
	delete(id: number): Promise<void>;
}
