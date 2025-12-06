import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";
import { user } from "./auth";
import { specialty } from "./operational";

export const professional = sqliteTable("professional", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id).unique(),
	name: text("name").notNull(),
	professionalRegistration: text("professional_registration"),
	phone: text("phone"),
	scheduleConfig: text("schedule_config", { mode: "json" }), // JSON: { standardHours: ..., slotDuration: ... }
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const professionalSpecialty = sqliteTable("professional_specialty", {
	professionalId: text("professional_id").notNull().references(() => professional.id),
	specialtyId: text("specialty_id").notNull().references(() => specialty.id),
}, (t) => ({
	pk: primaryKey({ columns: [t.professionalId, t.specialtyId] }),
}));

export const professionalRelations = relations(professional, ({ one, many }) => ({
	user: one(user, {
		fields: [professional.userId],
		references: [user.id],
	}),
	specialties: many(professionalSpecialty),
}));

export const professionalSpecialtyRelations = relations(professionalSpecialty, ({ one }) => ({
	professional: one(professional, {
		fields: [professionalSpecialty.professionalId],
		references: [professional.id],
	}),
	specialty: one(specialty, {
		fields: [professionalSpecialty.specialtyId],
		references: [specialty.id],
	}),
}));
