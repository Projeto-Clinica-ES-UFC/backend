import { DrizzlePatientRepository } from "@/http/repository/drizzle/patient.repository";
import type { CreatePatientDTO, UpdatePatientDTO } from "@/http/dto/patient.dto";
import type { PaginationParams } from "@/http/types";
import { HTTPException } from "hono/http-exception";

const patientRepository = new DrizzlePatientRepository();

export class PatientService {
	async getAll(params: PaginationParams) {
		return patientRepository.findAll(params);
	}

	async getById(id: string) {
		const patient = await patientRepository.findById(id);
		if (!patient) {
			throw new HTTPException(404, { message: "Patient not found" });
		}
		return patient;
	}

	async create(data: CreatePatientDTO) {
		// Logic: Check if CPF already exists?
		// Drizzle will throw unique constraint error.
		return patientRepository.create(data);
	}

	async update(id: string, data: UpdatePatientDTO) {
		const exists = await patientRepository.findById(id);
		if (!exists) {
			throw new HTTPException(404, { message: "Patient not found" });
		}
		return patientRepository.update(id, data);
	}

	async delete(id: string) {
		const exists = await patientRepository.findById(id);
		if (!exists) {
			throw new HTTPException(404, { message: "Patient not found" });
		}
		return patientRepository.delete(id);
	}
}

export const patientService = new PatientService();
