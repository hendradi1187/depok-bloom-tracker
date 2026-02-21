# Flora Depok 🌿

**Sistem Katalog Tanaman Hias Kota Depok**

Aplikasi web untuk katalogisasi, pencarian, dan pemantauan tanaman hias di wilayah Kota Depok. Dilengkapi scanner QR/barcode, peta interaktif, dashboard admin, dan cetak label tanaman.

---

## Teknologi

| Layer | Stack |
|-------|-------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui |
| Backend | Fastify + TypeScript + Prisma ORM |
| Database | PostgreSQL 16 |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Maps | Leaflet.js |
| Charts | Recharts |
| Testing | Vitest + MSW v2 + @testing-library/react |
| Deployment | Docker + GitHub Actions (CI/CD) |

---

## Fitur

- **Katalog Tanaman** — List, search, filter per kategori, pagination
- **Scanner QR/Barcode** — Scan via kamera atau input manual, lookup otomatis
- **Peta Interaktif** — Marker lokasi tanaman seluruh Kota Depok (Leaflet)
- **Cetak Label QR** — Label branded dengan logo Kota Depok untuk tiap tanaman
- **Admin Dashboard** — CRUD tanaman & pengguna, statistik scan, export CSV
- **Statistik** — Bar chart scan harian, pie chart per kategori (Recharts)
- **Manajemen User** — Role: `admin` | `officer` | `public`

---

## Struktur Proyek

```
depok-bloom-tracker/
├── src/                    # Frontend React
│   ├── components/         # UI components (shadcn + custom)
│   ├── hooks/              # React Query hooks per resource
│   ├── pages/              # Halaman utama & admin
│   ├── context/            # AuthContext (JWT global state)
│   ├── lib/                # api.ts (fetch client)
│   ├── types/              # TypeScript types
│   └── test/               # Test frontend (MSW + hooks)
├── backend/
│   ├── src/
│   │   ├── routes/         # Fastify route handlers
│   │   ├── services/       # Business logic layer
│   │   ├── schemas/        # Zod validation schemas
│   │   ├── middleware/     # JWT auth middleware
│   │   └── __tests__/      # Unit & integration tests
│   └── prisma/             # Schema, migrasi, seeder
├── docs/
│   ├── openapi.yaml        # OpenAPI 3.1 spec (single source of truth)
│   └── todolist.md         # Progress pengembangan
├── .github/workflows/      # CI/CD GitHub Actions
├── docker-compose.yml      # Orkestrasi Docker
├── Dockerfile              # Frontend multi-stage build
├── backend/Dockerfile      # Backend multi-stage build
└── nginx.conf              # Reverse proxy + SPA routing
```

---

## Menjalankan Lokal

### Prasyarat
- Node.js 20+
- PostgreSQL 16

### 1. Clone & install

```bash
git clone https://github.com/hendradi1187/depok-bloom-tracker.git
cd depok-bloom-tracker

# Frontend
npm install

# Backend
cd backend && npm install
```

### 2. Setup database

```bash
# Sesuaikan DATABASE_URL di backend/.env
cp backend/.env.example backend/.env

# Jalankan migrasi + seed
cd backend
npx prisma migrate dev
npx tsx prisma/seed.ts
```

### 3. Jalankan

```bash
# Terminal 1 — Backend (http://localhost:3000)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:8080)
npm run dev
```

### Akun default

| Email | Password | Role |
|-------|----------|------|
| admin@depok.go.id | admin123 | admin |
| petugas@depok.go.id | petugas123 | officer |

---

## API Documentation

Swagger UI tersedia di **http://localhost:3000/api/docs** saat backend berjalan.

Endpoint utama:

| Method | Path | Keterangan |
|--------|------|-----------|
| POST | `/api/auth/login` | Login, return JWT |
| GET | `/api/plants` | List tanaman (search, filter, paginate) |
| GET | `/api/plants/barcode/:barcode` | Lookup untuk scanner |
| GET | `/api/categories` | List kategori + jumlah tanaman |
| GET | `/api/stats/summary` | Total tanaman, scan, user |
| POST | `/api/upload/plant-image` | Upload gambar tanaman |

---

## Testing

```bash
# Backend (32 tests: unit + integration + OpenAPI validation)
cd backend && npx vitest run

# Frontend (7 tests: hooks + MSW)
npm run test
```

---

## Deployment dengan Docker

```bash
# 1. Copy dan edit environment
cp .env.docker .env
# Edit: POSTGRES_PASSWORD, JWT_SECRET, CORS_ORIGIN

# 2. Build & jalankan semua service
docker compose up -d --build

# 3. Akses
# Aplikasi  → http://localhost
# Adminer   → http://localhost:8081
```

### CI/CD

Push ke `main` secara otomatis:
1. **CI** — Lint, build, dan test (frontend + backend)
2. **Docker** — Build dan push image ke GitHub Container Registry (GHCR)

```
ghcr.io/hendradi1187/depok-bloom-tracker-backend:latest
ghcr.io/hendradi1187/depok-bloom-tracker-frontend:latest
```

---

## Lisensi

Dikembangkan untuk **Pemerintah Kota Depok** — Hendra Dinata,S.KOM.
