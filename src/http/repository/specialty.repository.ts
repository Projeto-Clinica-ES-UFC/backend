import type { specialty } from "@/db/schema";

export type Specialty = typeof specialty.$inferSelect;

export interface ISpecialtyRepository {
	findAll(): Promise<Specialty[]>;
	create(name: string): Promise<Specialty>;
	delete(id: string): Promise<void>;
}
