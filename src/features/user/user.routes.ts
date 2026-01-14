import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { authMiddleware } from "@/shared/middlewares/auth-middleware";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Variables } from "@/shared/types";

const userRoutes = new Hono<{ Variables: Variables }>();

userRoutes.use("*", authMiddleware);

userRoutes.patch("/me", describeRoute({
	description: "Update current user profile",
}), async (c) => {
	const sessionUser = c.get("user");
	const body = await c.req.json();

	if (!sessionUser) return c.json({ error: "Unauthorized" }, 401);

	const updateData: Partial<typeof user.$inferInsert> = {};
	if (body.name) updateData.name = body.name;

	// Add more fields if needed

	if (Object.keys(updateData).length > 0) {
		await db.update(user).set(updateData).where(eq(user.id, sessionUser.id));
	}

	return c.json({ success: true });
});

export default userRoutes;
