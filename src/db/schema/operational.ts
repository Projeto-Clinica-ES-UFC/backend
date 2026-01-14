import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const configuration = sqliteTable("configuration", {
	key: text("key").primaryKey(),
	value: text("value").notNull(), // JSON string or simple value
});

