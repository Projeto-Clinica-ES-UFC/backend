import { DrizzleAnamnesisRepository } from "./anamnesis.repository.drizzle";
import type { UpsertAnamnesisDTO } from "./anamnesis.dto";

const anamnesisRepository = new DrizzleAnamnesisRepository();

export class AnamnesisService {
	async getLatest(patientId: number) {
		return anamnesisRepository.findLatestByPatientId(patientId);
	}

	async create(patientId: number, data: UpsertAnamnesisDTO) {
		return anamnesisRepository.create(patientId, data);
	}

	async getHistory(patientId: number) {
		return anamnesisRepository.findHistory(patientId);
	}
}

export const anamnesisService = new AnamnesisService();