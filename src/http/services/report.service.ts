import { db } from "@/db";
import { appointment } from "@/db/schema";
import { count, eq, and, gte, lte, ne, asc } from "drizzle-orm";

export class ReportService {
// ...
// ...
			.orderBy(asc(appointment.start))
			.limit(10);
	}
}

export const reportService = new ReportService();
