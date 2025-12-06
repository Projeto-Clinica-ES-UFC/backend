import type { agreement } from "@/db/schema";
import type { CreateAgreementDTO, UpdateAgreementDTO } from "@/http/dto/agreement.dto";
import type { PaginatedResult, PaginationParams } from "@/http/types";

export type Agreement = typeof agreement.$inferSelect;

export interface IAgreementRepository {
	findAll(params: PaginationParams): Promise<PaginatedResult<Agreement>>;
	findById(id: string): Promise<Agreement | null>;
	create(data: CreateAgreementDTO): Promise<Agreement>;
	update(id: string, data: UpdateAgreementDTO): Promise<Agreement | null>;
	delete(id: string): Promise<void>;
}
