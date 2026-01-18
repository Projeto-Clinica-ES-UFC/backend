import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { authMiddleware } from "@/shared/middlewares/auth-middleware";
import { db } from "@/db";
import { user, account } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Variables } from "@/shared/types";


import { z } from "zod";

const userRoutes = new Hono<{ Variables: Variables }>();

userRoutes.use("*", authMiddleware);

// GET /users - List all users (admin only)
userRoutes.get("/users", describeRoute({
	description: "List all users (admin only)",
}), async (c) => {
	const sessionUser = c.get("user");
	if (!sessionUser) return c.json({ error: "Unauthorized" }, 401);

	// Check if user is admin
	const currentUser = await db.select().from(user).where(eq(user.id, sessionUser.id)).get();
	if (currentUser?.role !== 'Administrador') {
		return c.json({ error: "Forbidden: Admin access required" }, 403);
	}

	try {
		const users = await db.select({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		}).from(user);

		return c.json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		return c.json({ error: "Internal Server Error" }, 500);
	}
});

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

const updateUserSchema = z.object({
	name: z.string().min(2).max(100).optional(),
	email: z.string().email().optional(),
	password: z.string().optional(), // No validation rules as requested
	role: z.enum(["Administrador", "Recepcionista", "Profissional"]).optional(),
});

// PATCH /users/:id - Update user by ID (admin only, or self-update)
userRoutes.patch("/users/:id", describeRoute({
	description: "Update user by ID (admin only)",
}), async (c) => {
	const sessionUser = c.get("user");
	const userId = c.req.param("id");
	const body = await c.req.json();

	if (!sessionUser) return c.json({ error: "Unauthorized" }, 401);

	// Check if user is admin or updating themselves
	const currentUser = await db.select().from(user).where(eq(user.id, sessionUser.id)).get();
	const isSelfUpdate = sessionUser.id === userId;
	const isAdmin = currentUser?.role === 'Administrador';

	if (!isAdmin && !isSelfUpdate) {
		return c.json({ error: "Forbidden: Admin access required" }, 403);
	}

	const validation = updateUserSchema.safeParse(body);
	if (!validation.success) {
		return c.json({ error: "Validation failed", details: validation.error.format() }, 400);
	}
	const validatedBody = validation.data;

	try {
		// Check if target user exists
		const targetUser = await db.select().from(user).where(eq(user.id, userId)).get();
		if (!targetUser) {
			return c.json({ error: "User not found" }, 404);
		}

		// 1. Handle Profile Data Update via DB (Name, Email, etc.)
		const updateData: Partial<typeof user.$inferInsert> = {};
		if (validatedBody.name) updateData.name = validatedBody.name;

		if (validatedBody.email && validatedBody.email !== targetUser.email) {
			// Check if email is already taken
			const existingUser = await db.select().from(user).where(eq(user.email, validatedBody.email)).get();
			if (existingUser) {
				return c.json({ error: "Email already in use" }, 409);
			}
			updateData.email = validatedBody.email;
		}

		// Role can only be updated by admins
		if (validatedBody.role && isAdmin) {
			updateData.role = validatedBody.role;
		}

		if (Object.keys(updateData).length > 0) {
			await db.update(user).set(updateData).where(eq(user.id, userId));
		}

		// 2. Handle Password Update (Manual, No Hashing)
		if (validatedBody.password) {
			// Update password in 'account' table directly
			await db.update(account)
				.set({ password: validatedBody.password })
				.where(eq(account.userId, userId));
		}

		return c.json({ success: true });
	} catch (error) {
		console.error("Error updating user:", error);
		return c.json({ error: "Internal Server Error" }, 500);
	}
});

// DELETE /users/:id - Delete user by ID (admin only)
userRoutes.delete("/users/:id", describeRoute({
	description: "Delete user by ID (admin only)",
}), async (c) => {
	const sessionUser = c.get("user");
	const userId = c.req.param("id");

	if (!sessionUser) return c.json({ error: "Unauthorized" }, 401);

	// Check if user is admin
	const currentUser = await db.select().from(user).where(eq(user.id, sessionUser.id)).get();
	if (currentUser?.role !== 'Administrador') {
		return c.json({ error: "Forbidden: Admin access required" }, 403);
	}

	// Prevent self-deletion
	if (sessionUser.id === userId) {
		return c.json({ error: "Cannot delete your own account" }, 400);
	}

	try {
		// Check if target user exists
		const targetUser = await db.select().from(user).where(eq(user.id, userId)).get();
		if (!targetUser) {
			return c.json({ error: "User not found" }, 404);
		}

		// Delete user (cascades to accounts and sessions via DB schema)
		await db.delete(user).where(eq(user.id, userId));

		return c.json({ success: true });
	} catch (error) {
		console.error("Error deleting user:", error);
		return c.json({ error: "Internal Server Error" }, 500);
	}
});

export default userRoutes;
