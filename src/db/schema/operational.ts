import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";
import { user } from "./auth";

export const specialty = sqliteTable("specialty", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
});

export const agreement = sqliteTable("agreement", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	discount: integer("discount").default(0),
});

export const task = sqliteTable("task", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	title: text("title").notNull(),
	description: text("description"),
	priority: text("priority", { enum: ["Baixa", "Média", "Alta"] }).default("Baixa"),
	done: integer("done", { mode: "boolean" }).default(false),
	assignedToId: integer("assigned_to_id"), // Assuming references professional or internal user mapping
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
    // If assignedToId refers to professional (int), I'd need to import professional.
    // If it refers to user (text), this schema is mismatch.
    // Given frontend sends number, I'll stick to integer column.
}));
