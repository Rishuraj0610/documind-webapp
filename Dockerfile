# ==========================================================
# 1. BUILD STAGE
# ==========================================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies needed for building)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the client static files and the backend bundle
RUN npm run build

# ==========================================================
# 2. RUNNER STAGE
# ==========================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package files to install production dependencies
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy compiled assets and server bundle from build stage
COPY --from=builder /app/dist ./dist

# Copy local JSON database file as seed (if exists in workspace)
COPY --from=builder /app/indexed_db.json* ./

# Expose the application port
EXPOSE 3000

# Run the backend server
CMD ["node", "dist/server.cjs"]
