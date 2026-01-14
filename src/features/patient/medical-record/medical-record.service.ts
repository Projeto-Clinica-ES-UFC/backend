import { DrizzleMedicalRecordRepository } from "./medical-record.repository.drizzle";
import type { CreateMedicalRecordDTO, UpdateMedicalRecordDTO } from "./medical-record.dto";
import type { PaginationParams } from "@/shared/types";
import { HTTPException } from "hono/http-exception";

const medicalRecordRepository = new DrizzleMedicalRecordRepository();

export class MedicalRecordService {
	async getByPatientId(patientId: number, params: PaginationParams) {
		return medicalRecordRepository.findByPatientId(patientId, params);
	}

	async create(data: CreateMedicalRecordDTO, patientId: number, userId?: string) {
		return medicalRecordRepository.create({ ...data, patientId, createdById: userId });
	}

	async update(id: number, data: UpdateMedicalRecordDTO) {
		const exists = await medicalRecordRepository.findById(id);
		if (!exists) {
			throw new HTTPException(404, { message: "Event not found" });
		}
		return medicalRecordRepository.update(id, data);
	}

	async delete(id: number) {
		const exists = await medicalRecordRepository.findById(id);
		if (!exists) {
			throw new HTTPException(404, { message: "Event not found" });
		}
		return medicalRecordRepository.delete(id);
	}
}

export const medicalRecordService = new MedicalRecordService();