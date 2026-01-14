import { DrizzleConfigRepository } from "./config.repository.drizzle";

const configRepo = new DrizzleConfigRepository();

export class ConfigService {
	async getConfig() {
		return configRepo.getAll();
	}

	async updateConfig(data: Record<string, unknown>) {
		return configRepo.update(data);
	}
}

export const configService = new ConfigService();

