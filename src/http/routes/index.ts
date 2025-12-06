import {Hono} from "hono";

import {Scalar} from "@scalar/hono-api-reference";
import {openAPIRouteHandler} from "hono-openapi";
import {ENV} from "@/http/env";
import configRoutes from "./config.routes";
import reportRoutes from "./report.routes";
import userRoutes from "./user.routes";

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
            url: ENV.API_BASE_URL,
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
      url: `${ENV.API_BASE_URL}/openapi`,
      baseServerURL: `${ENV.API_BASE_URL}/api`,
    })
  );

// Mount protected routes after public routes
http_routes.route("/", configRoutes);
http_routes.route("/reports", reportRoutes);
http_routes.route("/", userRoutes);
