import { Hono } from "hono";

import { Scalar } from "@scalar/hono-api-reference";
import { openAPIRouteHandler } from "hono-openapi";
import { env } from "@/env";
import configRoutes from "./config/config.routes";
import userRoutes from "./user/user.routes";
import appointmentRoutes from "./appointment/appointment.routes";
import patientRoutes from "./patient/patient.routes";
import professionalRoutes from "./professional/professional.routes";

export const feature_routes = new Hono();

// Define public routes (Scalar and OpenAPI) BEFORE protected routes
feature_routes
    .get("/openapi",
        openAPIRouteHandler(feature_routes, {
            documentation: {
                info: {
                    title: "HONO API",
                    version: "0.0.0",
                    description: "hono API",
                },
                servers: [
                    {
                        url: env?.API_BASE_URL || "", // Provide default empty string
                        description: "Local server",
                    },
                ],
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: "http",
                            scheme: "bearer",
                            bearerFormat: "JWT",
                        },
                    },
                },
                security: [{ bearerAuth: [] }],
            },
        }))
    .get(
        "/",
        Scalar({
            theme: "purple",
            url: `${env?.API_BASE_URL || ""}/openapi`,
            baseServerURL: `${env?.API_BASE_URL || ""}/api`,
        })
    );

// Mount protected routes after public routes
feature_routes.route("/", configRoutes);
feature_routes.route("/", userRoutes);
feature_routes.route("/appointments", appointmentRoutes);
feature_routes.route("/patients", patientRoutes);
feature_routes.route("/professionals", professionalRoutes);
