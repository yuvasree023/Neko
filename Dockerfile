# Multi-stage Dockerfile for Google Cloud Run deployment
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package definitions
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build frontend and server
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm ci --only=production

# Copy built frontend assets and compiled server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

EXPOSE 8080

CMD ["npx", "tsx", "server/index.ts"]
