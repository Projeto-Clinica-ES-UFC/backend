import { DrizzleConfigRepository } from "@/http/repository/drizzle/config.repository";
import { DrizzleSpecialtyRepository } from "@/http/repository/drizzle/specialty.repository";

const configRepo = new DrizzleConfigRepository();
const specialtyRepo = new DrizzleSpecialtyRepository();

export class ConfigService {
	async getConfig() {
		return configRepo.getAll();
	}

	async updateConfig(data: Record<string, unknown>) {
		return configRepo.update(data);
	}

	async getSpecialties() {
		return specialtyRepo.findAll();
	}

	async createSpecialty(name: string) {
		return specialtyRepo.create(name);
	}

	async deleteSpecialty(id: string) {
		return specialtyRepo.delete(id);
	}
}

export const configService = new ConfigService();
