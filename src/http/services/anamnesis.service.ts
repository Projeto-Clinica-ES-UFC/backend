import { DrizzleAnamnesisRepository } from "@/http/repository/drizzle/anamnesis.repository";
import type { UpsertAnamnesisDTO } from "@/http/dto/anamnesis.dto";

const anamnesisRepository = new DrizzleAnamnesisRepository();

export class AnamnesisService {
	async getLatest(patientId: string) {
		return anamnesisRepository.findLatestByPatientId(patientId);
	}

	async create(patientId: string, data: UpsertAnamnesisDTO) {
		return anamnesisRepository.create(patientId, data);
	}

	async getHistory(patientId: string) {
		return anamnesisRepository.findHistory(patientId);
	}
}

export const anamnesisService = new AnamnesisService();
