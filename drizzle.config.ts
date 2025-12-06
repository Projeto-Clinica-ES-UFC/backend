import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
	path: ".env",
});

export default defineConfig({
	schema: "./src/db/schema",
	out: "./src/db/migrations",
	dialect: "sqlite",
	dbCredentials: {
		url: process.env.DATABASE_URL || "file:./local.db",
	},
});
