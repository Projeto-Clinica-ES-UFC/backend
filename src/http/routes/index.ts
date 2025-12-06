import {Hono} from "hono";

import {Scalar} from "@scalar/hono-api-reference";
import {describeRoute, openAPIRouteHandler} from "hono-openapi";
import {env} from "@/env";


export const httpRoutes = new Hono();

httpRoutes.basePath("/api")
  .get(
    "/health",
    describeRoute({
      tags: ["System"],
      summary: "Health check",
      description: "Returns service health information.",
      security: [],
      responses: {
        200: {
          description: "Service is healthy",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {type: "string", example: "ok"},
                  uptime: {type: "number", description: "Uptime in seconds"}
                },
                required: ["status", "uptime"]
              }
            }
          }
        }
      }
    }),
    (c) => c.json({status: "ok", uptime: process.uptime()})
  );

httpRoutes
  .get("/openapi",
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
        security: [{bearerAuth: []}],
      },
    }))
  .get(
    "/",
    Scalar({
      theme: "purple",
      url: `${env.API_BASE_URL}/openapi`,
      baseServerURL: `${env.API_BASE_URL}/api`,
    })
  );
