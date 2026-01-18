import { describe, test, expect } from "bun:test";
import { create_test_app, make_request } from "./setup";

const app = create_test_app();

// Use unique identifiers to avoid duplicate constraint errors
const unique_suffix = Date.now().toString();

describe("Patient API", () => {
    test("should create a valid patient with all fields", async () => {
        const patient_data = {
            name: `João Silva ${unique_suffix}`,
            cpf: unique_suffix.slice(-11).padStart(11, "0"), // Ensure 11 digits
            dateOfBirth: "1990-05-15",
            responsibleName: "Maria Silva",
            responsiblePhone: "11999999999",
            status: "Agendado",
        };

        const response = await make_request(app, "POST", "/patients", patient_data);

        expect(response.status).toBe(201);
        const body = (await response.json()) as { name: string; cpf: string };
        expect(body.name).toBe(patient_data.name);
        expect(body.cpf).toBe(patient_data.cpf);
    });

    test("should return 400 when creating patient without name", async () => {
        const invalid_data = {
            cpf: "12345678901",
            dateOfBirth: "1990-05-15",
        };

        const response = await make_request(app, "POST", "/patients", invalid_data);

        expect(response.status).toBe(400);
    });

    test("should return 400 when creating patient with CPF less than 11 characters", async () => {
        const invalid_data = {
            name: "João Silva",
            cpf: "12345", // Less than 11 chars
        };

        const response = await make_request(app, "POST", "/patients", invalid_data);

        expect(response.status).toBe(400);
    });
});
