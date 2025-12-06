import { Hono } from "hono";
import { configService } from "@/http/services/config.service";
import { authMiddleware } from "@/http/middlewares/auth-middleware";

const configRoutes = new Hono();

configRoutes.use("*", authMiddleware);

configRoutes.get("/config", async (c) => {
	const res = await configService.getConfig();
	return c.json(res);
});

configRoutes.patch("/config", async (c) => {
	const body = await c.req.json();
	await configService.updateConfig(body);
	return c.json({ success: true });
});

configRoutes.get("/specialties", async (c) => {
	const res = await configService.getSpecialties();
	return c.json(res);
});

configRoutes.post("/specialties", async (c) => {
	const body = await c.req.json();
	const res = await configService.createSpecialty(body.name);
	return c.json(res, 201);
});

configRoutes.delete("/specialties/:id", async (c) => {
	const id = c.req.param("id");
	await configService.deleteSpecialty(id);
	return c.body(null, 204);
});

export default configRoutes;
