import { Hono } from "hono";

import { Scalar } from "@scalar/hono-api-reference";
import { describeRoute, openAPIRouteHandler } from "hono-openapi";

import { env } from "@/env";

export const httpRoutes = new Hono().basePath("/api");

httpRoutes
  .get(
    "/openapi",
    openAPIRouteHandler(httpRoutes, {
      documentation: {
        info: {
          title: "HONO API",
          version: "0.0.0",
          description: "hono API",
        },
        servers: [
          {
            url: env.API_BASE_URL,
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
    })
  )
  .get(
    "/reference",
    Scalar({
      theme: "purple",
      url: `${env.API_BASE_URL}/api/openapi`,
      baseServerURL: `${env.API_BASE_URL}/api`,
    })
  )
  .get(
    "/",
    describeRoute({
      tags: ["Base"],
    }),
    c => c.text("Olái mundo!")
  );
