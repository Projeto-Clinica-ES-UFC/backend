import {Hono} from "hono";

import {Scalar} from "@scalar/hono-api-reference";
import {openAPIRouteHandler} from "hono-openapi";
import {env} from "@/env";
import configRoutes from "./config.routes";
import reportRoutes from "./report.routes";
import userRoutes from "./user.routes";
import agreementRoutes from "./agreement.routes";
import appointmentRoutes from "./appointment.routes";
import patientRoutes from "./patient.routes";
import professionalRoutes from "./professional.routes";
import taskRoutes from "./task.routes";

export const http_routes = new Hono();

// Define public routes (Scalar and OpenAPI) BEFORE protected routes
http_routes
  .get("/openapi",
    openAPIRouteHandler(http_routes, {
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
        security: [{bearerAuth: []}],
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
http_routes.route("/", configRoutes);
http_routes.route("/reports", reportRoutes);
http_routes.route("/", userRoutes);
http_routes.route("/agreements", agreementRoutes);
http_routes.route("/appointments", appointmentRoutes);
http_routes.route("/patients", patientRoutes);
http_routes.route("/professionals", professionalRoutes);
http_routes.route("/tasks", taskRoutes);
