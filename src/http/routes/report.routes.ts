import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { reportService } from "@/http/services/report.service";
import { authMiddleware } from "@/http/middlewares/auth-middleware";
import type { Variables } from "@/http/types";

const reportRoutes = new Hono<{ Variables: Variables }>();

reportRoutes.use("*", authMiddleware);

reportRoutes.get("/today", describeRoute({
	description: "Get today's report summary",
}), async (c) => {
	const res = await reportService.getTodaySummary();
	return c.json(res);
});

reportRoutes.get("/upcoming-appointments", describeRoute({
	description: "Get upcoming appointments report",
}), async (c) => {
	const res = await reportService.getUpcomingAppointments();
	return c.json(res);
});

reportRoutes.get("/goals", describeRoute({
	description: "Get goals report",
}), async (c) => {
	return c.json({ message: "Goals not implemented yet, check config" });
});

export default reportRoutes;
