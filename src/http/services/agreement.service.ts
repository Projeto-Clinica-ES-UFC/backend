import { DrizzleAgreementRepository } from "@/http/repository/drizzle/agreement.repository";
import type { CreateAgreementDTO, UpdateAgreementDTO } from "@/http/dto/agreement.dto";
import type { PaginationParams } from "@/http/types";
import { HTTPException } from "hono/http-exception";

const agreementRepository = new DrizzleAgreementRepository();

export class AgreementService {
	async getAll(params: PaginationParams) {
		return agreementRepository.findAll(params);
	}

	async getById(id: number) {
		const agreement = await agreementRepository.findById(id);
		if (!agreement) {
			throw new HTTPException(404, { message: "Agreement not found" });
		}
		return agreement;
	}

	async create(data: CreateAgreementDTO) {
		return agreementRepository.create(data);
	}

	async update(id: number, data: UpdateAgreementDTO) {
		const exists = await agreementRepository.findById(id);
		if (!exists) {
			throw new HTTPException(404, { message: "Agreement not found" });
		}
		return agreementRepository.update(id, data);
	}

	async delete(id: number) {
		const exists = await agreementRepository.findById(id);
		if (!exists) {
			throw new HTTPException(404, { message: "Agreement not found" });
		}
		return agreementRepository.delete(id);
	}
}

export const agreementService = new AgreementService();