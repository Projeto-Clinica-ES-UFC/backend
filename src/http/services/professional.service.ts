import { DrizzleProfessionalRepository } from "@/http/repository/drizzle/professional.repository";
import type { UpdateProfessionalDTO } from "@/http/dto/professional.dto";
import type { PaginationParams } from "@/http/types";
import { HTTPException } from "hono/http-exception";

const professionalRepository = new DrizzleProfessionalRepository();

export class ProfessionalService {
	async getAll(params: PaginationParams) {
		return professionalRepository.findAll(params);
	}

	async getById(id: string) {
		const professional = await professionalRepository.findById(id);
		if (!professional) {
			throw new HTTPException(404, { message: "Professional not found" });
		}
		return professional;
	}

	async update(id: string, data: UpdateProfessionalDTO) {
		const exists = await professionalRepository.findById(id);
		if (!exists) {
			throw new HTTPException(404, { message: "Professional not found" });
		}
		return professionalRepository.update(id, data);
	}

	async delete(id: string) {
		const professional = await professionalRepository.findById(id);
		if (!professional) {
			throw new HTTPException(404, { message: "Professional not found" });
		}
		return professionalRepository.delete(id);
	}
}

export const professionalService = new ProfessionalService();
