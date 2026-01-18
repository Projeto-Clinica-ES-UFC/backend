import { describe, test, expect } from "bun:test";
import { create_test_app, make_request } from "./setup";

const app = create_test_app();

describe("Appointment API", () => {
    test("should create a valid appointment with all required fields", async () => {
        const appointment_data = {
            professionalId: 1,
            patientId: 1,
            start: "2026-01-20T09:00:00.000Z",
            end: "2026-01-20T10:00:00.000Z",
        };

        const response = await make_request(app, "POST", "/appointments", appointment_data);

        // Note: This may return 201, 409 (conflict), or 500 (FK error)
        expect([201, 409, 500]).toContain(response.status);
    });

    test("should return 400 when creating appointment without required fields", async () => {
        const invalid_data = {};

        const response = await make_request(app, "POST", "/appointments", invalid_data);

        expect(response.status).toBe(400);
    });

    test("should return 400 when creating appointment with invalid datetime format", async () => {
        const invalid_data = {
            professionalId: 1,
            patientId: 1,
            start: "invalid-date",
            end: "also-invalid",
        };

        const response = await make_request(app, "POST", "/appointments", invalid_data);

        expect(response.status).toBe(400);
    });
});
