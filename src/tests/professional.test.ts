import { describe, test, expect } from "bun:test";
import { create_test_app, make_request } from "./setup";

const app = create_test_app();

// Use unique identifiers to avoid duplicate constraint errors
const unique_suffix = Date.now().toString();

describe("Professional API", () => {
    test("should create a valid professional with all fields", async () => {
        const professional_data = {
            name: `Dr. Carlos Mendes ${unique_suffix}`,
            email: `carlos.mendes.${unique_suffix}@clinica.com`,
            specialty: "Cardiologia",
        };

        const response = await make_request(app, "POST", "/professionals", professional_data);

        expect(response.status).toBe(201);
        const body = (await response.json()) as { name: string; email: string };
        expect(body.name).toBe(professional_data.name);
        expect(body.email).toBe(professional_data.email);
    });

    test("should return 400 when creating professional without name", async () => {
        const invalid_data = {
            email: "invalid@clinica.com",
            specialty: "Pediatria",
        };

        const response = await make_request(app, "POST", "/professionals", invalid_data);

        expect(response.status).toBe(400);
    });

    test("should return 400 when creating professional with invalid email", async () => {
        const invalid_data = {
            name: "Dr. João Santos",
            email: "not-an-email",
            specialty: "Ortopedia",
        };

        const response = await make_request(app, "POST", "/professionals", invalid_data);

        expect(response.status).toBe(400);
    });
});
