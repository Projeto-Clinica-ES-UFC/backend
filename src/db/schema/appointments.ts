import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";
import { professional } from "./professionals";
import { patient } from "./patients";
import { user } from "./auth";

export const appointment = sqliteTable("appointment", {
	id: text("id").primaryKey(),
	professionalId: text("professional_id").notNull().references(() => professional.id),
	patientId: text("patient_id").notNull().references(() => patient.id),
	start: integer("start", { mode: "timestamp_ms" }).notNull(),
	end: integer("end", { mode: "timestamp_ms" }).notNull(),
	title: text("title"),
	description: text("description"),
	status: text("status", { enum: ["Scheduled", "Confirmed", "InService", "Finished", "Canceled", "Missed"] })
		.default("Scheduled")
		.notNull(),
	location: text("location"),
	createdById: text("created_by_id").references(() => user.id),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const appointmentRelations = relations(appointment, ({ one }) => ({
	professional: one(professional, {
		fields: [appointment.professionalId],
		references: [professional.id],
	}),
	patient: one(patient, {
		fields: [appointment.patientId],
		references: [patient.id],
	}),
	createdBy: one(user, {
		fields: [appointment.createdById],
		references: [user.id],
	}),
}));
