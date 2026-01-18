/**
 * Test utilities and setup for Hono API testing
 * Creates test-specific routes that bypass auth middleware
 */

import { Hono } from "hono";
import { patientService } from "@/features/patient/patient.service";
import { professionalService } from "@/features/professional/professional.service";
import { appointmentService } from "@/features/appointment/appointment.service";
import { createPatientSchema } from "@/features/patient/patient.dto";
import { createProfessionalSchema } from "@/features/professional/professional.dto";
import { createAppointmentSchema } from "@/features/appointment/appointment.dto";
import type { Variables } from "@/shared/types";

type TestEnv = { Variables: Variables };

/**
 * Create a test app instance with routes that bypass auth middleware
 * This creates simplified routes that only test the core logic
 */
export function create_test_app(): Hono<TestEnv> {
    const app = new Hono<TestEnv>();

    // Mock user context for routes that need it
    app.use("*", async (c, next) => {
        const now = new Date();
        c.set("user", {
            id: "test-user-id",
            name: "Test User",
            email: "test@example.com",
            emailVerified: true,
            createdAt: now,
            updatedAt: now,
            image: null,
            role: "admin",
        });
        c.set("session", {
            id: "test-session-id",
            userId: "test-user-id",
            expiresAt: new Date(Date.now() + 1000 * 60 * 60),
            createdAt: now,
            updatedAt: now,
            token: "test-token",
            ipAddress: null,
            userAgent: null,
        });
        await next();
    });

    // Patient routes (without auth middleware)
    app.post("/patients", async (c) => {
        try {
            const body = await c.req.json();
            const validated = createPatientSchema.parse(body);
            const result = await patientService.create(validated);
            return c.json(result, 201);
        } catch (error) {
            if (error instanceof Error && error.name === "ZodError") {
                return c.json({ error: "Validation error", details: error }, 400);
            }
            throw error;
        }
    });

    // Professional routes (without auth middleware)
    app.post("/professionals", async (c) => {
        try {
            const body = await c.req.json();
            const validated = createProfessionalSchema.parse(body);
            const result = await professionalService.create(validated);
            return c.json(result, 201);
        } catch (error) {
            if (error instanceof Error && error.name === "ZodError") {
                return c.json({ error: "Validation error", details: error }, 400);
            }
            throw error;
        }
    });

    // Appointment routes (without auth middleware)
    app.post("/appointments", async (c) => {
        try {
            const body = await c.req.json();
            const validated = createAppointmentSchema.parse(body);
            const result = await appointmentService.create(validated);
            return c.json(result, 201);
        } catch (error) {
            if (error instanceof Error && error.name === "ZodError") {
                return c.json({ error: "Validation error", details: error }, 400);
            }
            throw error;
        }
    });

    return app;
}

/**
 * Helper to make JSON requests
 */
export async function make_request(
    app: Hono<TestEnv>,
    method: "GET" | "POST" | "PATCH" | "DELETE",
    path: string,
    body?: unknown
) {
    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    return app.request(path, options);
}
