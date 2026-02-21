# ─────────────────────────────────────────
# Stage 1: Builder — build React app
# ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy seluruh source frontend
COPY . .

# Build arg: URL API (kosong = pakai relative URL via nginx proxy)
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

# Build production bundle
RUN npm run build

# ─────────────────────────────────────────
# Stage 2: Runner — serve via Nginx
# ─────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Copy hasil build React ke nginx html root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy konfigurasi nginx (SPA routing + API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
