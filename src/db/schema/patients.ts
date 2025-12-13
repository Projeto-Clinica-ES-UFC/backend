import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const patient = sqliteTable("patient", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	cpf: text("cpf").unique(),
	dateOfBirth: text("date_of_birth"), // YYYY-MM-DD
	responsibleName: text("responsible_name"),
	responsiblePhone: text("responsible_phone"),
	status: text("status", { enum: ["Agendado", "Em Atendimento", "Finalizado", "Cancelado"] })
		.default("Agendado"),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

