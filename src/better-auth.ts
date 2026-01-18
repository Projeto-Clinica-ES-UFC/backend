import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { db } from "./db";
import * as schema from "./db/schema/auth";
import { env } from "./env";


async function customHash(password: string): Promise<string> {
	return password;
}

async function customVerify({ hash, password }: { hash: string; password: string }): Promise<boolean> {
	return hash === password;
}

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
		schema: schema,
	}),
	baseURL: `${env?.API_BASE_URL}/api/auth`,
	trustedOrigins: ["*"],
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: false,
				defaultValue: "Profissional",
				input: false, // Don't allow user to set their own role during sign-up
			},
		},
	},
	emailAndPassword: {
		enabled: true,
		password: {
			hash: customHash, // Use your custom hash function
			verify: customVerify, // Use your custom verify function
		},
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "lax",
			secure: false, // Set to false for local development (http)
			httpOnly: true,
		},
	},
	plugins: [openAPI()],
});
