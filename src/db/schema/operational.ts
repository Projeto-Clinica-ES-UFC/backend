import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";
import { user } from "./auth";

export const specialty = sqliteTable("specialty", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
});

export const agreement = sqliteTable("agreement", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	cnpj: text("cnpj"),
	ansRegistration: text("ans_registration"),
	active: integer("active", { mode: "boolean" }).default(true).notNull(),
});

export const task = sqliteTable("task", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	description: text("description"),
	status: text("status", { enum: ["Pending", "Completed", "Canceled"] })
		.default("Pending")
		.notNull(),
	assignedToUserId: text("assigned_to_user_id").references(() => user.id),
	dueDate: integer("due_date", { mode: "timestamp_ms" }),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const configuration = sqliteTable("configuration", {
	key: text("key").primaryKey(),
	value: text("value").notNull(), // JSON string or simple value
});

export const taskRelations = relations(task, ({ one }) => ({
	assignedTo: one(user, {
		fields: [task.assignedToUserId],
		references: [user.id],
	}),
}));
