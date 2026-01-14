import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { configService } from "./config.service";
import { authMiddleware } from "@/shared/middlewares/auth-middleware";

const configRoutes = new Hono();

configRoutes.use("*", authMiddleware);

configRoutes.get("/config", describeRoute({
	description: "Get configuration",
}), async (c) => {
	const res = await configService.getConfig();
	return c.json(res);
});

configRoutes.patch("/config", describeRoute({
	description: "Update configuration",
}), async (c) => {
	const body = await c.req.json();
	await configService.updateConfig(body);
	return c.json({ success: true });
});

export default configRoutes;

