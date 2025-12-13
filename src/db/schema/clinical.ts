import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";
import { patient } from "./patients";
import { user } from "./auth";

export const medicalRecord = sqliteTable("medical_record", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	patientId: integer("patient_id").notNull().references(() => patient.id),
	date: integer("date", { mode: "timestamp_ms" }).notNull(),
	type: text("type", { enum: ["Consultation", "Evaluation", "Attachment", "Observation"] }).notNull(),
	title: text("title").notNull(),
	description: text("description"),
	attachmentUrl: text("attachment_url"),
	attachmentName: text("attachment_name"),
	createdById: text("created_by_id").references(() => user.id),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
});

export const anamnesis = sqliteTable("anamnesis", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	patientId: integer("patient_id").notNull().references(() => patient.id),
	data: text("data", { mode: "json" }).notNull(), // Stores all form fields
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
});

export const medicalRecordRelations = relations(medicalRecord, ({ one }) => ({
	patient: one(patient, {
		fields: [medicalRecord.patientId],
		references: [patient.id],
	}),
	createdBy: one(user, {
		fields: [medicalRecord.createdById],
		references: [user.id],
	}),
}));

export const anamnesisRelations = relations(anamnesis, ({ one }) => ({
	patient: one(patient, {
		fields: [anamnesis.patientId],
		references: [patient.id],
	}),
}));
