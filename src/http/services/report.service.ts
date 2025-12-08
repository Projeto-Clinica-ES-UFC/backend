import { db } from "@/db";
import { appointment } from "@/db/schema";
import { count, and, gte, lte, asc } from "drizzle-orm";

export class ReportService {
	async getTodaySummary() {
		const startOfDay = new Date();
		startOfDay.setHours(0, 0, 0, 0);
		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999);

		const [total] = await db
			.select({ count: count() })
			.from(appointment)
			.where(and(gte(appointment.start, startOfDay), lte(appointment.start, endOfDay)));

        // We can add status breakdown here if needed
		return {
			totalAppointments: total?.count ?? 0,
            date: startOfDay.toISOString().split('T')[0]
		};
	}

	async getUpcomingAppointments() {
		const now = new Date();
		return db
			.select()
			.from(appointment)
			.where(gte(appointment.start, now))
			.orderBy(asc(appointment.start))
			.limit(10);
	}
}

export const reportService = new ReportService();