# Todolist Pengembangan — Flora Depok

> Sistem Katalog Tanaman Hias Kota Depok
> Terakhir diperbarui: 2026-02-21

---

## Status Legenda

| Simbol | Arti |
|--------|------|
| ✅ | Selesai |
| 🔄 | Sedang dikerjakan |
| ⏳ | Belum dimulai |
| 🔗 | Bergantung pada task lain |

---

## FASE 1 — Desain OpenAPI Spec (Backend Contract)

> Tentukan kontrak API terlebih dahulu agar frontend dan backend bisa berkembang paralel.

- ✅ **1.1** Buat file `docs/openapi.yaml` menggunakan spesifikasi OpenAPI 3.1
- ✅ **1.2** Definisikan schema komponen utama:
  - `Plant` (id, barcode, common_name, latin_name, category, description, care_guide, location, supplier, created_at, images)
  - `ScanRecord` (id, user_id, plant_id, scanned_at, location)
  - `User` (id, name, email, role: admin|officer|public)
  - `Category` (id, name, count)
  - `AuthToken` (access_token, expires_in)
- ✅ **1.3** Definisikan semua endpoint (lihat Fase 3)
- ✅ **1.4** Tambahkan contoh request/response pada setiap endpoint
- ✅ **1.5** Setup Swagger UI lokal via `@fastify/swagger-ui` (tersedia di `/api/docs`)

---

## FASE 2 — Setup Backend Project

- ✅ **2.1** Inisialisasi project backend di `backend/` (monorepo)
  - Stack: **Node.js + Fastify + TypeScript**
- ✅ **2.2** Install dependensi utama:
  - `fastify`, `@fastify/swagger`, `@fastify/swagger-ui`, `@fastify/cors`, `@fastify/helmet`, `@fastify/multipart`, `@fastify/static`
  - `prisma`, `@prisma/client`, `zod`, `jsonwebtoken`, `bcryptjs`, `yaml`, `dotenv`
- ✅ **2.3** Setup TypeScript config (`tsconfig.json`)
- ⏳ **2.4** Setup linting dan formatting (ESLint + Prettier) — opsional, skip untuk sekarang
- ✅ **2.5** Buat struktur folder backend:
  ```
  backend/
  ├── src/
  │   ├── routes/       ✅ auth, plant, category, scan, upload, stats
  │   ├── services/     ✅ auth, plant, scan
  │   ├── middleware/   ✅ auth (JWT + role guard)
  │   ├── schemas/      ✅ plant, auth, scan (Zod)
  │   └── index.ts      ✅ Entry point Fastify
  ├── prisma/
  │   ├── schema.prisma ✅
  │   └── seed.ts       ✅
  └── package.json      ✅
  ```
- ✅ **2.6** Konfigurasi environment variables (`.env.example` + `.env`)

---

## FASE 3 — Database & ORM

- ✅ **3.1** Database: **PostgreSQL** (lokal)
- ✅ **3.2** Buat `prisma/schema.prisma` dengan model: `Plant`, `Category`, `User`, `ScanRecord`, `PlantImage`
- ⏳ **3.3** Jalankan migrasi database awal — **sesuaikan `DATABASE_URL` di `.env` dulu**
- ✅ **3.4** Buat seeder data awal dari `mockData.ts` yang ada di frontend
- ✅ **3.5** Prisma Client sudah di-generate dan digunakan di layer service

---

## FASE 4 — Implementasi Endpoint API

Semua endpoint harus terdokumentasi di `openapi.yaml` sebelum diimplementasi.

### 4.1 Auth (`/api/auth`)
- ✅ `POST /api/auth/login` — Login, return JWT
- ✅ `POST /api/auth/logout` — Invalidate token
- ✅ `GET  /api/auth/me` — Get profil user yang sedang login

### 4.2 Tanaman (`/api/plants`)
- ✅ `GET    /api/plants` — List semua tanaman (support: `search`, `category`, `page`, `limit`)
- ✅ `POST   /api/plants` — Tambah tanaman baru _(admin only)_
- ✅ `GET    /api/plants/:id` — Detail tanaman by ID
- ✅ `PUT    /api/plants/:id` — Update tanaman _(admin only)_
- ✅ `DELETE /api/plants/:id` — Hapus tanaman _(admin only)_
- ✅ `GET    /api/plants/barcode/:barcode` — Cari tanaman by barcode (untuk Scanner)

### 4.3 Kategori (`/api/categories`)
- ✅ `GET  /api/categories` — List semua kategori + jumlah tanaman

### 4.4 Scan (`/api/scans`)
- ✅ `POST /api/scans` — Catat scan baru
- ✅ `GET  /api/scans` — Riwayat scan _(admin/officer only)_
- ✅ `GET  /api/scans/stats` — Statistik scan (per hari/minggu/bulan)

### 4.5 Upload Gambar (`/api/upload`)
- ✅ `POST /api/upload/plant-image` — Upload gambar tanaman, return URL _(admin only)_

### 4.6 Statistik (`/api/stats`)
- ✅ `GET /api/stats/summary` — Total tanaman, scan, kategori, user aktif

### 4.7 User Management (`/api/users`) _(admin only)_
- ✅ `GET    /api/users` — List user
- ✅ `POST   /api/users` — Tambah user baru
- ✅ `PUT    /api/users/:id` — Update user (role, status)
- ✅ `DELETE /api/users/:id` — Hapus user

---

## FASE 5 — Integrasi Frontend dengan API

- ✅ **5.1** Setup base API client — `src/lib/api.ts` (fetch + JWT header otomatis, `VITE_API_URL`)
- ✅ **5.2** Buat `src/types/api.ts` — shared TypeScript types (Plant, Category, ScanRecord, User, dll)
- ✅ **5.3** Buat custom hooks per resource:
  - `src/hooks/usePlants.ts` — list, detail, barcode lookup, CRUD mutations
  - `src/hooks/useCategories.ts`
  - `src/hooks/useScans.ts` + `useStatsSummary`
  - `src/hooks/useLoginMutation.ts`
- ✅ **5.4** Ganti semua `MOCK_*` di halaman dengan data dari API:
  - ✅ `Index.tsx` — stats & featured plants & recent scans
  - ✅ `Catalog.tsx` — list tanaman + search/filter + skeleton loading
  - ✅ `PlantDetail.tsx` — detail tanaman by ID + loading state
  - ✅ `Scanner.tsx` — lookup barcode ke API + catat scan otomatis
  - ✅ `admin/Dashboard.tsx` — stats, tabel tanaman, delete fungsi
  - ✅ `MapView.tsx` — markers dari API (lat/lng dari DB)
- ✅ **5.5** Implementasi halaman Login (koneksi ke `POST /api/auth/login`, JWT di localStorage)
- ✅ **5.6** Route guard `RequireAuth` — redirect ke `/login` jika belum auth, cek role admin
- ✅ **5.7** `AuthContext` — global auth state, login/logout, isAdmin, isOfficer
- ✅ **5.8** Form Tambah/Edit Tanaman di admin (`PlantFormSheet`) — Sheet dengan validasi Zod, toast Sonner

---

## FASE 6 — Fitur Tambahan

- ✅ **6.1** Pagination pada halaman Catalog dan tabel admin (Dashboard)
- ✅ **6.2** Tampilkan gambar tanaman nyata — PlantCard sudah render `plant.images[0]`
- ✅ **6.3** Halaman Statistik admin (`/admin/stats`) — BarChart scan harian + PieChart kategori (Recharts)
- ✅ **6.4** Halaman User Management (`/admin/users`) — CRUD pengguna, toggle aktif, role
- ✅ **6.5** Koordinat tanaman dari database — MapView pakai `plant.latitude/longitude` dari API (fallback ke lookup tabel)
- ✅ **6.6** Export data ke CSV di admin dashboard (tombol Export CSV, BOM UTF-8)
- ✅ **6.7** Toast notification untuk aksi CRUD (Sonner: tambah, edit, hapus tanaman & pengguna)

---

## FASE 7 — Testing

- ⏳ **7.1** Unit test backend (route + service layer) dengan Vitest/Jest
- ⏳ **7.2** Integration test endpoint API
- ⏳ **7.3** Validasi OpenAPI spec otomatis dengan `swagger-parser`
- ⏳ **7.4** Frontend: test hooks dengan MSW (Mock Service Worker) untuk mock API

---

## FASE 8 — Deployment

- ✅ **8.1** Buat `docker-compose.yml` (app + postgres + adminer)
- ✅ **8.2** Setup environment production (`NODE_ENV=production`, `.env.docker`)
- ✅ **8.3** Konfigurasi CORS untuk domain production (via `CORS_ORIGIN` env var)
- ✅ **8.4** Setup CI/CD (GitHub Actions: lint → test → build → Docker push ke GHCR)
- ✅ **8.5** Serve Swagger UI di `/api/docs` (production read-only via `OPENAPI_PATH`)

---

## Urutan Pengerjaan yang Disarankan

```
1.1 → 1.2 → 1.3 → 1.4    ← Spec dulu sebelum kode
         ↓
2.1 → 2.2 → 2.5 → 2.6    ← Setup project backend
         ↓
3.1 → 3.2 → 3.3 → 3.4    ← Database & seeder
         ↓
4.1 → 4.2 → 4.3 → 4.4    ← Implement endpoint
         ↓
5.1 → 5.2 → 5.3 → 5.4    ← Integrasi frontend
         ↓
5.5 → 5.6 → 5.7           ← Auth & admin
         ↓
6.x → 7.x → 8.x           ← Polish & deploy
```

---

## Catatan Teknis

- **OpenAPI Spec** disimpan di `docs/openapi.yaml` — menjadi satu sumber kebenaran (single source of truth)
- **Frontend types** di-generate otomatis dari spec, bukan ditulis manual
- **JWT** disimpan di `httpOnly cookie` untuk keamanan (bukan localStorage)
- **Role**: `admin` (full access), `officer` (scan & view), `public` (view only, no auth)
- Gunakan `VITE_API_URL=http://localhost:3000` di `.env.local` untuk development
