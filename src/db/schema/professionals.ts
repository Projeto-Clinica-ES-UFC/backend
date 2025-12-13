import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";
import { user } from "./auth";

export const professional = sqliteTable("professional", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: text("user_id").notNull().references(() => user.id).unique(),
	name: text("name").notNull(),
    email: text("email"),
    specialty: text("specialty"),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const professionalRelations = relations(professional, ({ one }) => ({
	user: one(user, {
		fields: [professional.userId],
		references: [user.id],
	}),
}));

