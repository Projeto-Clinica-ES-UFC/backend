import {Hono} from "hono";

import {Scalar} from "@scalar/hono-api-reference";
import {describeRoute, openAPIRouteHandler} from "hono-openapi";

import {env} from "@/env";
import {CommentService} from "@/services/CommentService";
import {LlmService} from "@/services/LllmService";


export const httpRoutes = new Hono();
let llm_service = new LlmService("AIzaSyBNIPKHYJddhhrubcU49gQvqc5LAe5ZV0g");
let comment_service = new CommentService(llm_service);

httpRoutes.basePath("/api")
  .post(
    "/check_incivilibity",
    describeRoute({
      tags: ["Comments"],
      summary: "Analyze comment for incivility",
      description: "Evaluates text content for inappropriate or uncivil language using LLMs",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                comment: {
                  type: "string",
                  description: "Text content to be analyzed"
                }
              },
              required: ["comment"]
            }
          }
        }
      },
      responses: {
        200: {
          description: "Analysis completed successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  has_incivility: {
                    type: "boolean",
                    description: "Indicates presence of uncivil content"
                  }
                },
                required: ["has_incivility"]
              }
            }
          }
        },
        400: {
          description: "Invalid request parameters",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Required field 'comment' is missing"
                  }
                },
                required: ["error"]
              }
            }
          }
        },
        500: {
          description: "Server encountered an error while processing the request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Internal server error occurred"
                  }
                },
                required: ["error"]
              }
            }
          }
        }
      }
    }),
    async (ctx) => {
      try {
        const body = await ctx.req.json();
        if (!body.comment) {
          return ctx.json({error: "O campo 'comment' é obrigatório"}, 400);
        }
        const res = await comment_service.hasIncivility(body.comment);
        return ctx.json({has_incivility: res});
      } catch (error) {
        console.error(error);
        return ctx.json({error: "Erro interno do servidor"}, 500);
      }
    }
  )
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
