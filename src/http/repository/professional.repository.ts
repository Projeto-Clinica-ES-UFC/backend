import type { professional } from "@/db/schema";
import type { UpdateProfessionalDTO } from "@/http/dto/professional.dto";
import type { PaginatedResult, PaginationParams } from "@/http/types";

export type Professional = typeof professional.$inferSelect;

export interface IProfessionalRepository {
	findAll(params: PaginationParams): Promise<PaginatedResult<Professional>>;
	findById(id: string): Promise<Professional | null>;
	findByUserId(userId: string): Promise<Professional | null>;
	update(id: string, data: UpdateProfessionalDTO): Promise<Professional | null>;
    // create might be needed if we manually create professionals from existing users
    create(data: { userId: string; name: string }): Promise<Professional>;
}
