import { Hono } from "hono";
import { reportService } from "@/http/services/report.service";
import { authMiddleware } from "@/http/middlewares/auth-middleware";

const reportRoutes = new Hono();

reportRoutes.use("*", authMiddleware);

reportRoutes.get("/today", async (c) => {
	const res = await reportService.getTodaySummary();
	return c.json(res);
});

reportRoutes.get("/upcoming-appointments", async (c) => {
	const res = await reportService.getUpcomingAppointments();
	return c.json(res);
});

reportRoutes.get("/goals", async (c) => {
	return c.json({ message: "Goals not implemented yet, check config" });
});

export default reportRoutes;
