import { db } from "@/db";
import { appointment } from "@/db/schema";
import type { IAppointmentRepository, Appointment, AppointmentFilterParams } from "../appointment.repository";
import type { CreateAppointmentDTO, UpdateAppointmentDTO } from "@/http/dto/appointment.dto";
import type { PaginatedResult } from "@/http/types";
import { eq, like, count, desc, and, gte, lte, lt, gt, ne, inArray } from "drizzle-orm";

export class DrizzleAppointmentRepository implements IAppointmentRepository {
	async findAll(params: AppointmentFilterParams): Promise<PaginatedResult<Appointment>> {
		const { page, limit, q, professionalId, patientId, startDate, endDate, status } = params;
		const offset = (page - 1) * limit;

		const conditions = [];
		if (q) conditions.push(like(appointment.title, `%${q}%`));
		if (professionalId) conditions.push(eq(appointment.professionalId, professionalId));
		if (patientId) conditions.push(eq(appointment.patientId, patientId));
		if (startDate) conditions.push(gte(appointment.start, new Date(startDate)));
		if (endDate) conditions.push(lte(appointment.end, new Date(endDate)));
		if (status && status.length > 0) conditions.push(inArray(appointment.status, status));

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

		const [totalResult] = await db.select({ count: count() }).from(appointment).where(whereClause);
		const total = totalResult.count;

		const data = await db
			.select()
			.from(appointment)
			.where(whereClause)
			.limit(limit)
			.offset(offset)
			.orderBy(desc(appointment.start));

		return {
			data,
			meta: { page, limit, total },
		};
	}

	async findById(id: string): Promise<Appointment | null> {
		const [result] = await db.select().from(appointment).where(eq(appointment.id, id));
		return result || null;
	}

	async create(data: CreateAppointmentDTO & { createdById?: string }): Promise<Appointment> {
		const id = crypto.randomUUID();
		const [result] = await db
			.insert(appointment)
			.values({
				...data,
				id,
				start: new Date(data.start),
				end: new Date(data.end),
			})
			.returning();
		return result;
	}

	async update(id: string, data: UpdateAppointmentDTO): Promise<Appointment | null> {
		const updateData: Partial<typeof appointment.$inferInsert> = { ...data };
		if (data.start) updateData.start = new Date(data.start);
		if (data.end) updateData.end = new Date(data.end);

		const [result] = await db
			.update(appointment)
			.set(updateData)
			.where(eq(appointment.id, id))
			.returning();
		return result || null;
	}

	async delete(id: string): Promise<void> {
		await db.delete(appointment).where(eq(appointment.id, id));
	}

	async findOverlaps(professionalId: string, start: Date, end: Date, excludeId?: string): Promise<Appointment[]> {
		const conditions = [
			eq(appointment.professionalId, professionalId),
			lt(appointment.start, end),
			gt(appointment.end, start),
			ne(appointment.status, "Canceled"),
		];

		if (excludeId) {
			conditions.push(ne(appointment.id, excludeId));
		}

		return db.select().from(appointment).where(and(...conditions));
	}
}
