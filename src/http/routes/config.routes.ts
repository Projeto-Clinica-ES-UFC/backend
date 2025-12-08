import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { configService } from "@/http/services/config.service";
import { authMiddleware } from "@/http/middlewares/auth-middleware";

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

configRoutes.get("/specialties", describeRoute({
	description: "Get specialties",
}), async (c) => {
	const res = await configService.getSpecialties();
	return c.json(res);
});

configRoutes.post("/specialties", describeRoute({
	description: "Create specialty",
}), async (c) => {
	const body = await c.req.json();
	const res = await configService.createSpecialty(body.name);
	return c.json(res, 201);
});

configRoutes.delete("/specialties/:id", describeRoute({
	description: "Delete specialty",
}), async (c) => {
	const id = c.req.param("id");
	await configService.deleteSpecialty(id);
	return c.body(null, 204);
});

export default configRoutes;
