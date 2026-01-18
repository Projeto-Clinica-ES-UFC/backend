FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies based on lockfile
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Stage 2: Runner
FROM oven/bun:1 AS release
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./package.json

# Environment variables
ENV NODE_ENV=production
ENV API_PORT=3000

# Expose port
EXPOSE 3000

# Start command
CMD ["bun", "run", "dist/index.mjs"]
