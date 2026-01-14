import type { professional } from "@/db/schema";
import type { UpdateProfessionalDTO } from "./professional.dto";
import type { PaginatedResult, PaginationParams } from "@/shared/types";

export type Professional = typeof professional.$inferSelect;

export interface IProfessionalRepository {
	findAll(params: PaginationParams): Promise<PaginatedResult<Professional>>;
	findById(id: number): Promise<Professional | null>;
	update(id: number, data: UpdateProfessionalDTO): Promise<Professional | null>;
	create(data: { name: string; email: string; specialty?: string }): Promise<Professional>;
	delete(id: number): Promise<Professional | null>;
}
