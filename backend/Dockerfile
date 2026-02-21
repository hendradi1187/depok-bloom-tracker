# ─────────────────────────────────────────
# Stage 1: Builder — install deps & compile TS
# ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps dulu (memanfaatkan layer cache)
COPY backend/package*.json ./
RUN npm ci

# Copy source backend
COPY backend/tsconfig.json ./
COPY backend/src ./src
COPY backend/prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript
RUN npm run build

# ─────────────────────────────────────────
# Stage 2: Runner — image production
# ─────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Copy semua node_modules dari builder (termasuk tsx untuk seed)
COPY --from=builder /app/node_modules ./node_modules
COPY backend/package*.json ./

# Copy compiled app
COPY --from=builder /app/dist ./dist

# Copy prisma (schema + migrations + seed.ts)
COPY backend/prisma ./prisma

# Copy openapi.yaml — dibaca backend saat runtime
# path: path.resolve(__dirname, '../../docs/openapi.yaml')
# __dirname di prod = /app/dist/src → ../../docs = /app/docs
COPY docs ./docs

# Folder upload gambar (di-mount sebagai volume)
RUN mkdir -p /app/uploads

# Entrypoint script
COPY backend/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
