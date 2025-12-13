import { DrizzleProfessionalRepository } from "@/http/repository/drizzle/professional.repository";
import type { UpdateProfessionalDTO, CreateProfessionalDTO } from "@/http/dto/professional.dto";
import type { PaginationParams } from "@/http/types";
import { HTTPException } from "hono/http-exception";

const professionalRepository = new DrizzleProfessionalRepository();

export class ProfessionalService {
	async getAll(params: PaginationParams) {
		return professionalRepository.findAll(params);
	}

	async getById(id: number) {
		const professional = await professionalRepository.findById(id);
		if (!professional) {
			throw new HTTPException(404, { message: "Professional not found" });
		}
		return professional;
	}

	async create(data: CreateProfessionalDTO) {
        // We pass everything to the repo to handle the transaction of creating User + Professional
		return professionalRepository.create(data);
	}

	async update(id: number, data: UpdateProfessionalDTO) {
		const exists = await professionalRepository.findById(id);
		if (!exists) {
			throw new HTTPException(404, { message: "Professional not found" });
		}
		return professionalRepository.update(id, data);
	}

	async delete(id: number) {
		const professional = await professionalRepository.findById(id);
		if (!professional) {
			throw new HTTPException(404, { message: "Professional not found" });
		}
		return professionalRepository.delete(id);
	}
}

export const professionalService = new ProfessionalService();