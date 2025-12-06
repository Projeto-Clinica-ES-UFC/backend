import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";
import { agreement } from "./operational";

export const patient = sqliteTable("patient", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	cpf: text("cpf").unique(),
	dateOfBirth: text("date_of_birth"), // YYYY-MM-DD
	gender: text("gender"),
	phone: text("phone"),
	agreementId: text("agreement_id").references(() => agreement.id),
	address: text("address"),
	city: text("city"),
	responsibleName: text("responsible_name"),
	responsiblePhone: text("responsible_phone"),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const patientRelations = relations(patient, ({ one }) => ({
	agreement: one(agreement, {
		fields: [patient.agreementId],
		references: [agreement.id],
	}),
}));
