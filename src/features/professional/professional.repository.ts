import type { professional } from "@/db/schema";
import type { UpdateProfessionalDTO } from "@/http/dto/professional.dto";
import type { PaginatedResult, PaginationParams } from "@/http/types"; // Import PaginatedResult and PaginationParams

export type Professional = typeof professional.$inferSelect;

export interface IProfessionalRepository {
	findAll(params: PaginationParams): Promise<PaginatedResult<Professional>>; // Added back
	findById(id: number): Promise<Professional | null>; // Added back
	findByUserId(userId: string): Promise<Professional | null>; // Added back
	update(id: number, data: UpdateProfessionalDTO): Promise<Professional | null>;
    create(data: { name: string; email: string; specialty?: string }): Promise<Professional>;
	delete(id: number): Promise<Professional | null>;
}
