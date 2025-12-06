import { DrizzleMedicalRecordRepository } from "@/http/repository/drizzle/medical-record.repository";
import type { CreateMedicalRecordDTO, UpdateMedicalRecordDTO } from "@/http/dto/medical-record.dto";
import type { PaginationParams } from "@/http/types";
import { HTTPException } from "hono/http-exception";

const medicalRecordRepository = new DrizzleMedicalRecordRepository();

export class MedicalRecordService {
	async getByPatientId(patientId: string, params: PaginationParams) {
		return medicalRecordRepository.findByPatientId(patientId, params);
	}

	async create(data: CreateMedicalRecordDTO, patientId: string, userId?: string) {
		return medicalRecordRepository.create({ ...data, patientId, createdById: userId });
	}

	async update(id: string, data: UpdateMedicalRecordDTO) {
		const exists = await medicalRecordRepository.findById(id);
		if (!exists) {
			throw new HTTPException(404, { message: "Event not found" });
		}
		return medicalRecordRepository.update(id, data);
	}

	async delete(id: string) {
		const exists = await medicalRecordRepository.findById(id);
		if (!exists) {
			throw new HTTPException(404, { message: "Event not found" });
		}
		return medicalRecordRepository.delete(id);
	}
}

export const medicalRecordService = new MedicalRecordService();
