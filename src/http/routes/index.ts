import {Hono} from "hono";

import {Scalar} from "@scalar/hono-api-reference";
import {describeRoute, openAPIRouteHandler} from "hono-openapi";
import {ENV} from "@/http/env";


export const http_routes = new Hono();

http_routes.basePath("/api")
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
