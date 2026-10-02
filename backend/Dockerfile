# ─── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# ─── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -S palvii && adduser -S palvii -G palvii

COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Create uploads directory
RUN mkdir -p uploads && chown -R palvii:palvii /app

USER palvii

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
