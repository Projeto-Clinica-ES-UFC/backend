import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";
import { professional } from "./professionals";
import { patient } from "./patients";

export const appointment = sqliteTable("appointment", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	professionalId: integer("professional_id").notNull().references(() => professional.id),
	patientId: integer("patient_id").notNull().references(() => patient.id),
	start: integer("start", { mode: "timestamp_ms" }).notNull(),
	end: integer("end", { mode: "timestamp_ms" }).notNull(),
	status: text("status", { enum: ["Pendente", "Confirmado", "Realizado", "Cancelado"] })
		.default("Pendente")
		.notNull(),
	unimedPending: integer("unimed_pending", { mode: "boolean" }).default(false),
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
}));

